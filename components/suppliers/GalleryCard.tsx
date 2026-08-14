type GalleryCardProps = {
    image: string
    title?: string
    description?: string
}

export default function GalleryCard({ image, title, description }: GalleryCardProps) {
    return (
        <div className="bg-[#1D2125] rounded-xl overflow-hidden border border-[#292C30] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="aspect-[4/3] overflow-hidden bg-[#171A1E]">
                {image ? (
                    <img
                        src={image}
                        alt={title || "Gallery image"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No image
                    </div>
                )}
            </div>
            {(title || description) && (
                <div className="p-4">
                    {title && <h4 className="font-semibold text-white text-sm">{title}</h4>}
                    {description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</p>
                    )}
                </div>
            )}
        </div>
    )
}
