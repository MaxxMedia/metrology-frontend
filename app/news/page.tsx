"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { Post } from "@/types/Post"
import SupplierAds from "@/components/SupplierAds"
import NewsletterForm from "@/components/news/NewsletterForm"

const POSTS_PER_PAGE = 6

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=100`,
          { cache: "no-store" }
        )
        const data = await res.json()
        const allPosts: Post[] = data.data || data
        setPosts(allPosts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Helper functions
  const slugOf = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  const getImage = (url?: string | null) => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith("http")) return url
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`
  }

  // ================= WHAT'S NEW =================
  const whatsNewPosts = posts
    .filter((p) => slugOf(p).includes("whatsnew"))
    .slice(0, 5)

  // ================= NEWS POSTS =================
  const newsPosts = posts.filter(
    (p) => slugOf(p) === "news"
  )

  // ================= PAGINATION =================
  const totalPages = Math.ceil(newsPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = newsPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <main className="bg-[#171A1E] min-h-screen text-[#CCCCCC]">
        <div className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B5ED]"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#171A1E] min-h-screen text-[#CCCCCC]">

      {/* ================= WHAT'S NEW STRIP ================= */}
      {whatsNewPosts.length > 0 && (
        <section className="border-b border-[#292C30] bg-[#1D2125]/60">
          <div className="max-w-[1320px] mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whatsNewPosts.map((post) => (
              <Link key={post.id} href={`/post/${post.slug}`}>
                <p className="text-sm font-semibold text-[#CCCCCC] hover:text-[#00B5ED] transition-colors">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= NEWSLETTER ================= */}
      <NewsletterForm hasNewsletterContent={newsPosts.length > 0} />

      {/* ================= NEWS LIST ================= */}
      <section id="news-section" className="max-w-[1320px] mx-auto px-6 py-16">
        <h1 className="text-[36px] font-bold text-white mb-10">
          News
        </h1>

        {newsPosts.length === 0 ? (
          <div className="text-center py-16 bg-[#1D2125] border border-[#292C30] rounded-[12px]">
            <p className="text-white text-lg font-semibold">No news articles available at the moment.</p>
            <p className="text-[#B8B8B8] text-sm mt-2">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* LEFT ARTICLES COLUMN */}
            <div className="space-y-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-[#1D2125] border border-[#292C30] rounded-[12px] p-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 transition-all duration-200 hover:border-[#0073FF]/60 shadow-lg"
                >
                  <div className="relative w-full h-[160px] rounded-[8px] overflow-hidden bg-[#171A1E]">
                    <Image
                      src={getImage(post.imageUrl)}
                      alt={post.title}
                      fill
                      className="object-cover rounded-[8px] transition-transform duration-300 hover:scale-105"
                      sizes="(max-width:768px) 100vw, 260px"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-[#B8B8B8] block mb-2 font-medium">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : ""}
                      </span>

                      <h2 className="text-[22px] font-bold text-white mb-2 leading-snug hover:text-[#00B5ED] transition-colors">
                        <Link href={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-[#CCCCCC] text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt ||
                          post.content
                            ?.replace(/<[^>]+>/g, "")
                            .slice(0, 140) + "..."}
                      </p>
                    </div>

                    <Link
                      href={`/post/${post.slug}`}
                      className="inline-flex items-center gap-1 text-[#0073FF] font-bold uppercase text-xs tracking-wider hover:text-[#00B5ED] transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}

              {/* ================= DYNAMIC PAGINATION ================= */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-8 border-t border-[#292C30]">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all ${
                      currentPage === 1
                        ? 'bg-[#171A1E] border border-[#292C30] text-[#858585] cursor-not-allowed'
                        : 'bg-[#1D2125] border border-[#292C30] text-[#CCCCCC] hover:bg-[#292C30] hover:text-white'
                    }`}
                  >
                    ‹ Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-[8px] text-sm font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-[#0073FF] text-white shadow-md'
                          : 'bg-[#1D2125] border border-[#292C30] text-[#CCCCCC] hover:bg-[#292C30] hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all ${
                      currentPage === totalPages
                        ? 'bg-[#171A1E] border border-[#292C30] text-[#858585] cursor-not-allowed'
                        : 'bg-[#1D2125] border border-[#292C30] text-[#CCCCCC] hover:bg-[#292C30] hover:text-white'
                    }`}
                  >
                    Next ›
                  </button>
                </div>
              )}

              {/* Show total posts count */}
              <div className="text-center text-sm text-[#B8B8B8] mt-4">
                Showing {startIndex + 1} - {Math.min(endIndex, newsPosts.length)} of {newsPosts.length} news articles
              </div>
            </div>

            {/* RIGHT ADS */}
            <aside className="sticky top-24 space-y-6">
              <SupplierAds />
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}