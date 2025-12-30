import { sql } from "@vercel/postgres"

export type BookingRow = {
  id: number
  reference: string
  package_id: string
  package_name: string
  currency: string
  amount_paid: number
  pay_type: string
  appointment_date: string
  time_window: string
  country: string
  city: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  instagram_handle: string | null
  notes: string | null
  status: string
  stripe_session_id: string | null
  created_at: string
}

type ListParams = {
  status?: string
  country?: string
  city?: string
  search?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export async function listBookings(params: ListParams) {
  const {
    status,
    country,
    city,
    search,
    startDate,
    endDate,
    limit = 20,
    offset = 0,
  } = params

  const conditions = []

  if (status && status !== "all") conditions.push(sql`status = ${status}`)
  if (country && country !== "all") conditions.push(sql`country = ${country}`)
  if (city && city !== "all") conditions.push(sql`city = ${city}`)
  if (startDate) conditions.push(sql`appointment_date::date >= ${startDate}`)
  if (endDate) conditions.push(sql`appointment_date::date <= ${endDate}`)

  if (search) {
    const pattern = `%${search}%`
    conditions.push(
      sql`(reference ILIKE ${pattern} OR customer_name ILIKE ${pattern} OR customer_phone ILIKE ${pattern})`,
    )
  }

  const joiner: any =
    conditions.length === 0
      ? null
      : (sql as any).join
        ? (sql as any).join(conditions, sql` AND `)
        : (conditions as any[]).reduce<any>((acc, curr, idx) => (idx === 0 ? curr : sql`${acc} AND ${curr}`), sql``)

  const where: any = joiner ? sql`WHERE ${joiner}` : sql``

  const result = await sql<BookingRow>`
    SELECT *
    FROM bookings
    ${where as any}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return result.rows
}

export async function getBookingByReference(reference: string) {
  const res = await sql<BookingRow>`
    SELECT *
    FROM bookings
    WHERE reference = ${reference}
    LIMIT 1
  `
  return res.rows[0] || null
}

export async function countPendingBookings() {
  const res = await sql`SELECT COUNT(*)::int AS count FROM bookings WHERE status = 'pending'`
  return (res.rows[0] as any)?.count as number
}

export async function cancelBooking(reference: string) {
  const res = await sql<BookingRow>`
    UPDATE bookings
    SET status = 'cancelled'
    WHERE reference = ${reference}
    RETURNING *
  `
  return res.rows[0] || null
}

export { sql }
