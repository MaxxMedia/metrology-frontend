"use client"
/** Implements the suppliers supplier filters component and its related interface behavior. */


/** Renders the supplier filters interface. */
export default function SupplierFilters() {
  return (
    <aside className="space-y-4">
      <input className="w-full border p-2" placeholder="Search by supplier name" />
      <input className="w-full border p-2" placeholder="Search by location" />
      <input className="w-full border p-2" placeholder="Search by product category" />

      <label className="flex items-center gap-2 mt-2">
        <input type="checkbox" />
        Featured Suppliers
      </label>

      <div className="border-t pt-4 space-y-3 max-h-[70vh] overflow-y-auto">
        {[
          "Additive Manufacturing",
          "Automation & AI",
          "Materials",
          "ToolingMaking",
          "Metalworking",
          "Workholding",
        ].map((cat) => (
          <details key={cat}>
            <summary className="cursor-pointer font-semibold">
              {cat}
            </summary>
            <div className="pl-4 text-sm text-gray-600 mt-2">
              <label className="block">
                <input type="checkbox" className="mr-2" />
                Example Option
              </label>
            </div>
          </details>
        ))}
      </div>
    </aside>
  )
}
