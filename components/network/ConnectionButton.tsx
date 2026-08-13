"use client";

import { useEffect, useState } from "react";
import {
  acceptRequest,
  getStatus,
  sendRequest,
} from "@/services/connection.service";
import { ConnectionStatusResponse } from "@/types/connection";

interface ConnectionButtonProps {
  userId: number;
}

export default function ConnectionButton({
  userId,
}: ConnectionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<ConnectionStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await getStatus(userId);
      setStatus(res.data.data);
    } catch (err) {
      console.error("Failed to fetch connection status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      await sendRequest(userId);
      await fetchStatus();
    } catch (err: any) {
      console.error("Failed to send connection request", err);
      setError(
        err?.response?.data?.message || "Couldn't send request. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!status?.requestId) return;

    try {
      setLoading(true);
      setError(null);
      await acceptRequest(status.requestId);
      await fetchStatus();
    } catch (err: any) {
      console.error("Failed to accept connection request", err);
      setError(
        err?.response?.data?.message || "Couldn't accept request. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return (
      <button disabled className="rounded-lg bg-white/10 text-[#a1a1a1] px-4 py-2">
        Loading...
      </button>
    );
  }

  const errorBanner = error ? (
    <p className="mt-1 text-xs text-red-600">{error}</p>
  ) : null;

  switch (status.status) {
    case "CONNECTED":
      return (
        <button disabled className="bg-[#0073ff] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-sm opacity-90 cursor-default">
          Connected
        </button>
      );

    case "PENDING_SENT":
      return (
        <button disabled className="bg-[#0073ff]/80 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-sm cursor-default">
          Pending
        </button>
      );

    case "PENDING_RECEIVED":
      return (
        <div>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-[#0073ff] hover:bg-[#0060d6] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Accepting..." : "Accept"}
          </button>
          {errorBanner}
        </div>
      );

    case "SELF":
      return null;

    default:
      return (
        <div>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="bg-[#0073ff] hover:bg-[#0060d6] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Sending..." : "Connect"}
          </button>
          {errorBanner}
        </div>
      );
  }
}