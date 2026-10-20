"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"

export type Magazine = {
  id?: number | string
  title: string
  slug: string
  description?: string | null
  coverImageUrl?: string | null
  createdAt?: string | null
}

type Props = {
  magazines?: Magazine[]
  limit?: number
  showTitle?: boolean
  variant?: "grid" | "featured"
}

export default function MagazineGrid({
  magazines: initialMagazines,
  limit,
  showTitle = true,
  variant = "grid",
}: Props) {

  const [magazines, setMagazines] = useState<Magazine[]>(initialMagazines || [])
  const [loading, setLoading] = useState(!initialMagazines)

  useEffect(() => {
    if (!initialMagazines) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines`)
        .then(res => res.json())
        .then(data => {
          setMagazines(data)
          setLoading(false)
        })
    }
  }, [initialMagazines])

  if (loading) return <p>Loading...</p>

  const displayMagazines = limit ? magazines.slice(0, limit) : magazines

  /* ================= FEATURED VERSION ================= */
  if (variant === "featured" && displayMagazines.length > 0) {
    const mag = displayMagazines[0]

    return (
      <div className="p-10 flex flex-col justify-center">
        <h2 className="text-[28px] font-bold text-black mb-8">
          Latest Issue
        </h2>

       <Link href={`/magazines/${mag.slug}`}>
  <div className="relative w-[220px] h-[300px] mb-6">
    <Image
      src={mag.coverImageUrl || "/placeholder.svg"}
      alt={mag.title}
      fill
      priority
      className="object-contain shadow-xl cursor-pointer"
      sizes="220px"
    />
  </div>
</Link>

        <p className="text-black font-semibold mb-2">
          {mag.createdAt
            ? new Date(mag.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : ""}
        </p>

        <span className="inline-block bg-[#C70000] text-white text-xs font-bold px-3 py-2 w-fit">
          DIGITAL EDITION
        </span>
      </div>
    )
  }

  /* ================= GRID VERSION ================= */
  return (
    <div className="space-y-8">
      {showTitle && (
        <h2 className="text-3xl font-bold">Digital Magazines</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayMagazines.map((mag) => (
          <Link key={mag.slug} href={`/magazines/${mag.slug}`}>
            <div className=" overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
              {mag.coverImageUrl && (
  <div className="relative w-full h-64">
    <Image
      src={mag.coverImageUrl}
      alt={mag.title}
      fill
      className="object-cover"
      sizes="(max-width:768px) 100vw, 33vw"
    />
  </div>
)}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{mag.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
