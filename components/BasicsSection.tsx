"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Post } from "../types/Post";

import "swiper/css";

/* ================= CATEGORY COLORS ================= */

const CATEGORY_COLORS: Record<string, string> = {
  tech: "bg-[#ff5733]",
  gadget: "bg-[#00ad48]",
  innovation: "bg-[#59a255]",
  software: "bg-[#f27100]",
  digital: "bg-[#0073ff]",
  automation: "bg-[#00b5ed]",
  robotics: "bg-[#6d28d9]",
  future: "bg-[#54bd05]",
  basics: "bg-[#0073ff]",
  trending: "bg-[#F59E0B]",
  latest: "bg-[#F69C00]",
  video: "bg-[#EF4444]",
  engineering: "bg-[#2563EB]",
  manufacturing: "bg-[#059669]",
};

const BADGE_COLORS: Record<string, string> = {
  FEATURED: "bg-[#E11D48]",
  TECH: "bg-[#ff5733]",
  GADGET: "bg-[#00ad48]",
  INNOVATION: "bg-[#59a255]",
  SOFTWARE: "bg-[#f27100]",
  DIGITAL: "bg-[#0073ff]",
  AUTOMATION: "bg-[#00b5ed]",
  ROBOTICS: "bg-[#6d28d9]",
  FUTURE: "bg-[#54bd05]",
};

type Props = {
  posts: Post[];
};

function getCategorySlug(post: Post): string {
  const slug =
    typeof post.category === "object" && post.category !== null
      ? post.category?.slug || ""
      : String(post.category || "");
  return slug.toLowerCase().trim();
}

function getAuthorName(post: Post): string {
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

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BasicsSection({ posts }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  /* Popular = most viewed first */
  const popularPosts = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  }, [posts]);

  if (popularPosts.length === 0) {
    return null;
  }

  const imageUrl = (post: Post) => {
    if (post.imageUrl?.startsWith("http")) return post.imageUrl;
    if (post.imageUrl) return `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`;
    return "/placeholder.jpg";
  };

  const getTag = (post: Post) => {
    const badge = post?.badge?.trim();
    const slug = getCategorySlug(post);
    const categoryName =
      typeof post?.category === "object" && post?.category !== null
        ? post?.category?.name || ""
        : String(post?.category || "");

    const text = badge || categoryName || slug;
    let color = "bg-[#0073ff]";

    if (badge) {
      color = BADGE_COLORS[badge.toUpperCase()] || "bg-gray-500";
    } else {
      const matchedKey = Object.keys(CATEGORY_COLORS).find(
        (key) => slug.includes(key) || text.toLowerCase().includes(key)
      );
      if (matchedKey) color = CATEGORY_COLORS[matchedKey];
    }

    return { text, color };
  };

  const formatDate = (post: Post) => {
    const raw = post.publishedAt || post.createdAt;
    if (!raw) return null;
    return new Date(raw).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="w-full bg-[#15171f]">
      {/* Match Nerio Popular News: boxed header + full-bleed slider row */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-[30px] pb-[30px] lg:pt-[40px] lg:pb-[40px]">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 lg:mb-7 min-w-0">
          <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold text-white shrink-0 leading-none">
            Popular News
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

        {/* ================= SLIDER (Nerio: 4 / 3 / 2 / 1, gap 30) ================= */}
        <div className="relative group/slider">
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={30}
            slidesPerView={1}
            slidesPerGroup={1}
            loop={popularPosts.length > 4}
            speed={500}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              900: { slidesPerView: 3, spaceBetween: 24 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="!overflow-hidden"
          >
            {popularPosts.map((post) => {
              const tag = getTag(post);
              const date = formatDate(post);

              return (
                <SwiperSlide key={post.id}>
                  <Link
                    href={`/post/${post.slug}`}
                    className="group relative block h-[280px] sm:h-[320px] lg:h-[360px] overflow-hidden rounded-[4px]"
                  >
                    <Image
                      src={imageUrl(post)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      quality={75}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 px-[16px] py-[16px] sm:px-[18px] sm:py-[18px]">
                      {tag.text && (
                        <span
                          className={`inline-block ${tag.color} text-white text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[2px] rounded-[3px] mb-[10px]`}
                        >
                          {tag.text}
                        </span>
                      )}

                      <h5 className="text-white text-[16px] sm:text-[17px] font-bold leading-[1.35] mb-[10px] line-clamp-3 group-hover:text-[#0073ff] transition-colors">
                        {post.title}
                      </h5>

                      <ul className="flex flex-wrap items-center gap-x-[12px] gap-y-[4px] text-[12px] text-white/80">
                        <li>
                          By <span className="text-white/95">{getAuthorName(post)}</span>
                        </li>
                        {typeof post.views === "number" && (
                          <li className="inline-flex items-center gap-[4px]">
                            <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                            {post.views.toLocaleString()} Views
                          </li>
                        )}
                        {date && (
                          <li className="inline-flex items-center gap-[4px]">
                            <CalendarIcon className="w-3 h-3 text-[#0073ff]" />
                            {date}
                          </li>
                        )}
                      </ul>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white bg-[#1D2125]/85 backdrop-blur-sm hover:border-[#0073ff] hover:text-[#0073ff] transition-colors"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white bg-[#1D2125]/85 backdrop-blur-sm hover:border-[#0073ff] hover:text-[#0073ff] transition-colors"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="mt-[24px] flex justify-center sm:hidden">
          <Link
            href="/articles"
            className="inline-flex items-center gap-[8px] text-[14px] text-white hover:text-[#0073ff] transition-colors"
          >
            View All
            <ArrowIcon className="w-4 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
