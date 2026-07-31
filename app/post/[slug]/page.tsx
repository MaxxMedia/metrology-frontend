// app/post/[slug]/page.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Calendar, Eye, MessageCircle, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

import ShareSection from "@/components/share-section"
import RelatedPostsCarousel from "@/components/related-posts-carousel"
import ContentGateModal from "@/components/content-gate-modal"
import PostViewCounter from "@/components/PostViewCounter"
import SupplierAds from "@/components/SupplierAds"
import { CommentsSection } from "@/components/comments-section"
import { UserAvatar } from "@/components/user-avatar"
import BlockRenderer from "@/app/admin/components/post/BlockRenderer"
import PostSidebar from "@/components/posts/PostSidebar"

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
  const { slug } = useParams()
  const slugValue = Array.isArray(slug) ? slug[0] : slug

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [userSubmitted, setUserSubmitted] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [nextPost, setNextPost] = useState<Post | null>(null)

  /* ================= CHECK LOGIN ================= */
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedToken = localStorage.getItem("token")
        setToken(storedToken)
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
        setRelatedPosts(filtered.slice(0, 6))
        setNextPost(filtered[0] || null)
      } catch (err) {
        console.error("Failed to load related posts:", err)
      }
    }
    fetchRelated()
  }, [post])

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

  /* ================= CONTENT GATE ================= */
  useEffect(() => {
    if (userSubmitted || !post || loading) return
    const timer = setTimeout(() => setShowGate(true), 9000)
    return () => clearTimeout(timer)
  }, [userSubmitted, post, loading])

  /* ================= HANDLE COMMENT ADDED ================= */
  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev])
  }

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
          <Link
            href="/"
            className="inline-block bg-[#003B5C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002d47] transition-colors"
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
  const commentCount = comments.length

  const relatedImageUrl = (p: Post) =>
    p.imageUrl?.startsWith("http")
      ? p.imageUrl
      : p.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${p.imageUrl}`
        : "/placeholder.svg"

  /* ================= LAYOUT ================= */
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

      <main className="bg-white overflow-x-hidden">
        {slugValue && <PostViewCounter slug={slugValue} />}

        {/* ========== SINGLE MERGED GRID: main column + sidebar ========== */}
        <div className="max-w-[1320px] mx-auto px-4 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-10">
            {/* LEFT: everything flows in one continuous column */}
            <article className="max-w-3xl overflow-hidden">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <Link href="/" className="hover:text-[#003049]">Home</Link>
                <ChevronRight size={12} />
                <Link href="/blog" className="hover:text-[#003049]">Blog</Link>
                {post.category?.name && (
                  <>
                    <ChevronRight size={12} />
                    <span className="hover:text-[#003049]">{post.category.name}</span>
                  </>
                )}
              </nav>

              {/* HERO IMAGE */}
              <div className="relative w-full max-w-[700px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
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
                  <span className="absolute top-4 left-4 text-xs font-semibold uppercase text-white bg-[#003049] px-3 py-1 rounded-full">
                    {post.badge}
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003049] mt-6 mb-3 leading-tight max-w-4xl">
                {post.title}
              </h1>

              {/* META INFO */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                {author && (
                  <Link
                    href={author.profileUrl || "#"}
                    className="flex items-center gap-2 font-medium text-gray-700 hover:text-[#003049]"
                  >
                    <UserAvatar name={author.name} imageUrl={author.avatarUrl} size="xs" />
                    {author.name}
                  </Link>
                )}

                <span className="text-gray-300">•</span>

                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  {date}
                </span>

                {post.category?.name && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="inline-block text-xs font-semibold uppercase tracking-wide text-white bg-[#003049] px-3 py-1 rounded-full">
                      {post.category.name}
                    </span>
                  </>
                )}

                {typeof post.views === "number" && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} className="text-gray-400" />
                      {post.views.toLocaleString()} Views
                    </span>
                  </>
                )}

                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} className="text-gray-400" />
                  {commentCount === 0 ? "No Comments" : `${commentCount} Comments`}
                </span>
              </div>

              {/* EXCERPT */}
              {post.excerpt && (
                <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mt-4">
                  {post.excerpt}
                </p>
              )}

              {/* CONTENT - now directly continues the same column, no gap */}
              <div className="prose prose-lg max-w-none break-words overflow-hidden prose-headings:text-[#003049] prose-a:text-[#003049] prose-img:rounded-xl mt-6">
                {post.contentBlocks && post.contentBlocks.length > 0 ? (
                  <BlockRenderer blocks={post.contentBlocks} />
                ) : post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="text-gray-500">No content available</p>
                )}
              </div>

              {/* TAGS */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <p className="text-xs font-bold tracking-wide uppercase text-gray-500 mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tag/${tag.slug || tag.name.toLowerCase()}`}
                        className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-[#003049] hover:text-white transition-colors px-3 py-1.5 rounded-full"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* YOUTUBE VIDEO */}
              {allowYoutube && post.youtubeUrl && (
                <div className="mt-10">
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

              {/* SHARE SECTION */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ShareSection post={post} />
              </div>

              {/* AUTHOR BIO */}
              {author && (
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
                  <UserAvatar name={author.name} imageUrl={author.avatarUrl} size="lg" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-gray-900">{author.name}</p>
                    {author.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-1">{author.bio}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-gray-400">
                      <a href="#" className="hover:text-[#003049]"><Facebook size={16} /></a>
                      <a href="#" className="hover:text-[#003049]"><Twitter size={16} /></a>
                      <a href="#" className="hover:text-[#003049]"><Instagram size={16} /></a>
                      <a href="#" className="hover:text-[#003049]"><Linkedin size={16} /></a>
                    </div>
                  </div>
                </div>
              )}

              {/* NEXT POST */}
              {nextPost && (
                <Link
                  href={`/post/${nextPost.slug}`}
                  className="mt-8 flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={relatedImageUrl(nextPost)}
                      alt={nextPost.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0F5B78] mb-1">Next Post</p>
                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#003049]">
                      {nextPost.title}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                </Link>
              )}

              {/* COMMENTS */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <CommentsSection
                  postId={post.id}
                  initialComments={comments}
                  isLoggedIn={isLoggedIn}
                  token={token}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            </article>

            {/* RIGHT: Sidebar - Sticky, sits alongside the main column */}
            <div className="w-full overflow-hidden">
              <div className="lg:sticky lg:top-6 space-y-6">
                {/* Author Card */}
                {author && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold tracking-wide uppercase text-gray-500 mb-4">
                      About the Author
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <UserAvatar name={author.name} imageUrl={author.avatarUrl} size="lg" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{author.name}</p>
                        {author.role && <p className="text-xs text-gray-500">{author.role}</p>}
                        {author.company && <p className="text-xs text-gray-500">{author.company}</p>}
                      </div>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {author.bio}
                      </p>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-[#0F5B78] hover:underline mt-3"
                      >
                        <Mail size={14} />
                        {author.email}
                      </a>
                    )}
                  </div>
                )}

                {/* Posts Sidebar - Recent, Popular, Company */}
                <PostSidebar
                  currentPostId={post.id}
                  categorySlug={post.category?.slug}
                />

                <SupplierAds />

                {/* Category */}
                {post.category?.name && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold tracking-wide uppercase text-gray-500 mb-4">
                      Category
                    </h3>
                    <Link
                      href={`/category/${post.category.slug}`}
                      className="inline-block text-sm font-semibold text-[#003049] bg-gray-100 hover:bg-[#003049] hover:text-white transition-colors px-4 py-2 rounded-full"
                    >
                      {post.category.name}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========== RELATED POSTS ========== */}
        {relatedPosts.length > 0 && (
          <section className="max-w-[1320px] mx-auto px-4 pb-16 pt-16">
            <h2 className="text-xl font-bold text-[#003049] mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/post/${p.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full aspect-[768/381] bg-gray-100">
                    <Image
                      src={relatedImageUrl(p)}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {p.category?.name && (
                      <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase text-white bg-[#003049] px-2.5 py-1 rounded-full">
                        {p.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#003049]">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {p.author?.name && <span>By {p.author.name}</span>}
                      {p.publishedAt && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span>
                            {new Date(p.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedPostsCarousel />
      </main>
    </>
  )
}