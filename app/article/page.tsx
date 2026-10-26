/** Implements the article page and its route-specific behavior. */
import Image from "next/image"
import Link from "next/link"

type Company = {
  id: number
  name: string
  slug: string
}

type Article = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  publishedAt: string
  company?: Company | null
}

/** Returns the derived articles value used by this workflow. */
async function getArticles(): Promise<Article[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=articles`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch articles")
  }

  const json = await res.json()
  return json.data
}

/** Renders the articles page interface. */
export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Recruiter Articles
      </h1>

      {/* Empty State */}
      {articles.length === 0 && (
        <p className="text-gray-500">No articles found.</p>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            {article.imageUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <h2 className="font-semibold text-lg mb-2">
                {article.title}
              </h2>

              {article.company && (
                <p className="text-sm text-gray-500 mb-2">
                  By {article.company.name}
                </p>
              )}

              {article.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-4">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
