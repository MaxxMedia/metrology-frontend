/** Implements the packages advertising policy component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "purpose",
    title: "1. Purpose",
    content: [
      "ToolingTrends.com is a business-to-business (B2B) digital platform serving the tooling, die & mould, precision engineering, machine tools, manufacturing, industrial automation, metrology, additive manufacturing, and related industries.",
      "Our advertising services are intended to provide relevant and valuable promotional opportunities while maintaining the trust of our users.",
    ],
  },
  {
    id: "advertising-services",
    title: "2. Advertising Services",
    content: [
      "We may offer advertising opportunities including, but not limited to:",
      [
        "Homepage Banner Advertisements",
        "Category Banner Advertisements",
        "Sidebar Advertisements",
        "Featured Company Listings",
        "Sponsored Articles",
        "Sponsored News Stories",
        "Press Releases",
        "Product Launch Announcements",
        "Newsletter Advertisements",
        "Email Marketing Campaigns",
        "Event Promotions",
        "Webinar Promotions",
        "Video Advertisements",
        "Premium Company Profiles",
        "Lead Generation Campaigns",
        "Social Media Promotions",
        "Custom Digital Marketing Packages",
      ],
      "Availability and placement may vary depending on inventory and purchased plans.",
    ],
  },
  {
    id: "advertising-approval",
    title: "3. Advertising Approval",
    content: [
      "All advertisements are subject to editorial and administrative review before publication.",
      "ToolingTrends.com reserves the right to:",
      [
        "Approve or reject any advertisement",
        "Request modifications before publication",
        "Change advertisement placement where necessary",
        "Remove advertisements that violate this Policy",
        "Suspend campaigns that breach applicable laws or our standards",
      ],
      "Acceptance of an advertisement does not create an obligation to accept future advertisements.",
    ],
  },
  {
    id: "advertiser-responsibilities",
    title: "4. Advertiser Responsibilities",
    content: [
      "Advertisers are solely responsible for ensuring that:",
      [
        "All submitted information is accurate and truthful",
        "They have the legal right to use all submitted content",
        "Product claims are supported by appropriate evidence where required",
        "Advertisements comply with applicable laws and regulations",
        "Intellectual property rights of third parties are not infringed",
        "Contact information provided is accurate and current",
      ],
      "Advertisers are responsible for obtaining any required regulatory approvals before publication.",
    ],
  },
  {
    id: "editorial-independence",
    title: "5. Editorial Independence",
    content: [
      "Advertising does not influence our editorial decisions.",
      "Editorial content published by ToolingTrends.com remains independent of advertising relationships.",
      "Sponsored content will be identified where appropriate to distinguish it from editorial content.",
    ],
  },
  {
    id: "sponsored-content",
    title: "6. Sponsored Content",
    content: [
      "Sponsored content may include:",
      [
        "Company Profiles",
        "Sponsored Articles",
        "Product Features",
        "Industry Case Studies",
        "Executive Interviews",
        "Success Stories",
        "White Papers",
        "Product Demonstrations",
        "Press Releases",
      ],
      "While sponsored content may be reviewed for formatting, grammar, clarity, and compliance, advertisers remain solely responsible for the accuracy of the information provided.",
      "ToolingTrends.com does not independently verify every claim contained in sponsored content.",
    ],
  },
  {
    id: "acceptable-content",
    title: "7. Acceptable Advertising Content",
    content: [
      "Advertisements should be relevant to our professional audience and may include:",
      [
        "Manufacturing Machinery",
        "Machine Tools",
        "Cutting Tools",
        "Die & Mould Technologies",
        "Tooling Solutions",
        "CAD/CAM Software",
        "Metrology Equipment",
        "Industrial Automation",
        "Robotics",
        "Additive Manufacturing",
        "Industrial Software",
        "Factory Equipment",
        "Industrial Services",
        "Trade Exhibitions",
        "Conferences",
        "Industrial Training",
        "Recruitment Services",
        "Engineering Education",
        "Industrial Finance",
        "Logistics Solutions",
      ],
    ],
  },
  {
    id: "prohibited-advertising",
    title: "8. Prohibited Advertising",
    content: [
      "The following advertisements are not permitted:",
      [
        "False or misleading claims",
        "Fraudulent business opportunities",
        "Counterfeit products",
        "Illegal products or services",
        "Adult or sexually explicit material",
        "Gambling services prohibited by law",
        "Tobacco or nicotine products",
        "Alcohol promotions prohibited by applicable law",
        "Hate speech or discriminatory content",
        "Violent or offensive material",
        "Malware, spyware, or deceptive software",
        "Phishing or identity theft schemes",
        "Cryptocurrency or financial investment schemes that violate applicable regulations",
        "Content infringing copyrights, trademarks, patents, or other intellectual property rights",
      ],
      "We may reject any advertisement that we determine is inappropriate for our audience or inconsistent with our platform values.",
    ],
  },
  {
    id: "technical-specifications",
    title: "9. Technical Specifications",
    content: [
      "Advertisers are responsible for submitting advertising materials in the required formats.",
      "Creative materials should:",
      [
        "Meet the specified dimensions",
        "Be of high visual quality",
        "Function correctly on desktop and mobile devices",
        "Not contain malicious code",
        "Link only to legitimate websites",
        "Comply with applicable file size and format requirements",
      ],
      "Technical specifications may be updated periodically.",
    ],
  },
  {
    id: "campaign-scheduling",
    title: "10. Campaign Scheduling",
    content: [
      "Advertising campaigns will commence according to the agreed schedule after:",
      [
        "Payment confirmation",
        "Receipt of complete advertising materials",
        "Final approval of creative assets",
      ],
      "Delays in providing required materials may affect campaign start dates.",
    ],
  },
  {
    id: "advertisement-performance",
    title: "11. Advertisement Performance",
    content: [
      "While we strive to maximize exposure, ToolingTrends.com does not guarantee:",
      [
        "A specific number of sales",
        "Business enquiries",
        "Website traffic",
        "Leads",
        "Conversion rates",
        "Search engine rankings",
        "Return on investment (ROI)",
      ],
      "Performance depends on multiple factors beyond our control, including advertiser offerings, market conditions, and audience behavior.",
    ],
  },
  {
    id: "advertisement-placement",
    title: "12. Advertisement Placement",
    content: [
      "Advertisement positions are generally allocated based on:",
      [
        "Purchased package",
        "Campaign duration",
        "Availability",
        "Editorial considerations",
        "Technical requirements",
      ],
      "ToolingTrends.com reserves the right to adjust placements where necessary to maintain Website functionality or improve user experience.",
    ],
  },
  {
    id: "intellectual-property",
    title: "13. Intellectual Property",
    content: [
      "Advertisers retain ownership of their submitted materials.",
      "By submitting advertising content, advertisers grant ToolingTrends.com a non-exclusive, worldwide, royalty-free license to:",
      [
        "Display advertisements",
        "Publish promotional materials",
        "Resize or optimize creatives for technical compatibility",
        "Archive campaign materials",
        "Promote campaigns through our marketing channels where agreed",
      ],
    ],
  },
  {
    id: "payment",
    title: "14. Payment",
    content: [
      "Advertising fees must be paid according to the agreed quotation, invoice, or package.",
      "Campaigns may not begin until payment has been received unless alternative payment terms have been agreed in writing.",
    ],
  },
  {
    id: "cancellation",
    title: "15. Cancellation",
    content: [
      "Cancellation requests are governed by our Refund & Cancellation Policy.",
      "Once an advertising campaign has commenced, fees are generally non-refundable.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "16. Limitation of Liability",
    content: [
      "ToolingTrends.com is not responsible for:",
      [
        "Errors in advertiser-provided content",
        "Business losses resulting from advertising performance",
        "Third-party website availability",
        "Technical failures beyond our reasonable control",
        "Claims made by advertisers",
      ],
      "Advertisers agree to indemnify and hold ToolingTrends.com and Maxx Business Media Private Limited harmless from claims arising from the content or legality of their advertisements.",
    ],
  },
  {
    id: "policy-violations",
    title: "17. Policy Violations",
    content: [
      "If an advertisement is found to violate this Policy, we may:",
      [
        "Reject the advertisement",
        "Suspend the campaign",
        "Remove published content",
        "Restrict future advertising privileges",
        "Terminate advertiser accounts in serious or repeated cases",
      ],
    ],
  },
  {
    id: "changes-to-policy",
    title: "18. Changes to This Policy",
    content: [
      "We may revise this Advertising Policy from time to time.",
      "Updated versions will be published on the Website with a revised Effective Date.",
      "Continued use of our advertising services after such updates constitutes acceptance of the revised Policy.",
    ],
  },
  {
    id: "contact",
    title: "19. Contact Us",
    content: [
      "For advertising enquiries or questions regarding this Policy, please contact:",
    ],
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

/** Renders the advertising policy page client interface. */
export default function AdvertisingPolicyPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Advertising Policy" />

      {/* Intro + Table of contents */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <div className="rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-[#616C74] sm:text-base">
              Welcome to ToolingTrends.com (&ldquo;Website&rdquo;,
              &ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or
              &ldquo;us&rdquo;), owned and operated by Maxx Business Media
              Private Limited.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              This Advertising Policy outlines the terms governing all
              advertising, sponsorship, promotional, and marketing activities
              on ToolingTrends.com. It applies to advertisers, agencies,
              sponsors, exhibitors, manufacturers, distributors, service
              providers, recruiters, and all organizations purchasing
              advertising or promotional services through our Platform.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By purchasing or submitting advertising materials, you agree to
              comply with this Policy.
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

                  {section.id === "contact" && (
                    <div className="mt-4 rounded-xl bg-[#f8f9fb] p-4 text-sm leading-relaxed text-[#2a3d47]">
                      <p className="font-medium">Maxx Business Media Private Limited</p>
                      <p>ToolingTrends.com</p>
                      <p>Bengaluru, Karnataka, India</p>
                      <p className="mt-2">
                        Email:{" "}
                        <a
                          href="mailto:advertising@toolingtrends.com"
                          className="text-[#004d73] hover:underline"
                        >
                          advertising@toolingtrends.com
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

