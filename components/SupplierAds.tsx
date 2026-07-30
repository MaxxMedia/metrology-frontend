// SupplierAds.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Banner = {
  id: number
  title: string
  imageUrl: string
  targetUrl?: string
  placement: string
}

export default function SupplierAds() {
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    const fetchSidebarAds = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners?placement=SIDEBAR`
      )
      const data = await res.json()
      setBanners(Array.isArray(data) ? data.slice(0, 3) : [])
    }

    fetchSidebarAds()
  }, [])

  return (
    <div className="space-y-6 sticky top-6">
      {banners.map((ad) => (
        <Ad key={ad.id} ad={ad} />
      ))}
    </div>
  )
}

/* ---------- AD COMPONENT ---------- */

function Ad({ ad }: { ad: Banner }) {
  return (
    <Link
      href={ad.targetUrl || "#"}
      target="_blank"
      className="block w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border border-gray-200"
    >
      {/*
        Fills the FULL WIDTH of its container - no fixed 300px box, so no
        side white space regardless of how wide the sidebar column is.
        Height is derived from the 300:250 aspect ratio, so proportions
        stay consistent at any width.

        object-fill (not object-cover) shows the ENTIRE image with nothing
        cropped - it stretches to exactly fill the box instead. If a
        particular banner looks stretched, the real fix is asking whoever
        uploads it to export closer to a 300x250 (6:5) ratio.
      */}
      <div className="relative w-full" style={{ aspectRatio: "200 / 150" }}>
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          sizes="300px"
          className="object-fill"
        />
      </div>
    </Link>
  )
}

/* ---------- RECRUITER CTA AD ---------- */
function RecruiterAd({ src }: { src: string }) {
  return (
    <Link
      href="/signup?role=recruiter"
      className="relative block group overflow-hidden w-full"
    >
      <div className="relative w-full" style={{ aspectRatio: "300 / 250" }}>
        <Image
          src={src}
          alt="Hire Candidates"
          fill
          sizes="300px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-white text-xl font-bold mb-2">
            Hiring Talent?
          </h3>
          <p className="text-white/90 text-sm mb-4">
            Register your company & post jobs
          </p>

          <span className="inline-block bg-indigo-600 text-white px-4 py-2 text-sm font-semibold group-hover:bg-indigo-700 transition">
            Hire Candidates
          </span>
        </div>
      </div>
    </Link>
  )
}