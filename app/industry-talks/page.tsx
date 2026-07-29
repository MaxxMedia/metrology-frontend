import IndustryTalkListing from "@/components/IndustryTalkListing"

export default async function IndustryTalksPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks?limit=100&status=PUBLISHED`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch industry talks: ${res.status}`)
  }

  const response = await res.json()
  
  // The data now includes the Industry relation from the backend
  const talks = response?.data || response?.items || []

  // Map the data to include industryName for easier access
  const posts = talks.map((talk: any) => ({
    ...talk,
    industryName: talk.industry?.name || null
  }))

  return (
    <main className="bg-white">
      <IndustryTalkListing post={posts} />
    </main>
  )
}