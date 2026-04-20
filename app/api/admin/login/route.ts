import { NextResponse } from "next/server";
import {
  checkAdminPassword,
  checkWardPassword,
  createSession,
} from "@/lib/auth";
import { WARDS } from "@/lib/wards";

export const runtime = "nodejs";

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path },
  });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const ward = String(form.get("ward") ?? "");

  if (ward === "__admin") {
    if (!checkAdminPassword(password)) return redirectTo("/admin/login?error=1");
    await createSession({ role: "admin" });
    return redirectTo("/admin");
  }

  if (!WARDS.includes(ward as (typeof WARDS)[number])) {
    return redirectTo("/admin/login?error=1");
  }
  if (!checkWardPassword(ward, password)) {
    return redirectTo("/admin/login?error=1");
  }
  await createSession({ role: "ward", ward });
  return redirectTo("/admin");
}
