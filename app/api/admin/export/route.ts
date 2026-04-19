import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { listRegistrations } from "@/lib/storage";

export const runtime = "nodejs";

const COLUMNS: { key: keyof Awaited<ReturnType<typeof listRegistrations>>[number]; label: string }[] = [
  { key: "createdAt", label: "Registered at" },
  { key: "ward", label: "Ward" },
  { key: "youthFirstName", label: "Youth first" },
  { key: "youthLastName", label: "Youth last" },
  { key: "youthBirthdate", label: "Birthdate" },
  { key: "youthGender", label: "Gender" },
  { key: "tshirtSize", label: "Shirt" },
  { key: "allergies", label: "Allergies" },
  { key: "medicalNotes", label: "Medical" },
  { key: "parentName", label: "Parent" },
  { key: "parentEmail", label: "Parent email" },
  { key: "parentPhone", label: "Parent phone" },
  { key: "emergencyName", label: "Emergency contact" },
  { key: "emergencyPhone", label: "Emergency phone" },
  { key: "signatureName", label: "Signed by" },
  { key: "signedAt", label: "Signed at" },
];

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  if (!(await isAuthed())) return new NextResponse("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const ward = url.searchParams.get("ward");
  const rows = (await listRegistrations())
    .filter((r) => !ward || r.ward === ward)
    .sort((a, b) => a.ward.localeCompare(b.ward) || a.youthLastName.localeCompare(b.youthLastName));

  const header = COLUMNS.map((c) => csvEscape(c.label)).join(",");
  const body = rows
    .map((r) => COLUMNS.map((c) => csvEscape(r[c.key])).join(","))
    .join("\n");
  const csv = `${header}\n${body}\n`;

  const name = ward ? `nys-${ward}.csv` : "nys-all.csv";
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
    },
  });
}
