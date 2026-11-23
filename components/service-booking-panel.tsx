"use client"

import { useCallback, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createCustomerBooking } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { Toast } from "@/components/toast"

export function ServiceBookingPanel({ serviceId, vendorId }: { serviceId: string; vendorId: string }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [eventDate, setEventDate] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const closeToast = useCallback(() => setFeedback(""), [])
  const closeErrorToast = useCallback(() => setError(""), [])
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setFeedback("")
    try {
      await createCustomerBooking({ serviceId, eventDate, eventLocation, message })
      setFeedback("Booking request sent. Opening your bookings…")
      setEventDate("")
      setEventLocation("")
      setMessage("")
      window.setTimeout(() => router.push("/dashboard/bookings"), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your booking request.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="rounded-xl border border-[#e1dfd5] bg-white p-6 shadow-sm">
      <Toast message={feedback} onClose={closeToast} />
      <Toast message={error} type="error" onClose={closeErrorToast} />
      <h2 className="font-serif text-2xl text-[#30362e]">Interested in this service?</h2>
      <p className="mt-2 text-sm leading-6 text-[#74796f]">Send the vendor your event details to request a booking.</p>

      {isPending ? <p className="mt-5 text-sm text-[#74796f]">Checking your account...</p> : !session ? (
        <Link href={`/sign-in?callbackURL=${encodeURIComponent(`/services/${serviceId}`)}`} className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#9aaf90] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#829a78]">Sign In to Request Booking</Link>
      ) : session.user.role !== "customer" ? (
        <p className="mt-5 rounded-lg bg-[#f2f3ed] p-3 text-sm text-[#65705f]">Only customer accounts can request a booking.</p>
      ) : session.user.id === vendorId ? (
        <p className="mt-5 rounded-lg bg-[#f2f3ed] p-3 text-sm text-[#65705f]">You cannot book your own service.</p>
      ) : (
        <form onSubmit={submitBooking} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-[#52604b]">
            Event date
            <input type="date" required min={today} value={eventDate} onChange={(event) => setEventDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#d9ddd3] px-3 py-2.5 font-normal text-[#30362e] outline-none focus:border-[#829778]" />
          </label>
          <label className="block text-sm font-medium text-[#52604b]">
            Event location
            <input required maxLength={160} value={eventLocation} onChange={(event) => setEventLocation(event.target.value)} placeholder="City or venue" className="mt-1.5 w-full rounded-lg border border-[#d9ddd3] px-3 py-2.5 font-normal text-[#30362e] outline-none focus:border-[#829778]" />
          </label>
          <label className="block text-sm font-medium text-[#52604b]">
            Message <span className="font-normal text-[#858980]">(optional)</span>
            <textarea rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share any details with the vendor" className="mt-1.5 w-full resize-y rounded-lg border border-[#d9ddd3] px-3 py-2.5 font-normal text-[#30362e] outline-none focus:border-[#829778]" />
          </label>
          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#73876a] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#617458] disabled:cursor-wait disabled:opacity-60">{submitting ? "Sending request…" : "Request booking"}</button>
        </form>
      )}
    </aside>
  )
}
