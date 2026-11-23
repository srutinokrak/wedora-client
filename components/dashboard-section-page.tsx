"use client"

import Link from "next/link"

import VendorAddService from "@/components/vendor/vendor-add-service"
import VendorBookingRequests from "@/components/vendor/vendor-booking-requests"
import VendorMyServices from "@/components/vendor/vendor-my-services"
import VendorSubscription from "@/components/vendor/vendor-subscription"
import CustomerBookings from "@/components/customer/customer-bookings"
import AdminUsers from "@/components/admin/admin-users"
import AdminServices from "@/components/admin/admin-services"
import AdminTransactions from "@/components/admin/admin-transactions"
import { useSession } from "@/lib/auth-client"

const sectionTitles: Record<string, string> = {
  bookings: "My Bookings",
  users: "Manage Users",
  transactions: "Transactions",
  "add-service": "Add Service",
  requests: "Booking Requests",
  subscription: "Premium Plan",
}

const sectionsByRole: Record<string, string[]> = {
  customer: ["bookings"],
  vendor: ["services", "add-service", "requests", "subscription"],
  admin: ["users", "services", "transactions"],
}

export default function DashboardSectionPage({ section }: { section: string }) {
  const { data: session, isPending } = useSession()

  if (isPending || !session) return null

  const role = session.user.role
  if (role !== "customer" && role !== "vendor" && role !== "admin") {
    return null
  }

  const title =
    section === "services"
      ? role === "admin"
        ? "Manage Services"
        : "My Services"
      : sectionTitles[section]

  if (!title || !sectionsByRole[role]?.includes(section)) {
    return (
      <section>
        <h1 className="font-serif text-3xl text-[#30362e]">Page unavailable</h1>
        <p className="mt-2 text-sm text-[#74796f]">
          This page is not available for your account.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-[#65775d] hover:underline"
        >
          Back to overview
        </Link>
      </section>
    )
  }

  if (role === "customer" && section === "bookings") return <CustomerBookings />

  if (role === "vendor") {
    if (section === "services") return <VendorMyServices />
    if (section === "add-service") return <VendorAddService />
    if (section === "requests") return <VendorBookingRequests />
    if (section === "subscription") return <VendorSubscription />
  }

  if (role === "admin") {
    if (section === "users") return <AdminUsers />
    if (section === "services") return <AdminServices />
    if (section === "transactions") return <AdminTransactions />
  }

  return (
    <section>
      <p className="text-sm font-medium capitalize text-[#829778]">{role} dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">{title}</h1>
      <div className="mt-6 rounded-xl border border-dashed border-[#d6dbd0] bg-white p-8">
        <p className="text-sm leading-6 text-[#74796f]">
          This section is ready for its dashboard feature and data to be implemented.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-medium text-[#65775d] hover:underline"
        >
          Back to overview
        </Link>
      </div>
    </section>
  )
}
