// components/recruiter/PlanGatedSection.tsx - FULL COMPLETE VERSION

"use client";

export function PlanGatedSection({
    allowed,
    upgradeMessage,
    children,
}: {
    allowed: boolean;
    upgradeMessage: string;
    children: React.ReactNode;
}) {
    if (!allowed) {
        return (
            <div className="rounded-xl border border-dashed border-[#292C30] bg-[#171A1E] p-4 text-sm text-[#B8B8B8]">
                {upgradeMessage}
            </div>
        );
    }
    return <>{children}</>;
}