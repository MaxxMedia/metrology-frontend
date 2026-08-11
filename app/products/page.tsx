import ProductsListing from "@/components/ProductsListing"
import type { Post } from "@/types/Post"

export default async function ProductsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    { cache: "no-store" }
  )

  const data = await res.json()
  const posts: Post[] = data.data || data

  const getCategorySlug = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  const productPosts = posts.filter(
    (p) => getCategorySlug(p) === "video"
  )

  return (
    <main className="bg-white">
      <ProductsListing posts={productPosts} />
    </main>
  )
}
