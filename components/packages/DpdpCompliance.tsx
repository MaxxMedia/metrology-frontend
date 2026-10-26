/** Implements the packages dpdp compliance component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "scope",
    title: "1. Scope",
    content: [
      "This Notice applies to all personal data processed by ToolingTrends.com in connection with:",
      [
        "Website visitors",
        "Registered users",
        "Business listing owners",
        "Employers and recruiters",
        "Job seekers",
        "Advertisers",
        "Sponsors",
        "Event organizers",
        "Newsletter subscribers",
        "Vendors and service providers",
        "Customer support interactions",
      ],
      "It applies to personal data processed digitally or collected offline and subsequently digitized, where the DPDP Act applies.",
    ],
  },
  {
    id: "personal-data-collected",
    title: "2. Personal Data We Collect",
    content: ["Depending on the services you use, we may collect:"],
  },
  {
    id: "purpose-of-processing",
    title: "3. Purpose of Processing",
    content: [
      "We process personal data for legitimate business purposes, including:",
      [
        "Creating and managing user accounts",
        "Publishing company profiles",
        "Operating the business directory",
        "Providing recruitment services",
        "Processing subscriptions and payments",
        "Delivering newsletters",
        "Responding to customer enquiries",
        "Improving Website functionality",
        "Preventing fraud and abuse",
        "Maintaining platform security",
        "Fulfilling contractual obligations",
        "Complying with legal and regulatory requirements",
        "Sending promotional communications where permitted and in accordance with your preferences",
      ],
    ],
  },
  {
    id: "consent",
    title: "4. Consent",
    content: [
      "Where required under applicable law, we seek your consent before collecting or processing your personal data.",
      "By voluntarily providing your personal data or using our services, you consent to processing for the purposes described in this Notice, subject to applicable legal requirements.",
      "Where consent is the basis for processing, you may withdraw it at any time. Withdrawal of consent does not affect processing already carried out before the withdrawal and may limit our ability to provide certain services.",
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights Under the DPDP Act",
    content: [
      "Subject to the DPDP Act and applicable legal requirements, you may have the right to:",
      [
        "Request access to your personal data",
        "Request correction of inaccurate or incomplete information",
        "Request updating of outdated information",
        "Request deletion of personal data when it is no longer required or where legally applicable",
        "Withdraw previously provided consent, where processing is based on consent",
        "Seek grievance redressal regarding our handling of your personal data",
        "Nominate another individual to exercise your rights in circumstances permitted by applicable law",
      ],
      "We may request reasonable verification of identity before processing such requests.",
    ],
  },
  {
    id: "your-responsibilities",
    title: "6. Your Responsibilities",
    content: [
      "When using ToolingTrends.com, you agree to:",
      [
        "Provide accurate and current information",
        "Update your information when it changes",
        "Avoid submitting false or misleading information",
        "Respect the privacy rights of other users",
        "Ensure you have the authority to provide personal data relating to other individuals where necessary",
      ],
    ],
  },
  {
    id: "sharing-of-personal-data",
    title: "7. Sharing of Personal Data",
    content: [
      "We do not sell your personal data.",
      "We may share personal data with:",
      [
        "Payment service providers",
        "Cloud hosting providers",
        "Email delivery platforms",
        "Analytics providers",
        "Customer support providers",
        "Recruitment partners (where applicable)",
        "Event organizers (where necessary to provide requested services)",
        "Government authorities or law enforcement agencies where required by applicable law",
      ],
      "Recipients are expected to process personal data only for authorized purposes and to implement appropriate security measures.",
    ],
  },
  {
    id: "data-security",
    title: "8. Data Security",
    content: [
      "We implement reasonable technical and organizational safeguards designed to protect personal data against:",
      [
        "Unauthorized access",
        "Unauthorized disclosure",
        "Alteration",
        "Loss",
        "Misuse",
        "Destruction",
      ],
      "These measures may include:",
      [
        "Secure hosting environments",
        "Encryption where appropriate",
        "Access controls",
        "Authentication mechanisms",
        "Regular security monitoring",
        "Secure backup procedures",
      ],
      "While we take reasonable steps to protect personal data, no system can guarantee absolute security.",
    ],
  },
  {
    id: "data-retention",
    title: "9. Data Retention",
    content: [
      "We retain personal data only for as long as necessary to:",
      [
        "Provide our services",
        "Fulfill contractual obligations",
        "Comply with legal requirements",
        "Resolve disputes",
        "Enforce our agreements",
        "Maintain business records where permitted or required by law",
      ],
      "When personal data is no longer required, it will be securely deleted, anonymized, or otherwise disposed of in accordance with applicable law.",
    ],
  },
  {
    id: "cross-border-transfers",
    title: "10. Cross-Border Data Transfers",
    content: [
      "Where personal data is transferred or processed outside India, we will take reasonable steps to ensure that such transfers comply with applicable legal requirements and that appropriate safeguards are in place, where required.",
    ],
  },
  {
    id: "childrens-personal-data",
    title: "11. Children's Personal Data",
    content: [
      "ToolingTrends.com is intended primarily for business and professional users.",
      "We do not knowingly collect personal data from children in violation of applicable law.",
      "Where we become aware that personal data has been collected from a child without the required authorization, we will take appropriate steps to delete such information, subject to applicable legal requirements.",
    ],
  },
  {
    id: "cookies-tracking",
    title: "12. Cookies and Tracking Technologies",
    content: [
      "We use cookies and similar technologies to:",
      [
        "Improve Website performance",
        "Remember user preferences",
        "Maintain secure sessions",
        "Analyze Website traffic",
        "Support personalization",
        "Measure advertising effectiveness",
      ],
      "Our use of cookies is explained in our separate Cookie Policy.",
    ],
  },
  {
    id: "grievance-redressal",
    title: "13. Grievance Redressal",
    content: [
      "If you have concerns regarding our handling of your personal data, you may contact us using the details below.",
      "We will acknowledge and respond to grievances within a reasonable period in accordance with applicable legal requirements.",
      "If you remain dissatisfied, you may have the right to pursue remedies available under applicable law.",
    ],
  },
  {
    id: "grievance-officer",
    title: "14. Grievance Officer",
    content: [
      "In accordance with applicable legal requirements, ToolingTrends.com may designate a Grievance Officer to handle privacy-related concerns.",
    ],
  },
  {
    id: "changes-to-notice",
    title: "15. Changes to This Notice",
    content: [
      "We may revise this DPDP Compliance Notice from time to time to reflect changes in:",
      [
        "Applicable laws",
        "Government regulations",
        "Business operations",
        "Technology",
        "Privacy practices",
      ],
      "Updated versions will be published on this page with a revised Effective Date.",
      "Continued use of ToolingTrends.com after such updates constitutes acceptance of the revised Notice.",
    ],
  },
  {
    id: "contact",
    title: "16. Contact Us",
    content: [
      "For questions regarding this DPDP Compliance Notice or our privacy practices, please contact:",
    ],
  },
];

// Section 2 sub-groups (personal data categories)
const DATA_CATEGORIES: { heading: string; items: string[] }[] = [
  {
    heading: "Identity Information",
    items: [
      "Full Name",
      "Company Name",
      "Job Title",
      "Username",
      "Profile Photograph (optional)",
    ],
  },
  {
    heading: "Contact Information",
    items: [
      "Email Address",
      "Mobile Number",
      "Office Address",
      "Business Address",
    ],
  },
  {
    heading: "Business Information",
    items: [
      "Company Profile",
      "Business Category",
      "Products and Services",
      "Website URL",
      "Social Media Profiles",
    ],
  },
  {
    heading: "Recruitment Information — For Job Seekers",
    items: [
      "Resume or CV",
      "Educational Qualifications",
      "Employment History",
      "Skills",
      "Certifications",
      "Portfolio Links",
    ],
  },
  {
    heading: "Recruitment Information — For Employers",
    items: ["Company Information", "Recruiter Contact Details", "Job Listings"],
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

/** Renders the dpdp compliance page client interface. */
export default function DpdpCompliancePageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="DPDP Act Compliance Notice" />

      {/* Intro + Table of contents */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <div className="rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-[#616C74] sm:text-base">
              ToolingTrends.com (&ldquo;Website&rdquo;, &ldquo;Platform&rdquo;,
              &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;),
              owned and operated by Maxx Business Media Private Limited, is
              committed to protecting the personal data of our users and
              complying with the applicable requirements of the Digital
              Personal Data Protection Act, 2023 (India) (&ldquo;DPDP
              Act&rdquo;) and related rules, as amended from time to time.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              This Notice explains how we collect, process, store, share, and
              protect your personal data when you use our Website and
              services.
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

                  {/* Section 2: personal data categories */}
                  {section.id === "personal-data-collected" && (
                    <div className="mt-2 space-y-6">
                      {DATA_CATEGORIES.map((cat) => (
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
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a3d47]">
                          Payment Information
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                          For paid services, we may collect billing-related
                          information necessary to process transactions.
                          Sensitive payment details (such as complete card
                          information) are typically processed by secure
                          third-party payment service providers and are not
                          stored by ToolingTrends.com unless required by law.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#2a3d47]">
                          Technical Information
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                          We may automatically collect:
                        </p>
                        <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          {[
                            "IP Address",
                            "Browser Type",
                            "Device Information",
                            "Operating System",
                            "Session Information",
                            "Website Usage Data",
                            "Cookie Information",
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

                  {section.id === "grievance-officer" && (
                    <div className="mt-4 rounded-xl bg-[#f8f9fb] p-4 text-sm leading-relaxed text-[#2a3d47]">
                      <p className="font-medium">Grievance Officer</p>
                      <p>Maxx Business Media Private Limited</p>
                      <p className="mt-2">
                        Email:{" "}
                        <a
                          href="mailto:privacy@toolingtrends.com"
                          className="text-[#004d73] hover:underline"
                        >
                          privacy@toolingtrends.com
                        </a>
                      </p>
                      <p>Business Address: Bengaluru, Karnataka, India</p>
                      <p className="mt-2 text-xs text-[#616C74]">
                        Once appointed, the name and contact details of the
                        Grievance Officer will be published on this page.
                      </p>
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

