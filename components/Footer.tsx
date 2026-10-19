import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import Banner from "@/components/Banners/Banner"
import { getCategoryUrl } from "@/lib/topic"

type FooterLink = {
  label: string
  href: string
}

function XIcon({ size = 18 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={size} height={size}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.259 5.686L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function FooterNav({ title, label, links, className = "" }: {
  title: string
  label: string
  links: FooterLink[]
  className?: string
}) {
  return (
    <nav aria-label={label} className={className}>
      <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-white">{title}</h2>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link href={link.href} className="inline-block text-[#CCCCCC] transition-colors hover:translate-x-1 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const TOPIC_LINKS: FooterLink[] = [
  { label: "Machining", href: getCategoryUrl("machining") },
  { label: "Cutting Tools", href: getCategoryUrl("cutting-tools") },
  { label: "Dies Moulds Tooling", href: getCategoryUrl("dies-moulds-tooling") },
  { label: "Metrology & Quality", href: getCategoryUrl("metrology-quality") },
  { label: "Factory Automation", href: getCategoryUrl("factory-automation") },
  { label: "CAD/CAM/CAE", href: getCategoryUrl("cad-cam-cae") },
  { label: "Manufacturing Technologies", href: getCategoryUrl("manufacturing-technologies") },
  { label: "View All", href: "/topics" },
]

const RESOURCE_LINKS: FooterLink[] = [
  { label: "Industry Talks", href: "/industry-talks" },
  { label: "News Letter", href: "/news" },
  { label: "Webinars", href: "/webinars" },
  { label: "Packages & Pricing", href: "/packages" },
  { label: "Contact Us", href: "/contact" },
  { label: "Find a Supplier", href: "/suppliers" },
]

const MAGAZINE_LINKS: FooterLink[] = [
  { label: "Latest Issue", href: "/magazines#latest-issue" },
  { label: "Archives", href: "/articles/issues" },
  { label: "Subscribe", href: "/subscribe" },
  { label: "Blogs", href: "/blog" },
]

const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Advertising Policy", href: "/advertising-policy" },
  { label: "DPDP Act Compliance", href: "/dpdp-compliance-notice" },
  { label: "Copyright & IP Policy", href: "/copyright-ip-policy" },
  { label: "Refund & Cancellation", href: "/refund-cancellation-policy" },
]

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: Linkedin, className: "bg-[#0A66C2] hover:bg-[#084d94]" },
  { label: "Facebook", href: "https://www.facebook.com/", Icon: Facebook, className: "bg-[#1877F2] hover:bg-[#145dbf]" },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: Youtube, className: "bg-[#FF0000] hover:bg-[#cc0000]" },
  { label: "X", href: "https://x.com/", Icon: XIcon, className: "bg-black hover:bg-gray-800" },
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram, className: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90" },
]

export default function Footer() {
  return (
    <>
      <Banner placement="FOOTER" />
      <footer className="relative overflow-hidden bg-[#171A1E] text-white">
        <div className="relative z-10 py-12 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-10">
              <div className="col-span-2 sm:col-span-3 lg:col-span-3">
                <Link href="/" className="mb-4 inline-block">
                  <Image
                    src="/images/logo5.png"
                    alt="Metrology"
                    width={300}
                    height={100}
                    className="h-[58px] w-auto max-w-full object-contain object-left sm:h-[66px]"
                  />
                </Link>
                <p className="mb-5 max-w-md text-sm leading-relaxed">
                  Metrology delivers news, insights, and practical resources on precision measurement, inspection, calibration, and quality across the manufacturing lifecycle.
                </p>
                <div className="mb-6 flex flex-wrap items-center gap-3" aria-label="Metrology on social media">
                  {SOCIAL_LINKS.map(({ label, href, Icon, className }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-white transition-all duration-300 hover:scale-110 ${className}`}
                      aria-label={label}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/coming-soon" aria-label="Get it on Google Play" className="inline-block transition-opacity hover:opacity-80">
                    <Image src="/images/google-play.png" alt="Get it on Google Play" width={135} height={40} className="h-10 w-auto object-contain" />
                  </Link>
                  <Link href="/coming-soon" aria-label="Download on the App Store" className="inline-block transition-opacity hover:opacity-80">
                    <Image src="/images/apple-store.png" alt="Download on the App Store" width={135} height={40} className="h-10 w-auto object-contain" />
                  </Link>
                </div>
              </div>

              <FooterNav title="Topics" label="Topics" links={TOPIC_LINKS} className="lg:col-span-2" />
              <FooterNav title="Resources" label="Resources" links={RESOURCE_LINKS} className="lg:col-span-2" />
              <FooterNav title="Magazine" label="Magazine" links={MAGAZINE_LINKS} className="lg:col-span-2" />
              <FooterNav title="Legal & Policies" label="Legal and policies" links={LEGAL_LINKS} className="col-span-2 sm:col-span-1 lg:col-span-3" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 bg-[#1D2125] text-white">
          <div className="mx-auto max-w-[1320px] px-4 py-5 text-center text-xs sm:px-6 sm:py-6 sm:text-sm lg:px-8">
            Copyright &copy; {new Date().getFullYear()} <span className="font-semibold">Metrology</span>. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
