/** Implements the suppliers supplier card interface and its related behavior. */
import Link from "next/link"
import Image from "next/image"

type Supplier = {
  id: number
  name: string
  slug: string
  logoUrl?: string
  website?: string
}

/** Renders the supplier card interface. */
export default function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <div className="border rounded-lg p-5 hover:shadow-md transition">
      <div className="h-20 flex items-center justify-center mb-4">
        {supplier.logoUrl ? (
          <Image
            src={supplier.logoUrl}
            alt={supplier.name}
            width={120}
            height={60}
            className="object-contain"
          />
        ) : (
          <div className="text-gray-400">No Logo</div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">
        {supplier.name}
      </h2>

      {supplier.website && (
        <a
          href={supplier.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline block mb-4"
        >
          Visit Website
        </a>
      )}

      <Link
        href={`/suppliers/${supplier.slug}`}
        className="inline-block mt-auto bg-black text-white px-4 py-2 text-sm rounded"
      >
        View Showroom
      </Link>
    </div>
  )
}
