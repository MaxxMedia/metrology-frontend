"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Banner from "@/components/Banners/Banner"
import {
  Headphones,
  User,
  AudioLines,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mic,
} from "lucide-react"

const PAGE_SIZE = 10

// ---------- types ----------
export type IndustryTalk = {
  id: number
  title: string
  slug: string
  interviewType?: string | null
  categoryId?: number | null
  industryId?: number | null
  industryName?: string | null // Added for easy access
  status: string
  featured: boolean
  trending: boolean
  homepage: boolean
  bannerImage?: string | null
  videoType?: string | null
  videoUrl?: string | null
  uploadedVideo?: string | null
  thumbnailUrl?: string | null
  duration?: number | null
  guestName: string
  designation?: string | null
  companyName?: string | null
  companyLogo?: string | null
  introduction?: string | null
  views: number
  shares: number
  publishedAt?: string | null
  createdAt: string
  // The Industry relation from the API
  industry?: {
    id: number
    name: string
    slug: string
  } | null
  category?: {
    id: number
    name: string
    slug: string
  } | null
}

// ---------- helpers ----------
function isNew(publishedAt?: string | null) {
  if (!publishedAt) return false
  const days = (Date.now() - new Date(publishedAt).getTime()) / 86400000
  return days <= 14
}

function formatDuration(seconds?: number | null) {
  if (!seconds && seconds !== 0) return ""
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1])
  const sorted = Array.from(pages)
    .filter(p => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const result: (number | "...")[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("...")
    result.push(p)
    prev = p
  }
  return result
}

// ---------- component ----------
export default function IndustryTalkListing({ post: allPosts }: { post: IndustryTalk[] }) {
  const [currentPage, setCurrentPage] = useState(1)

  const total = allPosts.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const posts = allPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Build category counts from industry names
  const categoryCounts = allPosts.reduce<Record<string, number>>((acc, p) => {
    // Use industryName if available, fallback to Industry.name or interviewType
    let key = "Uncategorized"
    
    if (p.industryName) {
      key = p.industryName
    } else if (p.industry?.name) {
      key = p.industry.name
    } else if (p.interviewType) {
      key = p.interviewType
    }
    
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const popular = allPosts.slice(0, 3)

  const pageList = getPageList(currentPage, totalPages)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative w-full bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/artificial-intelligence-technology.png"
            alt=""
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/90 to-black/40" />
        </div>

        <div className="hidden lg:block absolute top-10 right-16 border-2 border-[#B30F24] rounded-lg px-6 py-2 rotate-[-4deg]">
          <span className="text-[#B30F24] font-extrabold text-xl tracking-widest" style={{ textShadow: "0 0 12px rgba(179,15,36,0.6)" }}>
            ON AIR
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B78]" />
            <span className="text-[#0F5B78] text-xs font-bold tracking-[0.2em] uppercase">Podcast Series</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#0F5B78]/20 border border-[#0F5B78]/40 flex items-center justify-center shrink-0">
              <Mic size={24} className="text-[#0F5B78]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">Industry Talks</h1>
          </div>

          <p className="text-gray-300 max-w-xl mb-6">
            Conversations with industry leaders sharing insights, strategies and success stories.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Headphones size={16} className="text-[#0F5B78]" />
              Real Conversations
            </span>
            <span className="flex items-center gap-2">
              <User size={16} className="text-[#0F5B78]" />
              Industry Leaders
            </span>
            <span className="flex items-center gap-2">
              <AudioLines size={16} className="text-[#0F5B78]" />
              Actionable Insights
            </span>
          </div>
        </div>
      </section>

      {/* ================= CONTENT AREA ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {posts.map((post, i) => {
              const talkSlug = post.slug || post.id
              const imageUrl =
                post.bannerImage?.startsWith("http")
                  ? post.bannerImage
                  : post.bannerImage
                    ? `${process.env.NEXT_PUBLIC_API_URL}${post.bannerImage}`
                    : post.thumbnailUrl?.startsWith("http")
                      ? post.thumbnailUrl
                      : post.thumbnailUrl
                        ? `${process.env.NEXT_PUBLIC_API_URL}${post.thumbnailUrl}`
                        : "/placeholder.svg"

              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : ""

              const episodeNo = total - ((currentPage - 1) * PAGE_SIZE + i)
              const durationLabel = formatDuration(post.duration)

              return (
                <article
                  key={post.id}
                  className="relative bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-5"
                >
                  <Link
                    href={`/industry-talks/${talkSlug}`}
                    className="relative w-[140px] md:w-35 h-[110px] shrink-0 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 bg-[#0F5B78] rounded-full flex items-center justify-center text-white shadow-lg">
                        ▶
                      </div>
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#0F5B78] text-xs font-bold tracking-wide uppercase">
                        Episode {episodeNo}
                      </span>
                      {isNew(post.publishedAt) && (
                        <span className="bg-[#0F5B78]/10 text-[#0F5B78] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 leading-snug mb-1.5 hover:text-[#0F5B78] transition-colors">
                      <Link href={`/industry-talks/${talkSlug}`}>{post.title}</Link>
                    </h2>

                    {post.guestName && (
                      <p className="text-sm text-gray-700 font-medium">
                        {post.guestName}
                        {post.companyName && (
                          <span className="text-gray-500 font-normal">, {post.companyName}</span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="hidden md:flex items-center gap-8 shrink-0 pr-6">
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {date || "—"}
                      </span>
                      {durationLabel && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {durationLabel}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/industry-talks/${talkSlug}`}
                      className="flex items-center gap-1.5 text-[#0F5B78] font-semibold text-sm whitespace-nowrap"
                    >
                      View
                    </Link>
                  </div>
                </article>
              )
            })}

            {posts.length === 0 && (
              <p className="text-gray-500">No industry talks found.</p>
            )}

            {/* PAGINATION */}
            {posts.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {hasPrev ? (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    aria-label="Previous page"
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                ) : (
                  <span className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed">
                    <ChevronLeft size={16} />
                  </span>
                )}

                {pageList.map((pg, idx) =>
                  pg === "..." ? (
                    <span key={`ellipsis-${idx}`} className="text-gray-400 px-1">
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      aria-current={pg === currentPage ? "page" : undefined}
                      className={
                        pg === currentPage
                          ? "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold bg-[#0F5B78] text-white"
                          : "w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                      }
                    >
                      {pg}
                    </button>
                  )
                )}

                {hasNext ? (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <span className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed">
                    <ChevronRight size={16} />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-6 h-fit lg:sticky lg:top-24">

            {/* CATEGORIES - Now showing Industry Names */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-bold text-gray-900 border-b-2 border-[#0F5B78] inline-block pb-1 mb-4">
                Categories
              </h3>
              <ul className="space-y-1">
                <li className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 text-[#0F5B78] font-semibold text-sm">
                  <span>All Talks</span>
                  <span className="bg-white text-[#0F5B78] text-xs font-bold px-2 py-0.5 rounded-full">
                    {total}
                  </span>
                </li>
                {Object.entries(categoryCounts)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([name, count]) => (
                    <li
                      key={name}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50"
                    >
                      <span>{name}</span>
                      <span className="text-gray-400 text-xs font-medium">{count}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* POPULAR */}
            {popular.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4">Popular Talks</h3>
                <div className="space-y-4">
                  {popular.map(post => {
                    const imageUrl =
                      post.bannerImage?.startsWith("http")
                        ? post.bannerImage
                        : post.bannerImage
                          ? `${process.env.NEXT_PUBLIC_API_URL}${post.bannerImage}`
                          : post.thumbnailUrl?.startsWith("http")
                            ? post.thumbnailUrl
                            : post.thumbnailUrl
                              ? `${process.env.NEXT_PUBLIC_API_URL}${post.thumbnailUrl}`
                              : "/placeholder.svg"
                    return (
                      <Link
                        key={post.id}
                        href={`/industry-talks/${post.slug || post.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100">
                          <Image src={imageUrl} alt={post.title} fill className="object-cover" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#0F5B78]">
                          {post.title}
                        </p>
                        <div className="w-8 h-8 rounded-full bg-[#0F5B78] text-white flex items-center justify-center shrink-0 text-xs">
                          ▶
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <Link
                  href="#"
                  className="flex items-center gap-1.5 text-[#0F5B78] text-sm font-semibold mt-4 hover:underline"
                >
                  {/* View All Popular Talks */}
                  {/* <ArrowRight size={14} /> */}
                </Link>
              </div>
            )}

            <div aria-label="Sponsored">
              <Banner placement="INDUSTRY_TALKS_RIGHT" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}