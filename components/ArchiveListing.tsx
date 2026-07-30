"use client"
import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/types/Post"

type Props = {
  posts: Post[]
}

export default function ArchiveListing({ posts }: Props) {
  return (
    <section className="max-w-[1320px] mx-auto px-[15px] py-12">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-[36px] font-bold text-[#003B5C]">Archive</h1>

        <Link
          href="/archive"
          className="hidden md:inline-flex items-center gap-2 border border-[#003B5C] px-5 py-2 text-sm font-semibold text-[#003B5C] hover:bg-[#003B5C] hover:text-white transition"
        >
          SEE MORE ISSUES -&gt;
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* LEFT - ARCHIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {posts.map((post) => {
            const imageUrl =
              post.imageUrl?.startsWith("http")
                ? post.imageUrl
                : post.imageUrl
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                  : "/placeholder.svg"

            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : ""

            return (
              <div key={post.id} className="text-center">
                {/* COVER IMAGE */}
                <Link href={`/post/${post.slug}`}>
                  <div className="relative w-full h-[420px] mb-5 shadow-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-contain hover:scale-[1.02] transition-transform"
                      sizes="(max-width:768px) 100vw, 400px"
                    />
                  </div>
                </Link>

                {/* DATE */}
                <h3 className="text-[18px] font-semibold text-[#6B7280] mb-2">
                  {date}
                </h3>

                {/* READ NOW */}
                <Link
                  href={`/post/${post.slug}`}
                  className="text-[#C70000] font-bold text-sm uppercase hover:underline"
                >
                  Read Now -&gt;
                </Link>
              </div>
            )
          })}

          {!posts.length && (
            <p className="col-span-full text-center text-gray-500">
              No archive issues found.
            </p>
          )}
        </div>

        {/* RIGHT - ADS */}
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

      {/* MOBILE SEE MORE */}
      <div className="mt-14 text-center md:hidden">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 bg-[#003B5C] text-white px-6 py-3 text-sm font-semibold"
        >
          SEE MORE ISSUES -&gt;
        </Link>
      </div>
    </section>
  )
}
