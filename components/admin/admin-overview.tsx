"use client"

import { useEffect, useState } from "react"
import { BriefcaseBusinessIcon, Clock3Icon, CreditCardIcon, UsersIcon } from "lucide-react"
import { getAdminOverview, type AdminOverviewData } from "@/lib/api"

const items = [
  ["totalUsers", "Registered users", UsersIcon],
  ["totalVendors", "Vendors", BriefcaseBusinessIcon],
  ["totalCustomers", "Customers", UsersIcon],
  ["totalServices", "Services", BriefcaseBusinessIcon],
  ["pendingServices", "Pending services", Clock3Icon],
  ["totalTransactions", "Transactions", CreditCardIcon],
] as const

export default function AdminOverview({ name }: { name: string }) {
  const [data, setData] = useState<AdminOverviewData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getAdminOverview().then(setData).catch((err) => setError(err instanceof Error ? err.message : "Could not load overview."))
  }, [])

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Admin dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e] sm:text-4xl">Welcome, {name}</h1>
      <p className="mt-2 text-sm text-[#74796f]">A summary of Wedora activity.</p>
      {error ? <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(([key, label, Icon]) => (
            <article key={key} className="rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3"><p className="text-sm text-[#74796f]">{label}</p><span className="grid size-10 place-items-center rounded-lg bg-[#edf1e8] text-[#73876a]"><Icon className="size-5" /></span></div>
              <p className="mt-5 text-2xl font-semibold text-[#30362e]">{data ? data[key] : <span className="inline-block h-7 w-10 animate-pulse rounded bg-[#e1dfd5]" />}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
