"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDaysIcon, MapPinIcon } from "lucide-react"
import { useCallback } from "react"
import { cancelCustomerBooking, getCustomerBookings, type CustomerBookingData } from "@/lib/api"
import { Toast } from "@/components/toast"

type Booking = CustomerBookingData & { bookingId: string; title: string; image: string; vendor: string }

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function statusClass(status: string) {
  if (status === "accepted") return "bg-green-100 text-green-700"
  if (status === "rejected") return "bg-red-100 text-red-700"
  if (status === "cancelled") return "bg-gray-100 text-gray-600"
  return "bg-amber-100 text-amber-700"
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [cancellingId, setCancellingId] = useState("")
  const closeMessageToast = useCallback(() => setMessage(""), [])
  const closeErrorToast = useCallback(() => setError(""), [])

  useEffect(() => {
    getCustomerBookings()
      .then((items) => setBookings(items.map((booking) => ({
        ...booking,
        bookingId: booking._id ?? booking.id ?? "",
        title: booking.serviceInfo?.serviceName ?? booking.serviceInfo?.name ?? booking.serviceName ?? "Wedding service",
        image: booking.serviceInfo?.images?.[0] ?? booking.serviceInfo?.image ?? booking.serviceImage ?? "",
        vendor: booking.vendorInfo?.name ?? booking.vendorName ?? "WedPlan vendor",
      }))))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your bookings."))
      .finally(() => setLoading(false))
  }, [])

  async function cancelBooking(bookingId: string) {
    setCancellingId(bookingId)
    setError("")
    setMessage("")
    try {
      await cancelCustomerBooking(bookingId)
      setBookings((current) => current.map((booking) => booking.bookingId === bookingId ? { ...booking, status: "cancelled" } : booking))
      setMessage("Your booking request was cancelled.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel this booking.")
    } finally {
      setCancellingId("")
    }
  }

  return (
    <section>
      <Toast message={message} onClose={closeMessageToast} />
      <Toast message={error} type="error" onClose={closeErrorToast} />
      <p className="text-sm font-medium text-[#829778]">Customer dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e] sm:text-4xl">My Bookings</h1>
      <p className="mt-2 text-sm text-[#74796f]">Your requests and event details in one place.</p>

      {loading ? (
        <div className="mt-7 space-y-4">{[1, 2].map((item) => <div key={item} className="h-36 animate-pulse rounded-xl bg-white" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="mt-7 rounded-xl border border-dashed border-[#d6dbd0] bg-white p-10 text-center">
          <h2 className="font-serif text-xl text-[#30362e]">No booking requests yet</h2>
          <p className="mt-2 text-sm text-[#74796f]">When you request a service, you can follow its progress here.</p>
          <Link href="/services" className="mt-4 inline-flex rounded-lg bg-[#73876a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#617458]">Explore services</Link>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {bookings.map((booking) => (
            <article key={booking.bookingId} className="overflow-hidden rounded-xl border border-[#e1dfd5] bg-white shadow-sm sm:flex">
              {booking.image ? (
                <div className="relative h-44 sm:h-auto sm:w-48 sm:shrink-0">
                  <Image src={booking.image} alt={booking.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 192px" unoptimized />
                </div>
              ) : <div className="h-32 bg-[#edf1e8] sm:h-auto sm:w-48 sm:shrink-0" aria-hidden="true" />}
              <div className="flex-1 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-xl text-[#30362e]">{booking.title}</h2>
                    <p className="mt-1 text-sm text-[#74796f]">Provided by {booking.vendor}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass(booking.status)}`}>{booking.status}</span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-[#74796f] sm:grid-cols-2">
                  <p className="flex items-center gap-2"><CalendarDaysIcon className="size-4 text-[#829778]" />Event: {formatDate(booking.eventDate)}</p>
                  <p className="flex items-center gap-2"><MapPinIcon className="size-4 text-[#829778]" />{booking.eventLocation}</p>
                  <p className="sm:col-span-2">Requested {formatDate(booking.createdAt)}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 border-t border-[#f0ede7] pt-4">
                  <Link href={`/services/${booking.serviceId}`} className="text-sm font-medium text-[#65775d] hover:underline">View details</Link>
                  {booking.status === "pending" && (
                    <button type="button" onClick={() => cancelBooking(booking.bookingId)} disabled={cancellingId === booking.bookingId} className="text-sm font-medium text-red-600 hover:underline disabled:opacity-60">
                      {cancellingId === booking.bookingId ? "Cancelling…" : "Cancel request"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
