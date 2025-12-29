// Point the dashboard to the live BeautyHomeBySuzain site APIs
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://beautyhomebysuzain.com";
export const BASE = `${SITE_ORIGIN}/api/content`;
export const UPLOAD_BASE = `${SITE_ORIGIN}/api/upload`;

// Blob storage (for JSON + media)
const BLOB_BUCKET = process.env.NEXT_PUBLIC_BLOB_BUCKET || "susan-makeup-artist-website-blob";
export const BLOB_BASE =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL || `https://${BLOB_BUCKET}.public.blob.vercel-storage.com`;
const BLOB_TOKEN =
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

const hasBlob = Boolean(BLOB_BASE && BLOB_TOKEN);

function blobUrl(key: string) {
  const trimmed = key.startsWith("/") ? key.slice(1) : key;
  const encoded = encodeURI(trimmed);
  return `${BLOB_BASE}/${encoded}?token=${encodeURIComponent(BLOB_TOKEN || "")}`;
}

// Helper to prefix relative asset paths with the site origin
export function withSite(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) return `${SITE_ORIGIN}/${path}`;
  return `${SITE_ORIGIN}${path}`;
}

export async function getSection(section: string) {
  // Try live API first
  try {
    const res = await fetch(`${BASE}/${section}`, { cache: "no-store" });
    if (res.ok) return res.json();
  } catch {
    /* ignore and fall back */
  }

  // Fallback to blob
  if (hasBlob) {
    const res = await fetch(blobUrl(`content/${section}.json`), { cache: "no-store" });
    if (res.ok) return res.json();
  }
  // If nothing exists yet, return an empty scaffold so the dashboard can save it
  return defaultSection(section);
}

export async function updateSection(section: string, data: any) {
  // Prefer blob for persistence when available
  if (hasBlob) {
    const res = await fetch(blobUrl(`content/${section}.json`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json().catch(() => data);
    // if blob write fails, fall back to API
  }

  const res = await fetch(`${BASE}/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = "Failed to update section";
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
      if (body?.detail) msg += `: ${body.detail}`;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function uploadImage(file: File) {
  // Try direct blob upload when configured
  if (hasBlob) {
    const key = `media/${Date.now()}-${file.name}`;
    const url = blobUrl(key);
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Upload failed");
    }
    return { url: `${BLOB_BASE}/${key}` };
  }

  // Fall back to site upload API
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(UPLOAD_BASE, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Upload failed");
  }
  return res.json();
}

function defaultSection(section: string) {
  switch (section) {
    case "home":
      return {
        hero: { eyebrow: "", title: "", subtitle: "", slides: [] },
        highlights: [],
      };
    case "services":
      return { hero: { title: "", subtitle: "" }, services: [] };
    case "packages":
      return { packages: [] };
    case "about":
      return {
        about: { title: "", tagline: "", bio: "", travelNote: "", image: "", imageAlt: "" },
        locations: [],
        training: [],
      };
    case "portfolio":
      return { items: [] };
    case "contact":
      return {
        phone: "",
        whatsapp: "",
        whatsappLink: "",
        email: "",
        social: { instagram: "", facebook: "" },
        ctaLabel: "",
        ctaLink: "",
        address: { lines: [] },
        travelNote: "",
      };
    default:
      return {};
  }
}
