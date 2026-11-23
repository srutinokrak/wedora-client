"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { authClient, useSession } from "@/lib/auth-client"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [name, setName] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending) {
    return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">Loading...</main>
  }

  if (!session) return null

  const profileName = name ?? session.user.name ?? ""
  const profileImage = image ?? session.user.image ?? ""

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")
    try {
      const result = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName.trim(),
          image: profileImage.trim() || null,
        }),
      })
      if (!result.ok) {
        const body = await result.json().catch(() => ({}))
        throw new Error(body.message || "Could not update your profile.")
      }
      await authClient.getSession()
      setMessage("Your profile has been updated.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update your profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-primary">Account</p>
      <h1 className="mt-2 text-3xl font-bold">Profile Settings</h1>
      <form onSubmit={saveProfile} className="mt-6 max-w-xl space-y-5 rounded-2xl border border-[#e1dfd5] bg-white p-6">
        <label className="block text-sm font-medium text-[#52604b]">
          Name
          <input value={profileName} onChange={(event) => setName(event.target.value)} required maxLength={80} className="mt-2 w-full rounded-lg border border-[#d9ddd3] px-3 py-2.5 font-normal text-[#30362e] outline-none focus:border-[#829778]" />
        </label>
        <label className="block text-sm font-medium text-[#52604b]">
          Profile image URL
          <input type="url" value={profileImage} onChange={(event) => setImage(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-lg border border-[#d9ddd3] px-3 py-2.5 font-normal text-[#30362e] outline-none focus:border-[#829778]" />
        </label>
        <div>
          <p className="text-sm font-medium text-[#52604b]">Email</p>
          <p className="mt-1 text-sm text-[#74796f]">{session.user.email}</p>
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={saving || !profileName.trim()} className="rounded-lg bg-[#73876a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#617458] disabled:opacity-60">
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </main>
  )
}
