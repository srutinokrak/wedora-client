"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDaysIcon, CheckCircleIcon, Clock3Icon, ClipboardListIcon } from "lucide-react"
import { getCustomerOverview, type CustomerOverviewData } from "@/lib/api"

const cards = [
  { key: "totalBookings", label: "Total bookings", icon: ClipboardListIcon },
  { key: "pendingBookings", label: "Pending bookings", icon: Clock3Icon },
  { key: "acceptedBookings", label: "Accepted bookings", icon: CalendarDaysIcon },
  { key: "rejectedBookings", label: "Rejected bookings", icon: CheckCircleIcon },
] as const

export default function CustomerOverview({ name }: { name: string }) {
  const [data, setData] = useState<CustomerOverviewData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getCustomerOverview().then(setData).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load your bookings.")
    })
  }, [])

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Customer dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e] sm:text-4xl">Welcome, {name}</h1>
      <p className="mt-2 text-sm text-[#74796f]">Here is a summary of your wedding service requests.</p>

      {error ? (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : !data ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ key }) => <div key={key} className="h-28 animate-pulse rounded-xl bg-white" />)}
        </div>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ key, label, icon: Icon }) => (
            <article key={key} className="rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#74796f]">{label}</p>
                <span className="grid size-10 place-items-center rounded-lg bg-[#edf1e8] text-[#73876a]"><Icon className="size-5" /></span>
              </div>
              <p className="mt-5 text-2xl font-semibold text-[#30362e]">{data[key]}</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-7 rounded-xl border border-[#e1dfd5] bg-white p-6">
        <h2 className="font-serif text-xl text-[#30362e]">Your bookings</h2>
        <p className="mt-2 text-sm text-[#74796f]">Review event details and keep track of vendor responses.</p>
        <Link href="/dashboard/bookings" className="mt-4 inline-flex rounded-lg bg-[#73876a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#617458]">View my bookings</Link>
      </div>
    </section>
  )
}
