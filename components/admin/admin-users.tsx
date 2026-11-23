"use client"

import { useCallback, useEffect, useState } from "react"
import { getAdminUsers, updateAdminUserBlock, type AdminUserData } from "@/lib/api"
import { Toast } from "@/components/toast"

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserData[]>([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [actingId, setActingId] = useState("")
  const clearNotice = useCallback(() => setNotice(""), [])
  const clearError = useCallback(() => setError(""), [])

  useEffect(() => {
    getAdminUsers(search, role).then(setUsers).catch((err) => setError(err instanceof Error ? err.message : "Could not load users.")).finally(() => setLoading(false))
  }, [search, role])

  async function toggleBlock(user: AdminUserData) {
    setActingId(user.id)
    setError("")
    setNotice("")
    try {
      await updateAdminUserBlock(user.id, !user.isBlocked)
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, isBlocked: !user.isBlocked } : item))
      setNotice(`${user.name} was ${user.isBlocked ? "unblocked" : "blocked"}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user.")
    } finally {
      setActingId("")
    }
  }

  return (
    <section>
      <Toast message={notice} onClose={clearNotice} /><Toast message={error} type="error" onClose={clearError} />
      <p className="text-sm font-medium text-[#829778]">Admin dashboard</p><h1 className="mt-2 font-serif text-3xl text-[#30362e]">Manage Users</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="min-w-0 flex-1 rounded-lg border border-[#d9ddd3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#829778]" />
        <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-lg border border-[#d9ddd3] bg-white px-3 py-2.5 text-sm text-[#52604b]"><option value="all">All roles</option><option value="customer">Customers</option><option value="vendor">Vendors</option><option value="admin">Admins</option></select>
      </div>
      {loading ? <p className="mt-6 text-sm text-[#74796f]">Loading users…</p> : users.length === 0 ? <p className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-[#74796f]">No users found.</p> : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e1dfd5] bg-white"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#f2f3ed] text-[#65705f]"><tr><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium">Joined</th><th className="px-4 py-3 font-medium">Access</th><th className="px-4 py-3 font-medium">Action</th></tr></thead><tbody className="divide-y divide-[#efeee8]">{users.map((user) => <tr key={user.id}><td className="px-4 py-3"><p className="font-medium text-[#30362e]">{user.name}</p><p className="mt-0.5 text-xs text-[#74796f]">{user.email}</p>{user.businessName && <p className="text-xs text-[#829778]">{user.businessName}</p>}</td><td className="px-4 py-3 capitalize text-[#65705f]">{user.role}</td><td className="px-4 py-3 text-[#74796f]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{user.isBlocked ? "Blocked" : "Active"}</span></td><td className="px-4 py-3"><button type="button" onClick={() => toggleBlock(user)} disabled={actingId === user.id || user.role === "admin"} className="rounded-lg border border-[#d9ddd3] px-3 py-2 text-xs font-medium text-[#52604b] hover:bg-[#f2f3ed] disabled:opacity-50">{actingId === user.id ? "Saving…" : user.isBlocked ? "Unblock" : "Block"}</button></td></tr>)}</tbody></table></div>
      )}
    </section>
  )
}
