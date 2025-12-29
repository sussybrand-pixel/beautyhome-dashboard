import { NextResponse } from "next/server"

const BLOB_BUCKET = process.env.NEXT_PUBLIC_BLOB_BUCKET || process.env.BLOB_BUCKET || "susan-makeup-artist-website-blob"
const BLOB_BASE =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL || process.env.BLOB_BASE_URL || `https://${BLOB_BUCKET}.public.blob.vercel-storage.com`
const BLOB_TOKEN =
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN

function blobUrl() {
  return `${BLOB_BASE}/content/settings.json`
}

const defaultSettings = {
  profile: { name: "BeautyHome Admin", email: "admin@beautyhomebysuzain.com", role: "Administrator" },
  admin: { username: "beautyhome admin" },
  general: {
    siteName: "BeautyHomeBySuzain",
    tagline: "Luxury Bridal & Glam Makeup Artist",
    phone: "+44 7523 992614",
    email: "admin@beautyhomebysuzain.com",
    address: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford | Travel Worldwide",
    website: "https://beautyhomebysuzain.com",
  },
}

export async function GET() {
  try {
    const res = await fetch(blobUrl(), { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch {
    /* ignore and return defaults */
  }
  return NextResponse.json(defaultSettings)
}

export async function PUT(req: Request) {
  if (!BLOB_TOKEN) {
    return NextResponse.json({ error: "Blob token not configured" }, { status: 500 })
  }
  const payload = await req.json().catch(() => null)
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  try {
    const res = await fetch(blobUrl(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLOB_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(text || "Failed to save settings")
    }
    return NextResponse.json(payload)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save settings" },
      { status: 500 },
    )
  }
}
