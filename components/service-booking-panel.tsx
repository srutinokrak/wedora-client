"use client"

import { useCallback, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { createCustomerBooking } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { Toast } from "@/components/toast"

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function ServiceBookingPanel({ serviceId, vendorId }: { serviceId: string; vendorId: string }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
  const [todayYear, todayMonth] = today.split("-").map(Number)
  const [eventDate, setEventDate] = useState("")
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(Date.UTC(todayYear, todayMonth - 1, 1))
  )
  const [eventLocation, setEventLocation] = useState("")
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const closeToast = useCallback(() => setFeedback(""), [])
  const closeErrorToast = useCallback(() => setError(""), [])
  const year = visibleMonth.getUTCFullYear()
  const month = visibleMonth.getUTCMonth()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(visibleMonth)
  const calendarDays = Array.from({ length: firstWeekday + daysInMonth }, (_, index) =>
    index < firstWeekday ? null : index - firstWeekday + 1
  )
  const previousMonthDisabled =
    year < todayYear || (year === todayYear && month <= todayMonth - 1)

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!eventDate) {
      setError("Choose your event date from the calendar.")
      return
    }
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
          <fieldset>
            <legend className="text-sm font-medium text-[#52604b]">Event date</legend>
            <div className="mt-2 rounded-lg border border-[#d9ddd3] p-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={previousMonthDisabled}
                  onClick={() =>
                    setVisibleMonth(new Date(Date.UTC(year, month - 1, 1)))
                  }
                  className="grid size-9 place-items-center rounded-lg text-[#52604b] hover:bg-[#f2f3ed] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon className="size-4" aria-hidden="true" />
                </button>
                <p className="flex items-center gap-2 text-sm font-medium text-[#30362e]" aria-live="polite">
                  <CalendarDaysIcon className="size-4 text-[#829778]" aria-hidden="true" />
                  {monthLabel}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() =>
                    setVisibleMonth(new Date(Date.UTC(year, month + 1, 1)))
                  }
                  className="grid size-9 place-items-center rounded-lg text-[#52604b] hover:bg-[#f2f3ed]"
                >
                  <ChevronRightIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-7 text-center text-xs text-[#858980]">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <span key={day} className="py-2" aria-hidden="true">{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <span key={`empty-${index}`} aria-hidden="true" />
                  }
                  const value = dateKey(year, month, day)
                  const selected = eventDate === value
                  const disabled = value < today
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={new Intl.DateTimeFormat("en", {
                        dateStyle: "full",
                        timeZone: "UTC",
                      }).format(new Date(Date.UTC(year, month, day)))}
                      onClick={() => {
                        setEventDate(value)
                        setError("")
                      }}
                      className={`mx-auto grid size-9 place-items-center rounded-full text-sm transition-colors ${
                        selected
                          ? "bg-[#73876a] font-medium text-white"
                          : disabled
                            ? "cursor-not-allowed text-[#c5c7c0]"
                            : "text-[#30362e] hover:bg-[#edf1e8]"
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 min-h-5 text-center text-xs text-[#65705f]">
                {eventDate
                  ? `Selected: ${new Intl.DateTimeFormat("en", {
                      dateStyle: "long",
                      timeZone: "UTC",
                    }).format(new Date(`${eventDate}T00:00:00Z`))}`
                  : "Select your wedding event date"}
              </p>
            </div>
          </fieldset>
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
