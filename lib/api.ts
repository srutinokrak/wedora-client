"use server"

import { cookies } from "next/headers"

const BASE_URL =
  process.env.NEXT_PUBLIC_WEDORA_API_URL ||
  process.env.WEDORA_API_URL ||
  "http://localhost:5000"

// Helper to get auth token from Better Auth cookie on the server
const getAuthToken = async (): Promise<string> => {
  const cookieStore = await cookies()
  return (
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value ||
    ""
  )
}

// Server-side protected fetch helper
const protectedMutation = async (
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "POST",
  data?: unknown
) => {
  const token = await getAuthToken()
  return fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  })
}

// ======================= Vendor Types =======================

export interface VendorOverviewData {
  totalServices: number
  activeServices: number
  pendingRequests: number
  acceptedBookings: number
  subscriptionPlan: string
}

export interface VendorServiceData {
  id: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  status: "pending" | "approved" | "rejected"
  availability: "active" | "inactive"
  createdAt?: string
}

export interface VendorBookingData {
  _id?: string
  id?: string
  serviceId: string
  vendorId: string
  customerId: string
  customerInfo?: {
    name?: string
    email?: string
  }
  serviceInfo?: {
    name?: string
    serviceName?: string
  }
  serviceName?: string
  eventDate: string
  eventLocation: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  createdAt: string
}

// ======================= Vendor API Actions =======================

export const getVendorOverview = async (): Promise<VendorOverviewData> => {
  const res = await protectedMutation("/vendor/overview", "GET")

  if (!res.ok) {
    throw new Error(`Failed to load overview: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const getVendorServices = async (): Promise<VendorServiceData[]> => {
  const res = await protectedMutation("/vendor/services", "GET")

  if (!res.ok) {
    throw new Error(`Failed to load services: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const createVendorService = async (data: {
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
}) => {
  const res = await protectedMutation("/vendor/services", "POST", data)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to create service: ${res.status}`)
  }

  return res.json()
}

export const updateVendorService = async (
  serviceId: string,
  data: Partial<VendorServiceData>
) => {
  const res = await protectedMutation(`/vendor/services/${serviceId}`, "PATCH", data)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to update service: ${res.status}`)
  }

  return res.json()
}

export const deleteVendorService = async (serviceId: string) => {
  const res = await protectedMutation(`/vendor/services/${serviceId}`, "DELETE")

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to delete service: ${res.status}`)
  }

  return res.json()
}

export const getVendorBookings = async (): Promise<VendorBookingData[]> => {
  const res = await protectedMutation("/vendor/bookings", "GET")

  if (!res.ok) {
    throw new Error(`Failed to load bookings: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const updateVendorBookingStatus = async (
  bookingId: string,
  action: "accept" | "reject"
) => {
  const res = await protectedMutation(`/vendor/bookings/${bookingId}`, "PATCH", { action })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to update booking: ${res.status}`)
  }

  return res.json()
}

export const createVendorSubscriptionCheckout = async () => {
  const res = await protectedMutation("/vendor/subscription/checkout", "POST")
  return res.json()
}
