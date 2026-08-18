"use client";

import Image from "next/image";
import { FormEvent, useState, type CSSProperties } from "react";
import { subscribeNewsletter } from "@/lib/api/newsletter";
import { CheckCircle2, AlertCircle } from "lucide-react";

const BG = "/images/newsletter/nerio_adds-1.jpg";

const DECOR: {
  id: string;
  src: string;
  alt: string;
  className: string;
  style?: CSSProperties;
}[] = [
  {
    id: "ed663c3",
    src: "/images/newsletter/cta-thumb-01.png",
    alt: "Newsletter preview 1",
    className:
      "pointer-events-none absolute right-[4%] top-[8%] z-[3] hidden w-[42%] max-w-[340px] md:block",
    style: {
      transform: "perspective(900px) rotateY(-18deg) rotateX(6deg) rotateZ(-4deg)",
    },
  },
  {
    id: "d8aaed0",
    src: "/images/newsletter/newsletter-dot.png",
    alt: "",
    className:
      "pointer-events-none absolute right-[46%] top-[10%] z-[1] hidden w-[72px] opacity-70 md:block",
  },
  {
    id: "453c2b2",
    src: "/images/newsletter/cta-thumb-02.png",
    alt: "Newsletter preview 2",
    className:
      "pointer-events-none absolute -right-[2%] bottom-[6%] z-[4] w-[48%] max-w-[380px] sm:w-[40%]",
    style: {
      transform: "perspective(900px) rotateY(-22deg) rotateX(8deg) rotateZ(-6deg)",
    },
  },
  {
    id: "28571bb",
    src: "/images/newsletter/cta-thumb-03.png",
    alt: "Newsletter preview 3",
    className:
      "pointer-events-none absolute right-[18%] bottom-[-8%] z-[2] hidden w-[36%] max-w-[280px] lg:block",
    style: {
      transform: "perspective(900px) rotateY(-16deg) rotateX(4deg) rotateZ(-3deg)",
    },
  },
  {
    id: "d30075a",
    src: "/images/newsletter/cta-thumb-04.png",
    alt: "Newsletter preview 4",
    className:
      "pointer-events-none absolute right-[28%] top-[28%] z-[5] hidden w-[28%] max-w-[220px] lg:block",
    style: {
      transform: "perspective(900px) rotateY(-20deg) rotateX(10deg) rotateZ(-8deg)",
    },
  },
];

const SUBMIT_ARROW = (
  <span className="relative ml-1.5 inline-flex h-[10px] w-[16px] overflow-hidden">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 12"
      className="h-[10px] w-[16px] fill-current transition-transform duration-300 group-hover/btn:translate-x-[120%]"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 12"
      className="absolute left-0 top-0 h-[10px] w-[16px] -translate-x-[120%] fill-current transition-transform duration-300 group-hover/btn:translate-x-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
  </span>
);

export default function NewsLetters() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (!consent) {
      setMessage({ type: "error", text: "Please accept the terms & conditions to subscribe." });
      return;
    }

    setPending(true);
    setMessage(null);

    try {
      const result = await subscribeNewsletter({
        email: cleanEmail,
        frequency: "MONTHLY",
        emailSubscribed: true,
      });

      setMessage({
        type: "success",
        text: result.message || "Thank you for subscribing to Metrology News Updates!",
      });
      setEmail("");
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Failed to subscribe. Please try again.";
      setMessage({ type: "error", text });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="w-full bg-[#1D2125] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[12px] sm:rounded-[16px]"
          style={{
            backgroundImage: `url(${BG})`,
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          {/* Soft overlays matching the moody panel */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 70% at 12% 20%, rgba(40, 90, 70, 0.35) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 55% 50%, rgba(20, 40, 80, 0.25) 0%, transparent 60%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(8,10,16,0.35)]" />

          <div className="relative grid min-h-[255px] w-full grid-cols-1 items-center gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-4 lg:py-6">
            {/* Form column */}
            <div className="relative z-10 max-w-[520px]">
              <h3 className="mb-4 text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-white sm:text-[28px] lg:text-[30px]">
                Subscribe News Updates!
              </h3>

              <form
                className="w-full"
                aria-label="Newsletter subscribe"
                noValidate
                onSubmit={onSubmit}
              >
                <div className="flex items-center gap-2 rounded-[10px] bg-white p-1.5 pl-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                  <input
                    type="email"
                    name="your-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-required="true"
                    placeholder="Enter your email..."
                    maxLength={400}
                    disabled={pending}
                    className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[15px] text-[#1D2125] outline-none placeholder:text-[#9AA0A6] disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={pending}
                    className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-[8px] bg-[#0073ff] px-4 py-2.5 text-[14px] font-semibold capitalize text-white transition hover:bg-[#0062d9] disabled:opacity-70 sm:px-5"
                  >
                    {pending ? (
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Subscribing...</span>
                      </span>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        {SUBMIT_ARROW}
                      </>
                    )}
                  </button>
                </div>

                <label className="mt-3.5 flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.45] text-white/90 sm:text-[14px]">
                  <input
                    type="checkbox"
                    name="your-consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-[3px] h-[15px] w-[15px] shrink-0 cursor-pointer rounded-[3px] border border-white/40 bg-transparent accent-[#0073ff]"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <a href="/terms" className="underline underline-offset-2 hover:text-white" target="_blank" rel="noopener noreferrer">
                      terms &amp; conditions
                    </a>
                  </span>
                </label>

                {message && (
                  <div
                    className={`mt-3 flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-[13px] font-medium backdrop-blur-sm ${
                      message.type === "success"
                        ? "border border-emerald-500/30 bg-emerald-500/20 text-[#a7f3d0]"
                        : "border border-rose-500/30 bg-rose-500/20 text-[#fecdd3]"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Decorative thumbs — bleed off the right edge */}
            <div className="relative h-[140px] w-full sm:h-[160px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%]">
              {DECOR.map((item) => (
                <div key={item.id} className={item.className} style={item.style}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={480}
                    height={360}
                    className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                    sizes="(max-width: 1024px) 50vw, 380px"
                    priority={item.id === "453c2b2"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}