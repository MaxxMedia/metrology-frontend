"use client"

import Link from "next/link"
import Image from "next/image"
import { Post } from "@/types/Post"

type Props = {
  posts: Post[]
  activeCategory: string
}

const TOPICS = [
  { label: "Engineer", slug: "engineer" },
  { label: "Build", slug: "build" },
  { label: "Maintain", slug: "maintain" },
  { label: "Manage", slug: "manage" },
]

export default function TopicsListing({
  posts,
  activeCategory,
}: Props) {
  return (
    <section className="bg-[#003B5C] text-white">
      <div className="max-w-[1320px] mx-auto px-[15px] py-10">
        <div className="grid grid-cols-[260px_1fr] gap-8">

          {/* ================= LEFT MENU ================= */}
          <aside className="bg-[#0A4A6A]">
            <ul className="divide-y divide-white/10">
              {TOPICS.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/topics/${topic.slug}`}
                    className={`flex items-center justify-between px-5 py-4 uppercase text-sm font-semibold tracking-wide transition ${
                      activeCategory === topic.slug
                        ? "bg-[#003B5C]"
                        : "hover:bg-[#0F5D86]"
                    }`}
                  >
                    {topic.label}
                    {activeCategory === topic.slug && (
                      <span className="text-xl">›</span>
                    )}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/topics/engineer"
                  className={`block px-5 py-4 uppercase text-sm font-semibold tracking-wide transition ${
                    activeCategory === "engineer"
                      ? "bg-[#003B5C]"
                      : "hover:bg-[#0F5D86]"
                  }`}
                >
                  All Topics
                </Link>
              </li>
            </ul>
          </aside>

          {/* ================= RIGHT POSTS ================= */}
          <div className="space-y-8">

            {/* CATEGORY HEADER */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold uppercase tracking-wide">
                {activeCategory}
              </h1>

              <Link
                href={`/topics/${activeCategory}`}
                className="bg-red-600 px-4 py-2 text-sm font-semibold uppercase"
              >
                See All →
              </Link>
            </div>

            {/* POSTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => {
                const imageUrl =
                  post.imageUrl?.startsWith("http")
                    ? post.imageUrl
                    : post.imageUrl
                    ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                    : "/placeholder.svg"

                return (
                  <article key={post.id}>
                    <Link href={`/post/${post.slug}`}>
                      <div className="relative w-full h-40 mb-3">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </Link>

                    <p className="text-xs uppercase text-[#6EC1E4] font-bold mb-1">
                      {post.category?.name}
                    </p>

                    <h2 className="font-semibold leading-snug mb-2">
                      <Link
                        href={`/post/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-white/80">
                      {post.excerpt ||
                        post.content
                          ?.replace(/<[^>]+>/g, "")
                          .slice(0, 120) + "..."}
                    </p>
                  </article>
                )
              })}

              {posts.length === 0 && (
                <p className="col-span-full text-white/70">
                  No articles found for this topic.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}