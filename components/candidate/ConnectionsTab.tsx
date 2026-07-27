"use client";

import { useEffect, useState, useCallback } from "react";
import {
    getConnections,
    getReceivedRequests,
    getSentRequests,
    getSuggestions,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeConnection,
    sendRequest,
} from "@/services/connection.service";
import {
    Users,
    UserPlus,
    UserCheck,
    UserX,
    Clock,
    MapPin,
    Inbox,
    Send,
    Sparkles,
} from "lucide-react";

/* ================= TYPES ================= */

interface ConnectionUser {
    id: number;
    fullName?: string;
    profileImage?: string;
    headline?: string;
    location?: string;
    username?: string;
    email?: string;
}

interface ReceivedRequest {
    id: number;
    senderId: number;
    receiverId: number;
    message?: string;
    status: string;
    createdAt: string;
    sender: ConnectionUser;
}

interface SentRequest {
    id: number;
    senderId: number;
    receiverId: number;
    message?: string;
    status: string;
    createdAt: string;
    receiver: ConnectionUser;
}

type ActionKey = string; // e.g. "remove-12", "accept-4"

/* ================= HELPERS ================= */

function Avatar({ name, src, size = 48 }: { name?: string; src?: string; size?: number }) {
    const initials =
        (name || "?")
            .split(" ")
            .map((p) => p[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase() || "?";

    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={name || "User"}
                style={{ width: size, height: size }}
                className="rounded-full object-cover flex-shrink-0 border border-[#e0e0e0]"
            />
        );
    }

    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[#0F5B78]/10 text-[#0F5B78] flex items-center justify-center font-bold flex-shrink-0 border border-[#e0e0e0]"
        >
            {initials}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-[#e0e0e0] p-4 flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
        </div>
    );
}

function SkeletonGrid({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="bg-white rounded-xl border border-dashed border-[#e0e0e0] py-10 text-center">
            <div className="w-12 h-12 bg-[#0F5B78]/10 text-[#0F5B78] rounded-full flex items-center justify-center mx-auto mb-3">
                {icon}
            </div>
            <p className="text-sm text-[#5A5F69]">{text}</p>
        </div>
    );
}

function SectionHeader({
    icon,
    title,
    count,
}: {
    icon: React.ReactNode;
    title: string;
    count?: number;
}) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="text-[#0F5B78]">{icon}</div>
            <h3 className="text-base font-bold text-[#000000]">{title}</h3>
            {typeof count === "number" && (
                <span className="text-xs font-semibold bg-[#0F5B78]/10 text-[#0F5B78] px-2 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </div>
    );
}

/* ================= MAIN COMPONENT ================= */

export default function ConnectionsTab() {
    const [connections, setConnections] = useState<ConnectionUser[]>([]);
    const [received, setReceived] = useState<ReceivedRequest[]>([]);
    const [sent, setSent] = useState<SentRequest[]>([]);
    const [suggestions, setSuggestions] = useState<ConnectionUser[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<ActionKey | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchAll = useCallback(async (showSpinner = true) => {
        if (showSpinner) setLoading(true);
        setError(null);
        try {
            const [connRes, recvRes, sentRes, suggRes] = await Promise.all([
                getConnections(),
                getReceivedRequests(),
                getSentRequests(),
                getSuggestions(),
            ]);

            setConnections(connRes?.data?.data ?? []);
            setReceived(recvRes?.data?.data ?? []);
            setSent(sentRes?.data?.data ?? []);
            setSuggestions(suggRes?.data?.data ?? []);
        } catch (err) {
            console.error("Failed to load connections data", err);
            setError("Couldn't load your network right now. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const runAction = async (key: ActionKey, fn: () => Promise<any>) => {
        setActionLoading(key);
        setActionError(null);
        try {
            await fn();
            await fetchAll(false); // refresh without full-page spinner
        } catch (err: any) {
            console.error(`Action "${key}" failed`, err);
            setActionError(
                err?.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleAccept = (requestId: number) =>
        runAction(`accept-${requestId}`, () => acceptRequest(requestId));

    const handleReject = (requestId: number) =>
        runAction(`reject-${requestId}`, () => rejectRequest(requestId));

    const handleCancel = (requestId: number) =>
        runAction(`cancel-${requestId}`, () => cancelRequest(requestId));

    const handleRemove = (userId: number) =>
        runAction(`remove-${userId}`, () => removeConnection(userId));

    const handleConnect = (userId: number) =>
        runAction(`connect-${userId}`, () => sendRequest(userId));

    /* ================= LOADING (INITIAL) ================= */

    if (loading) {
        return (
            <div className="space-y-8">
                {["My Connections", "Pending Received Requests", "Pending Sent Requests", "People You May Know"].map(
                    (label) => (
                        <div key={label}>
                            <div className="h-5 w-48 bg-gray-200 rounded mb-3 animate-pulse" />
                            <SkeletonGrid count={3} />
                        </div>
                    )
                )}
            </div>
        );
    }

    /* ================= ERROR (INITIAL LOAD FAILED) ================= */

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-[#e0e0e0] p-10 text-center">
                <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
                <button
                    onClick={() => fetchAll()}
                    className="text-sm font-semibold text-[#0F5B78] hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {actionError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                    {actionError}
                </div>
            )}

            {/* ============ A. MY CONNECTIONS ============ */}
            <section>
                <SectionHeader icon={<Users size={18} />} title="My Connections" count={connections.length} />
                {connections.length === 0 ? (
                    <EmptyState icon={<Users size={22} />} text="You don't have any connections yet." />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {connections.map((user) => {
                            const key = `remove-${user.id}`;
                            return (
                                <div
                                    key={user.id}
                                    className="bg-white rounded-xl border border-[#e0e0e0] p-4 flex flex-col gap-3 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={user.fullName} src={user.profileImage} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#000000] truncate">
                                                {user.fullName || user.username || "Unknown"}
                                            </p>
                                            {user.headline && (
                                                <p className="text-xs text-[#5A5F69] truncate">{user.headline}</p>
                                            )}
                                            {user.location && (
                                                <p className="text-xs text-[#8A8F99] flex items-center gap-1 mt-0.5 truncate">
                                                    <MapPin size={11} />
                                                    {user.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(user.id)}
                                        disabled={actionLoading === key}
                                        className="text-xs font-semibold border border-[#e0e0e0] text-[#5A5F69] hover:text-red-600 hover:border-red-300 rounded-full py-1.5 transition-colors disabled:opacity-60"
                                    >
                                        {actionLoading === key ? "Removing..." : "Remove Connection"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ============ B. PENDING RECEIVED REQUESTS ============ */}
            <section>
                <SectionHeader icon={<Inbox size={18} />} title="Pending Received Requests" count={received.length} />
                {received.length === 0 ? (
                    <EmptyState icon={<Inbox size={22} />} text="No pending requests received." />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {received.map((req) => {
                            const acceptKey = `accept-${req.id}`;
                            const rejectKey = `reject-${req.id}`;
                            const busy = actionLoading === acceptKey || actionLoading === rejectKey;
                            return (
                                <div
                                    key={req.id}
                                    className="bg-white rounded-xl border border-[#e0e0e0] p-4 flex flex-col gap-3 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={req.sender?.fullName} src={req.sender?.profileImage} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#000000] truncate">
                                                {req.sender?.fullName || req.sender?.username || "Unknown"}
                                            </p>
                                            {req.sender?.headline && (
                                                <p className="text-xs text-[#5A5F69] truncate">{req.sender.headline}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAccept(req.id)}
                                            disabled={busy}
                                            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold bg-[#0F5B78] hover:bg-[#0b445a] text-white rounded-full py-1.5 transition-colors disabled:opacity-60"
                                        >
                                            <UserCheck size={13} />
                                            {actionLoading === acceptKey ? "Accepting..." : "Accept"}
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            disabled={busy}
                                            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold border border-[#e0e0e0] text-[#5A5F69] hover:text-red-600 hover:border-red-300 rounded-full py-1.5 transition-colors disabled:opacity-60"
                                        >
                                            <UserX size={13} />
                                            {actionLoading === rejectKey ? "Rejecting..." : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ============ C. PENDING SENT REQUESTS ============ */}
            <section>
                <SectionHeader icon={<Send size={18} />} title="Pending Sent Requests" count={sent.length} />
                {sent.length === 0 ? (
                    <EmptyState icon={<Send size={22} />} text="You haven't sent any pending requests." />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sent.map((req) => {
                            const key = `cancel-${req.id}`;
                            return (
                                <div
                                    key={req.id}
                                    className="bg-white rounded-xl border border-[#e0e0e0] p-4 flex flex-col gap-3 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={req.receiver?.fullName} src={req.receiver?.profileImage} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#000000] truncate">
                                                {req.receiver?.fullName || req.receiver?.username || "Unknown"}
                                            </p>
                                            {req.receiver?.headline && (
                                                <p className="text-xs text-[#5A5F69] truncate">{req.receiver.headline}</p>
                                            )}
                                            <p className="text-xs text-[#8A8F99] flex items-center gap-1 mt-0.5">
                                                <Clock size={11} />
                                                Pending
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCancel(req.id)}
                                        disabled={actionLoading === key}
                                        className="text-xs font-semibold border border-[#e0e0e0] text-[#5A5F69] hover:text-red-600 hover:border-red-300 rounded-full py-1.5 transition-colors disabled:opacity-60"
                                    >
                                        {actionLoading === key ? "Cancelling..." : "Cancel Request"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ============ D. PEOPLE YOU MAY KNOW ============ */}
            <section>
                <SectionHeader icon={<Sparkles size={18} />} title="People You May Know" count={suggestions.length} />
                {suggestions.length === 0 ? (
                    <EmptyState icon={<Sparkles size={22} />} text="No suggestions right now." />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {suggestions.map((user) => {
                            const key = `connect-${user.id}`;
                            return (
                                <div
                                    key={user.id}
                                    className="bg-white rounded-xl border border-[#e0e0e0] p-4 flex flex-col gap-3 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={user.fullName} src={user.profileImage} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#000000] truncate">
                                                {user.fullName || user.username || "Unknown"}
                                            </p>
                                            {user.headline && (
                                                <p className="text-xs text-[#5A5F69] truncate">{user.headline}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConnect(user.id)}
                                        disabled={actionLoading === key}
                                        className="flex items-center justify-center gap-1 text-xs font-semibold bg-[#0F5B78] hover:bg-[#0b445a] text-white rounded-full py-1.5 transition-colors disabled:opacity-60"
                                    >
                                        <UserPlus size={13} />
                                        {actionLoading === key ? "Sending..." : "Connect"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}