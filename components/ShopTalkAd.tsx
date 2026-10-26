/** Implements the shop talk ad component and its related interface behavior. */
/** Renders the shop talk ad interface. */
export default function ShopTalkAd() {
  return (
    <div className="w-full bg-gradient-to-r from-teal-900 to-slate-900 text-white py-8 px-4 my-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Shop Talk Logo */}
        <div className="flex-shrink-0">
          <div className="bg-white rounded-full p-4 w-32 h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600">Shop</div>
              <div className="text-4xl font-bold text-teal-700">Talk</div>
            </div>
          </div>
        </div>

        {/* Center Text */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">The Shop Talk column</h2>
          <p className="text-lg mb-4">shares community stories and lessons monthly!</p>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="font-bold">Presented by</p>
              <p className="text-lg font-bold">Tooling Technology.</p>
            </div>
            <div>
              <p className="font-bold">Sponsored by</p>
              <p className="text-2xl font-bold text-red-500">Canon</p>
              <p className="text-xs">CANON VIRGINIA, INC.</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 whitespace-nowrap">
            SUBMIT YOUR STORIES TODAY! &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
