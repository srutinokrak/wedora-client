"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useSession } from "@/lib/auth-client"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending) {
    return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">Loading...</main>
  }

  if (!session) return null

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary">Welcome back</p>
      <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
      <p className="mt-3 text-muted-foreground">
        Manage your WedPlan wedding activities and saved services.
      </p>
    </main>
  )
}
