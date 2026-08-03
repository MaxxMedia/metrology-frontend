"use client";
import { useEffect, useState, useCallback } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    Upload,
    FileEdit,
    Star,
    PlayCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import React from "react";
import AdminWebinarForm from "@/components/Adminwebinarform";

// ✅ FIX: apiBase was defaulting to "/api" — a relative path that resolves
// against the Next.js app itself (localhost:3000), which has no such
// route and 404s. Every other fetch in this codebase (see Header.tsx)
// builds the full URL from NEXT_PUBLIC_API_URL, so this does the same.
const DEFAULT_API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ✅ FIX: this page was calling fetch() with no Authorization header at all,
// so every request to the admin API came back 401. Adminwebinarform.tsx
// already had this helper — it reads the same "token" key Header.tsx
// writes/clears on login/logout. Reuse it for every fetch below.
function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

// Type definitions
interface Webinar {
    id: string;
    title: string;
    slug: string;
    speakerName: string;
    startDate: string | null;
    status: string;
    featured: boolean;
    isOnDemand: boolean;
}

interface Stats {
    total?: number;
    DRAFT?: number;
    PENDING?: number;
    APPROVED?: number;
    PUBLISHED?: number;
    REJECTED?: number;
    ARCHIVED?: number;
    [key: string]: number | undefined;
}

interface Pagination {
    total: number;
    totalPages: number;
}

interface AdminWebinarListPageProps {
    apiBase?: string;
}

interface StatusBadgeProps {
    status: string;
}

interface IconButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    tone?: "default" | "green" | "red" | "amber" | "blue";
    disabled?: boolean;
}

const TABS = [
    { key: "", label: "All" },
    { key: "DRAFT", label: "Draft" },
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "PUBLISHED", label: "Published" },
    { key: "REJECTED", label: "Rejected" },
    { key: "ARCHIVED", label: "Archived" },
];

const STATUS_STYLES: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600",
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-blue-100 text-blue-700",
    PUBLISHED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-slate-100 text-slate-500",
};

function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>
            {status}
        </span>
    );
}

function IconButton({ icon: Icon, label, onClick, tone = "default", disabled }: IconButtonProps) {
    const tones: Record<string, string> = {
        default: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
        green: "text-slate-500 hover:bg-green-50 hover:text-green-700",
        red: "text-slate-500 hover:bg-red-50 hover:text-red-700",
        amber: "text-slate-500 hover:bg-amber-50 hover:text-amber-700",
        blue: "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
    };
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-40 ${tones[tone] || tones.default}`}
        >
            {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
        </button>
    );
}

export default function AdminWebinarListPage({
    apiBase = DEFAULT_API_BASE,
}: AdminWebinarListPageProps) {
    // View state
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingId, setEditingId] = useState<string | null>(null);

    // List state
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [stats, setStats] = useState<Stats>({});
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const loadStats = useCallback(() => {
        fetch(`${apiBase}/admin/webinars/stats`, { headers: authHeaders() })
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data: Stats) => setStats(data))
            .catch((r) => {
                if (r?.status === 401) setError("You're not authorized to view this. Please log in again.");
            });
    }, [apiBase]);

    const loadWebinars = useCallback(() => {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "10");
        if (status) params.set("status", status);
        if (search) params.set("search", search);

        fetch(`${apiBase}/admin/webinars?${params.toString()}`, { headers: authHeaders() })
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((res: { data: Webinar[]; pagination: Pagination }) => {
                setWebinars(res.data || []);
                setPagination(res.pagination || { total: 0, totalPages: 1 });
            })
            .catch((r) => {
                setError(
                    r?.status === 401
                        ? "You're not authorized to view this. Please log in again."
                        : "Could not load webinars. Check your connection and try again."
                );
            })
            .finally(() => setLoading(false));
    }, [apiBase, status, search, page]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        loadWebinars();
    }, [loadWebinars]);

    const runAction = async (id: string, path: string, method: string = "PUT", body?: any) => {
        setBusyId(id);
        try {
            const res = await fetch(`${apiBase}/admin/webinars/${id}${path}`, {
                method,
                headers: authHeaders(body ? { "Content-Type": "application/json" } : undefined),
                body: body ? JSON.stringify(body) : undefined,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || (res.status === 401 ? "You're not authorized to do this." : "Action failed"));
            loadWebinars();
            loadStats();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setBusyId(null);
            setRejectingId(null);
            setRejectReason("");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
        setBusyId(id);
        try {
            const res = await fetch(`${apiBase}/admin/webinars/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || (res.status === 401 ? "You're not authorized to do this." : "Delete failed"));
            loadWebinars();
            loadStats();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Could not delete webinar.");
        } finally {
            setBusyId(null);
        }
    };

    const submitReject = (id: string) => {
        if (!rejectReason.trim()) return;
        runAction(id, "/reject", "PUT", { reason: rejectReason.trim() });
    };

    // Handle form actions
    const handleCreateNew = () => {
        setView("create");
        setEditingId(null);
    };

    const handleEdit = (id: string) => {
        setView("edit");
        setEditingId(id);
    };

    const handleFormSaved = () => {
        setView("list");
        setEditingId(null);
        loadWebinars(); // Refresh the list
        loadStats(); // Refresh stats
    };

    const handleCancel = () => {
        setView("list");
        setEditingId(null);
    };

    // Render form view
    if (view === "create" || view === "edit") {
        return (
            <div className="mx-auto max-w-4xl bg-white px-6 py-8 font-sans">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            {view === "create" ? "Create New Webinar" : "Edit Webinar"}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {view === "create"
                                ? "Fill in the details to create a new webinar."
                                : "Update the webinar details below."}
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to List
                    </button>
                </div>
                <AdminWebinarForm
                    webinarId={view === "edit" ? editingId : null}
                    apiBase={apiBase}
                    onSaved={handleFormSaved}
                />
            </div>
        );
    }

    // Render list view
    return (
        <div className="mx-auto max-w-6xl bg-white px-6 py-8 font-sans">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Webinars</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {pagination.total} total · manage creation, approval and publishing.
                    </p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                    <Plus className="h-4 w-4" /> Create Webinar
                </button>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setStatus(tab.key);
                            setPage(1);
                        }}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${status === tab.key
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        {tab.label}
                        <span
                            className={`rounded-full px-1.5 text-xs ${status === tab.key ? "bg-white/20" : "bg-slate-200 text-slate-500"
                                }`}
                        >
                            {tab.key ? (stats[tab.key] ?? 0) : (stats.total ?? 0)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-5 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search by title or speaker…"
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
            </div>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Webinar</th>
                            <th className="px-4 py-3 font-medium">Speaker</th>
                            <th className="px-4 py-3 font-medium">Start Date</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Flags</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                                    Loading webinars…
                                </td>
                            </tr>
                        ) : webinars.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                                    No webinars here yet — create one to get started.
                                </td>
                            </tr>
                        ) : (
                            webinars.map((w) => (
                                <React.Fragment key={w.id}>
                                    <tr className="align-top hover:bg-slate-50">
                                        <td className="max-w-xs px-4 py-3">
                                            <p className="font-medium text-slate-900 line-clamp-1">{w.title}</p>
                                            <p className="text-xs text-slate-400">/{w.slug}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{w.speakerName}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {w.startDate
                                                ? new Date(w.startDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={w.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {w.featured && (
                                                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700">
                                                        Featured
                                                    </span>
                                                )}
                                                {w.isOnDemand && (
                                                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                                                        On Demand
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton
                                                    icon={Pencil}
                                                    label="Edit"
                                                    onClick={() => handleEdit(w.id)}
                                                />

                                                {w.status === "PENDING" || w.status === "DRAFT" ? (
                                                    <IconButton
                                                        icon={Check}
                                                        label="Approve"
                                                        tone="green"
                                                        disabled={busyId === w.id}
                                                        onClick={() => runAction(w.id, "/approve")}
                                                    />
                                                ) : null}

                                                {w.status !== "REJECTED" && w.status !== "PUBLISHED" && (
                                                    <IconButton
                                                        icon={X}
                                                        label="Reject"
                                                        tone="red"
                                                        disabled={busyId === w.id}
                                                        onClick={() => setRejectingId(rejectingId === w.id ? null : w.id)}
                                                    />
                                                )}

                                                {w.status === "APPROVED" && (
                                                    <IconButton
                                                        icon={Upload}
                                                        label="Publish"
                                                        tone="blue"
                                                        disabled={busyId === w.id}
                                                        onClick={() => runAction(w.id, "/publish")}
                                                    />
                                                )}

                                                {w.status === "PUBLISHED" && (
                                                    <IconButton
                                                        icon={FileEdit}
                                                        label="Move to Draft"
                                                        disabled={busyId === w.id}
                                                        onClick={() => runAction(w.id, "/draft")}
                                                    />
                                                )}

                                                <IconButton
                                                    icon={Star}
                                                    label={w.featured ? "Unfeature" : "Feature"}
                                                    tone="amber"
                                                    disabled={busyId === w.id}
                                                    onClick={() => runAction(w.id, "/feature")}
                                                />

                                                <IconButton
                                                    icon={PlayCircle}
                                                    label={w.isOnDemand ? "Remove On Demand" : "Mark On Demand"}
                                                    tone="blue"
                                                    disabled={busyId === w.id}
                                                    onClick={() => runAction(w.id, "/on-demand")}
                                                />

                                                <IconButton
                                                    icon={Trash2}
                                                    label="Delete"
                                                    tone="red"
                                                    disabled={busyId === w.id}
                                                    onClick={() => handleDelete(w.id, w.title)}
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    {rejectingId === w.id && (
                                        <tr className="bg-red-50">
                                            <td colSpan={6} className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        autoFocus
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        placeholder="Reason for rejection…"
                                                        className="flex-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm focus:border-red-400 focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => submitReject(w.id)}
                                                        disabled={!rejectReason.trim() || busyId === w.id}
                                                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        Confirm Reject
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setRejectingId(null);
                                                            setRejectReason("");
                                                        }}
                                                        className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                    <p>
                        Page {page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={page === pagination.totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}