type GalleryCardProps = {
    image: string
    title?: string
    description?: string
}

// Shared card used by Company Gallery and Industry Gallery so both
// sections stay visually identical (radius, shadow, spacing, hover).
export default function GalleryCard({ image, title, description }: GalleryCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                {image ? (
                    <img
                        src={image}
                        alt={title || "Gallery image"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                    </div>
                )}
            </div>
            {(title || description) && (
                <div className="p-4">
                    {title && <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>}
                    {description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
                    )}
                </div>
            )}
        </div>
    )
}