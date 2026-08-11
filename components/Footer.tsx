import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import BackToTop from "./BackToTop";
import type { Post } from "@/types/Post";

const TOP_CATEGORIES = [
  { label: "Tech", href: "/topics" },
  { label: "Innovation", href: "/topics/advanced-manufacturing" },
  { label: "Robotics", href: "/topics/factory-automation" },
  { label: "Software", href: "/topics/cad-cam-cae" },
  { label: "Gadget", href: "/products" },
  { label: "Automation", href: "/topics/factory-automation" },
  { label: "Digital", href: "/topics/smart-manufacturing" },
  { label: "Future", href: "/topics/manufacturing-technologies" },
];

const TAGS = [
  "Beauty",
  "Branding",
  "Business",
  "Food",
  "Gaming",
  "Makeup",
  "Marketing",
  "Politics",
  "Printing",
  "Social",
  "Sports",
  "Technology",
  "Travel",
  "Trip",
];

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.259 5.686L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function PulseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 12h3l2-5 3 10 2-6 2 3h6" />
    </svg>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5">
      <h5 className="text-white text-[18px] font-bold mb-3">{children}</h5>
      <span className="block w-10 h-[3px] bg-white rounded-full" aria-hidden />
    </div>
  );
}

function getAuthorName(post: Post) {
  if (post.author && typeof post.author === "object" && post.author.name) {
    return post.author.name;
  }
  const company = (post as any).Company || (post as any).company;
  if (company?.name) return company.name;
  return "rstheme";
}

function getImageUrl(post: Post) {
  if (post.imageUrl?.startsWith("http")) return post.imageUrl;
  if (post.imageUrl) return `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`;
  return "/placeholder.svg";
}

async function getRecentPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=3`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const posts: Post[] = data.data || data;
    if (!Array.isArray(posts)) return [];
    return posts
      .sort((a, b) => {
        const aTime = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Footer() {
  const recentPosts = await getRecentPosts();

  const socialLinks = [
    { label: "Facebook", href: "#", Icon: Facebook },
    { label: "Instagram", href: "#", Icon: Instagram },
    { label: "LinkedIn", href: "#", Icon: Linkedin },
    { label: "X", href: "#", Icon: XIcon },
  ];

  return (
    <footer className="relative bg-[#121213] text-[#a1a1a1]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-5 pt-14 md:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_1.2fr_1.1fr] gap-10 lg:gap-8">

          {/* ================= COL 1: BRAND ================= */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo5.png"
                alt="Tooling Trends"
                width={180}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-[14px] leading-relaxed text-[#a1a1a1] mb-5 max-w-[280px]">
              Tooling Technology covers the full life cycle of mold design, build,
              and maintenance—solutions for professionals shaping modern manufacturing.
            </p>

            <div className="flex items-center gap-2.5 mb-5">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-[4px] bg-[#1a1c24] text-white hover:bg-[#0073ff] transition-colors"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/coming-soon"
                className="inline-flex items-center gap-2 h-[42px] px-3 rounded-[4px] border border-white/20 bg-[#111318] hover:border-white/40 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden>
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.293 12l2.405-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <span className="leading-tight">
                  <span className="block text-[9px] text-white/70">GET IT ON</span>
                  <span className="block text-[13px] font-semibold text-white">Google Play</span>
                </span>
              </Link>

              <Link
                href="/coming-soon"
                className="inline-flex items-center gap-2 h-[42px] px-3 rounded-[4px] border border-white/20 bg-[#111318] hover:border-white/40 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="leading-tight">
                  <span className="block text-[9px] text-white/70">Download on the</span>
                  <span className="block text-[13px] font-semibold text-white">App Store</span>
                </span>
              </Link>
            </div>
          </div>

          {/* ================= COL 2: TOP CATEGORIES ================= */}
          <div>
            <SectionTitle>Top Categories</SectionTitle>
            <ul className="space-y-2.5">
              {TOP_CATEGORIES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2.5 text-[14px] text-[#a1a1a1] hover:text-white transition-colors"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-white/70 group-hover:bg-[#0073ff] shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= COL 3: RECENT POST ================= */}
          <div>
            <SectionTitle>Recent Post</SectionTitle>
            <div>
              {recentPosts.length > 0 ? (
                recentPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className={`group flex items-start gap-3 ${i < recentPosts.length - 1 ? "pb-4 mb-4 border-b border-white/10" : ""
                      }`}
                  >
                    <div className="relative w-[64px] h-[64px] rounded-[6px] overflow-hidden shrink-0">
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="text-[14px] font-semibold text-white leading-snug mb-1.5 line-clamp-2 group-hover:text-[#0073ff] transition-colors">
                        {post.title}
                      </h6>
                      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#8a8b93]">
                        <li>By {getAuthorName(post)}</li>
                        {typeof post.views === "number" && (
                          <li className="inline-flex items-center gap-1">
                            <PulseIcon className="w-3 h-3 text-[#0073ff]" />
                            {post.views.toLocaleString()} Views
                          </li>
                        )}
                      </ul>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-[13px] text-[#8a8b93]">No recent posts yet.</p>
              )}
            </div>
          </div>

          {/* ================= COL 4: TAGS ================= */}
          <div>
            <SectionTitle>Tags</SectionTitle>
            <div className="border border-white/10 rounded-[6px] p-3.5">
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                    className="inline-block px-2.5 py-1.5 text-[12px] text-white bg-[#1a1c24] rounded-[3px] hover:bg-[#0073ff] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-white/10 bg-[#1D2125]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
          <p className="text-[#8a8b93] text-center sm:text-left">
            © {new Date().getFullYear()} Tooling Trends. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-[#8a8b93] hover:text-white transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms" className="text-[#8a8b93] hover:text-white transition-colors">
              Terms &amp; Agreements
            </Link>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}