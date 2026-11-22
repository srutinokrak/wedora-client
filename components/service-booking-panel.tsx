"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"

export function ServiceBookingPanel({ serviceId }: { serviceId: string }) {
  const { data: session, isPending } = useSession()

  return (
    <aside className="rounded-xl border border-[#e1dfd5] bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl text-[#30362e]">Interested in this service?</h2>
      <p className="mt-2 text-sm leading-6 text-[#74796f]">
        Booking requests are for customer accounts. Sign in to continue.
      </p>

      {isPending ? (
        <p className="mt-5 text-sm text-[#74796f]">Checking your account...</p>
      ) : !session ? (
        <Link
          href={`/sign-in?callbackURL=${encodeURIComponent(`/services/${serviceId}`)}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#9aaf90] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#829a78]"
        >
          Sign In to Request Booking
        </Link>
      ) : session.user.role === "customer" ? (
        <p className="mt-5 rounded-lg bg-[#f2f3ed] p-3 text-sm text-[#65705f]">
          You are signed in as a customer. Booking requests will be available here soon.
        </p>
      ) : (
        <p className="mt-5 rounded-lg bg-[#f2f3ed] p-3 text-sm text-[#65705f]">
          Only customer accounts can request a booking.
        </p>
      )}
    </aside>
  )
}
