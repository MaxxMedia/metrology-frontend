"use client"
/** Implements the latest issue carousel component and its related interface behavior. */

import Image from "next/image"

import { useState } from "react"
import Link from "next/link"

type LatestIssueCarouselProps = {
  posts: any[]
}

/** Renders the latest issue carousel interface. */
export default function LatestIssueCarousel({ posts }: LatestIssueCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  /** Handles the prev interaction and its related state changes. */
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1))
  }

  /** Handles the next interaction and its related state changes. */
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
  }

  // Show 5 items at a time with carousel logic
  const visiblePosts = []
  for (let i = 0; i < 5; i++) {
    visiblePosts.push(posts[(currentIndex + i) % posts.length])
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mb-12">Latest Issue</h2>

        {/* Carousel Container */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            ‹
          </button>

          {/* Cards Grid */}
          <div className="w-full px-20 flex gap-6 overflow-x-hidden">
            {visiblePosts.map((post, idx) => {
              const imageUrl =
                post.imageUrl && post.imageUrl.startsWith("http")
                  ? post.imageUrl
                  : post.imageUrl
                    ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                    : "/placeholder.svg"

              return (
                <div key={idx} className="flex-shrink-0 w-1/5 bg-white rounded-lg overflow-hidden shadow-lg">
                  {/* Card Image */}
                  <div className="relative w-full h-48">
  <Image
    src={imageUrl || "/placeholder.svg"}
    alt={post.title}
    fill
    className="object-cover"
    sizes="(max-width: 1024px) 50vw, 20vw"
  />
</div>
                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-3 mb-3">{post.title}</h3>
                    <Link href={`/post/${post.slug}`} className="text-teal-600 font-bold text-sm hover:text-teal-700">
                      READ ›
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
