
"use client";
/** Implements the trending ad component and its related interface behavior. */


import Image from "next/image";

type Banner = {
  id: number;
  title: string;
  imageUrl: string;
  targetUrl?: string;
};

type Props = {
  banner: Banner | null;
};

/** Renders the trending ad interface. */
export default function TrendingAd({ banner }: Props) {
  if (!banner) return null;

  return (
    <section className="py-[80px] w-full bg-[#F7F7F7]">
      <div className="max-w-[1320px] mx-auto px-[12px]">
        <p className="text-center text-[#616C74] text-sm mb-4">
          Advertisement
        </p>

        <div className="rounded-xl overflow-hidden">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/banners/${banner.id}/click`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-full h-[218px]">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                quality={70}
                className="object-cover"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}