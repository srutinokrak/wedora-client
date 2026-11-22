// Add NEXT_PUBLIC_WEDORA_API_URL=http://localhost:5000 to your .env.local file

export const API_URL =
  process.env.NEXT_PUBLIC_WEDORA_API_URL ?? "http://localhost:5000"

export function getSessionToken(): string {
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(/better-auth\.session_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ""
}

export async function vendorFetch(path: string, options?: RequestInit) {
  const token = getSessionToken()
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  })
}
