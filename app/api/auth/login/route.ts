import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signSession, verifySession, COOKIE_NAME } from "@/lib/auth";
import { SITE_ORIGIN } from "@/lib/api";

const fallbackSettings = {
  admin: {
    username: "beautyhome admin",
    // bcrypt hash for GlamIsGolden8!
    passwordHash: "$2a$10$nZmwD97Pp08pqH0N5P4IT.m1toKh8rN5pzpaBvfYmqMseY6fTBfo.",
  },
};

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (verifySession(token)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const normalizedUser = typeof username === "string" ? username.trim().toLowerCase() : "";

  // Pull live admin credentials from website settings
  let admin: any = null;
  try {
    const settingsRes = await fetch(`${SITE_ORIGIN}/api/content/settings`, { cache: "no-store" });
    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      admin = settings?.admin;
    } else {
      const msg = await settingsRes.text();
      console.error("Settings fetch failed", settingsRes.status, msg);
    }
  } catch (err) {
    console.error("Settings fetch error", err);
  }

  // fallback to built-in defaults if remote unavailable
  if (!admin) {
    admin = fallbackSettings.admin;
  }

  if (!admin?.username || !admin?.passwordHash) {
    return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 });
  }

  if (normalizedUser !== String(admin.username).toLowerCase()) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signSession(admin.username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
