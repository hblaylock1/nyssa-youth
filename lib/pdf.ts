import { promises as fs } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { NewRegistration } from "./types";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "parental_or_guardian_permission_medical_release.pdf",
);

/**
 * Build the signed PDF.
 * If public/permission-slip.pdf exists we stamp the signature + a summary page
 * onto the last page of that template; otherwise we generate a standalone
 * permission form so the site is usable before the church PDF is dropped in.
 */
export async function buildSignedPdf(data: NewRegistration): Promise<Uint8Array> {
  const signaturePng = dataUrlToBytes(data.signatureDataUrl);

  let pdf: PDFDocument;
  let hasTemplate = false;
  try {
    const templateBytes = await fs.readFile(TEMPLATE_PATH);
    pdf = await PDFDocument.load(templateBytes);
    hasTemplate = true;
  } catch {
    pdf = await PDFDocument.create();
  }

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const sigImage = await pdf.embedPng(signaturePng);

  // Always add a summary page so every field is captured even if the template
  // field coords haven't been mapped yet.
  const summary = pdf.addPage([612, 792]);
  let y = 750;
  const line = 18;
  const drawHeader = (text: string) => {
    summary.drawText(text, { x: 50, y, size: 16, font: bold, color: rgb(0, 0, 0) });
    y -= line * 1.5;
  };
  const drawRow = (label: string, value: string) => {
    summary.drawText(`${label}:`, { x: 50, y, size: 11, font: bold });
    summary.drawText(value || "—", { x: 170, y, size: 11, font, maxWidth: 380 });
    y -= line;
  };

  drawHeader("Nyssa Youth Spectacular — Registration & Permission");
  drawRow("Youth name", `${data.youthFirstName} ${data.youthLastName}`);
  drawRow("Birthdate", data.youthBirthdate);
  drawRow("Gender", data.youthGender);
  drawRow("Ward", data.ward);
  drawRow("T-shirt size", data.tshirtSize);
  drawRow("Allergies", data.allergies);
  drawRow("Medical notes", data.medicalNotes);
  y -= line / 2;
  drawRow("Parent / guardian", data.parentName);
  drawRow("Parent email", data.parentEmail);
  drawRow("Parent phone", data.parentPhone);
  drawRow("Emergency contact", data.emergencyName);
  drawRow("Emergency phone", data.emergencyPhone);

  y -= line;
  summary.drawText("Signature:", { x: 50, y, size: 11, font: bold });
  const sigDims = sigImage.scaleToFit(260, 70);
  summary.drawImage(sigImage, { x: 170, y: y - 55, width: sigDims.width, height: sigDims.height });
  summary.drawLine({
    start: { x: 170, y: y - 60 },
    end: { x: 430, y: y - 60 },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.5),
  });
  y -= 80;
  drawRow("Signed by (typed)", data.signatureName);
  drawRow("Signed at", new Date().toLocaleString());

  // If a template PDF is present, also stamp the signature onto its last page
  // so the church's permission slip carries a visible e-signature.
  if (hasTemplate) {
    const pages = pdf.getPages();
    const last = pages[pages.length - 1 - 1] ?? pages[0]; // skip summary (last)
    if (last) {
      const { width } = last.getSize();
      last.drawImage(sigImage, {
        x: width - 280,
        y: 60,
        width: 220,
        height: 60,
      });
      last.drawText(`${data.signatureName}  •  ${new Date().toLocaleDateString()}`, {
        x: width - 280,
        y: 50,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }

  return pdf.save();
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Uint8Array.from(Buffer.from(b64, "base64"));
}
