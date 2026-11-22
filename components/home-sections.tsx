"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  CalendarCheckIcon,
  CameraIcon,
  ChefHatIcon,
  Flower2Icon,
  HeartHandshakeIcon,
  PaletteIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StoreIcon,
  SwatchBookIcon,
  UsersIcon,
} from "lucide-react"

const categories = [
  {
    name: "Photography & Videography",
    href: "/services?category=Photography%20%26%20Videography",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
    icon: CameraIcon,
  },
  {
    name: "Wedding Venues",
    href: "/services?category=Wedding%20Venues",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85",
    icon: StoreIcon,
  },
  {
    name: "Decoration & Florist",
    href: "/services?category=Decoration%20%26%20Florist",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=85",
    icon: Flower2Icon,
  },
  {
    name: "Catering Services",
    href: "/services?category=Catering%20Services",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=85",
    icon: ChefHatIcon,
  },
  {
    name: "Makeup & Styling",
    href: "/services?category=Makeup%20%26%20Styling",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85",
    icon: PaletteIcon,
  },
  {
    name: "Wedding Fashion",
    href: "/services?category=Wedding%20Fashion",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85",
    icon: SwatchBookIcon,
  },
]

const benefits = [
  {
    title: "Trusted Vendors",
    description: "Discover reviewed wedding professionals with clear service details.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Everything in One Place",
    description: "From venues to styling, plan every part of your celebration easily.",
    icon: SparklesIcon,
  },
  {
    title: "Simple Booking",
    description: "Send booking requests and manage each update from your dashboard.",
    icon: CalendarCheckIcon,
  },
]

const steps = [
  {
    number: "01",
    title: "Explore",
    description: "Browse services and compare wedding professionals.",
    icon: SearchIcon,
  },
  {
    number: "02",
    title: "Choose",
    description: "Review details and select the perfect vendor for your day.",
    icon: HeartHandshakeIcon,
  },
  {
    number: "03",
    title: "Plan Together",
    description: "Book your date and keep every request organized.",
    icon: UsersIcon,
  },
]

export function HomeSections() {
  return (
    <>
      <section className="bg-[#f7f5ef] px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91a488]">
              Explore by category
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[#30362e] sm:text-5xl">
              Find every detail for your day
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon

              return (
                <motion.article
                  key={category.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <Link
                    href={category.href}
                    className="group relative block h-72 overflow-hidden rounded-sm bg-[#dfe5d8]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f271d]/75 via-transparent to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between text-white">
                      <h3 className="max-w-[70%] font-serif text-2xl leading-tight">
                        {category.name}
                      </h3>
                      <span className="grid size-11 place-items-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm transition-colors group-hover:bg-[#91a488]">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91a488]">
                Why choose WedPlan
              </p>
              <h2 className="mt-3 max-w-md font-serif text-4xl leading-tight text-[#30362e] sm:text-5xl">
                Planning made personal, simple and beautiful.
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-3">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon

                return (
                  <motion.article
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="rounded-sm border border-[#e1dfd5] bg-white p-6"
                  >
                    <Icon className="size-7 text-[#91a488]" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-5 font-serif text-xl text-[#30362e]">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#74796f]">
                      {benefit.description}
                    </p>
                  </motion.article>
                )
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-sm border border-[#dde2d7] bg-[#edf1e8] px-6 py-10 sm:px-10"
          >
            <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#788a70]">
              How WedPlan works
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon

                return (
                  <div key={step.number} className="relative text-center">
                    <span className="text-xs font-medium tracking-[0.2em] text-[#91a488]">
                      {step.number}
                    </span>
                    <Icon
                      className="mx-auto mt-3 size-7 text-[#65775d]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 font-serif text-2xl text-[#30362e]">{step.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#74796f]">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
