import Link from "next/link";
import TopicListing from "@/components/topics/TopicListing";
import type { Post } from "@/types/Post";

interface TopicPageProps {
  categorySlug: string;
  title: string;
  description: string;
  sectionTitle: string;
}

export default async function TopicPage({
  categorySlug,
  title,
  description,
  sectionTitle,
}: TopicPageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  const posts: Post[] = data.data || data;

  const slugOf = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase();

  const whatsNewPosts = posts
    .filter((p) => slugOf(p).includes("whatsnew"))
    .slice(0, 5);

  const categoryPosts = posts.filter(
    (p) => slugOf(p) === categorySlug
  );

  return (
    <main className="bg-white">
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
                  {(post.badge || post.category) && (
                    <span className="bg-[#0072BC] text-white text-[10px] font-bold px-2 py-[2px] uppercase">
                      {post.badge
                        ? post.badge
                        : typeof post.category === "object"
                        ? post.category?.name
                        : post.category}
                    </span>
                  )}

                  <span className="text-xs text-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
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

      <TopicListing
        posts={categoryPosts}
        title={title}
        description={description}
        sectionTitle={sectionTitle}
      />
    </main>
  );
}