/** Implements the packages copyright ip policy component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "ownership-of-website-content",
    title: "1. Ownership of Website Content",
    content: [
      "Unless otherwise stated, all intellectual property rights in the Website and its content are owned by or licensed to Maxx Business Media Private Limited. This includes, but is not limited to:",
      [
        "Website design and layout",
        "ToolingTrends.com branding",
        "Logos and trademarks owned by us",
        "Graphics and icons",
        "Original articles and editorials",
        "News content created by our editorial team",
        "Videos and podcasts produced by us",
        "Databases and directory structures",
        "Software, code, and functionality",
        "User interface and visual elements",
        "Marketing materials",
        "Digital publications",
        "Original photographs and illustrations",
      ],
      "These materials are protected by applicable copyright, trademark, and intellectual property laws.",
    ],
  },
  {
    id: "trademarks",
    title: "2. Trademarks",
    content: [
      '"ToolingTrends.com", its logo, branding elements, slogans, and other marks used by Maxx Business Media Private Limited are protected by applicable trademark laws.',
      "Nothing in this Policy grants any right to use our trademarks without prior written permission.",
      "All third-party trademarks displayed on the Website remain the property of their respective owners and are used only for identification, reference, or with permission where applicable.",
    ],
  },
  {
    id: "user-submitted-content",
    title: "3. User-Submitted Content",
    content: [
      "Users may submit content including:",
      [
        "Company profiles",
        "Product information",
        "Press releases",
        "Sponsored articles",
        "Event listings",
        "Job postings",
        "Images",
        "Videos",
        "Documents",
        "White papers",
        "Technical articles",
        "Comments",
        "Reviews",
      ],
      "You retain ownership of the intellectual property rights in the content you submit.",
      "By submitting content to ToolingTrends.com, you grant Maxx Business Media Private Limited a non-exclusive, worldwide, royalty-free, transferable, and sublicensable license to:",
      [
        "Display and publish the content",
        "Reproduce and distribute the content",
        "Edit formatting for consistency",
        "Resize images for technical compatibility",
        "Promote the content through newsletters, social media, and marketing campaigns",
        "Archive the content for operational, historical, and legal purposes",
      ],
      "This license continues for as long as the content remains on the Platform and as otherwise necessary for legitimate business or legal purposes.",
    ],
  },
  {
    id: "your-responsibilities",
    title: "4. Your Responsibilities",
    content: [
      "When submitting content, you represent and warrant that:",
      [
        "You own the content or have the necessary rights and permissions to use it",
        "The content does not infringe any copyright, trademark, patent, trade secret, or other intellectual property right",
        "The content does not violate confidentiality obligations",
        "You have obtained any necessary permissions from identifiable individuals featured in images or videos where required",
        "The content complies with applicable laws and our Terms & Conditions",
      ],
      "You are solely responsible for the content you submit.",
    ],
  },
  {
    id: "permitted-use",
    title: "5. Permitted Use of Website Content",
    content: [
      "You may:",
      [
        "View content for personal or internal business purposes",
        "Print limited portions of content for non-commercial reference",
        "Share links to publicly available pages",
        "Cite brief excerpts with proper attribution where permitted by applicable law",
      ],
      "You may not:",
      [
        "Copy or reproduce substantial portions of Website content",
        "Republish our articles without written permission",
        "Scrape or systematically extract data from the Website",
        "Use automated tools to harvest content without authorization",
        "Remove copyright notices or proprietary markings",
        "Modify or create derivative works from our original content without permission",
        "Sell, license, or commercially exploit our content without authorization",
      ],
    ],
  },
  {
    id: "third-party-content",
    title: "6. Third-Party Content",
    content: [
      "Some content published on ToolingTrends.com may be provided by:",
      [
        "Advertisers",
        "Sponsors",
        "Industry partners",
        "Employers",
        "Business listing owners",
        "Event organizers",
        "Guest authors",
        "News contributors",
      ],
      "The intellectual property rights in such content remain with the respective owners unless otherwise agreed.",
      "Publication on our Platform does not transfer ownership of third-party content to ToolingTrends.com.",
    ],
  },
  {
    id: "copyright-infringement-reporting",
    title: "7. Copyright Infringement Reporting",
    content: [
      "If you believe that your copyrighted work has been used on ToolingTrends.com without authorization, you may submit a written notice including:",
      [
        "Your full name and contact information",
        "A description of the copyrighted work",
        "The URL(s) or location of the allegedly infringing material",
        "A statement explaining why you believe the use is unauthorized",
        "Evidence of your ownership or authority to act on behalf of the copyright owner",
        "A declaration that the information provided is accurate and made in good faith",
      ],
      "Upon receiving a complete notice, we will review the claim and take appropriate action where warranted.",
    ],
  },
  {
    id: "repeat-infringers",
    title: "8. Repeat Infringers",
    content: [
      "ToolingTrends.com reserves the right to suspend or terminate accounts that repeatedly infringe the intellectual property rights of others.",
      "Repeated violations may result in permanent removal from the Platform.",
    ],
  },
  {
    id: "counter-notification",
    title: "9. Counter-Notification",
    content: [
      "If your content has been removed due to a copyright complaint and you believe the removal was made in error or that you have the legal right to use the material, you may submit a counter-notification with supporting documentation.",
      "We will review the counter-notification and, where appropriate, may restore the content in accordance with applicable law.",
    ],
  },
  {
    id: "ip-complaints-beyond-copyright",
    title: "10. Intellectual Property Complaints Beyond Copyright",
    content: [
      "We also accept complaints relating to:",
      [
        "Trademark infringement",
        "Patent infringement",
        "Design rights",
        "Trade secrets",
        "Domain name misuse",
        "Unauthorized use of logos or branding",
      ],
      "Each complaint should include sufficient information to allow us to evaluate the issue.",
    ],
  },
  {
    id: "reservation-of-rights",
    title: "11. Reservation of Rights",
    content: [
      "Maxx Business Media Private Limited reserves all rights not expressly granted under this Policy.",
      "Nothing in this Policy transfers ownership of any intellectual property rights to users, advertisers, or third parties.",
    ],
  },
  {
    id: "enforcement",
    title: "12. Enforcement",
    content: [
      "Where we reasonably believe that intellectual property rights have been infringed, we may:",
      [
        "Remove or disable access to content",
        "Request additional information from the parties involved",
        "Suspend user accounts",
        "Terminate repeat offenders",
        "Cooperate with law enforcement or competent authorities where legally required",
      ],
      "Our actions are intended to protect the rights of all parties while maintaining the integrity of the Platform.",
    ],
  },
  {
    id: "disclaimer",
    title: "13. Disclaimer",
    content: [
      "ToolingTrends.com acts as a publishing and networking platform.",
      "While we review submitted content where appropriate, we cannot guarantee that all user-submitted material is free from intellectual property issues.",
      "Users are responsible for ensuring that the content they submit complies with applicable intellectual property laws.",
    ],
  },
  {
    id: "changes-to-policy",
    title: "14. Changes to This Policy",
    content: [
      "We may update this Copyright & Intellectual Property Policy from time to time.",
      "The revised version will be published on this page with an updated Effective Date.",
      "Continued use of ToolingTrends.com after such updates constitutes acceptance of the revised Policy.",
    ],
  },
  {
    id: "contact",
    title: "15. Contact Us",
    content: [
      "To report copyright or intellectual property concerns, please contact:",
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

/** Renders the copyright ip policy page client interface. */
export default function CopyrightIpPolicyPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Copyright & IP Policy" />

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
              ToolingTrends.com respects the intellectual property rights of
              others and expects all users, advertisers, contributors,
              businesses, employers, sponsors, and partners to do the same.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              This Copyright &amp; Intellectual Property Policy explains the
              ownership of content on our Platform, the responsibilities of
              users, and the procedure for reporting alleged copyright
              infringement.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By using ToolingTrends.com, you agree to comply with this
              Policy.
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

