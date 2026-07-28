"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

/* ================= TYPES ================= */

type Company = {
  id: number
  name: string
  slug: string
}

type Article = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  publishedAt: string
  company?: Company | null
}

type Props = {
  articles: Article[]
}

/* ================= COMPONENT ================= */

export default function CompanyArticlesCarousel({ articles }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!articles || articles.length === 0) return null

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = dir === "left" ? -350 : 350
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#0b3954]">
          More Articles from this Company
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 border rounded flex items-center justify-center hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 border rounded flex items-center justify-center hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/post/${article.slug}`}
            className="min-w-[300px] max-w-[300px] bg-white rounded-lg border hover:shadow-lg transition overflow-hidden"
          >
            {/* Image */}
            {article.imageUrl && (
              <div className="relative h-40 w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-xs text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              <p className="text-[11px] text-gray-400 mt-3">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
