"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { WedPlanLogo } from "@/components/wedplan-logo"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/auth-client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
]

function isLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut()
    setProfileOpen(false)
    setMenuOpen(false)
    router.refresh()
    router.push("/")
  }

  const userName = session?.user?.name?.trim() || "Wedora User"
  const userInitial = userName.charAt(0).toUpperCase()
  const profileImage =
    "image" in (session?.user ?? {}) && typeof session?.user?.image === "string"
      ? session.user.image
      : null

  return (
    <header className="sticky top-0 z-50 w-full bg-[#acd67c]">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
        <nav
          aria-label="Main navigation"
          className="flex h-14 items-center justify-between rounded-2xl border border-[#cfd7c7] bg-[#dfe5d8] pr-2 pl-5 shadow-lg"
        >
          <WedPlanLogo />

          <div className="hidden items-center gap-2 lg:flex">
            <ul className="flex items-center gap-5">
              {navLinks.map((link) => {
                const active = isLinkActive(pathname, link.href)

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-2 py-1.5 text-sm transition-colors hover:text-[#30362e]",
                        active ? "font-medium text-[#30362e]" : "text-[#65705f]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mx-3 h-5 w-px bg-[#bcc7b3]" aria-hidden="true" />

            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-[#30362e] transition-colors hover:bg-[#cdd7c5]"
                >
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt=""
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold">
                      {userInitial}
                    </span>
                  )}
                  <span className="max-w-28 truncate">{userName}</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className={cn("size-4 transition-transform", profileOpen && "rotate-180")}
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-[#cfd7c7] bg-[#dfe5d8] p-2 shadow-xl"
                  >
                    <div className="border-b border-[#c5cdbd] px-3 py-2">
                      <p className="truncate text-sm font-medium text-[#30362e]">{userName}</p>
                      {session.user.email && (
                        <p className="truncate text-xs text-[#65705f]">{session.user.email}</p>
                      )}
                    </div>
                    <Link
                      role="menuitem"
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#65705f] hover:bg-[#cdd7c5] hover:text-[#30362e]"
                    >
                      <LayoutDashboardIcon className="size-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      role="menuitem"
                      href="/profile-settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#65705f] hover:bg-[#cdd7c5] hover:text-[#30362e]"
                    >
                      <SettingsIcon className="size-4" aria-hidden="true" />
                      Profile Settings
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-white/10"
                    >
                      <LogOutIcon className="size-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-[#30362e] hover:text-[#30362e]"
                  )}
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants(),
                    "rounded-xl border-[#9aaf90] bg-[#73af58] text-white hover:bg-[#628b50]"
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-[#30362e] transition-colors hover:bg-[#cdd7c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30362e] lg:hidden"
          >
            {menuOpen ? (
              <XIcon aria-hidden="true" />
            ) : (
              <MenuIcon aria-hidden="true" />
            )}
          </button>
        </nav>

        {menuOpen && (
          <div
            id="mobile-navigation"
            className="mt-2 rounded-2xl border border-[#cfd7c7] bg-[#dfe5d8] p-3 shadow-lg lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isLinkActive(pathname, link.href)

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#cdd7c5] hover:text-[#30362e]",
                        active
                          ? "bg-[#cdd7c5] font-medium text-[#30362e]"
                          : "text-[#65705f]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-3 flex flex-col gap-2 border-t border-[#c5cdbd] pt-3">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileImage}
                        alt=""
                        className="size-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold">
                        {userInitial}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#30362e]">{userName}</p>
                      {session.user.email && (
                        <p className="truncate text-xs text-[#65705f]">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#65705f] hover:bg-[#cdd7c5]"
                  >
                    <LayoutDashboardIcon className="size-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile-settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#65705f] hover:bg-[#cdd7c5]"
                  >
                    <SettingsIcon className="size-4" aria-hidden="true" />
                    Profile Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-white/10"
                  >
                    <LogOutIcon className="size-4" aria-hidden="true" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-[#30362e] hover:bg-[#cdd7c5]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      buttonVariants(),
                      "w-full rounded-xl border-[#9aaf90] bg-[#9aaf90] text-white hover:bg-[#829a78]"
                    )}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
