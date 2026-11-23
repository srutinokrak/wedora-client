"use client"

import { useState, useRef } from "react"
import { UploadIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react"
import { createVendorService } from "@/lib/api"

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]

interface FormFields {
  serviceName: string
  category: string
  description: string
  price: string
  location: string
}

interface FieldErrors {
  serviceName?: string
  category?: string
  description?: string
  price?: string
  location?: string
  image?: string
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

const inputClass =
  "w-full rounded-lg border border-[#d6dbd0] bg-white px-3 py-2.5 text-sm text-[#30362e] focus:outline-none focus:ring-2 focus:ring-[#9aaf90]"
const labelClass = "mb-1.5 block text-sm font-medium text-[#30362e]"

export default function VendorAddService() {
  const [fields, setFields] = useState<FormFields>({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSuccessMsg("")
    setErrorMsg("")
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setErrors((prev) => ({ ...prev, image: undefined }))
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview("")
    }
  }

  function validate(): boolean {
    const errs: FieldErrors = {}
    if (!fields.serviceName.trim()) errs.serviceName = "Service name is required."
    if (!fields.category) errs.category = "Please select a category."
    if (!fields.description.trim()) errs.description = "Description is required."
    if (!fields.price || Number(fields.price) < 0)
      errs.price = "Please enter a valid price."
    if (!fields.location.trim()) errs.location = "Location is required."
    if (!imageFile) errs.image = "Please upload a service image."
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccessMsg("")
    setErrorMsg("")
    if (!validate()) return

    try {
      setUploadingImage(true)
      const imageUrl = await uploadToImgBB(imageFile!)
      setUploadingImage(false)

      setSubmitting(true)
      await createVendorService({
        serviceName: fields.serviceName.trim(),
        category: fields.category,
        description: fields.description.trim(),
        price: Number(fields.price),
        location: fields.location.trim(),
        images: [imageUrl],
      })

      setSuccessMsg("Service added successfully! It is pending admin approval.")
      setFields({ serviceName: "", category: "", description: "", price: "", location: "" })
      setImageFile(null)
      setImagePreview("")
      if (fileRef.current) fileRef.current.value = ""
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to add service.")
    } finally {
      setUploadingImage(false)
      setSubmitting(false)
    }
  }

  const isLoading = uploadingImage || submitting

  return (
    <section>
      <p className="text-sm font-medium text-[#829778]">Vendor dashboard</p>
      <h1 className="mt-2 font-serif text-3xl text-[#30362e]">Add New Service</h1>
      <p className="mt-2 text-sm text-[#74796f]">
        Fill in the details below. Your service will be reviewed before going live.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-7 max-w-2xl rounded-xl border border-[#e1dfd5] bg-white p-6 shadow-sm"
      >
        {/* Service Name */}
        <div className="mb-5">
          <label htmlFor="serviceName" className={labelClass}>
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            id="serviceName"
            name="serviceName"
            type="text"
            value={fields.serviceName}
            onChange={handleChange}
            placeholder="e.g. Premium Wedding Photography"
            className={inputClass}
          />
          {errors.serviceName && (
            <p className="mt-1 text-xs text-red-600">{errors.serviceName}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-5">
          <label htmlFor="category" className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={fields.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-5">
          <label htmlFor="description" className={labelClass}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={fields.description}
            onChange={handleChange}
            placeholder="Describe your service in detail…"
            className={inputClass}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-5">
          <label htmlFor="price" className={labelClass}>
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={0.01}
            value={fields.price}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-5">
          <label htmlFor="location" className={labelClass}>
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={fields.location}
            onChange={handleChange}
            placeholder="City, State or full address"
            className={inputClass}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="serviceImage" className={labelClass}>
            Service Image <span className="text-red-500">*</span>
          </label>
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d6dbd0] bg-[#fafaf8] p-6 transition hover:border-[#9aaf90]"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Preview"
                className="mb-3 max-h-40 rounded-lg object-cover"
              />
            ) : (
              <UploadIcon className="mb-2 size-8 text-[#9aaf90]" />
            )}
            <p className="text-sm text-[#74796f]">
              {imageFile ? imageFile.name : "Click to upload an image"}
            </p>
            <input
              ref={fileRef}
              id="serviceImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {errors.image && (
            <p className="mt-1 text-xs text-red-600">{errors.image}</p>
          )}
        </div>

        {/* Status messages */}
        {uploadingImage && (
          <p className="mb-4 text-sm text-[#65775d]">Uploading image…</p>
        )}
        {successMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-[#9aaf90] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#829a78] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Add Service"}
        </button>
      </form>
    </section>
  )
}
