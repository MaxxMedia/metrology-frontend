import Link from "next/link";

export default function StandOut() {
  return (
    <section
      className="relative h-[300px] overflow-hidden"
      style={{
        backgroundImage: "url('/standout-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative max-w-[1320px] mx-auto h-full flex items-center justify-between px-16">
        {/* Left */}
        <div className="max-w-[760px]">
          <h2 className="mb-4 text-[#0DCAF0]">Stand Out</h2>

          <p className="text-white text-[16px] leading-relaxed">
            Enhance your listing with your company logo, profile, social networks and
            unlimited product categories.
          </p>
        </div>

        {/* Right */}
        <Link href="/paid-packages">
          <button className="bg-[#D71920] hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold whitespace-nowrap transition">
            Find Out How
          </button>
        </Link>
      </div>
    </section>
  );
}
