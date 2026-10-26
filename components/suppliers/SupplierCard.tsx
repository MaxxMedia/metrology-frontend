"use client"
/** Implements the suppliers supplier card component and its related interface behavior. */


import Image from "next/image"
import { Supplier } from "@/types/Supplier"

/** Renders the supplier card interface. */
export default function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <article className="border rounded p-6 flex gap-6">
      
      {/* LOGO */}
      <div className="relative w-32 h-32 shrink-0">
        <Image
          src={supplier.logoUrl || "/placeholder.svg"}
          alt={supplier.name}
          fill
          className="object-contain"
          sizes="128px"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold">{supplier.name}</h3>

        <p className="text-sm text-gray-500 mb-2">
          {supplier.company?.location || "Location not specified"}
        </p>

        <p className="text-gray-700 mb-4 line-clamp-4">
          {supplier.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-3 text-gray-600">
            {supplier.socialLinks?.facebook && <span>FB</span>}
            {supplier.socialLinks?.linkedin && <span>IN</span>}
            {supplier.socialLinks?.twitter && <span>X</span>}
            {supplier.socialLinks?.youtube && <span>YT</span>}
          </div>

          <button className="bg-red-600 text-white px-4 py-2 font-bold">
            VIEW SHOWROOM
          </button>
        </div>
      </div>

    </article>
  )
}