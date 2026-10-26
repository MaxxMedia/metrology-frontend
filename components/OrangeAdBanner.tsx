"use client"
/** Implements the orange ad banner component and its related interface behavior. */


import Image from "next/image"

/** Renders the orange ad banner interface. */
export default function OrangeAdBanner() {
  return (
    <div className="w-full bg-orange-500 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">

        {/* Left Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            SWAP ToolingVERSION FASTER
          </h2>
          <p className="text-lg md:text-xl">
            Directly Through the parting Line
          </p>
        </div>

        {/* Right Product Image and Info */}
        <div className="flex-1 flex items-center justify-center relative">
          
          {/* Product Image */}
          <div className="relative w-full max-w-[300px] h-40">
            <Image
              src="/industrial-mold-tool-product.jpg"
              alt="CUMSA ToolingTool"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>

          {/* NEW Badge */}
          <div className="absolute top-0 right-0 bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-white text-sm">
            NEW
          </div>
        </div>

        {/* Logo Section */}
        <div className="text-center">
          <div className="bg-gray-700 rounded px-4 py-3 text-white font-bold text-sm mb-2">
            IC
          </div>
          <p className="text-sm font-semibold">
            INSERT CHANGER
          </p>
          <a
            href="#"
            className="text-white underline text-xs mt-2 block"
          >
            cumsausa.shop
          </a>
        </div>

      </div>
    </div>
  )
}