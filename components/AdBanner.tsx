"use client"
/** Implements the ad banner component and its related interface behavior. */


import Image from "next/image"

/** Renders the ad banner interface. */
export default function AdBanner() {
  return (
    <div className="w-full bg-gray-50 flex justify-center py-3 border-b border-gray-300">
      <div className="w-full max-w-4xl px-3">
        <div className="bg-white border border-gray-300 p-4 flex items-center gap-4">

          {/* Left Image */}
          <div className="relative h-16 w-24 shrink-0">
            <Image
              src="/american-flag-military.jpg"
              alt="Charity Advertisement"
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>

          {/* Text Section */}
          <div className="flex-1">
            <h3 className="font-bold text-base text-gray-900 leading-snug">
              THEY GAVE THEIR ALL. LET'S GIVE SOME BACK.
            </h3>
            <p className="text-xs text-gray-700 mt-1 leading-snug">
              We provide severely injured service members with personalized tablet computers that assist them with
              rehabilitation and recovery.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-bold mt-2 rounded">
              Please Donate Today!
            </button>
          </div>

          {/* Right Image */}
          <div className="relative h-14 w-20 shrink-0">
            <Image
              src="/warriors-logo.jpg"
              alt="Warriors"
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>

        </div>
      </div>
    </div>
  )
}