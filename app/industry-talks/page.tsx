import IndustryTalkListing, { type IndustryTalk } from "@/components/IndustryTalkListing"

type IndustryTalksResponse = {
  items?: IndustryTalk[]
  data?: IndustryTalk[]
}

export default async function IndustryTalksPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks?limit=100&status=PUBLISHED`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch industry talks: ${res.status}`)
  }

  const data: IndustryTalksResponse = await res.json()
  const rawPosts = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
      ? data.data
      : []

  console.log("🔍 [IndustryTalksPage] Total raw industry talks fetched:", rawPosts.length)
  rawPosts.forEach((talk, idx) => {
    console.log(
      `🔍 [IndustryTalksPage] Talk #${idx + 1}: ID=${talk.id}, Title="${talk.title}", Status="${talk.status}" -> Published: ${talk.status?.toUpperCase() === "PUBLISHED"}`
    )
  })

  const posts = rawPosts.filter(
    (talk) => talk.status?.toUpperCase() === "PUBLISHED"
  )

  console.log("🔍 [IndustryTalksPage] Total published industry talks to display:", posts.length)

  return (
    <main className="bg-white">
      <IndustryTalkListing post={posts} />
    </main>
  )
}
