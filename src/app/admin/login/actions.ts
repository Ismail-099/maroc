"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

function tokenFor(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function login(formData: FormData) {
  const pwd = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || pwd !== expected) {
    redirect("/admin/login?error=1");
  }
  cookies().set("admin_session", tokenFor(expected), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/");
}
