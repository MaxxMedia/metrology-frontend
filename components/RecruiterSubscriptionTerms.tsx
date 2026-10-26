"use client"
/** Implements the recruiter subscription terms component and its related interface behavior. */


import { useMemo, useState } from "react"

type RecruiterSubscriptionTermsProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

type TermsSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "Effective Date",
    paragraphs: [
      "July 6, 2026",
      "These Subscription Terms & Conditions govern the purchase, renewal, use, and cancellation of subscription plans and premium services offered through ToolingTrends.com by Maxx Business Media Private Limited.",
      "By purchasing or using any subscription plan, you agree to these Subscription Terms, the Terms & Conditions, Privacy Policy, Refund & Cancellation Policy, and other applicable Website policies.",
    ],
  },
  {
    title: "1. Subscription Services",
    paragraphs: [
      "ToolingTrends.com offers free and paid subscription plans for businesses and professionals in the manufacturing and engineering industries.",
    ],
    bullets: [
      "Premium company profiles",
      "Business directory listings",
      "Featured business listings",
      "Product catalog listings",
      "Job posting credits",
      "Resume database access",
      "Sponsored articles and press release publishing",
      "Banner advertisements and newsletter promotions",
      "Lead generation, event promotion, and social media promotion",
      "Market reports, premium editorial content, and member-only resources",
    ],
  },
  {
    title: "2. Eligibility",
    bullets: [
      "You must be at least 18 years of age",
      "You must have legal authority to enter into binding agreements",
      "You must provide accurate registration and billing information",
      "You must comply with applicable laws and platform policies",
      "Business subscriptions must be purchased by an authorized representative",
    ],
  },
  {
    title: "3. Plans and Periods",
    paragraphs: [
      "Plans may include Free Membership, Premium Membership, and Enterprise Plans. Features vary by plan and may change over time.",
      "Subscriptions may be monthly, quarterly, half-yearly, annual, multi-year, or custom contractual periods.",
      "The subscription period begins on the date of successful payment unless otherwise specified.",
    ],
  },
  {
    title: "4. Fees, Payment, and Renewal",
    paragraphs: [
      "Fees are displayed in the applicable currency at the time of purchase. Applicable taxes, including GST where required, may be charged in accordance with Indian law.",
      "Subscriptions may renew automatically where enabled, or manually by the subscriber.",
      "Renewal pricing may differ from previous periods if pricing has changed.",
    ],
  },
  {
    title: "5. Cancellation and Refunds",
    paragraphs: [
      "Cancellation of auto-renewal stops future renewals but does not terminate the current active subscription immediately.",
      "Subscription fees are generally non-refundable once activated, partial subscription periods are not refunded, and unused benefits are not redeemable for cash, except where required by law or in verified billing error cases.",
    ],
  },
  {
    title: "6. Use of Subscription Benefits",
    bullets: [
      "Do not transfer subscription privileges without authorization",
      "Do not share login credentials with unauthorized persons",
      "Do not resell subscription access",
      "Do not use subscription services for unlawful purposes",
      "Do not circumvent usage limits or technical restrictions",
    ],
  },
  {
    title: "7. Listings, Advertising, and Job Portal Benefits",
    paragraphs: [
      "Premium subscribers are responsible for keeping company profile, listing, image, and logo information accurate, lawful, and compliant with platform policies.",
      "Advertising and promotional benefits remain subject to editorial review and the Advertising Policy.",
      "Recruitment-related benefits such as job posting credits and resume access are governed by the Job Posting Policy and may expire under the applicable plan.",
    ],
  },
  {
    title: "8. Availability, Plan Changes, and Suspension",
    paragraphs: [
      "Temporary interruptions caused by maintenance, technical issues, outages, security incidents, or events outside reasonable control do not automatically entitle subscribers to refunds or extensions unless required by law or expressly agreed.",
      "ToolingTrends.com may introduce new plans, modify pricing for future periods, change features, or discontinue services.",
      "Subscriptions may be suspended or terminated for policy violations, fraud, misuse of benefits, unlawful activity, or harmful use of the platform.",
    ],
  },
  {
    title: "9. Liability and Updates",
    paragraphs: [
      "To the fullest extent permitted by law, liability for business loss, missed advertising or recruitment outcomes, data loss, service interruptions, and indirect or consequential damages is excluded, and any non-excludable liability is limited to the fees paid for the affected service.",
      "These Subscription Terms may be revised from time to time, and continued use or renewal after updates constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "10. Contact",
    paragraphs: [
      "For questions regarding subscriptions, billing, renewals, or these terms, contact Maxx Business Media Private Limited, Bengaluru, Karnataka, India.",
      "Subscription email: subscriptions@toolingtrends.com",
      "Support email: support@toolingtrends.com",
      "Website: https://www.toolingtrends.com",
    ],
  },
]

/** Renders the recruiter subscription terms interface. */
export default function RecruiterSubscriptionTerms({
  checked,
  onCheckedChange,
}: RecruiterSubscriptionTermsProps) {
  const [hasReachedEnd, setHasReachedEnd] = useState(false)

  const helperText = useMemo(() => {
    if (hasReachedEnd) {
      return "You can now confirm the checkbox and continue."
    }

    return "Scroll through the terms to unlock the agreement checkbox."
  }, [hasReachedEnd])

  /** Handles the scroll interaction and its related state changes. */
  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (hasReachedEnd) return

    const element = event.currentTarget
    const isAtBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 12

    if (isAtBottom) {
      setHasReachedEnd(true)
    }
  }

  return (
    <div className="rounded-2xl border border-[#dbe4ef] bg-[#f8fbff] p-3 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-[#121213]">
          Company Subscription Terms
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[#5f6b76]">
          Please review the subscription terms for company accounts before
          creating your account.
        </p>
      </div>

      <div
        onScroll={handleScroll}
        className="max-h-56 overflow-y-auto rounded-xl border border-[#dbe4ef] bg-white p-3 text-xs text-[#2a3d47]"
      >
        <div className="space-y-4">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title}>
              <h4 className="text-sm font-semibold text-[#121213]">{section.title}</h4>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2 text-xs leading-relaxed text-[#5f6b76]"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-xs leading-relaxed text-[#5f6b76]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0073FF]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-[#5f6b76]">{helperText}</p>

      <label
        className={`mt-3 flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
          hasReachedEnd
            ? "border-[#cfe0ff] bg-white text-[#2a3d47]"
            : "pointer-events-none invisible h-0 overflow-hidden border-transparent p-0 opacity-0"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0073FF] focus:ring-[#0073FF]"
        />
        <span className="leading-relaxed">
          I have read and agree to the Company Subscription Terms &
          Conditions.
        </span>
      </label>
    </div>
  )
}
