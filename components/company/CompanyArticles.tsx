"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/types/Post";

/* ================= CONFIG ================= */

const ROTATE_INTERVAL = 5000; // 5 seconds
const FADE_DURATION = 500; // must match the CSS transition duration below

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  WEBINAR: "bg-[#7C3AED]",
  EVENT: "bg-[#0EA5E9]",
  TRENDING: "bg-[#F97316]",
  EXCLUSIVE: "bg-[#059669]",
};

const CATEGORY_COLORS: Record<string, string> = {
  gaming: "bg-[#0073FF]",
  fashion: "bg-[#E033E0]",
  "latest-issue": "bg-[#F69C00]",
};

/* ================= HELPERS ================= */

// The API sometimes returns author: null (e.g. company-submitted
// articles that instead carry Company / guestName / createdBy info).
// Never assume post.author is an object — always guard it.
function getAuthorName(post: Post): string {
  if (post.author && typeof post.author === "object") {
    return post.author.name || "rstheme";
  }
  if (typeof post.author === "string" && (post.author as string).trim()) {
    return post.author as string;
  }
  // Fall back to company name if this is a company-submitted article
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

/* ================= COMPONENT ================= */

export default function CompanyArticles() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH APPROVED ARTICLES ================= */

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        console.error(
          "[CompanyArticles] NEXT_PUBLIC_API_URL is not set — check your .env"
        );
        setError("Missing API URL configuration");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/api/articles/approved`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error(
            `[CompanyArticles] Fetch failed: ${res.status} ${res.statusText}`,
            body
          );
          setError(`Failed to load articles (${res.status})`);
          setAllPosts([]);
          return;
        }

        const data = await res.json();

        // API may return either a bare array or { data: [...] }
        const list: Post[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        if (list.length === 0) {
          console.warn("[CompanyArticles] API returned an empty list", data);
        }

        setAllPosts(list);
      } catch (err) {
        console.error("[CompanyArticles] Failed to load approved articles", err);
        setError("Failed to load articles");
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= UP TO 3 UNIQUE ARTICLES (SLIDING WINDOW) ================= */

  const visiblePosts = useMemo(() => {
    if (allPosts.length === 0) return [];

    const windowSize = Math.min(3, allPosts.length);
    const result: Post[] = [];

    for (let i = 0; i < windowSize; i++) {
      result.push(allPosts[(index + i) % allPosts.length]);
    }

    return result;
  }, [allPosts, index]);

  /* ================= ROTATION ================= */

  useEffect(() => {
    if (allPosts.length <= 3) return;

    const timer = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % allPosts.length);
        setFade(true);
      }, FADE_DURATION);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [allPosts.length]);

  /* ================= RENDER GUARDS ================= */

  // Previously this just returned null on empty/loading with zero
  // visual feedback, which is indistinguishable from "silently broken".
  if (loading) {
    return (
      <section className="pt-4 sm:pt-8 w-full">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="bg-[#F7F7F7] rounded-md px-6 py-10 text-center text-sm text-gray-400">
            Loading articles…
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-4 sm:pt-8 w-full">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="bg-[#F7F7F7] rounded-md px-6 py-10 text-center text-sm text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!visiblePosts.length) return null;

  /* ================= UI ================= */

  return (
    <section className="pt-4 sm:pt-8 w-full">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="relative bg-[#F7F7F7] rounded-md px-4 sm:px-6 py-6 sm:py-7 overflow-hidden">
          {/* background shapes */}
          <div className="absolute top-0 right-0 opacity-30 pointer-events-none hidden sm:block">
            <Image
              src="/images/shape/flower-shape-01.png"
              alt=""
              width={120}
              height={120}
              sizes="120px"
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-2 opacity-30 pointer-events-none hidden sm:block">
            <Image
              src="/images/shape/flower-shape-02.png"
              alt=""
              width={120}
              height={120}
              sizes="120px"
              className="object-contain"
            />
          </div>

          {/* POSTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {visiblePosts.map((post, i) => {
              const slug = getCategorySlug(post);
              const categoryName = getCategoryName(post);

              const badge = post.badge?.trim();
              const tagText = badge || categoryName;

              let tagClass = "bg-[#9CA3AF]";

              if (badge) {
                tagClass = BADGE_COLORS[badge.toUpperCase()] || "bg-[#6B7280]";
              } else {
                const match = Object.keys(CATEGORY_COLORS).find((key) =>
                  slug.includes(key)
                );
                if (match) tagClass = CATEGORY_COLORS[match];
              }

              const imageUrl = post.imageUrl?.startsWith("http")
                ? post.imageUrl
                : post.imageUrl
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                  : "/placeholder.jpg";

              return (
                <div
                  key={`${post.id}-${i}`}
                  className="bg-white text-[16px] rounded-md p-4 sm:p-5 flex gap-4 h-[140px] sm:h-[160px] overflow-hidden"
                >
                  {/* thumbnail */}
                  <Link
                    href={`/post/${post.slug}`}
                    className="relative text-[16px] w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] rounded-md overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <Image
                      src={imageUrl}
                      alt={post.title?.slice(0, 20) || "Article"}
                      fill
                      sizes="(max-width: 640px) 72px, 96px"
                      className={`object-cover text-[16px] transition-all duration-500 ease-in-out ${fade
                          ? "opacity-100 scale-100 translate-x-0"
                          : "opacity-0 scale-95 -translate-x-2"
                        }`}
                    />
                  </Link>

                  {/* content */}
                  <div
                    className={`flex flex-col text-[16px] gap-2 min-w-0 transition-all duration-500 ease-in-out ${fade
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                      }`}
                  >
                    {tagText && (
                      <span
                        className={`${tagClass} text-[16px] text-white px-3 py-[3px] rounded-full rounded-tl-none w-fit text-[12px] font-medium`}
                      >
                        {tagText}
                      </span>
                    )}

                    <h6 className="text-[20px] leading-snug font-semibold text-[#121213] line-clamp-2 h-[44px] sm:h-[48px] hover:text-[#0073FF] transition">
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h6>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#616C74]">
                      <span>
                        By{" "}
                        <span className="font-medium">{getAuthorName(post)}</span>
                      </span>
                      <span>{post.views?.toLocaleString() || 0} Views</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}