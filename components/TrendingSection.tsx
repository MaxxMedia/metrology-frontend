"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Post } from "../types/Post";

/* ================= COLOR CONFIG ================= */

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  WEBINAR: "bg-[#7C3AED]",
  EVENT: "bg-[#0EA5E9]",
  TRENDING: "bg-[#F97316]",
  EXCLUSIVE: "bg-[#059669]",
};

const CATEGORY_COLORS: Record<string, string> = {
  trending: "bg-[#F59E0B]",
  latest: "bg-[#F69C00]",
  video: "bg-[#EF4444]",
  engineering: "bg-[#2563EB]",
  articles: "bg-[#8B5CF6]",
  manufacturing: "bg-[#059669]",
};

type Props = {
  posts: Post[];
};

export default function TrendingSection({ posts }: Props) {

  /* ================= GET MOST VIEWED POSTS ================= */
  const sortedPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [posts]);

  // Distribution:
  // 1st most viewed → Big card (left side)
  // 2nd, 3rd, 4th most viewed → Right side (3 cards)
  // 5th, 6th, 7th most viewed → Top row (3 cards)
  const bigCardPost = sortedPosts[0]; // Most viewed
  const rightSidePosts = sortedPosts.slice(1, 4); // Next 3 most viewed
  const topPosts = sortedPosts.slice(4, 7); // Next 3 most viewed

  if (!sortedPosts || sortedPosts.length === 0) {
    console.log("⚠️ No posts found");
    return null;
  }

  /* ================= HELPERS ================= */

  const imageUrl = (post?: Post) =>
    post?.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post?.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/placeholder.jpg";

  const Meta = ({ post }: { post?: Post }) =>
    post ? (
      <div className="flex items-center gap-4 mt-2 text-[13px] text-white/70">
        <span>{post.views?.toLocaleString()} Views</span>
        {post.createdAt && (
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    ) : null;

  const getTag = (post?: Post) => {
    const badge = post?.badge?.trim();

    const slug =
      typeof post?.category === "object"
        ? post?.category?.slug?.toLowerCase() || ""
        : String(post?.category || "").toLowerCase();

    const categoryName =
      typeof post?.category === "object"
        ? post?.category?.name || ""
        : String(post?.category || "");

    const text = badge ? badge : categoryName;

    let color = "bg-gray-400";

    if (badge) {
      color = BADGE_COLORS[badge.toUpperCase()] || "bg-gray-500";
    } else {
      const match = Object.keys(CATEGORY_COLORS).find((k) =>
        slug.includes(k)
      );
      if (match) color = CATEGORY_COLORS[match];
    }

    return { text, color };
  };

  // Small card component (used for both top 3 and right side)
  const SmallCard = ({ post, className = "" }: { post: Post; className?: string }) => {
    const tag = getTag(post);
    return (
      <Link
        href={`/post/${post.slug}`}
        className={`flex gap-4 group hover:opacity-90 transition ${className}`}
      >
        <div className="flex-shrink-0">
          <Image
            src={imageUrl(post)}
            alt={post.title}
            width={90}
            height={70}
            sizes="90px"
            quality={70}
            className="rounded-md object-cover w-[90px] h-[70px]"
          />
        </div>

        <div className="flex-1 min-w-0">
          {tag.text && (
            <span
              className={`${tag.color} inline-block mb-1 text-[10px] font-bold px-2 py-0.5 rounded text-black`}
            >
              {tag.text}
            </span>
          )}

          <h3 className="text-[14px] font-semibold leading-snug group-hover:text-gray-300 transition line-clamp-2">
            {post.title}
          </h3>

          <div className="flex items-center gap-3 mt-1 text-[11px] text-white/70">
            <span>{post.views?.toLocaleString()} Views</span>
            {post.createdAt && (
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  /* ================= RENDER ================= */

  return (
    <section className="bg-[#0f1318] pt-[70px] pb-[80px] text-white">
      <div className="max-w-[1320px] mx-auto px-[12px] space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-[36px] font-semibold">
            Trending News
          </h2>
          <Link
            href="/articles"
            className="text-sm text-white/70 hover:text-white"
          >
            View All →
          </Link>
        </div>

        {/* TOP 3 SMALL POSTS */}
        <div className="relative py-8">
          <span className="absolute top-0 left-0 w-full h-px bg-white/10" />
          <span className="absolute bottom-0 left-0 w-full h-px bg-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topPosts.map(
              (post, i) =>
                post && <SmallCard key={i} post={post} />
            )}
          </div>
        </div>

        {/* FEATURE POSTS - 1 Big on Left + 3 Small on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: BIG CARD (Takes 2/3) - MOST VIEWED POST */}
          {bigCardPost && (() => {
            const tag = getTag(bigCardPost);
            return (
              <Link
                href={`/post/${bigCardPost.slug}`}
                className="lg:col-span-2 relative h-[420px] rounded-md overflow-hidden"
              >
                <Image
                  src={imageUrl(bigCardPost)}
                  alt={bigCardPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  quality={75}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 max-w-xl">
                  {tag.text && (
                    <span className={`${tag.color} text-xs font-bold px-3 py-1 rounded`}>
                      {tag.text}
                    </span>
                  )}
                  <h2 className="text-[30px] font-semibold mt-4 leading-tight">
                    {bigCardPost.title}
                  </h2>
                  <Meta post={bigCardPost} />
                </div>
              </Link>
            );
          })()}

          {/* RIGHT: 3 SMALL CARDS STACKED (Takes 1/3) - NEXT 3 MOST VIEWED */}
          <div className="flex flex-col gap-3 h-[420px]">
            {rightSidePosts.map(
              (post, i) =>
                post && (
                  <div key={i} className="flex-1 flex items-center">
                    <SmallCard post={post} className="w-full" />
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}