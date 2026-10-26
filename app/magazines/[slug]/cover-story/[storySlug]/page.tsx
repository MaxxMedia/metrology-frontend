/** Implements the magazines slug cover story story slug page and its route-specific behavior. */
﻿import Image from "next/image"

type Props = {
  params: Promise<{
    slug: string
    storySlug: string
  }>
}

type CoverStory = {
  title?: string
  createdAt?: string
  coverImageUrl?: string | null
  shortDescription?: string | null
  fullDescription?: string | null
  keyCategories?: unknown
}

/** Returns the derived story value used by this workflow. */
async function getStory(storySlug: string): Promise<CoverStory> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/magazines/cover-stories/${storySlug}`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to fetch story")

  return res.json()
}

/** Returns the derived categories value used by this workflow. */
function getCategories(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim()
        if (item && typeof item === "object") {
          const category = item as { name?: unknown; label?: unknown }
          if (typeof category.name === "string") return category.name.trim()
          if (typeof category.label === "string") return category.label.trim()
        }
        return ""
      })
      .filter(Boolean)
  }

  if (typeof value !== "string" || !value.trim()) return []

  const text = value.trim()
  if (text.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(text)
      if (Array.isArray(parsed)) return getCategories(parsed)
    } catch {
      // Older records may contain category text that is not valid JSON.
    }
  }

  return text.split(",").map((category) => category.trim()).filter(Boolean)
}

/** Renders the cover story page interface. */
export default async function CoverStoryPage({ params }: Props) {
  const { storySlug } = await params
  const story = await getStory(storySlug)
  const categories = getCategories(story.keyCategories)
  const publishedDate = story.createdAt
    ? new Date(story.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <main className="min-h-screen bg-[#f4f7fa] text-[#17212b]">
      <section className="relative isolate min-h-[420px] overflow-hidden bg-[#003049] sm:min-h-[500px] lg:min-h-[580px]">
        {story.coverImageUrl ? (
          <Image
            src={story.coverImageUrl}
            alt={story.title || "Cover story"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#061a27] via-[#061a27]/55 to-[#061a27]/10" />
        <div className="relative z-20 mx-auto flex min-h-[420px] max-w-7xl items-end px-5 pb-8 pt-24 sm:min-h-[500px] sm:px-8 sm:pb-12 lg:min-h-[580px] lg:px-10 lg:pb-16">
          <div className="w-full max-w-4xl rounded-2xl border border-white/15 bg-[#071d2b]/80 p-6 text-white shadow-2xl backdrop-blur-sm sm:p-9 lg:p-11">
            {publishedDate && (
              <p className="mb-4 text-sm font-medium text-white/70">
                Published {publishedDate}
              </p>
            )}
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {story.title}
            </h1>
            {story.shortDescription && (
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
                {story.shortDescription}
              </p>
            )}
            {categories.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Story categories">
                {categories.map((category, index) => (
                  <li
                    key={`${category}-${index}`}
                    className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white sm:text-sm"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:px-10 lg:py-16">
        <article className="min-w-0 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#dce4ea] sm:p-9 lg:p-12">
          {story.fullDescription ? (
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#003049] prose-a:text-[#0073ff] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: story.fullDescription }}
            />
          ) : (
            <p className="text-[#647481]">Story content is coming soon.</p>
          )}
        </article>

{/* this content is dynamic and the content will run like ads  */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-[#dce4ea] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0073ff]">
              Partner with us
            </p>
            <h2 className="mt-3 text-xl font-bold text-[#003049]">
              Reach the metrology community
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#647481]">
              This space is available for relevant sponsored content and industry announcements.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
