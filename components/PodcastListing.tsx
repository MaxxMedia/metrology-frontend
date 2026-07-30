"use client"

import Image from "next/image"
import Link from "next/link"
import { Post } from "@/types/Post"

type Props = {
  posts: Post[]
}

export default function PodcastListing({ posts }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Page Title */}
      <h1 className="text-[36px] font-bold text-[#003B5C] mb-10">Podcast</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* LEFT - PODCAST LIST */}
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
                {/* IMAGE + PLAY ICON */}
                <div className="relative w-full h-[160px]">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover rounded-sm"
                    sizes="(max-width:768px) 100vw, 260px"
                  />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 bg-black/70 rounded-full flex items-center justify-center text-white text-xl">
                      &#9654;
                    </span>
                  </span>
                </div>

                {/* CONTENT */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">{date}</div>

                  <h2 className="text-[22px] font-bold text-gray-900 leading-snug mb-3">
                    PODCAST: {post.title}
                  </h2>

                  <p className="text-gray-600 text-[16px] leading-relaxed mb-4">
                    {post.excerpt || post.content?.substring(0, 180) + "..."}
                  </p>

                  <Link
                    href={`/post/${post.slug}`}
                    className="text-[#0072BC] font-bold text-sm uppercase hover:underline"
                  >
                    Listen -&gt;
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* RIGHT - ADS (Sticky) */}
        <aside className="space-y-6 sticky top-24 h-fit">
          {[1, 2, 3].map((_, i) => (
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
