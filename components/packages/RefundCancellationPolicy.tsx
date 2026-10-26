/** Implements the packages refund cancellation policy component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "general-policy",
    title: "1. General Policy",
    content: [
      "ToolingTrends.com offers a range of digital products and services. Due to the nature of these services, many purchases become active immediately after payment or involve the allocation of resources and advertising inventory.",
      "Unless otherwise stated in writing, all payments made to ToolingTrends.com are non-refundable once the purchased service has been activated, published, or delivered.",
    ],
  },
  {
    id: "subscription-plans",
    title: "2. Subscription Plans",
    content: [
      "This policy applies to all subscription plans, including but not limited to:",
      [
        "Premium Memberships",
        "Company Profile Subscriptions",
        "Featured Business Listings",
        "Digital Marketing Packages",
        "Industry News Subscriptions",
        "Employer Plans",
        "Recruiter Plans",
        "Marketplace Packages",
      ],
    ],
  },
  {
    id: "business-listings",
    title: "3. Business Listings",
    content: [
      "Paid business listings, featured listings, and directory upgrades are considered delivered once published on the Website.",
      "After publication:",
      [
        "Listing fees are non-refundable",
        "Listing upgrades are non-refundable",
        "Feature placement charges are non-refundable",
      ],
      "Users may request updates or corrections to listing information during the subscription period.",
    ],
  },
  {
    id: "job-posting-services",
    title: "4. Job Posting Services",
    content: [
      "Employers purchasing job posting credits acknowledge that:",
      [
        "Job posting fees are non-refundable once a job is published",
        "Expired job credits are not redeemable for cash",
        "Unused credits may expire according to the purchased plan",
      ],
      "If a posting is rejected due to a violation of our policies, a refund is generally not available.",
    ],
  },
  {
    id: "banner-advertising",
    title: "5. Banner Advertising",
    content: [
      "Banner advertising includes homepage banners, category banners, newsletter banners, event banners, and other display advertising.",
    ],
  },
  {
    id: "sponsored-content",
    title: "6. Sponsored Articles, Press Releases, and Promotional Content",
    content: [
      "This includes:",
      [
        "Sponsored Articles",
        "Press Releases",
        "Product Launches",
        "Featured Stories",
        "Case Studies",
        "Interviews",
        "Company Spotlights",
      ],
      "Once content has been reviewed, scheduled, or published:",
      [
        "Payments are non-refundable",
        "Published content cannot be withdrawn for a refund",
        "Minor factual corrections may be requested, subject to editorial review",
      ],
    ],
  },
  {
    id: "event-promotion",
    title: "7. Event Promotion Services",
    content: [
      "Paid services for promoting trade fairs, conferences, webinars, seminars, or industrial events become non-refundable once the promotion has commenced.",
      "If promotional material has not yet been scheduled or published, cancellation requests may be considered on a case-by-case basis.",
    ],
  },
  {
    id: "custom-digital-marketing",
    title: "8. Custom Digital Marketing Services",
    content: [
      "Services such as:",
      [
        "Email Marketing",
        "Social Media Promotion",
        "SEO Services",
        "Content Marketing",
        "Lead Generation",
        "Branding Campaigns",
        "Graphic Design",
        "Custom Advertising Packages",
      ],
      "are project-based services. Once work has commenced:",
      [
        "Payments are non-refundable",
        "Completed work remains billable",
        "Any remaining scope may be cancelled only by mutual written agreement",
      ],
    ],
  },
  {
    id: "payment-errors",
    title: "9. Payment Errors",
    content: [
      "If you believe you have been charged incorrectly due to:",
      [
        "Duplicate payment",
        "Technical error",
        "Incorrect billing",
        "Unauthorized transaction",
      ],
      "please contact us promptly with supporting information.",
      "Verified billing errors will be corrected, and eligible refunds will be processed through the original payment method where possible.",
    ],
  },
  {
    id: "failed-transactions",
    title: "10. Failed Transactions",
    content: [
      "If payment is unsuccessful or interrupted:",
      [
        "Services will not be activated until payment is successfully completed",
        "No obligations arise until payment confirmation is received",
      ],
    ],
  },
  {
    id: "exceptional-circumstances",
    title: "11. Exceptional Circumstances",
    content: [
      "We may consider a refund, credit, or alternative resolution in exceptional situations, including:",
      [
        "Duplicate payments",
        "Technical issues that prevented service activation and could not be resolved",
        "Failure by ToolingTrends.com to deliver the purchased service",
        "Other circumstances where a refund is required under applicable law",
      ],
      "Any such decision will be made at our sole discretion unless otherwise required by law.",
    ],
  },
  {
    id: "refund-processing",
    title: "12. Refund Processing",
    content: [
      "Where a refund is approved:",
      [
        "It will be processed using the original payment method whenever possible",
        "Processing may take 7–14 business days, depending on the payment provider or financial institution",
        "Bank or payment gateway processing times may vary",
      ],
    ],
  },
  {
    id: "chargebacks",
    title: "13. Chargebacks",
    content: [
      "If a customer initiates a chargeback without first contacting ToolingTrends.com to resolve the issue, we reserve the right to:",
      [
        "Suspend the associated account",
        "Terminate active services",
        "Recover unpaid fees where legally permissible",
        "Contest fraudulent or invalid chargeback claims",
      ],
    ],
  },
  {
    id: "changes-to-policy",
    title: "14. Changes to This Policy",
    content: [
      "We reserve the right to modify this Refund & Cancellation Policy at any time.",
      "The updated version will be posted on this page with a revised Effective Date.",
      "Continued use of our services after changes become effective constitutes acceptance of the revised Policy.",
    ],
  },
  {
    id: "contact",
    title: "15. Contact Us",
    content: ["For questions regarding cancellations or refunds, please contact:"],
  },
];

/** Coordinates the render block behavior for this component. */
function renderBlock(block: string | string[], key: number) {
  if (Array.isArray(block)) {
    return (
      <ul key={key} className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {block.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-relaxed text-[#616C74]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#004d73]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={key} className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
      {block}
    </p>
  );
}

/** Renders the refund cancellation policy page client interface. */
export default function RefundCancellationPolicyPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Refund & Cancellation Policy" />

      {/* Intro + Table of contents */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <div className="rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-[#616C74] sm:text-base">
              This Refund &amp; Cancellation Policy (&ldquo;Policy&rdquo;)
              applies to all products, subscriptions, advertising services,
              premium listings, sponsored content, job postings, event
              promotions, and other paid services offered through
              ToolingTrends.com (&ldquo;Website&rdquo;, &ldquo;Platform&rdquo;,
              &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), owned
              and operated by Maxx Business Media Private Limited.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By purchasing any paid service from ToolingTrends.com, you agree
              to this Refund &amp; Cancellation Policy.
            </p>
          </div>

        </div>
      </section>

      {/* Sections */}
      <section className="bg-[#f8f9fb] py-4 sm:py-8">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid gap-6 pb-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2a3d47]">
                  On this page
                </h2>
                <nav className="mt-4 space-y-2">
                  {SECTIONS.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm leading-relaxed text-[#004d73] hover:text-blue-600 hover:underline"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="space-y-6">
              {SECTIONS.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8"
                >
                  <h2 className="text-lg font-semibold text-[#121213] sm:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-1 h-[2px] w-10 bg-blue-600" />
                  {section.content.map((block, i) => renderBlock(block, i))}

                  {/* Section 2: Cancellation / Refunds subgroups */}
                  {section.id === "subscription-plans" && (
                    <div className="mt-5 space-y-5">
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a3d47]">
                          Cancellation
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                          Subscribers may cancel their subscription at any time
                          through their account settings or by contacting our
                          support team. Cancellation will prevent automatic
                          renewal where applicable but will not affect the
                          current subscription period.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a3d47]">
                          Refunds
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                          Subscription fees are generally non-refundable after
                          activation. Refunds will not be provided for:
                        </p>
                        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          {[
                            "Partial use of a subscription",
                            "Failure to use purchased services",
                            "Change of business plans",
                            "Accidental purchases after service activation",
                            "Early cancellation during an active subscription period",
                          ].map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm leading-relaxed text-[#616C74]"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#004d73]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Section 5: Before/After campaign starts */}
                  {section.id === "banner-advertising" && (
                    <div className="mt-5 space-y-5">
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a3d47]">
                          Before Campaign Starts
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                          If cancellation is requested before creative approval
                          and campaign scheduling, we may, at our sole
                          discretion, approve a partial refund after deducting
                          applicable administrative charges.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a3d47]">
                          After Campaign Starts
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                          Once an advertising campaign has begun:
                        </p>
                        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          {[
                            "No refunds will be issued",
                            "Campaign dates cannot be reversed",
                            "Unused impressions due to advertiser delays may not be recoverable unless agreed in writing",
                          ].map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm leading-relaxed text-[#616C74]"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#004d73]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {section.id === "contact" && (
                    <div className="mt-4 rounded-xl bg-[#f8f9fb] p-4 text-sm leading-relaxed text-[#2a3d47]">
                      <p className="font-medium">Maxx Business Media Private Limited</p>
                      <p>ToolingTrends.com</p>
                      <p>Bengaluru, Karnataka, India</p>
                      <p className="mt-2">
                        Email:{" "}
                        <a
                          href="mailto:billing@toolingtrends.com"
                          className="text-[#004d73] hover:underline"
                        >
                          billing@toolingtrends.com
                        </a>
                      </p>
                      <p>
                        Website:{" "}
                        <a
                          href="https://www.toolingtrends.com"
                          className="text-[#004d73] hover:underline"
                        >
                          https://www.toolingtrends.com
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

