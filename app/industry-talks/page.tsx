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
  const posts = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
    ? data.data
    : []

  return (
    <main className="bg-white">
      <IndustryTalkListing post={posts} />
    </main>
  )
}
