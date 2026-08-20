"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Post } from "../types/Post";

/* ================= COLOR CONFIG ================= */

const NON_REPEATING_PALETTE = [
  "bg-[#00b5ed]", // Cyan (e.g. AUTOMATION)
  "bg-[#00B95C]", // Green (e.g. GADGET)
  "bg-[#7C3AED]", // Purple (e.g. ROBOTICS)
  "bg-[#f27100]", // Orange (e.g. SOFTWARE)
  "bg-[#0073ff]", // Royal Blue (e.g. DIGITAL)
  "bg-[#E11D48]", // Rose (e.g. INNOVATION)
  "bg-[#059669]", // Emerald (e.g. TECH / QUALITY)
  "bg-[#F59E0B]", // Amber
  "bg-[#8B5CF6]", // Violet
  "bg-[#0284C7]", // Sky Blue
];

const CATEGORY_PREFERRED_COLORS: Record<string, string> = {
  automation: "bg-[#00b5ed]",
  gadget: "bg-[#00B95C]",
  robotics: "bg-[#7C3AED]",
  software: "bg-[#f27100]",
  digital: "bg-[#0073ff]",
  innovation: "bg-[#E11D48]",
  tech: "bg-[#059669]",
};

type Props = {
  posts: Post[];
};

/* ================= ICONS ================= */

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

/* ================= MAIN COMPONENT ================= */

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

  // 1 large featured card (left) + 6 list cards (right 2×3 grid)
  const featured = sortedPosts[0];
  const listPosts = sortedPosts.slice(1, 7);

  if (!featured) return null;

  const imageUrl = (post?: Post) =>
    post?.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post?.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/placeholder.jpg";

  // Pre-calculate strictly non-repeating tags for all 7 visible cards
  const tagsWithUniqueColors = useMemo(() => {
    const usedColors = new Set<string>();
    const allPosts = [featured, ...listPosts];

    return allPosts.map((post, idx) => {
      if (!post) return { text: "News", color: NON_REPEATING_PALETTE[idx % NON_REPEATING_PALETTE.length] };

      const badge = typeof post?.badge === "string" ? post.badge.trim() : "";
      const slug = typeof post?.category === "object" ? post?.category?.slug?.toLowerCase() || "" : String(post?.category || "").toLowerCase();
      const categoryName = typeof post?.category === "object" ? post?.category?.name || "" : String(post?.category || "");
      const text = badge || categoryName || "News";

      const matchedKey = Object.keys(CATEGORY_PREFERRED_COLORS).find(
        (k) => slug.includes(k) || text.toLowerCase().includes(k)
      );

      let chosenColor = "";
      if (matchedKey && !usedColors.has(CATEGORY_PREFERRED_COLORS[matchedKey])) {
        chosenColor = CATEGORY_PREFERRED_COLORS[matchedKey];
      } else {
        const unused = NON_REPEATING_PALETTE.find((c) => !usedColors.has(c));
        chosenColor = unused || NON_REPEATING_PALETTE[idx % NON_REPEATING_PALETTE.length];
      }

      usedColors.add(chosenColor);
      return { text, color: chosenColor };
    });
  }, [featured, listPosts]);

  const featuredTag = tagsWithUniqueColors[0];
  const listTags = tagsWithUniqueColors.slice(1);

  const formatDate = (date?: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      : null;

  const featuredDate =
    formatDate(featured.publishedAt) || formatDate(featured.createdAt);
  return (
    <section className="w-full bg-[#111824] text-white">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-4 pb-4 lg:pt-6 lg:pb-6">

        {/* ================= TRENDING NEWS HEADER ================= */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 mb-5 lg:mb-[22px] min-w-0">
          <h2 className="text-[26px] sm:text-[34px] lg:text-[38px] font-bold text-white shrink-0 leading-none tracking-tight">
            Trending News
          </h2>

          {/* Decorative line with rotated blue diamonds */}
          <div className="hidden sm:flex items-center flex-1 min-w-[60px] mx-2 lg:mx-4">
            <div className="w-[9px] h-[9px] bg-[#087CF5] rotate-45 shrink-0" />
            <div className="flex-1 h-[1px] bg-[#17191c] mx-3" />
            <div className="w-[9px] h-[9px] bg-[#087CF5] rotate-45 shrink-0" />
          </div>

          <Link
            href="/articles"
            className="inline-flex items-center gap-[8px] text-[15px] sm:text-[17px] font-semibold text-white hover:text-[#087CF5] transition-colors shrink-0 group ml-auto sm:ml-0"
          >
            <span>View All</span>
            <ArrowIcon className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile decorative separator */}
        <div className="sm:hidden w-full h-[1px] bg-[#35383C] mb-5" />
        {/* ================= FEATURE GRID (Exact Reference Proportions) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,460px)_1fr] items-stretch gap-[28px]">

          {/* ================= LEFT: LARGE FEATURED ARTICLE CARD ================= */}
          <Link
            href={`/post/${featured.slug}`}
            className="group relative block w-full max-w-[460px] min-h-[330px] sm:min-h-[370px] lg:min-h-[440px] xl:min-h-[470px] rounded-[6px] overflow-hidden shadow-2xl border border-white/10"
          >
            <Image
              src={imageUrl(featured)}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 350px, 460px"
              quality={85}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />


            {/* Dark gradient overlay over bottom portion */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0.88) 100%)"
              }}
            />

            {/* Overlay Content at bottom-left */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 lg:p-[26px] flex flex-col justify-end">
              {featuredTag.text && (
                <div className="mb-2.5">
                  <span
                    className={`inline-flex items-center h-[26px] px-[11px] ${featuredTag.color} text-white text-[14px] font-bold uppercase tracking-wider rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-full shadow-sm`}
                  >
                    {featuredTag.text}
                  </span>
                </div>
              )}

              <h3 className="text-white text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[27px] font-bold leading-[1.2] mb-2.5 group-hover:text-[#087CF5] transition-colors line-clamp-3 max-w-[500px]">
                {featured.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-white/90 font-normal">
                <span>By <span className="font-medium text-white">{getAuthorName(featured)}</span></span>
                {typeof featured.views === "number" && (
                  <span className="inline-flex items-center gap-1.5">
                    <PulseIcon className="w-3.5 h-3.5 text-[#087CF5]" />
                    <span>{featured.views.toLocaleString()} Views</span>
                  </span>
                )}
                {featuredDate && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#087CF5]" />
                    <span>{featuredDate}</span>
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* ================= RIGHT: 2 COLS × 3 ROWS NEWS GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[28px] gap-y-0 content-between h-full min-h-full">
            {listPosts.map((post, idx) => {
              const tag = listTags[idx] || { text: "News", color: NON_REPEATING_PALETTE[(idx + 1) % NON_REPEATING_PALETTE.length] };


              return (
                <div
                  key={post.id}
                  className="flex flex-col justify-between py-2 lg:py-2.5 border-b border-[#35383C]/70 min-w-0"
                >
                  <Link
                    href={`/post/${post.slug}`}
                    className="group flex gap-3 lg:gap-[16px] items-center min-w-0"
                  >
                    {/* Compact Square Thumbnail Image */}
                    <div className="relative w-[85px] sm:w-[100px] lg:w-[108px] xl:w-[115px] aspect-square rounded-[7px] overflow-hidden shrink-0 bg-[#1D2125]">
                      <Image
                        src={imageUrl(post)}
                        alt={post.title}
                        fill
                        sizes="115px"
                        quality={80}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Text details container */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      {tag.text && (
                        <div className="mb-1.5">
                          <span
                            className={`inline-flex items-center h-[22px] px-[10px] ${tag.color} text-white text-[14px] font-bold uppercase tracking-wider rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-full`}
                          >
                            {tag.text}
                          </span>
                        </div>
                      )}

                      <h4 className="text-white text-[15px] sm:text-[17px] lg:text-[18px] xl:text-[19.5px] font-bold leading-[1.3] mb-1.5 group-hover:text-[#087CF5] transition-colors line-clamp-2">
                        {post.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-2 text-[14px] text-[#D0D4DC]">
                        <span>By {getAuthorName(post)}</span>
                        {typeof post.views === "number" && (
                          <span className="inline-flex items-center gap-1">
                            • <PulseIcon className="w-3.5 h-3.5 text-[#087CF5]" />
                            <span>{post.views.toLocaleString()} Views</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

