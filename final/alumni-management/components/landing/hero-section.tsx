"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Briefcase, Calendar } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HeroSection() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation()
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation()

  return (
    <section className="bg-gradient-to-br from-background to-muted py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div
          ref={heroRef}
          className={`transition-all duration-1000 ease-out ${
            heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            <span className="inline-block animate-slide-in-left">Connect.</span>{" "}
            <span className="inline-block animate-slide-in-left animation-delay-300">Grow.</span>{" "}
            <span className="inline-block animate-slide-in-left animation-delay-600">Succeed.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty animate-fade-in-up animation-delay-900">
            Join our thriving alumni community where students, graduates, and professionals connect to share
            opportunities, knowledge, and experiences that shape successful careers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-1200">
            <Button size="lg" asChild className="transform hover:scale-105 transition-transform">
              <Link href="/auth/signup">Join Our Community</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="transform hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/directory">Explore Alumni</Link>
            </Button>
          </div>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
              featuresVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Users className="h-12 w-12 text-primary mb-4 hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Alumni Network</h3>
            <p className="text-muted-foreground">Connect with thousands of alumni across industries and locations</p>
          </div>

          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ease-out animation-delay-200 ${
              featuresVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Briefcase className="h-12 w-12 text-primary mb-4 hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Career Opportunities</h3>
            <p className="text-muted-foreground">Discover job openings and internships shared by our community</p>
          </div>

          <div
            className={`flex flex-col items-center text-center transition-all duration-700 ease-out animation-delay-400 ${
              featuresVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Calendar className="h-12 w-12 text-primary mb-4 hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Events & Networking</h3>
            <p className="text-muted-foreground">
              Attend exclusive events and build meaningful professional relationships
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
