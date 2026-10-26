/** Implements the magazines slug page and its route-specific behavior. */
﻿import FlipBookViewer from "@/components/FlipBookViewer"
import DownloadSection from "@/components/magazine/DownloadSection"

type Props = {
  params: Promise<{
    slug: string
  }>
}

type Magazine = {
  id: number
  title: string
  description?: string | null
  pdfUrl?: string | null
  coverImageUrl?: string | null
  flipbookPages?: unknown
  createdAt?: string
  author?: { name?: string | null } | null
  MagazineAuthor?: { name?: string | null } | null
}

/** Returns the derived magazine value used by this workflow. */
async function getMagazine(slug: string): Promise<Magazine> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/magazines/${slug}`,
    { cache: "no-store" }
  )

  if (!res.ok) throw new Error("Failed to fetch magazine")
  return res.json()
}

/** Returns the derived pages value used by this workflow. */
function getPages(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((page): page is string => typeof page === "string" && page.length > 0)
}

/** Renders the single magazine page interface. */
export default async function SingleMagazinePage({ params }: Props) {
  const { slug } = await params
  const magazine = await getMagazine(slug)
  const pages = getPages(magazine.flipbookPages)
  const authorName = magazine.author?.name || magazine.MagazineAuthor?.name
  const issueDate = magazine.createdAt
    ? new Date(magazine.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <main className="min-h-screen bg-[#f3f6f8]">
      <section className="border-b border-[#dce4ea] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 sm:py-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black">Digital magazine</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl">
              {magazine.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black">
              {issueDate && <span>{issueDate}</span>}
              {issueDate && authorName && <span aria-hidden="true">·</span>}
              {authorName && <span>By {authorName}</span>}
              <span aria-hidden="true">·</span>
              <span>{pages.length} {pages.length === 1 ? "page" : "pages"}</span>
            </div>
          </div>
          {magazine.pdfUrl && (
            <div className="shrink-0">
              <DownloadSection magazineId={magazine.id} />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-8 sm:py-10">
        <div className="overflow-hidden rounded-2xl border border-[#263b49] bg-[#10212c] shadow-xl">
          <FlipBookViewer pages={pages} />
        </div>
        {magazine.description && (
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#dce4ea] sm:p-9">
            <h2 className="text-xl font-bold text-black">About this issue</h2>
            <div
              className="prose mt-4 max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black prose-a:text-black"
              dangerouslySetInnerHTML={{ __html: magazine.description }}
            />
          </div>
        )}
      </section>
    </main>
  )
}
