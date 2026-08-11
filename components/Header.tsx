"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSmall,
  Search,
  User as UserIcon,
  Calendar,
  Facebook,
  Instagram,
  Linkedin,
  Activity,
} from "lucide-react"
import { useState, useEffect, useRef, type FormEvent } from "react"
import type { Post } from "@/types/Post"
import { ARTICLE_TOPICS as TOPICS, RESOURCE_TOPICS as RESOURCES } from "@/lib/topic"

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

export default function Header() {
  const [openMega, setOpenMega] = useState<MegaType>(null)
  const [openPagesChild, setOpenPagesChild] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [events, setEvents] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [postsCache, setPostsCache] = useState<Record<string, Post[]>>({})
  const [postsLoading, setPostsLoading] = useState(false)
  const [activeSlug, setActiveSlug] = useState("machine")

  const [tickerPosts, setTickerPosts] = useState<Post[]>([])
  const [tickerIndex, setTickerIndex] = useState(0)

  const contentScrollRef = useRef<HTMLDivElement>(null)
  const container = "max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5"

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  function scrollContent(direction: "left" | "right") {
    const el = contentScrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.9
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

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
    if (tickerPosts.length <= 1) return
    const t = setInterval(() => {
      setTickerIndex((i) => (i + 1) % tickerPosts.length)
    }, 4000)
    return () => clearInterval(t)
  }, [tickerPosts.length])

  async function fetchPostsForSlug(slug: string) {
    if (["events", "suppliers"].includes(slug)) return
    if (postsCache[slug]) return
    setPostsLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${encodeURIComponent(slug)}&limit=6`
      )
      const data = await res.json()
      const posts: Post[] = Array.isArray(data?.data) ? data.data : []
      setPostsCache((prev) => ({ ...prev, [slug]: posts }))
    } catch {
      setPostsCache((prev) => ({ ...prev, [slug]: [] }))
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => { })
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers?limit=6`)
      .then((res) => res.json())
      .then((data) => setSuppliers(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => { })
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset"
  }, [isMenuOpen])

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ left: 0 })
  }, [activeSlug, openMega])

  const activePosts = postsCache[activeSlug] ?? []
  const activeTicker = tickerPosts[tickerIndex]
  const activeLabel =
    (openMega === "topics" ? TOPICS : openMega === "resources" ? RESOURCES : []).find(
      (i) => i.slug === activeSlug
    )?.label ?? ""
  const isBrowsableList = activeSlug === "events" || activeSlug === "suppliers"

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
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ================= TOP UTILITY BAR ================= */}
      <div className="">
        <div className={`${container} h-[42px] flex items-center justify-between gap-4 text-[13px]`}>
          {/* Live News */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
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
            <div className="min-w-0 flex-1 overflow-hidden">
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
          </div>

          {/* Weather */}
          <div className="hidden md:flex items-center gap-2 text-white shrink-0 whitespace-nowrap">
            <CloudSunIcon className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span className="font-semibold">
              28.3<sup className="text-[10px]">°C</sup>
            </span>
            <span className="text-white/70">California</span>
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
              className="h-[48px] w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0">
            <Link href="/" className={`${navLinkClass} text-[#0073ff]`}>
              Home
            </Link>

            <button
              onMouseEnter={() => {
                setOpenMega("topics")
                setActiveSlug("machine")
                fetchPostsForSlug("machine")
              }}
              className={navLinkClass}
            >
              Topics <ChevronDown size={14} className="shrink-0" />
            </button>

            <button
              onMouseEnter={() => {
                setOpenMega("resources")
                setActiveSlug("webinars")
                fetchPostsForSlug("webinars")
              }}
              className={navLinkClass}
            >
              Resources <ChevronDown size={14} className="shrink-0" />
            </button>

            {/* ---- Pages: trigger + anchored narrow dropdown ---- */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMega("pages")}
              onMouseLeave={() => {
                setOpenMega(null)
                setOpenPagesChild(null)
              }}
            >
              <button className={navLinkClass}>
                Pages <ChevronDown size={14} className="shrink-0" />
              </button>

              {openMega === "pages" && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-[#111318] shadow-2xl overflow-visible z-30 py-2 mt-6">
                  {PAGES_LINKS.map((item) => (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => item.children && setOpenPagesChild(item.href)}
                      onMouseLeave={() => item.children && setOpenPagesChild(null)}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpenMega(null)}
                        className="flex items-center justify-between px-4 py-2.5 text-[13.5px] text-white/80 hover:text-white hover:bg-white/5 transition-colors truncate"
                      >
                        {item.label}
                        {item.children && <ChevronRightSmall size={14} className="shrink-0 text-white/40" />}
                      </Link>

                      {item.children && openPagesChild === item.href && (
                        <div className="absolute top-0 left-full ml-1 w-52 bg-[#111318] border border-white/10 rounded-lg shadow-2xl py-2 z-40">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenMega(null)}
                              className="block px-4 py-2.5 text-[13.5px] text-white/80 hover:text-white hover:bg-white/5 transition-colors truncate"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
              className="h-10 w-10 flex items-center justify-center rounded-[4px] bg-[#15171f] border border-white/10 text-white hover:border-[#0073ff] transition-colors lg:hidden shrink-0"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
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
          className="hidden lg:flex justify-center absolute left-0 right-0 z-20 px-3 sm:px-4 lg:px-5"
        >
          <div className="w-full max-w-[1400px]  bg-[#111318] shadow-2xl">
            <div className={`py-8 px-6 lg:px-8 grid grid-cols-[240px_1fr] gap-8 items-stretch`}>
              <aside className="bg-[#15171f]  overflow-hidden">
                {(openMega === "topics" ? TOPICS : RESOURCES).map((item) => (
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

              <div className="relative min-w-0">
                {/* Header row: category label + View All (mirrors reference) */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-[15px] font-bold">{activeLabel}</h3>
                  {isBrowsableList ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => scrollContent("left")} aria-label="Scroll left" className="text-white/60 hover:text-white shrink-0">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={() => scrollContent("right")} aria-label="Scroll right" className="text-white/60 hover:text-white shrink-0">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={activeSlug === "webinars" ? "/Webinar" : `/topics/${activeSlug}`}
                      onClick={() => setOpenMega(null)}
                      className="flex items-center gap-1 text-[13px] font-semibold text-white/70 hover:text-[#0073ff] transition-colors shrink-0"
                    >
                      View All <ChevronRight size={14} />
                    </Link>
                  )}
                </div>

                {isBrowsableList ? (
                  <div
                    ref={contentScrollRef}
                    className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {activeSlug === "events" ? (
                      events.length === 0 ? (
                        <p className="text-white/60">No upcoming events available.</p>
                      ) : (
                        events.slice(0, 6).map((event) => (
                          <div
                            key={event.id}
                            className="text-white flex flex-col shrink-0 snap-start"
                            style={{ width: "calc((100% - 5 * 1.25rem) / 6)", minWidth: "160px" }}
                          >
                            <Link href={`/events/${event.slug}`} className="block">
                              <div className="relative w-full h-36 mb-3 bg-[#1a1c24] rounded overflow-hidden">
                                {event.logoUrl ? (
                                  <Image src={event.logoUrl} alt={event.title} fill className="object-contain p-2" sizes="200px" />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">No Image</div>
                                )}
                              </div>
                            </Link>
                            <h4 className="text-sm font-semibold hover:text-[#0073ff] line-clamp-2">
                              <Link href={`/events/${event.slug}`}>{event.title}</Link>
                            </h4>
                          </div>
                        ))
                      )
                    ) : suppliers.length === 0 ? (
                      <p className="text-white/60">No suppliers available.</p>
                    ) : (
                      suppliers.slice(0, 6).map((supplier) => (
                        <div
                          key={supplier.id}
                          className="text-white flex flex-col shrink-0 snap-start"
                          style={{ width: "calc((100% - 5 * 1.25rem) / 6)", minWidth: "160px" }}
                        >
                          <Link href={`/suppliers/${supplier.slug}`} className="block">
                            <div className="relative w-full h-36 mb-3 bg-[#1a1c24] rounded overflow-hidden">
                              {supplier.logoUrl ? (
                                <Image src={supplier.logoUrl} alt={supplier.name} fill className="object-contain p-2" sizes="200px" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">No Image</div>
                              )}
                            </div>
                          </Link>
                          <h4 className="text-sm font-semibold hover:text-[#0073ff] line-clamp-2">
                            <Link href={`/suppliers/${supplier.slug}`}>{supplier.name}</Link>
                          </h4>
                        </div>
                      ))
                    )}
                  </div>
                ) : postsLoading ? (
                  <div className="w-full flex items-center justify-center py-16">
                    <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : activePosts.length === 0 ? (
                  <p className="text-white/60 text-sm py-6">No articles found for this topic.</p>
                ) : (
                  // Featured item + 2x2 grid (matches reference layout)
                  <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-6">
                    {activePosts[0] && (
                      <Link
                        href={activeSlug === "webinars" ? `/Webinar/${activePosts[0].slug}` : `/post/${activePosts[0].slug}`}
                        className="group flex flex-col"
                      >
                        <div className="relative w-full h-56 md:h-full min-h-[240px] rounded overflow-hidden mb-3">
                          <Image
                            src={activePosts[0].imageUrl || "/placeholder.svg"}
                            alt={activePosts[0].title}
                            fill
                            className="object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                        <h4 className="text-white font-semibold text-[15px] leading-snug group-hover:text-[#0073ff] line-clamp-2">
                          {activePosts[0].title}
                        </h4>
                      </Link>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                      {activePosts.slice(1, 5).map((post: any) => (
                        <article key={post.id}>
                          <Link href={activeSlug === "webinars" ? `/Webinar/${post.slug}` : `/post/${post.slug}`}>
                            <div className="relative w-full h-28 rounded overflow-hidden mb-2">
                              <Image
                                src={post.imageUrl || "/placeholder.svg"}
                                alt={post.title}
                                fill
                                className="object-cover hover:opacity-90 transition-opacity"
                              />
                            </div>
                          </Link>
                          <h4 className="text-sm font-semibold text-white leading-snug hover:text-[#0073ff] line-clamp-2 mb-1.5">
                            <Link href={activeSlug === "webinars" ? `/Webinar/${post.slug}` : `/post/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h4>
                          <div className="flex items-center gap-1.5 text-[12px] text-white/50">
                            <span className="truncate">By {post.author?.name || post.author || "Matt Rosnor"}</span>
                            <Activity size={12} className="shrink-0" />
                            <span className="shrink-0">{post.views ?? 0} Views</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE / OFFCANVAS PANEL ================= */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[min(360px,90vw)] bg-[#1D2125] z-50 overflow-y-auto border-l border-white/10">
            <div className="flex items-center justify-between px-5 h-[72px] border-b border-white/10">
              <Image
                src="/images/logo5.png"
                alt="Tooling Trends"
                width={140}
                height={44}
                className="h-10 w-auto object-contain"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="h-9 w-9 flex items-center justify-center rounded text-white hover:bg-white/10 shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="py-3 text-white font-semibold">
              <Link href="/" className="block px-5 py-3.5 border-b border-white/10 hover:bg-white/5 truncate" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/topics" className="block px-5 py-3.5 border-b border-white/10 hover:bg-white/5 truncate" onClick={() => setIsMenuOpen(false)}>Topics</Link>
              <Link href="/Webinar" className="block px-5 py-3.5 border-b border-white/10 hover:bg-white/5 truncate" onClick={() => setIsMenuOpen(false)}>Resources</Link>
              {PAGES_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-5 py-3.5 border-b border-white/10 hover:bg-white/5 truncate"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {!user ? (
                <div className="px-5 py-5 flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="block w-full py-3 border border-white/20 text-white rounded-[4px] text-center font-semibold hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full py-3 bg-[#0073ff] text-white rounded-[4px] text-center font-semibold hover:bg-[#0060d6]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-5 py-5 flex flex-col gap-3">
                  <Link
                    href={
                      user.role === "admin"
                        ? "/admin/dashboard"
                        : user.role === "recruiter"
                          ? "/recruiter/dashboard"
                          : `/candidate/${user.username || user.email?.split("@")[0] || "profile"}`
                    }
                    className="block w-full py-3 bg-[#0073ff] text-white rounded-[4px] text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 border border-red-500/40 text-red-400 rounded-[4px] font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  )
}