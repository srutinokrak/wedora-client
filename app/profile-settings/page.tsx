"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useSession } from "@/lib/auth-client"

export default function ProfileSettingsPage() {
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
      <p className="text-sm font-medium text-primary">Account</p>
      <h1 className="mt-2 text-3xl font-bold">Profile Settings</h1>
      <div className="mt-6 max-w-xl rounded-2xl border border-white/10 p-6">
        <p className="text-sm text-muted-foreground">Name</p>
        <p className="mt-1 font-medium">{session.user.name}</p>
        {session.user.email && (
          <>
            <p className="mt-5 text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium">{session.user.email}</p>
          </>
        )}
      </div>
    </main>
  )
}
