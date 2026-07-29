"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Clock, Eye, Mail, MessageCircle } from "lucide-react"

import ShareSection from "@/components/share-section"
import RelatedPostsCarousel from "@/components/related-posts-carousel"
import ContentGateModal from "@/components/content-gate-modal"
import PostViewCounter from "@/components/PostViewCounter"
import SupplierAds from "@/components/SupplierAds"

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

type Comment = {
  id: number
  content: string
  createdAt: string
  authorId: number
}

type Post = {
  id: number
  title: string
  slug: string
  excerpt?: string
  content?: string
  imageUrl?: string
  publishedAt?: string
  authorId?: number
  author?: Author
  category?: Category
  youtubeUrl?: string
  views?: number
  shares?: number
  readTime?: string
  videoCaption?: string
  badge?: string
  comments?: Comment[]
  status?: string
  qa?: {
    question: string
    answer: string
    videoTimestamp?: string
    highlightQuote?: string
  }[]
}

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

/* ================= PAGE ================= */
export default function PostDetailsPage() {
  const router = useRouter()
  const { slug } = useParams()
  const slugValue = Array.isArray(slug) ? slug[0] : slug

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [userSubmitted, setUserSubmitted] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])

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
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
          }
        )

        if (res.ok) {
          const data = await res.json()
          if (data && typeof data === "object" && data.id) {
            setPost(data)
            return
          }
        }

        const idRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${encodeURIComponent(slugValue)}`,
          {
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
          }
        )

        if (idRes.ok) {
          const data = await idRes.json()
          if (data && typeof data === "object" && data.id) {
            setPost(data)
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${categorySlug}&limit=5`,
          { cache: "no-store" }
        )
        if (!res.ok) return
        const data = await res.json()
        const list: Post[] = Array.isArray(data) ? data : data.posts || data.data || []
        setRelatedPosts(list.filter((p) => p.id !== post.id).slice(0, 4))
      } catch (err) {
        console.error("Failed to load related posts:", err)
      }
    }
    fetchRelated()
  }, [post])

  /* ================= CONTENT GATE ================= */
  useEffect(() => {
    if (userSubmitted || !post || loading) return
    const timer = setTimeout(() => setShowGate(true), 9000)
    return () => clearTimeout(timer)
  }, [userSubmitted, post, loading])

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#003B5C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  /* ================= ERROR STATE ================= */
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-2xl font-bold text-[#003B5C] mb-3">Post Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The post you're looking for doesn't exist or has been removed."}
          </p>
          <a
            href="/"
            className="inline-block bg-[#003B5C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d47] transition-colors"
          >
            Return to Home
          </a>
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
  const commentCount = post.comments?.length || 0

  /* ================= DEFAULT LAYOUT ================= */
  return (
    <>
      <ContentGateModal
        isOpen={showGate && !userSubmitted}
        onClose={() => setShowGate(false)}
        onSubmit={() => {
          setUserSubmitted(true)
          setShowGate(false)
        }}
      />

      <main className="bg-[#f9f9f9] overflow-x-hidden">
        {slugValue && <PostViewCounter slug={slugValue} />}

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-[1320px] mx-auto px-4 py-10">
            {/* IMAGE - Full width banner */}
            <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
              <div style={{ aspectRatio: "16/9", width: "100%", position: "relative" }}>
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#003049] mt-4 mb-2 leading-tight">
              {post.title}
            </h1>

            {/* ONE LINE: Author | Date | Badge | Category | Views | Comments */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {/* Author with avatar */}
              {author && (
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden">
                    <Image
                      src={author.avatarUrl || "/avatar-placeholder.png"}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="20px"
                    />
                  </div>
                  {author.name}
                </span>
              )}
              
              <span className="text-gray-300">|</span>
              
              {/* Date */}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {date}
              </span>
              
              <span className="text-gray-300">|</span>
              
              {/* Badge */}
              {post.badge && (
                <>
                  <span className="inline-block text-[9px] font-semibold uppercase text-white bg-[#003049] px-2 py-0.5 rounded-full">
                    {post.badge}
                  </span>
                  <span className="text-gray-300">|</span>
                </>
              )}
              
              {/* Category */}
              {post.category?.name && (
                <span className="text-[#003049] font-medium">
                  {post.category.name}
                </span>
              )}
              
              <span className="text-gray-300">|</span>
              
              {/* Views */}
              {typeof post.views === "number" && (
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {post.views.toLocaleString()}
                </span>
              )}
              
              <span className="text-gray-300">|</span>
              
              {/* Comments */}
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {commentCount} Comments
              </span>
            </div>

            {/* EXCERPT */}
            {post.excerpt && (
              <p className="text-gray-600 text-base mt-3 leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-10">
            <article className="max-w-3xl overflow-hidden">
              {/* CONTENT */}
              <div
                className="prose prose-lg max-w-none break-words overflow-hidden prose-headings:text-[#003049] prose-a:text-[#003049] prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              <div className="mt-10 pt-6 border-t border-gray-100">
                <ShareSection post={post} />
              </div>

              {allowYoutube && post.youtubeUrl && (
                <div className="mt-12">
                  {embedUrl ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
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
            </article>

            <div className="w-full overflow-hidden">
              <div className="lg:sticky lg:top-6 space-y-6">
                {/* Author Card in Sidebar */}
                {author && (
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold tracking-wide uppercase text-gray-500 mb-4">
                      About the Author
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-14 h-14 shrink-0">
                        <Image
                          src={author.avatarUrl || "/avatar-placeholder.png"}
                          alt={author.name}
                          fill
                          className="rounded-full border border-gray-200 object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{author.name}</p>
                        {author.role && (
                          <p className="text-xs text-gray-500">{author.role}</p>
                        )}
                        {author.company && (
                          <p className="text-xs text-gray-500">{author.company}</p>
                        )}
                      </div>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 text-justify line-clamp-3">
                        {author.bio}
                      </p>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-[#0F5B78] hover:underline"
                      >
                        <Mail size={14} />
                        {author.email}
                      </a>
                    )}
                  </div>
                )}

                <SupplierAds />
              </div>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <RelatedPostsCarousel />
      </main>
    </>
  )
}