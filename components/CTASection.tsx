"use client"
/** Implements the ctasection component and its related interface behavior. */


import Link from "next/link"
import { ArrowRight } from "lucide-react"

/** Renders the ctasection interface. */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden 
      bg-gradient-to-br from-[#4a0012] via-[#8b0020] to-[#e50018] 
      py-16 text-white">

      {/* 🔴 Radial Glow */}
      <div className="absolute inset-0 
        bg-[radial-gradient(at_100%_0,_#fe034040,_#0000_70%)] 
        pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        <h2 className="mb-6 text-4xl md:text-5xl font-extrabold leading-tight">
          Be Part of Our Global Story
        </h2>

        <p className="mb-10 text-lg text-white/90 max-w-3xl mx-auto">
          Join us as we continue shaping the future of B2B exhibitions —
          connecting industries, innovation, and people worldwide.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Primary Button */}
          <Link
            href="/events"
            className="group inline-flex items-center justify-center 
            rounded-full bg-white text-[#8b0020] 
            px-8 py-3 font-semibold 
            hover:bg-[#e50018] hover:text-white 
            transition-all duration-300"
          >
            Upcoming Events
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Outline Button */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center 
            rounded-full border-2 border-white 
            px-8 py-3 font-semibold 
            hover:bg-white hover:text-[#8b0020] 
            transition-all duration-300"
          >
            Contact Us
          </Link>

        </div>
      </div>
    </section>
  )
}
