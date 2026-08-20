"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Post } from "../types/Post";

/* ================= COLOR CONFIG ================= */

const NON_REPEATING_PALETTE = [
  "bg-[#00b5ed]", // Cyan
  "bg-[#00B95C]", // Green
  "bg-[#7C3AED]", // Purple
  "bg-[#f27100]", // Orange
  "bg-[#0073ff]", // Royal Blue
  "bg-[#E11D48]", // Rose
  "bg-[#059669]", // Emerald
  "bg-[#F59E0B]", // Amber
  "bg-[#8B5CF6]", // Violet
  "bg-[#0284C7]", // Sky Blue
  "bg-[#EC4899]", // Pink
  "bg-[#10B981]", // Teal
];

const CATEGORY_PREFERRED_COLORS: Record<string, string> = {
  automation: "bg-[#00b5ed]",
  gadget: "bg-[#00B95C]",
  robotics: "bg-[#7C3AED]",
  software: "bg-[#f27100]",
  digital: "bg-[#0073ff]",
  innovation: "bg-[#E11D48]",
  tech: "bg-[#059669]",
  engineering: "bg-[#0284C7]",
  manufacturing: "bg-[#10B981]",
  future: "bg-[#8B5CF6]",
  trending: "bg-[#F59E0B]",
};

type Props = {
  posts: Post[];
};

function getRecency(p: Post) {
  const raw = p.publishedAt || p.createdAt;
  return raw ? new Date(raw).getTime() : 0;
}

function getAuthorName(post?: Post) {
  if (!post) return "rstheme";
  if (post.author && typeof post.author === "object" && post.author.name) {
    return post.author.name;
  }
  const company = (post as any).Company || (post as any).company;
  if (company?.name) return company.name;
  return "rstheme";
}

function truncateTitle(title: string, max = 48) {
  if (title.length <= max) return title;
  return `${title.slice(0, max).trimEnd()}…`;
}

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

export default function VideosSection({ posts }: Props) {
  /* Latest news by recency — 2 featured + 3 list with non-repeating tags */
  const latestPostsWithTags = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];
    const sorted = [...posts].sort((a, b) => getRecency(b) - getRecency(a)).slice(0, 5);
    const usedColors = new Set<string>();

    return sorted.map((post, idx) => {
      const badge = typeof post?.badge === "string" ? post.badge.trim() : "";
      const slug =
        typeof post?.category === "object"
          ? post?.category?.slug?.toLowerCase() || ""
          : String(post?.category || "").toLowerCase();
      const categoryName =
        typeof post?.category === "object"
          ? post?.category?.name || ""
          : String(post?.category || "");

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
      return { post, tagText: text, tagColor: chosenColor };
    });
  }, [posts]);

  if (!latestPostsWithTags.length) return null;

  const [leftFeatured, rightFeatured, ...smallPosts] = latestPostsWithTags;

  const imageUrl = (post?: Post) =>
    post?.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post?.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
        : "/placeholder.jpg";

  const formatDate = (post?: Post) => {
    const raw = post?.publishedAt || post?.createdAt;
    if (!raw) return null;
    return new Date(raw).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const FeaturedCard = ({
    itemObj,
    className = "",
  }: {
    itemObj: { post: Post; tagText: string; tagColor: string };
    className?: string;
  }) => {
    const { post, tagText, tagColor } = itemObj;
    const date = formatDate(post);

    return (
      <Link
        href={`/post/${post.slug}`}
        className={`group relative block h-[320px] sm:h-[420px] lg:h-[500px] rounded-[4px] overflow-hidden ${className}`}
      >
        <Image
          src={imageUrl(post)}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
          quality={80}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-[16px] py-[18px] sm:px-[20px] sm:py-[22px]">
          {tagText && (
            <span
              className={`inline-block ${tagColor} text-white text-[14px] font-semibold uppercase tracking-wide px-[10px] py-[3px] rounded-tl-none rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] mb-[12px]`}
            >
              {tagText}
            </span>
          )}

          <h3 className="featured-title-28 text-white font-bold leading-snug mb-[12px] group-hover:text-[#0073ff] transition-colors line-clamp-3">
            {post.title}
          </h3>

          <ul className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px] text-[14px] text-[#FFFFFFCC]">
            <li>
              By <span className="text-white">{getAuthorName(post)}</span>
            </li>
            {typeof post.views === "number" && (
              <li className="inline-flex items-center gap-[6px]">
                <PulseIcon className="w-3.5 h-3.5 text-[#0073ff]" />
                {post.views.toLocaleString()} Views
              </li>
            )}
            {date && (
              <li className="inline-flex items-center gap-[6px]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#0073ff]" />
                {date}
              </li>
            )}
          </ul>
        </div>
      </Link>
    );
  };

  return (
    <section className="w-full bg-black">
      <div className="w-full max-w-[1420px] mx-auto px-0 py-[80px]">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-3 sm:gap-4 mb-[12px] min-w-0">
          <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold text-white shrink-0 leading-none">
            Latest News
          </h2>

          <div className="relative flex-1 min-w-[40px] flex items-center">
            <DiamondDot />
            <span className="flex-1 h-px bg-white/15" />
            <DiamondDot className="hidden sm:block" />
          </div>

          <Link
            href="/articles"
            className="hidden sm:inline-flex items-center gap-[8px] text-[14px] text-white hover:text-[#0073ff] transition-colors shrink-0 group"
          >
            <span>View All</span>
            <ArrowIcon className="w-4 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ================= MOBILE: 3 SMALL CARDS ONLY ================= */}
        {smallPosts.length > 0 && (
          <div className="md:hidden flex flex-col gap-3 mb-5">
            {smallPosts.map(({ post, tagText, tagColor }) => (
              <Link
                key={`mobile-video-${post.id}`}
                href={`/post/${post.slug}`}
                className="group flex items-center gap-2.5 rounded-[12px] border border-white/15 bg-white/[0.07] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-2 hover:bg-white/[0.12] hover:border-white/25 transition-colors"
              >
                <div className="relative w-[54px] h-[54px] overflow-hidden shrink-0 rounded-[8px]">
                  <Image
                    src={imageUrl(post)}
                    alt={post.title}
                    fill
                    sizes="54px"
                    quality={70}
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {tagText ? (
                    <span
                      className={`inline-block ${tagColor} text-white text-[8px] font-semibold uppercase tracking-wide px-[6px] py-[1px] rounded-tl-none rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px] mb-1`}
                    >
                      {tagText}
                    </span>
                  ) : null}

                  <h6 className="text-white text-[12px] font-bold leading-[1.2] mb-0.5 group-hover:text-[#0073ff] transition-colors line-clamp-2">
                    {truncateTitle(post.title, 34)}
                  </h6>

                  <p className="text-[10px] text-[#a8aab3]">
                    By {getAuthorName(post)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ================= DESKTOP: 2 FEATURED ================= */}
        <div className="hidden md:flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6 mb-5 lg:mb-6">
          {leftFeatured && (
            <FeaturedCard itemObj={leftFeatured} className="w-full lg:w-[923.33px] shrink-0" />
          )}
          {rightFeatured && (
            <FeaturedCard itemObj={rightFeatured} className="hidden md:block w-full lg:w-[446.66px] shrink-0" />
          )}
        </div>

        {/* ================= BOTTOM: 3 SMALL CARDS ================= */}
        {smallPosts.length > 0 && (
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-4 lg:gap-6">
            {smallPosts.map(({ post, tagText, tagColor }) => {
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="group flex items-center gap-3.5 min-w-0 w-full max-w-full sm:w-[450px] sm:h-[151.6px] py-[10px]"
                >
                  <div className="relative w-[96px] h-[96px] sm:w-[140px] sm:h-[130px] rounded-[4px] overflow-hidden shrink-0">
                    <Image
                      src={imageUrl(post)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 96px, 140px"
                      quality={70}
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {tagText && (
                      <span
                        className={`inline-block ${tagColor} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-tl-none rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] mb-[8px]`}
                      >
                        {tagText}
                      </span>
                    )}

                    <h6 className="text-[16px] sm:text-[18px] font-semibold leading-snug text-white mb-[8px] group-hover:text-[#0073ff] transition-colors line-clamp-2">
                      {post.title}
                    </h6>

                    <ul className="small-card-meta-14 flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[#a8aab3]">
                      <li>
                        By <span className="text-white/90">{getAuthorName(post)}</span>
                      </li>
                      {typeof post.views === "number" && (
                        <li className="inline-flex items-center gap-[4px]">
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
        )}

        <div className="mt-[20px] flex justify-center sm:hidden">
          <Link
            href="/articles"
            className="inline-flex items-center gap-[8px] text-[14px] font-medium text-white hover:text-[#0073ff] transition-colors"
          >
            View All
            <ArrowIcon className="w-4 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
