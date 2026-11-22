"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPinIcon } from "lucide-react"

const fallbackImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
]

export type ServiceCardData = {
  id: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  vendorName: string
}

export function ServiceCard({ service }: { service: ServiceCardData }) {
  const image = service.images.find((url) => url.trim().length > 0) ?? fallbackImages[0]
  const [imageSource, setImageSource] = useState(image)
  const [usedFallback, setUsedFallback] = useState(false)

  return (
    <article className="overflow-hidden rounded-xl border border-[#e1dfd5] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-56 overflow-hidden bg-[#e6eadf]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSource}
          alt={service.serviceName}
          onError={() => {
            if (!usedFallback) {
              setImageSource(fallbackImages[0] === image ? fallbackImages[1] : fallbackImages[0])
              setUsedFallback(true)
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-[#fbfaf7]/95 px-3 py-1 text-xs font-medium text-[#65775d]">
          {service.category}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl leading-snug text-[#30362e]">
            {service.serviceName}
          </h2>
          <p className="shrink-0 text-sm font-semibold text-[#65775d]">
            ${service.price.toLocaleString()}
          </p>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#74796f]">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[#eeece5] pt-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#454b42]">
              {service.vendorName}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#858980]">
              <MapPinIcon className="size-3.5" aria-hidden="true" />
              {service.location}
            </p>
          </div>
          <Link
            href={`/services/${service.id}`}
            className="rounded-lg bg-[#9aaf90] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#829a78]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
