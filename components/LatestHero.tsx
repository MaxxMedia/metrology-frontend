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

/** 1 main hero + 2 bottom cards + 1 sidebar featured + 3 sidebar list */
const SLOT_COUNT = 7

const NON_REPEATING_PALETTE = [
  "bg-[#E11D48]", // Rose / Crimson
  "bg-[#00b5ed]", // Cyan (Automation)
  "bg-[#00B95C]", // Green (Gadget)
  "bg-[#7C3AED]", // Purple (Robotics / Leadership)
  "bg-[#f27100]", // Orange (Software / Manufacturing)
  "bg-[#0073ff]", // Royal Blue (Digital)
  "bg-[#059669]", // Emerald (Tech / AI)
  "bg-[#F59E0B]", // Amber (Trending)
  "bg-[#8B5CF6]", // Violet (Future)
  "bg-[#0284C7]", // Sky Blue (Engineering)
  "bg-[#EC4899]", // Pink (Design)
  "bg-[#10B981]", // Teal
]

const CATEGORY_PREFERRED_COLORS: Record<string, string> = {
  automation: "bg-[#00b5ed]",
  gadget: "bg-[#00B95C]",
  robotics: "bg-[#7C3AED]",
  software: "bg-[#f27100]",
  digital: "bg-[#0073ff]",
  innovation: "bg-[#E11D48]",
  tech: "bg-[#059669]",
  engineering: "bg-[#0284C7]",
  manufacturing: "bg-[#10B981]",
  future: "bg-[#8B5CF6]",
  trending: "bg-[#F59E0B]",
  featured: "bg-[#E11D48]",
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

function truncateTitle(title: string, max = 56) {
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

function DiamondDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`w-[9px] h-[9px] bg-[#0073ff] rotate-45 shrink-0 ${className}`}
      aria-hidden
    />
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5" aria-hidden>
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  )
}

export default function LatestHero({ post, posts }: LatestHeroProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const pool = useMemo(() => buildPool(posts), [posts])

  const visible = useMemo(() => {
    if (pool.length === 0) return []
    return pool.slice(0, SLOT_COUNT)
  }, [pool])

  /* Non-repeating badge colors for all items in Hero */
  const visibleWithTags = useMemo(() => {
    if (visible.length === 0) return []
    const usedColors = new Set<string>()

    return visible.map((item, idx) => {
      const badge = typeof item?.badge === "string" ? item.badge.trim() : ""
      const slug = getSlug(item)
      const categoryName =
        typeof item?.category === "object" && item?.category !== null
          ? item?.category?.name || ""
          : String(item?.category || "")

      const text = badge || categoryName || "News"

      const matchedKey = Object.keys(CATEGORY_PREFERRED_COLORS).find(
        (k) => slug.includes(k) || text.toLowerCase().includes(k)
      )

      let chosenColor = ""
      if (matchedKey && !usedColors.has(CATEGORY_PREFERRED_COLORS[matchedKey])) {
        chosenColor = CATEGORY_PREFERRED_COLORS[matchedKey]
      } else {
        const unused = NON_REPEATING_PALETTE.find((c) => !usedColors.has(c))
        chosenColor = unused || NON_REPEATING_PALETTE[idx % NON_REPEATING_PALETTE.length]
      }

      usedColors.add(chosenColor)
      return { item, tagText: text, tagColor: chosenColor }
    })
  }, [visible])

  if (visibleWithTags.length === 0) return null

  const heroItem = visibleWithTags[0]
  const heroPost = heroItem.item
  const bottomWithTags = visibleWithTags.slice(1, 3)
  const recentFeaturedItem = visibleWithTags[3]
  const recentListWithTags = visibleWithTags.slice(4, 7)

  const imageUrl = getImageUrl(heroPost)
  const date = formatDate(heroPost) || "Today"

  if (isMobile) {
    return (
      <section className="w-full bg-[#1D2125]">
        <div className="w-full px-5 pt-4 pb-8">
          <div className="flex items-center gap-4 mb-5 min-w-0">
            <h2 className="text-[24px] font-bold text-white shrink-0 leading-none">
              Latest News
            </h2>
            <div className="relative flex-1 min-w-[48px] flex items-center">
              <DiamondDot />
              <span className="flex-1 h-px bg-white/15" />
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {recentListWithTags.slice(0, 3).map(({ item, tagText, tagColor }, i) => (
              <Link
                key={`${item.id}-mobile-${i}`}
                href={`/post/${item.slug}`}
                className="group flex items-center gap-3.5 rounded-[15px] border border-white/15 bg-white/[0.07] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-3 hover:bg-white/[0.12] hover:border-white/25 transition-colors"
              >
                <div className="relative w-[66px] h-[66px] overflow-hidden shrink-0 rounded-[10px]">
                  <Image
                    src={getImageUrl(item)}
                    alt={item.title}
                    fill
                    sizes="66px"
                    quality={70}
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {tagText ? (
                    <span
                      className={`inline-block ${tagColor} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-tl-none rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] mb-1.5`}
                    >
                      {tagText}
                    </span>
                  ) : null}

                  <h6 className="text-white text-[14.5px] font-bold leading-[1.2] mb-1 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                    {truncateTitle(item.title, 42)}
                  </h6>

                  <p className="text-[12px] text-[#a8aab3]">
                    By {getAuthorName(item)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-[#1D2125]">
      {/* Latest Hero: Full bleed with no left or right margins */}
      <div className="w-full pl-0 pr-0 pt-0 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(370px,420px)] gap-0 items-stretch">

          {/* ================= LEFT: HERO BG + TITLE + STYLE-TWO ================= */}
          <div className="relative min-h-[220px] sm:min-h-[680px] lg:min-h-[870px] overflow-hidden rounded-none border-y border-white/10 shadow-lg">
            <Image
              src={imageUrl}
              alt={heroPost.title}
              fill
              priority
              quality={80}
              sizes="(max-width: 1024px) 100vw, 1400px"
              className="object-cover object-center"
            />

            {/* Soft subtle gradient to maximize photo brightness while keeping white text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            <div className="relative z-10 flex h-full min-h-[220px] sm:min-h-[680px] lg:min-h-[870px] flex-col justify-between px-5 py-5 sm:px-12 sm:py-10 lg:px-16 lg:py-12">
              {/* style-one: main featured */}
              <div className="w-full max-w-none lg:max-w-[650px] xl:max-w-[720px] pt-6 sm:pt-12 lg:pt-16">
                {heroItem.tagText ? (
                  <span
                    className={`inline-block ${heroItem.tagColor} text-white text-[12px] sm:text-[13.5px] font-semibold uppercase tracking-wide px-[10px] sm:px-[12px] py-[3px] sm:py-[4px] rounded-tl-none rounded-tr-[6px] rounded-br-[6px] rounded-bl-[6px] mb-3 sm:mb-5`}
                  >
                    {heroItem.tagText}
                  </span>
                ) : null}

                <h1 className="hero-main-title text-white !font-semibold !leading-[1.18] tracking-[-0.01em] mb-4 sm:mb-6 line-clamp-3 text-[30px] sm:!text-[54px] lg:!text-[58px] max-w-[650px]">
                  <Link
                    href={`/post/${heroPost.slug}`}
                    className="hover:text-[#0073ff] transition-colors line-clamp-3"
                  >
                    {heroPost.title}
                  </Link>
                </h1>

                <ul className="hidden sm:flex flex-wrap items-center gap-x-[20px] gap-y-[10px] text-[16.5px] sm:text-[18px] text-[#c8c9ce] mb-[27px]">
                  <li>
                    By{" "}
                    <span className="text-white/90">{getAuthorName(heroPost)}</span>
                  </li>
                  {typeof heroPost.views === "number" && (
                    <li className="inline-flex items-center gap-[8px]">
                      <PulseIcon className="w-[20px] h-[20px] text-[#0073ff]" />
                      {heroPost.views.toLocaleString()} Views
                    </li>
                  )}
                  <li className="inline-flex items-center gap-[8px]">
                    <CalendarIcon className="w-[18px] h-[18px] text-[#0073ff]" />
                    {date}
                  </li>
                </ul>

                <Link
                  href={`/post/${heroPost.slug}`}
                  className="hidden sm:inline-flex items-center justify-center bg-[#0073ff] hover:bg-[#0060d6] text-white text-[18px] sm:text-[20px] font-semibold px-[34px] py-[15.5px] sm:px-[38px] sm:py-[18px] rounded-[6px] transition-colors"
                >
                  Read Article
                </Link>
              </div>

              {/* style-two: glass / smoky cards */}
              {bottomWithTags.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-10 w-full max-w-none lg:max-w-[950px] xl:max-w-[1030px]">
                  {bottomWithTags.map(({ item, tagText, tagColor }, i) => {
                    return (
                      <Link
                        key={`${item.id}-bottom-${i}`}
                        href={`/post/${item.slug}`}
                        className="group flex items-center gap-3.5 sm:gap-4.5 rounded-[15px] border border-white/15 bg-white/[0.07] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-3.5 sm:p-4.5 hover:bg-white/[0.12] hover:border-white/25 transition-colors"
                      >
                        <div className="relative w-[68px] h-[68px] sm:w-[98px] sm:h-[98px] overflow-hidden shrink-0 rounded-[10px]">
                          <Image
                            src={getImageUrl(item)}
                            alt={item.title}
                            fill
                            sizes="100px"
                            quality={70}
                            className="object-cover"
                          />
                          {hasVideo(item) && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e11d48] text-white shadow-md">
                                <PlayIcon />
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          {tagText ? (
                            <span
                              className={`inline-block ${tagColor} text-white text-[11px] sm:text-[12px] font-semibold uppercase tracking-wide px-[9px] sm:px-[10px] py-[2px] sm:py-[3px] rounded-tl-none rounded-tr-[6px] rounded-br-[6px] rounded-bl-[6px] mb-2`}
                            >
                              {tagText}
                            </span>
                          ) : null}

                          <h6 className="text-white !text-[17px] sm:!text-[20px] !font-bold leading-[1.25] mb-2 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                            {truncateTitle(item.title, 50)}
                          </h6>

                          <ul className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-2 text-[14.5px] text-[#c8c9ce]">
                            <li>By {getAuthorName(item)}</li>
                            {typeof item.views === "number" && (
                              <li className="inline-flex items-center gap-1.5">
                                <PulseIcon className="w-4 h-4 text-[#0073ff]" />
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
          <aside className="hidden lg:flex bg-[#15171f] rounded-none border-y border-l border-white/10 px-4.5 py-6 sm:px-6 sm:py-7 flex-col min-h-0 lg:min-h-[870px] w-full min-w-0">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h4 className="text-white text-[24px] sm:text-[26px] font-bold leading-none">
                Recent News
              </h4>
              <Link
                href="/articles"
                className="inline-flex items-center gap-[8px] text-[15px] sm:text-[16px] text-white hover:text-[#0073ff] transition-colors group"
              >
                <span>View All</span>
                <ArrowIcon className="w-[20px] h-[15px] text-current group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col gap-[24px] flex-1">
              {recentFeaturedItem && (
                <Link
                  href={`/post/${recentFeaturedItem.item.slug}`}
                  className="group relative block overflow-hidden rounded-[8px] min-h-[250px] sm:min-h-[275px]"
                >
                  <Image
                    src={getImageUrl(recentFeaturedItem.item)}
                    alt={recentFeaturedItem.item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    quality={80}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-4 py-4 sm:px-5 sm:py-5">
                    {recentFeaturedItem.tagText && (
                      <span
                        className={`inline-block ${recentFeaturedItem.tagColor} text-white text-[12.5px] font-bold uppercase tracking-wide px-[10px] py-[3px] rounded-tl-none rounded-tr-[6px] rounded-br-[6px] rounded-bl-[6px] mb-2`}
                      >
                        {recentFeaturedItem.tagText}
                      </span>
                    )}
                    <h4 className="text-white text-[22px] sm:text-[24px] font-bold leading-[1.3] mb-2.5 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                      {recentFeaturedItem.item.title}
                    </h4>
                    <ul className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px] text-[14.5px] sm:text-[15px] text-[#d1d2d8]">
                      <li>By {getAuthorName(recentFeaturedItem.item)}</li>
                      {typeof recentFeaturedItem.item.views === "number" && (
                        <li className="inline-flex items-center gap-[5px]">
                          <PulseIcon className="w-4 h-4 text-[#0073ff]" />
                          {recentFeaturedItem.item.views.toLocaleString()} Views
                        </li>
                      )}
                      {formatDate(recentFeaturedItem.item) && (
                        <li className="inline-flex items-center gap-[5px]">
                          <CalendarIcon className="w-4 h-4 text-[#0073ff]" />
                          {formatDate(recentFeaturedItem.item)}
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
              )}

              <div className="flex flex-col gap-[22px]">
                {recentListWithTags.map(({ item, tagText, tagColor }, i) => {
                  return (
                    <Link
                      key={`${item.id}-recent-${i}`}
                      href={`/post/${item.slug}`}
                      className="group flex items-center gap-3.5 sm:gap-4"
                    >
                      <div className="relative w-[110px] h-[110px] sm:w-[114px] sm:h-[114px] rounded-[8px] overflow-hidden shrink-0">
                        <Image
                          src={getImageUrl(item)}
                          alt={item.title}
                          fill
                          sizes="114px"
                          quality={75}
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {tagText ? (
                          <span
                            className={`inline-block ${tagColor} text-white text-[12px] font-bold uppercase tracking-wide px-[9px] py-[2.5px] rounded-tl-none rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] mb-1.5`}
                          >
                            {tagText}
                          </span>
                        ) : null}

                        <h6 className="text-white text-[19px] sm:text-[20px] font-bold leading-[1.3] mb-2 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                          {truncateTitle(item.title, 56)}
                        </h6>

                        <ul className="flex flex-wrap items-center gap-x-[14px] gap-y-[4px] text-[14px] sm:text-[15px] text-[#b4b6bf]">
                          <li>By {getAuthorName(item)}</li>
                          {typeof item.views === "number" && (
                            <li className="inline-flex items-center gap-[5px]">
                              <PulseIcon className="w-4 h-4 text-[#0073ff]" />
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
