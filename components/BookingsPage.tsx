import { useEffect, useMemo, useState } from "react"
import { Search, Filter, Loader2, XCircle } from "lucide-react"

import { Button } from "./Button"
import { Modal } from "./Modal"

export type Booking = {
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
  customer_email?: string | null
  instagram_handle?: string | null
  notes?: string | null
  status: string
  stripe_session_id?: string | null
  created_at: string
}

const ukCities = ["London", "Manchester", "Birmingham", "Leeds", "Sheffield", "Bradford"]
const ngCities = ["Lagos"]

type Props = {
  onRefreshPending?: () => void
}

export default function BookingsPage({ onRefreshPending }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [status, setStatus] = useState("all")
  const [country, setCountry] = useState("all")
  const [city, setCity] = useState("all")
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selected, setSelected] = useState<Booking | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const limit = 20

  const cities = useMemo(() => {
    if (country === "UK") return ukCities
    if (country === "Nigeria") return ngCities
    return [...ukCities, ...ngCities]
  }, [country])

  useEffect(() => {
    fetchBookings(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, country, city, startDate, endDate])

  const queryString = (pageNum: number) => {
    const params = new URLSearchParams()
    params.set("page", String(pageNum))
    params.set("limit", String(limit))
    if (status !== "all") params.set("status", status)
    if (country !== "all") params.set("country", country)
    if (city !== "all") params.set("city", city)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    if (search) params.set("search", search)
    return params.toString()
  }

  async function fetchBookings(pageNum: number) {
    setLoading(true)
    setError(null)
    try {
      const qs = queryString(pageNum)
      const res = await fetch(`/api/bookings?${qs}`, { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load bookings")
      setBookings(data.bookings || [])
      setPage(pageNum)
      setHasMore((data.bookings || []).length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    await fetchBookings(1)
  }

  async function cancelBooking(ref: string) {
    setCancelLoading(true)
    try {
      const res = await fetch(`/api/bookings/${ref}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update booking")
      setSelected(data.booking)
      await fetchBookings(page)
      onRefreshPending?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking")
    } finally {
      setCancelLoading(false)
    }
  }

  const formatMoney = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "GBP",
      minimumFractionDigits: currency === "NGN" ? 0 : 2,
    }).format((amount || 0) / 100)

  const formatDate = (value: string) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Bookings</p>
          <h2 className="text-2xl text-foreground">Manage client bookings</h2>
          <p className="text-sm text-muted-foreground">Filter, search, and review confirmed and pending bookings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-border bg-card px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search reference, name, phone"
              className="bg-transparent text-sm focus:outline-none"
            />
          </div>
          <Button variant="gold" onClick={handleSearch} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Country</label>
          <select
            value={country}
            onChange={(e) => {
              const val = e.target.value
              setCountry(val)
              setCity("all")
            }}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All</option>
            <option value="UK">UK</option>
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-36 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-36 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing page {page}</span>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => fetchBookings(page - 1)}
            >
              Prev
            </Button>
            <Button variant="ghost" size="sm" disabled={!hasMore || loading} onClick={() => fetchBookings(page + 1)}>
              Next
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/40">
              <tr>
                {["Created", "Reference", "Package", "Date", "Time", "Location", "Client", "Status", "Paid"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr
                  key={b.reference}
                  className="hover:bg-muted/40 cursor-pointer"
                  onClick={() => setSelected(b)}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">{formatDate(b.created_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-primary">{b.reference}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{b.package_name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{b.appointment_date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{b.time_window}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {b.country} • {b.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {b.customer_name}
                    <div className="text-xs text-muted-foreground">{b.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        b.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">
                    {formatMoney(b.amount_paid, b.currency)}
                  </td>
                </tr>
              ))}
              {!bookings.length && !loading && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={9}>
                    No bookings match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Booking Details" size="lg">
        {selected ? (
          <div className="space-y-4 p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Reference" value={selected.reference} />
              <Info label="Status" value={selected.status.toUpperCase()} />
              <Info label="Package" value={`${selected.package_name} (${selected.package_id})`} />
              <Info label="Payment" value={`${selected.pay_type} • ${formatMoney(selected.amount_paid, selected.currency)}`} />
              <Info label="Stripe Session" value={selected.stripe_session_id || "—"} />
              <Info label="Appointment" value={`${selected.appointment_date} • ${selected.time_window}`} />
              <Info label="Location" value={`${selected.country}, ${selected.city}`} />
              <Info label="Client" value={`${selected.customer_name} • ${selected.customer_phone}`} />
              <Info label="Email" value={selected.customer_email || "—"} />
              <Info label="Instagram" value={selected.instagram_handle || "—"} />
              <Info label="Created" value={formatDate(selected.created_at)} />
            </div>
            {selected.notes && (
              <div className="rounded-lg bg-muted/40 p-3 text-sm text-foreground">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-line">{selected.notes}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Close
              </Button>
              {selected.status !== "cancelled" && (
                <Button
                  variant="danger"
                  onClick={() => cancelBooking(selected.reference)}
                  disabled={cancelLoading}
                  className="flex items-center gap-2"
                >
                  {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Mark Cancelled
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground break-words">{value}</p>
    </div>
  )
}
