import PodcastListing from "@/components/PodcastListing"
import type { Post } from "@/types/Post"

export default async function PodcastPage() {
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

  const podcastPosts = posts.filter((p) => {
    const slug =
      typeof p.category === "object"
        ? p.category?.slug?.toLowerCase()
        : String(p.category || "").toLowerCase()

    return slug.includes("video")
  })

  return (
    <main className="bg-white">
      <PodcastListing posts={podcastPosts} />
    </main>
  )
}
