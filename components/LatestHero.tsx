"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import type { Post } from "@/types/Post"

type LatestHeroProps = {
  post: Post
  posts: Post[]
}

/* ================= CONFIG ================= */

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
  const pool = useMemo(() => buildPool(posts), [posts])

  const visible = useMemo(() => {
    if (pool.length === 0) return []
    return pool.slice(0, SLOT_COUNT)
  }, [pool])

  const heroPost = visible[0] || post
  const bottomPosts = visible.slice(1, 3)
  const recentFeatured = visible[3]
  const recentList = visible.slice(4, 7)

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
      {/* Nerio hero: full-bleed row, ~10px side inset, tight top/bottom */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-[10px] pb-[20px] lg:pb-[30px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] gap-4 sm:gap-5 lg:gap-6 items-stretch">

          {/* ================= LEFT: HERO BG + TITLE + STYLE-TWO ================= */}
          <div className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[720px] overflow-hidden rounded-[6px]">
            <Image
              src={imageUrl}
              alt={heroPost.title}
              fill
              priority
              quality={80}
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-[#1D2125]/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1D2125]/88 via-[#1D2125]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2125]/80 via-transparent to-transparent" />

            <div className="relative z-10 flex h-full min-h-[460px] sm:min-h-[560px] lg:min-h-[720px] flex-col justify-between px-4 py-5 sm:px-7 sm:py-8 lg:px-12 lg:py-12">
              {/* style-one: main featured */}
              <div className="w-full max-w-none lg:max-w-[640px] xl:max-w-[700px] pt-1 sm:pt-3">
                {heroTag.text ? (
                  <span
                    className={`inline-block ${heroTag.color} text-white text-[11px] font-semibold uppercase tracking-wide px-[10px] py-[3px] rounded-[3px] mb-4`}
                  >
                    {heroTag.text}
                  </span>
                ) : null}

                <h1 className="hero-main-title text-white !font-extrabold !leading-[1.2] tracking-[-0.01em] mb-4 sm:mb-5 line-clamp-3">
                  <Link
                    href={`/post/${heroPost.slug}`}
                    className="hover:text-[#0073ff] transition-colors line-clamp-3"
                  >
                    {heroPost.title}
                  </Link>
                </h1>

                <ul className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px] text-[14px] sm:text-[15px] text-[#c8c9ce] mb-[22px]">
                  <li>
                    By{" "}
                    <span className="text-white/90">{getAuthorName(heroPost)}</span>
                  </li>
                  {typeof heroPost.views === "number" && (
                    <li className="inline-flex items-center gap-[6px]">
                      <PulseIcon className="w-4 h-4 text-[#0073ff]" />
                      {heroPost.views.toLocaleString()} Views
                    </li>
                  )}
                  <li className="inline-flex items-center gap-[6px]">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#0073ff]" />
                    {date}
                  </li>
                </ul>

                <Link
                  href={`/post/${heroPost.slug}`}
                  className="inline-flex items-center justify-center bg-[#0073ff] hover:bg-[#0060d6] text-white text-[15px] sm:text-[16px] font-semibold px-[28px] py-[13px] sm:px-[32px] sm:py-[14px] rounded-[4px] transition-colors"
                >
                  Read Article
                </Link>
              </div>

              {/* style-two: glass / smoky cards */}
              {bottomPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {bottomPosts.map((item, i) => {
                    const tag = getTag(item)
                    return (
                      <Link
                        key={`${item.id}-bottom-${i}`}
                        href={`/post/${item.slug}`}
                        className="group flex items-center gap-3.5 rounded-[12px] border border-white/15 bg-white/[0.07] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-3 sm:p-3.5 hover:bg-white/[0.12] hover:border-white/25 transition-colors"
                      >
                        <div className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] overflow-hidden shrink-0 rounded-[8px]">
                          <Image
                            src={getImageUrl(item)}
                            alt={item.title}
                            fill
                            sizes="80px"
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
                              className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-[3px] mb-1.5`}
                            >
                              {tag.text}
                            </span>
                          ) : null}

                          <h6 className="text-white !text-[15px] sm:!text-[16px] !font-bold leading-[1.35] mb-1.5 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                            {truncateTitle(item.title, 48)}
                          </h6>

                          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#c8c9ce]">
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

          {/* ================= RIGHT: RECENT NEWS ================= */}
          <aside className="bg-[#15171f] rounded-[6px] px-4 py-5 sm:px-6 sm:py-6 flex flex-col min-h-0 lg:min-h-[720px] w-full min-w-0">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h4 className="text-white text-[20px] sm:text-[22px] font-bold leading-none">
                Recent News
              </h4>
              <Link
                href="/articles"
                className="inline-flex items-center gap-[8px] text-[13px] text-white hover:text-[#0073ff] transition-colors group"
              >
                <span>View All</span>
                <ArrowIcon className="w-4 h-3 text-current group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col gap-[20px] flex-1">
              {recentFeatured && (
                <Link
                  href={`/post/${recentFeatured.slug}`}
                  className="group relative block overflow-hidden rounded-[4px] min-h-[190px] sm:min-h-[210px]"
                >
                  <Image
                    src={getImageUrl(recentFeatured)}
                    alt={recentFeatured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    quality={75}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-[16px] py-[16px]">
                    <h4 className="text-white text-[17px] font-bold leading-[1.35] mb-[10px] group-hover:text-[#0073ff] transition-colors">
                      {recentFeatured.title}
                    </h4>
                    <ul className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[12px] text-[#d1d2d8]">
                      <li>By {getAuthorName(recentFeatured)}</li>
                      {typeof recentFeatured.views === "number" && (
                        <li className="inline-flex items-center gap-[4px]">
                          <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                          {recentFeatured.views.toLocaleString()} Views
                        </li>
                      )}
                      {formatDate(recentFeatured) && (
                        <li className="inline-flex items-center gap-[4px]">
                          <CalendarIcon className="w-3 h-3 text-[#0073ff]" />
                          {formatDate(recentFeatured)}
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
              )}

              <div className="flex flex-col gap-[18px]">
                {recentList.map((item, i) => {
                  const tag = getTag(item)
                  return (
                    <Link
                      key={`${item.id}-recent-${i}`}
                      href={`/post/${item.slug}`}
                      className="group flex items-center gap-[14px]"
                    >
                      <div className="relative w-[80px] h-[80px] rounded-[4px] overflow-hidden shrink-0">
                        <Image
                          src={getImageUrl(item)}
                          alt={item.title}
                          fill
                          sizes="80px"
                          quality={70}
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {tag.text ? (
                          <span
                            className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-[3px] mb-[8px]`}
                          >
                            {tag.text}
                          </span>
                        ) : null}

                        <h6 className="text-white text-[15px] font-semibold leading-[1.35] mb-[8px] group-hover:text-[#0073ff] transition-colors line-clamp-2">
                          {truncateTitle(item.title, 48)}
                        </h6>

                        <ul className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[12px] text-[#a8aab3]">
                          <li>By {getAuthorName(item)}</li>
                          {typeof item.views === "number" && (
                            <li className="inline-flex items-center gap-[4px]">
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
