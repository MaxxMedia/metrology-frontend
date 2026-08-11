"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "../types/Post";
import {
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  TECH: "bg-[#ff5733]",
  AUTOMATION: "bg-[#00b5ed]",
  INNOVATION: "bg-[#59a255]",
  SOFTWARE: "bg-[#f27100]",
  DIGITAL: "bg-[#0073ff]",
  FUTURE: "bg-[#54bd05]",
  GADGET: "bg-[#00ad48]",
  ROBOTICS: "bg-[#6d28d9]",
};

const CATEGORY_COLORS: Record<string, string> = {
  tech: "bg-[#ff5733]",
  automation: "bg-[#00b5ed]",
  innovation: "bg-[#59a255]",
  software: "bg-[#f27100]",
  digital: "bg-[#0073ff]",
  future: "bg-[#54bd05]",
  gadget: "bg-[#00ad48]",
  robotics: "bg-[#6d28d9]",
  gaming: "bg-[#0073FF]",
  basics: "bg-[#0073FF]",
  machining: "bg-[#EC4899]",
  manufacturing: "bg-[#059669]",
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

function getTag(post: Post) {
  const badge = post.badge?.trim();
  const slug = getCategorySlug(post);
  const categoryName = getCategoryName(post);
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

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.259 5.686L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function PinterestIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
    </svg>
  );
}

function DribbbleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" aria-hidden>
      <path d="M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z" />
    </svg>
  );
}

const SOCIALS = [
  { name: "Facebook", followers: "88.2k Followers", href: "#", bg: "bg-[#1877F2]", Icon: Facebook },
  { name: "Twitter - X", followers: "48.6k Followers", href: "#", bg: "bg-[#111111]", Icon: XIcon },
  { name: "Dribbble", followers: "39.5k Followers", href: "#", bg: "bg-[#EA4C89]", Icon: DribbbleIcon },
  { name: "Pinterest", followers: "28.2k Followers", href: "#", bg: "bg-[#E60023]", Icon: PinterestIcon },
  { name: "Linkedin", followers: "30.3k Followers", href: "#", bg: "bg-[#0A66C2]", Icon: Linkedin },
  { name: "Instagram", followers: "24.5k Followers", href: "#", bg: "bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]", Icon: Instagram },
];

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

  return (
    <section className="w-full bg-[#1D2125]">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-[30px] pb-[30px] lg:pt-[40px] lg:pb-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px] gap-5 lg:gap-6 items-start">

          {/* ================= LEFT: TOP OF THIS WEEK ================= */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 lg:mb-7 min-w-0">
              <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold text-white shrink-0 leading-none">
                Top of This Week
              </h2>
              <div className="flex-1 min-w-[40px] flex items-center">
                <DiamondDot />
                <span className="flex-1 h-px bg-white/15" />
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-7">
              {visiblePosts.map((post) => {
                const tag = getTag(post);
                const date = formatDate(post);

                return (
                  <article
                    key={post.id}
                    className="group flex flex-col sm:flex-row gap-4 sm:gap-5 min-w-0"
                  >
                    <Link
                      href={`/post/${post.slug}`}
                      className="relative w-full sm:w-[200px] md:w-[220px] lg:w-[240px] h-[180px] sm:h-[150px] md:h-[160px] rounded-[4px] overflow-hidden shrink-0"
                    >
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0 flex-1 py-0.5">
                      {tag.text && (
                        <span
                          className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-[3px] mb-[10px]`}
                        >
                          {tag.text}
                        </span>
                      )}

                      <h4 className="text-[17px] sm:text-[18px] md:text-[20px] font-bold text-white leading-snug mb-[8px]">
                        <Link
                          href={`/post/${post.slug}`}
                          className="hover:text-[#0073ff] transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h4>

                      <p className="text-[14px] text-[#a8aab3] leading-relaxed mb-[12px] line-clamp-2">
                        {excerptOf(post)}
                      </p>

                      <ul className="flex flex-wrap items-center gap-x-[14px] gap-y-[6px] text-[12px] text-[#a8aab3]">
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
          <aside className="flex flex-col gap-4 w-full lg:w-auto lg:max-w-[300px] min-w-0">
            {/* Explore Categories */}
            <div className="rounded-[4px] border border-white/10 bg-[#252A30] p-[14px]">
              <h4 className="text-[17px] font-bold text-white mb-[12px]">
                Explore Categories
              </h4>
              <div className="flex flex-col gap-[8px]">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/topics/${cat.slug}`}
                    className="group relative flex items-center justify-between h-[48px] px-[12px] rounded-[4px] overflow-hidden"
                  >
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors" />
                    <div className="relative z-10 flex items-center gap-[5px] text-white min-w-0">
                      <h6 className="text-[13px] font-bold truncate">{cat.name}</h6>
                      <span className="text-[11px] text-white/85 shrink-0">({cat.count})</span>
                    </div>
                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-[4px] bg-black/40 text-white group-hover:bg-[#0073ff] transition-colors shrink-0">
                      <ArrowRight size={12} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular News */}
            <div className="rounded-[4px] border border-white/10 bg-[#252A30] p-[14px]">
              <h4 className="text-[17px] font-bold text-white mb-[12px]">
                Popular News
              </h4>
              <div className="flex flex-col gap-[14px]">
                {popularPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="group flex items-center gap-[12px]"
                  >
                    <div className="relative w-[64px] h-[64px] rounded-[4px] overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="text-[13px] font-semibold text-white leading-snug mb-[6px] line-clamp-2 group-hover:text-[#0073ff] transition-colors">
                        {post.title}
                      </h6>
                      <ul className="flex flex-wrap items-center gap-x-[10px] text-[11px] text-[#a8aab3]">
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

            {/* Follow Us */}
            <div className="rounded-[4px] border border-white/10 bg-[#252A30] p-[14px]">
              <h4 className="text-[17px] font-bold text-white mb-[12px]">
                Follow Us
              </h4>
              <div className="flex flex-col gap-[8px]">
                {SOCIALS.map(({ name, followers, href, bg, Icon }) => (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center gap-[10px] h-[44px] px-[12px] rounded-[4px] text-white ${bg} hover:opacity-90 transition-opacity`}
                  >
                    <Icon size={14} />
                    <span className="flex-1 text-[13px] font-bold truncate">{name}</span>
                    <span className="text-[11px] text-white/90 shrink-0">{followers}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
