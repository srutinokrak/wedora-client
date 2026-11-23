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
  subscriptionExpiresAt?: string | null
  subscriptionCancelAtPeriodEnd?: boolean
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

export interface CustomerOverviewData {
  totalBookings: number
  pendingBookings: number
  acceptedBookings: number
  rejectedBookings: number
}

export interface CustomerBookingData {
  _id?: string
  id?: string
  serviceId: string
  vendorId: string
  customerId: string
  serviceInfo?: { name?: string; serviceName?: string; image?: string; images?: string[] }
  vendorInfo?: { name?: string; image?: string }
  serviceName?: string
  serviceImage?: string
  vendorName?: string
  eventDate: string
  eventLocation: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  createdAt: string
}

export interface AdminOverviewData {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalServices: number
  pendingServices: number
  totalTransactions: number
}

export interface AdminUserData {
  id: string
  name: string
  email: string
  image: string
  role: string
  isBlocked: boolean
  createdAt?: string | null
  businessName?: string
  subscriptionPlan?: string
  subscriptionExpiresAt?: string | null
  emailVerified?: boolean
}

export interface AdminServiceData {
  id: string
  vendorId: string
  vendorName: string
  serviceName: string
  category: string
  price: number
  location: string
  images: string[]
  status: "pending" | "approved" | "rejected"
  availability: "active" | "inactive"
  createdAt?: string | null
}

export interface AdminTransactionData {
  id: string
  vendorId: string
  vendorName: string
  vendorEmail: string
  plan: string
  amount: number
  currency: string
  status: string
  createdAt?: string | null
}

// ======================= Vendor API Actions =======================

export async function getAdminOverview(): Promise<AdminOverviewData> {
  const res = await protectedMutation("/admin/overview", "GET")
  if (!res.ok) throw new Error(`Failed to load admin overview: ${res.status}`)
  return res.json()
}

export async function getAdminUsers(q = "", role = "all"): Promise<AdminUserData[]> {
  const params = new URLSearchParams()
  if (q.trim()) params.set("q", q.trim())
  if (role !== "all") params.set("role", role)
  const res = await protectedMutation(`/admin/users?${params.toString()}`, "GET")
  if (!res.ok) throw new Error(`Failed to load users: ${res.status}`)
  return res.json()
}

export async function updateAdminUserBlock(userId: string, isBlocked: boolean) {
  const res = await protectedMutation(`/admin/users/${encodeURIComponent(userId)}/block`, "PATCH", { isBlocked })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Failed to update user: ${res.status}`)
  }
  return res.json()
}

export async function getAdminServices(q = "", status = "all"): Promise<AdminServiceData[]> {
  const params = new URLSearchParams()
  if (q.trim()) params.set("q", q.trim())
  if (status !== "all") params.set("status", status)
  const res = await protectedMutation(`/admin/services?${params.toString()}`, "GET")
  if (!res.ok) throw new Error(`Failed to load services: ${res.status}`)
  return res.json()
}

export async function updateAdminService(serviceId: string, updates: { status?: string; availability?: string }) {
  const res = await protectedMutation(`/admin/services/${serviceId}`, "PATCH", updates)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Failed to update service: ${res.status}`)
  }
  return res.json()
}

export async function deleteAdminService(serviceId: string) {
  const res = await protectedMutation(`/admin/services/${serviceId}`, "DELETE")
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Failed to delete service: ${res.status}`)
  }
  return res.json()
}

export async function getAdminTransactions(): Promise<AdminTransactionData[]> {
  const res = await protectedMutation("/admin/transactions", "GET")
  if (!res.ok) throw new Error(`Failed to load transactions: ${res.status}`)
  return res.json()
}

export const getVendorOverview = async (): Promise<VendorOverviewData> => {
  const res = await protectedMutation("/vendor/overview", "GET")

  if (!res.ok) {
    throw new Error(`Failed to load overview: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const getCustomerOverview = async (): Promise<CustomerOverviewData> => {
  const res = await protectedMutation("/customer/overview", "GET")
  if (!res.ok) throw new Error(`Failed to load overview: ${res.status} ${res.statusText}`)
  return res.json()
}

export const getCustomerBookings = async (): Promise<CustomerBookingData[]> => {
  const res = await protectedMutation("/customer/bookings", "GET")
  if (!res.ok) throw new Error(`Failed to load bookings: ${res.status} ${res.statusText}`)
  return res.json()
}

export const createCustomerBooking = async (data: {
  serviceId: string
  eventDate: string
  eventLocation: string
  message: string
}) => {
  const res = await protectedMutation("/customer/bookings", "POST", data)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to submit booking: ${res.status}`)
  }
  return res.json()
}

export const cancelCustomerBooking = async (bookingId: string) => {
  const res = await protectedMutation(`/customer/bookings/${bookingId}/cancel`, "PATCH")
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to cancel booking: ${res.status}`)
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

export const createVendorSubscriptionCheckout = async (amountCents: number) => {
  const res = await protectedMutation("/vendor/subscription/checkout", "POST", { amountCents })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || `Failed to start checkout: ${res.status}`)
  return body as { url?: string }
}

export const cancelVendorSubscription = async () => {
  const res = await protectedMutation("/vendor/subscription/cancel", "POST")
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || `Failed to cancel subscription: ${res.status}`)
  return body as { message: string }
}

export const getVendorSubscriptionPaymentStatus = async (sessionId: string) => {
  const res = await protectedMutation(
    `/vendor/subscription/status/${encodeURIComponent(sessionId)}`,
    "GET"
  )
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || `Could not check payment status: ${res.status}`)
  return body as { status: "pending" | "paid" | "failed" | "expired" | "cancelled" }
}
