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

export default function GalleryImageGrid({
    items,
    emptyLabel,
    columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
}: {
    items: any[]
    emptyLabel?: string
    columns?: string
}) {
    const [selected, setSelected] = useState<any | null>(null)

    const filtered = (items || []).filter((item) => {
        if (typeof item === "string") return item.trim().length > 0
        return item && item.image && item.image.trim().length > 0
    })

    if (filtered.length === 0) return null

    return (
        <div>
            <div className={`grid ${columns} gap-4`}>
                {filtered.map((item, index) => {
                    const image = getImage(item)
                    const name = getName(item)
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelected(item)}
                            className="text-left bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={image}
                                    alt={name || emptyLabel || "Gallery image"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {name && (
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-700 truncate">{name}</p>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    {/* Small popup, not full screen */}
                    <div
                        className="bg-white rounded-lg overflow-hidden max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-black">
                            <img
                                src={getImage(selected)}
                                alt={getName(selected) || "Gallery image"}
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
                        {(getName(selected) || getDescription(selected)) && (
                            <div className="p-4">
                                {getName(selected) && (
                                    <h4 className="font-semibold text-gray-800">{getName(selected)}</h4>
                                )}
                                {getDescription(selected) && (
                                    <p className="text-sm text-gray-600 mt-1">{getDescription(selected)}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}