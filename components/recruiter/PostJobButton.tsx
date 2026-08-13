"use client";

import { useState } from "react";
import Link from "next/link";
import JobPostLimitModal from "@/components/recruiter/JobPostLimitModal";
import type { JobPostingEligibility } from "@/lib/jobPosting";

export default function PostJobButton({
  eligibility,
  className = "bg-[#0073FF] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0060D0] transition-colors",
  label = "+ Post Job",
  variant = "button",
  children,
}: {
  eligibility?: JobPostingEligibility | null;
  className?: string;
  label?: string;
  variant?: "button" | "card";
  children?: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);

  if (eligibility?.canPost) {
    return (
      <Link
        href="/recruiter/jobs/new"
        className={variant === "card" ? className : className}
      >
        {variant === "card" ? children : label}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={variant === "card" ? className : className}
      >
        {variant === "card" ? children : label}
      </button>
      <JobPostLimitModal
        open={showModal}
        onClose={() => setShowModal(false)}
        eligibility={eligibility}
      />
    </>
  );
}
