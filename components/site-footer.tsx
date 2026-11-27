import Link from "next/link"
import {
  BriefcaseIcon,
  CameraIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react"
import { WedPlanLogo } from "@/components/wedplan-logo"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e2dfd6] bg-[#f7f5ef] text-[#30362e]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <WedPlanLogo light />
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#74796f]">
            Discover trusted wedding professionals and plan every memorable detail in one place.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Important Links</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[#74796f] transition-colors hover:text-[#829d78]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#74796f]">
            <li className="flex items-start gap-2">
              <MailIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href="mailto:hello@Wedora.com" className="hover:text-primary">
                hello@Wedora.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <PhoneIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href="tel:+8801700000000" className="hover:text-primary">
                +880 1700-000000
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Follow Us</h2>
          <div className="mt-4 flex gap-2">
            {[
              { href: "https://facebook.com", label: "Facebook", Icon: GlobeIcon },
              { href: "https://instagram.com", label: "Instagram", Icon: CameraIcon },
              { href: "https://twitter.com", label: "Twitter", Icon: MessageCircleIcon },
              { href: "https://linkedin.com", label: "LinkedIn", Icon: BriefcaseIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-lg border border-[#d9d6cc] text-[#74796f] transition-colors hover:border-[#91a488] hover:text-[#829d78]"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#e2dfd6]">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-[#858980] sm:px-6 sm:text-left">
          © {new Date().getFullYear()} Wedora. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
