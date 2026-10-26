"use client"
/** Implements the loader component and its related interface behavior. */


/** Renders the loader interface. */
export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative w-24 h-24">
        {/* Spinner Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-[#0073FF] animate-spin" />

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
            <span className="text-2xl font-bold text-[#0073FF]">M</span>
          </div>
        </div>
      </div>
    </div>
  )
}
