"use client"
/** Implements the featured article component and its related interface behavior. */

import Image from "next/image"
import Link from "next/link"

type FeaturedArticleProps = {
  post: any
}

/** Renders the featured article interface. */
export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  const imageUrl =
    post.imageUrl && post.imageUrl.startsWith("http")
      ? post.imageUrl
      : post.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/manufacturing-mold.jpg"

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "TODAY"

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        {/* Left Column */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-600 font-bold tracking-wide mb-4 uppercase">{date}</div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {post.excerpt || post.content?.substring(0, 200) || ""}
          </p>
          <Link
            href={`/post/${post.slug}`}
            className="text-teal-600 font-bold text-sm hover:text-teal-700 flex items-center gap-1 w-fit"
          >
            READ MORE <span>›</span>
          </Link>
        </div>

        {/* Right Column - Featured Image */}
        <div className="w-full">
         <div className="relative w-full h-80">
  <Image
    src={imageUrl || "/placeholder.svg"}
    alt={post.title}
    fill
    className="object-cover border border-gray-300"
    priority
    sizes="(max-width:1024px) 100vw, 50vw"
  />
</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b-2 border-gray-300 my-12" />

      {/* Latest Section Header */}
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Latest</h2>
    </section>
  )
}
