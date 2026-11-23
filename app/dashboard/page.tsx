"use client"

import { useSession } from "@/lib/auth-client"
import VendorOverview from "@/components/vendor/vendor-overview"
import CustomerOverview from "@/components/customer/customer-overview"
import AdminOverview from "@/components/admin/admin-overview"

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) return null

  const role = session.user.role
  if (role === "vendor") return <VendorOverview />
  if (role === "customer") return <CustomerOverview name={session.user.name || "there"} />
  if (role === "admin") return <AdminOverview name={session.user.name || "there"} />
  return null
}
