"use client";

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/Post";
import SupplierAds from "@/components/SupplierAds";

type SidebarCategory = {
  label: string;
  slug: string;
  count?: number;
};

type Props = {
  posts: Post[];
  title: string;
  description: string;
  sectionTitle: string;
  activeSlug?: string;
  sidebarCategories?: SidebarCategory[];
};

export default function TopicListing({
  posts,
  title,
  description,
  sectionTitle,
  activeSlug,
  sidebarCategories = [],
}: Props) {
  const getImage = (post: Post) =>
    post.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/placeholder.svg";

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const getSubcategoryName = (post: Post) =>
    (post as Post & { subCategory?: { name?: string } }).subCategory?.name;

  const [hero, ...rest] = posts;
  const gridPosts = rest;

  return (
    <section className="bg-[#0a0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
          {sidebarCategories.length > 0 && (
            <aside className="bg-[#1D2125] border border-[#292C30] rounded-xl overflow-hidden lg:sticky lg:top-28">
              <div className="px-4 py-3 border-b border-[#292C30]">
                <Link
                  href="/topics"
                  className="text-xs font-semibold uppercase tracking-wide text-[#00B5ED] hover:underline"
                >
                  ← All Topics
                </Link>
              </div>
              <ul className="divide-y divide-[#292C30] max-h-[70vh] overflow-y-auto">
                {sidebarCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/topics/${cat.slug}`}
                      className={`flex items-center justify-between gap-2 px-4 py-3 text-sm transition ${
                        activeSlug === cat.slug
                          ? "bg-[#0073FF] text-white font-semibold"
                          : "text-gray-400 hover:bg-[#171A1E] hover:text-white"
                      }`}
                    >
                      <span className="leading-snug">{cat.label}</span>
                      {cat.count != null && cat.count > 0 && (
                        <span className="text-[10px] opacity-70 shrink-0">{cat.count}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div>
            <h1 className="text-[28px] md:text-[36px] font-bold text-white mb-3 leading-tight">
              {title}
            </h1>
            <p className="text-[15px] md:text-[16px] text-[#CCCCCC] leading-relaxed mb-8 max-w-3xl">
              {description}
            </p>

            {posts.length === 0 ? (
              <div className="bg-[#1D2125] rounded-xl border border-[#292C30] p-10 text-center">
                <p className="text-gray-400 mb-2">No articles found for this category yet.</p>
                <Link href="/topics" className="text-[#00B5ED] text-sm font-semibold hover:underline">
                  Browse all topics
                </Link>
              </div>
            ) : (
              <>
                {hero && (
                  <Link
                    href={`/post/${hero.slug}`}
                    className="relative block h-[320px] md:h-[420px] overflow-hidden rounded-xl mb-10 group border border-[#292C30]"
                  >
                    <Image
                      src={getImage(hero)}
                      alt={hero.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width:1024px) 100vw, 70vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      {(hero.badge || getSubcategoryName(hero) || hero.category?.name) && (
                        <span className="inline-block bg-[#0073FF] text-xs font-bold px-3 py-1 mb-3 uppercase rounded">
                          {hero.badge || getSubcategoryName(hero) || hero.category?.name}
                        </span>
                      )}
                      <h2 className="text-[22px] md:text-[26px] font-bold leading-snug mb-2">
                        {hero.title}
                      </h2>
                      <p className="text-[15px] text-gray-300 mb-3 max-w-2xl leading-relaxed line-clamp-2">
                        {hero.excerpt || hero.content?.substring(0, 150) + "..."}
                      </p>
                      <span className="text-[#00B5ED] font-bold text-sm uppercase">
                        Read Article →
                      </span>
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {gridPosts.length > 0 && (
        <>
          <div className="bg-[#1D2125] border-y border-[#292C30] mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <span className="text-white font-bold uppercase text-sm">{sectionTitle}</span>
            </div>
          </div>

          <div className="bg-[#0a0d14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-[#1D2125] border border-[#292C30] rounded-xl overflow-hidden hover:border-[#0073FF] transition-colors"
                  >
                    <Link href={`/post/${post.slug}`} className="block">
                      <div className="relative w-full h-[180px] overflow-hidden">
                        <Image
                          src={getImage(post)}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width:768px) 100vw, 33vw"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <span className="block text-[11px] text-[#00B5ED] font-semibold uppercase mb-1">
                        {getSubcategoryName(post) || post.category?.name || "Article"}
                      </span>

                      <span className="block text-xs text-gray-500 mb-1.5">
                        {formatDate(post.publishedAt ?? undefined)}
                      </span>

                      <h3 className="text-[17px] font-bold leading-snug mb-2 text-white">
                        <Link
                          href={`/post/${post.slug}`}
                          className="hover:text-[#00B5ED] transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-[14px] text-gray-400 mb-3 leading-relaxed line-clamp-3">
                        {post.excerpt || post.content?.substring(0, 110) + "..."}
                      </p>

                      <Link
                        href={`/post/${post.slug}`}
                        className="text-[#00B5ED] font-bold text-sm uppercase hover:underline"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
                <SupplierAds />
              </aside>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
