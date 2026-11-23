"use client"

import { useSession } from "@/lib/auth-client"
import VendorOverview from "@/components/vendor/vendor-overview"

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) return null

  const role = session.user.role
  if (role === "vendor") return <VendorOverview />
  if (role !== "customer" && role !== "admin") return null

  const name = session.user.name || "there"
  return (
    <section>
      <p className="text-sm font-medium capitalize text-[#829778]">{role} dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e] sm:text-4xl">
        Welcome, {name}
      </h1>
      <p className="mt-2 text-sm text-[#74796f]">
        Here is an overview of your wedding planning activity.
      </p>

      <div className="mt-6 rounded-xl border border-[#e1dfd5] bg-white p-6">
        <h2 className="font-serif text-xl text-[#30362e]">Getting started</h2>
        <p className="mt-2 text-sm leading-6 text-[#74796f]">
          Use the dashboard navigation to access the tools available for your account.
          Detailed services, bookings, and reports will be connected in their implementation
          steps.
        </p>
      </div>
    </section>
  )
}
