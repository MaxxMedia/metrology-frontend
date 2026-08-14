import Image from "next/image";
import Link from "next/link";

type PackagesHeroProps = {
  title: string;
  description?: string;
  breadcrumbLabel?: string;
};

export default function PackagesHero({
  title,
  description,
  breadcrumbLabel,
}: PackagesHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0f1b24]">
      <Image
        src="/heroimage.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09141d]/90 via-[#102432]/72 to-[#102432]/58" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex flex-wrap items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm sm:text-xs">
            <Link href="/" className="transition-colors hover:text-white">
              Metrology
            </Link>
            <span className="mx-3 text-white/40">/</span>
            <span className="text-white">{breadcrumbLabel ?? title}</span>
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
