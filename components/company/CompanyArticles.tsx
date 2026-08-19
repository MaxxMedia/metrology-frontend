"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/types/Post";

/* ================= CONFIG ================= */

const CATEGORY_SLUG = "optical-and-vision-metrology";
const CATEGORY_NAME = "Optical & Vision Metrology";

// Fixed hero background — drop the uploaded image into /public/images/
// as vr-metrology-hero.jpg (see the file I generated alongside this component).
const HERO_BG_SRC = "/5.jpg"; 

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

function isOpticalVisionPost(post: Post): boolean {
  const slug = getCategorySlug(post);
  const name = getCategoryName(post).toLowerCase();

  return (
    slug === CATEGORY_SLUG ||
    name === CATEGORY_NAME.toLowerCase() ||
    (name.includes("optical") && name.includes("vision"))
  );
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

function sortByRecency(list: Post[]) {
  return [...list].sort((a, b) => {
    const aTime = new Date(
      (a as any).publishedAt || (a as any).createdAt || 0
    ).getTime();
    const bTime = new Date(
      (b as any).publishedAt || (b as any).createdAt || 0
    ).getTime();
    return bTime - aTime;
  });
}

type Props = {
  posts?: Post[];
};

/* ================= COMPONENT ================= */

export default function CompanyArticles({ posts: postsProp }: Props) {
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fromProp = useMemo(
    () =>
      Array.isArray(postsProp)
        ? sortByRecency(postsProp.filter(isOpticalVisionPost))
        : [],
    [postsProp]
  );

  useEffect(() => {
    if (fromProp.length > 0) {
      setLoading(false);
      setError(null);
      return;
    }

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
        const res = await fetch(
          `${apiUrl}/api/posts?category=${encodeURIComponent(CATEGORY_SLUG)}&limit=20`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error(
            `[CompanyArticles] Fetch failed: ${res.status} ${res.statusText}`,
            body
          );
          setError(`Failed to load articles (${res.status})`);
          setFetchedPosts([]);
          return;
        }

        const data = await res.json();
        const list: Post[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setFetchedPosts(sortByRecency(list.filter(isOpticalVisionPost)));
      } catch (err) {
        console.error(
          "[CompanyArticles] Failed to load Optical & Vision Metrology posts",
          err
        );
        setError("Failed to load articles");
        setFetchedPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [fromProp.length]);

  const allPosts = fromProp.length > 0 ? fromProp : fetchedPosts;
  const visiblePosts = allPosts.slice(0, 3);

  const visiblePostsWithTags = useMemo(() => {
    const usedColors = new Set<string>();
    return visiblePosts.map((post, idx) => {
      const badge = typeof post?.badge === "string" ? post.badge.trim() : "";
      const slug = getCategorySlug(post);
      const categoryName = getCategoryName(post);
      const text = badge || categoryName || CATEGORY_NAME;

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

  return (
    <section className="w-full bg-[#1D2125] overflow-hidden md:h-[655.6px]">
      <style jsx>{`
        .company-card-title-18 {
          font-size: 18px !important;
          line-height: 1.35 !important;
        }
      `}</style>
      <div className="relative w-full h-full overflow-hidden bg-[#1D2125]">
        <Image
          src={HERO_BG_SRC}
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1D2125]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2125] via-[#1D2125]/45 to-[#1D2125]/20" />

        <div className="relative z-10 md:absolute md:inset-x-0 md:top-[430px]">
          <div className="w-full max-w-[1420px] mx-auto px-4 md:px-[10px] py-4 md:py-0 md:h-[595.6px]">
            <div className="flex flex-col gap-3 md:grid md:grid-cols-1 md:gap-3 lg:grid-cols-3 md:sm:gap-4 w-full">
              {visiblePostsWithTags.map(({ post, tagText, tagColor }) => {

                return (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="group flex items-center gap-3 rounded-[12px] border border-white/15 bg-[#FFFFFF0D] backdrop-blur-md w-full min-h-[120px] md:w-[446.66px] md:h-[165.6px] pt-3 pr-3 pb-3 pl-3 md:pr-[30px] md:pl-[12px] hover:border-white/30 transition-colors"
                  >
                    <div className="relative w-[88px] h-[88px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title || "Article"}
                        fill
                        sizes="(max-width: 768px) 88px, 140px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {tagText && (
                        <span
                          className={`inline-block ${tagColor} text-white text-[9px] md:text-[10px] font-semibold uppercase tracking-wide px-2 py-[2px] rounded-tl-none rounded-tr-[5px] rounded-br-[5px] rounded-bl-[5px] mb-1.5`}
                        >
                          {tagText}
                        </span>
                      )}

                      <h6 className="company-card-title-18 text-white font-bold leading-snug mb-1.5 line-clamp-2 group-hover:text-[#7dd3fc] transition-colors text-[15px] md:text-[18px]">
                        {truncateTitle(post.title || "", 42)}
                      </h6>

                      <ul className="hidden md:flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-white/75">
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