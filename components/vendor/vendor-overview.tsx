"use client"

import { useEffect, useState } from "react"
import {
  PackageIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarCheckIcon,
  CrownIcon,
} from "lucide-react"
import { vendorFetch } from "@/lib/api"

interface VendorOverviewData {
  totalServices: number
  activeServices: number
  pendingRequests: number
  acceptedBookings: number
  subscriptionPlan: string
}

function SkeletonCard() {
  return (
    <article className="animate-pulse rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-28 rounded bg-[#e1dfd5]" />
        <div className="size-10 rounded-lg bg-[#edf1e8]" />
      </div>
      <div className="mt-5 h-7 w-16 rounded bg-[#e1dfd5]" />
    </article>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#74796f]">{label}</p>
        <span className="grid size-10 place-items-center rounded-lg bg-[#edf1e8] text-[#73876a]">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold text-[#30362e]">{value}</p>
    </article>
  )
}

export default function VendorOverview() {
  const [data, setData] = useState<VendorOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    vendorFetch("/vendor/overview")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json() as Promise<VendorOverviewData>
      })
      .then(setData)
      .catch(() => setError("Failed to load overview data. Please refresh."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section>
        <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
        <h1 className="mt-2 font-serif text-3xl text-[#30362e] sm:text-4xl">Overview</h1>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
        <h1 className="mt-2 font-serif text-3xl text-[#30362e]">Overview</h1>
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </section>
    )
  }

  if (!data) return null

  const isPremium = data.subscriptionPlan === "premium"

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e] sm:text-4xl">Overview</h1>
      <p className="mt-2 text-sm text-[#74796f]">
        Here is a summary of your vendor activity.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value={data.totalServices} icon={PackageIcon} />
        <StatCard label="Active Services" value={data.activeServices} icon={CheckCircleIcon} />
        <StatCard label="Pending Booking Requests" value={data.pendingRequests} icon={ClockIcon} />
        <StatCard label="Accepted Bookings" value={data.acceptedBookings} icon={CalendarCheckIcon} />

        {/* Subscription plan card */}
        <article className="rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#74796f]">Current Plan</p>
            <span className="grid size-10 place-items-center rounded-lg bg-[#edf1e8] text-[#73876a]">
              <CrownIcon className="size-5" />
            </span>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <p className="text-2xl font-semibold text-[#30362e]">
              {isPremium ? "Premium" : "Free"}
            </p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isPremium
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#edf1e8] text-[#65775d]"
              }`}
            >
              {isPremium ? "Premium Plan" : "Free Plan"}
            </span>
          </div>
        </article>
      </div>
    </section>
  )
}
