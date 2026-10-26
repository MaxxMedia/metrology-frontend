"use client"
/** Implements the articles issue grid component and its related interface behavior. */

import Image from "next/image"
import Link from "next/link"
import { Post } from "@/types/Post"

/** Renders the articles issue grid interface. */
export default function ArticlesIssueGrid({ posts }: { posts: Post[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-[32px] font-bold mb-10">In this Issue</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-10">
        {/* ARTICLES */}
        {posts.slice(0, 2).map((post) => {
          const imageUrl = post.imageUrl?.startsWith("http")
            ? post.imageUrl
            : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`

          return (
            <article key={post.id}>
             <div className="relative w-full h-56 mb-4">
  <Image
    src={imageUrl}
    alt={post.title}
    fill
    className="object-cover"
    sizes="(max-width:1024px) 100vw, 50vw"
  />
</div>

              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 font-bold uppercase">
                  {typeof post.category === "object"
                    ? post.category?.name
                    : post.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.publishedAt || "").toDateString()}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{post.title}</h3>

              <p className="text-gray-600 mb-3">
                {post.excerpt}
              </p>

              <Link
                href={`/post/${post.slug}`}
                className="text-red-600 font-bold"
              >
                Read More →
              </Link>
            </article>
          )
        })}

        {/* ADS */}
     <aside className="space-y-6">
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
