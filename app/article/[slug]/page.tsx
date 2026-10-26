/** Implements the article slug page and its route-specific behavior. */
import Image from "next/image"
import { notFound } from "next/navigation"

type Company = {
  id: number
  name: string
  slug: string
}

type Article = {
  id: number
  title: string
  slug: string
  content: string
  imageUrl?: string | null
  publishedAt: string
  company?: Company | null
}

/* Fetch single recruiter article */
async function getArticle(slug: string): Promise<Article> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/articles/${slug}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    notFound()
  }

  return res.json()
}

/** Renders the article slug page interface. */
export default async function ArticleSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // 🔥 IMPORTANT FIX
  const { slug } = await params

  const article = await getArticle(slug)

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {article.title}
      </h1>

      {/* Company */}
      {article.company && (
        <p className="text-sm text-gray-500 mb-6">
          Posted by{" "}
          <span className="font-semibold text-gray-700">
            {article.company.name}
          </span>
        </p>
      )}

      {/* Image */}
      {article.imageUrl && (
        <div className="relative w-full h-[380px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Date */}
      <div className="mt-10 text-sm text-gray-400">
        Published on{" "}
        {new Date(article.publishedAt).toLocaleDateString()}
      </div>
    </main>
  )
}
