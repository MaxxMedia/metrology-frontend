"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import GalleryCard from "./GalleryCard"

export type SectionItem = {
    image: string
    name?: string
    description?: string
}

type SplitGallerySectionProps = {
    heading: string
    description?: string
    ctaLabel?: string
    ctaHref?: string
    items: SectionItem[]
    cardsPerPage?: number
}

// Reusable left-info / right-cards layout shared by Company Gallery
// and Industry Gallery, so both sections look like one component
// with different content fed in.
export default function SplitGallerySection({
    heading,
    description,
    ctaLabel,
    ctaHref,
    items,
    cardsPerPage = 3,
}: SplitGallerySectionProps) {
    const [page, setPage] = useState(0)
    const totalPages = Math.max(1, Math.ceil(items.length / cardsPerPage))
    const start = page * cardsPerPage
    const visibleItems = items.slice(start, start + cardsPerPage)

    const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
    const goNext = () => setPage((p) => (p + 1) % totalPages)

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-gray-400">
                    Showing {start + 1}-{Math.min(start + cardsPerPage, items.length)} of {items.length}
                </span>

                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button
                            onClick={goPrev}
                            className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={goNext}
                            className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-[#0b3954] leading-snug">{heading}</h3>
                    {description && <p className="text-sm text-gray-600 mt-3">{description}</p>}
                    {ctaLabel && ctaHref && (
                        <a
                        href = { ctaHref }
              className="inline-flex items-center gap-1 mt-5 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 w-fit hover:border-gray-400 hover:bg-gray-50 transition"
            >
                    {ctaLabel} →
                </a>
          )}
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {visibleItems.map((item, idx) => (
                    <GalleryCard key={start + idx} image={item.image} title={item.name} description={item.description} />
                ))}
            </div>
        </div>
    </div >
  )
}