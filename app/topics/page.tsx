import Link from "next/link";
import type { Post } from "@/types/Post";
import { MASTER_CATEGORIES } from "@/lib/topic";

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  children?: { id: number; name: string; slug: string }[];
};

const METROLOGY_SLUGS = MASTER_CATEGORIES.map((c) => c.slug);

function orderMetrologyCategories(categories: Category[]) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return METROLOGY_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as Category[];
}

export default async function TopicsPage() {
  const [postsRes, categoriesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=5`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?parentsOnly=true`, {
      cache: "no-store",
    }),
  ]);

  const postsData = await postsRes.json();
  const posts: Post[] = postsData.data || postsData;

  const categoriesData = await categoriesRes.json();
  const allParents: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const categories = orderMetrologyCategories(
    allParents.filter((c) => METROLOGY_SLUGS.includes(c.slug))
  );

  const midpoint = Math.ceil(categories.length / 2);
  const leftColumn = categories.slice(0, midpoint);
  const rightColumn = categories.slice(midpoint);

  return (
    <main className="bg-white">
      {/* Recent posts strip */}
      {posts.length > 0 && (
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="group">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-[#0073ff] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                      {(post as Post & { subCategory?: { name?: string } }).subCategory?.name ||
                        (typeof post.category === "object" ? post.category?.name : post.category) ||
                        "News"}
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
                  <p className="text-sm font-semibold text-[#121213] leading-snug group-hover:text-[#0073ff]">
                    {post.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 md:py-14">
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#121213] mb-2">
          All Topics
        </h1>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Browse metrology and manufacturing categories. Select a topic to view articles
          from that category and its subcategories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
          {[leftColumn, rightColumn].map((column, colIdx) => (
            <ul key={colIdx} className="space-y-2.5">
              {column.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/topics/${cat.slug}`}
                    className="text-[15px] text-[#121213] hover:text-[#0073ff] hover:underline transition-colors"
                  >
                    {cat.name}
                    {cat.children && cat.children.length > 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        ({cat.children.length} subcategories)
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-gray-500 text-sm">
            No metrology categories found. Run{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              node prisma/seedMetrologyCategories.js
            </code>{" "}
            on the backend to seed categories.
          </p>
        )}
      </section>
    </main>
  );
}
