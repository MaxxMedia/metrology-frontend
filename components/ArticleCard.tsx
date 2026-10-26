"use client"
/** Implements the article card component and its related interface behavior. */


import Link from "next/link"
import Image from "next/image"

type ArticleCardProps = {
  post: any
}

/** Renders the article card interface. */
export default function ArticleCard({ post }: ArticleCardProps) {
  const imageUrl =
    post.imageUrl && post.imageUrl.startsWith("http")
      ? post.imageUrl
      : post.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/modern-manufacturing-facility.png"

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Today"

  return (
    <Link href={`/post/${post.slug}`}>
      <div className="flex gap-6 pb-8 border-b border-gray-200 group cursor-pointer">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24">
  <Image
    src={imageUrl || "/placeholder.svg"}
    alt={post.title}
    fill
    className="object-cover border border-gray-300 group-hover:opacity-80 transition-opacity"
    sizes="96px"
  />
</div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {post.category?.name && (
            <span className="inline-block bg-teal-600 text-white text-xs font-bold px-2 py-1 mb-2">
              {post.category.name}
            </span>
          )}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 mb-2 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.excerpt || post.content?.substring(0, 150) || ""}
          </p>
          <Link href={`/post/${post.slug}`} className="text-teal-600 text-sm font-bold hover:text-teal-700">
            READ MORE ›
          </Link>
        </div>
      </div>
    </Link>
  )
}
