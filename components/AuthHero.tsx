import Link from "next/link"

type AuthHeroProps = {
  title: string
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
      />
    </svg>
  )
}

export default function AuthHero({ title }: AuthHeroProps) {
  return (
    <section className="relative bg-[#141719] border-b border-white/5 overflow-hidden">
      {/* Subtle diagonal grid texture, matching the reference background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 64px)",
        }}
      />
      {/* Soft vignette so the texture fades toward the edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141719] via-transparent to-[#141719] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-5 py-16 md:py-20 text-center">
        <h1 className="text-white text-[32px] sm:text-[38px] font-bold leading-tight mb-4">
          {title}
        </h1>

        <div className="flex items-center justify-center gap-3 text-[14px]">
          <Link href="/" className="text-white/90 hover:text-[#0073ff] transition-colors font-medium">
            Home
          </Link>
          <ArrowIcon className="w-[18px] h-3 text-white/40" />
          <span className="text-white/50">{title}</span>
        </div>
      </div>
    </section>
  )
}