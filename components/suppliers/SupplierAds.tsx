"use client"
/** Implements the suppliers supplier ads component and its related interface behavior. */


import Image from "next/image"

const ads = ["/ads/ad1.jpg", "/ads/ad2.jpg", "/ads/ad3.jpg"]

/** Renders the supplier ads interface. */
export default function SupplierAds() {
  return (
    <aside className="space-y-6 sticky top-24 h-fit">
      {ads.map((ad, index) => (
        <div key={index} className="relative w-full h-[250px] border">
          <Image
            src={ad}
            alt={`Advertisement ${index + 1}`}
            fill
            className="object-cover"
            sizes="300px"
          />
        </div>
      ))}
    </aside>
  )
}