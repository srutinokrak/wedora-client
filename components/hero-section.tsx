import Link from "next/link"
import { ArrowRightIcon, Flower2Icon } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] px-4 py-14 text-[#252924] sm:px-6 lg:min-h-[680px] lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute top-8 left-[-70px] h-44 w-44 rounded-full border border-[#dbe3d4]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#91a488] lg:justify-start">
            <Flower2Icon className="size-4" aria-hidden="true" />
            Your Wedding Planner
          </p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[1.05] text-[#252924] sm:text-6xl lg:text-7xl">
            A beautiful beginning,
            <span className="mt-1 block italic text-[#9aaf90]">planned perfectly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#70756e] sm:text-base lg:mx-0">
            Discover trusted wedding professionals and turn every detail of your special day
            into a celebration as unique as your story.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-3 rounded-sm bg-[#91a488] px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#91a488]/20 transition-colors hover:bg-[#7d9673]"
          >
            Explore Wedding Services
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative order-1 mx-auto h-[430px] w-full max-w-[620px] lg:order-2 lg:h-[520px]">
          <div className="absolute top-0 right-0 h-[78%] w-[70%] overflow-hidden rounded-t-[180px] rounded-b-md bg-[#dfe6da]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=88"
              alt="Newly married couple celebrating outdoors"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 h-[46%] w-[42%] overflow-hidden border-[10px] border-[#fbfaf7] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=88"
              alt="Elegant wedding table decoration"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute right-[2%] bottom-[-2%] h-[34%] w-[39%] overflow-hidden border-[8px] border-[#fbfaf7] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=88"
              alt="Bride and groom embracing"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute right-[58%] top-8 grid size-20 place-items-center rounded-full bg-white/90 text-[#91a488] shadow-md">
            <Flower2Icon className="size-8" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
