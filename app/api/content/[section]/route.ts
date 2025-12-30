import { NextResponse } from "next/server"

import { BASE, defaultSection } from "@/lib/api"

export async function GET(_: Request, { params }: { params: { section: string } }) {
  const section = params.section?.toLowerCase()
  if (!section) return NextResponse.json({ error: "Section required" }, { status: 400 })

  // 1) Try live site API
  try {
    const res = await fetch(`${BASE}/${section}`, { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { headers: cors() })
    }
  } catch {
    /* ignore */
  }

  // 2) Empty scaffold
  return NextResponse.json(defaultSection(section), { headers: cors() })
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  }
}
