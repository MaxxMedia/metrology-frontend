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
      className="block w-full overflow-hidden rounded-xl shadow-lg hover:border-[#0073FF] transition duration-200 bg-[#1D2125] border border-[#292C30]"
    >
      <div className="relative w-full bg-[#171A1E]" style={{ aspectRatio: "200 / 150" }}>
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
      className="relative block group overflow-hidden w-full rounded-xl border border-[#292C30] shadow-lg"
    >
      <div className="relative w-full bg-[#171A1E]" style={{ aspectRatio: "300 / 250" }}>
        <Image
          src={src}
          alt="Hire Candidates"
          fill
          sizes="300px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-white text-xl font-bold mb-2">
            Hiring Talent?
          </h3>
          <p className="text-[#CCCCCC] text-sm mb-4">
            Register your company & post jobs
          </p>

          <span className="inline-block bg-[#0073FF] text-white px-5 py-2.5 rounded-xl text-sm font-bold group-hover:bg-[#0060d6] transition shadow-md">
            Hire Candidates
          </span>
        </div>
      </div>
    </Link>
  )
}