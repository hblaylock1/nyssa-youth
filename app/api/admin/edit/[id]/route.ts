import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  listRegistrations,
  updateRegistration,
  type EditableFields,
} from "@/lib/storage";
import { TSHIRT_SIZES, WARDS } from "@/lib/wards";

export const runtime = "nodejs";

const REQUIRED: (keyof EditableFields)[] = [
  "youthFirstName",
  "youthLastName",
  "youthBirthdate",
  "youthGender",
  "ward",
  "tshirtSize",
  "address",
  "city",
  "state",
  "parentName",
  "parentEmail",
  "parentPhone",
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const existing = (await listRegistrations()).find((r) => r.id === id);
  if (!existing) return new NextResponse("Not found", { status: 404 });
  if (session.role === "ward" && existing.ward !== session.ward) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let body: Partial<EditableFields>;
  try {
    body = (await req.json()) as Partial<EditableFields>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  for (const key of REQUIRED) {
    const v = body[key];
    if (typeof v !== "string" || v.trim() === "") {
      return new NextResponse(`Missing required field: ${key}`, { status: 400 });
    }
  }
  if (!WARDS.includes(body.ward as (typeof WARDS)[number])) {
    return new NextResponse("Invalid ward", { status: 400 });
  }
  if (!TSHIRT_SIZES.includes(body.tshirtSize as (typeof TSHIRT_SIZES)[number])) {
    return new NextResponse("Invalid t-shirt size", { status: 400 });
  }
  // Ward users cannot move records out of their ward.
  if (session.role === "ward" && body.ward !== session.ward) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const bool = (v: unknown) => v === true;

  const patch: Partial<EditableFields> = {
    youthFirstName: body.youthFirstName!,
    youthLastName: body.youthLastName!,
    youthBirthdate: body.youthBirthdate!,
    youthGender: body.youthGender!,
    ward: body.ward!,
    tshirtSize: body.tshirtSize!,
    address: body.address!,
    city: body.city!,
    state: body.state!,
    hasAllergies: bool(body.hasAllergies),
    allergies: str(body.allergies),
    medications: str(body.medications),
    specialDiet: bool(body.specialDiet),
    dietExplanation: str(body.dietExplanation),
    selfAdminMeds: bool(body.selfAdminMeds),
    recentSurgery: bool(body.recentSurgery),
    surgeryExplanation: str(body.surgeryExplanation),
    chronicIllness: bool(body.chronicIllness),
    illnessExplanation: str(body.illnessExplanation),
    otherLimitations: str(body.otherLimitations),
    specialNeeds: str(body.specialNeeds),
    parentName: body.parentName!,
    parentEmail: body.parentEmail!,
    parentPhone: body.parentPhone!,
  };

  const updated = await updateRegistration(id, patch);
  if (!updated) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json({ ok: true });
}
