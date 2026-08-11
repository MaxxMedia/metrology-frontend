"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/types/Post";

/* ================= CONFIG ================= */

const ROTATE_INTERVAL = 5000;
const FADE_DURATION = 500;

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  WEBINAR: "bg-[#7C3AED]",
  EVENT: "bg-[#0EA5E9]",
  TRENDING: "bg-[#F97316]",
  EXCLUSIVE: "bg-[#059669]",
  TECH: "bg-[#ff5733]",
  AUTOMATION: "bg-[#00b5ed]",
  GADGET: "bg-[#00ad48]",
  DIGITAL: "bg-[#0073ff]",
  SOFTWARE: "bg-[#f27100]",
  INNOVATION: "bg-[#59a255]",
  FUTURE: "bg-[#54bd05]",
};

const CATEGORY_COLORS: Record<string, string> = {
  tech: "bg-[#ff5733]",
  automation: "bg-[#00b5ed]",
  gadget: "bg-[#00ad48]",
  digital: "bg-[#0073ff]",
  software: "bg-[#f27100]",
  innovation: "bg-[#59a255]",
  future: "bg-[#54bd05]",
  gaming: "bg-[#0073FF]",
  fashion: "bg-[#E033E0]",
  "latest-issue": "bg-[#F69C00]",
};

/* ================= HELPERS ================= */

function getAuthorName(post: Post): string {
  if (post.author && typeof post.author === "object") {
    return post.author.name || "rstheme";
  }
  if (typeof post.author === "string" && (post.author as string).trim()) {
    return post.author as string;
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

function truncateTitle(title: string, max = 38) {
  if (!title) return "";
  if (title.length <= max) return title;
  return `${title.slice(0, max).trimEnd()}…`;
}

/* ================= COMPONENT ================= */

export default function CompanyArticles() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        const list: Post[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

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

  const visiblePosts = useMemo(() => {
    if (allPosts.length === 0) return [];

    const windowSize = Math.min(3, allPosts.length);
    const result: Post[] = [];

    for (let i = 0; i < windowSize; i++) {
      result.push(allPosts[(index + i) % allPosts.length]);
    }

    return result;
  }, [allPosts, index]);

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

  if (loading) {
    return (
      <section className="w-full bg-[#1D2125]">
        <div className="relative h-[420px] md:h-[480px] bg-[#1D2125] flex items-center justify-center">
          <p className="text-white/50 text-sm">Loading articles…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#1D2125]">
        <div className="relative h-[200px] bg-[#1D2125] flex items-center justify-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (!visiblePosts.length) return null;

  const heroBg = getImageUrl(visiblePosts[0]);

  return (
    <section className="w-full bg-[#1D2125]">
      <div className="relative min-h-[420px] md:min-h-[520px] overflow-hidden bg-[#1D2125]">
        {/* Full-bleed cinematic background */}
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className={`object-cover transition-all duration-700 ease-in-out ${
            fade ? "opacity-100 scale-100" : "opacity-80 scale-[1.03]"
          }`}
        />
        <div className="absolute inset-0 bg-[#1D2125]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2125] via-[#1D2125]/45 to-[#1D2125]/20" />

        {/* Glass cards row */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="max-w-[1320px] mx-auto px-3 sm:px-4 pb-6 md:pb-8">
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-500 ease-in-out ${
                fade ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {visiblePosts.map((post, i) => {
                const slug = getCategorySlug(post);
                const categoryName = getCategoryName(post);
                const badge = post.badge?.trim();
                const tagText = badge || categoryName;

                let tagClass = "bg-[#0073ff]";
                if (badge) {
                  tagClass = BADGE_COLORS[badge.toUpperCase()] || "bg-[#6B7280]";
                } else {
                  const match = Object.keys(CATEGORY_COLORS).find(
                    (key) =>
                      slug.includes(key) || tagText.toLowerCase().includes(key)
                  );
                  if (match) tagClass = CATEGORY_COLORS[match];
                }

                return (
                  <Link
                    key={`${post.id}-${i}`}
                    href={`/post/${post.slug}`}
                    className="group flex items-center gap-3.5 rounded-[12px] border border-white/15 bg-black/45 backdrop-blur-md p-3.5 sm:p-4 hover:border-white/30 hover:bg-black/55 transition-colors"
                  >
                    <div className="relative w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title || "Article"}
                        fill
                        sizes="70px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {tagText && (
                        <span
                          className={`inline-block ${tagClass} text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-[2px] rounded mb-1.5`}
                        >
                          {tagText}
                        </span>
                      )}

                      <h6 className="text-white text-[14px] sm:text-[15px] font-bold leading-snug mb-1.5 line-clamp-2 group-hover:text-[#7dd3fc] transition-colors">
                        {truncateTitle(post.title || "", 42)}
                      </h6>

                      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-white/75">
                        <li>By {getAuthorName(post)}</li>
                        <li className="inline-flex items-center gap-1">
                          <PulseIcon className="w-3 h-3 text-[#7dd3fc]" />
                          {(post.views ?? 0).toLocaleString()} Views
                        </li>
                      </ul>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
