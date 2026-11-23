"use client"

import { useCallback, useEffect, useState } from "react"
import { deleteAdminService, getAdminServices, updateAdminService, type AdminServiceData } from "@/lib/api"
import { Toast } from "@/components/toast"

export default function AdminServices() {
  const [services, setServices] = useState<AdminServiceData[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [actingId, setActingId] = useState("")
  const clearNotice = useCallback(() => setNotice(""), [])
  const clearError = useCallback(() => setError(""), [])

  useEffect(() => {
    getAdminServices(search, status).then(setServices).catch((err) => setError(err instanceof Error ? err.message : "Could not load services.")).finally(() => setLoading(false))
  }, [search, status])

  async function updateService(service: AdminServiceData, changes: { status?: string; availability?: string }, message: string) {
    setActingId(service.id); setError(""); setNotice("")
    try {
      await updateAdminService(service.id, changes)
      setServices((current) => current.map((item) => item.id === service.id ? {
        ...item,
        ...(changes.status === "pending" || changes.status === "approved" || changes.status === "rejected" ? { status: changes.status } : {}),
        ...(changes.availability === "active" || changes.availability === "inactive" ? { availability: changes.availability } : {}),
      } : item))
      setNotice(message)
    } catch (err) { setError(err instanceof Error ? err.message : "Could not update service.") }
    finally { setActingId("") }
  }

  async function removeService(service: AdminServiceData) {
    if (!window.confirm(`Delete “${service.serviceName}”? This cannot be undone.`)) return
    setActingId(service.id); setError(""); setNotice("")
    try {
      await deleteAdminService(service.id)
      setServices((current) => current.filter((item) => item.id !== service.id))
      setNotice("Service deleted.")
    } catch (err) { setError(err instanceof Error ? err.message : "Could not delete service.") }
    finally { setActingId("") }
  }

  return (
    <section>
      <Toast message={notice} onClose={clearNotice} /><Toast message={error} type="error" onClose={clearError} />
      <p className="text-sm font-medium text-[#829778]">Admin dashboard</p><h1 className="mt-2 font-serif text-3xl text-[#30362e]">Manage Services</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search service name" className="min-w-0 flex-1 rounded-lg border border-[#d9ddd3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#829778]" /><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[#d9ddd3] bg-white px-3 py-2.5 text-sm text-[#52604b]"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
      {loading ? <p className="mt-6 text-sm text-[#74796f]">Loading services…</p> : services.length === 0 ? <p className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-[#74796f]">No services found.</p> : (
        <div className="mt-6 space-y-4">{services.map((service) => <article key={service.id} className="rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-serif text-xl text-[#30362e]">{service.serviceName}</h2><p className="mt-1 text-sm text-[#74796f]">{service.category} · {service.location} · ${service.price.toLocaleString()}</p><p className="mt-1 text-xs text-[#829778]">Vendor: {service.vendorName}</p></div><span className={`rounded-full px-2.5 py-1 text-xs capitalize ${service.status === "approved" ? "bg-green-100 text-green-700" : service.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{service.status}</span></div><div className="mt-4 flex flex-wrap gap-2 border-t border-[#f0ede7] pt-4">{service.status !== "approved" && <button disabled={actingId === service.id} onClick={() => updateService(service, { status: "approved", availability: "active" }, "Service approved and published.")} className="rounded-lg bg-[#73876a] px-3 py-2 text-xs font-medium text-white disabled:opacity-50">Approve</button>}{service.status !== "rejected" && <button disabled={actingId === service.id} onClick={() => updateService(service, { status: "rejected" }, "Service rejected.")} className="rounded-lg border border-[#d9ddd3] px-3 py-2 text-xs font-medium text-[#52604b] disabled:opacity-50">Reject</button>}{service.status === "approved" && <button disabled={actingId === service.id} onClick={() => updateService(service, { availability: service.availability === "active" ? "inactive" : "active" }, `Service ${service.availability === "active" ? "unpublished" : "published"}.`)} className="rounded-lg border border-[#d9ddd3] px-3 py-2 text-xs font-medium text-[#52604b] disabled:opacity-50">{service.availability === "active" ? "Unpublish" : "Publish"}</button>}<button disabled={actingId === service.id} onClick={() => removeService(service)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 disabled:opacity-50">Delete</button></div></article>)}</div>
      )}
    </section>
  )
}
