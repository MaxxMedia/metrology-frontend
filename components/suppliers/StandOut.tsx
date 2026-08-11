import Link from "next/link";

export default function StandOut() {
  return (
    <section className="bg-[#1D247B] border-t border-[#292C30] py-12 px-6 sm:px-12 my-8 rounded-xl max-w-[1520px] mx-auto">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="max-w-[760px]">
          <h2 className="mb-3 text-[#00B5ED] text-2xl font-bold">Stand Out</h2>

          <p className="text-white text-[16px] leading-relaxed">
            Enhance your listing with your company logo, profile, social networks and
            unlimited product categories.
          </p>
        </div>

        {/* Right */}
        <Link href="/paid-packages">
          <button className="bg-[#0073FF] hover:bg-[#0060d6] text-white px-8 py-3.5 text-base font-semibold rounded-lg shadow-md transition whitespace-nowrap">
            Find Out How
          </button>
        </Link>
      </div>
    </section>
  );
}
