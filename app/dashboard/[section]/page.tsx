import DashboardSectionPage from "@/components/dashboard-section-page"

export default async function DashboardSectionRoute({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  return <DashboardSectionPage section={section} />
}
