"use client"
/** Implements the suppliers supplier list component and its related interface behavior. */


import { Supplier } from "@/types/Supplier"
import SupplierCard from "./SupplierCard"

/** Renders the supplier list interface. */
export default function SupplierList({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Search Results</h2>
          <p className="text-sm text-gray-500">
            {suppliers.length} results
          </p>
        </div>

        <select className="border p-2">
          <option>Alphabetical</option>
          <option>Location</option>
        </select>
      </div>

      <div className="space-y-6">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </section>
  )
}
