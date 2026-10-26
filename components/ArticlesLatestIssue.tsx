"use client"
/** Implements the articles latest issue component and its related interface behavior. */

import Image from "next/image"
import Link from "next/link"
import { Post } from "@/types/Post"

/** Renders the articles latest issue interface. */
export default function ArticlesLatestIssue({ post }: { post: Post }) {
  const imageUrl = post.imageUrl?.startsWith("http")
    ? post.imageUrl
    : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
      {/* LEFT */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-300 p-10 flex flex-col justify-center">
        <h2 className="text-[36px] font-bold text-[#003B5C] mb-6">
          Latest Issue
        </h2>

       <div className="relative w-48 h-[300px] mb-6">
  <Image
    src="/magazine-cover.jpg"
    alt="Magazine Cover"
    fill
    className="object-cover shadow-lg"
    priority
    sizes="192px"
  />
</div>

        <p className="text-lg font-semibold">January 2026</p>

        <Link
          href="/digital-edition"
          className="inline-block mt-4 bg-red-600 text-white px-6 py-2 font-bold"
        >
          DIGITAL EDITION
        </Link>

        <div className="flex gap-6 mt-8 text-sm font-bold text-white bg-[#003B5C] px-6 py-3">
          <span>FEATURES</span>
          <span>COLUMNS</span>
          <span>ARCHIVE</span>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="relative bg-cover bg-center text-white flex items-end"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="bg-black/60 p-8 w-full">
          <span className="bg-blue-600 px-3 py-1 text-xs font-bold uppercase">
            Cover Story
          </span>

          <h3 className="text-2xl font-bold mt-4 mb-2">
            {post.title}
          </h3>

          <p className="text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <Link href={`/post/${post.slug}`} className="text-red-400 font-bold">
            Read More →
          </Link>
        </div>
      </div>
    </section>
  )
}
