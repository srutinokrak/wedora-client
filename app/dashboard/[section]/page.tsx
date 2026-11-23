import DashboardSectionPage from "@/components/dashboard-section-page"
import { VendorPaymentReturn } from "@/components/vendor/vendor-payment-return"

export default async function DashboardSectionRoute({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const [{ section }, { session_id: sessionId }] = await Promise.all([params, searchParams])
  if (section === "payment-success") return <VendorPaymentReturn sessionId={sessionId} />
  if (section === "payment-cancel") return <VendorPaymentReturn sessionId={sessionId} cancelled />
  return <DashboardSectionPage section={section} />
}
