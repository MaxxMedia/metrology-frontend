"use client"

import Image from "next/image"
import Link from "next/link"
import { Post } from "@/types/Post"

type Props = {
  posts: Post[]
}

export default function ArticlesListing({ posts }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Page Title */}
      <h1 className="text-[36px] font-bold text-[#003B5C] mb-10">Articles</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* LEFT - ARTICLE LIST */}
        <div className="space-y-10">
          {posts.map((post) => {
            const imageUrl =
              post.imageUrl?.startsWith("http")
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
              : ""

            return (
              <article
                key={post.id}
                className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 pb-10 border-b border-gray-200"
              >
                {/* IMAGE */}
                <div className="relative w-full h-[180px] border bg-white">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-contain"
                    sizes="(max-width:768px) 100vw, 260px"
                  />
                </div>

                {/* CONTENT */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {post.badge && (
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 font-bold uppercase">
                        {post.badge}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{date}</span>
                  </div>

                  <h2 className="text-[22px] font-bold text-gray-900 leading-snug mb-3">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-[16px] leading-relaxed mb-4">
                    {post.excerpt || post.content?.substring(0, 160) + "..."}
                  </p>

                  <Link
                    href={`/post/${post.slug}`}
                    className="text-[#0072BC] font-bold text-sm uppercase hover:underline"
                  >
                    Read More -&gt;
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* RIGHT - ADS */}
        <aside className="space-y-6 sticky top-24 h-fit">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="relative w-full h-[200px] border">
              <Image
                src="/advertisement-banner.jpg"
                alt="Advertisement"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
          ))}
        </aside>
      </div>
    </section>
  )
}
