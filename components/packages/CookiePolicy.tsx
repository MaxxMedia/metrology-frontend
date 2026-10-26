/** Implements the packages cookie policy component and its related interface behavior. */
import Link from "next/link";
import PackagesHero from "./PackagesHero";

type Section = {
  id: string;
  title: string;
  content: (string | string[])[];
};

const SECTIONS: Section[] = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: [
      "Cookies are small text files placed on your computer, smartphone, tablet, or other device when you visit a website. They help websites recognize your device, remember your preferences, improve performance, and provide a more personalized browsing experience.",
      "Cookies do not typically contain information that directly identifies you, but they may be linked with information you have provided to us.",
    ],
  },
  {
    id: "why-we-use-cookies",
    title: "2. Why We Use Cookies",
    content: [
      "We use cookies to:",
      [
        "Ensure the Website functions properly",
        "Keep users securely logged into their accounts",
        "Remember user preferences and settings",
        "Improve website speed and performance",
        "Analyze visitor traffic and user behavior",
        "Measure the effectiveness of marketing campaigns",
        "Personalize content and recommendations",
        "Support business directory and job portal functionality",
        "Protect against fraudulent or unauthorized activity",
      ],
    ],
  },
  {
    id: "types-of-cookies",
    title: "3. Types of Cookies We Use",
    content: [],
  },
  {
    id: "information-collected",
    title: "4. Information Collected Through Cookies",
    content: [
      "Cookies may collect information such as:",
      [
        "IP address",
        "Device identifier",
        "Browser type",
        "Operating system",
        "Date and time of visit",
        "Referring website",
        "Pages viewed",
        "Clickstream data",
        "Session duration",
        "Language preferences",
      ],
      "This information helps us improve user experience and Website performance.",
    ],
  },
  {
    id: "how-long-cookies-remain",
    title: "5. How Long Cookies Remain on Your Device",
    content: ["Cookies may be:"],
  },
  {
    id: "managing-cookies",
    title: "6. Managing Cookies",
    content: [
      "Most web browsers allow you to manage or disable cookies through browser settings.",
      "You may choose to:",
      [
        "Accept all cookies",
        "Block all cookies",
        "Delete existing cookies",
        "Receive notifications before cookies are stored",
        "Block cookies from specific websites",
      ],
      "Please note that disabling certain cookies may affect the functionality and performance of ToolingTrends.com.",
    ],
  },
  {
    id: "do-not-track",
    title: "7. Do Not Track Signals",
    content: [
      'Some web browsers provide a "Do Not Track" (DNT) feature. As there is no universally accepted standard for responding to DNT signals, our Website may not respond to these settings. You can manage tracking preferences through your browser and available consent tools.',
    ],
  },
  {
    id: "changes-to-policy",
    title: "8. Changes to This Cookie Policy",
    content: [
      "We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices.",
      "The updated version will be published on this page with a revised Effective Date.",
      "Continued use of the Website after changes become effective constitutes acceptance of the updated Cookie Policy.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: [
      "If you have any questions regarding this Cookie Policy or our use of cookies, please contact:",
    ],
  },
];

// Section 3 sub-groups (cookie categories)
const COOKIE_TYPES: { heading: string; intro: string; items: string[] }[] = [
  {
    heading: "A. Essential Cookies",
    intro:
      "These cookies are necessary for the operation of the Website and cannot be disabled through our systems. Examples include:",
    items: [
      "User authentication",
      "Login sessions",
      "Security features",
      "Load balancing",
      "Shopping cart or subscription checkout",
      "Form submission functionality",
    ],
  },
  {
    heading: "B. Performance and Analytics Cookies",
    intro:
      "These cookies help us understand how visitors interact with the Website. They may collect information such as:",
    items: [
      "Pages visited",
      "Time spent on pages",
      "Navigation paths",
      "Device type",
      "Browser type",
      "Operating system",
      "Website performance metrics",
      "Error reports",
    ],
  },
  {
    heading: "C. Functional Cookies",
    intro:
      "These cookies remember choices you make to enhance your experience. Examples include:",
    items: [
      "Preferred language",
      "Region or country",
      "Login preferences",
      "Display settings",
      "Saved searches",
      "Business listing preferences",
    ],
  },
  {
    heading: "D. Advertising and Marketing Cookies",
    intro:
      "These cookies help us display relevant advertisements and measure the performance of advertising campaigns. They may be used to:",
    items: [
      "Show personalized advertisements",
      "Limit the number of times you see an advertisement",
      "Measure campaign performance",
      "Track conversions",
      "Support remarketing campaigns",
    ],
  },
  {
    heading: "E. Third-Party Cookies",
    intro:
      "Certain services integrated into the Website may place their own cookies. Examples include:",
    items: [
      "Analytics providers",
      "Payment gateways",
      "Video hosting services",
      "Social media integrations",
      "Customer support tools",
      "Embedded maps",
      "Marketing platforms",
    ],
  },
];

const COOKIE_DURATIONS: { heading: string; text: string }[] = [
  {
    heading: "Session Cookies",
    text: "These are temporary cookies that are deleted automatically when you close your browser.",
  },
  {
    heading: "Persistent Cookies",
    text: "These remain on your device for a specified period or until you delete them manually. They help remember your preferences across future visits.",
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

/** Renders the cookie policy page client interface. */
export default function CookiePolicyPageClient() {
  return (
    <main className="w-full bg-white">
            <PackagesHero title="Cookie Policy" />

      {/* Intro + Table of contents */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <div className="rounded-2xl border border-[#e5e9ef] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-relaxed text-[#616C74] sm:text-base">
              This Cookie Policy explains how ToolingTrends.com
              (&ldquo;Website&rdquo;, &ldquo;Platform&rdquo;,
              &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;),
              owned and operated by Maxx Business Media Private Limited, uses
              cookies and similar technologies when you visit or use our
              Website.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#616C74] sm:text-base">
              By continuing to use ToolingTrends.com, you consent to the use
              of cookies as described in this Cookie Policy, subject to your
              browser settings and applicable law.
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

                  {/* Section 3: cookie type sub-groups */}
                  {section.id === "types-of-cookies" && (
                    <div className="mt-2 space-y-6">
                      {COOKIE_TYPES.map((type) => (
                        <div key={type.heading}>
                          <h3 className="text-sm font-semibold text-[#2a3d47]">
                            {type.heading}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                            {type.intro}
                          </p>
                          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                            {type.items.map((item) => (
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
                      <p className="text-sm leading-relaxed text-[#616C74]">
                        These third parties have their own privacy and cookie
                        policies, and we encourage you to review them.
                      </p>
                    </div>
                  )}

                  {/* Section 5: session vs persistent */}
                  {section.id === "how-long-cookies-remain" && (
                    <div className="mt-2 space-y-4">
                      {COOKIE_DURATIONS.map((d) => (
                        <div key={d.heading}>
                          <h3 className="text-sm font-semibold text-[#2a3d47]">
                            {d.heading}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[#616C74]">
                            {d.text}
                          </p>
                        </div>
                      ))}
                      <p className="text-sm leading-relaxed text-[#616C74]">
                        The retention period varies depending on the purpose of
                        the cookie.
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

