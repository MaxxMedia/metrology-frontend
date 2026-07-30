import { DocumentViewer } from "./GalleryTabs"

function TagList({ items }: { items?: string[] }) {
    const filtered = (items || []).filter(Boolean)
    if (filtered.length === 0) return null
    return (
        <div className="flex flex-wrap gap-2">
            {filtered.map((item, i) => (
                <span
                    key={i}
                    className="inline-block bg-gray-100 text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full border border-gray-200"
                >
                    {item}
                </span>
            ))}
        </div>
    )
}

// Renders BEFORE the map section
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
        <div className="mt-8 bg-white rounded-lg shadow p-6 space-y-6">
            {hasBrands && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Brands Represented</h3>
                    <TagList items={brandsRepresented} />
                </div>
            )}
            {hasIndustries && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Industries Served</h3>
                    <TagList items={industriesServed} />
                </div>
            )}
            {hasExports && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Export Markets</h3>
                    <TagList items={exportMarkets} />
                </div>
            )}
        </div>
    )
}

// Renders AFTER the map section
export function ProductSuppliesSection({ productSupplies }: { productSupplies?: string[] }) {
    const filtered = (productSupplies || []).filter(Boolean)
    if (filtered.length === 0) return null

    return (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Supplies</h3>
            <TagList items={productSupplies} />
        </div>
    )
}

// Renders at the very bottom of the page
export function CertificationsSection({ certifications }: { certifications?: string[] }) {
    const filtered = (certifications || []).filter(Boolean)
    if (filtered.length === 0) return null

    return (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Certifications</h3>
            <DocumentViewer
                documents={filtered}
                title="Certifications"
                allowDownload={false}
            />
        </div>
    )
}