"use client"

import { useEffect, useState, useRef } from "react"
import {
  PencilIcon,
  TrashIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  UploadIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
} from "lucide-react"
import { vendorFetch } from "@/lib/api"

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]

interface VendorService {
  id: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  status: "pending" | "approved" | "rejected"
  availability: "active" | "inactive"
}

interface ApiService {
  _id?: string
  id?: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images?: string[]
  status: "pending" | "approved" | "rejected"
  availability: "active" | "inactive"
}

interface EditFormState {
  serviceName: string
  category: string
  description: string
  price: string
  location: string
}

const inputClass =
  "w-full rounded-lg border border-[#d6dbd0] bg-white px-3 py-2.5 text-sm text-[#30362e] focus:outline-none focus:ring-2 focus:ring-[#9aaf90]"
const labelClass = "mb-1.5 block text-sm font-medium text-[#30362e]"

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  )
}

async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body: formData },
  )
  const data = (await res.json()) as { data: { url: string } }
  return data.data.url
}

function normalizeService(s: ApiService): VendorService {
  return {
    id: (s._id ?? s.id ?? "") as string,
    serviceName: s.serviceName,
    category: s.category,
    description: s.description,
    price: s.price,
    location: s.location,
    images: s.images ?? [],
    status: s.status,
    availability: s.availability,
  }
}

export default function VendorMyServices() {
  const [services, setServices] = useState<VendorService[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  })
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState("")
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editMsg, setEditMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const editFileRef = useRef<HTMLInputElement>(null)

  // delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleteMsg, setDeleteMsg] = useState<{ id: string; type: "success" | "error"; text: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // availability toggle state
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    vendorFetch("/vendor/services")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json() as Promise<ApiService[]>
      })
      .then((data) => setServices(data.map(normalizeService)))
      .catch(() => setFetchError("Failed to load services. Please refresh."))
      .finally(() => setLoading(false))
  }, [])

  function openEdit(service: VendorService) {
    setEditingId(service.id)
    setEditForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      location: service.location,
    })
    setEditImageFile(null)
    setEditImagePreview(service.images[0] ?? "")
    setEditMsg(null)
  }

  function closeEdit() {
    setEditingId(null)
    setEditMsg(null)
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setEditImageFile(file)
    if (file) setEditImagePreview(URL.createObjectURL(file))
  }

  async function handleEditSave(serviceId: string) {
    setEditSubmitting(true)
    setEditMsg(null)
    try {
      let imageUrl: string | undefined
      if (editImageFile) {
        imageUrl = await uploadToImgBB(editImageFile)
      }

      const payload: Record<string, unknown> = {
        serviceName: editForm.serviceName.trim(),
        category: editForm.category,
        description: editForm.description.trim(),
        price: Number(editForm.price),
        location: editForm.location.trim(),
      }
      if (imageUrl) payload.images = [imageUrl]

      const res = await vendorFetch(`/vendor/services/${serviceId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = (await res.json()) as { message?: string }
        throw new Error(body.message ?? `Error ${res.status}`)
      }
      const updated = (await res.json()) as ApiService
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? normalizeService(updated) : s)),
      )
      setEditMsg({ type: "success", text: "Service updated successfully." })
      setTimeout(() => {
        setEditingId(null)
        setEditMsg(null)
      }, 1500)
    } catch (err) {
      setEditMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update service.",
      })
    } finally {
      setEditSubmitting(false)
    }
  }

  async function handleDelete(serviceId: string) {
    setDeleting(true)
    setDeleteMsg(null)
    try {
      const res = await vendorFetch(`/vendor/services/${serviceId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const body = (await res.json()) as { message?: string }
        throw new Error(body.message ?? `Error ${res.status}`)
      }
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      setConfirmDeleteId(null)
    } catch (err) {
      setDeleteMsg({
        id: serviceId,
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete service.",
      })
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggleAvailability(service: VendorService) {
    setTogglingId(service.id)
    const newAvailability = service.availability === "active" ? "inactive" : "active"
    try {
      const res = await vendorFetch(`/vendor/services/${service.id}`, {
        method: "PATCH",
        body: JSON.stringify({ availability: newAvailability }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const updated = (await res.json()) as ApiService
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? normalizeService(updated) : s)),
      )
    } catch {
      // silently revert on error — user can retry
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <section>
        <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
        <h1 className="mt-2 font-serif text-3xl text-[#30362e]">My Services</h1>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-[#e1dfd5] bg-white p-5 shadow-sm"
            >
              <div className="h-36 rounded-lg bg-[#e1dfd5]" />
              <div className="mt-3 h-4 w-3/4 rounded bg-[#e1dfd5]" />
              <div className="mt-2 h-3 w-1/2 rounded bg-[#e1dfd5]" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (fetchError) {
    return (
      <section>
        <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
        <h1 className="mt-2 font-serif text-3xl text-[#30362e]">My Services</h1>
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">{fetchError}</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">My Services</h1>

      {services.length === 0 ? (
        <div className="mt-7 rounded-xl border border-dashed border-[#d6dbd0] bg-white p-10 text-center">
          <p className="text-sm text-[#74796f]">
            No services yet. Add your first service!
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-[#e1dfd5] bg-white shadow-sm"
            >
              {/* Thumbnail */}
              {service.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.images[0]}
                  alt={service.serviceName}
                  className="h-40 w-full rounded-t-xl object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-t-xl bg-[#edf1e8]">
                  <span className="text-xs text-[#74796f]">No image</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium text-[#30362e] leading-tight">
                    {service.serviceName}
                  </h2>
                  {statusBadge(service.status)}
                </div>

                <p className="mt-1 text-xs text-[#829778]">{service.category}</p>
                <p className="mt-1 text-sm text-[#74796f]">{service.location}</p>
                <p className="mt-1 text-sm font-semibold text-[#30362e]">
                  ${service.price.toLocaleString()}
                </p>

                {/* Availability toggle */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAvailability(service)}
                    disabled={togglingId === service.id}
                    className="flex items-center gap-1.5 text-xs text-[#65775d] hover:text-[#30362e] disabled:opacity-50"
                  >
                    {service.availability === "active" ? (
                      <ToggleRightIcon className="size-5 text-[#9aaf90]" />
                    ) : (
                      <ToggleLeftIcon className="size-5 text-[#829778]" />
                    )}
                    {service.availability === "active" ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Delete message */}
                {deleteMsg?.id === service.id && (
                  <p
                    className={`mt-2 text-xs ${deleteMsg.type === "error" ? "text-red-600" : "text-green-700"}`}
                  >
                    {deleteMsg.text}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-[#f0ede7] pt-3">
                  <button
                    onClick={() =>
                      editingId === service.id ? closeEdit() : openEdit(service)
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-[#d6dbd0] px-3 py-1.5 text-xs text-[#65775d] hover:bg-[#f4f6f1]"
                  >
                    <PencilIcon className="size-3.5" />
                    {editingId === service.id ? "Cancel" : "Edit"}
                  </button>

                  {confirmDeleteId !== service.id ? (
                    <button
                      onClick={() => setConfirmDeleteId(service.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="size-3.5" />
                      Delete
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#74796f]">Confirm?</span>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deleting}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded px-2 py-1 text-xs font-medium text-[#65775d] hover:bg-[#f4f6f1]"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline edit form */}
                {editingId === service.id && (
                  <div className="mt-4 border-t border-[#f0ede7] pt-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#829778]">
                      Edit Service
                    </p>

                    <div className="mb-3">
                      <label className={labelClass}>Service Name</label>
                      <input
                        name="serviceName"
                        type="text"
                        value={editForm.serviceName}
                        onChange={handleEditChange}
                        className={inputClass}
                      />
                    </div>

                    <div className="mb-3">
                      <label className={labelClass}>Category</label>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className={inputClass}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className={labelClass}>Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        value={editForm.description}
                        onChange={handleEditChange}
                        className={inputClass}
                      />
                    </div>

                    <div className="mb-3">
                      <label className={labelClass}>Price (USD)</label>
                      <input
                        name="price"
                        type="number"
                        min={0}
                        step={0.01}
                        value={editForm.price}
                        onChange={handleEditChange}
                        className={inputClass}
                      />
                    </div>

                    <div className="mb-3">
                      <label className={labelClass}>Location</label>
                      <input
                        name="location"
                        type="text"
                        value={editForm.location}
                        onChange={handleEditChange}
                        className={inputClass}
                      />
                    </div>

                    {/* Image upload in edit */}
                    <div className="mb-3">
                      <label className={labelClass}>Service Image (optional)</label>
                      <div
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d6dbd0] bg-[#fafaf8] p-4 hover:border-[#9aaf90]"
                        onClick={() => editFileRef.current?.click()}
                      >
                        {editImagePreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={editImagePreview}
                            alt="Preview"
                            className="mb-2 max-h-24 rounded object-cover"
                          />
                        ) : (
                          <UploadIcon className="mb-1 size-5 text-[#9aaf90]" />
                        )}
                        <p className="text-xs text-[#74796f]">
                          {editImageFile ? editImageFile.name : "Click to change image"}
                        </p>
                        <input
                          ref={editFileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleEditFileChange}
                        />
                      </div>
                    </div>

                    {editMsg && (
                      <div
                        className={`mb-3 flex items-start gap-2 rounded-lg p-2.5 text-xs ${
                          editMsg.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {editMsg.type === "success" ? (
                          <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0" />
                        ) : (
                          <AlertCircleIcon className="mt-0.5 size-3.5 shrink-0" />
                        )}
                        {editMsg.text}
                      </div>
                    )}

                    <button
                      onClick={() => handleEditSave(service.id)}
                      disabled={editSubmitting}
                      className="rounded-lg bg-[#9aaf90] px-5 py-2 text-xs font-medium text-white hover:bg-[#829a78] disabled:opacity-60"
                    >
                      {editSubmitting ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
