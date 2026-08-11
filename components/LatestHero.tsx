"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import type { Post } from "@/types/Post"

type LatestHeroProps = {
  post: Post
  posts: Post[]
}

/* ================= CONFIG ================= */

const ROTATE_INTERVAL = 5000
const FADE_DURATION = 500
/** 1 main hero + 2 bottom cards + 1 sidebar featured + 3 sidebar list */
const SLOT_COUNT = 7

const CATEGORY_COLORS: Record<string, string> = {
  gadget: "bg-[#00ad48]",
  digital: "bg-[#0073ff]",
  future: "bg-[#54bd05]",
  innovation: "bg-[#59a255]",
  tech: "bg-[#ff5733]",
  software: "bg-[#7C3AED]",
  automation: "bg-[#0EA5E9]",
  robotics: "bg-[#EF4444]",
  basics: "bg-[#0073ff]",
  trending: "bg-[#F59E0B]",
  latest: "bg-[#F69C00]",
  video: "bg-[#EF4444]",
  engineering: "bg-[#2563EB]",
}

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  LEADERSHIP: "bg-[#7C3AED]",
  AI: "bg-[#059669]",
  MANUFACTUR: "bg-[#F97316]",
  WEBINAR: "bg-[#7C3AED]",
  EVENT: "bg-[#0EA5E9]",
  TRENDING: "bg-[#F97316]",
  EXCLUSIVE: "bg-[#059669]",
  GADGET: "bg-[#00ad48]",
  DIGITAL: "bg-[#0073ff]",
  FUTURE: "bg-[#54bd05]",
  INNOVATION: "bg-[#59a255]",
  TECH: "bg-[#ff5733]",
}

/* ================= HELPERS ================= */

function getSlug(p: Post) {
  return typeof p.category === "object"
    ? p.category?.slug?.toLowerCase() || ""
    : String(p.category || "").toLowerCase()
}

function getRecency(p: Post) {
  const raw = (p as any).publishedAt || (p as any).createdAt
  return raw ? new Date(raw).getTime() : 0
}

function sortByRecency(a: Post, b: Post) {
  return getRecency(b) - getRecency(a)
}

function getAuthorName(p: Post): string {
  if (p.author && typeof p.author === "object" && p.author.name) {
    return p.author.name
  }
  const company = (p as any).Company || (p as any).company
  if (company?.name) return company.name
  return "rstheme"
}

function getImageUrl(p: Post): string {
  if (p.imageUrl?.startsWith("http")) return p.imageUrl
  if (p.imageUrl) return `${process.env.NEXT_PUBLIC_API_URL}${p.imageUrl}`
  return "/placeholder.svg"
}

function formatDate(p: Post, opts?: Intl.DateTimeFormatOptions) {
  if (!p.publishedAt) return ""
  return new Date(p.publishedAt).toLocaleDateString("en-US", opts || {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function truncateTitle(title: string, max = 48) {
  if (title.length <= max) return title
  return `${title.slice(0, max).trimEnd()}…`
}

function hasVideo(p: Post) {
  return Boolean(p.youtubeUrl)
}

function buildPool(posts: Post[]): Post[] {
  if (!Array.isArray(posts) || posts.length === 0) return []
  return [...posts].sort(sortByRecency)
}

function PulseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 12h3l2-5 3 10 2-6 2 3h6" />
    </svg>
  )
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5" aria-hidden>
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  )
}

export default function LatestHero({ post, posts }: LatestHeroProps) {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const pool = useMemo(() => buildPool(posts), [posts])

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[LatestHero] posts received:", posts?.length ?? 0, "pool built:", pool.length)
    }
  }, [posts, pool])

  const visible = useMemo(() => {
    if (pool.length === 0) return []

    const size = Math.min(SLOT_COUNT, pool.length)
    const result: Post[] = []

    for (let i = 0; i < size; i++) {
      result.push(pool[(index + i) % pool.length])
    }

    return result
  }, [pool, index])

  const heroPost = visible[0] || post
  const bottomPosts = visible.slice(1, 3)
  const recentFeatured = visible[3]
  const recentList = visible.slice(4, 7)

  useEffect(() => {
    if (pool.length <= SLOT_COUNT) return

    const timer = setInterval(() => {
      setFade(false)

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % pool.length)
        setFade(true)
      }, FADE_DURATION)
    }, ROTATE_INTERVAL)

    return () => clearInterval(timer)
  }, [pool.length])

  if (!heroPost) return null

  const imageUrl = getImageUrl(heroPost)
  const date = formatDate(heroPost) || "Today"

  const getTag = (item: Post) => {
    const badge = typeof item?.badge === "string" ? item.badge.trim() : ""
    const slug = getSlug(item)
    const categoryName =
      typeof item.category === "object" && item.category !== null
        ? item.category?.name || ""
        : String(item.category || "")

    const text = badge || categoryName

    if (badge) {
      const color = BADGE_COLORS[badge.toUpperCase()] || "bg-[#6B7280]"
      return { text, color }
    }

    const matchedKey = Object.keys(CATEGORY_COLORS).find((key) =>
      slug.includes(key) || text.toLowerCase().includes(key)
    )
    const color = matchedKey ? CATEGORY_COLORS[matchedKey] : "bg-[#0073ff]"

    return { text, color }
  }

  const heroTag = getTag(heroPost)

  return (
    <section className="w-full bg-[#1D2125]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5 py-5 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.85fr)] gap-4 lg:gap-5 items-stretch">

          {/* ================= LEFT: MAIN HERO + BOTTOM CARDS ================= */}
          <div className="relative min-h-[520px] lg:min-h-[620px] rounded-[10px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={heroPost.title}
              fill
              priority
              quality={80}
              sizes="(max-width: 1024px) 100vw, 900px"
              className={`object-cover object-center transition-all duration-500 ease-in-out ${
                fade ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
              }`}
            />

            {/* Dark overlays matching Nerio depth */}
            <div className="absolute inset-0 bg-[#1D2125]/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1D2125]/90 via-[#1D2125]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2125]/95 via-[#1D2125]/25 to-transparent" />

            <div
              className={`relative z-10 flex h-full flex-col justify-between p-5 sm:p-7 lg:p-9 transition-all duration-500 ease-in-out ${
                fade ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {/* Main featured content */}
              <div className="max-w-[560px] pt-2 sm:pt-6">
                {heroTag.text ? (
                  <span
                    className={`inline-block ${heroTag.color} text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-[3px] rounded mb-4`}
                  >
                    {heroTag.text}
                  </span>
                ) : null}

                <h1 className="text-white text-[26px] sm:text-[32px] lg:text-[36px] font-bold leading-[1.25] mb-4">
                  <Link
                    href={`/post/${heroPost.slug}`}
                    className="hover:text-[#0073ff] transition-colors"
                  >
                    {heroPost.title}
                  </Link>
                </h1>

                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#c8c9ce] mb-6">
                  <li>
                    By{" "}
                    <span className="text-white/90">{getAuthorName(heroPost)}</span>
                  </li>
                  {typeof heroPost.views === "number" && (
                    <li className="inline-flex items-center gap-1.5">
                      <PulseIcon className="w-4 h-4 text-[#0073ff]" />
                      {heroPost.views.toLocaleString()} Views
                    </li>
                  )}
                  <li className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#0073ff]" />
                    {date}
                  </li>
                </ul>

                <Link
                  href={`/post/${heroPost.slug}`}
                  className="inline-flex items-center justify-center bg-[#0073ff] hover:bg-[#0060d6] text-white text-[14px] font-semibold px-6 py-2.5 rounded-[4px] transition-colors"
                >
                  Read Article
                </Link>
              </div>

              {/* Bottom style-two cards */}
              {bottomPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                  {bottomPosts.map((item, i) => {
                    const tag = getTag(item)
                    return (
                      <Link
                        key={`${item.id}-bottom-${i}`}
                        href={`/post/${item.slug}`}
                        className="group flex items-center gap-3 rounded-[8px] border border-white/10 bg-[#12141c]/75 backdrop-blur-sm p-2.5 hover:border-white/20 transition-colors"
                      >
                        <div className="relative w-[72px] h-[72px] rounded-[6px] overflow-hidden shrink-0">
                          <Image
                            src={getImageUrl(item)}
                            alt={item.title}
                            fill
                            sizes="72px"
                            quality={70}
                            className="object-cover"
                          />
                          {hasVideo(item) && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e11d48] text-white shadow-md">
                                <PlayIcon />
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          {tag.text ? (
                            <span
                              className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-[2px] rounded mb-1.5`}
                            >
                              {tag.text}
                            </span>
                          ) : null}

                          <h6 className="text-white text-[14px] sm:text-[15px] font-semibold leading-snug mb-1.5 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                            {truncateTitle(item.title, 42)}
                          </h6>

                          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#a8aab3]">
                            <li>By {getAuthorName(item)}</li>
                            {typeof item.views === "number" && (
                              <li className="inline-flex items-center gap-1">
                                <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                                {item.views.toLocaleString()} Views
                              </li>
                            )}
                          </ul>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: RECENT NEWS SIDEBAR ================= */}
          <aside className="rounded-[10px] bg-[#0f1118] border border-white/5 p-4 sm:p-5 flex flex-col min-h-[520px] lg:min-h-[620px]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h4 className="text-white text-[20px] font-bold leading-none">
                Recent News
              </h4>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[13px] text-[#c8c9ce] hover:text-white transition-colors group"
              >
                <span>View All</span>
                <ArrowIcon className="w-4 h-3 text-current group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div
              className={`flex flex-col gap-4 flex-1 transition-all duration-500 ease-in-out ${
                fade ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {/* Featured large card */}
              {recentFeatured && (
                <Link
                  href={`/post/${recentFeatured.slug}`}
                  className="group relative block rounded-[8px] overflow-hidden min-h-[180px] sm:min-h-[200px]"
                >
                  <Image
                    src={getImageUrl(recentFeatured)}
                    alt={recentFeatured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    quality={75}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h4 className="text-white text-[16px] sm:text-[17px] font-bold leading-snug mb-2 group-hover:text-[#0073ff] transition-colors">
                      {recentFeatured.title}
                    </h4>
                    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#d1d2d8]">
                      <li>By {getAuthorName(recentFeatured)}</li>
                      {typeof recentFeatured.views === "number" && (
                        <li className="inline-flex items-center gap-1">
                          <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                          {recentFeatured.views.toLocaleString()} Views
                        </li>
                      )}
                      {formatDate(recentFeatured) && (
                        <li className="inline-flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3 text-[#0073ff]" />
                          {formatDate(recentFeatured)}
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
              )}

              {/* List items */}
              <div className="flex flex-col gap-4">
                {recentList.map((item, i) => {
                  const tag = getTag(item)
                  return (
                    <Link
                      key={`${item.id}-recent-${i}`}
                      href={`/post/${item.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <div className="relative w-[78px] h-[78px] rounded-[6px] overflow-hidden shrink-0">
                        <Image
                          src={getImageUrl(item)}
                          alt={item.title}
                          fill
                          sizes="78px"
                          quality={70}
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        {tag.text ? (
                          <span
                            className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-[2px] rounded mb-1.5`}
                          >
                            {tag.text}
                          </span>
                        ) : null}

                        <h6 className="text-white text-[14px] font-semibold leading-snug mb-1.5 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                          {truncateTitle(item.title, 48)}
                        </h6>

                        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#a8aab3]">
                          <li>By {getAuthorName(item)}</li>
                          {typeof item.views === "number" && (
                            <li className="inline-flex items-center gap-1">
                              <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                              {item.views.toLocaleString()} Views
                            </li>
                          )}
                        </ul>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
