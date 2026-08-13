import Link from "next/link";
import TopicListing from "@/components/topics/TopicListing";
import type { Post } from "@/types/Post";
import { MASTER_CATEGORIES } from "@/lib/topic";
import { notFound } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  children?: { id: number; name: string; slug: string }[];
};

type Props = {
  params: Promise<{ category: string }>;
};

const METROLOGY_SLUGS = new Set(MASTER_CATEGORIES.map((c) => c.slug));

export default async function TopicCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;

  const [postsRes, categoriesRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${encodeURIComponent(categorySlug)}&limit=50`,
      { cache: "no-store" }
    ),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: "no-store",
    }),
  ]);

  const postsData = await postsRes.json();
  const posts: Post[] = Array.isArray(postsData?.data)
    ? postsData.data
    : Array.isArray(postsData)
    ? postsData
    : [];

  const categoriesData = await categoriesRes.json();
  const allCategories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const allParents = allCategories.filter((c) => c.parentId == null);

  const category = allCategories.find((c) => c.slug === categorySlug);

  if (!category && posts.length === 0 && !METROLOGY_SLUGS.has(categorySlug)) {
    notFound();
  }

  const sidebarCategories = MASTER_CATEGORIES.map((master) => {
    const match = allParents.find((p) => p.slug === master.slug);
    return {
      label: master.label,
      slug: master.slug,
      count: match?.children?.length ?? 0,
    };
  });

  const title = category?.name || categorySlug.replace(/-/g, " ");
  const parentCategory =
    category?.parentId != null
      ? allCategories.find((c) => c.id === category.parentId)
      : category;
  const childCount = parentCategory?.children?.length ?? 0;

  const description =
    category?.parentId != null
      ? `Latest articles for ${title}.`
      : childCount > 0
      ? `Articles and insights across ${title} and its ${childCount} subcategories — including measurement systems, tools, and industry applications.`
      : `Latest articles and insights for ${title}.`;

  // Recent posts for top strip
  const recentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=5`, {
    cache: "no-store",
  });
  const recentData = await recentRes.json();
  const recentPosts: Post[] = recentData.data || recentData;

  return (
    <main className="bg-white">
      {recentPosts.length > 0 && (
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.slug}`} className="group">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-[#0073ff] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                      {(post as Post & { subCategory?: { name?: string } }).subCategory?.name ||
                        (typeof post.category === "object" ? post.category?.name : "") ||
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

      <TopicListing
        posts={posts}
        title={title}
        description={description}
        sectionTitle={`${title} Articles`}
        activeSlug={categorySlug}
        sidebarCategories={sidebarCategories}
      />
    </main>
  );
}
