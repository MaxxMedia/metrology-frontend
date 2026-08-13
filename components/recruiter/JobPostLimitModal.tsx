"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { JobPostingEligibility } from "@/lib/jobPosting";

export default function JobPostLimitModal({
  open,
  onClose,
  eligibility,
}: {
  open: boolean;
  onClose: () => void;
  eligibility?: JobPostingEligibility | null;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1D2125] border border-[#292C30] p-6 shadow-2xl text-[#CCCCCC]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#FFFFFF]">
              Job posting limit reached
            </h2>
            <p className="mt-2 text-sm text-[#CCCCCC]">
              {eligibility?.message ||
                "You've reached your job posting limit. Upgrade your package to post more jobs."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#B8B8B8] hover:bg-[#171A1E] hover:text-[#FFFFFF]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {eligibility && !eligibility.isUnlimited && (
          <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-300">
            <p>
              <span className="font-medium">Current plan:</span>{" "}
              {eligibility.planLabel}
            </p>
            <p className="mt-1">
              <span className="font-medium">Active jobs:</span>{" "}
              {eligibility.activeJobs} of {eligibility.effectiveLimit}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/packages"
            className="flex-1 rounded-xl bg-[#0073FF] hover:bg-[#0060D0] px-4 py-3 text-center text-sm font-semibold text-white transition"
            onClick={onClose}
          >
            View Packages
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#292C30] px-4 py-3 text-sm font-semibold text-[#CCCCCC] hover:bg-[#171A1E] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
