import Link from "next/link"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { ServiceCard, type ServiceCardData } from "@/components/service-card"

type ServicesResponse = {
  services: ServiceCardData[]
  locations: string[]
  total: number
}

export async function FeaturedServices() {
  const apiUrl = new URL(
    "/services",
    process.env.WEDORA_API_URL || "http://localhost:5000",
  )

  const response = await fetch(apiUrl, { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Featured services request failed with status ${response.status}.`)
  }

  const data = (await response.json()) as ServicesResponse
  if (!Array.isArray(data.services)) {
    throw new Error("The services API returned an invalid featured services response.")
  }

  const featuredServices = data.services.slice(0, 6)

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#829778]">
              <SparklesIcon className="size-4" aria-hidden="true" />
              Handpicked for your day
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[#30362e] sm:text-5xl">
              Featured Wedding Services
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#74796f] sm:text-base">
              Meet some of the trusted professionals ready to help make your celebration
              unforgettable.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#65775d] transition-colors hover:text-[#829a78]"
          >
            Browse all services
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {featuredServices.length > 0 ? (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-xl border border-dashed border-[#d6dbd0] bg-[#fbfaf7] px-6 py-14 text-center">
            <h3 className="font-serif text-2xl text-[#30362e]">
              New wedding services are on their way
            </h3>
            <p className="mt-2 text-sm text-[#74796f]">
              Please check back soon to discover our featured vendors.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
