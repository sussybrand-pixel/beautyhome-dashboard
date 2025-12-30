import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { cancelBooking, getBookingByReference } from "@/lib/db"
import { COOKIE_NAME, verifySession } from "@/lib/auth"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(_: Request, { params }: { params: { reference: string } }) {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!verifySession(token)) return unauthorized()

  const ref = params.reference
  try {
    const booking = await getBookingByReference(ref)
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Get booking error", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { reference: string } }) {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!verifySession(token)) return unauthorized()

  const ref = params.reference
  const body = await req.json().catch(() => ({}))
  if (body.status !== "cancelled") {
    return NextResponse.json({ error: "Only status=cancelled is allowed" }, { status: 400 })
  }

  try {
    const updated = await cancelBooking(ref)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error("Cancel booking error", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
