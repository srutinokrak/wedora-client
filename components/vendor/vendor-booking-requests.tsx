"use client"

import { useEffect, useState } from "react"
import {
  CalendarIcon,
  MapPinIcon,
  MessageSquareIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"
import {
  getVendorBookings,
  updateVendorBookingStatus,
  type VendorBookingData,
} from "@/lib/api"

interface CustomerInfo {
  name: string
  email?: string
}

interface ServiceInfo {
  name: string
}

interface Booking {
  id: string
  customerId: string
  customerInfo?: CustomerInfo
  serviceId: string
  serviceInfo?: ServiceInfo
  eventDate: string
  eventLocation: string
  message?: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

function normalizeBooking(b: VendorBookingData): Booking {
  return {
    id: (b._id ?? b.id ?? "") as string,
    customerId: b.customerId,
    customerInfo: b.customerInfo?.name
      ? { name: b.customerInfo.name, email: b.customerInfo.email }
      : undefined,
    serviceId: b.serviceId,
    serviceInfo: b.serviceInfo?.name ? { name: b.serviceInfo.name } : undefined,
    eventDate: b.eventDate,
    eventLocation: b.eventLocation,
    message: b.message,
    status: (b.status === "cancelled"
      ? "rejected"
      : b.status) as Booking["status"],
    createdAt: b.createdAt,
  }
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  )
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

interface ActionMsg {
  id: string
  type: "success" | "error"
  text: string
}

export default function VendorBookingRequests() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [actionMsg, setActionMsg] = useState<ActionMsg | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)

  useEffect(() => {
    getVendorBookings()
      .then((data) => setBookings(data.map(normalizeBooking)))
      .catch(() =>
        setFetchError("Failed to load booking requests. Please refresh.")
      )
      .finally(() => setLoading(false))
  }, [])

  async function handleAction(bookingId: string, action: "accept" | "reject") {
    setActingId(bookingId)
    setActionMsg(null)
    try {
      const updated = await updateVendorBookingStatus(bookingId, action)
      // Optimistically update UI
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? normalizeBooking(updated) : b))
      )
      setActionMsg({
        id: bookingId,
        type: "success",
        text: `Booking ${action === "accept" ? "accepted" : "rejected"} successfully.`,
      })
    } catch (err) {
      setActionMsg({
        id: bookingId,
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update booking.",
      })
    } finally {
      setActingId(null)
    }
  }

  if (loading) {
    return (
      <section>
        <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
        <h1 className="mt-2 font-serif text-3xl text-[#30362e]">
          Booking Requests
        </h1>
        <div className="mt-7 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-1/3 rounded bg-[#e1dfd5]" />
              <div className="mt-3 h-3 w-1/2 rounded bg-[#e1dfd5]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-[#e1dfd5]" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (fetchError) {
    return (
      <section>
        <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
        <h1 className="mt-2 font-serif text-3xl text-[#30362e]">
          Booking Requests
        </h1>
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">{fetchError}</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">
        Booking Requests
      </h1>

      {bookings.length === 0 ? (
        <div className="mt-7 rounded-xl border border-dashed border-[#d6dbd0] bg-white p-10 text-center">
          <p className="text-sm text-[#74796f]">No booking requests yet.</p>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#30362e]">
                    {booking.customerInfo?.name ??
                      `Customer #${booking.customerId.slice(-6)}`}
                  </p>
                  <p className="mt-0.5 text-sm text-[#829778]">
                    {booking.serviceInfo?.name ??
                      `Service #${booking.serviceId.slice(-6)}`}
                  </p>
                </div>
                {statusBadge(booking.status)}
              </div>

              <div className="mt-3 grid gap-1.5 text-sm text-[#74796f] sm:grid-cols-2">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="size-4 text-[#9aaf90]" />
                  {formatDate(booking.eventDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-[#9aaf90]" />
                  {booking.eventLocation}
                </span>
              </div>

              {booking.message && (
                <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-[#f7f6f1] p-3 text-sm text-[#74796f]">
                  <MessageSquareIcon className="mt-0.5 size-4 shrink-0 text-[#9aaf90]" />
                  <p className="line-clamp-3">{booking.message}</p>
                </div>
              )}

              {/* Action message */}
              {actionMsg?.id === booking.id && (
                <p
                  className={`mt-3 text-xs ${actionMsg.type === "success" ? "text-green-700" : "text-red-600"}`}
                >
                  {actionMsg.text}
                </p>
              )}

              {/* Accept / Reject buttons — only for pending */}
              {booking.status === "pending" && (
                <div className="mt-4 flex gap-2 border-t border-[#f0ede7] pt-4">
                  <button
                    onClick={() => handleAction(booking.id, "accept")}
                    disabled={actingId === booking.id}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <CheckIcon className="size-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(booking.id, "reject")}
                    disabled={actingId === booking.id}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    <XIcon className="size-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
