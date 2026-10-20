export const dynamic = "force-dynamic";

import Image from "next/image"
import Link from "next/link"
import Banner from "@/components/Banners/Banner"
import MagazineGrid, { type Magazine } from "@/components/magazine/MagazineGrid"
import SupplierAds from "@/components/SupplierAds"
import type { Post } from "@/types/Post"


function getCategorySlug(post: Post) {
  if (typeof post.category === "object") {
    return post.category?.slug?.toLowerCase() ?? ""
  }
  return String(post.category ?? "").toLowerCase()
}

function getCategoryName(post: Post) {
  if (typeof post.category === "object") {
    return post.category?.name ?? "Article"
  }
  return String(post.category || "Article")
}

function getSummary(post: Post) {
  if (post.excerpt?.trim()) return post.excerpt.trim()
  if (post.content?.trim()) {
    return post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180)
  }

  const blocks = (post as Post & { contentBlocks?: Array<Record<string, unknown>> }).contentBlocks
  const text = blocks?.map((block) => {
    const value = block.content ?? block.text ?? block.quote
    return typeof value === "string" ? value.replace(/<[^>]+>/g, " ") : ""
  }).filter(Boolean).join(" ").replace(/\s+/g, " ").trim()

  return text ? `${text.slice(0, 180)}${text.length > 180 ? "…" : ""}` : "Read the full article for details."
}

function getImageUrl(url?: string | null) {
  if (!url) return "/placeholder.svg"
  if (/^https?:\/\//i.test(url)) return url
  const base = process.env.NEXT_PUBLIC_API_URL || ""
  return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
}

function formatDate(date?: string | null) {
  if (!date) return ""
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-US", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

export default async function ArticlesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  let posts: Post[] = []
  let magazines: Magazine[] = []

  try {
    const [postsResponse, magazinesResponse] = await Promise.all([
      fetch(`${apiUrl}/api/posts?limit=50`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/magazines`, { cache: "no-store" }),
    ])

    if (postsResponse.ok) {
      const payload = await postsResponse.json()
      posts = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    }
    if (magazinesResponse.ok) {
      const payload = await magazinesResponse.json()
      magazines = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    }
  } catch (error) {
    console.error("Failed to load articles page data:", error)
  }

  const latestMagazine = magazines[0]
  const issuePosts = posts.filter((post) => getCategorySlug(post).includes("inthisissue"))
  const columnPosts = posts.filter((post) => getCategorySlug(post).includes("column"))
  const whatsNewPosts = posts.slice(0, 5)
  const featurePosts = issuePosts.length ? issuePosts : posts.slice(5, 11)
  const displayColumnPosts = columnPosts.length ? columnPosts : posts.slice(11, 15)

  return (
    <main className="bg-white text-black">
      <Banner placement="ARTICLE_TOP" />

      <section className="border-b border-gray-200 bg-white" aria-label="Latest articles">
        <div className="mx-auto max-w-[1320px] px-6 py-4">
          {whatsNewPosts.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {whatsNewPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="group">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="bg-[#0072BC] px-2 py-[2px] text-[10px] font-bold uppercase text-white">
                      {getCategoryName(post)}
                    </span>
                    <span className="text-xs text-black">{formatDate(post.publishedAt)}</span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-black group-hover:text-[#C70000]">
                    {post.title}
                  </p>
                </Link>
              ))}
            </div>
          ) : <p className="py-4 text-black">No articles are available yet.</p>}
        </div>
      </section>

      <section className="bg-[#E9ECEF]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 lg:grid-cols-[420px_1fr]">
          <MagazineGrid magazines={magazines} variant="featured" limit={1} />
          {latestMagazine && (
            <div className="relative min-h-[360px] bg-gray-200 sm:h-[520px]">
              {latestMagazine.coverImageUrl && (
                <Image src={getImageUrl(latestMagazine.coverImageUrl)} alt={latestMagazine.title} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 60vw" />
              )}
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 max-w-3xl p-6 text-white sm:p-10">
                <span className="mb-4 inline-block bg-[#0072BC] px-3 py-1 text-xs font-bold text-white">COVER STORY</span>
                <h1 className="mb-3 text-[28px] font-bold leading-snug text-white">{latestMagazine.title}</h1>
                {latestMagazine.description && <p className="mb-4 text-sm text-white">{latestMagazine.description.replace(/<[^>]+>/g, "").slice(0, 160)}</p>}
                <Link href={`/magazines/${latestMagazine.slug}`} className="text-sm font-bold uppercase text-white underline">Read Issue →</Link>
              </div>
            </div>
          )}
        </div>
        <nav aria-label="Article sections" className="bg-[#0F5B78]">
          <div className="mx-auto flex max-w-[1320px] flex-wrap gap-6 px-6 py-4 text-sm font-semibold text-white sm:gap-10 sm:px-10">
            <Link href="#features" className="text-white">FEATURES</Link>
            <Link href="#columns" className="text-white">COLUMNS</Link>
            <Link href="#archive" className="text-white">ARCHIVE</Link>
          </div>
        </nav>
      </section>

      <Banner placement="ARTICLE_MIDDLE" />

      <section id="features" className="mx-auto max-w-[1320px] scroll-mt-24 px-6 py-14">
        <h2 className="mb-10 text-[32px] font-bold text-black">In this Issue</h2>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
            {featurePosts.map((post) => (
              <article key={post.id}>
                <Link href={`/post/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <div className="relative mb-4 aspect-[16/9] w-full bg-gray-100">
                    <Image src={getImageUrl(post.imageUrl)} alt={post.title} fill className="rounded object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                  </div>
                </Link>
                <div className="mb-3 flex items-center gap-4">
                  <span className="bg-[#0072BC] px-3 py-1 text-xs font-bold uppercase text-white">{getCategoryName(post)}</span>
                  <span className="text-xs text-black">{formatDate(post.publishedAt)}</span>
                </div>
                <h3 className="mb-2 text-[20px] font-bold leading-snug text-black"><Link href={`/post/${post.slug}`} className="hover:text-[#C70000]">{post.title}</Link></h3>
                <p className="mb-3 text-[15px] leading-relaxed text-black">{getSummary(post)}</p>
                {post.author?.name && <p className="mb-3 text-sm text-black">By {post.author.name}</p>}
                <Link href={`/post/${post.slug}`} className="text-sm font-bold uppercase text-black underline">Read More →</Link>
              </article>
            ))}
            {!featurePosts.length && <p className="text-black">No articles are available in this issue yet.</p>}
          </div>
          <aside className="space-y-6"><SupplierAds /></aside>
        </div>
      </section>

      <section id="columns" className="mx-auto max-w-[1320px] scroll-mt-24 px-6 py-14">
        <div className="mb-0 flex items-center justify-between border-b-2 border-black pb-3">
          <h2 className="text-[28px] font-bold uppercase tracking-wide text-black">Columns</h2>
        </div>
        <div>
          {displayColumnPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.slug}`} className="group flex items-center justify-between gap-6 border-b border-gray-200 px-1 py-5 hover:bg-gray-50">
              <div>
                <span className="mb-2 inline-block bg-gray-800 px-2 py-[3px] text-[10px] font-bold uppercase tracking-wider text-white">{getCategoryName(post)}</span>
                <h3 className="text-[22px] font-bold leading-snug text-black group-hover:text-[#C70000]">{post.title}</h3>
                <p className="mt-2 text-sm text-black">{getSummary(post)}</p>
              </div>
              <span className="flex-shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-black">READ MORE ›</span>
            </Link>
          ))}
          {!displayColumnPosts.length && <p className="py-5 text-black">No columns are available yet.</p>}
        </div>
      </section>

      <section id="archive" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-10">
        <h2 className="mb-8 text-2xl font-bold text-black">Archive</h2>
        {magazines.length ? <MagazineGrid magazines={magazines} /> : <p className="text-black">No magazine issues are available yet.</p>}
      </section>
      <Banner placement="ARTICLE_BOTTOM" />
    </main>
  )
}
