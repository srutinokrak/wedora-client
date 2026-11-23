"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  CalendarDaysIcon,
  ChartNoAxesColumnIncreasingIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
  WalletCardsIcon,
  XIcon,
} from "lucide-react"

import { WedPlanLogo } from "@/components/wedplan-logo"
import { useSession, signOut } from "@/lib/auth-client"

type UserRole = "customer" | "vendor" | "admin"

const navigationByRole = {
  customer: [
    { section: "overview", label: "Overview", icon: LayoutDashboardIcon },
    { section: "bookings", label: "My Bookings", icon: CalendarDaysIcon },
  ],
  vendor: [
    { section: "overview", label: "Overview", icon: LayoutDashboardIcon },
    { section: "services", label: "My Services", icon: PackageIcon },
    { section: "add-service", label: "Add Service", icon: ChartNoAxesColumnIncreasingIcon },
    { section: "requests", label: "Booking Requests", icon: CalendarDaysIcon },
    { section: "subscription", label: "Subscription", icon: CreditCardIcon },
  ],
  admin: [
    { section: "overview", label: "Overview", icon: LayoutDashboardIcon },
    { section: "users", label: "Manage Users", icon: UsersIcon },
    { section: "services", label: "Manage Services", icon: PackageIcon },
    { section: "transactions", label: "Transactions", icon: WalletCardsIcon },
  ],
} satisfies Record<
  UserRole,
  { section: string; label: string; icon: typeof LayoutDashboardIcon }[]
>

function isUserRole(role: unknown): role is UserRole {
  return role === "customer" || role === "vendor" || role === "admin"
}

function DashboardLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f6f1]">
      <p className="text-sm text-[#74796f]">Loading your dashboard...</p>
    </main>
  )
}

function DashboardAccessDenied() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f6f1] px-4">
      <div className="max-w-md rounded-xl border border-[#e1dfd5] bg-white p-8 text-center">
        <h1 className="font-serif text-2xl text-[#30362e]">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-[#74796f]">
          This account does not have a supported WedPlan role.
        </p>
        <Link href="/" className="mt-5 inline-block text-sm font-medium text-[#65775d]">
          Return home
        </Link>
      </div>
    </main>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending || !session) {
    return <DashboardLoading />
  }

  const role = session.user.role
  if (!isUserRole(role)) {
    return <DashboardAccessDenied />
  }

  const navigation = navigationByRole[role]
  const name = session.user.name || "WedPlan User"

  async function handleSignOut() {
    await signOut()
    router.replace("/")
    router.refresh()
  }

  function renderNavigation() {
    return (
      <>
        <div className="border-b border-[#e1dfd5] px-5 py-5">
          <WedPlanLogo light />
        </div>

        <div className="border-b border-[#e1dfd5] px-5 py-4">
          <p className="truncate text-sm font-semibold text-[#30362e]">{name}</p>
          <p className="mt-1 text-xs capitalize text-[#829778]">{role} account</p>
        </div>

        <nav aria-label="Dashboard navigation" className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const href =
              item.section === "overview" ? "/dashboard" : `/dashboard/${item.section}`
            const active = pathname === href

            return (
              <Link
                key={item.section}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#e7ecdf] font-medium text-[#43513e]"
                    : "text-[#65705f] hover:bg-[#eef0e9]"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}

          <Link
            href="/profile-settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#65705f] transition-colors hover:bg-[#eef0e9]"
          >
            <SettingsIcon className="size-4" aria-hidden="true" />
            Profile Settings
          </Link>
        </nav>

        <div className="border-t border-[#e1dfd5] p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#65705f] transition-colors hover:bg-[#eef0e9]"
          >
            Sign out
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f6f1] lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#e1dfd5] bg-white lg:flex">
        {renderNavigation()}
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[#e1dfd5] bg-white px-4 sm:px-6 lg:justify-end">
          <Link href="/" className="font-serif text-lg italic text-[#30362e] lg:hidden">
            WedPlan
          </Link>
          <p className="hidden text-sm text-[#74796f] lg:block">
            Wedding planning workspace
          </p>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close dashboard menu" : "Open dashboard menu"}
            aria-expanded={mobileMenuOpen}
            className="grid size-10 place-items-center rounded-lg border border-[#e1dfd5] text-[#52604b] lg:hidden"
          >
            {mobileMenuOpen ? (
              <XIcon className="size-5" aria-hidden="true" />
            ) : (
              <MenuIcon className="size-5" aria-hidden="true" />
            )}
          </button>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/20 lg:hidden">
            <aside className="flex h-full w-72 flex-col bg-white shadow-xl">
              {renderNavigation()}
            </aside>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 -z-10 cursor-default"
              aria-label="Close dashboard menu"
            />
          </div>
        )}

        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  )
}
