"use client"
/** Implements the coming soon page and its route-specific behavior. */


import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/** Renders the coming soon page interface. */
export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F5B78] via-[#083A54] to-[#021E2D] flex items-center justify-center px-6">

      <div className="text-center max-w-2xl">

        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-2 bg-white/10 text-white rounded-full text-sm tracking-wide backdrop-blur">
          🚀 Mobile App
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          We’re Launching <br /> Something Amazing
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg md:text-xl mb-10">
          Our Tooling Technology mobile app is currently in development.
          Stay tuned — it will be launching soon on both Android and iOS.
        </p>

        {/* Animated Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#B30F24] hover:bg-[#C41524] text-white px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Decorative Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(179,15,36,0.25),_transparent_60%)] pointer-events-none"></div>

      </div>
    </div>
  )
}