/** Implements the packages privacy policy component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We may collect the following categories of information:",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: [
      "Your information may be used to:",
      [
        "Create and manage user accounts",
        "Publish company listings",
        "Display job postings",
        "Process subscription purchases",
        "Deliver premium services",
        "Send newsletters",
        "Respond to inquiries",
        "Provide customer support",
        "Process payments",
        "Improve our services",
        "Conduct analytics",
        "Prevent fraud and abuse",
        "Comply with legal obligations",
        "Promote industry events and services (where permitted)",
      ],
    ],
  },
  {
    id: "legal-basis",
    title: "3. Legal Basis for Processing",
    content: [
      "Where applicable, we process personal information based on:",
      [
        "Your consent",
        "Performance of a contract",
        "Compliance with legal obligations",
        "Our legitimate business interests",
        "Protection against fraud and misuse",
      ],
    ],
  },
  {
    id: "sharing-of-information",
    title: "4. Sharing of Information",
    content: [
      "We do not sell your personal information.",
      "We may share information with:",
      [
        "Payment gateway providers",
        "Cloud hosting providers",
        "Email service providers",
        "Analytics providers",
        "Recruitment partners (where applicable)",
        "Event organizers (where required)",
        "Government or regulatory authorities when legally required",
      ],
      "Each service provider is expected to protect the information they process on our behalf.",
    ],
  },
  {
    id: "business-directory-listings",
    title: "5. Business Directory Listings",
    content: [
      "Information submitted for public business listings, including company names, contact details, product information, logos, and websites, may be displayed publicly on ToolingTrends.com.",
      "You are responsible for ensuring the accuracy of the information you choose to publish.",
    ],
  },
  {
    id: "job-portal",
    title: "6. Job Portal",
    content: [
      "Employers acknowledge that job postings may be publicly visible.",
      "Job seekers acknowledge that resumes or profile information may be shared with employers when they apply for jobs or choose to make their profiles visible.",
    ],
  },
  {
    id: "advertising-sponsored-content",
    title: "7. Advertising and Sponsored Content",
    content: [
      "Advertisers may provide banners, sponsored articles, product promotions, videos, or press releases for publication.",
      "Sponsored content will be identified where appropriate. We are not responsible for the accuracy of claims made by advertisers.",
    ],
  },
  {
    id: "data-security",
    title: "8. Data Security",
    content: [
      "We implement reasonable technical and organizational measures to safeguard personal information against unauthorized access, alteration, disclosure, or destruction.",
      "While we strive to protect your information, no method of transmission over the internet or electronic storage is completely secure.",
    ],
  },
  {
    id: "data-retention",
    title: "9. Data Retention",
    content: [
      "We retain personal information only for as long as necessary to:",
      [
        "Provide our services",
        "Fulfill contractual obligations",
        "Comply with legal requirements",
        "Resolve disputes",
        "Enforce our agreements",
      ],
      "After this period, information may be securely deleted or anonymized.",
    ],
  },
  {
    id: "your-rights",
    title: "10. Your Rights",
    content: [
      "Subject to applicable law, you may have the right to:",
      [
        "Access your personal information",
        "Correct inaccurate information",
        "Request deletion of your data",
        "Withdraw consent where processing is based on consent",
        "Object to certain processing activities",
        "Request a copy of your information, where applicable",
      ],
      "Requests may be subject to identity verification and legal limitations.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "11. Children's Privacy",
    content: [
      "ToolingTrends.com is intended for business and professional users and is not directed to children under the age of 18. We do not knowingly collect personal information from minors.",
    ],
  },
  {
    id: "international-users",
    title: "12. International Users",
    content: [
      "If you access the Website from outside India, you understand that your information may be processed and stored in India or other jurisdictions where our service providers operate, subject to applicable legal safeguards.",
    ],
  },
  {
    id: "third-party-links",
    title: "13. Third-Party Links",
    content: [
      "Our Website may contain links to third-party websites. We are not responsible for their privacy practices or content. We encourage you to review their privacy policies before providing personal information.",
    ],
  },
  {
    id: "changes-to-policy",
    title: "14. Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. The revised version will be posted on this page with an updated effective date. Continued use of the Website after changes become effective constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "15. Contact Us",
    content: [
      "If you have questions, concerns, or requests regarding this Privacy Policy, please contact:",
    ],
  },
];

// Detailed sub-groups for Section 1, rendered as labeled sub-blocks rather than
// one flat list, since the source groups them by category.
const INFO_CATEGORIES: { heading: string; items: string[] }[] = [
  {
    heading: "Personal Information",
    items: [
      "Full Name",
      "Company Name",
      "Job Title",
      "Email Address",
      "Mobile Number",
      "Postal Address",
      "Country and State",
      "GST Number (where applicable)",
      "Billing Information",
      "Payment Details (processed securely through payment gateways)",
      "Profile Photograph (optional)",
    ],
  },
  {
    heading: "Business Information",
    items: [
      "Company Profile",
      "Business Description",
      "Products and Services",
      "Company Logo",
      "Website URL",
      "Social Media Links",
      "Manufacturing Capabilities",
      "Certifications",
      "Contact Details",
    ],
  },
  {
    heading: "Job Portal Information — For Employers",
    items: [
      "Company Information",
      "Recruiter Contact Details",
      "Job Descriptions",
      "Hiring Requirements",
    ],
  },
  {
    heading: "Job Portal Information — For Job Seekers",
    items: [
      "Resume/CV",
      "Educational Qualifications",
      "Employment History",
      "Skills",
      "Portfolio Links",
      "Cover Letters",
      "Professional Certifications",
    ],
  },
  {
    heading: "Technical Information (collected automatically)",
    items: [
      "IP Address",
      "Browser Type",
      "Device Information",
      "Operating System",
      "Pages Visited",
      "Time Spent on Pages",
      "Referring Website",
      "Clickstream Data",
      "Session Information",
    ],
  },
  {
    heading: "Cookies and Similar Technologies",
    items: [
      "Remember your preferences",
      "Maintain login sessions",
      "Improve website performance",
      "Analyze website traffic",
      "Personalize content and advertisements",
      "Measure marketing campaign effectiveness",
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

/** Renders the privacy policy page client interface. */
export default function PrivacyPolicyPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Privacy Policy" />

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
              We are committed to protecting your privacy and handling your
              personal information responsibly. This Privacy Policy explains
              how we collect, use, disclose, store, and protect your
              information when you use ToolingTrends.com, including our
              website, business directory, job portal, event listings,
              newsletters, advertising services, and subscription plans.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By using our Website, you agree to the practices described in
              this Privacy Policy.
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

                  {/* Section 1 gets its detailed sub-categories */}
                  {section.id === "information-we-collect" && (
                    <div className="mt-5 space-y-6">
                      {INFO_CATEGORIES.map((cat) => (
                        <div key={cat.heading}>
                          <h3 className="text-sm font-semibold text-[#2a3d47]">
                            {cat.heading}
                          </h3>
                          <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                            {cat.items.map((item) => (
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
                      ))}
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
                          href="mailto:privacy@toolingtrends.com"
                          className="text-[#004d73] hover:underline"
                        >
                          privacy@toolingtrends.com
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

