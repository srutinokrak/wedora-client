
"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import toast from "react-hot-toast"

import { createCustomerBooking } from "@/lib/api"
import { useSession } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function ServiceBookingPanel({
  serviceId,
  vendorId,
}: {
  serviceId: string
  vendorId: string
}) {
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
  const [eventLocation, setEventLocation] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(Date.UTC(todayYear, todayMonth - 1, 1))
  )

  const year = visibleMonth.getUTCFullYear()
  const month = visibleMonth.getUTCMonth()

  const daysInMonth = new Date(
    Date.UTC(year, month + 1, 0)
  ).getUTCDate()

  const firstWeekday = new Date(
    Date.UTC(year, month, 1)
  ).getUTCDay()

  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(visibleMonth)

  const calendarDays = Array.from(
    { length: firstWeekday + daysInMonth },
    (_, index) =>
      index < firstWeekday ? null : index - firstWeekday + 1
  )

  const previousMonthDisabled =
    year < todayYear ||
    (year === todayYear && month <= todayMonth - 1)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!eventDate) {
      toast.error("Please choose your event date from the calendar.")
      return
    }

    setSubmitting(true)

    try {
      await createCustomerBooking({
        serviceId,
        eventDate,
        eventLocation,
        message,
      })

      toast.success("Booking request sent successfully!", {
        duration: 2200,
      })

      setTimeout(() => {
        router.push("/dashboard/bookings")
      }, 2200)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit your booking request."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-serif text-2xl">
        Interested in this service?
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Send the vendor your event details to request a booking.
      </p>

      {isPending ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Checking your account...
        </p>
      ) : !session ? (
        <Button asChild className="mt-5 w-full">
          <Link
            href={`/sign-in?callbackURL=${encodeURIComponent(
              `/services/${serviceId}`
            )}`}
          >
            Sign In to Request Booking
          </Link>
        </Button>
      ) : session.user.role !== "customer" ? (
        <p className="mt-5 rounded-lg bg-muted p-3 text-sm">
          Only customer accounts can request a booking.
        </p>
      ) : session.user.id === vendorId ? (
        <p className="mt-5 rounded-lg bg-muted p-3 text-sm">
          You cannot book your own service.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Event Date */}
          <fieldset>
            <Label>Event date</Label>

            <div className="mt-2 rounded-lg border p-3">
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Previous month"
                  disabled={previousMonthDisabled}
                  onClick={() =>
                    setVisibleMonth(
                      new Date(Date.UTC(year, month - 1, 1))
                    )
                  }
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <div
                  className="flex items-center gap-2 text-sm font-medium"
                  aria-live="polite"
                >
                  <CalendarDays className="size-4" />
                  {monthLabel}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Next month"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(Date.UTC(year, month + 1, 1))
                    )
                  }
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              {/* Weekdays */}
              <div className="mt-2 grid grid-cols-7 text-center text-xs text-muted-foreground">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                  (day) => (
                    <span key={day} className="py-2">
                      {day}
                    </span>
                  )
                )}
              </div>

              {/* Calendar Dates */}
              <div className="grid grid-cols-7 gap-y-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return (
                      <span
                        key={`empty-${index}`}
                        aria-hidden="true"
                      />
                    )
                  }

                  const value = dateKey(year, month, day)
                  const selected = eventDate === value
                  const disabled = value < today

                  return (
                    <Button
                      key={value}
                      type="button"
                      variant={selected ? "default" : "ghost"}
                      size="icon"
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={new Intl.DateTimeFormat("en", {
                        dateStyle: "full",
                        timeZone: "UTC",
                      }).format(
                        new Date(Date.UTC(year, month, day))
                      )}
                      onClick={() => setEventDate(value)}
                      className="mx-auto size-9 rounded-full"
                    >
                      {day}
                    </Button>
                  )
                })}
              </div>

              {/* Selected Date */}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {eventDate
                  ? `Selected: ${new Intl.DateTimeFormat("en", {
                      dateStyle: "long",
                      timeZone: "UTC",
                    }).format(
                      new Date(`${eventDate}T00:00:00Z`)
                    )}`
                  : "Select your wedding event date"}
              </p>
            </div>
          </fieldset>

          {/* Event Location */}
          <div className="space-y-2">
            <Label htmlFor="eventLocation">
              Event location
            </Label>

            <Input
              id="eventLocation"
              required
              maxLength={160}
              value={eventLocation}
              onChange={(event) =>
                setEventLocation(event.target.value)
              }
              placeholder="City or venue"
            />
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message{" "}
              <span className="text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Textarea
              id="message"
              rows={3}
              maxLength={1000}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Share any details with the vendor"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? "Sending request..."
              : "Request booking"}
          </Button>
        </form>
      )}
    </aside>
  )
}
