import { DocumentViewer } from "./GalleryTabs"

function TagList({ items }: { items?: string[] }) {
    const filtered = (items || []).filter(Boolean)
    if (filtered.length === 0) return null
    return (
        <div className="flex flex-wrap gap-2">
            {filtered.map((item, i) => (
                <span
                    key={i}
                    className="inline-block bg-[#171A1E] text-gray-300 text-xs sm:text-sm px-3 py-1 rounded-full border border-[#292C30]"
                >
                    {item}
                </span>
            ))}
        </div>
    )
}

export function BrandsAndIndustries({
    brandsRepresented,
    industriesServed,
    exportMarkets,
}: {
    brandsRepresented?: string[]
    industriesServed?: string[]
    exportMarkets?: string[]
}) {
    const hasBrands = (brandsRepresented || []).filter(Boolean).length > 0
    const hasIndustries = (industriesServed || []).filter(Boolean).length > 0
    const hasExports = (exportMarkets || []).filter(Boolean).length > 0

    if (!hasBrands && !hasIndustries && !hasExports) return null

    return (
        <div className="bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg p-6 space-y-6 h-full">
            {hasBrands && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Brands Represented</h3>
                    <TagList items={brandsRepresented} />
                </div>
            )}
            {hasIndustries && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Industries Served</h3>
                    <TagList items={industriesServed} />
                </div>
            )}
            {hasExports && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Export Markets</h3>
                    <TagList items={exportMarkets} />
                </div>
            )}
        </div>
    )
}

export function ProductSuppliesSection({ productSupplies }: { productSupplies?: string[] }) {
    const filtered = (productSupplies || []).filter(Boolean)
    if (filtered.length === 0) return null

    return (
        <div className="mt-8 bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Product Supplies</h3>
            <TagList items={productSupplies} />
        </div>
    )
}

export function CertificationsSection({ certifications }: { certifications?: string[] }) {
    const filtered = (certifications || []).filter(Boolean)
    if (filtered.length === 0) return null

    return (
        <div className="mt-8 bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
            <DocumentViewer
                documents={filtered}
                title="Certifications"
                allowDownload={false}
            />
        </div>
    )
}
