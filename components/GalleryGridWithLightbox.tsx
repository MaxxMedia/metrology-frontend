"use client"

import { useState } from "react"
import { X } from "lucide-react"

function getImage(item: any): string {
    return typeof item === "string" ? item : item?.image || ""
}
function getName(item: any): string {
    return typeof item === "string" ? "" : item?.name || ""
}
function getDescription(item: any): string {
    return typeof item === "string" ? "" : item?.description || ""
}

export default function GalleryGridWithLightbox({
    items,
    title,
}: {
    items: any[]
    title?: string
}) {
    const [selected, setSelected] = useState<any | null>(null)

    const filtered = (items || []).filter((item) => {
        if (typeof item === "string") return item.trim().length > 0
        return item && item.image && item.image.trim().length > 0
    })

    if (filtered.length === 0) return null

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.map((item, index) => {
                    const image = getImage(item)
                    const name = getName(item)
                    const description = getDescription(item)
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelected(item)}
                            className="text-left bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition"
                        >
                            <div className="aspect-square overflow-hidden">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={name || title || "Gallery image"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>
                            {(name || description) && (
                                <div className="p-4">
                                    {name && <h4 className="font-medium text-gray-800">{name}</h4>}
                                    {description && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
                                    )}
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-black">
                            <img
                                src={getImage(selected)}
                                alt={getName(selected) || title || "Gallery image"}
                                className="w-full max-h-[60vh] object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                aria-label="Close"
                                className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70 text-white p-1.5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {(getName(selected) || getDescription(selected)) && (
                            <div className="p-5">
                                {getName(selected) && (
                                    <h4 className="font-semibold text-lg text-gray-800">{getName(selected)}</h4>
                                )}
                                {getDescription(selected) && (
                                    <p className="text-sm text-gray-600 mt-2">{getDescription(selected)}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}