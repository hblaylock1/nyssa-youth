import { NextResponse } from "next/server";
import { createRegistration } from "@/lib/storage";
import { buildSignedPdf } from "@/lib/pdf";
import type { NewRegistration } from "@/lib/types";
import { WARDS, TSHIRT_SIZES } from "@/lib/wards";

export const runtime = "nodejs";

const REQUIRED: (keyof NewRegistration)[] = [
  "youthFirstName",
  "youthLastName",
  "youthBirthdate",
  "youthGender",
  "ward",
  "tshirtSize",
  "parentName",
  "parentEmail",
  "parentPhone",
  "emergencyName",
  "emergencyPhone",
  "signatureName",
  "signatureDataUrl",
];

export async function POST(req: Request) {
  let body: Partial<NewRegistration>;
  try {
    body = (await req.json()) as Partial<NewRegistration>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  for (const key of REQUIRED) {
    if (!body[key] || String(body[key]).trim() === "") {
      return new NextResponse(`Missing required field: ${key}`, { status: 400 });
    }
  }

  if (!WARDS.includes(body.ward as (typeof WARDS)[number])) {
    return new NextResponse("Invalid ward", { status: 400 });
  }
  if (!TSHIRT_SIZES.includes(body.tshirtSize as (typeof TSHIRT_SIZES)[number])) {
    return new NextResponse("Invalid t-shirt size", { status: 400 });
  }
  if (!body.signatureDataUrl!.startsWith("data:image/png")) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const data = body as NewRegistration;
  const pdfBytes = await buildSignedPdf(data);
  const row = await createRegistration(
    {
      youthFirstName: data.youthFirstName,
      youthLastName: data.youthLastName,
      youthBirthdate: data.youthBirthdate,
      youthGender: data.youthGender,
      ward: data.ward,
      tshirtSize: data.tshirtSize,
      allergies: data.allergies ?? "",
      medicalNotes: data.medicalNotes ?? "",
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,
      signatureName: data.signatureName,
    },
    pdfBytes,
  );

  return NextResponse.json({ id: row.id });
}
