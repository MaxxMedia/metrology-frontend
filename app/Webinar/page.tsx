"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    Loader2,
} from "lucide-react";

const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface WebinarCategory {
    name?: string;
    slug?: string;
}

interface WebinarItem {
    id?: number | string;
    slug?: string;
    title: string;
    thumbnail?: string;
    heroImage?: string;
    speakerName?: string;
    speakerDesignation?: string;
    speakerCompany?: string;
    speakerImage?: string;
    startDate?: string;
    duration?: number;
    featured?: boolean;
    isOnDemand?: boolean;
    category?: WebinarCategory;
}

function deriveListState(w: {
    isOnDemand?: boolean;
    startDate?: string;
}): string | undefined {
    if (w.isOnDemand) return "on-demand";
    if (w.startDate) {
        return new Date(w.startDate).getTime() >= Date.now() ? "upcoming" : "completed";
    }
    return undefined;
}

function badgeForWebinar(w: {
    featured?: boolean;
    isOnDemand?: boolean;
    startDate?: string;
}) {
    const listState = deriveListState(w);
    if (w.featured) return { label: "LIVE", tone: "live" as const };
    if (listState === "upcoming") return { label: "UPCOMING", tone: "upcoming" as const };
    if (listState === "completed") return { label: "COMPLETED", tone: "completed" as const };
    if (w.isOnDemand) return { label: "ON DEMAND", tone: "demand" as const };
    return null;
}

const BADGE_STYLES = {
    live: "bg-[#0073FF] text-white",
    upcoming: "bg-[#0073FF] text-white",
    completed: "bg-[#292C30] text-[#CCCCCC]",
    demand: "bg-[#00B5ED] text-[#0a0d14]",
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function formatFullDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function WebinarThumbnail({
    src,
    alt,
    className = "",
}: {
    src?: string;
    alt: string;
    className?: string;
}) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`h-full w-full object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`flex h-full w-full items-center justify-center bg-[#171A1E] text-gray-500 ${className}`}>
            <VideoPlaceholder />
        </div>
    );
}

function VideoPlaceholder() {
    return (
        <svg className="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    );
}

function WebinarCard({ webinar }: { webinar: WebinarItem }) {
    const badge = badgeForWebinar(webinar);
    const listState = deriveListState(webinar);
    const isPast = listState === "completed" || webinar.isOnDemand;
    const imageSrc = webinar.thumbnail || webinar.heroImage;
    const href = webinar.slug ? `/Webinar/${webinar.slug}` : null;

    const cardBody = (
        <>
            <div className="relative aspect-video overflow-hidden bg-[#171A1E]">
                <WebinarThumbnail
                    src={imageSrc}
                    alt={webinar.title}
                    className="transition-transform duration-300 group-hover:scale-105"
                />
                {badge && (
                    <span
                        className={`absolute left-3 top-3 rounded px-2 py-1 text-[11px] font-bold tracking-wide ${BADGE_STYLES[badge.tone]}`}
                    >
                        {badge.label}
                    </span>
                )}
                {webinar.startDate && !isPast && (
                    <span className="absolute right-3 top-3 rounded bg-[#1D2125]/90 px-2 py-1 text-[11px] font-bold text-white border border-[#292C30]">
                        {formatDate(webinar.startDate)}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white group-hover:text-[#00B5ED] transition-colors">
                    {webinar.title}
                </h3>

                <div className="flex items-center gap-2">
                    {webinar.speakerImage ? (
                        <img
                            src={webinar.speakerImage}
                            alt={webinar.speakerName || "Speaker"}
                            className="h-8 w-8 rounded-full object-cover border border-[#292C30]"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171A1E] text-xs font-semibold text-[#CCCCCC] border border-[#292C30]">
                            {webinar.speakerName?.[0] || "?"}
                        </div>
                    )}
                    <div className="leading-tight">
                        <p className="text-sm font-medium text-white">{webinar.speakerName}</p>
                        <p className="text-xs text-gray-400">
                            {[webinar.speakerDesignation, webinar.speakerCompany].filter(Boolean).join(", ")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="h-3.5 w-3.5 text-[#00B5ED]" />
                    {webinar.startDate && !isPast
                        ? `${new Date(webinar.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} IST · ${webinar.duration ?? 60} Min`
                        : `${webinar.duration ?? 60} Min`}
                </div>

                <span
                    className={`mt-auto block w-full rounded-md py-2 text-center text-sm font-semibold transition-colors ${
                        isPast
                            ? "border border-[#292C30] text-[#CCCCCC] group-hover:border-[#00B5ED] group-hover:text-[#00B5ED]"
                            : "bg-[#0073FF] text-white group-hover:bg-[#0060D0]"
                    }`}
                >
                    {isPast ? "Watch Now" : "Register"}
                </span>
            </div>
        </>
    );

    if (!href) {
        return (
            <div className="group flex flex-col overflow-hidden rounded-xl border border-[#292C30] bg-[#1D2125]">
                {cardBody}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className="group flex flex-col overflow-hidden rounded-xl border border-[#292C30] bg-[#1D2125] transition-all hover:border-[#0073FF]/50 hover:shadow-lg hover:shadow-[#0073FF]/10"
        >
            {cardBody}
        </Link>
    );
}

export default function WebinarListingPage({ apiBase = DEFAULT_API_BASE }) {
    const [webinars, setWebinars] = useState<WebinarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [quickFilter, setQuickFilter] = useState<"all" | "upcoming" | "on-demand">("all");
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError("");

        fetch(`${apiBase}/webinars`)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load"))))
            .then((res) => {
                if (!cancelled) {
                    setWebinars(Array.isArray(res?.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load webinars. Please try again later.");
                    setWebinars([]);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [apiBase]);

    const featuredList = useMemo(
        () => webinars.filter((w) => w.featured),
        [webinars]
    );

    const featured =
        featuredList.length > 0
            ? featuredList[carouselIndex % featuredList.length]
            : webinars[0] ?? null;

    const categoryOptions = useMemo(() => {
        const names = Array.from(
            new Set(webinars.map((w) => w.category?.name).filter(Boolean))
        ) as string[];
        return ["All Categories", ...names];
    }, [webinars]);

    const filtered = useMemo(() => {
        return webinars.filter((w) => {
            const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =
                category === "All Categories" || w.category?.name === category;
            const listState = deriveListState(w);
            const matchesQuickFilter =
                quickFilter === "all" ||
                (quickFilter === "upcoming" && listState === "upcoming") ||
                (quickFilter === "on-demand" && w.isOnDemand);
            return matchesSearch && matchesCategory && matchesQuickFilter;
        });
    }, [webinars, search, category, quickFilter]);

    const scrollToGrid = () => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen bg-[#0a0d14] font-sans text-[#CCCCCC]">
            <div className="relative overflow-hidden bg-[#0a0d14] border-b border-[#292C30]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(0,115,255,0.12),transparent_55%)]" />
                <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00B5ED]">
                        Metrology
                    </p>
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Webinars</h1>
                    <p className="mt-2 text-lg font-medium text-[#CCCCCC]">
                        Insights. Innovation. Industry.
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                        Join live and on-demand webinars by industry experts on the latest
                        trends in metrology, measurement systems, and smart manufacturing.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setQuickFilter("upcoming");
                                scrollToGrid();
                            }}
                            className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                                quickFilter === "upcoming"
                                    ? "bg-[#0073FF] text-white hover:bg-[#0060D0]"
                                    : "border border-[#292C30] text-[#CCCCCC] hover:border-[#00B5ED] hover:text-white"
                            }`}
                        >
                            Upcoming
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setQuickFilter("on-demand");
                                scrollToGrid();
                            }}
                            className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                                quickFilter === "on-demand"
                                    ? "bg-[#0073FF] text-white hover:bg-[#0060D0]"
                                    : "border border-[#292C30] text-[#CCCCCC] hover:border-[#00B5ED] hover:text-white"
                            }`}
                        >
                            On Demand
                        </button>
                        {featured?.slug ? (
                            <Link
                                href={`/Webinar/${featured.slug}`}
                                className="rounded-md border border-[#292C30] px-5 py-2.5 text-sm font-semibold text-[#CCCCCC] hover:border-[#00B5ED] hover:text-white transition-colors"
                            >
                                Register
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={scrollToGrid}
                                className="rounded-md border border-[#292C30] px-5 py-2.5 text-sm font-semibold text-[#CCCCCC] hover:border-[#00B5ED] hover:text-white transition-colors"
                            >
                                Browse Webinars
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-b border-[#292C30] bg-[#1D2125]">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
                    <div className="relative min-w-[220px] flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search webinars..."
                            className="w-full rounded-md border border-[#292C30] bg-[#171A1E] py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-[#0073FF] focus:outline-none focus:ring-1 focus:ring-[#0073FF]"
                        />
                    </div>
                    {categoryOptions.length > 1 && (
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-md border border-[#292C30] bg-[#171A1E] px-3 py-2 text-sm text-white focus:border-[#0073FF] focus:outline-none focus:ring-1 focus:ring-[#0073FF]"
                        >
                            {categoryOptions.map((name) => (
                                <option key={name} value={name} className="bg-[#171A1E]">
                                    {name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-10">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-400">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#00B5ED]" />
                        Loading webinars…
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-16 text-center text-sm text-red-300">
                        {error}
                    </div>
                ) : (
                    <>
                        {featured && (
                            <div className="relative mb-12 overflow-hidden rounded-xl border border-[#292C30] bg-[#1D2125]">
                                <div className="grid gap-0 sm:grid-cols-2">
                                    <div className="relative aspect-video sm:aspect-auto">
                                        <WebinarThumbnail
                                            src={featured.thumbnail || featured.heroImage}
                                            alt={featured.title}
                                            className="opacity-90"
                                        />
                                        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-[#0073FF] px-2.5 py-1 text-xs font-bold text-white">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                            {featured.featured ? "LIVE" : "FEATURED"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col justify-center p-8">
                                        {featured.startDate && (
                                            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#00B5ED]">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatFullDate(featured.startDate)} ·{" "}
                                                {new Date(featured.startDate).toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}{" "}
                                                IST
                                            </p>
                                        )}
                                        <h2 className="text-2xl font-bold leading-snug text-white">
                                            {featured.title}
                                        </h2>
                                        <div className="mt-4 flex items-center gap-3">
                                            {featured.speakerImage ? (
                                                <img
                                                    src={featured.speakerImage}
                                                    alt={featured.speakerName || "Speaker"}
                                                    className="h-10 w-10 rounded-full object-cover border border-[#292C30]"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171A1E] text-sm font-semibold text-white border border-[#292C30]">
                                                    {featured.speakerName?.[0] || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-white">{featured.speakerName}</p>
                                                <p className="text-xs text-gray-400">
                                                    {[featured.speakerDesignation, featured.speakerCompany]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            </div>
                                        </div>
                                        {featured.slug && (
                                            <div className="mt-6 flex gap-3">
                                                <Link
                                                    href={`/Webinar/${featured.slug}`}
                                                    className="rounded-md bg-[#0073FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0060D0] transition-colors"
                                                >
                                                    Register Now
                                                </Link>
                                                <Link
                                                    href={`/Webinar/${featured.slug}`}
                                                    className="rounded-md border border-[#292C30] px-5 py-2.5 text-sm font-semibold text-[#CCCCCC] hover:border-[#00B5ED] hover:text-white transition-colors"
                                                >
                                                    Learn More →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {featuredList.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCarouselIndex(
                                                    (i) => (i - 1 + featuredList.length) % featuredList.length
                                                )
                                            }
                                            aria-label="Previous featured webinar"
                                            className="absolute right-16 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#171A1E] border border-[#292C30] text-white hover:border-[#00B5ED] transition-colors"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCarouselIndex((i) => (i + 1) % featuredList.length)
                                            }
                                            aria-label="Next featured webinar"
                                            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#171A1E] border border-[#292C30] text-white hover:border-[#00B5ED] transition-colors"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        <div ref={gridRef} className="mb-6 flex items-center gap-3 scroll-mt-6">
                            <h2 className="text-xl font-bold text-white">All Webinars</h2>
                            <span className="h-0.5 w-10 bg-[#0073FF]" />
                            {quickFilter !== "all" && (
                                <button
                                    type="button"
                                    onClick={() => setQuickFilter("all")}
                                    className="ml-auto rounded-full bg-[#171A1E] border border-[#292C30] px-3 py-1 text-xs font-medium text-gray-400 hover:text-white hover:border-[#00B5ED] transition-colors"
                                >
                                    Showing: {quickFilter === "upcoming" ? "Upcoming" : "On Demand"} ✕
                                </button>
                            )}
                        </div>

                        {webinars.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-[#292C30] py-16 text-center text-sm text-gray-400">
                                No webinars published yet. Check back soon.
                            </p>
                        ) : filtered.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-[#292C30] py-16 text-center text-sm text-gray-400">
                                No webinars match your filters — try clearing search or category.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((w) => (
                                    <WebinarCard key={w.id ?? w.slug ?? w.title} webinar={w} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
