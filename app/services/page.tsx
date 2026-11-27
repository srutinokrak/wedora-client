import Link from "next/link"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { ServiceCard, type ServiceCardData } from "@/components/service-card"

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]

type ServicesPageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    location?: string
    sort?: string
  }>
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams
  const query = params.q?.trim() ?? ""
  const category = params.category ?? ""
  const location = params.location?.trim() ?? ""
  const sortBy = params.sort === "price-asc" || params.sort === "price-desc"
    ? params.sort
    : ""

  const apiUrl = new URL(
    "/services",
    process.env.WEDORA_API_URL || "http://localhost:5000",
  )
  if (query) apiUrl.searchParams.set("q", query)
  if (categories.includes(category)) apiUrl.searchParams.set("category", category)
  if (location) apiUrl.searchParams.set("location", location)
  if (sortBy) apiUrl.searchParams.set("sort", sortBy)

  const response = await fetch(apiUrl, { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Services API request failed with status ${response.status}.`)
  }

  const result = (await response.json()) as {
    services: ServiceCardData[]
    locations: string[]
    total: number
  }
  const services = result.services
  const availableLocations = result.locations

  return (
    <main className="min-h-[60vh] bg-[#fbfaf7]">
      <section className="border-b border-[#e7e5dc] bg-[#f2f3ed] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#829778]">
            Wedora Marketplace
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#30362e] sm:text-5xl">
            Browse Wedding Services
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#74796f] sm:text-base">
            Discover trusted wedding professionals and find the right team for your celebration.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <form
          action="/services"
          className="grid gap-2 rounded-xl border border-[#e1dfd5] bg-white p-3 shadow-sm sm:grid-cols-2 xl:grid-cols-[1.45fr_1fr_1fr_1fr_auto]"
        >
          <label className="relative">
            <span className="sr-only">Search services</span>
            <SearchIcon
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#858980]"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search service name or keyword..."
              className="h-11 w-full rounded-lg border border-[#e1dfd5] bg-[#fbfaf7] pr-3 pl-10 text-sm text-[#30362e] outline-none focus:border-[#9aaf90]"
            />
          </label>

          <label>
            <span className="sr-only">Filter by category</span>
            <select
              name="category"
              defaultValue={category}
              className="h-11 w-full rounded-lg border border-[#e1dfd5] bg-[#fbfaf7] px-3 text-sm text-[#51584d] outline-none focus:border-[#9aaf90]"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by location</span>
            <select
              name="location"
              defaultValue={location}
              className="h-11 w-full rounded-lg border border-[#e1dfd5] bg-[#fbfaf7] px-3 text-sm text-[#51584d] outline-none focus:border-[#9aaf90]"
            >
              <option value="">All locations</option>
              {availableLocations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Sort by price</span>
            <select
              name="sort"
              defaultValue={sortBy}
              className="h-11 w-full rounded-lg border border-[#e1dfd5] bg-[#fbfaf7] px-3 text-sm text-[#51584d] outline-none focus:border-[#9aaf90]"
            >
              <option value="">Recently added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#9aaf90] px-5 text-sm font-medium text-white transition-colors hover:bg-[#829a78]"
          >
            Search
          </button>
        </form>

        <nav aria-label="Filter by service category" className="mt-4 flex flex-wrap gap-2">
          <Link
            href={{
              pathname: "/services",
              query: {
                ...(query ? { q: query } : {}),
                ...(location ? { location } : {}),
                ...(sortBy ? { sort: sortBy } : {}),
              },
            }}
            aria-current={!category ? "true" : undefined}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              !category
                ? "border-[#9aaf90] bg-[#9aaf90] text-white"
                : "border-[#e1dfd5] bg-white text-[#65705f] hover:border-[#9aaf90]"
            }`}
          >
            All Categories
          </Link>
          {categories.map((item) => (
            <Link
              key={item}
              href={{
                pathname: "/services",
                query: {
                  ...(query ? { q: query } : {}),
                  category: item,
                  ...(location ? { location } : {}),
                  ...(sortBy ? { sort: sortBy } : {}),
                },
              }}
              aria-current={category === item ? "true" : undefined}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === item
                  ? "border-[#9aaf90] bg-[#9aaf90] text-white"
                  : "border-[#e1dfd5] bg-white text-[#65705f] hover:border-[#9aaf90]"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-sm text-[#74796f]">
            {services.length} {services.length === 1 ? "service" : "services"} found
          </p>
          <p className="hidden items-center gap-1 text-xs text-[#858980] sm:flex">
            <SlidersHorizontalIcon className="size-3.5" aria-hidden="true" />
            Showing approved and available services
          </p>
        </div>

        {services.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-[#d6dbd0] bg-white px-6 py-16 text-center">
            <h2 className="font-serif text-2xl text-[#30362e]">No services found</h2>
            <p className="mt-2 text-sm text-[#74796f]">
              Try changing your search or filters to discover more vendors.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
