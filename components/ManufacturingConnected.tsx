
"use client";

import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/Post";
import SupplierAds from "@/components/SupplierAds";

/* ================= RIGHT SIDEBAR ================= */

function ExploreCategories() {
  const categories = [
    { name: "Gaming", count: 24 },
    { name: "Sports", count: 30 },
    { name: "Technology", count: 22 },
    { name: "Politics", count: 25 },
    { name: "Travel", count: 16 },
  ];

  return (
    <div className="bg-white rounded-none p-6">
      <h3 className="text-xl font-semibold mb-6">Explore Categories</h3>

      <div className="space-y-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.name.toLowerCase()}`}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="font-medium">
              {cat.name} ({cat.count})
            </span>
            <span className="text-lg">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PopularNewsSidebar({ posts }: { posts: Post[] }) {
  const imageUrl = (post: Post) =>
    post.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post.imageUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
      : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-none p-6">
      <h3 className="text-xl font-semibold mb-6">Popular News</h3>

      <div className="space-y-6">
        {posts.slice(0, 4).map((post) => (
          <Link key={post.id} href={`/post/${post.slug}`} className="flex gap-4">
            <div className="relative w-[80px] h-[80px] shrink-0">
              <Image
                src={imageUrl(post)}
                alt={post.title}
                fill
                sizes="80px"
                quality={70}
                className="rounded-lg object-cover"
              />
            </div>

            <div>
              <span className="inline-block mb-1 text-[14px] font-bold uppercase bg-green-500 text-white px-2 py-1 rounded">
                {typeof post.category === "object"
                  ? post.category?.name
                  : post.category}
              </span>

              <h4 className="text-sm font-semibold leading-snug line-clamp-2">
                {post.title}
              </h4>

              <div className="text-[14px] text-gray-400 mt-1">
                By {post.author?.name} · {post.views?.toLocaleString()} Views
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TagsWidget() {
  const tags = [
    "Gaming","Travel","Food","Sports","Social","Marketing","Trip","Makeup",
    "Technology","Branding","Beauty","Printing","Business","Politics",
  ];

  return (
    <div className="bg-white rounded-none p-6">
      <h3 className="text-xl font-semibold mb-6">Tags</h3>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag.toLowerCase()}`}
            className="px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= MAIN SECTION ================= */

type FeaturedPostsSectionProps = {
  posts: Post[];
};

export default function FeaturedPostsSection({ posts }: FeaturedPostsSectionProps) {
  if (!posts || posts.length < 2) return null;

  const rows: Post[][] = [];
  for (let i = 0; i < Math.min(posts.length, 6); i += 2) {
    rows.push(posts.slice(i, i + 2));
  }

  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <section className="bg-white pt-[70px] pb-[80px]">
      <div className="max-w-[1320px] mx-auto px-[15px]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[36px] font-semibold text-[#121213]">
            Featured Post
          </h2>

          <Link
            href="/featured"
            className="text-sm font-semibold text-[#121213] hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-10">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {row.map((post) => {
                  const img =
                    post.imageUrl?.startsWith("http")
                      ? post.imageUrl
                      : post.imageUrl
                      ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                      : "/placeholder.svg";

                  return (
                    <article
                      key={post.id}
                      className="rounded-none overflow-hidden hover:shadow-md transition"
                    >
                      <Link href={`/post/${post.slug}`}>
                        <div className="relative h-[260px]">
                          <Image
                            src={img}
                            alt={post.title}
                            fill
                            sizes="(max-width:768px) 100vw, 50vw"
                            quality={75}
                            className="object-cover hover:scale-105 transition"
                          />
                        </div>
                      </Link>

                      <div className="p-6">
                        {typeof post.category === "object" && post.category?.name && (
                          <span className="inline-block mb-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            {post.category.name}
                          </span>
                        )}

                        <h3 className="text-[20px] font-bold leading-snug mb-4">
                          {post.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          {post.author?.name && <span>By {post.author.name}</span>}
                          {typeof post.views === "number" && (
                            <span>{post.views.toLocaleString()} Views</span>
                          )}
                          {post.publishedAt && (
                            <span>{formatDate(post.publishedAt)}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Optional */}
              {/* <ExploreCategories /> */}
              {/* <PopularNewsSidebar posts={posts} /> */}
              {/* <TagsWidget /> */}

              <SupplierAds />
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}