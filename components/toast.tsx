"use client"

import { useEffect } from "react"

export function Toast({ message, type = "success", onClose }: {
  message: string
  type?: "success" | "error"
  onClose: () => void
}) {
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(onClose, 3000)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div role={type === "error" ? "alert" : "status"} className={`fixed right-4 top-4 z-50 max-w-sm rounded-lg px-4 py-3 text-sm text-white shadow-lg ${type === "error" ? "bg-red-700" : "bg-[#526b49]"}`}>
      {message}
    </div>
  )
}
