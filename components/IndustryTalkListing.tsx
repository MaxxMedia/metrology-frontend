"use client"

import Link from "next/link"
import { useSearchParams, usePathname } from "next/navigation"
import type { Post } from "@/types/Post"
import Image from "next/image"
import Banner from "@/components/Banners/Banner"
import {
  Search,
  Headphones,
  User,
  AudioLines,
  Calendar,
  Clock,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Mic,
  ListFilter,
} from "lucide-react"

type Props = {
  posts: Post[]
}

const PAGE_SIZE = 10 // posts shown per page

/**
 * Builds the [1, 2, 3, "...", totalPages] style page list,
 * always keeping first, last, and a window around currentPage.
 */
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

function getPlainText(html: string) {
  if (!html) return ""
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim()
}

function isNew(publishedAt?: string | null) {
  if (!publishedAt) return false
  const days = (Date.now() - new Date(publishedAt).getTime()) / 86400000
  return days <= 14
}

export default function IndustryTalkListing({ posts }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))

  const pagePosts = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const categoryCounts = posts.reduce<Record<string, number>>((acc, p) => {
    const key = p.badge || "Industry Talks"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const popular = posts.slice(0, 3)

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    return `${pathname}?${params.toString()}`
  }

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
            <div className="w-14 h-14 rounded-full bg-[#0F5B78]/20 border border-[#0F5B78]/40 flex items-center justify-center flex-shrink-0">
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

      {/* ================= FILTER BAR ================= */}
      {/* <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 -mt-8 relative z-10 p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search industry talks..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5B78]"
            />
          </div>
          <button type="button" className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 min-w-[150px]">
            All Categories
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button type="button" className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 min-w-[150px]">
            All Guests
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button type="button" className="flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600">
            <ListFilter size={14} className="text-gray-400" />
            Sort by: Latest
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </section> */}

      {/* ================= CONTENT AREA ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {pagePosts.map((post) => {
              const imageUrl =
                post.imageUrl?.startsWith("http")
                  ? post.imageUrl
                  : post.imageUrl
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                  : "/placeholder.svg"

              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""

              const plainText = getPlainText(post.excerpt || post.content || "")
              const indexInFullList = posts.findIndex(p => p.id === post.id)
              const episodeNo = posts.length - indexInFullList
              const authorCompany = (post.author as any)?.Company ?? (post.author as any)?.company

              return (
                <article
                  key={post.id}
                  className="relative bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-5"
                >
                  {/* <button
                    type="button"
                    aria-label="More options"
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                  >
                    <MoreVertical size={16} />
                  </button> */}

                  <Link
                    href={`/post/${post.slug}`}
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
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {post.author?.name && (
                      <p className="text-sm text-gray-700 font-medium">
                        {post.author.name}
                        {authorCompany && (
                          <span className="text-gray-500 font-normal">, {authorCompany}</span>
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
                      {(post as any).duration && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {(post as any).duration}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/post/${post.slug}`}
                      className="flex items-center gap-1.5 text-[#0F5B78] font-semibold text-sm whitespace-nowrap"
                    >
                      {/* <AudioLines size={13} /> */}
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
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    aria-label="Previous page"
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </Link>
                ) : (
                  <span className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed">
                    <ChevronLeft size={16} />
                  </span>
                )}

                {pageList.map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="text-gray-400 px-1">
                      ...
                    </span>
                  ) : (
                    <Link
                      key={page}
                      href={buildPageHref(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={
                        page === currentPage
                          ? "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold bg-[#0F5B78] text-white"
                          : "w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                      }
                    >
                      {page}
                    </Link>
                  )
                )}

                {hasNext ? (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    aria-label="Next page"
                    className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </Link>
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

            {/* CATEGORIES */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="text-base font-bold text-gray-900 border-b-2 border-[#0F5B78] inline-block pb-1 mb-4">
                Categories
              </h3>
              <ul className="space-y-1">
                <li className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 text-[#0F5B78] font-semibold text-sm">
                  <span>All Talks</span>
                  <span className="bg-white text-[#0F5B78] text-xs font-bold px-2 py-0.5 rounded-full">
                    {posts.length}
                  </span>
                </li>
                {Object.entries(categoryCounts).map(([name, count]) => (
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
                      post.imageUrl?.startsWith("http")
                        ? post.imageUrl
                        : post.imageUrl
                        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                        : "/placeholder.svg"
                    return (
                      <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image src={imageUrl} alt={post.title} fill className="object-cover" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#0F5B78]">
                          {post.title}
                        </p>
                        <div className="w-8 h-8 rounded-full bg-[#0F5B78] text-white flex items-center justify-center flex-shrink-0 text-xs">
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
                  View All Popular Talks
                  <ArrowRight size={14} />
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