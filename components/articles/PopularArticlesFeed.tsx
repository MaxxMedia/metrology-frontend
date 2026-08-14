"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, TrendingUp } from "lucide-react";
import type { Post } from "@/types/Post";

function getImageUrl(url?: string | null) {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}

function getAuthorName(post: Post) {
  if (post.author?.name) return post.author.name;
  if (post.Company?.name) return post.Company.name;
  return "Metrology";
}

function formatDate(date?: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type PopularArticlesFeedProps = {
  onArticlesLoaded?: (articles: Post[]) => void;
};

export default function PopularArticlesFeed({
  onArticlesLoaded,
}: PopularArticlesFeedProps) {
  const [articles, setArticles] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/approved`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load articles");

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort(
          (a, b) => (b.views ?? 0) - (a.views ?? 0)
        );

        setArticles(sorted);
        onArticlesLoaded?.(sorted);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Unable to load articles"
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [onArticlesLoaded]);

  const [featured, ...rest] = articles;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-md shadow-sm p-6 animate-pulse h-72" />
        <div className="bg-white rounded-md shadow-sm p-6 animate-pulse h-40" />
        <div className="bg-white rounded-md shadow-sm p-6 animate-pulse h-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-md shadow-sm p-8 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="bg-white rounded-md shadow-sm p-8 text-center">
        <p className="text-gray-600 mb-3">No articles available yet.</p>
        <Link href="/articles" className="text-blue-600 hover:underline text-sm">
          Browse articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {featured && (
        <article className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 pt-4 pb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
            <TrendingUp className="h-4 w-4" />
            Most Popular
          </div>

          <Link href={`/post/${featured.slug}`} className="block">
            <div className="relative w-full aspect-[16/9] bg-gray-100">
              <Image
                src={getImageUrl(featured.imageUrl)}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
                priority
              />
            </div>
          </Link>

          <div className="p-4 sm:p-5 space-y-3">
            {featured.badge && (
              <span className="inline-block bg-[#E11D48] text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase">
                {featured.badge}
              </span>
            )}

            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              <Link
                href={`/post/${featured.slug}`}
                className="hover:text-blue-600 transition-colors"
              >
                {featured.title}
              </Link>
            </h2>

            {featured.excerpt && (
              <p className="text-sm text-gray-600 line-clamp-3">{featured.excerpt}</p>
            )}

            <ArticleMeta post={featured} />
          </div>
        </article>
      )}

      {rest.map((post, index) => (
        <article
          key={post.id}
          className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row">
            <Link
              href={`/post/${post.slug}`}
              className="relative w-full sm:w-44 md:w-52 aspect-[16/10] sm:aspect-auto sm:min-h-[140px] flex-shrink-0 bg-gray-100"
            >
              <Image
                src={getImageUrl(post.imageUrl)}
                alt={post.title}
                fill
                className="object-cover"
                sizes="208px"
              />
            </Link>

            <div className="p-4 flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium text-blue-600">#{index + 2} trending</span>
                {post.badge && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {post.badge}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h3>

              {post.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
              )}

              <ArticleMeta post={post} />
            </div>
          </div>
        </article>
      ))}

      <div className="text-center pt-2">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all articles →
        </Link>
      </div>
    </div>
  );
}

function ArticleMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
      <span className="font-medium text-gray-700">{getAuthorName(post)}</span>
      <span className="inline-flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" />
        {(post.views ?? 0).toLocaleString()} views
      </span>
      {formatDate(post.publishedAt || post.createdAt) && (
        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
      )}
    </div>
  );
}
