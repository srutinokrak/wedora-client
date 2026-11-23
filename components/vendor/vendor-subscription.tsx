"use client"

import { useEffect, useState } from "react"
import { CheckIcon, CrownIcon, ZapIcon } from "lucide-react"
import {
  cancelVendorSubscription,
  createVendorSubscriptionCheckout,
  getVendorOverview,
} from "@/lib/api"

const PREMIUM_PRICE_CENTS = 2900

const FREE_FEATURES = [
  "Max 3 Active Services",
  "Basic Dashboard",
  "Booking Request Management",
]

const PREMIUM_FEATURES = [
  "Unlimited Active Services",
  "Premium Vendor Badge ⭐",
  "Priority in Search Results",
  "All Free Features",
  "Billed monthly; cancel any time",
]

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-[#4a5744]">
      <CheckIcon className="mt-0.5 size-4 shrink-0 text-[#9aaf90]" />
      {text}
    </li>
  )
}

export default function VendorSubscription() {
  const [plan, setPlan] = useState<string | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [upgradeMsg, setUpgradeMsg] = useState("")
  const [upgradeError, setUpgradeError] = useState("")

  useEffect(() => {
    getVendorOverview()
      .then((data) => {
        setPlan(data.subscriptionPlan ?? "free")
        setCancelAtPeriodEnd(Boolean(data.subscriptionCancelAtPeriodEnd))
        setExpiresAt(data.subscriptionExpiresAt ?? null)
      })
      .catch((err) => setUpgradeError(err instanceof Error ? err.message : "Could not load subscription details."))
      .finally(() => setLoadingPlan(false))
  }, [])

  async function handleUpgrade() {
    setUpgrading(true)
    setUpgradeMsg("")
    setUpgradeError("")
    try {
      const data = await createVendorSubscriptionCheckout(PREMIUM_PRICE_CENTS)
      if (data?.url) {
        window.location.href = data.url
      } else {
        setUpgradeMsg("Payment system not yet configured. Please check back soon.")
      }
    } catch (err) {
      setUpgradeError(err instanceof Error ? err.message : "Failed to initiate checkout.")
    } finally {
      setUpgrading(false)
    }
  }

  async function handleCancelSubscription() {
    setCancelling(true)
    setUpgradeMsg("")
    setUpgradeError("")
    try {
      const result = await cancelVendorSubscription()
      setCancelAtPeriodEnd(true)
      setUpgradeMsg(result.message)
      const data = await getVendorOverview()
      setExpiresAt(data.subscriptionExpiresAt ?? null)
    } catch (err) {
      setUpgradeError(err instanceof Error ? err.message : "Could not cancel your subscription.")
    } finally {
      setCancelling(false)
    }
  }

  const isPremium = plan === "premium"

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">Premium Plan</h1>

      {/* Current plan banner */}
      {!loadingPlan && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e1dfd5] bg-white px-4 py-3 shadow-sm">
          <CrownIcon className="size-5 text-[#829778]" />
          <p className="text-sm text-[#30362e]">
            You are currently on the{" "}
            <span className="font-semibold">
              {isPremium ? "Premium Plan" : "Free Plan"}
            </span>
            .
          </p>
          {isPremium && (
            <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {cancelAtPeriodEnd ? "Cancels at period end" : "Active"}
            </span>
          )}
        </div>
      )}
      {isPremium && expiresAt && (
        <p className="mt-2 text-sm text-[#74796f]">
          {cancelAtPeriodEnd ? "Premium access ends" : "Next renewal"}: {new Date(expiresAt).toLocaleDateString()}
        </p>
      )}

      <div className="mt-7 grid gap-5 sm:grid-cols-2 max-w-3xl">
        {/* Free Plan Card */}
        <div
          className={`rounded-xl border p-6 shadow-sm ${
            !isPremium
              ? "border-[#9aaf90] bg-[#f4f7f2]"
              : "border-[#e1dfd5] bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-serif text-xl text-[#30362e]">Free Plan</h2>
            {!isPremium && (
              <span className="rounded-full bg-[#9aaf90] px-2.5 py-0.5 text-xs font-medium text-white">
                Current Plan
              </span>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-[#30362e]">
            $0 <span className="text-sm font-normal text-[#74796f]">free</span>
          </p>

          <ul className="mt-5 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <PlanFeature key={f} text={f} />
            ))}
          </ul>

          {!isPremium && (
            <div className="mt-6 rounded-lg border border-[#d6dbd0] px-4 py-2.5 text-center text-sm text-[#65775d]">
              Your current plan
            </div>
          )}
        </div>

        {/* Premium Plan Card */}
        <div className="rounded-xl border-2 border-[#829a78] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-serif text-xl text-[#30362e]">Premium Plan</h2>
            {isPremium && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Current Plan
              </span>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-[#30362e]">
            ${(PREMIUM_PRICE_CENTS / 100).toFixed(2)}{" "}
            <span className="text-sm font-normal text-[#74796f]">per month</span>
          </p>

          <ul className="mt-5 space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <PlanFeature key={f} text={f} />
            ))}
          </ul>

          {/* Upgrade button / messages */}
          {upgradeMsg && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              {upgradeMsg}
            </div>
          )}
          {upgradeError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {upgradeError}
            </div>
          )}

          {!isPremium && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9aaf90] py-2.5 text-sm font-medium text-white hover:bg-[#829a78] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ZapIcon className="size-4" />
              {upgrading ? "Redirecting…" : "Upgrade to Premium"}
            </button>
          )}

          {isPremium && <div className="mt-6 rounded-lg border border-[#d6dbd0] px-4 py-2.5 text-center text-sm text-[#65775d]">Premium is active ✓</div>}
          {isPremium && !cancelAtPeriodEnd && (
            <button
              type="button"
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="mt-3 w-full rounded-lg border border-[#d9ddd3] py-2.5 text-sm font-medium text-[#65705f] hover:bg-[#f2f3ed] disabled:opacity-60"
            >
              {cancelling ? "Cancelling…" : "Cancel subscription"}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
