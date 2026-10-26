"use client"
/** Implements the sidebar component and its related interface behavior. */


/** Renders the sidebar interface. */
export default function Sidebar() {
  const ads = [
    { id: 1, title: "YOUR NIGHT CREW'S NEW TEAMMATE", bgGradient: "bg-gradient-to-br from-green-600 to-green-800" },
    { id: 2, title: "NEW INJECTION SYSTEM", bgGradient: "bg-gradient-to-br from-yellow-400 to-orange-500" },
    { id: 3, title: "YUDO PRECISION PACKAGING", bgGradient: "bg-gradient-to-br from-pink-400 to-pink-600" },
  ]

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-8 space-y-6">
        {/* Advertisement Section */}
        {ads.map((ad) => (
          <div key={ad.id} className="border border-gray-300 overflow-hidden">
            <div
              className={`${ad.bgGradient} text-white p-8 text-center text-xs font-bold h-48 flex items-center justify-center`}
            >
              {ad.title}
            </div>
            <div className="p-3 bg-gray-50 text-center text-xs text-gray-600">Advertisement</div>
          </div>
        ))}

        {/* Popular Topics */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow">
          <h3 className="font-bold text-gray-900 mb-4">Popular Topics</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                ToolingManufacturing
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Industry News
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Technology Trends
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Product Reviews
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Expert Interviews
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
