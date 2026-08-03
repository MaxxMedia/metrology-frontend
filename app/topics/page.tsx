import Link from "next/link"
import type { Post } from "@/types/Post"

type Category = {
  id: number
  name: string
  slug: string
}

export default async function TopicsPage() {
  const [postsRes, categoriesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: "no-store",
    }),
  ])

  const data = await postsRes.json()
  const posts: Post[] = data.data || data

  const categoriesData = await categoriesRes.json()
  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData
    : []

  const slugOf = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  // ================= WHAT'S NEW POSTS =================
  const whatsNewPosts = posts
    .filter((p) => slugOf(p).includes("whatsnew"))
    .slice(0, 5)

  // ================= FIRST COLUMN — Browse by Industry (static list) =================
  const browseByIndustry = [
    "Additive Manufacturing",
    "Automation & AI",
    "Business Development",
    "Cleaning & Pretreatment",
    "Composites Fabrication",
    "Inspection, Testing, Measurement",
    "Manufacturing Execution & Automation Software & Controls",
    "Manufacturing Services",
    "Materials",
    "Metalworking",
    "Mold Making",
    "Plastics Processing Equipment",
    "Pollution Control & Sustainability",
    "Supplies",
    "Surface Finishing",
    "Temperature/Pressure Control Equipment",
    "Workholding",
  ]

  // ================= RIGHT COLUMN — Most Popular =================
  const mostPopular = [
    "Machine Tools",
    "Cutting Tools",
    "Dies, Moulds & Tooling",
    "Metrology & Quality",
    "Factory Automation",
    "CAD/CAM/CAE",
    "Manufacturing Technologies",
    "Webinars",
    "Videos",
    "Events",
    "Suppliers",
    "Tooling Design & Optimization",
  ]

  // ================= RIGHT COLUMN — Multimedia Formats =================
  const multimediaFormats = [
    { name: "Magazine", href: "/magazines" },
    { name: "Directory", href: "/suppliers" },
    { name: "Industry Talks", href: "/industry-talks" },
    { name: "Events", href: "/events" },
    { name: "Jobs", href: "/feed" },
  ]

  const getCategoryUrl = (slug: string) => {
    const s = slug.toLowerCase()
    if (s === "video" || s === "videos") return "/videos"
    if (s === "industry-talks") return "/industry-talks"
    if (s === "webinars") return "/webinars"
    if (s === "events") return "/events"
    if (s === "suppliers") return "/suppliers"
    if (s === "articles") return "/articles"
    if (s === "products") return "/products"
    if (s === "magazine" || s === "magazines") return "/magazines"
    if (s === "news") return "/news"
    if (s === "machine tools" || s === "machine-tools") return "/topics/machine"
    return `/topics/${slug}`
  }

  return (
    <main className="bg-white">

      {/* ================= WHAT'S NEW STRIP ================= */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whatsNewPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-[#0072BC] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                    {typeof post.category === "object"
                      ? post.category?.name
                      : post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#C70000]">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALL TOPICS ================= */}
      <section className="max-w-[1320px] mx-auto px-6 py-14">
        <h1 className="text-[32px] font-bold text-[#003B5C] mb-2">
          All Topics
        </h1>

        <p className="text-gray-600 mb-10">
          Interested in a particular topic? Visit our topic pages through the links below.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-16">

          {/* LEFT COLUMN — Browse by Industry (static list only) */}
          <div>
            <h2 className="text-sm font-semibold mb-6">Browse by Industry</h2>
            <ul className="space-y-2">
              {browseByIndustry.map((topic) => (
                <li key={topic}>
                  <Link
                    href={`/suppliers?industry=${encodeURIComponent(topic)}`}
                    className="text-sm text-[#003B5C] hover:underline"
                  >
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MIDDLE COLUMN — Categories from backend */}
          <div>
            <h2 className="text-lg font-semibold mb-6 invisible">All Topics</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={getCategoryUrl(cat.slug)}
                    className="text-sm text-[#003B5C] hover:underline"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-12">
            <div>
              <h3 className="text-lg font-semibold mb-6">Most Popular</h3>
              <ul className="space-y-2">
                {mostPopular.map((topic) => (
                  <li key={topic}>
                    <Link
                      href={getCategoryUrl(topic.toLowerCase().replace(/\s+/g, "-"))}
                      className="text-sm text-[#003B5C] hover:underline"
                    >
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Multimedia Formats</h3>
              <ul className="space-y-2">
                {multimediaFormats.map((topic) => (
                  <li key={topic.name}>
                    <Link
                      href={topic.href}
                      className="text-sm text-[#003B5C] hover:underline"
                    >
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}