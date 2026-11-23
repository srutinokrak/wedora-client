"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { confirmVendorPayment } from "@/lib/api"
import { useSession } from "@/lib/auth-client"

export function VendorPaymentReturn({ sessionId, cancelled = false }: { sessionId?: string; cancelled?: boolean }) {
  const { data: session, isPending } = useSession()
  const [status, setStatus] = useState<"loading" | "success" | "cancelled" | "error">(cancelled ? "cancelled" : "loading")
  const [message, setMessage] = useState("")
  const accountError = !isPending && (!session ? "Please sign in as a vendor to view this page." : session.user.role !== "vendor" ? "This page is for vendor accounts." : !cancelled && !sessionId ? "We could not find the payment session to verify." : "")
  const visibleStatus = accountError ? "error" : status

  useEffect(() => {
    if (isPending || !session || session.user.role !== "vendor") return
    if (cancelled) return
    if (!sessionId) return

    confirmVendorPayment(sessionId)
      .then((result) => {
        setMessage(result.message)
        setStatus("success")
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : "We could not verify your payment.")
        setStatus("error")
      })
  }, [cancelled, isPending, session, sessionId])

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-[#e1dfd5] bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-medium text-[#829778]">Premium payment</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">{cancelled ? "Checkout cancelled" : visibleStatus === "success" ? "Premium is active" : visibleStatus === "error" ? "Payment not confirmed" : "Checking your payment"}</h1>
      <p className="mt-3 text-sm leading-6 text-[#74796f]">{accountError || (isPending ? "Checking your account…" : message || (cancelled ? "Checkout was cancelled. No payment was made. You can return to Premium whenever you are ready." : "We are confirming your payment directly with Stripe. Premium is enabled only after Stripe confirms payment."))}</p>
      {!cancelled && visibleStatus === "loading" && <div className="mx-auto mt-6 size-6 animate-spin rounded-full border-2 border-[#d9ddd3] border-t-[#73876a]" aria-label="Verifying payment" />}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/subscription" className="rounded-lg bg-[#73876a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#617458]">Subscription</Link>
        <Link href="/dashboard" className="rounded-lg border border-[#d9ddd3] px-5 py-2.5 text-sm font-medium text-[#52604b] hover:bg-[#f2f3ed]">Dashboard</Link>
      </div>
    </section>
  )
}
