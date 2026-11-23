"use client"

import { useCallback, useEffect, useState } from "react"
import {
  getAdminUsers,
  updateAdminUserBlock,
  type AdminUserData,
} from "@/lib/api"
import { Toast } from "@/components/toast"

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserData[]>([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [actingId, setActingId] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null)
  const clearNotice = useCallback(() => setNotice(""), [])
  const clearError = useCallback(() => setError(""), [])

  useEffect(() => {
    getAdminUsers(search, role)
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load users.")
      )
      .finally(() => setLoading(false))
  }, [search, role])

  async function toggleBlock(user: AdminUserData) {
    setActingId(user.id)
    setError("")
    setNotice("")
    try {
      await updateAdminUserBlock(user.id, !user.isBlocked)
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, isBlocked: !user.isBlocked } : item
        )
      )
      setNotice(`${user.name} was ${user.isBlocked ? "unblocked" : "blocked"}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user.")
    } finally {
      setActingId("")
    }
  }

  return (
    <section>
      <Toast message={notice} onClose={clearNotice} />
      <Toast message={error} type="error" onClose={clearError} />
      <p className="text-sm font-medium text-[#829778]">Admin dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">Manage Users</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or email"
          className="min-w-0 flex-1 rounded-lg border border-[#d9ddd3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#829778]"
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded-lg border border-[#d9ddd3] bg-white px-3 py-2.5 text-sm text-[#52604b]"
        >
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      {loading ? (
        <p className="mt-6 text-sm text-[#74796f]">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-[#74796f]">
          No users found.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#e1dfd5] bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-[#f2f3ed] text-[#65705f]">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Access</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efeee8]">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#30362e]">{user.name}</p>
                    <p className="mt-0.5 text-xs text-[#74796f]">
                      {user.email}
                    </p>
                    {user.businessName && (
                      <p className="text-xs text-[#829778]">
                        {user.businessName}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#65705f] capitalize">
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-[#74796f]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg border border-[#d9ddd3] px-3 py-2 text-xs font-medium text-[#52604b] hover:bg-[#f2f3ed]"
                    >
                      View details
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleBlock(user)}
                      disabled={actingId === user.id || user.role === "admin"}
                      className="rounded-lg border border-[#d9ddd3] px-3 py-2 text-xs font-medium text-[#52604b] hover:bg-[#f2f3ed] disabled:opacity-50"
                    >
                      {actingId === user.id
                        ? "Saving…"
                        : user.isBlocked
                          ? "Unblock"
                          : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedUser && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/30 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedUser(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="user-details-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#829778]">Registered account</p>
                <h2 id="user-details-title" className="mt-1 font-serif text-2xl text-[#30362e]">User details</h2>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="rounded-lg px-3 py-2 text-sm text-[#65705f] hover:bg-[#f2f3ed]">Close</button>
            </div>
            <div className="mt-5 rounded-xl bg-[#f7f6f1] p-4">
              <p className="font-medium text-[#30362e]">{selectedUser.name}</p>
              <p className="mt-1 text-sm text-[#74796f]">{selectedUser.email}</p>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div><dt className="text-[#858980]">Role</dt><dd className="mt-1 capitalize text-[#30362e]">{selectedUser.role}</dd></div>
              <div><dt className="text-[#858980]">Account access</dt><dd className="mt-1 text-[#30362e]">{selectedUser.isBlocked ? "Blocked" : "Active"}</dd></div>
              <div><dt className="text-[#858980]">Joined</dt><dd className="mt-1 text-[#30362e]">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "Not available"}</dd></div>
              <div><dt className="text-[#858980]">Email verified</dt><dd className="mt-1 text-[#30362e]">{selectedUser.emailVerified ? "Yes" : "No"}</dd></div>
              {selectedUser.businessName && <div className="col-span-2"><dt className="text-[#858980]">Business name</dt><dd className="mt-1 text-[#30362e]">{selectedUser.businessName}</dd></div>}
              {selectedUser.subscriptionPlan && <div><dt className="text-[#858980]">Subscription</dt><dd className="mt-1 capitalize text-[#30362e]">{selectedUser.subscriptionPlan}</dd></div>}
              {selectedUser.subscriptionExpiresAt && <div><dt className="text-[#858980]">Subscription expires</dt><dd className="mt-1 text-[#30362e]">{new Date(selectedUser.subscriptionExpiresAt).toLocaleDateString()}</dd></div>}
              <div className="col-span-2"><dt className="text-[#858980]">User ID</dt><dd className="mt-1 break-all font-mono text-xs text-[#30362e]">{selectedUser.id}</dd></div>
            </dl>
            <div className="mt-6 border-t border-[#efeee8] pt-4">
              <button type="button" onClick={() => { void toggleBlock(selectedUser); setSelectedUser(null) }} disabled={selectedUser.role === "admin" || actingId === selectedUser.id} className="rounded-lg border border-[#d9ddd3] px-4 py-2.5 text-sm font-medium text-[#52604b] hover:bg-[#f2f3ed] disabled:opacity-50">{selectedUser.isBlocked ? "Unblock user" : "Block user"}</button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
