import Link from "next/link"
import {
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react"

const leftItems = [
  "Company information is accurate and up to date.",
  "You own or have permission to upload all images.",
  "Product descriptions are truthful.",
]

const rightItems = [
  "Duplicate or misleading listings are prohibited.",
  "Listings are reviewed before publication.",
  "Follow Business Listing Guidelines.",
]

export default function BusinessListingGuidelinesSummary() {
  return (
    <div className="rounded-xl border border-[#292C30] bg-[#1D2125] p-6 text-[#CCCCCC]">

      {/* Heading */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute left-0 h-px w-full bg-[#292C30]" />

        <div className="relative z-10 flex items-center gap-2 bg-[#1D2125] px-5">
          <FileText className="h-5 w-5 text-[#00B5ED]" />
          <h3 className="text-xl font-semibold text-[#FFFFFF]">
            Before You Submit
          </h3>
        </div>
      </div>

      {/* 2 x 3 Layout */}
      <div className="grid grid-cols-2 gap-10 mt-6">
  {/* Left */}
  <div className="space-y-5 border-r border-[#292C30] pr-8">
    {leftItems.map((item) => (
      <div key={item} className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00B5ED]" />
        <p className="text-sm leading-6 text-[#CCCCCC]">{item}</p>
      </div>
    ))}
  </div>

  {/* Right */}
  <div className="space-y-5 pl-8">
    {rightItems.map((item) => (
      <div key={item} className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00B5ED]" />
        <p className="text-sm leading-6 text-[#CCCCCC]">{item}</p>
      </div>
    ))}
  </div>
</div>

      {/* Divider */}
      <div className="my-6 border-t border-[#292C30]" />

      {/* Link */}
      <Link
        href="/business-listing-guidelines"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#00B5ED] hover:text-[#0073FF] hover:underline"
      >
        <FileText className="h-4 w-4" />
        View Full Business Listing Guidelines
        <ExternalLink className="h-4 w-4" />
      </Link>

    </div>
  )
}