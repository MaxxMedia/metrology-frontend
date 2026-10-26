/** Implements the mmtchats page and its route-specific behavior. */
import VideoListing from "@/components/VideoListing"
import type { Post } from "@/types/Post"

/** Renders the videos page interface. */
export default async function VideosPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    { cache: "no-store" }
  )

  const data = await res.json()
  const posts: Post[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : []

  const videoPosts = posts.filter((p) => {
    const slug =
      typeof p.category === "object"
        ? p.category?.slug?.toLowerCase()
        : String(p.category || "").toLowerCase()

    return slug.includes("videos")
  })

  return (
    <main className="bg-white">
      <VideoListing posts={videoPosts} />
    </main>
  )
}
