import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, MapPinIcon } from "lucide-react"

import { ServiceBookingPanel } from "@/components/service-booking-panel"

type ServiceDetails = {
  id: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  vendorId: string
  vendorName: string
  vendorImage: string
}

type ServiceDetailsPageProps = {
  params: Promise<{ id: string }>
}

const fallbackImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"

async function getService(id: string): Promise<ServiceDetails | null> {
  const apiUrl = new URL(
    `/services/${encodeURIComponent(id)}`,
    process.env.WEDORA_API_URL || "http://localhost:5000",
  )
  const response = await fetch(apiUrl, { cache: "no-store" })

  if (response.status === 400 || response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error(`Service details request failed with status ${response.status}.`)
  }

  return (await response.json()) as ServiceDetails
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = await params
  const service = await getService(id)

  if (!service) {
    notFound()
  }

  const images = service.images.length > 0 ? service.images : [fallbackImage]

  return (
    <main className="min-h-[60vh] bg-[#fbfaf7]">
      <section className="border-b border-[#e7e5dc] bg-[#f2f3ed] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-[#65705f] hover:text-[#30362e]"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            Back to services
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#829778]">
            {service.category}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[#30362e] sm:text-5xl">
            {service.serviceName}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#74796f]">
            <MapPinIcon className="size-4" aria-hidden="true" />
            {service.location}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`overflow-hidden rounded-xl bg-[#e6eadf] ${
                  index === 0 ? "h-80 sm:col-span-2 sm:h-[440px]" : "h-56"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${service.serviceName} photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-2xl text-[#30362e]">About this service</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#656b61]">
              {service.description || "Contact the vendor to learn more about this service."}
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-[#e1dfd5] bg-white p-5">
            <h2 className="font-serif text-xl text-[#30362e]">Provided by</h2>
            <div className="mt-4 flex items-center gap-3">
              {service.vendorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.vendorImage}
                  alt=""
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <span className="grid size-12 place-items-center rounded-full bg-[#e7ecdf] font-serif text-lg text-[#65775d]">
                  {service.vendorName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-medium text-[#30362e]">{service.vendorName}</p>
                <p className="mt-1 text-sm text-[#858980]">Wedding service vendor</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[#e1dfd5] bg-white p-6 shadow-sm">
            <p className="text-sm text-[#74796f]">Starting from</p>
            <p className="mt-1 font-serif text-3xl text-[#65775d]">
              ${service.price.toLocaleString()}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-[#74796f]">
              <MapPinIcon className="size-4" aria-hidden="true" />
              {service.location}
            </p>
          </div>

          <ServiceBookingPanel serviceId={service.id} />
        </div>
      </section>
    </main>
  )
}
