"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

type Post = {
  id: number
  title: string
  slug: string
  excerpt?: string
  imageUrl?: string
  publishedAt?: string
  category?: any
  author?: { name?: string }
  views?: number
}

export default function RelatedPostsCarousel() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`)
        const data = await res.json()
        const allPosts = Array.isArray(data.data) ? data.data : []

        const filtered = allPosts
          .sort(
            (a: Post, b: Post) =>
              new Date(b.publishedAt || "").getTime() -
              new Date(a.publishedAt || "").getTime()
          )
          .slice(0, 4)

        setPosts(filtered)
      } catch (err) {
        console.error("Failed to load related posts", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [])

  if (loading) {
    return (
      <section className="bg-[#0a0d14] border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="text-center text-gray-500 text-[16px]">
            Loading related content...
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#0a0d14] border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        {/* Header: title + diamond/line + nav arrows */}
        <div
          className="flex items-center gap-4"
          style={{ margin: "55px 0px 30px" }}
        >
          <h2 className="flex-shrink-0 text-xl font-bold text-white sm:text-2xl">
            Related Post
          </h2>

          <span className="h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-blue-500" />
          <span className="h-px min-w-0 flex-1 bg-gray-700" />
          <span className="h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-blue-500" />

          {posts.length > 3 && (
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("related-content-scroll")?.scrollBy({ left: -280, behavior: "smooth" })
                }
                className="w-9 h-9 flex items-center justify-center rounded-md border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("related-content-scroll")?.scrollBy({ left: 280, behavior: "smooth" })
                }
                className="w-9 h-9 flex items-center justify-center rounded-md border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div
          id="related-content-scroll"
          className="fpg-post-slider flex gap-5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {posts.map((post) => {
            const imageUrl =
              post.imageUrl?.startsWith("http")
                ? post.imageUrl
                : post.imageUrl
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                  : "/placeholder.svg"

            const categoryName =
              typeof post.category === "object" ? post.category?.name || "LATEST" : "LATEST"

            return (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="fpg-card-style style-one group flex-shrink-0 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-600 transition-colors"
                style={{
                  width: "calc((100% - 2.5rem) / 3)",
                  margin: "0px 0px 10px",
                  padding: "12px 12px 25px",
                }}
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] bg-gray-800">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="260px"
                  />
                </div>

                {/* Content */}
                <div className="fpg-post-content" style={{ padding: "12px 15px 0px" }}>
                  <span className="inline-block text-[14px] font-bold uppercase tracking-wide text-white bg-blue-600 px-2.5 py-1 rounded mb-3">
                    {categoryName}
                  </span>

                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[14px] text-gray-500 mt-2">
                    {post.author?.name && <span>By {post.author.name}</span>}
                    {typeof post.views === "number" && (
                      <span className="flex items-center gap-1">
                        <Eye size={12} className="text-gray-500" />
                        {post.views.toLocaleString()} Views
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}