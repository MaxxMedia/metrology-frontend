// components/suppliers/ProductGalleryPremium.tsx
"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

type GalleryItem = { image: string; name?: string; description?: string }

type ProductGalleryPremiumProps = {
  images: GalleryItem[] | string[]
}

function normalize(items: GalleryItem[] | string[]): GalleryItem[] {
  return items
    .map((item) => (typeof item === "string" ? { image: item } : item))
    .filter((item) => item && item.image && item.image.trim().length > 0)
}

export default function ProductGalleryPremium({ images }: ProductGalleryPremiumProps) {
  const items = normalize(images)
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) return null

  const active = items[Math.min(activeIndex, items.length - 1)]

  const goPrev = () => setActiveIndex((i) => (i - 1 + items.length) % items.length)
  const goNext = () => setActiveIndex((i) => (i + 1) % items.length)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <span className="text-xs font-medium text-gray-400">
          Image {activeIndex + 1} of {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Vertical thumbnails */}
        <div className="md:col-span-1 flex md:flex-col items-center gap-2">
          <button
            onClick={goPrev}
            disabled={items.length <= 1}
            className="p-1 text-gray-400 hover:text-gray-600 transition disabled:opacity-30"
            aria-label="Previous image"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-64">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition ${idx === activeIndex ? "border-red-600" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={items.length <= 1}
            className="p-1 text-gray-400 hover:text-gray-600 transition disabled:opacity-30"
            aria-label="Next image"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Large preview - now on the left */}
        <div className="md:col-span-6">
          <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 aspect-[4/3]">
            <img
              src={active.image}
              alt={active.name || "Product image"}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Product info - now on the right */}
        <div className="md:col-span-5 flex flex-col justify-center">
          {active.name && <h3 className="text-lg font-bold text-gray-900">{active.name}</h3>}
          {active.description && (
            <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">{active.description}</p>
          )}
          {/* Note: the mockup shows a checklist (✓ Real-time defect detection, etc.)
              under the description. That's not part of the current data model
              (only image/name/description per item). If you add a `features: string[]`
              field to the gallery item schema, render it here as a bullet list. */}
        </div>
      </div>
    </div>
  )
}