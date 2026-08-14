"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          More Articles from this Company
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 border border-[#292C30] rounded flex items-center justify-center text-gray-300 hover:bg-[#171A1E] hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 border border-[#292C30] rounded flex items-center justify-center text-gray-300 hover:bg-[#171A1E] hover:text-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/post/${article.slug}`}
            className="min-w-[300px] max-w-[300px] bg-[#1D2125] rounded-lg border border-[#292C30] hover:border-[#0073FF] transition overflow-hidden group"
          >
            {article.imageUrl && (
              <div className="relative h-40 w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-white group-hover:text-[#00B5ED]">
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-xs text-gray-400 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              <p className="text-[11px] text-gray-500 mt-3">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
