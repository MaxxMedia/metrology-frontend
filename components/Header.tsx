"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronRight as ChevronRightSmall,
  Search,
  User as UserIcon,
  Calendar,
  Facebook,
  Instagram,
  Linkedin,
  Activity,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import { useState, useEffect, type FormEvent } from "react"
import type { Post } from "@/types/Post"
import { ARTICLE_TOPICS as TOPICS, RESOURCE_TOPICS as RESOURCES } from "@/lib/topic"
import ScrollProgressBar from "@/components/ScrollProgressBar"

type MegaType = "topics" | "resources" | "pages" | null

type User = {
  companyName: string
  id: number
  email: string
  role: "admin" | "recruiter" | "candidate"
  avatarUrl?: string
  username?: string
}

function PinterestIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
    </svg>
  )
}

function CloudSunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 512" fill="currentColor" className={className} aria-hidden>
      <path d="M575.2 325.7c.2-1.9.8-3.7.8-5.6 0-35.3-28.7-64-64-64-12.6 0-24.2 3.8-34.1 10-17.6-38.8-56.5-66-101.9-66-61.8 0-112 50.1-112 112 0 3 .7 5.8.9 8.7-49.6 3.7-88.9 44.7-88.9 95.3 0 53 43 96 96 96h272c53 0 96-43 96-96 0-42.1-27.2-77.4-64.8-90.4zm-430.4-22.6c-43.7-43.7-43.7-114.7 0-158.3 43.7-43.7 114.7-43.7 158.4 0 9.7 9.7 16.9 20.9 22.3 32.7 9.8-3.7 20.1-6 30.7-7.5L386 81.1c4-11.9-7.3-23.1-19.2-19.2L279 91.2 237.5 8.4C232-2.8 216-2.8 210.4 8.4L169 91.2 81.1 61.9C69.3 58 58 69.3 61.9 81.1l29.3 87.8-82.8 41.5c-11.2 5.6-11.2 21.5 0 27.1l82.8 41.4-29.3 87.8c-4 11.9 7.3 23.1 19.2 19.2l76.1-25.3c6.1-12.4 14-23.7 23.6-33.5-13.1-5.4-25.4-13.4-36-24zm-4.8-79.2c0 40.8 29.3 74.8 67.9 82.3 8-4.7 16.3-8.8 25.2-11.7 5.4-44.3 31-82.5 67.4-105C287.3 160.4 258 140 224 140c-46.3 0-84 37.6-84 83.9z" />
    </svg>
  )
}

// Each Pages link can optionally carry a submenu (chevron shown when present)
const PAGES_LINKS: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
  { label: "Magazine", href: "/magazines" },
  { label: "Directory", href: "/suppliers" },
  { label: "Industry Talks", href: "/industry-talks" },
  { label: "Events", href: "/events" },
  { label: "Jobs", href: "/feed" },
  { label: "Blog", href: "/blog" },
  { label: "About / Contact", href: "/contact" },
]

// Keep this in sync with the CSS animation durations below.
const MOBILE_MENU_ANIM_MS = 900

export default function Header() {
  const [openMega, setOpenMega] = useState<MegaType>(null)
  const [openPagesChild, setOpenPagesChild] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [postsCache, setPostsCache] = useState<Record<string, Post[]>>({})
  const [postsLoading, setPostsLoading] = useState(false)
  const [activeSlug, setActiveSlug] = useState(TOPICS[0]?.slug ?? "")

  const [tickerPosts, setTickerPosts] = useState<Post[]>([])
  const [tickerIndex, setTickerIndex] = useState(0)
  const [weather, setWeather] = useState<{ temperature: number; country: string } | null>(null)

  const container = "w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8"

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user")
      setUser(stored ? JSON.parse(stored) : null)
    }
    loadUser()
    window.addEventListener("userChanged", loadUser)
    return () => window.removeEventListener("userChanged", loadUser)
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=8`)
      .then((res) => res.json())
      .then((data) => {
        const posts: Post[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setTickerPosts(posts.slice(0, 6))
      })
      .catch(() => setTickerPosts([]))
  }, [])

  useEffect(() => {
    const CACHE_KEY = "nav-geo-weather"
    const CACHE_MS = 30 * 60 * 1000

    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as {
          temperature: number
          country: string
          at: number
        }
        if (
          parsed?.country &&
          typeof parsed.temperature === "number" &&
          Date.now() - parsed.at < CACHE_MS
        ) {
          setWeather({ temperature: parsed.temperature, country: parsed.country })
          return
        }
      }
    } catch {
      /* ignore bad cache */
    }

    let cancelled = false
    fetch("/api/geo-weather")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { temperature?: number; country?: string }) => {
        if (cancelled) return
        if (typeof data.temperature !== "number" || !data.country) return
        const next = { temperature: data.temperature, country: data.country }
        setWeather(next)
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...next, at: Date.now() }))
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        if (!cancelled) setWeather(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (tickerPosts.length <= 1) return
    const t = setInterval(() => {
      setTickerIndex((i) => (i + 1) % tickerPosts.length)
    }, 4000)
    return () => clearInterval(t)
  }, [tickerPosts.length])

  // Resources currently has a single "Articles" category with no matching
  // backend category slug (see lib/topic.ts for details). For that slug we
  // fetch the latest posts with no `category` filter; every other slug (the
  // 3 Topics categories) is filtered by category exactly as before.
  async function fetchPostsForSlug(slug: string) {
    if (postsCache[slug]) return
    setPostsLoading(true)
    try {
      const url =
        slug === "articles"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=8`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${encodeURIComponent(slug)}&limit=6`
      const res = await fetch(url)
      const data = await res.json()
      const posts: Post[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setPostsCache((prev) => ({ ...prev, [slug]: posts }))
    } catch {
      setPostsCache((prev) => ({ ...prev, [slug]: [] }))
    } finally {
      setPostsLoading(false)
    }
  }

  // Lock body scroll while the panel is open OR mid-close-animation, so the
  // page doesn't jump/scroll underneath while the wipe-out plays.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isMenuClosing ? "hidden" : "unset"
  }, [isMenuOpen, isMenuClosing])

  // Closing plays the reverse wipe animation, then actually unmounts the panel.
  function closeMobileMenu() {
    if (!isMenuOpen || isMenuClosing) return
    setIsMenuClosing(true)
    window.setTimeout(() => {
      setIsMenuOpen(false)
      setIsMenuClosing(false)
    }, MOBILE_MENU_ANIM_MS)
  }

  function openMobileMenu() {
    setIsMenuClosing(false)
    setIsMenuOpen(true)
  }

  const activePosts = postsCache[activeSlug] ?? []
  const activeTicker = tickerPosts[tickerIndex]
  const activeLabel =
    (openMega === "topics" ? TOPICS : openMega === "resources" ? RESOURCES : []).find(
      (i) => i.slug === activeSlug
    )?.label ?? ""

  // Resources has just one bucket ("Articles") with no real category filter
  // behind it, so it renders as a flat article grid with no sidebar — same
  // pattern as the reference "Technology" mega menu. Topics keeps the
  // sidebar + featured-post layout (reference "Features" mega menu).
  const isResourcesMega = openMega === "resources"

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.dispatchEvent(new Event("userChanged"))
    window.location.href = "/login"
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    window.location.href = `/blog?q=${encodeURIComponent(q)}`
  }

  const navLinkClass =
    "relative inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold text-white hover:text-[#0073ff] transition-colors"

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#1D2125]">
      {/* Scroll Progress Bar at the very top of header */}
      <ScrollProgressBar />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        /* The off-canvas backdrop/panel behave like a curtain: they enter
           from the right edge and wipe across the page on open, and wipe
           back off to the right on close. */
        @keyframes mobile-menu-wipe-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes mobile-menu-wipe-out {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }

        @keyframes mobile-menu-panel-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes mobile-menu-panel-out {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }

        .mobile-menu-wipe-in {
          animation: mobile-menu-wipe-in 900ms cubic-bezier(0.77, 0, 0.18, 1) both;
        }

        .mobile-menu-wipe-out {
          animation: mobile-menu-wipe-out 900ms cubic-bezier(0.77, 0, 0.18, 1) both;
        }

        .mobile-menu-panel-in {
          animation: mobile-menu-panel-in 900ms cubic-bezier(0.77, 0, 0.18, 1) both;
        }

        .mobile-menu-panel-out {
          animation: mobile-menu-panel-out 900ms cubic-bezier(0.77, 0, 0.18, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-menu-wipe-in,
          .mobile-menu-wipe-out,
          .mobile-menu-panel-in,
          .mobile-menu-panel-out {
            animation: none;
          }
        }
      `}</style>

      {/* ================= TOP UTILITY BAR ================= */}
      <div className="">
        <div className={`${container} h-[42px] flex items-center justify-between gap-4 text-[13px]`}>
          {/* Live News + ticker + weather (inline, compact) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
              </span>
              <span className="text-[#ef4444] font-bold uppercase tracking-wide text-[12px] whitespace-nowrap">
                Live News
              </span>
            </div>
            <span className="hidden sm:block w-px h-4 bg-white/30 shrink-0" />
            <div className="min-w-0 max-w-[140px] sm:max-w-[200px] md:max-w-[260px] lg:max-w-[320px] overflow-hidden shrink">
              {activeTicker ? (
                <Link
                  href={`/post/${activeTicker.slug}`}
                  className="block truncate text-white/90 hover:text-[#0073ff] transition-colors"
                >
                  {activeTicker.title}
                </Link>
              ) : (
                <span className="text-white/50 truncate block">Loading headlines…</span>
              )}
            </div>
            {weather && (
              <>
                <span className="hidden md:block w-px h-4 bg-white/30 shrink-0" />
                <div className="hidden md:flex items-center gap-2 text-white shrink-0 whitespace-nowrap">
                  <CloudSunIcon className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="font-semibold">
                    {weather.temperature}
                    <sup className="text-[10px]">°C</sup>
                  </span>
                  <span className="text-white/70">{weather.country}</span>
                </div>
              </>
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-5 xl:gap-6 shrink-0">
            <div className="hidden lg:inline-flex items-center gap-2 bg-[#0073ff] text-white text-[12px] font-semibold px-3.5 py-2 rounded-tr-full rounded-br-full rounded-bl-full shrink-0 whitespace-nowrap">
              <Calendar size={14} strokeWidth={2} className="shrink-0" />
              {today}
            </div>

            <div className="hidden xl:flex items-center gap-3 shrink-0 text-white whitespace-nowrap">
              <span className="text-white/80">Follow Us:</span>
              <div className="flex items-center gap-2.5">
                {[
                  { href: "#", label: "Facebook", Icon: Facebook },
                  { href: "#", label: "Instagram", Icon: Instagram },
                  { href: "#", label: "LinkedIn", Icon: Linkedin },
                  { href: "#", label: "Pinterest", Icon: PinterestIcon },
                ].map(({ href, label, Icon }) => (
                  <Link key={label} href={href} aria-label={label} className="hover:text-[#0073ff] transition-colors shrink-0">
                    <Icon size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAV ================= */}
      <div className="bg-[#121213]">
        <div className={`${container} h-[72px] flex items-center justify-between gap-4`}>
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/images/logo5.png"
              alt="Tooling Trends"
              width={180}
              height={56}
              priority
              className="h-[98px] w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0">
            <Link href="/" className={`${navLinkClass} text-[#0073ff]`}>
              Home
            </Link>

            <button
              onMouseEnter={() => {
                setOpenMega("topics")
                const first = TOPICS[0]?.slug
                if (first) {
                  setActiveSlug(first)
                  fetchPostsForSlug(first)
                }
              }}
              className={navLinkClass}
            >
              Topics <ChevronDown size={14} className="shrink-0" />
            </button>

            <button
              onMouseEnter={() => {
                setOpenMega("resources")
                const first = RESOURCES[0]?.slug
                if (first) {
                  setActiveSlug(first)
                  fetchPostsForSlug(first)
                }
              }}
              className={navLinkClass}
            >
              Resources <ChevronDown size={14} className="shrink-0" />
            </button>

            <Link href="/suppliers" className={navLinkClass}>
              Directory
            </Link>

            <Link href="/events" className={navLinkClass}>
              Events
            </Link>

            <Link href="/feed" className={navLinkClass}>
              Jobs
            </Link>

            <Link href="/contact" className={navLinkClass}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center h-10 w-[180px] rounded-[4px] bg-[#15171f] border border-white/10 px-3 shrink-0"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full min-w-0 bg-transparent text-[13px] text-white placeholder:text-white/40 outline-none"
              />
              <button type="submit" aria-label="Search" className="text-white/60 hover:text-white shrink-0">
                <Search size={15} />
              </button>
            </form>

            {!user ? (
              <Link
                href="/login"
                aria-label="Login"
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#15171f] border border-white/10 text-white hover:border-[#0073ff] hover:text-[#0073ff] transition-colors shrink-0"
              >
                <UserIcon size={18} />
              </Link>
            ) : (
              <div className="relative hidden md:block shrink-0">
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 h-10 px-2.5 rounded-[4px] bg-[#15171f] border border-white/10 text-white hover:border-[#0073ff] transition-colors"
                >
                  <div className="relative w-7 h-7 shrink-0">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt="User avatar"
                        fill
                        className="rounded-full object-cover"
                        sizes="28px"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0073ff] flex items-center justify-center text-[10px] font-bold">
                        {user.email.split("@")[0].replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <ChevronDown size={14} className="shrink-0" />
                </button>

                {openUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-2xl border border-gray-200 text-black z-50 overflow-hidden">
                      <Link
                        href={
                          user.role === "admin"
                            ? "/admin/dashboard"
                            : user.role === "recruiter"
                              ? "/recruiter/dashboard"
                              : `/candidate/${user.username || user.email?.split("@")[0] || "profile"}`
                        }
                        className="block px-4 py-3 hover:bg-gray-100 text-sm transition border-b font-semibold text-[#0073ff] truncate"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        {user.role === "candidate" ? "My Candidate Profile" : "Dashboard"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {!user && (
              <Link
                href="/signup"
                className="hidden md:inline-flex h-10 items-center px-5 rounded-[4px] bg-[#0073ff] text-white text-[14px] font-bold hover:bg-[#0060d6] transition-colors whitespace-nowrap shrink-0"
              >
                Sign Up
              </Link>
            )}

            <button
              onClick={() => (isMenuOpen ? closeMobileMenu() : openMobileMenu())}
              aria-label="Menu"
              className="h-10 w-10 flex items-center justify-center rounded-[4px] bg-[#15171f] border border-white/10 text-white hover:border-[#0073ff] transition-colors lg:hidden shrink-0"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={openMobileMenu}
              aria-label="Open menu"
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#15171f] border border-white/10 text-white hover:border-[#0073ff] transition-colors shrink-0"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOPICS / RESOURCES MEGA ================= */}
      {(openMega === "topics" || openMega === "resources") && (
        <div
          onMouseLeave={() => setOpenMega(null)}
          className="hidden lg:block absolute left-0 right-0 z-20"
        >
          <div className={container}>
            <div className="bg-[#111318] shadow-2xl w-full">
              {isResourcesMega ? (
                // ---------------- RESOURCES: no sidebar, flat article grid ----------------
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-[15px] font-bold">{activeLabel}</h3>
                    <Link
                      href="/Webinar"
                      onClick={() => setOpenMega(null)}
                      className="flex items-center gap-1 text-[13px] font-semibold text-white/70 hover:text-[#0073ff] transition-colors shrink-0"
                    >
                      View All <ChevronRight size={14} />
                    </Link>
                  </div>

                  {postsLoading ? (
                    <div className="w-full h-[140px] flex items-center justify-center">
                      <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : activePosts.length === 0 ? (
                    <div className="w-full h-[140px] flex items-center">
                      <p className="text-white/60 text-sm">No articles found for Resources.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-x-5 gap-y-4">
                      {activePosts.slice(0, 4).map((post: any) => (
                        <article key={post.id}>
                          <Link href={`/post/${post.slug}`}>
                            <div className="relative w-full h-[92px] rounded overflow-hidden mb-2">
                              <Image
                                src={post.imageUrl || "/placeholder.svg"}
                                alt={post.title}
                                fill
                                className="object-cover hover:opacity-90 transition-opacity"
                              />
                            </div>
                          </Link>
                          <h4 className="text-[13px] font-semibold text-white leading-snug hover:text-[#0073ff] line-clamp-2 mb-1.5">
                            <Link href={`/post/${post.slug}`}>{post.title}</Link>
                          </h4>
                          <div className="flex items-center gap-1.5 text-[12px] text-white/50">
                            <span className="truncate">By {post.author?.name || post.author || "Matt Rosnor"}</span>
                            <Activity size={12} className="shrink-0" />
                            <span className="shrink-0">{post.views ?? 0} Views</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // ---------------- TOPICS: sidebar + featured post + 2x2 grid ----------------
                <div className="grid grid-cols-[172px_1fr]">
                  <aside className="bg-[#15171f] overflow-hidden py-1">
                    {TOPICS.map((item) => (
                      <button
                        key={item.slug}
                        onMouseEnter={() => {
                          setActiveSlug(item.slug)
                          fetchPostsForSlug(item.slug)
                        }}
                        className={`w-full px-5 py-3.5 text-left text-[13px] font-semibold transition-colors truncate ${activeSlug === item.slug
                          ? "bg-[#0073ff] text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </aside>

                  <div className="relative min-w-0 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white text-[15px] font-bold">{activeLabel}</h3>
                      <Link
                        href={`/topics/${activeSlug}`}
                        onClick={() => setOpenMega(null)}
                        className="flex items-center gap-1 text-[13px] font-semibold text-white/70 hover:text-[#0073ff] transition-colors shrink-0"
                      >
                        View All <ChevronRight size={14} />
                      </Link>
                    </div>

                    {postsLoading ? (
                      <div className="w-full h-[140px] flex items-center justify-center">
                        <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : activePosts.length === 0 ? (
                      <div className="w-full h-[140px] flex items-center">
                        <p className="text-white/60 text-sm">No articles found for this topic.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-[220px_1fr] gap-5">
                        {activePosts[0] && (
                          <Link href={`/post/${activePosts[0].slug}`} className="group flex flex-col">
                            <div className="relative w-full h-[140px] rounded overflow-hidden mb-2">
                              <Image
                                src={activePosts[0].imageUrl || "/placeholder.svg"}
                                alt={activePosts[0].title}
                                fill
                                className="object-cover group-hover:opacity-90 transition-opacity"
                              />
                            </div>
                            <h4 className="text-white font-semibold text-[13px] leading-snug group-hover:text-[#0073ff] line-clamp-2">
                              {activePosts[0].title}
                            </h4>
                          </Link>
                        )}

                        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                          {activePosts.slice(1, 5).map((post: any) => (
                            <article key={post.id}>
                              <Link href={`/post/${post.slug}`}>
                                <div className="relative w-full h-[58px] rounded overflow-hidden mb-1.5">
                                  <Image
                                    src={post.imageUrl || "/placeholder.svg"}
                                    alt={post.title}
                                    fill
                                    className="object-cover hover:opacity-90 transition-opacity"
                                  />
                                </div>
                              </Link>
                              <h4 className="text-[12px] font-semibold text-white leading-snug hover:text-[#0073ff] line-clamp-1 mb-1">
                                <Link href={`/post/${post.slug}`}>{post.title}</Link>
                              </h4>
                              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                                <span className="truncate">By {post.author?.name || post.author || "Matt Rosnor"}</span>
                                <Activity size={11} className="shrink-0" />
                                <span className="shrink-0">{post.views ?? 0} Views</span>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE / OFFCANVAS PANEL ================= */}
      {(isMenuOpen || isMenuClosing) && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/80 ${isMenuClosing ? "mobile-menu-wipe-out" : "mobile-menu-wipe-in"}`}
            onClick={closeMobileMenu}
          />
          <aside
            className={`fixed top-0 right-0 bottom-0 w-[min(400px,100vw)] bg-[#121213] z-50 overflow-y-auto shadow-2xl ${
              isMenuClosing ? "mobile-menu-panel-out" : "mobile-menu-panel-in"
            }`}
            aria-label="Mobile navigation and contact details"
          >
            <button
              onClick={closeMobileMenu}
              className="flex h-10 w-[45px] items-center justify-center bg-[#0073ff] text-white hover:bg-[#0060d6] transition-colors"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="pt-[12px] pb-[50px] px-[50px] text-white">
              <div className="pb-0">
                <Image
                  src="/images/logo5.png"
                  alt="Tooling Trends"
                  width={380}
                  height={120}
                  priority
                  className="h-[120px] w-[380px] object-contain object-left"
                />
              </div>

              <p className="mt-0 text-[16px] leading-[1.6] text-white/70">
                Bringing the latest tooling, manufacturing and mold-making insights to the people shaping the industry.
              </p>

              <div className="grid grid-cols-3 gap-2 mt-3" aria-label="Featured manufacturing gallery">
                {[
                  ["/modern-manufacturing-facility.png", "Modern manufacturing facility"],
                  ["/cad-cam-software-design.jpg", "CAD and CAM design"],
                  ["/cnc-workholding-platform.jpg", "CNC workholding platform"],
                  ["/industrial-mold-tool-product.jpg", "Industrial mold tool"],
                  ["/mold-design-venting.jpg", "Mold design"],
                  ["/manufacturing-worker-training.jpg", "Manufacturing worker"],
                ].map(([src, alt]) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-[10px] bg-[#1D2125]">
                    <Image src={src} alt={alt} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>

              <section className="mt-6">
                <h2 className="text-[20px] font-semibold tracking-[-0.03em]">Quick Contact:</h2>
                <div className="mt-3 space-y-3 text-[16px]">
                  <a href="tel:+990123456789" className="flex items-center gap-3 text-white hover:text-[#0073ff] transition-colors">
                    <Phone size={18} className="text-[#0073ff] shrink-0" strokeWidth={1.7} />
                    <span>+990 123 456 789</span>
                  </a>
                  <a href="mailto:info@toolingtrends.com" className="flex items-center gap-3 text-white hover:text-[#0073ff] transition-colors">
                    <Mail size={18} className="text-[#0073ff] shrink-0" strokeWidth={1.7} />
                    <span>info@toolingtrends.com</span>
                  </a>
                  <div className="flex items-start gap-3 text-white">
                    <MapPin size={18} className="text-[#0073ff] shrink-0 mt-0.5" strokeWidth={1.7} />
                    <span>Madison Avenue, New York</span>
                  </div>
                </div>
              </section>

              <div className="flex gap-2 mt-6">
                {[
                  { label: "Facebook", Icon: Facebook },
                  { label: "Instagram", Icon: Instagram },
                  { label: "LinkedIn", Icon: Linkedin },
                  { label: "X", Icon: X },
                ].map(({ label, Icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white hover:border-[#0073ff] hover:bg-[#0073ff] transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0073ff] px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-[#0060d6] transition-colors"
              >
                Get In Touch <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  )
}