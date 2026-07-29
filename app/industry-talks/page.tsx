import IndustryTalkListing from "@/components/IndustryTalkListing"

export default async function IndustryTalksPage() {
  let talks: any[] = []

  try {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks?limit=100`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks`,
        { cache: "no-store" }
      )
    }

    if (res.ok) {
      const response = await res.json()
      talks = response?.data || response?.items || (Array.isArray(response) ? response : [])
    }
  } catch (error) {
    console.error("Error fetching industry talks:", error)
  }

  // Filter only published industry talks
  const publishedTalks = talks.filter(
    (talk: any) => !talk.status || talk.status.toUpperCase() === "PUBLISHED"
  )

  // Map the data to include industryName for easier access
  const posts = publishedTalks.map((talk: any) => ({
    ...talk,
    industryName: talk.industry?.name || null,
  }))

  return (
    <main className="bg-white">
      <IndustryTalkListing post={posts} />
    </main>
  )
}