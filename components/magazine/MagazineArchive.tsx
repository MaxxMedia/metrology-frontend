"use client"
/** Implements the magazine magazine archive component and its related interface behavior. */


import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Banner from "@/components/Banners/Banner"

type Magazine = {
  id: number
  title: string
  slug: string
  coverImageUrl?: string | null
  createdAt?: string
}

/** Renders the magazine archive interface. */
export default function MagazineArchive() {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load magazines")
        return res.json()
      })
      .then((data) => {
        const list: Magazine[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        if (!cancelled) setMagazines(sorted)
      })
      .catch((error) => {
        console.error("Error fetching magazines:", error)
        if (!cancelled) setMagazines([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-9 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0073ff]">Browse past editions</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#003049] sm:text-4xl">Magazine archive</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#647481] sm:text-base">Explore previous issues and revisit the ideas shaping measurement and manufacturing.</p>
          </div>
          <span className="text-sm font-medium text-[#647481]">{magazines.length} {magazines.length === 1 ? "issue" : "issues"}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-[#e8eef2]" />
                ))}
              </div>
            ) : magazines.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4">
                {magazines.slice(0, 12).map((magazine) => {
                  const date = magazine.createdAt
                    ? new Date(magazine.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Digital edition"

                  return (
                    <article key={magazine.id} className="group min-w-0">
                      <Link
                        href={`/magazines/${magazine.slug}`}
                        className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-[#e8eef2] shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
                      >
                        <Image
                          src={magazine.coverImageUrl || "/placeholder.svg"}
                          alt={`${magazine.title} cover`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 220px"
                        />
                      </Link>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#0073ff]">{date}</p>
                      <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-[#17212b] sm:text-lg">
                        <Link href={`/magazines/${magazine.slug}`} className="transition-colors group-hover:text-[#0073ff]">
                          {magazine.title}
                        </Link>
                      </h3>
                      <Link
                        href={`/magazines/${magazine.slug}`}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#003049] hover:text-[#0073ff]"
                      >
                        View issue <span aria-hidden="true">→</span>
                      </Link>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#cbd6de] px-6 py-14 text-center">
                <h3 className="text-lg font-semibold text-[#003049]">No issues available yet</h3>
                <p className="mt-2 text-sm text-[#647481]">Published magazine issues will appear here.</p>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <Banner placement="Archive" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
