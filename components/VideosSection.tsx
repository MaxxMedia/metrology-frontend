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
  TECH: "bg-[#ff5733]",
  FUTURE: "bg-[#54bd05]",
  DIGITAL: "bg-[#0073ff]",
  SOFTWARE: "bg-[#f27100]",
  GADGET: "bg-[#00ad48]",
  AUTOMATION: "bg-[#00b5ed]",
  INNOVATION: "bg-[#59a255]",
  ROBOTICS: "bg-[#6d28d9]",
};

const CATEGORY_COLORS: Record<string, string> = {
  tech: "bg-[#ff5733]",
  future: "bg-[#54bd05]",
  digital: "bg-[#0073ff]",
  software: "bg-[#f27100]",
  gadget: "bg-[#00ad48]",
  automation: "bg-[#00b5ed]",
  innovation: "bg-[#59a255]",
  robotics: "bg-[#6d28d9]",
  video: "bg-[#F69C00]",
  engineering: "bg-[#0072BC]",
  manufacturing: "bg-[#059669]",
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
  /* Latest news by recency — 2 featured + 3 list */
  const latestPosts = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];
    return [...posts].sort((a, b) => getRecency(b) - getRecency(a)).slice(0, 5);
  }, [posts]);

  if (!latestPosts.length) return null;

  const [leftFeatured, rightFeatured, ...smallPosts] = latestPosts;

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

    const text = badge || categoryName;
    let color = "bg-[#0073ff]";

    if (badge) {
      color = BADGE_COLORS[badge.toUpperCase()] || "bg-[#6B7280]";
    } else {
      const match = Object.keys(CATEGORY_COLORS).find(
        (k) => slug.includes(k) || text.toLowerCase().includes(k)
      );
      if (match) color = CATEGORY_COLORS[match];
    }

    return { text, color };
  };

  const FeaturedCard = ({
    post,
    className = "",
  }: {
    post: Post;
    className?: string;
  }) => {
    const tag = getTag(post);
    const date = formatDate(post);

    return (
      <Link
        href={`/post/${post.slug}`}
        className={`group relative block h-[260px] sm:h-[340px] md:h-[380px] lg:h-[440px] rounded-[4px] overflow-hidden ${className}`}
      >
        <Image
          src={imageUrl(post)}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
          quality={80}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-[16px] py-[18px] sm:px-[20px] sm:py-[22px]">
          {tag.text && (
            <span
              className={`inline-block ${tag.color} text-white text-[11px] font-semibold uppercase tracking-wide px-[10px] py-[3px] rounded-[3px] mb-[12px]`}
            >
              {tag.text}
            </span>
          )}

          <h3 className="text-white text-[20px] sm:text-[22px] md:text-[24px] font-bold leading-snug mb-[12px] group-hover:text-[#0073ff] transition-colors line-clamp-3">
            {post.title}
          </h3>

          <ul className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px] text-[13px] text-white/85">
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
    <section className="w-full bg-[#1D2125]">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-[30px] pb-[10px] lg:pt-[40px] lg:pb-[12px]">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 lg:mb-7 min-w-0">
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

        {/* ================= TOP: 2 FEATURED ================= */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-5 lg:mb-6">
          {leftFeatured && <FeaturedCard post={leftFeatured} />}
          {rightFeatured && <FeaturedCard post={rightFeatured} />}
        </div>

        {/* ================= BOTTOM: 3 SMALL CARDS ================= */}
        {smallPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-4 lg:gap-6">
            {smallPosts.map((post) => {
              const tag = getTag(post);
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="group flex items-center gap-3 sm:gap-3.5 min-w-0"
                >
                  <div className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-[4px] overflow-hidden shrink-0">
                    <Image
                      src={imageUrl(post)}
                      alt={post.title}
                      fill
                      sizes="80px"
                      quality={70}
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {tag.text && (
                      <span
                        className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-[3px] mb-[8px]`}
                      >
                        {tag.text}
                      </span>
                    )}

                    <h6 className="text-[15px] font-semibold leading-snug text-white mb-[8px] group-hover:text-[#0073ff] transition-colors line-clamp-2">
                      {post.title}
                    </h6>

                    <ul className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[12px] text-[#a8aab3]">
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
