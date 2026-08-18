import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import BackToTop from "./BackToTop";
import type { Post } from "@/types/Post";
import { buildFooterCategoryColumns } from "@/lib/footerCategories";

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
      <span className="block w-10 h-[3px] bg-[#00B5ED] rounded-full" aria-hidden />
    </div>
  );
}

function CategoryLinks({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="group inline-flex items-center gap-2.5 text-[14px] text-[#CCCCCC] hover:text-[#00B5ED] transition-colors"
          >
            <span className="w-[5px] h-[5px] rounded-full bg-[#00B5ED]/70 group-hover:bg-[#0073FF] shrink-0" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
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

async function getFooterCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?parentsOnly=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { top: [], more: [] };
    const data = await res.json();
    const parents = Array.isArray(data) ? data : [];
    return buildFooterCategoryColumns(
      parents.map((c: { name: string; slug: string }) => ({
        name: c.name,
        slug: c.slug,
      }))
    );
  } catch {
    return { top: [], more: [] };
  }
}

const RESOURCE_LINKS = [
  { label: "Newsletter", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

export default async function Footer() {
  const [recentPosts, { top: TOP_CATEGORIES, more: MORE_CATEGORIES }] =
    await Promise.all([getRecentPosts(), getFooterCategories()]);

  const socialLinks = [
    { label: "Facebook", href: "#", Icon: Facebook },
    { label: "Instagram", href: "#", Icon: Instagram },
    { label: "LinkedIn", href: "#", Icon: Linkedin },
    { label: "X", href: "#", Icon: XIcon },
  ];

  return (
    <footer className="relative bg-[#171A1E] text-[#CCCCCC] border-t border-[#292C30]">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* ================= COL 1: BRAND ================= */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo5.png"
                alt="Tooling Trends"
                width={300}
                height={66}
                className="h-24 w-auto object-contain"
              />
            </Link>

            <p className="text-[14px] leading-relaxed text-[#CCCCCC] mb-5 max-w-[280px]">
              Tooling Technology covers the full life cycle of mold design, build,
              and maintenance—solutions for professionals shaping modern manufacturing.
            </p>

            <div className="flex items-center gap-2.5 mb-5">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-[6px] bg-[#1D2125] border border-[#292C30] text-white hover:bg-[#0073FF] hover:border-[#0073FF] transition-colors"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/coming-soon"
                className="inline-block opacity-90 hover:opacity-100 transition-opacity"
                aria-label="Get it on Google Play"
              >
                <Image
                  src="/images/google-play.png"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-[40px] w-auto object-contain"
                />
              </Link>

              <Link
                href="/coming-soon"
                className="inline-block opacity-90 hover:opacity-100 transition-opacity"
                aria-label="Download on the App Store"
              >
                <Image
                  src="/images/apple-store.png"
                  alt="Download on the App Store"
                  width={135}
                  height={40}
                  className="h-[40px] w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* ================= COL 2: TOP CATEGORIES ================= */}
          <div>
            <SectionTitle>Top Categories</SectionTitle>
            <CategoryLinks items={TOP_CATEGORIES} />
          </div>

          {/* ================= COL 3: MORE CATEGORIES ================= */}
          <div>
            <SectionTitle>More Categories</SectionTitle>
            <CategoryLinks items={MORE_CATEGORIES} />
          </div>

          {/* ================= COL 4: RESOURCES ================= */}
          <div>
            <SectionTitle>Resources</SectionTitle>
            <CategoryLinks items={RESOURCE_LINKS} />
          </div>

          {/* ================= COL 5: RECENT POSTS ================= */}
          <div>
            <SectionTitle>Recent Post</SectionTitle>
            <div>
              {recentPosts.length > 0 ? (
                recentPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className={`group flex items-start gap-3 ${
                      i < recentPosts.length - 1 ? "pb-4 mb-4 border-b border-[#292C30]" : ""
                    }`}
                  >
                    <div className="relative w-[64px] h-[64px] rounded-[6px] overflow-hidden shrink-0 bg-[#1D2125]">
                      <Image
                        src={getImageUrl(post)}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="text-[14px] font-semibold text-white leading-snug mb-1.5 line-clamp-2 group-hover:text-[#00B5ED] transition-colors">
                        {post.title}
                      </h6>
                      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#B8B8B8]">
                        <li>By {getAuthorName(post)}</li>
                        {typeof post.views === "number" && (
                          <li className="inline-flex items-center gap-1">
                            <PulseIcon className="w-3 h-3 text-[#0073FF]" />
                            {post.views.toLocaleString()} Views
                          </li>
                        )}
                      </ul>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-[13px] text-[#B8B8B8]">No recent posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-[#292C30] bg-[#1D2125]">
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
          <p className="text-[#B8B8B8] text-center sm:text-left">
            © {new Date().getFullYear()} Metrology. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-[#B8B8B8] hover:text-[#00B5ED] transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms" className="text-[#B8B8B8] hover:text-[#00B5ED] transition-colors">
              Terms &amp; Agreements
            </Link>
          </div>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}