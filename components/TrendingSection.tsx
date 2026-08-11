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
  AUTOMATION: "bg-[#00b5ed]",
  GADGET: "bg-[#00ad48]",
  ROBOTICS: "bg-[#6d28d9]",
  INNOVATION: "bg-[#59a255]",
  SOFTWARE: "bg-[#f27100]",
  DIGITAL: "bg-[#0073ff]",
  TECH: "bg-[#ff5733]",
  FUTURE: "bg-[#54bd05]",
};

const CATEGORY_COLORS: Record<string, string> = {
  automation: "bg-[#00b5ed]",
  gadget: "bg-[#00ad48]",
  robotics: "bg-[#6d28d9]",
  innovation: "bg-[#59a255]",
  software: "bg-[#f27100]",
  digital: "bg-[#0073ff]",
  tech: "bg-[#ff5733]",
  future: "bg-[#54bd05]",
  trending: "bg-[#F59E0B]",
  latest: "bg-[#F69C00]",
  video: "bg-[#EF4444]",
  gaming: "bg-[#2563EB]",
  engineering: "bg-[#2563EB]",
  articles: "bg-[#8B5CF6]",
  manufacturing: "bg-[#059669]",
};

type Props = {
  posts: Post[];
};

function PulseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 12h3l2-5 3 10 2-6 2 3h6" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
  );
}

function DiamondDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`w-[7px] h-[7px] bg-[#0073ff] rotate-45 shrink-0 ${className}`}
      aria-hidden
    />
  );
}

export default function TrendingSection({ posts }: Props) {
  const getAuthorName = (post?: Post) => {
    if (!post) return "rstheme";
    if (post.author && typeof post.author === "object" && post.author.name) {
      return post.author.name;
    }
    const company = (post as any).Company || (post as any).company;
    if (company?.name) return company.name;
    return "rstheme";
  };

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [posts]);

  // 1 featured (left) + 6 list cards (right 2×3)
  const featured = sortedPosts[0];
  const listPosts = sortedPosts.slice(1, 7);

  if (!featured) return null;

  const imageUrl = (post?: Post) =>
    post?.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post?.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/placeholder.jpg";

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
    let color = "bg-[#0073ff]";

    if (badge) {
      color = BADGE_COLORS[badge.toUpperCase()] || "bg-gray-500";
    } else {
      const match = Object.keys(CATEGORY_COLORS).find(
        (k) => slug.includes(k) || text.toLowerCase().includes(k)
      );
      if (match) color = CATEGORY_COLORS[match];
    }

    return { text, color };
  };

  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const featuredTag = getTag(featured);
  const featuredDate =
    formatDate(featured.publishedAt) || formatDate(featured.createdAt);

  return (
    <section className="w-full bg-transparent py-10 md:py-14">
      <div className="max-w-[1320px] mx-auto px-3 sm:px-4">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          <h2 className="text-[28px] md:text-[32px] font-bold text-white shrink-0 leading-none">
            Trending News
          </h2>

          <div className="relative flex-1 min-w-[40px] flex items-center">
            <DiamondDot />
            <span className="flex-1 h-px bg-white/15" />
            <DiamondDot className="hidden sm:block" />
          </div>

          <Link
            href="/articles"
            className="hidden sm:inline-flex items-center gap-2 text-[14px] text-white hover:text-[#0073ff] transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowIcon className="w-4 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] gap-6 lg:gap-7 items-stretch">
          {/* Featured large card */}
          <Link
            href={`/post/${featured.slug}`}
            className="group relative block min-h-[360px] lg:min-h-full rounded-[10px] overflow-hidden"
          >
            <Image
              src={imageUrl(featured)}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              quality={80}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              {featuredTag.text && (
                <span
                  className={`inline-block ${featuredTag.color} text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-[3px] rounded mb-3`}
                >
                  {featuredTag.text}
                </span>
              )}

              <h4 className="text-white text-[22px] sm:text-[24px] md:text-[26px] font-bold leading-snug mb-3 group-hover:text-[#7dd3fc] transition-colors">
                {featured.title}
              </h4>

              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-white/85">
                <li>
                  By <span className="text-white">{getAuthorName(featured)}</span>
                </li>
                {typeof featured.views === "number" && (
                  <li className="inline-flex items-center gap-1.5">
                    <PulseIcon className="w-3.5 h-3.5 text-[#7dd3fc]" />
                    {featured.views.toLocaleString()} Views
                  </li>
                )}
                {featuredDate && (
                  <li className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#7dd3fc]" />
                    {featuredDate}
                  </li>
                )}
              </ul>
            </div>
          </Link>

          {/* 2×3 small cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0 content-start">
            {listPosts.map((post, i) => {
              const tag = getTag(post);
              const isLastRow = i >= listPosts.length - 2;
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className={`group flex items-start gap-3.5 py-5 ${
                    !isLastRow ? "border-b border-white/10" : ""
                  }`}
                >
                  <div className="relative w-[88px] h-[88px] sm:w-[92px] sm:h-[92px] rounded-[8px] overflow-hidden shrink-0">
                    <Image
                      src={imageUrl(post)}
                      alt={post.title}
                      fill
                      sizes="92px"
                      quality={70}
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    {tag.text && (
                      <span
                        className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-[2px] rounded mb-1.5`}
                      >
                        {tag.text}
                      </span>
                    )}

                    <h6 className="text-[15px] sm:text-[16px] font-bold leading-snug text-white mb-1.5 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                      {post.title}
                    </h6>

                    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#a8aab3]">
                      <li>By {getAuthorName(post)}</li>
                      {typeof post.views === "number" && (
                        <li className="inline-flex items-center gap-1">
                          <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                          {post.views.toLocaleString()} Views
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-white"
          >
            View All
            <ArrowIcon className="w-4 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
