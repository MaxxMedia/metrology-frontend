"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Calendar,
    Clock,
    Globe,
    Wrench,
    BarChart3,
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
} from "lucide-react";

const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ---------- Types ----------
// This matches the CONFIRMED real response from GET /api/webinars/:slug —
// a bare object, not wrapped in { data: [...] }. Verified via curl:
//   { "id":130, "title":"...", "slug":"...", "shortDescription":"...", ... }

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
    status?: string;
    views?: number;
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

const MOCK_WEBINAR: Webinar = {
    slug: "ai-in-smart-manufacturing-the-next-revolution",
    title: "AI in Smart Manufacturing The Next Revolution",
    heroImage:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
    startDate: "2026-08-22T15:00:00",
    duration: 60,
    language: "English",
    category: { name: "Machine Tools, Automation" },
    maxSeats: 1000,
    registeredSeats: 850,
    certificateAvailable: true,
    fullDescription:
        "Artificial Intelligence is transforming the manufacturing industry. From predictive maintenance to process optimization, AI is driving efficiency, quality and innovation.",
    learningPoints: [
        "AI technologies in manufacturing",
        "Predictive maintenance using AI",
        "Real-time process optimization",
    ],
    speakerName: "John Smith",
    speakerDesignation: "Manufacturing Director",
    speakerCompany: "Siemens",
    speakerImage: "https://i.pravatar.cc/160?img=12",
    speakerLinkedin: "https://linkedin.com",
    agenda: [
        { time: "03:00 PM – 03:10 PM", title: "Welcome & Introduction" },
        { time: "03:10 PM – 03:25 PM", title: "AI in Manufacturing — An Overview" },
    ],
};

// ---------- Helpers ----------

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
        // fullDescription is sometimes empty; shortDescription is reliably
        // populated on your data, so fall back to it.
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
    };
}

// Google Calendar "add event" link built from the webinar's real schedule.
// This is the only calendar/registration action on the page — there's no
// live registration flow, so we don't fake one.
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

// Converts a normal YouTube watch/share URL into an embeddable iframe URL.
// Returns null if the URL isn't a recognizable YouTube link.
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
    // Read the slug directly from the actual URL via useParams(), instead
    // of relying only on whatever the parent page.tsx passes down as a
    // prop. slugProp still wins if explicitly passed in.
    const params = useParams();
    const rawParamSlug = params?.slug;
    const paramSlug = Array.isArray(rawParamSlug) ? rawParamSlug[0] : rawParamSlug;
    const slug = slugProp ?? paramSlug;

    const [webinar, setWebinar] = useState<Webinar>(MOCK_WEBINAR);
    const [related, setRelated] = useState<RelatedWebinar[]>([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            setNotFound(true);
            return;
        }

        let cancelled = false;
        setNotFound(false);
        setLoading(true);

        const detailUrl = `${apiBase}/webinars/${encodeURIComponent(slug)}`;

        fetch(detailUrl, { cache: "no-store" })
            .then(async (r) => {
                if (!r.ok) {
                    const text = await r.text().catch(() => "");
                    console.error(`[WebinarDetailPage] GET ${detailUrl} -> ${r.status}: ${text}`);
                    return Promise.reject(r);
                }
                return r.json();
            })
            .then((raw: RawWebinar) => {
                if (cancelled) return;
                setWebinar(toWebinar(raw));
            })
            .catch((r) => {
                // A 404 here almost always means the webinar exists but hasn't
                // been Approved + Published yet — the public API only ever
                // returns APPROVED webinars with a publishedAt timestamp set.
                if (!cancelled && r?.status === 404) setNotFound(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        fetch(`${apiBase}/webinars/${encodeURIComponent(slug)}/related`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((list: RelatedWebinar[]) => {
                if (!cancelled && Array.isArray(list)) setRelated(list);
            })
            .catch(() => { });

        return () => {
            cancelled = true;
        };
    }, [slug, apiBase]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
                <p className="text-sm text-slate-400">Loading webinar…</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center font-sans">
                <h1 className="text-xl font-bold text-slate-900">Webinar not available</h1>
                <p className="max-w-md text-sm text-slate-500">
                    This webinar either doesn't exist, or hasn't been approved and
                    published yet.
                </p>
            </div>
        );
    }

    const watchUrl = webinar.youtubeUrl || webinar.meetingUrl || webinar.registrationUrl || null;
    const watchLabel = webinar.youtubeUrl
        ? "Watch on YouTube"
        : webinar.meetingUrl
            ? "Join Meeting"
            : "View Details";

    const isPast = webinar.startDate ? new Date(webinar.startDate).getTime() < Date.now() : false;
    const embedUrl = getYouTubeEmbedUrl(webinar.youtubeUrl);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-3 text-xs text-slate-500">
                    Home <span className="mx-1.5">›</span> Webinars <span className="mx-1.5">›</span>
                    <span className="text-slate-800">{webinar.title}</span>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Hero + info panel */}
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
                                {webinar.heroImage && (
                                    <img
                                        src={webinar.heroImage}
                                        alt={webinar.title}
                                        className="h-full w-full object-cover opacity-90"
                                    />
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

                        {/* Only action left on this page. No fake "Register Now". */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {!isPast && (
<a
                                href = { buildGoogleCalendarUrl(webinar) }
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
                            href = { watchUrl }
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

                {/* Info strip */ }
    <div className="mt-8 grid grid-cols-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <InfoStat icon={Video} label="Live Session" value="Yes" />
        <InfoStat icon={MessageCircle} label="Q&A" value="Included" />
        <InfoStat
            icon={ShieldCheck}
            label="Certificate"
            value={webinar.certificateAvailable ? "Yes" : "No"}
        />
        <InfoStat
            icon={Users}
            label="Seats"
            value={webinar.maxSeats || "Open"}
        />
    </div>

    {/* Main content grid */ }
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px_280px]">
        <div>
            <h2 className="mb-3 text-lg font-bold text-slate-900">About the Webinar</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {webinar.fullDescription}
            </p>

            {webinar.learningPoints && webinar.learningPoints.length > 0 && (
                <>
                    <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">What You'll Learn</h2>
                    <ul className="space-y-2.5">
                        {webinar.learningPoints.map((point: string) => (
                            <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-sm bg-red-100 p-0.5 text-red-600" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>

        {/* Speaker */}
        <div className="h-fit rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Speaker</h3>
            <div className="flex flex-col items-center text-center">
                {webinar.speakerImage && (
                    <img
                        src={webinar.speakerImage}
                        alt={webinar.speakerName}
                        className="h-20 w-20 rounded-full object-cover"
                    />
                )}
                <p className="mt-3 text-sm font-bold text-slate-900">{webinar.speakerName}</p>
                <p className="text-xs text-slate-500">{webinar.speakerDesignation}</p>
                <p className="text-xs text-slate-500">{webinar.speakerCompany}</p>
                {webinar.speakerLinkedin && (
<a
                    href = { webinar.speakerLinkedin }
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

    {/* Agenda */ }
    {
        webinar.agenda && webinar.agenda.length > 0 && (
            <div className="h-fit rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Agenda</h3>
                <ol className="space-y-4 border-l-2 border-slate-100 pl-4">
                    {webinar.agenda.map((item: AgendaItem, i: number) => (
                        <li key={i} className="relative">
                            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
                            <p className="text-xs font-bold text-red-600">{item.time}</p>
                            <p className="text-sm text-slate-700">{item.title}</p>
                        </li>
                    ))}
                </ol>
            </div>
        )
    }
                </div >

        {/* Resources */ }
    {
        webinar.resources && webinar.resources.length > 0 && (
            <div className="mt-10">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Resources</h2>
                <div className="space-y-2">
                    {webinar.resources.map((res: Resource) => (
<a
                        key = { res.title }
                                    href = { res.url || "#" }
                                    target = { res.url ? "_blank" : undefined }
                                    rel = { res.url ? "noreferrer" : undefined }
                                    className = "flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
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
                    </div >
                )
    }

    {/* Related */ }
    {
        related.length > 0 && (
            <div className="mt-12">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">More Webinars You Might Like</h2>
                    <div className="flex gap-2">
                        <button
                            aria-label="Scroll related webinars left"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:border-slate-400"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            aria-label="Scroll related webinars right"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:border-slate-400"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {related.map((item: RelatedWebinar, i: number) => {
                        const card = (
                            <>
                                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
                                    <img
                                        src={item.thumbnail || item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover opacity-90 transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Play className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-800">
                                    {item.title}
                                </p>
                                <p className="text-xs text-slate-400">{item.meta || "On Demand · 60 Min"}</p>
                            </>
                        );
                        return item.slug ? (
                            <a key={i} href={`/Webinar/${item.slug}`} className="group cursor-pointer">
                                {card}
                            </a>
                        ) : (
                            <div key={i} className="group">
                                {card}
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
            </div >
        </div >
    );
}