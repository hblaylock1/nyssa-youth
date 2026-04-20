import { NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";

export const runtime = "nodejs";

function redirectTo(path: string) {
  // Use a relative Location so the browser resolves against the request's
  // public URL (otherwise new URL(path, req.url) picks up the internal
  // host:port when behind a reverse proxy).
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path },
  });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    return redirectTo("/admin/login?error=1");
  }
  await createSession();
  return redirectTo("/admin");
}
