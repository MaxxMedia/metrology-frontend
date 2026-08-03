"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Mail,
    Calendar,
    Clock,
} from "lucide-react";

const MOCK_WEBINARS = [
    {
        id: 1,
        slug: "ai-in-smart-manufacturing-the-next-revolution",
        title: "AI in Smart Manufacturing The Next Revolution",
        thumbnail:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        speakerName: "John Smith",
        speakerDesignation: "Manufacturing Director",
        speakerCompany: "Siemens",
        speakerImage: "https://i.pravatar.cc/80?img=12",
        startDate: "2026-08-22T15:00:00",
        duration: 60,
        status: "PUBLISHED",
        isOnDemand: false,
        featured: true,
        category: { name: "Factory Automation", slug: "factory-automation" },
    },
    {
        id: 2,
        title: "Advanced 5-Axis Machining Best Practices",
        thumbnail:
            "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80",
        speakerName: "Michael Brown",
        speakerDesignation: "Applications Engineer",
        speakerCompany: "DMG MORI",
        startDate: "2026-08-25T15:00:00",
        duration: 60,
        isOnDemand: false,
        listState: "upcoming",
        category: { name: "Machine", slug: "machine" },
    },
    {
        id: 3,
        title: "Digital Twin in Tool & Die Manufacturing",
        thumbnail:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
        speakerName: "Priya Sharma",
        speakerDesignation: "Lead Engineer",
        speakerCompany: "Autodesk",
        startDate: "2026-08-28T16:00:00",
        duration: 60,
        isOnDemand: false,
        listState: "upcoming",
        category: { name: "Dies, Moulds and Tooling", slug: "dies-moulds-and-tooling" },
    },
    {
        id: 4,
        title: "Tool Wear Analysis and Optimization",
        thumbnail:
            "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
        speakerName: "Rajesh Kumar",
        speakerDesignation: "Technical Specialist",
        speakerCompany: "Sandvik",
        duration: 60,
        isOnDemand: true,
        listState: "on-demand",
        category: { name: "Cutting Tools", slug: "cuttingtools" },
    },
    {
        id: 5,
        title: "Industry 4.0 for Small & Medium Manufacturers",
        thumbnail:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        speakerName: "Anil Patel",
        speakerDesignation: "CEO",
        speakerCompany: "Manufacturing Insights",
        duration: 60,
        isOnDemand: true,
        listState: "on-demand",
        category: { name: "Factory Automation", slug: "factory-automation" },
    },
    {
        id: 6,
        title: "Robotics & Automation in Machine Shops",
        thumbnail:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        speakerName: "Vikram Mehta",
        speakerDesignation: "Automation Expert",
        duration: 60,
        isOnDemand: false,
        listState: "completed",
        category: { name: "Factory Automation", slug: "factory-automation" },
    },
    {
        id: 7,
        title: "Metrology Trends Shaping Quality",
        thumbnail:
            "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
        speakerName: "Neha Singh",
        speakerDesignation: "Quality Manager",
        speakerCompany: "Hexagon",
        duration: 60,
        isOnDemand: true,
        listState: "on-demand",
        category: { name: "Metrology and Quality", slug: "metrologyandquality" },
    },
];

// ✅ FIX: real webinars from the API never had a `listState` field — that
// only ever existed on the hardcoded MOCK_WEBINARS above. Because of that,
// every real webinar fell through badgeForWebinar()'s listState checks and
// got no badge at all, and `isPast` was only ever true for on-demand items
// — so a webinar that already happened still showed a "Register" button
// instead of "Watch Now". This derives the same state from fields the API
// actually returns (isOnDemand + startDate), but still respects an
// explicit listState when one is present (e.g. on the mock data), so
// nothing about the preview cards changes.
function deriveListState(w: {
    listState?: string;
    isOnDemand?: boolean;
    startDate?: string | number | Date;
}): string | undefined {
    if (w.listState) return w.listState;
    if (w.isOnDemand) return "on-demand";
    if (w.startDate) {
        return new Date(w.startDate).getTime() >= Date.now() ? "upcoming" : "completed";
    }
    return undefined;
}

function badgeForWebinar(w: { featured: any; listState?: string; isOnDemand: any; startDate?: string | number | Date }) {
    const listState = deriveListState(w);
    if (w.featured) return { label: "LIVE", tone: "live" };
    if (listState === "upcoming") return { label: "UPCOMING", tone: "upcoming" };
    if (listState === "completed") return { label: "COMPLETED", tone: "completed" };
    if (w.isOnDemand) return { label: "ON DEMAND", tone: "demand" };
    return null;
}

const BADGE_STYLES: { [key in "live" | "upcoming" | "completed" | "demand"]: string } = {
    live: "bg-red-600 text-white",
    upcoming: "bg-red-600 text-white",
    completed: "bg-slate-500 text-white",
    demand: "bg-slate-900 text-white",
};

function formatDate(dateStr: string | number | Date) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function formatFullDate(dateStr: string | number | Date) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function WebinarCard({ webinar }: { webinar: any }) {
    const badge = badgeForWebinar(webinar);
    const listState = deriveListState(webinar);
    const isPast = listState === "completed" || webinar.isOnDemand;

    // ✅ FIX: this card had zero navigation before — no Link, no onClick,
    // nothing. Clicking "Register" (or anywhere on the card) did nothing.
    // Real webinars from the API always have a slug (see shapeWebinar()
    // on the backend), so we route to /Webinar/[slug]. The handful of
    // MOCK_WEBINARS entries without a slug (ids 2,3,4,5,6,7 — only
    // preview/demo data) fall back to a non-clickable card instead of
    // silently linking to /Webinar/undefined.
    const href = webinar.slug ? `/Webinar/${webinar.slug}` : null;

    const cardBody = (
        <>
            <div className="relative aspect-video overflow-hidden bg-slate-800">
                <img
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {badge && (
                    <span
                        className={`absolute left-3 top-3 rounded px-2 py-1 text-[11px] font-bold tracking-wide ${BADGE_STYLES[badge.tone as keyof typeof BADGE_STYLES]}`}
                    >
                        {badge.label}
                    </span>
                )}
                {webinar.startDate && !isPast && (
                    <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-900">
                        {formatDate(webinar.startDate)}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
                    {webinar.title}
                </h3>

                <div className="flex items-center gap-2">
                    {webinar.speakerImage ? (
                        <img
                            src={webinar.speakerImage}
                            alt={webinar.speakerName}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                            {webinar.speakerName?.[0]}
                        </div>
                    )}
                    <div className="leading-tight">
                        <p className="text-sm font-medium text-slate-900">{webinar.speakerName}</p>
                        <p className="text-xs text-slate-500">
                            {[webinar.speakerDesignation, webinar.speakerCompany].filter(Boolean).join(", ")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {webinar.startDate && !isPast
                        ? `${new Date(webinar.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} IST · ${webinar.duration} Min`
                        : `${webinar.duration} Min`}
                </div>

                <span
                    className={`mt-auto block w-full rounded-md py-2 text-center text-sm font-semibold transition-colors ${isPast
                        ? "border border-slate-300 text-slate-700 group-hover:bg-slate-50"
                        : "bg-red-600 text-white group-hover:bg-red-700"
                        }`}
                >
                    {isPast ? "Watch Now" : "Register"}
                </span>
            </div>
        </>
    );

    if (!href) {
        return (
            <div className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white opacity-90">
                {cardBody}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-lg"
        >
            {cardBody}
        </Link>
    );
}

// ✅ FIX: apiBase now consistently comes from NEXT_PUBLIC_API_URL (same
// pattern as the admin pages and detail page).
const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function WebinarListingPage({ apiBase = DEFAULT_API_BASE }) {
    const [webinars, setWebinars] = useState(MOCK_WEBINARS);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [carouselIndex, setCarouselIndex] = useState(0);
    // ✅ FIX: the three hero buttons (Upcoming / On Demand / Register) had
    // no onClick at all before. Upcoming/On Demand now act as quick
    // filters on the grid below and scroll you to it; Register jumps to
    // the featured webinar's own page.
    const [quickFilter, setQuickFilter] = useState<"all" | "upcoming" | "on-demand">("all");
    const gridRef = useRef<HTMLDivElement>(null);
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    useEffect(() => {
        let cancelled = false;
        fetch(`${apiBase}/webinars`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((res) => {
                if (!cancelled && Array.isArray(res?.data) && res.data.length) {
                    setWebinars(res.data);
                }
            })
            .catch(() => {
                // Keep preview data if the API isn't reachable from this environment
            });
        return () => {
            cancelled = true;
        };
    }, [apiBase]);

    const featuredList = useMemo(
        () => webinars.filter((w) => w.featured),
        [webinars]
    );
    const featured = featuredList[carouselIndex % Math.max(featuredList.length, 1)] || webinars[0];

    // ✅ FIX: your backend tags every webinar with a single fixed category
    // row ("Webinars" — see getOrCreateWebinarCategory() in
    // Webinarcontroller.js), so the hardcoded CATEGORIES list below could
    // never match a real webinar's actual category name. Building the
    // dropdown from whatever category names are actually present in the
    // loaded data means the filter always has something real to match
    // against, whatever your backend ends up sending.
    const categoryOptions = useMemo(() => {
        const names = Array.from(
            new Set(webinars.map((w) => w.category?.name).filter(Boolean))
        );
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
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero */}
            <div className="relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(220,38,38,0.15),transparent_55%)]" />
                <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                        Tooling Trends
                    </p>
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Webinars</h1>
                    <p className="mt-2 text-lg font-medium text-slate-300">
                        Insights. Innovation. Industry.
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                        Join live and on-demand webinars by industry experts on the latest
                        trends in tooling, machining and smart manufacturing.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                setQuickFilter("upcoming");
                                scrollToGrid();
                            }}
                            className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${quickFilter === "upcoming"
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "border border-slate-600 text-slate-200 hover:border-slate-400"
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => {
                                setQuickFilter("on-demand");
                                scrollToGrid();
                            }}
                            className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${quickFilter === "on-demand"
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "border border-slate-600 text-slate-200 hover:border-slate-400"
                                }`}
                        >
                            On Demand
                        </button>
                        {featured?.slug ? (
                            <Link
                                href={`/Webinar/${featured.slug}`}
                                className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-400"
                            >
                                Register
                            </Link>
                        ) : (
                            <button
                                onClick={scrollToGrid}
                                className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-400"
                            >
                                Register
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
                    <div className="relative min-w-[220px] flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search webinars..."
                            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Featured live webinar */}
                {featured && (
                    <div className="relative mb-12 overflow-hidden rounded-xl bg-slate-900">
                        <div className="grid gap-0 sm:grid-cols-2">
                            <div className="relative aspect-video sm:aspect-auto">
                                <img
                                    src={featured.thumbnail}
                                    alt={featured.title}
                                    className="h-full w-full object-cover opacity-90"
                                />
                                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    LIVE
                                </span>
                            </div>
                            <div className="flex flex-col justify-center p-8">
                                {featured.startDate && (
                                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-400">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatFullDate(featured.startDate)} · {new Date(featured.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} IST
                                    </p>
                                )}
                                <h2 className="text-2xl font-bold leading-snug text-white">
                                    {featured.title}
                                </h2>
                                <div className="mt-4 flex items-center gap-3">
                                    {featured.speakerImage && (
                                        <img
                                            src={featured.speakerImage}
                                            alt={featured.speakerName}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-white">{featured.speakerName}</p>
                                        <p className="text-xs text-slate-400">
                                            {[featured.speakerDesignation, featured.speakerCompany].filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    {featured.slug ? (
                                        <>
                                            <Link
                                                href={`/Webinar/${featured.slug}`}
                                                className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                                            >
                                                Register Now
                                            </Link>
                                            <Link
                                                href={`/Webinar/${featured.slug}`}
                                                className="rounded-md border border-slate-500 px-5 py-2.5 text-sm font-semibold text-white hover:border-slate-300"
                                            >
                                                Learn More →
                                            </Link>
                                        </>
                                    ) : (
                                        <span className="text-xs text-slate-400">
                                            Preview data — no live link yet.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {featuredList.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCarouselIndex((i) => (i - 1 + featuredList.length) % featuredList.length)}
                                    aria-label="Previous featured webinar"
                                    className="absolute right-16 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setCarouselIndex((i) => (i + 1) % featuredList.length)}
                                    aria-label="Next featured webinar"
                                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Grid */}
                <div ref={gridRef} className="mb-6 flex items-center gap-3 scroll-mt-6">
                    <h2 className="text-xl font-bold text-slate-900">All Webinars</h2>
                    <span className="h-0.5 w-10 bg-red-600" />
                    {quickFilter !== "all" && (
                        <button
                            onClick={() => setQuickFilter("all")}
                            className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                        >
                            Showing: {quickFilter === "upcoming" ? "Upcoming" : "On Demand"} ✕
                        </button>
                    )}
                </div>

                {filtered.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500">
                        No webinars match your filters yet — try clearing search or category.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((w) => (
                            <WebinarCard key={w.id ?? w.slug} webinar={w} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}