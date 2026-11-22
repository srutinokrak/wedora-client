"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { useSession } from "@/lib/auth-client"
import VendorOverview from "@/components/vendor/vendor-overview"
import VendorMyServices from "@/components/vendor/vendor-my-services"
import VendorAddService from "@/components/vendor/vendor-add-service"
import VendorBookingRequests from "@/components/vendor/vendor-booking-requests"
import VendorSubscription from "@/components/vendor/vendor-subscription"

const roleLabels: Record<string, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
}

const sectionTitles: Record<string, string> = {
  bookings: "My Bookings",
  users: "Manage Users",
  transactions: "Transactions",
}

function PlaceholderSection({ role, section }: { role: string; section: string }) {
  const title = sectionTitles[section] ?? section.charAt(0).toUpperCase() + section.slice(1)
  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">{roleLabels[role] ?? role} dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">{title}</h1>
      <div className="mt-6 rounded-xl border border-dashed border-[#d6dbd0] bg-white p-8">
        <p className="text-sm leading-6 text-[#74796f]">
          This section is part of the dashboard structure. Its data and actions will be connected
          when we implement this feature.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm font-medium text-[#65775d]">
          Back to overview
        </Link>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  if (!session) return null

  const role = session.user.role
  if (role !== "customer" && role !== "vendor" && role !== "admin") {
    return null
  }

  const section = searchParams.get("section") || "overview"

  // ── Vendor sections ──────────────────────────────────────────────────────────
  if (role === "vendor") {
    if (section === "overview") return <VendorOverview />
    if (section === "services") return <VendorMyServices />
    if (section === "add-service") return <VendorAddService />
    if (section === "requests") return <VendorBookingRequests />
    if (section === "subscription") return <VendorSubscription />
    // Fallback for unknown vendor section
    return <PlaceholderSection role={role} section={section} />
  }

  // ── Customer / Admin placeholder sections ────────────────────────────────────
  if (section !== "overview") {
    return <PlaceholderSection role={role} section={section} />
  }

  // ── Default overview (customer / admin) ──────────────────────────────────────
  const name = session.user.name || "there"
  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">{roleLabels[role]} dashboard</p>
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
