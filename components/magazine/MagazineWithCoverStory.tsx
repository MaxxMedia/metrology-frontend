"use client"
/** Implements the magazine magazine with cover story component and its related interface behavior. */


import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

type CoverStory = {
  id: number
  title: string
  slug: string
  shortDescription?: string | null
  badge?: string | null
  coverImageUrl?: string | null
}

type Magazine = {
  id: number
  title: string
  slug: string
  coverImageUrl?: string | null
  createdAt?: string
  coverStory?: CoverStory | null
  author?: { name?: string | null } | null
}

/** Renders the magazine with cover story interface. */
export default function MagazineWithCoverStory() {
  const [magazine, setMagazine] = useState<Magazine | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load magazines")
        return res.json()
      })
      .then((data) => {
        const magazines: Magazine[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
        if (!cancelled) setMagazine(magazines[0] || null)
      })
      .catch((error) => {
        console.error("Error fetching latest magazine:", error)
        if (!cancelled) setMagazine(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const issueDate = magazine?.createdAt
    ? new Date(magazine.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null

  if (loading) {
    return (
      <section className="bg-[#f3f6f8] px-5 py-16 sm:px-8">
        <div className="mx-auto h-[440px] max-w-7xl animate-pulse rounded-3xl bg-[#dce5eb]" />
      </section>
    )
  }

  if (!magazine) {
    return (
      <section className="bg-[#f3f6f8] px-5 py-16 text-center sm:px-8">
        <p className="text-lg font-semibold text-[#003049]">No magazine issues are available yet.</p>
      </section>
    )
  }

  return (
    <section id="latest-issue" className="bg-[#f3f6f8] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-[#dce4ea] lg:grid-cols-[350px_minmax(0,1fr)]">
        <div className="flex flex-col items-center bg-[#003049] px-7 py-9 text-center text-white sm:px-10 lg:items-start lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77c7ff]">Latest issue</p>
          <Link
            href={`/magazines/${magazine.slug}`}
            className="group relative mt-6 block aspect-[3/4] w-52 overflow-hidden rounded-lg bg-white/10 shadow-2xl ring-1 ring-white/20 transition-transform hover:-translate-y-1 sm:w-60"
          >
            <Image
              src={magazine.coverImageUrl || "/placeholder.svg"}
              alt={`${magazine.title} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 240px, 300px"
              priority
            />
          </Link>
          {issueDate && <p className="mt-6 text-sm font-semibold text-white/70">{issueDate}</p>}
          <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{magazine.title}</h2>
          {magazine.author?.name && <p className="mt-2 text-sm text-white/70">Edited by {magazine.author.name}</p>}
          <Link
            href={`/magazines/${magazine.slug}`}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0073ff] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#005fd1]"
          >
            Explore this issue <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>

        {magazine.coverStory ? (
          <div className="relative flex min-h-[360px] items-end overflow-hidden bg-[#102a3a] sm:min-h-[480px]">
            {magazine.coverStory.coverImageUrl && (
              <Image
                src={magazine.coverStory.coverImageUrl}
                alt={magazine.coverStory.title}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071923] via-[#071923]/60 to-transparent" />
            <div className="relative z-10 max-w-3xl p-7 text-white sm:p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#77c7ff]">Cover story</p>
              {magazine.coverStory.badge && (
                <span className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  {magazine.coverStory.badge}
                </span>
              )}
              <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {magazine.coverStory.title}
              </h3>
              {magazine.coverStory.shortDescription && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                  {magazine.coverStory.shortDescription}
                </p>
              )}
              <Link
                href={`/magazines/${magazine.slug}/cover-story/${magazine.coverStory.slug}`}
                className="mt-7 inline-flex items-center gap-2 font-bold text-white underline decoration-[#77c7ff] underline-offset-4 hover:text-[#77c7ff]"
              >
                Read the cover story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center bg-white p-8 text-center sm:min-h-[420px]">
            <p className="max-w-md text-[#647481]">The cover story for this issue will be announced soon.</p>
          </div>
        )}
      </div>
    </section>
  )
}
