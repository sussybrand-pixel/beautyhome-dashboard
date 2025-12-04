import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SITE_ORIGIN } from "@/lib/api";

const defaultSettings = {
  admin: {
    username: "emma ville academy",
    // bcrypt hash for ChristisKing8
    passwordHash: "$2a$10$jAqm0vQ9d3JongjNrqUgc.EL4Ntwaz0U0Olqo7AXlTCv9oughtdw2",
  },
  profile: {
    name: "Admin",
    email: "admin@emmavilleacademy.com",
    role: "Administrator",
  },
  general: {
    siteName: "Emmaville Academy",
    tagline: "Excellence in Education",
    phone: "+2348186281225",
    address: "BX4 3RD Avenue, Federal Housing Estate, Port Harcourt, Nigeria",
    website: "https://www.emmavilleacademy.com",
    email: "emmavilleacademy@gmail.com",
  },
};

async function getSettings() {
  try {
    const res = await fetch(`${SITE_ORIGIN}/api/content/settings`, { cache: "no-store" });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Settings fetch failed: ${res.status} ${msg}`);
    }
    return res.json();
  } catch (err) {
    console.error("Settings GET error; using defaults", err);
    return defaultSettings;
  }
}

async function saveSettings(body: any) {
  const res = await fetch(`${SITE_ORIGIN}/api/content/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Unable to save settings (status ${res.status})`);
  }
  return res.json();
}

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const incoming = await req.json();
    const current = await getSettings();

    // Merge profile/general
    const next = {
      ...current,
      profile: { ...current?.profile, ...incoming.profile },
      general: { ...current?.general, ...incoming.general },
      admin: { ...current?.admin },
    };

    // Handle admin updates
    if (incoming.admin?.username) {
      next.admin.username = incoming.admin.username;
    }
    if (incoming.admin?.newPassword) {
      const hash = await bcrypt.hash(incoming.admin.newPassword, 10);
      next.admin.passwordHash = hash;
    }

    await saveSettings(next);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save settings" },
      { status: 500 },
    );
  }
}
