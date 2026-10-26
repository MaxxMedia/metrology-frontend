"use client"
/** Implements the verified supplier header component and its related interface behavior. */


import { ShieldCheck } from "lucide-react"
import type { PlanTier } from "@/lib/packages"

type VerifiedSupplierHeaderProps = {
    planTier: PlanTier
}

const VERIFIED_BADGE_CONFIG: Record<Exclude<PlanTier, "free">, {
    label: string
    bg: string
    text: string
    ring: string
    icon: string
    gradient: string
}> = {
    basic: {
        label: "Silver Verified Supplier",
        bg: "bg-gray-50",
        text: "text-gray-700",
        ring: "ring-gray-300",
        icon: "text-gray-500",
        gradient: "from-gray-100 to-gray-300",
    },
    professional: {
        label: "Gold Verified Supplier",
        bg: "bg-amber-50",
        text: "text-amber-800",
        ring: "ring-amber-300",
        icon: "text-amber-500",
        gradient: "from-amber-100 to-amber-400",
    },
    enterprise: {
        label: "Platinum Verified Supplier",
        bg: "bg-slate-900",
        text: "text-white",
        ring: "ring-slate-700",
        icon: "text-cyan-300",
        gradient: "from-slate-700 to-slate-900",
    },
}

/** Renders the verified supplier header interface. */
export default function VerifiedSupplierHeader({
    planTier,
}: VerifiedSupplierHeaderProps) {
    if (planTier === "free") return null

    const config = VERIFIED_BADGE_CONFIG[planTier]

    return (
        <div className="mb-6">
            <div className={`${config.bg} rounded-lg border border-gray-200 p-4`}>
                <div className="flex items-center gap-3">
                    <div
                        className={`flex items-center gap-2 ${config.text} ring-1 ${config.ring} rounded-full px-4 py-2`}
                    >
                        <ShieldCheck size={18} className={config.icon} />
                        <span className="text-sm font-semibold uppercase tracking-wide">
                            {config.label}
                        </span>
                    </div>
                    <div
                        className={`flex-1 h-[2px] bg-gradient-to-r ${config.gradient}`}
                    />
                </div>
            </div>
        </div>
    )
}