"use client"

import { usePathname } from "next/navigation"

import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <>
      {!isDashboard && <SiteNavbar />}
      <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      {!isDashboard && <SiteFooter />}
    </>
  )
}
