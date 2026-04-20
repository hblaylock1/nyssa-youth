import { promises as fs } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import type { NewRegistration } from "./types";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "parental_or_guardian_permission_medical_release.pdf",
);

// Edit these once the event details are finalized; they flow into the
// corresponding fields of every generated permission slip.
const EVENT_INFO = {
  event: "Nyssa Youth Spectacular",
  datesOfEvent: "",
  description: "",
  stake: "",
  leader: "",
  leaderPhone: "",
  leaderEmail: "",
};

export async function buildSignedPdf(data: NewRegistration): Promise<Uint8Array> {
  const signaturePng = dataUrlToBytes(data.signatureDataUrl);
  const templateBytes = await fs.readFile(TEMPLATE_PATH);
  const pdf = await PDFDocument.load(templateBytes);

  // The form is page 1; page 2 is instructions only — drop it.
  while (pdf.getPageCount() > 1) pdf.removePage(1);

  const form = pdf.getForm();
  const today = new Date().toLocaleDateString();

  const setText = (name: string, value: string) => {
    try {
      form.getTextField(name).setText(value);
    } catch {
      // field missing in this template version — skip
    }
  };
  const setCheck = (name: string, checked: boolean) => {
    try {
      const f = form.getCheckBox(name);
      if (checked) f.check();
      else f.uncheck();
    } catch {
      // skip
    }
  };

  setText("Event", EVENT_INFO.event);
  setText("Dates of event", EVENT_INFO.datesOfEvent);
  setText("Event description", EVENT_INFO.description);
  setText("Ward", data.ward);
  setText("Stake", EVENT_INFO.stake);
  setText("Event or activity leader", EVENT_INFO.leader);
  setText("Event or activity leaders phone number", EVENT_INFO.leaderPhone);
  setText("Event or activity leaders email", EVENT_INFO.leaderEmail);

  setText("Participant", `${data.youthFirstName} ${data.youthLastName}`);
  setText("Date of birth", data.youthBirthdate);
  setText("Age", calcAge(data.youthBirthdate));
  setText("Telephone number", data.parentPhone);
  setText("Emergency contact parent or guardian", data.parentName);
  setText("Primary phone_1", data.parentPhone);
  setText("Secondary phone_1", data.emergencyPhone);

  const allergies = (data.allergies ?? "").trim();
  setCheck("Allergies", allergies.length > 0);
  setText("Allergy explanation", allergies);
  setText("List of Medications", data.medicalNotes ?? "");

  setText("Date", today);
  setText("Date_2", today);

  // Stamp the drawn signature image on top of the parent/guardian signature
  // field. We leave the field text empty and flatten afterwards so the image
  // is the visible signature.
  const sigImage = await pdf.embedPng(signaturePng);
  stampSignature(
    pdf,
    form,
    "Parent or guardians signature if participant is a minor",
    sigImage,
  );

  form.flatten();
  return pdf.save();
}

function stampSignature(
  pdf: PDFDocument,
  form: ReturnType<PDFDocument["getForm"]>,
  fieldName: string,
  image: Awaited<ReturnType<PDFDocument["embedPng"]>>,
) {
  try {
    const field = form.getTextField(fieldName);
    const widget = field.acroField.getWidgets()[0];
    if (!widget) return;
    const rect = widget.getRectangle();
    const page = pdf.getPages()[0];
    const padding = 2;
    const boxW = Math.max(rect.width - padding * 2, 1);
    const boxH = Math.max(rect.height - padding * 2, 1);
    const dims = image.scaleToFit(boxW, boxH);
    page.drawImage(image, {
      x: rect.x + (rect.width - dims.width) / 2,
      y: rect.y + (rect.height - dims.height) / 2,
      width: dims.width,
      height: dims.height,
    });
  } catch {
    // field missing — skip stamping
  }
}

function calcAge(birthdate: string): string {
  const d = new Date(birthdate);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return String(age);
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Uint8Array.from(Buffer.from(b64, "base64"));
}
