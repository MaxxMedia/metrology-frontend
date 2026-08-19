// app/post/[slug]/page.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Calendar, Eye, ChevronRight, ChevronLeft, Facebook, Twitter, Instagram, Linkedin, Mail, FileText, MessageSquare, ArrowUp, Home } from "lucide-react"

import ShareSection from "@/components/share-section"
import RelatedPostsCarousel from "@/components/related-posts-carousel"
// import ContentGateModal from "@/components/content-gate-modal"
import PostViewCounter from "@/components/PostViewCounter"
import SupplierAds from "@/components/SupplierAds"
import { CommentsSection } from "@/components/comments-section"
import { UserAvatar } from "@/components/user-avatar"
import BlockRenderer from "@/app/admin/components/post/BlockRenderer"
import PostSidebar from "@/components/posts/PostSidebar"
import PostQuoteCard from "@/components/posts/PostQuoteCard"

/* ================= TYPES ================= */
type Author = {
  id: number
  name: string
  bio?: string
  avatarUrl?: string
  role?: string
  company?: string
  companySlug?: string
  profileUrl?: string
  email?: string
}

type Category = {
  id: number
  name: string
  slug?: string
}

type Tag = {
  id: number
  name: string
  slug?: string
}

type Comment = {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: number
    fullName: string
    username: string
    avatarUrl?: string
  }
}

type Post = {
  id: number
  title: string
  slug: string
  excerpt?: string
  content?: string
  contentBlocks?: any[]
  imageUrl?: string
  publishedAt?: string
  authorId?: number
  author?: Author
  category?: Category
  tags?: Tag[]
  youtubeUrl?: string
  views?: number
  shares?: number
  readTime?: string
  videoCaption?: string
  badge?: string
  comments?: Comment[]
  status?: string
  quote?: string
  quoteAuthor?: string
  quotes?: ({ quote: string; author?: string } | string)[]
  highlightQuote?: string
  gallery?: (string | { url?: string; imageUrl?: string; caption?: string })[]
  qa?: {
    question: string
    answer: string
    videoTimestamp?: string
    highlightQuote?: string
  }[]
}

/* ================= DEFAULT AUTHOR ================= */
const DEFAULT_AUTHOR_NAME = "Metrology"
const DEFAULT_AUTHOR_AVATAR = "/images/tooling-trends-avatar.png"

/* ================= YOUTUBE HELPERS ================= */
function getYoutubeEmbed(url?: string) {
  if (!url) return null

  if (url.includes("youtube.com/embed")) return url

  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0]
    return `https://www.youtube.com/embed/${id}`
  }

  return null
}

function sanitizeImageUrl(input?: string | null) {
  if (!input) return "/placeholder.svg"

  const trimmed = input.trim()

  if (trimmed.startsWith("http")) return trimmed

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i)
  if (srcMatch?.[1]) return srcMatch[1]

  const urlMatch = trimmed.match(/https?:\/\/[^"'<>\\s]+/i)
  if (urlMatch?.[0]) return urlMatch[0]

  return `${process.env.NEXT_PUBLIC_API_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`
}

/* ================= PAGE ================= */
export default function PostDetailsPage() {
  const { slug } = useParams()
  const slugValue = Array.isArray(slug) ? slug[0] : slug

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [nextPost, setNextPost] = useState<Post | null>(null)
  const [prevPost, setPrevPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; parentId?: number | null; imageUrl?: string; _count?: { posts?: number } }[]>([])
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const [lastY, setLastY] = useState(0)
  const relatedScrollRef = useRef<HTMLDivElement>(null)

  /* ================= SCROLL & HEADER AWARENESS ================= */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop
      setShowBackToTop(currentY > 400)

      if (currentY > lastY && currentY > 100) {
        setIsScrolledDown(true)
      } else if (currentY < lastY || currentY <= 60) {
        setIsScrolledDown(false)
      }
      setLastY(currentY)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [lastY])

  /* ================= CHECK LOGIN ================= */
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedToken = localStorage.getItem("token")
        setToken(storedToken)

        const hasAccess = localStorage.getItem("premiumAccess") === "true"
        setHasPremiumAccess(hasAccess)
      } catch (e) {
        setToken(null)
      }
    }
  }, [])

  const isLoggedIn = !!token

  /* ================= FETCH POST BY SLUG ================= */
  useEffect(() => {
    async function fetchPost() {
      if (!slugValue) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${encodeURIComponent(slugValue)}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        if (res.ok) {
          const data = await res.json()
          if (data && typeof data === "object" && data !== null && "id" in data) {
            setPost(data as Post)
            return
          }
        }

        const idRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${encodeURIComponent(slugValue)}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        if (idRes.ok) {
          const data = await idRes.json()
          if (data && typeof data === "object" && data !== null && "id" in data) {
            setPost(data as Post)
            return
          }
        }

        throw new Error(`Post with slug "${slugValue}" not found`)
      } catch (err) {
        console.error("Failed to load post:", err)
        setError(err instanceof Error ? err.message : "Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slugValue])

  /* ================= FETCH RELATED POSTS ================= */
  useEffect(() => {
    async function fetchRelated() {
      if (!post) return
      try {
        const categorySlug = post.category?.slug || ""
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${categorySlug}&limit=7`,
        )
        if (!res.ok) return
        const data = await res.json()
        let list: Post[] = []
        if (Array.isArray(data)) {
          list = data
        } else if (data && typeof data === "object") {
          list = (data as any).posts || (data as any).data || []
        }
        const filtered = list.filter((p) => p.id !== post.id)
        setRelatedPosts(filtered.slice(0, 4))
        setNextPost(filtered[0] || null)
        setPrevPost(filtered[1] || null)
      } catch (err) {
        console.error("Failed to load related posts:", err)
      }
    }
    fetchRelated()
  }, [post])

  /* ================= RELATED POST AUTO-SCROLL (one card every ~3.5s, seamless loop) ================= */
  useEffect(() => {
    if (relatedPosts.length === 0) return
    const scrollContainer = relatedScrollRef.current
    if (!scrollContainer) return

    scrollContainer.scrollLeft = 0
    let paused = false
    let animId: number | null = null

    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

    const animateTo = (target: number, duration: number, onDone?: () => void) => {
      const start = scrollContainer.scrollLeft
      const distance = target - start
      const startTime = performance.now()

      const frame = (now: number) => {
        const elapsed = now - startTime
        const t = Math.min(elapsed / duration, 1)
        scrollContainer.scrollLeft = start + distance * easeInOutQuad(t)

        if (t < 1) {
          animId = requestAnimationFrame(frame)
        } else {
          animId = null
          onDone?.()
        }
      }
      animId = requestAnimationFrame(frame)
    }

    const tick = () => {
      if (paused || !scrollContainer || animId !== null) return

      const firstCard = scrollContainer.firstElementChild as HTMLElement | null
      if (!firstCard) return

      const gap = Number.parseFloat(getComputedStyle(scrollContainer).columnGap || "0")
      const cardWidth = firstCard.offsetWidth + gap
      const halfWidth = scrollContainer.scrollWidth / 2
      const target = scrollContainer.scrollLeft + cardWidth

      animateTo(target, 700, () => {
        if (scrollContainer.scrollLeft >= halfWidth - 1) {
          // Duplicated content lines up exactly here — instant wrap is invisible
          scrollContainer.scrollLeft -= halfWidth
        }
      })
    }

    const intervalId = window.setInterval(tick, 3500)

    const pause = () => { paused = true }
    const resume = () => { paused = false }

    scrollContainer.addEventListener("mouseenter", pause)
    scrollContainer.addEventListener("mouseleave", resume)
    scrollContainer.addEventListener("touchstart", pause, { passive: true })
    scrollContainer.addEventListener("touchend", resume)

    return () => {
      window.clearInterval(intervalId)
      if (animId !== null) cancelAnimationFrame(animId)
      scrollContainer.removeEventListener("mouseenter", pause)
      scrollContainer.removeEventListener("mouseleave", resume)
      scrollContainer.removeEventListener("touchstart", pause)
      scrollContainer.removeEventListener("touchend", resume)
    }
  }, [relatedPosts.length])

  const carouselPosts = relatedPosts.length > 0 ? [...relatedPosts, ...relatedPosts] : relatedPosts

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    async function fetchComments() {
      if (!post) return

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}/comments`
        )

        if (!res.ok) return

        const data = await res.json()
        if (Array.isArray(data)) {
          setComments(data as Comment[])
        }
      } catch (err) {
        console.error("Failed to load comments", err)
      }
    }

    fetchComments()
  }, [post])

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
        if (!res.ok) return
        const data = await res.json()
        const list = Array.isArray(data) ? data : (data as any).categories || (data as any).data || []
        const mainOnly = list.filter((c: any) => c.parentId === null || c.parentId === undefined)
        setCategories(mainOnly)
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }
    fetchCategories()
  }, [])

  /* ================= CONTENT GATE ================= */
  useEffect(() => {
    if (hasPremiumAccess || !post || loading) return

    const timer = setTimeout(() => setShowGate(true), 9000)
    return () => clearTimeout(timer)
  }, [hasPremiumAccess, post, loading])

  /* ================= HANDLE REGISTRATION SUCCESS ================= */
  const handleRegistrationSuccess = () => {
    localStorage.setItem("premiumAccess", "true")
    setHasPremiumAccess(true)
    setShowGate(false)
  }

  /* ================= HANDLE COMMENT ADDED ================= */
  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev])
  }

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d14]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  /* ================= ERROR STATE ================= */
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d14] px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-2xl font-bold text-white mb-3">Post Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || "The post you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const embedUrl = getYoutubeEmbed(post.youtubeUrl)
  const allowYoutube = post.category?.slug === "video" || post.category?.slug === "industry-talks"

  const imageUrl = post.imageUrl?.startsWith("http")
    ? post.imageUrl
    : post.imageUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
      : "/placeholder.svg"

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "Today"

  const author = post.author

  const relatedImageUrl = (p: Post) =>
    sanitizeImageUrl(p.imageUrl)

  /* ================= LAYOUT ================= */
  return (
    <>
      {/* <ContentGateModal
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        onSuccess={handleRegistrationSuccess}
        contentTitle={post.category?.name || "premium content"}
      /> */}

      <main className="bg-[#0a0d14] min-h-screen">
        {slugValue && <PostViewCounter slug={slugValue} />}

        <div className="max-w-[1500px] mx-auto px-4 pt-3 sm:pt-4 sm:px-6 lg:px-10 xl:px-12">
          {/* Breadcrumb Navigation - Styled according to photo */}
          <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-300 mb-10 sm:mb-12 pb-3 border-b border-gray-800/50">
            <Link href="/" className="inline-flex items-center gap-1.5 text-gray-200 hover:text-white font-medium transition-colors">
              <Home size={14} className="text-gray-300" />
              <span>Home</span>
            </Link>
            <span className="text-gray-400 font-sans text-sm">→</span>
            <Link href="/blog" className="text-gray-200 hover:text-white font-medium transition-colors">
              Blog
            </Link>
            <span className="text-gray-400 font-sans text-sm">→</span>
            <span className="text-gray-300 font-normal truncate max-w-xs sm:max-w-md md:max-w-xl">
              {post.title}
            </span>
          </nav>

          {/* ========== MAIN CONTENT + SIDEBAR GRID ========== */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* LEFT: main content */}
            <article className="min-w-0 overflow-hidden">

              {/* HERO IMAGE */}
              <div className="relative w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                <div style={{ aspectRatio: "16/9", width: "100%", position: "relative" }}>
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                    priority
                  />
                </div>
                {post.badge && (
                  <span className="absolute top-4 left-4 text-xs font-semibold uppercase text-white bg-blue-600 px-3 py-1 rounded-full">
                    {post.badge}
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 mb-3 leading-tight">
                {post.title}
              </h1>

              {/* META INFO */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                <Link
                  href={author?.profileUrl || "#"}
                  className="flex items-center gap-2 font-medium text-gray-200 hover:text-blue-400"
                >
                  <UserAvatar
                    name={author?.name || DEFAULT_AUTHOR_NAME}
                    imageUrl={author?.avatarUrl || DEFAULT_AUTHOR_AVATAR}
                    size="xs"
                  />
                  {author?.name || DEFAULT_AUTHOR_NAME}
                </Link>

                <span className="text-gray-500">•</span>

                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  {date}
                </span>

                {post.category?.name && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="flex items-center gap-1">
                      <FileText size={14} className="text-gray-500" />
                      {post.category.name}
                    </span>
                  </>
                )}

                <span className="text-gray-500">•</span>

                <span className="flex items-center gap-1">
                  <MessageSquare size={14} className="text-gray-500" />
                  {comments.length > 0 ? `${comments.length} Comments` : "No Comments"}
                </span>
              </div>

              {/* EXCERPT */}
              {post.excerpt && (
                <p className="text-gray-400 text-base md:text-lg leading-relaxed mt-4">
                  {post.excerpt}
                </p>
              )}

              {/* BACKEND QUOTE DISPLAY */}
              {(() => {
                const fetchedQuote =
                  post.quote ||
                  post.highlightQuote ||
                  (Array.isArray(post.quotes) && post.quotes.length > 0
                    ? typeof post.quotes[0] === "string"
                      ? post.quotes[0]
                      : post.quotes[0]?.quote
                    : undefined);

                const fetchedAuthor =
                  post.quoteAuthor ||
                  (Array.isArray(post.quotes) && post.quotes.length > 0 && typeof post.quotes[0] === "object"
                    ? post.quotes[0]?.author
                    : undefined) ||
                  author?.name;

                if (!fetchedQuote) return null;

                return <PostQuoteCard quote={fetchedQuote} author={fetchedAuthor} />;
              })()}

              {/* CONTENT */}
              <div className="post-article-content prose prose-lg prose-invert max-w-none break-words overflow-hidden mt-6 text-gray-300 prose-headings:!text-white prose-p:!text-gray-300 prose-li:!text-gray-300 prose-strong:!text-white prose-em:!text-gray-300 prose-a:!text-blue-400 prose-img:rounded-xl prose-th:!text-gray-200 prose-td:!text-gray-300 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-gray-300 [&_li]:!text-gray-300 [&_strong]:!text-white [&_.prose]:prose-invert [&_.prose_p]:!text-gray-300 [&_.prose_h1]:!text-white [&_.prose_h2]:!text-white [&_.prose_h3]:!text-white [&_.prose_strong]:!text-white">
                {post.contentBlocks && post.contentBlocks.length > 0 ? (
                  <BlockRenderer blocks={post.contentBlocks} />
                ) : post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="text-gray-500">No content available</p>
                )}
              </div>

              {/* BACKEND GALLERY DISPLAY */}
              {(() => {
                if (!post.gallery || !Array.isArray(post.gallery) || post.gallery.length === 0) {
                  return null;
                }

                const galleryImages = post.gallery
                  .map((item: any) => (typeof item === "string" ? item : item.imageUrl || item.url || ""))
                  .filter(Boolean);

                if (galleryImages.length === 0) return null;

                const isTwoPhotos = galleryImages.length === 2;

                return (
                  <div className="mt-8 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Gallery</h3>
                    <div
                      className={`grid ${
                        isTwoPhotos
                          ? "grid-cols-1 md:grid-cols-2 gap-6"
                          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                      }`}
                    >
                      {galleryImages.map((src: string, idx: number) => (
                        <div key={idx} className="relative w-full overflow-hidden rounded-xl border border-gray-800/80">
                          <img
                            src={src}
                            alt={`Gallery image ${idx + 1}`}
                            className={`w-full ${
                              isTwoPhotos ? "h-80 md:h-[420px]" : "h-48 md:h-60"
                            } object-cover rounded-xl transition-transform duration-300 hover:scale-105`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* YOUTUBE VIDEO */}
              {allowYoutube && post.youtubeUrl && (
                <div className="mt-10">
                  {embedUrl ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-800 shadow-sm">
                      <iframe
                        src={embedUrl}
                        title={post.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="w-full rounded-xl border border-gray-800 bg-black text-white flex flex-col items-center justify-center py-16 px-6 text-center">
                      <p className="text-lg font-semibold mb-4">Watch on YouTube</p>
                      <a
                        href={post.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        Open YouTube →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* SHARE SECTION */}
              <ShareSection post={post} />

              {/* AUTHOR BIO */}
              {author && (
                <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-start gap-4">
                  <UserAvatar name={author.name} imageUrl={author.avatarUrl} size="lg" />
                  <div className="flex-1">
                    <p className="text-xl font-bold text-white">{author.name}</p>
                    {author.bio && (
                      <p className="text-sm text-gray-400 leading-relaxed mt-1">{author.bio}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <a href="#" className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"><Facebook size={14} /></a>
                      <a href="#" className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"><Twitter size={14} /></a>
                      <a href="#" className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"><Instagram size={14} /></a>
                      <a href="#" className="w-8 h-8 rounded flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"><Linkedin size={14} /></a>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIOUS / NEXT POST */}
              {(prevPost || nextPost) && (
                <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-800 pt-6 sm:gap-6 sm:grid-cols-2">
                  {prevPost ? (
                    <Link
                      href={`/post/${prevPost.slug}`}
                      className="group flex min-w-0 items-center gap-3 sm:gap-4"
                      aria-label={`Previous post: ${prevPost.title}`}
                    >
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-800">
                        <Image
                          src={relatedImageUrl(prevPost)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 56px, 80px"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                          <ChevronLeft size={14} /> Previous
                        </p>
                        <p className="line-clamp-2 text-[15px] sm:text-[18px] font-bold text-white group-hover:text-blue-400">
                          {prevPost.title}
                        </p>
                      </div>
                    </Link>
                  ) : <div />}

                  {nextPost && (
                    <Link
                      href={`/post/${nextPost.slug}`}
                      className="group flex min-w-0 items-center justify-end gap-3 sm:gap-4 text-right"
                      aria-label={`Next post: ${nextPost.title}`}
                    >
                      <div className="min-w-0">
                        <p className="flex items-center justify-end gap-1 text-xs font-semibold text-gray-500 mb-1">
                          Next <ChevronRight size={14} />
                        </p>
                        <p className="line-clamp-2 text-[15px] sm:text-[18px] font-bold text-white group-hover:text-blue-400">
                          {nextPost.title}
                        </p>
                      </div>
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-800">
                        <Image
                          src={relatedImageUrl(nextPost)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 56px, 80px"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {/* COMMENTS */}
              <div className="mt-10 pt-6 border-t border-gray-800">
                <CommentsSection
                  postId={post.id}
                  initialComments={comments}
                  isLoggedIn={isLoggedIn}
                  token={token}
                  onCommentAdded={handleCommentAdded}
                />
              </div>

              {/* RELATED POST (card carousel) */}
              {relatedPosts.length > 0 && (
                <div className="mt-10 pt-6">
                  <div
                    className="flex items-center gap-4 lg:mb-0 mb-4"
                    style={{ margin: "55px 0px 30px" }}
                  >
                    <h2 className="flex-shrink-0 text-xl font-bold text-white sm:text-2xl">
                      Related Post
                    </h2>

                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-blue-500" />

                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[7px]">
                        <div style={{ height: "1px", backgroundColor: "#374151" }} />
                        <div style={{ height: "1px", backgroundColor: "#374151" }} />
                      </div>

                      <span className="h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-blue-500" />
                    </div>

                    {relatedPosts.length > 3 && (
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("related-post-scroll")?.scrollBy({ left: -280, behavior: "smooth" })
                          }
                          className="w-9 h-9 flex items-center justify-center rounded-md border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("related-post-scroll")?.scrollBy({ left: 280, behavior: "smooth" })
                          }
                          className="w-9 h-9 flex items-center justify-center rounded-md border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="lg:hidden">
                    <Link
                      href={`/post/${relatedPosts[0].slug}`}
                      className="group block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-600 transition-colors"
                      style={{
                        margin: "0px 0px 10px",
                        padding: "12px 12px 18px",
                      }}
                    >
                      <div className="relative w-full aspect-[4/3] bg-gray-800">
                        <Image
                          src={relatedImageUrl(relatedPosts[0])}
                          alt={relatedPosts[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="100vw"
                        />
                      </div>
                      <div className="pt-3">
                        {relatedPosts[0].category?.name && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-white bg-blue-600 px-2.5 py-1 rounded mb-3">
                            {relatedPosts[0].category.name}
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400">
                          {relatedPosts[0].title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          {relatedPosts[0].author?.name && <span>By {relatedPosts[0].author.name}</span>}
                          {typeof relatedPosts[0].views === "number" && (
                            <span className="flex items-center gap-1">
                              <Eye size={12} className="text-gray-500" />
                              {relatedPosts[0].views.toLocaleString()} Views
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div
                    id="related-post-scroll"
                    ref={relatedScrollRef}
                    className="hidden lg:flex fpg-post-slider gap-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {carouselPosts.map((p, index) => (
                      <Link
                        key={`${p.id}-${index}`}
                        href={`/post/${p.slug}`}
                        className="fpg-card-style style-one group flex-shrink-0 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-600 transition-colors"
                        style={{
                          width: "calc((100% - 2.5rem) / 3)",
                          height: "331.94px",
                          margin: "0px 0px 10px",
                          padding: "12px 12px 25px",
                        }}
                      >
                        <div className="relative w-full h-[141.09px] bg-gray-800 rounded-[10px] overflow-hidden">
                          <Image
                            src={relatedImageUrl(p)}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="260px"
                          />
                        </div>
                        <div className="fpg-post-content" style={{ padding: "12px 15px 0px" }}>
                          {p.category?.name && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-white bg-blue-600 px-2.5 py-1 rounded mb-3">
                              {p.category.name}
                            </span>
                          )}
                          <h3
                            className="font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400"
                            style={{ fontSize: "18px" }}
                          >
                            {p.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            {p.author?.name && <span>By {p.author.name}</span>}
                            {typeof p.views === "number" && (
                              <span className="flex items-center gap-1">
                                <Eye size={12} className="text-gray-500" />
                                {p.views.toLocaleString()} Views
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* RIGHT: Sidebar - Sticky, sits alongside the main column */}
            <div className="w-full">
              <div
                className={`lg:sticky space-y-6 transition-all duration-300 ease-in-out ${
                  isScrolledDown ? "lg:top-6" : "lg:top-[125px]"
                }`}
              >

                {/* Author Card */}
                {/* {author && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold tracking-wide uppercase text-gray-500 mb-4">
                      About the Author
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <UserAvatar name={author.name} imageUrl={author.avatarUrl} size="lg" />
                      <div>
                        <p className="text-sm font-bold text-white">{author.name}</p>
                        {author.role && <p className="text-xs text-gray-500">{author.role}</p>}
                        {author.company && <p className="text-xs text-gray-500">{author.company}</p>}
                      </div>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                        {author.bio}
                      </p>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:underline mt-3"
                      >
                        <Mail size={14} />
                        {author.email}
                      </a>
                    )}
                  </div>
                )} */}

                {/* Posts Sidebar - Recent, Popular, Company (4 articles each, tabbed) */}
                <PostSidebar
                  currentPostId={post.id}
                  categorySlug={post.category?.slug}
                />

                {/* Banner - directly after the 4-article tabbed list */}
                <SupplierAds />

                {/* Explore Categories - only top 6 shown */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-white mb-4">
                      Explore Categories
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </h3>
                    <div className="space-y-3">
                      {categories.slice(0, 6).map((cat) => {
                        const catImgSrc = cat.imageUrl?.startsWith("http")
                          ? cat.imageUrl
                          : cat.imageUrl
                            ? `${process.env.NEXT_PUBLIC_API_URL}${cat.imageUrl}`
                            : null

                        return (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug || cat.name.toLowerCase()}`}
                            className="relative flex items-center justify-between h-14 rounded-lg overflow-hidden group bg-gray-800"
                          >
                            {catImgSrc && (
                              <Image
                                src={catImgSrc}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="320px"
                                onError={(e) => {
                                  ;(e.currentTarget as HTMLImageElement).style.display = "none"
                                }}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
                            <span className="relative pl-4 text-sm font-semibold text-white">
                              {cat.name} {typeof cat._count?.posts === "number" && `(${cat._count.posts})`}
                            </span>
                            <span className="relative mr-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-blue-600 transition-colors">
                              <ChevronRight size={14} />
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Follow Us - after Explore Categories */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-base font-bold text-white mb-4">Follow Us</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <a href="#" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg p-3">
                      <Facebook size={18} className="text-white flex-shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">Facebook</span>
                        <span className="block text-xs text-white/80">88.2k Followers</span>
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-3">
                      <Twitter size={18} className="text-white flex-shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">Twitter - X</span>
                        <span className="block text-xs text-gray-300">48.6k Followers</span>
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 transition-colors rounded-lg p-3">
                      <span className="text-white flex-shrink-0">●</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">Dribbble</span>
                        <span className="block text-xs text-white/80">39.5k Followers</span>
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg p-3">
                      <span className="text-white flex-shrink-0">P</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">Pinterest</span>
                        <span className="block text-xs text-white/80">28.2k Followers</span>
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 transition-colors rounded-lg p-3">
                      <Linkedin size={18} className="text-white flex-shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">Linkedin</span>
                        <span className="block text-xs text-white/80">30.3k Followers</span>
                      </span>
                    </a>
                    <a href="#" className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors rounded-lg p-3">
                      <Instagram size={18} className="text-white flex-shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">Instagram</span>
                        <span className="block text-xs text-white/80">24.5k Followers</span>
                      </span>
                    </a>
                  </div>
                </div>

                {/* Tags (sidebar) - heading style matches Explore Categories */}
                {post.tags && post.tags.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white mb-4">
                      Tags
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/tag/${tag.slug || tag.name.toLowerCase()}`}
                          className="text-xs font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors px-3 py-1.5 rounded-full"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category */}
                {/* {post.category?.name && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold tracking-wide uppercase text-gray-500 mb-4">
                      Category
                    </h3>
                    <span className="inline-block text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full">
                      {post.category.name}
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* ========== RELATED POSTS (old bottom version, replaced by in-article carousel) ========== */}
        {/*
        {relatedPosts.length > 0 && (
          <section className="max-w-[1320px] mx-auto px-4 pb-16 pt-16">
            <h2 className="text-xl font-bold text-white mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/post/${p.slug}`}
                  className="group flex items-start gap-4"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-800">
                    <Image
                      src={relatedImageUrl(p)}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      {p.author?.name && <span>By {p.author.name}</span>}
                      {typeof p.views === "number" && (
                        <span className="flex items-center gap-1">
                          <Eye size={14} className="text-gray-500" />
                          {p.views.toLocaleString()} Views
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        */}
     {/* <RelatedPostsCarousel /> */}

      </main>
    </>
  )
}
