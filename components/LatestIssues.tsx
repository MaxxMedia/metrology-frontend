"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Post } from "@/types/Post"

interface LatestIssuesProps {
  posts?: Post[]
}

/* ================= COLOR CONFIG ================= */

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  WEBINAR: "bg-[#7C3AED]",
  EVENT: "bg-[#0EA5E9]",
  TRENDING: "bg-[#F97316]",
  EXCLUSIVE: "bg-[#059669]",
}

const CATEGORY_COLORS: Record<string, string> = {
  gaming: "bg-[#0073FF]",
  fashion: "bg-[#E033E0]",
  "latest-issue": "bg-[#F69C00]",
}

export default function LatestIssues({
  posts: initialPosts = [],
}: LatestIssuesProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  useEffect(() => {
    if (!initialPosts.length) {
      ;(async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`
        )
        const data = await res.json()
        const all: Post[] = data.data || data

        const filtered = all.filter((p) =>
          typeof p.category === "object"
            ? p.category?.slug?.includes("latest-issue")
            : false
        )

        setPosts(filtered.slice(0, 3))
      })()
    } else {
      setPosts(initialPosts.slice(0, 3))
    }
  }, [initialPosts])

  if (!posts.length) return null

  return (
    <section className="pt-4 sm:pt-8 w-full">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="relative bg-[#F7F7F7] rounded-2xl px-4 sm:px-6 py-6 sm:py-7">

          {/* background shapes */}
          <Image
            src="/images/shape/flower-shape-01.png"
            alt=""
            width={120}
            height={120}
            className="absolute top-0 right-0 opacity-30 pointer-events-none hidden sm:block"
          />
          <Image
            src="/images/shape/flower-shape-02.png"
            alt=""
            width={120}
            height={120}
            className="absolute bottom-0 left-2 opacity-30 pointer-events-none hidden sm:block"
          />

          {/* POSTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 relative z-10">
            {posts.map((post) => {
              const slug =
                typeof post.category === "object"
                  ? post.category?.slug || ""
                  : ""

              const categoryName =
                typeof post.category === "object"
                  ? post.category?.name || ""
                  : ""

              const badge = post.badge?.trim()

              const tagText = badge || categoryName

              let tagClass = "bg-[#9CA3AF]"
              if (badge) {
                tagClass =
                  BADGE_COLORS[badge.toUpperCase()] || "bg-[#6B7280]"
              } else {
                const match = Object.keys(CATEGORY_COLORS).find((key) =>
                  slug.includes(key)
                )
                if (match) tagClass = CATEGORY_COLORS[match]
              }

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-4 sm:p-5 flex gap-4 h-full"
                >
                  {/* thumbnail */}
                  <Link
                    href={`/post/${post.slug}`}
                    className="relative w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] rounded-xl overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={
                        post.imageUrl?.startsWith("http")
                          ? post.imageUrl
                          : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                      }
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* content */}
                  <div className="flex flex-col gap-2 min-w-0">
                    {tagText && (
                      <Link
                        href={`/category/${slug}`}
                        className={`${tagClass} text-white px-3 py-[3px] rounded-full rounded-tl-none w-fit text-[14px] font-medium`}
                      >
                        {tagText}
                      </Link>
                    )}

                    <h6 className="text-[15px] sm:text-[17px] leading-snug font-semibold text-[#121213] line-clamp-2 hover:text-[#0073FF] transition">
                      <Link href={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h6>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#616C74]">
                      <span>
                        By{" "}
                        <span className="font-medium">
                          {post.author?.name || "rstheme"}
                        </span>
                      </span>
                      <span>
                        {post.views?.toLocaleString() || 0} Views
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
