import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { listBookings } from "@/lib/db"
import { COOKIE_NAME, verifySession } from "@/lib/auth"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(req: Request) {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!verifySession(token)) return unauthorized()

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || undefined
  const country = searchParams.get("country") || undefined
  const city = searchParams.get("city") || undefined
  const search = searchParams.get("search") || undefined
  const startDate = searchParams.get("startDate") || undefined
  const endDate = searchParams.get("endDate") || undefined
  const page = Number(searchParams.get("page") || "1")
  const limit = Number(searchParams.get("limit") || "20")
  const offset = (page - 1) * limit

  try {
    const bookings = await listBookings({
      status,
      country,
      city,
      search,
      startDate,
      endDate,
      limit,
      offset,
    })
    return NextResponse.json({ bookings, page, limit })
  } catch (error) {
    console.error("List bookings error", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
