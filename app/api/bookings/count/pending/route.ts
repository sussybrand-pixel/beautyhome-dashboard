import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { countPendingBookings } from "@/lib/db"
import { COOKIE_NAME, verifySession } from "@/lib/auth"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!verifySession(token)) return unauthorized()

  try {
    const count = await countPendingBookings()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Pending count error", error)
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 })
  }
}
