"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import type { PlanTier } from "@/lib/packages"

type ClaimCompanyBannerProps = {
  plan?: PlanTier
}

const VERIFIED_BADGE_LABEL: Record<PlanTier, string | false> = {
  free: false,
  basic: "Silver",
  professional: "Gold",
  enterprise: "Platinum",
}

const BADGE_STYLES: Record<string, { bg: string; text: string; ring: string; icon: string }> = {
  Silver: {
    bg: "bg-[#171A1E]",
    text: "text-gray-300",
    ring: "ring-[#292C30]",
    icon: "text-gray-400",
  },
  Gold: {
    bg: "bg-[#171A1E]",
    text: "text-amber-300",
    ring: "ring-amber-500/40",
    icon: "text-amber-400",
  },
  Platinum: {
    bg: "bg-[#171A1E]",
    text: "text-white",
    ring: "ring-[#00B5ED]/40",
    icon: "text-[#00B5ED]",
  },
}

export default function ClaimCompanyBanner({ plan = "free" }: ClaimCompanyBannerProps) {
  const badgeLabel = VERIFIED_BADGE_LABEL[plan]

  if (!badgeLabel) {
    return (
      <div className="mt-12">
        <div className="bg-[#1D2125] border border-[#292C30] rounded-xl">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">
            <div className="text-[#CCCCCC] font-semibold tracking-wide uppercase text-sm">
              Is this your company?
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/login"
                className="bg-[#0073FF] text-white px-6 py-2 text-sm font-semibold uppercase text-center hover:bg-[#0060D0] transition rounded-lg"
              >
                Update Your Listing
              </Link>

              <Link
                href="/login"
                className="bg-[#171A1E] border border-[#292C30] text-white px-6 py-2 text-sm font-semibold uppercase text-center hover:bg-[#292C30] transition rounded-lg"
              >
                Submit a Press Release to Our Editorial Teams
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const style = BADGE_STYLES[badgeLabel]

  return (
    <div className="mt-12">
      <div className="bg-[#1D2125] border border-[#292C30] rounded-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">
          <div className={`flex items-center gap-2 ${style.text} ring-1 ${style.ring} rounded-full px-4 py-1.5`}>
            <ShieldCheck size={16} className={style.icon} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {badgeLabel} Verified Supplier
            </span>
          </div>

          <Link
            href="/login"
            className="bg-[#0073FF] text-white px-6 py-2 text-sm font-semibold uppercase text-center hover:bg-[#0060D0] transition rounded-lg"
          >
            Update Your Listing
          </Link>
        </div>
      </div>
    </div>
  )
}
