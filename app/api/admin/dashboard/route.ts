import { NextResponse } from "next/server";
import { SITE_ORIGIN } from "@/lib/api";

const sections = ["home", "about", "services", "packages", "portfolio", "contact", "settings"];

export async function GET() {
  const payload: {
    sections: { id: string; lastModified: string | null }[];
    imagesCount: number;
    status: { online: boolean; lastUpdated: string | null; version: string | null };
  } = {
    sections: [],
    imagesCount: 0,
    status: { online: false, lastUpdated: null, version: null },
  };

  // Pull content for sections
  let latest: string | null = null;
  for (const section of sections) {
    try {
      const res = await fetch(`${SITE_ORIGIN}/api/content/${section}`, { cache: "no-store" });
      if (!res.ok) {
        const now = new Date().toISOString();
        payload.sections.push({ id: section, lastModified: now });
        if (!latest || now > latest) latest = now;
        continue;
      }
      const data = await res.json();
      const lm = data?._lastModified || new Date().toISOString();
      payload.sections.push({ id: section, lastModified: lm });
      if (section === "portfolio" && Array.isArray(data?.items)) {
        payload.imagesCount = data.items.length;
      }
      if (lm && (!latest || lm > latest)) latest = lm;
    } catch {
      const now = new Date().toISOString();
      payload.sections.push({ id: section, lastModified: now });
      if (!latest || now > latest) latest = now;
    }
  }

  // Status: simple HEAD to site
  try {
    const res = await fetch(SITE_ORIGIN, { method: "HEAD" });
    payload.status.online = res.ok;
  } catch {
    payload.status.online = false;
  }
  payload.status.lastUpdated = latest;

  return NextResponse.json(payload);
}
