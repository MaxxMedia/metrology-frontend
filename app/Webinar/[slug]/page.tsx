"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Calendar,
    Clock,
    Globe,
    Wrench,
    Video,
    MessageCircle,
    ShieldCheck,
    Users,
    FileText,
    Download,
    Linkedin,
    ChevronLeft,
    ChevronRight,
    Play,
    Check,
    Youtube,
    ExternalLink,
    Loader2,
} from "lucide-react";

const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface AgendaItem {
    time: string;
    title: string;
}

interface Resource {
    title: string;
    size?: string;
    url?: string;
}

interface Category {
    id?: number;
    name: string;
    slug?: string;
}

interface RawWebinar {
    id: number;
    slug: string;
    title: string;
    heroImage?: string;
    thumbnail?: string;
    shortDescription?: string;
    fullDescription?: string;
    startDate: string;
    endDate?: string;
    duration: number;
    language?: string;
    category?: Category;
    maxSeats?: number;
    registeredSeats?: number;
    certificateAvailable?: boolean;
    learningPoints?: string[];
    speakerName: string;
    speakerDesignation?: string;
    speakerCompany?: string;
    speakerImage?: string;
    speakerLinkedin?: string;
    agenda?: AgendaItem[];
    resources?: Resource[];
    youtubeUrl?: string | null;
    registrationUrl?: string | null;
    meetingUrl?: string | null;
    isOnDemand?: boolean;
}

interface Webinar {
    slug: string;
    title: string;
    heroImage: string;
    startDate: string;
    endDate?: string;
    duration: number;
    language: string;
    category?: Category;
    maxSeats?: number;
    registeredSeats?: number;
    certificateAvailable: boolean;
    fullDescription: string;
    learningPoints?: string[];
    speakerName: string;
    speakerDesignation?: string;
    speakerCompany?: string;
    speakerImage: string;
    speakerLinkedin?: string;
    agenda?: AgendaItem[];
    resources?: Resource[];
    youtubeUrl?: string | null;
    registrationUrl?: string | null;
    meetingUrl?: string | null;
    isOnDemand?: boolean;
}

interface RelatedWebinar {
    slug?: string;
    title: string;
    meta?: string;
    image?: string;
    thumbnail?: string;
}

interface InfoStatProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number | boolean;
}

interface WebinarDetailPageProps {
    slug?: string;
    apiBase?: string;
}

function toWebinar(raw: RawWebinar): Webinar {
    return {
        slug: raw.slug,
        title: raw.title,
        heroImage: raw.heroImage || raw.thumbnail || "",
        startDate: raw.startDate,
        endDate: raw.endDate,
        duration: raw.duration,
        language: raw.language || "English",
        category: raw.category,
        maxSeats: raw.maxSeats,
        registeredSeats: raw.registeredSeats,
        certificateAvailable: !!raw.certificateAvailable,
        fullDescription: raw.fullDescription?.trim() || raw.shortDescription?.trim() || "",
        learningPoints: raw.learningPoints,
        speakerName: raw.speakerName,
        speakerDesignation: raw.speakerDesignation,
        speakerCompany: raw.speakerCompany,
        speakerImage: raw.speakerImage || "",
        speakerLinkedin: raw.speakerLinkedin,
        agenda: raw.agenda,
        resources: raw.resources,
        youtubeUrl: raw.youtubeUrl,
        registrationUrl: raw.registrationUrl,
        meetingUrl: raw.meetingUrl,
        isOnDemand: raw.isOnDemand,
    };
}

function buildGoogleCalendarUrl(webinar: Webinar): string {
    const start = new Date(webinar.startDate);
    const end = webinar.endDate
        ? new Date(webinar.endDate)
        : new Date(start.getTime() + (webinar.duration || 60) * 60000);

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: webinar.title,
        dates: `${fmt(start)}/${fmt(end)}`,
        details: webinar.fullDescription?.slice(0, 500) || "Join us for this webinar.",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getYouTubeEmbedUrl(url?: string | null): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        let videoId = "";

        if (u.hostname.includes("youtu.be")) {
            videoId = u.pathname.slice(1);
        } else if (u.hostname.includes("youtube.com")) {
            if (u.pathname === "/watch") {
                videoId = u.searchParams.get("v") || "";
            } else if (u.pathname.startsWith("/embed/")) {
                videoId = u.pathname.split("/embed/")[1];
            }
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
        return null;
    }
}

function InfoStat({ icon: Icon, label, value }: InfoStatProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <Icon className="h-5 w-5 shrink-0 text-red-600" />
            <div className="leading-tight">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{String(value)}</p>
            </div>
        </div>
    );
}

export default function WebinarDetailPage({ slug: slugProp, apiBase = DEFAULT_API_BASE }: WebinarDetailPageProps) {
    const params = useParams();
    const rawParamSlug = params?.slug;
    const paramSlug = Array.isArray(rawParamSlug) ? rawParamSlug[0] : rawParamSlug;
    const slug = slugProp ?? paramSlug;

    const [webinar, setWebinar] = useState<Webinar | null>(null);
    const [related, setRelated] = useState<RelatedWebinar[]>([]);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            setNotFound(true);
            return;
        }

        let cancelled = false;
        setNotFound(false);
        setError("");
        setLoading(true);
        setWebinar(null);

        const detailUrl = `${apiBase}/webinars/${encodeURIComponent(slug)}`;

        fetch(detailUrl, { cache: "no-store" })
            .then(async (r) => {
                if (!r.ok) {
                    if (r.status === 404) return Promise.reject({ status: 404 });
                    const text = await r.text().catch(() => "");
                    console.error(`[WebinarDetailPage] GET ${detailUrl} -> ${r.status}: ${text}`);
                    return Promise.reject(new Error("Failed to load webinar"));
                }
                return r.json();
            })
            .then((raw: RawWebinar) => {
                if (!cancelled) setWebinar(toWebinar(raw));
            })
            .catch((err) => {
                if (cancelled) return;
                if (err?.status === 404) {
                    setNotFound(true);
                } else {
                    setError("Could not load this webinar. Please try again later.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        fetch(`${apiBase}/webinars/${encodeURIComponent(slug)}/related`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((list: RelatedWebinar[]) => {
                if (!cancelled && Array.isArray(list)) setRelated(list);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [slug, apiBase]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading webinar…
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center font-sans">
                <h1 className="text-xl font-bold text-slate-900">Webinar not available</h1>
                <p className="max-w-md text-sm text-slate-500">
                    This webinar either doesn&apos;t exist, or hasn&apos;t been published yet.
                </p>
                <Link
                    href="/Webinar"
                    className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                    Back to Webinars
                </Link>
            </div>
        );
    }

    if (error || !webinar) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center font-sans">
                <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
                <p className="max-w-md text-sm text-slate-500">{error || "Unable to load webinar details."}</p>
                <Link
                    href="/Webinar"
                    className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                    Back to Webinars
                </Link>
            </div>
        );
    }

    const watchUrl = webinar.youtubeUrl || webinar.meetingUrl || webinar.registrationUrl || null;
    const watchLabel = webinar.youtubeUrl
        ? "Watch on YouTube"
        : webinar.meetingUrl
            ? "Join Meeting"
            : "View Details";

    const isPast =
        webinar.isOnDemand ||
        (webinar.startDate ? new Date(webinar.startDate).getTime() < Date.now() : false);
    const embedUrl = getYouTubeEmbedUrl(webinar.youtubeUrl);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-3 text-xs text-slate-500">
                    <Link href="/" className="hover:text-slate-700">
                        Home
                    </Link>
                    <span className="mx-1.5">›</span>
                    <Link href="/Webinar" className="hover:text-slate-700">
                        Webinars
                    </Link>
                    <span className="mx-1.5">›</span>
                    <span className="text-slate-800">{webinar.title}</span>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
                        {isPast && embedUrl ? (
                            <iframe
                                src={embedUrl}
                                title={webinar.title}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <>
                                {webinar.heroImage ? (
                                    <img
                                        src={webinar.heroImage}
                                        alt={webinar.title}
                                        className="h-full w-full object-cover opacity-90"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500">
                                        <Video className="h-12 w-12 opacity-40" />
                                    </div>
                                )}
                                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    {isPast ? "RECORDED WEBINAR" : "LIVE WEBINAR"}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
                            {webinar.title}
                        </h1>

                        <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                            {webinar.startDate && (
                                <li className="flex items-center gap-2.5">
                                    <Calendar className="h-4 w-4 text-red-600" />
                                    {new Date(webinar.startDate).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        weekday: "long",
                                    })}
                                </li>
                            )}
                            {webinar.startDate && (
                                <li className="flex items-center gap-2.5">
                                    <Clock className="h-4 w-4 text-red-600" />
                                    {new Date(webinar.startDate).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </li>
                            )}
                            <li className="flex items-center gap-2.5">
                                <Video className="h-4 w-4 text-red-600" />
                                {webinar.duration} Minutes
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Globe className="h-4 w-4 text-red-600" />
                                {webinar.language}
                            </li>
                            {webinar.category?.name && (
                                <li className="flex items-center gap-2.5">
                                    <Wrench className="h-4 w-4 text-red-600" />
                                    {webinar.category.name}
                                </li>
                            )}
                        </ul>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {!isPast && (
                                <a
                                    href={buildGoogleCalendarUrl(webinar)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Add to Calendar
                                </a>
                            )}
                            {watchUrl && (
                                <a
                                    href={watchUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-md border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
                                >
                                    {webinar.youtubeUrl ? (
                                        <Youtube className="h-4 w-4" />
                                    ) : (
                                        <ExternalLink className="h-4 w-4" />
                                    )}
                                    {watchLabel}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                    <InfoStat icon={Video} label="Live Session" value="Yes" />
                    <InfoStat icon={MessageCircle} label="Q&A" value="Included" />
                    <InfoStat
                        icon={ShieldCheck}
                        label="Certificate"
                        value={webinar.certificateAvailable ? "Yes" : "No"}
                    />
                    <InfoStat icon={Users} label="Seats" value={webinar.maxSeats || "Open"} />
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px_280px]">
                    <div>
                        <h2 className="mb-3 text-lg font-bold text-slate-900">About the Webinar</h2>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                            {webinar.fullDescription || "Details will be shared soon."}
                        </p>

                        {webinar.learningPoints && webinar.learningPoints.length > 0 && (
                            <>
                                <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">What You&apos;ll Learn</h2>
                                <ul className="space-y-2.5">
                                    {webinar.learningPoints.map((point, i) => (
                                        <li key={`learning-${i}-${point}`} className="flex items-start gap-2.5 text-sm text-slate-600">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-sm bg-red-100 p-0.5 text-red-600" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    <div className="h-fit rounded-lg border border-slate-200 bg-white p-5">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Speaker</h3>
                        <div className="flex flex-col items-center text-center">
                            {webinar.speakerImage ? (
                                <img
                                    src={webinar.speakerImage}
                                    alt={webinar.speakerName}
                                    className="h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-semibold text-slate-600">
                                    {webinar.speakerName?.[0] || "?"}
                                </div>
                            )}
                            <p className="mt-3 text-sm font-bold text-slate-900">{webinar.speakerName}</p>
                            {webinar.speakerDesignation && (
                                <p className="text-xs text-slate-500">{webinar.speakerDesignation}</p>
                            )}
                            {webinar.speakerCompany && (
                                <p className="text-xs text-slate-500">{webinar.speakerCompany}</p>
                            )}
                            {webinar.speakerLinkedin && (
                                <a
                                    href={webinar.speakerLinkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 flex h-7 w-7 items-center justify-center rounded bg-[#0a66c2] text-white"
                                    aria-label={`${webinar.speakerName} on LinkedIn`}
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {webinar.agenda && webinar.agenda.length > 0 && (
                        <div className="h-fit rounded-lg border border-slate-200 bg-white p-5">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Agenda</h3>
                            <ol className="space-y-4 border-l-2 border-slate-100 pl-4">
                                {webinar.agenda.map((item, i) => (
                                    <li key={`${item.time}-${item.title}-${i}`} className="relative">
                                        <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
                                        <p className="text-xs font-bold text-red-600">{item.time}</p>
                                        <p className="text-sm text-slate-700">{item.title}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>

                {webinar.resources && webinar.resources.length > 0 && (
                    <div className="mt-10">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Resources</h2>
                        <div className="space-y-2">
                            {webinar.resources.map((res, i) => (
                                <a
                                    key={`resource-${i}-${res.title}`}
                                    href={res.url || "#"}
                                    target={res.url ? "_blank" : undefined}
                                    rel={res.url ? "noreferrer" : undefined}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-red-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{res.title}</p>
                                            {res.size && <p className="text-xs text-slate-400">{res.size}</p>}
                                        </div>
                                    </div>
                                    <Download className="h-4 w-4 text-slate-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {related.length > 0 && (
                    <div className="mt-12">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">More Webinars You Might Like</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    aria-label="Scroll related webinars left"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:border-slate-400"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Scroll related webinars right"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:border-slate-400"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {related.map((item, i) => {
                                const card = (
                                    <>
                                        <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
                                            {item.thumbnail || item.image ? (
                                                <img
                                                    src={item.thumbnail || item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover opacity-90 transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-800">
                                                    <Video className="h-8 w-8 text-slate-500 opacity-40" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Play className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                        <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-800">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-slate-400">{item.meta || "Webinar"}</p>
                                    </>
                                );

                                return item.slug ? (
                                    <Link key={item.slug} href={`/Webinar/${item.slug}`} className="group cursor-pointer">
                                        {card}
                                    </Link>
                                ) : (
                                    <div key={`${item.title}-${i}`} className="group">
                                        {card}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
