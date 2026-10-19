"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "../types/Post";
import { getCategoryUrl } from "@/lib/topic";
import {
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

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

function getAuthorName(post: Post): string {
  if (post.author && typeof post.author === "object" && post.author.name) {
    return post.author.name;
  }
  const company = (post as any).Company || (post as any).company;
  if (company?.name) return company.name;
  return "rstheme";
}

function getCategorySlug(post: Post): string {
  return typeof post.category === "object"
    ? post.category?.slug?.toLowerCase() || ""
    : String(post.category || "").toLowerCase();
}

function getCategoryName(post: Post): string {
  return typeof post.category === "object"
    ? post.category?.name || ""
    : String(post.category || "");
}

function getImageUrl(post: Post): string {
  if (post.imageUrl?.startsWith("http")) return post.imageUrl;
  if (post.imageUrl) return `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`;
  return "/placeholder.jpg";
}

function formatDate(post: Post) {
  const raw = post.publishedAt || post.createdAt;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function excerptOf(post: Post, words = 18) {
  const text = (post.excerpt || "").replace(/\s+/g, " ").trim();
  if (!text) {
    return "Timely updates and reliable reporting on politics, global events, science, and culture. Our concise news summaries help you...";
  }
  const parts = text.split(" ");
  if (parts.length <= words) return text;
  return `${parts.slice(0, words).join(" ")}...`;
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

function DiamondDot() {
  return (
    <span className="w-[7px] h-[7px] bg-[#0073ff] rotate-45 shrink-0" aria-hidden />
  );
}

export default function HomeCompanyArticles({ posts }: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const allPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return [...posts].sort((a, b) => {
      const aTime = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [posts]);

  const visiblePosts = allPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allPosts.length;

  const visiblePostsWithTags = useMemo(() => {
    const usedColors = new Set<string>();
    return visiblePosts.map((post, idx) => {
      const badge = typeof post?.badge === "string" ? post.badge.trim() : "";
      const slug = getCategorySlug(post);
      const categoryName = getCategoryName(post);
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
  }, [visiblePosts]);

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; count: number; image: string }>();
    for (const post of allPosts) {
      const slug = getCategorySlug(post) || "tech";
      const name = getCategoryName(post) || slug;
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
        if (!existing.image && post.imageUrl) existing.image = getImageUrl(post);
      } else {
        map.set(slug, {
          name,
          slug,
          count: 1,
          image: getImageUrl(post),
        });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allPosts]);

  const popularPosts = useMemo(() => {
    return [...allPosts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4);
  }, [allPosts]);

  if (!allPosts.length) return null;

  function getTag(post: Post) {
    const badge = typeof post.badge === "string" ? post.badge.trim() : "";
    const categoryName =
      typeof post.category === "object"
        ? post.category?.name || ""
        : String(post.category || "");
    const categorySlug =
      typeof post.category === "object"
        ? (post.category?.slug || "").toLowerCase()
        : String(post.category || "").toLowerCase();

    const text = badge || categoryName || "News";
    const normalized = (text || "").toLowerCase();
    const slug = categorySlug || post.slug?.toLowerCase() || "";

    const match = Object.keys(CATEGORY_PREFERRED_COLORS).find(
      (key) => slug.includes(key) || normalized.includes(key)
    );

    return {
      text,
      color: match ? CATEGORY_PREFERRED_COLORS[match] : "bg-[#0073ff]",
    };
  }

  return (
    <section className="w-full bg-[#1D2125]">
      <style jsx>{`
        h2.section-title-32 {
          font-size: 32px !important;
          line-height: 1.2 !important;
        }
        h4.top-card-title-22,
        h4.top-card-title-22 a {
          font-size: 22px !important;
          line-height: 1.3 !important;
        }
        p.top-card-excerpt-16 {
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
        ul.top-card-meta-14 li {
          font-size: 14px !important;
          line-height: 1.4 !important;
        }
      `}</style>
      <div className="w-full max-w-[1420px] mx-auto px-0 pt-[70px] pb-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[minmax(0,970px)_400px] gap-5 lg:gap-8 xl:gap-10 w-full max-w-[1400px] mx-auto">

          {/* ================= LEFT: TOP OF THIS WEEK ================= */}
          <div className="min-w-0 w-full max-w-[970px]">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 lg:mb-7 min-w-0">
              <h2 className="section-title-32 font-bold text-white shrink-0 leading-none">
                Top of This Week
              </h2>
              <div className="flex-1 min-w-[40px] flex items-center">
                <DiamondDot />
                <span className="flex-1 h-px bg-white/15" />
              </div>
            </div>


            {/* Plain normal-flow list — no inner scroll */}
            <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
              {visiblePostsWithTags.map(({ post, tagText, tagColor }) => {
                const date = formatDate(post);

                return (
                  <article
                    key={post.id}
                    className="group flex flex-col sm:flex-row gap-4 sm:gap-5 min-w-0 py-5 sm:py-6 lg:w-full lg:min-h-[230px] lg:py-[20px] lg:px-0"
                  >
                    <Link
                      href={`/post/${post.slug}`}
                      className="relative w-full sm:w-[200px] md:w-[220px] lg:w-[410px] h-[180px] sm:h-[150px] md:h-[160px] lg:h-[230px] rounded-[10px] overflow-hidden shrink-0"
                    >
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 340px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>


                    <div className="min-w-0 flex-1 mx-[20px] ml-[5px] py-[15px]">
                      {tagText && (

                        <span
                          className={`inline-block ${tagColor} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-tl-none rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] mb-[10px]`}
                        >
                          {tagText}
                        </span>
                      )}

                      <h4 className="top-card-title-22 text-[22px] text-white font-bold leading-snug mb-[8px]">
                        <Link
                          href={`/post/${post.slug}`}
                          className="text-[22px] text-white hover:text-[#0073ff] transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h4>

                      <p className="top-card-excerpt-16 text-[#CCCCCC] leading-relaxed mb-[12px] line-clamp-2">
                        {excerptOf(post)}
                      </p>

                      <ul className="top-card-meta-14 flex flex-wrap items-center gap-x-[14px] gap-y-[6px] text-[#CCCCCC]">
                        <li>
                          By{" "}
                          <span className="text-white/90 font-medium">
                            {getAuthorName(post)}
                          </span>
                        </li>
                        <li className="inline-flex items-center gap-[4px]">
                          <PulseIcon className="w-3.5 h-3.5 text-[#0073ff]" />
                          {(post.views ?? 0).toLocaleString()} Views
                        </li>
                        {date && (
                          <li className="inline-flex items-center gap-[4px]">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#0073ff]" />
                            {date}
                          </li>
                        )}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-[32px] flex justify-center">
              {hasMore ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + LOAD_MORE_COUNT)}
                  className="inline-flex items-center gap-[8px] bg-[#0073ff] hover:bg-[#0060d6] text-white text-[14px] font-semibold px-6 py-2.5 rounded-[4px] transition-colors"
                >
                  Load More
                  <RefreshCw size={15} />
                </button>
              ) : (
                <p className="text-[14px] text-white/60">🥰 That&apos;s all for now!</p>
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="w-full lg:w-[400px] min-w-0 h-full relative">
            <div className="flex flex-col gap-10 lg:sticky lg:top-[110px] w-full">
              {/* Explore Categories */}
              <div className="rounded-[4px] border border-white/10 bg-[#1D2125] w-full pt-[20px] pr-[30px] pb-[30px] pl-[30px]">
                <h4 className="text-[17px] font-bold text-white mb-[12px]">
                  Explore Categories
                </h4>

                <div className="flex flex-col gap-[14px]">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={getCategoryUrl(cat.slug)}
                      className="group relative flex items-center min-h-[54px] py-[10px] pl-[12px] pr-[44px] rounded-[4px] overflow-hidden"
                    >
                      <Image
                        src={cat.image}
                        alt=""
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[#00000080] group-hover:bg-black/60 transition-colors" />
                      <div className="relative z-10 flex items-baseline gap-[6px] text-white min-w-0 pr-1">
                        <h6 className="text-[16px] font-bold leading-snug break-words">{cat.name}</h6>
                        <span className="text-[11px] text-white/85 shrink-0">({cat.count})</span>
                      </div>
                      <span className="absolute z-10 top-1/2 right-[10px] -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-[4px] bg-black/40 text-white group-hover:bg-[#0073ff] transition-colors shrink-0">
                        <ArrowRight size={12} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              {/* Popular News — normal flow */}
              <div className="rounded-[4px] border border-white/10 bg-[#1D2125] w-full lg:w-[400px] pt-[20px] pr-[30px] pb-[30px] pl-[30px]">
                <h4 className="text-[17px] font-bold text-white mb-[12px]">
                  Popular News
                </h4>
                <div className="flex flex-col divide-y divide-white/10">
                  {popularPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="group flex items-center gap-[12px] py-[10px]"
                    >

                      <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden shrink-0">
                        <Image
                          src={getImageUrl(post)}
                          alt={post.title}
                          fill

                          sizes="100px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h6 className="text-[18px] font-semibold text-white leading-snug mb-[6px] line-clamp-2 group-hover:text-[#0073ff] transition-colors">
                          {post.title}
                        </h6>
                        <ul className="flex flex-wrap items-center gap-x-[10px] text-[14px] text-[#a8aab3]">
                          <li>By {getAuthorName(post)}</li>
                          <li className="inline-flex items-center gap-[4px]">
                            <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                            {(post.views ?? 0).toLocaleString()} Views
                          </li>
                        </ul>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}