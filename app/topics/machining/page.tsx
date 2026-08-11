import Link from "next/link"
import EngineerListing from "@/components/topics/EngineerListing"
import type { Post } from "@/types/Post"
import TopicListing from "@/components/topics/TopicListing"

export default async function MachiningPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    { cache: "no-store" }
  )

  const data = await res.json()
  const posts: Post[] = data.data || data

  const slugOf = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  // ================= WHAT'S NEW POSTS =================
  const whatsNewPosts = posts
    .filter((p) => slugOf(p).includes("whatsnew"))
    .slice(0, 5)

  // ================= ENGINEER POSTS =================
  const engineerPosts = posts.filter(
    (p) => slugOf(p) === "machine"
  )

  return (
    <main className="bg-white">

      {/* ================= WHAT'S NEW TOP STRIP ================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whatsNewPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group"
              >
             {/* BADGE + DATE */}
<div className="flex items-center gap-3 mb-1">
  {(post.badge || post.category) && (
    <span className="bg-[#0072BC] text-white text-[10px] font-bold px-2 py-[2px] uppercase">
      {post.badge
        ? post.badge
        : typeof post.category === "object"
        ? post.category?.name
        : post.category}
    </span>
  )}

  <span className="text-xs text-gray-500">
    {post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : ""}
  </span>
</div>


                {/* TITLE */}
                <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#C70000]">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ENGINEER PAGE CONTENT ================= */}
     <TopicListing
  posts={engineerPosts}
  title="Machining"
  description="Strategies to de-risk launches through part and Toolingsimulation, additive manufacturing or conformal cooling, and troubleshooting during tool validation."
  sectionTitle="Latest Machining Articles"
/>


    </main>
  )
}
