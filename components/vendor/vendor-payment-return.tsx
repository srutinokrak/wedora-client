"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getVendorSubscriptionPaymentStatus } from "@/lib/api"
import { useSession } from "@/lib/auth-client"

export function VendorPaymentReturn({
  sessionId,
  cancelled = false,
}: {
  sessionId?: string
  cancelled?: boolean
}) {
  const { data: session, isPending } = useSession()
  const [status, setStatus] = useState<
    "loading" | "pending" | "success" | "cancelled" | "error"
  >(cancelled ? "cancelled" : "loading")
  const [message, setMessage] = useState("")
  const accountError =
    !isPending &&
    (!session
      ? "Please sign in as a vendor to view this page."
      : session.user.role !== "vendor"
        ? "This page is for vendor accounts."
        : !cancelled && !sessionId
          ? "We could not find the payment session to verify."
          : "")
  const visibleStatus = accountError ? "error" : status

  useEffect(() => {
    if (isPending || !session || session.user.role !== "vendor") return
    if (cancelled) return
    if (!sessionId) return

    let active = true
    async function checkPaymentStatus() {
      try {
        for (let attempt = 0; attempt < 15; attempt += 1) {
          const result = await getVendorSubscriptionPaymentStatus(sessionId)
          if (!active) return
          if (result.status === "paid") {
            setMessage("Stripe confirmed your payment. Premium is active.")
            setStatus("success")
            return
          }
          if (
            result.status === "failed" ||
            result.status === "expired" ||
            result.status === "cancelled"
          ) {
            setMessage(
              `The payment is ${result.status}. You can try again from your subscription page.`
            )
            setStatus("error")
            return
          }
          setStatus("pending")
          setMessage(
            "Payment received. Waiting for Stripe's secure confirmation; this can take a moment."
          )
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (err) {
        if (!active) return
        setMessage(
          err instanceof Error
            ? err.message
            : "We could not check your payment status."
        )
        setStatus("error")
      }
    }

    void checkPaymentStatus()
    return () => {
      active = false
    }
  }, [cancelled, isPending, session, sessionId])

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-[#e1dfd5] bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-medium text-[#829778]">Premium payment</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">
        {cancelled
          ? "Checkout cancelled"
          : visibleStatus === "success"
            ? "Premium is active"
            : visibleStatus === "error"
              ? "Payment not confirmed"
              : visibleStatus === "pending"
                ? "Payment confirmation pending"
                : "Checking your payment"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#74796f]">
        {accountError ||
          (isPending
            ? "Checking your account…"
            : message ||
              (cancelled
                ? "Checkout was cancelled. No payment was made. You can return to Premium whenever you are ready."
                : "Premium is enabled only after the server receives and verifies Stripe's webhook."))}
      </p>
      {!cancelled &&
        (visibleStatus === "loading" || visibleStatus === "pending") && (
          <div
            className="mx-auto mt-6 size-6 animate-spin rounded-full border-2 border-[#d9ddd3] border-t-[#73876a]"
            aria-label="Waiting for secure payment confirmation"
          />
        )}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/subscription"
          className="rounded-lg bg-[#73876a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#617458]"
        >
          Subscription
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-[#d9ddd3] px-5 py-2.5 text-sm font-medium text-[#52604b] hover:bg-[#f2f3ed]"
        >
          Dashboard
        </Link>
      </div>
    </section>
  )
}
