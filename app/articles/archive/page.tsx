/** Implements the articles archive page and its route-specific behavior. */
import FeaturesListing from "@/components/FeaturesListing"
import ArchiveListing from "@/components/ArchiveListing"
import type { Post } from "@/types/Post"

/** Renders the articles archive page interface. */
export default async function ArticlesArchivePage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    { cache: "no-store" }
  )

  const data = await res.json()
  const posts: Post[] = data.data || data

  // 🔒 SAFE CATEGORY SLUG
  const getCategorySlug = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  // ✅ FEATURES POSTS
  const featurePosts = posts.filter((p) =>
    getCategorySlug(p).includes("feature")
  )

  // ✅ ARCHIVE / ISSUE POSTS
  const archivePosts = posts.filter((p) =>
    getCategorySlug(p).includes("archive") 
  )

  return (
    <main className="bg-white pt-[90px]">
      {/* 🔝 FEATURES FIRST */}
      <FeaturesListing posts={featurePosts} />

      {/* 🔽 ARCHIVE BELOW */}
      <ArchiveListing posts={archivePosts} />
    </main>
  )
}
