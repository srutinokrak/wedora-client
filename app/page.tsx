import { FeaturedServices } from "@/components/featured-services"
import { HeroSection } from "@/components/hero-section"
import { HomeSections } from "@/components/home-sections"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedServices />
      <HomeSections />
    </main>
  )
}
