/** Implements the packages terms&conditions component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  // Each block is either a paragraph (string) or a bullet list (string[])
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing ToolingTrends.com, you acknowledge that you have read, understood, and agreed to comply with these Terms & Conditions, our Privacy Policy, Cookie Policy, and all applicable laws.",
      "These Terms apply to:",
      [
        "Visitors",
        "Registered Users",
        "Advertisers",
        "Employers",
        "Recruiters",
        "Exhibitors",
        "Sponsors",
        "Business Listing Owners",
        "Event Organizers",
        "Premium Subscribers",
      ],
    ],
  },
  {
    id: "about",
    title: "2. About ToolingTrends.com",
    content: [
      "ToolingTrends.com is an online industrial platform providing information and services related to:",
      [
        "Tooling Industry News",
        "Die & Mould Manufacturing",
        "Machine Tools",
        "Precision Engineering",
        "Manufacturing Technology",
        "Product Launches",
        "Business Directory",
        "Industrial Events",
        "Job Portal",
        "Company Profiles",
        "Articles",
        "Whitepapers",
        "Banner Advertising",
        "Sponsored Content",
        "Industry Reports",
        "Marketplace Promotions",
      ],
      "The Platform serves only as an information and networking medium.",
    ],
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: [
      "You must be at least 18 years old to create an account or purchase any service.",
      "By using this Website you confirm that:",
      [
        "Information provided is accurate.",
        "You have authority to represent your company.",
        "Your account will not be used for unlawful activities.",
      ],
    ],
  },
  {
    id: "accounts",
    title: "4. User Accounts",
    content: [
      "Users may register to access premium features. You agree to:",
      [
        "Maintain accurate profile information.",
        "Keep passwords confidential.",
        "Notify us immediately of unauthorized access.",
        "Accept responsibility for all activities under your account.",
      ],
      "We reserve the right to suspend or terminate accounts without notice for violations.",
    ],
  },
  {
    id: "listings",
    title: "5. Business Listings",
    content: [
      "Companies may create business listings. You agree that:",
      [
        "Listing information is accurate.",
        "You own the rights to submitted content.",
        "Contact information is genuine.",
        "Listings shall not contain misleading information.",
      ],
      "ToolingTrends.com reserves the right to edit or remove listings.",
    ],
  },
  {
    id: "job-portal",
    title: "6. Job Portal",
    content: [
      "Employers may post jobs. Employers agree:",
      [
        "Jobs are genuine.",
        "Compensation information is accurate where applicable.",
        "Jobs comply with employment laws.",
        "No discriminatory content shall be published.",
      ],
      "Job seekers are responsible for verifying employers independently. ToolingTrends.com is not liable for recruitment decisions.",
    ],
  },
  {
    id: "sponsored-content",
    title: "7. Sponsored Content",
    content: [
      "Advertisers may publish:",
      [
        "Sponsored Articles",
        "Press Releases",
        "Banner Advertisements",
        "Product Promotions",
        "Videos",
        "Case Studies",
      ],
      "Sponsored content will be identified where appropriate. Advertisers remain solely responsible for claims made.",
    ],
  },
  {
    id: "advertising-policy",
    title: "8. Advertising Policy",
    content: [
      "Advertising does not constitute endorsement. We reserve the right to reject advertisements that are:",
      [
        "False",
        "Misleading",
        "Offensive",
        "Illegal",
        "Defamatory",
        "Infringing Intellectual Property",
        "Gambling",
        "Adult Content",
        "Tobacco",
        "Illegal Products",
      ],
    ],
  },
  {
    id: "subscription-plans",
    title: "9. Subscription Plans",
    content: [
      "Premium subscriptions may include:",
      [
        "Premium Company Profiles",
        "Featured Listings",
        "Job Posting Credits",
        "Sponsored Articles",
        "Homepage Banner Ads",
        "Newsletter Promotions",
        "Event Promotions",
        "Lead Generation",
        "Digital Marketing Packages",
      ],
      "Subscription benefits are subject to the purchased plan.",
    ],
  },
  {
    id: "payments",
    title: "10. Payments",
    content: [
      "Payments are processed through approved payment gateways.",
      "All prices are displayed in Indian Rupees (INR) unless otherwise specified.",
      "By making payment you authorize ToolingTrends.com to process the transaction.",
    ],
  },
  {
    id: "refund-policy",
    title: "11. Refund Policy",
    content: [
      "Unless otherwise stated:",
      [
        "Subscription fees are non-refundable.",
        "Advertising payments are non-refundable once campaigns begin.",
        "Sponsored content charges are non-refundable after publication.",
        "Job posting fees are non-refundable after activation.",
      ],
      "Refunds, if approved, shall be processed within 7–14 business days.",
    ],
  },
  {
    id: "user-content",
    title: "12. User Content",
    content: [
      "Users retain ownership of submitted content. However, by submitting content you grant ToolingTrends.com a worldwide, royalty-free, non-exclusive license to:",
      ["Display", "Publish", "Promote", "Reproduce", "Distribute"],
      "the submitted content on our platforms.",
    ],
  },
  {
    id: "prohibited-activities",
    title: "13. Prohibited Activities",
    content: [
      "Users shall not:",
      [
        "Upload malware",
        "Attempt unauthorized access",
        "Scrape website content",
        "Spam other users",
        "Post fake jobs",
        "Publish false information",
        "Infringe copyrights",
        "Use bots without permission",
        "Harass other users",
        "Impersonate companies",
      ],
      "Violation may result in permanent suspension.",
    ],
  },
  {
    id: "intellectual-property",
    title: "14. Intellectual Property",
    content: [
      "All content including:",
      [
        "Logo",
        "Website Design",
        "Graphics",
        "Icons",
        "Articles",
        "Databases",
        "Software",
        "Source Code",
        "Branding",
        "Trademarks",
      ],
      "belongs to ToolingTrends.com or respective owners. Unauthorized reproduction is prohibited.",
    ],
  },
  {
    id: "copyright-complaints",
    title: "15. Copyright Complaints",
    content: [
      "If you believe your copyrighted material has been used improperly, please contact us with:",
      [
        "Your name",
        "Company",
        "Copyright details",
        "Proof of ownership",
        "URL of infringing content",
      ],
      "We will investigate promptly.",
    ],
  },
  {
    id: "third-party-links",
    title: "16. Third-Party Links",
    content: [
      "Our Website may contain links to third-party websites. We do not control or endorse their content and are not responsible for:",
      ["Products", "Services", "Policies", "Security", "Availability"],
    ],
  },
  {
    id: "events",
    title: "17. Events",
    content: [
      "ToolingTrends.com may promote:",
      [
        "Trade Shows",
        "Conferences",
        "Seminars",
        "Webinars",
        "Awards",
        "Industry Meetups",
      ],
      "Event organizers remain responsible for event execution.",
    ],
  },
  {
    id: "industry-news",
    title: "18. Industry News",
    content: [
      "News articles are published for informational purposes.",
      "We strive for accuracy but cannot guarantee completeness or timeliness.",
      "Opinions expressed belong to respective authors.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "19. Limitation of Liability",
    content: [
      "ToolingTrends.com shall not be liable for:",
      [
        "Business losses",
        "Revenue loss",
        "Recruitment outcomes",
        "Data loss",
        "Service interruptions",
        "Advertisement performance",
        "User disputes",
        "Third-party actions",
      ],
      "Our liability shall not exceed the amount paid by the user for the specific service.",
    ],
  },
  {
    id: "disclaimer",
    title: "20. Disclaimer",
    content: [
      'All information is provided "as is." We do not warrant:',
      [
        "Accuracy",
        "Completeness",
        "Availability",
        "Merchantability",
        "Fitness for a particular purpose",
      ],
      "Users should independently verify all information.",
    ],
  },
  {
    id: "privacy",
    title: "21. Privacy",
    content: [
      "Your use of the Website is governed by our Privacy Policy.",
      "Please review it carefully before using our services.",
    ],
  },
  {
    id: "cookies",
    title: "22. Cookies",
    content: [
      "ToolingTrends.com uses cookies to:",
      [
        "Improve user experience",
        "Analyze traffic",
        "Remember preferences",
        "Deliver personalized content",
      ],
      "Continued use constitutes consent to our Cookie Policy.",
    ],
  },
  {
    id: "suspension-of-services",
    title: "23. Suspension of Services",
    content: [
      "We may suspend accounts if users:",
      [
        "Violate these Terms",
        "Abuse services",
        "Engage in fraud",
        "Misuse subscriptions",
        "Publish prohibited content",
      ],
      "No prior notice may be required.",
    ],
  },
  {
    id: "force-majeure",
    title: "24. Force Majeure",
    content: [
      "We shall not be liable for delays caused by:",
      [
        "Natural disasters",
        "Government actions",
        "Internet outages",
        "Cyber attacks",
        "Pandemics",
        "War",
        "Power failures",
      ],
    ],
  },
  {
    id: "modification-of-terms",
    title: "25. Modification of Terms",
    content: [
      "We reserve the right to modify these Terms at any time.",
      "Updated Terms become effective upon publication.",
      "Continued use constitutes acceptance.",
    ],
  },
  {
    id: "governing-law",
    title: "26. Governing Law",
    content: ["These Terms shall be governed by the laws of India."],
  },
  {
    id: "jurisdiction",
    title: "27. Jurisdiction",
    content: [
      "Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.",
    ],
  },
  {
    id: "termination",
    title: "28. Termination",
    content: [
      "We may terminate access to the Website at our sole discretion for violations of these Terms or misuse of the Platform.",
    ],
  },
  {
    id: "contact",
    title: "29. Contact Information",
    content: [
      "For any questions regarding these Terms & Conditions, please contact:",
    ],
  },
  {
    id: "entire-agreement",
    title: "30. Entire Agreement",
    content: [
      "These Terms & Conditions, together with the Privacy Policy, Cookie Policy, and any additional published policies, constitute the entire agreement between ToolingTrends.com and its users.",
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

/** Renders the terms page client interface. */
export default function TermsPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Terms & Conditions" />

      {/* Intro + Table of contents */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <div className="rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-[#616C74] sm:text-base">
              Welcome to ToolingTrends.com (&ldquo;Website&rdquo;,
              &ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;,
              &ldquo;us&rdquo;), owned and operated by Maxx Business Media
              Private Limited.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By accessing or using this Website, you agree to be legally
              bound by these Terms &amp; Conditions. If you do not agree with
              these Terms, please discontinue using the Website immediately.
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
                          href="mailto:legal@toolingtrends.com"
                          className="text-[#004d73] hover:underline"
                        >
                          legal@toolingtrends.com
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

