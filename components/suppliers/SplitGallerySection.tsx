"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
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
// and Facilities Gallery, so both sections look like one component
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
    const [selected, setSelected] = useState<SectionItem | null>(null)

    const totalPages = Math.max(1, Math.ceil(items.length / cardsPerPage))
    const start = page * cardsPerPage
    const visibleItems = items.slice(start, start + cardsPerPage)

    const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
    const goNext = () => setPage((p) => (p + 1) % totalPages)

    return (
        <div className="bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-gray-500">
                    Showing {start + 1}-{Math.min(start + cardsPerPage, items.length)} of {items.length}
                </span>

                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button
                            onClick={goPrev}
                            className="p-1.5 rounded-full border border-[#292C30] text-gray-400 hover:bg-[#171A1E] hover:text-white transition"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={goNext}
                            className="p-1.5 rounded-full border border-[#292C30] text-gray-400 hover:bg-[#171A1E] hover:text-white transition"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-white leading-snug">{heading}</h3>
                    {description && <p className="text-sm text-gray-400 mt-3">{description}</p>}
                    {ctaLabel && ctaHref && (
                        <a
                            href={ctaHref}
                            className="inline-flex items-center gap-1 mt-5 text-sm font-medium border border-[#292C30] text-[#CCCCCC] rounded-lg px-4 py-2 w-fit hover:border-[#0073FF] hover:text-white transition"
                        >
                            {ctaLabel} →
                        </a>
                    )}
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {visibleItems.map((item, idx) => (
                        <div
                            key={start + idx}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelected(item)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setSelected(item)
                            }}
                            className="cursor-pointer"
                        >
                            <GalleryCard image={item.image} title={item.name} description={item.description} />
                        </div>
                    ))}
                </div>
            </div>

            {
                selected && (
                    <div
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <div
                            className="bg-[#1D2125] border border-[#292C30] rounded-xl overflow-hidden max-w-md w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative bg-black">
                                <img
                                    src={selected.image}
                                    alt={selected.name || heading}
                                    className="w-full max-h-[50vh] object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    aria-label="Close"
                                    className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white p-1.5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {(selected.name || selected.description) && (
                                <div className="p-4">
                                    {selected.name && (
                                        <h4 className="font-semibold text-white">{selected.name}</h4>
                                    )}
                                    {selected.description && (
                                        <p className="text-sm text-gray-400 mt-1">{selected.description}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    )
}