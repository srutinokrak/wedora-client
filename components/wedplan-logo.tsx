import Link from "next/link"
import { HeartIcon } from "lucide-react"

export function WedPlanLogo({
  light = false,
  iconOnly = false,
}: {
  light?: boolean
  iconOnly?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="Wedora home"
      className="flex shrink-0 items-center gap-2"
    >
      <span
        className={
          light
            ? "relative grid size-10 place-items-center rounded-full border border-[#a7bc9b] text-[#7f9874]"
            : "relative grid size-10 place-items-center rounded-full border border-[#9aaf90] text-[#9aaf90]"
        }
      >
        <HeartIcon className="size-4" fill="currentColor" aria-hidden="true" />
        <span
          className={
            light
              ? "absolute -bottom-1 h-2 w-5 border-b border-[#a7bc9b]"
            : "absolute -bottom-1 h-2 w-5 border-b border-[#9aaf90]"
          }
          aria-hidden="true"
        />
      </span>
      {!iconOnly && (
        <span className="leading-none">
          <span
            className={
              light
                ? "block font-serif text-xl italic tracking-wide text-[#2f3a2d]"
                : "block font-serif text-xl italic tracking-wide text-[#30362e]"
            }
          >
            Wedora
          </span>
          <span
            className={
              light
                ? "mt-1 block text-[8px] font-medium tracking-[0.32em] text-[#7f9874]"
                : "mt-1 block text-[8px] font-medium tracking-[0.32em] text-[#9aaf90]"
            }
          >
            WEDDINGS
          </span>
        </span>
      )}
    </Link>
  )
}
