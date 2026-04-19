import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Registration } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PDF_DIR = path.join(DATA_DIR, "pdfs");
const DB_FILE = path.join(DATA_DIR, "registrations.json");

async function ensureDirs() {
  await fs.mkdir(PDF_DIR, { recursive: true });
}

async function readAll(): Promise<Registration[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as Registration[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(rows: Registration[]) {
  await ensureDirs();
  await fs.writeFile(DB_FILE, JSON.stringify(rows, null, 2));
}

export async function listRegistrations(): Promise<Registration[]> {
  return readAll();
}

export async function createRegistration(
  data: Omit<Registration, "id" | "createdAt" | "pdfFile" | "signedAt">,
  pdfBytes: Uint8Array,
): Promise<Registration> {
  await ensureDirs();
  const id = randomUUID();
  const pdfFile = `${id}.pdf`;
  await fs.writeFile(path.join(PDF_DIR, pdfFile), pdfBytes);

  const row: Registration = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    signedAt: new Date().toISOString(),
    pdfFile,
  };
  const rows = await readAll();
  rows.push(row);
  await writeAll(rows);
  return row;
}

export async function readPdf(pdfFile: string): Promise<Uint8Array> {
  const safe = path.basename(pdfFile);
  return fs.readFile(path.join(PDF_DIR, safe));
}
