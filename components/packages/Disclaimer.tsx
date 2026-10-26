/** Implements the packages disclaimer component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "general-information",
    title: "1. General Information",
    content: [
      "The content available on ToolingTrends.com is provided for general informational, educational, and business networking purposes only.",
      "While we strive to publish accurate, current, and reliable information, we do not guarantee that all information on the Website is complete, accurate, reliable, or up to date.",
      "Users should independently verify any information before making business, financial, technical, or commercial decisions.",
    ],
  },
  {
    id: "no-professional-advice",
    title: "2. No Professional Advice",
    content: [
      "The information published on ToolingTrends.com should not be considered:",
      [
        "Legal advice",
        "Financial advice",
        "Investment advice",
        "Tax advice",
        "Engineering certification",
        "Technical consulting",
        "Safety certification",
        "Product compliance advice",
        "Employment advice",
      ],
      "Where professional guidance is required, users should consult appropriately qualified professionals.",
    ],
  },
  {
    id: "editorial-content",
    title: "3. Editorial Content",
    content: [
      "Our editorial articles, news reports, interviews, industry insights, and opinion pieces are published to inform and educate our audience.",
      "Opinions expressed by authors, guest contributors, or interviewees are their own and do not necessarily reflect the views of ToolingTrends.com or Maxx Business Media Private Limited.",
      "Although we make reasonable efforts to ensure editorial accuracy, errors or omissions may occur.",
    ],
  },
  {
    id: "business-directory",
    title: "4. Business Directory",
    content: [
      "ToolingTrends.com provides a directory of manufacturers, suppliers, distributors, service providers, consultants, educational institutions, and other businesses.",
      "We do not:",
      [
        "Endorse listed businesses",
        "Verify every claim made in company profiles",
        "Guarantee the quality of products or services",
        "Confirm the financial stability or legal status of listed companies",
        "Act as an intermediary in commercial transactions",
      ],
      "Users should conduct their own due diligence before entering into any business relationship.",
    ],
  },
  {
    id: "product-information",
    title: "5. Product Information",
    content: [
      "Product descriptions, specifications, catalogues, brochures, photographs, videos, and technical information displayed on the Platform are generally supplied by manufacturers, suppliers, or advertisers.",
      "ToolingTrends.com does not warrant:",
      [
        "Product performance",
        "Product availability",
        "Technical accuracy",
        "Compliance with applicable regulations",
        "Suitability for a particular purpose",
      ],
      "Users should verify specifications directly with the relevant supplier before purchasing or using any product.",
    ],
  },
  {
    id: "job-portal",
    title: "6. Job Portal",
    content: [
      "ToolingTrends.com provides a platform connecting employers and job seekers.",
      "We do not:",
      [
        "Guarantee employment opportunities",
        "Verify every employer or candidate",
        "Guarantee the authenticity of all job postings",
        "Participate in recruitment decisions",
        "Guarantee interview invitations or employment offers",
      ],
      "Employers and candidates are responsible for conducting appropriate background checks and exercising reasonable caution throughout the recruitment process.",
    ],
  },
  {
    id: "event-listings",
    title: "7. Event Listings",
    content: [
      "We may publish or promote trade shows, conferences, webinars, exhibitions, seminars, and other industry events.",
      "ToolingTrends.com is not responsible for:",
      [
        "Event cancellations",
        "Venue changes",
        "Schedule modifications",
        "Registration disputes",
        "Ticketing issues",
        "Speaker availability",
        "Event quality",
      ],
      "Participants should confirm event details directly with the event organizer.",
    ],
  },
  {
    id: "advertising-sponsored-content",
    title: "8. Advertising and Sponsored Content",
    content: [
      "The Website may display:",
      [
        "Banner advertisements",
        "Sponsored articles",
        "Sponsored interviews",
        "Press releases",
        "Product promotions",
        "Company announcements",
        "Promotional videos",
        "Newsletter advertisements",
      ],
      "Publication of advertising or sponsored content does not constitute an endorsement or recommendation by ToolingTrends.com.",
      "Advertisers remain solely responsible for the accuracy, legality, and completeness of their promotional materials.",
    ],
  },
  {
    id: "third-party-links",
    title: "9. Third-Party Links",
    content: [
      "Our Website may contain links to external websites or online services operated by third parties.",
      "These links are provided for convenience only.",
      "ToolingTrends.com has no control over the content, availability, privacy practices, or security of third-party websites and does not accept responsibility for any loss or damage arising from their use.",
      "Users access third-party websites at their own risk.",
    ],
  },
  {
    id: "user-generated-content",
    title: "10. User-Generated Content",
    content: [
      "Businesses, employers, advertisers, contributors, and users may submit content to the Platform. This may include:",
      [
        "Company profiles",
        "Job postings",
        "Articles",
        "Press releases",
        "Product information",
        "Reviews",
        "Comments",
        "Images",
        "Videos",
      ],
      "Such content reflects the views of its respective author and not necessarily those of ToolingTrends.com.",
      "While we may review content for compliance with our policies, we do not guarantee the accuracy or completeness of all user-submitted material.",
    ],
  },
  {
    id: "intellectual-property",
    title: "11. Intellectual Property",
    content: [
      "All trademarks, company names, product names, and logos appearing on the Website remain the property of their respective owners unless otherwise stated.",
      "Their appearance on ToolingTrends.com does not imply sponsorship, endorsement, or affiliation unless expressly indicated.",
    ],
  },
  {
    id: "website-availability",
    title: "12. Website Availability",
    content: [
      "We strive to keep the Website available and functioning efficiently. However, we do not guarantee uninterrupted access.",
      "The Website may become temporarily unavailable due to:",
      [
        "Scheduled maintenance",
        "Technical issues",
        "Internet disruptions",
        "Cybersecurity incidents",
        "Force majeure events",
        "Software updates",
      ],
      "We shall not be liable for losses resulting from temporary interruptions.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "13. Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, Maxx Business Media Private Limited and ToolingTrends.com shall not be liable for any:",
      [
        "Direct damages",
        "Indirect damages",
        "Incidental damages",
        "Consequential damages",
        "Loss of profits",
        "Loss of business opportunities",
        "Loss of goodwill",
        "Loss of data",
        "Business interruption",
      ],
      "arising from or related to:",
      [
        "Use of the Website",
        "Reliance on published information",
        "User-generated content",
        "Advertisements",
        "Job postings",
        "Business listings",
        "Event information",
        "Third-party services",
      ],
      "Where liability cannot be excluded by law, it shall be limited to the amount paid by the user for the specific service giving rise to the claim.",
    ],
  },
  {
    id: "no-warranties",
    title: "14. No Warranties",
    content: [
      'The Website and all content are provided on an "as is" and "as available" basis.',
      "To the fullest extent permitted by law, ToolingTrends.com disclaims all warranties, whether express or implied, including but not limited to:",
      [
        "Merchantability",
        "Fitness for a particular purpose",
        "Non-infringement",
        "Accuracy",
        "Reliability",
        "Availability",
        "Security",
      ],
      "We do not warrant that the Website will be free from errors, viruses, or other harmful components.",
    ],
  },
  {
    id: "user-responsibility",
    title: "15. User Responsibility",
    content: [
      "Users are solely responsible for:",
      [
        "Verifying information before relying on it",
        "Conducting appropriate due diligence",
        "Ensuring compliance with applicable laws",
        "Protecting their own systems and data when accessing the Website or interacting with third-party services",
      ],
    ],
  },
  {
    id: "changes-to-disclaimer",
    title: "16. Changes to This Disclaimer",
    content: [
      "We may update this Disclaimer from time to time to reflect changes in our services, legal requirements, or operational practices.",
      "The updated version will be published on this page with a revised Effective Date.",
      "Continued use of the Website after such updates constitutes acceptance of the revised Disclaimer.",
    ],
  },
  {
    id: "contact",
    title: "17. Contact Us",
    content: [
      "If you have any questions regarding this Disclaimer, please contact:",
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

/** Renders the disclaimer page client interface. */
export default function DisclaimerPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Disclaimer" />

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
              This Disclaimer governs your use of ToolingTrends.com and all
              related services, including our news portal, business
              directory, job portal, event listings, sponsored content,
              advertising services, newsletters, and digital publications.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By accessing or using this Website, you acknowledge that you
              have read, understood, and agreed to this Disclaimer.
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

