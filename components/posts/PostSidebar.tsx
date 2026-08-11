// components/post/PostSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Calendar } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  publishedAt?: string;
  views?: number;
  author?: {
    name: string;
  };
  category?: {
    name: string;
    slug?: string;
  };
}

interface Props {
  currentPostId?: number;
  categorySlug?: string;
}

export default function PostSidebar({ currentPostId, categorySlug }: Props) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [companyPosts, setCompanyPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "popular" | "company">("recent");
  const [loading, setLoading] = useState(true);

  // Better error handling and loading states
useEffect(() => {
  async function fetchSidebarData() {
    setLoading(true);
    try {
      // Fetch recent posts
      const recentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=5&page=1`
      );
      if (recentRes.ok) {
        const recentData = await recentRes.json();
        const recentList = recentData.data || [];
        setRecentPosts(
          recentList
            .filter((p: any) => p.id !== currentPostId)
            .slice(0, 5)
        );
      }

      // Fetch popular posts - with fallback if endpoint fails
      try {
        const popularRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/popular?limit=5`
        );
        if (popularRes.ok) {
          const popularData = await popularRes.json();
          const popularList = popularData.data || [];
          setPopularPosts(
            popularList
              .filter((p: any) => p.id !== currentPostId)
              .slice(0, 5)
          );
        } else {
          // Fallback: get popular from main endpoint with view sorting
          const fallbackRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=10&page=1`
          );
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const sorted = (fallbackData.data || [])
              .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
              .filter((p: any) => p.id !== currentPostId)
              .slice(0, 5);
            setPopularPosts(sorted);
          }
        }
      } catch (err) {
        console.error("Failed to fetch popular posts:", err);
        // Set empty array so UI doesn't break
        setPopularPosts([]);
      }

      // Fetch company posts
      if (categorySlug) {
        const companyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${categorySlug}&limit=5`
        );
        if (companyRes.ok) {
          const companyData = await companyRes.json();
          const companyList = companyData.data || [];
          setCompanyPosts(
            companyList
              .filter((p: any) => p.id !== currentPostId)
              .slice(0, 5)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchSidebarData();
}, [currentPostId, categorySlug]);

  const getImageUrl = (post: Post) => {
    if (!post.imageUrl) return "/placeholder.svg";
    return post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderPostList = (posts: Post[]) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <p className="text-gray-500 text-sm text-center py-4">
          No posts found
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={getImageUrl(post)}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#003049]">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                {post.author?.name && (
                  <span>By {post.author.name}</span>
                )}
                {typeof post.views === "number" && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-0.5">
                      <Eye size={12} />
                      {post.views.toLocaleString()}
                    </span>
                  </>
                )}
                {post.publishedAt && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar size={12} />
                      {formatDate(post.publishedAt)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold tracking-wide uppercase text-gray-500 mb-4">
        Related Posts
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === "recent"
              ? "text-[#003049] border-b-2 border-[#003049]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === "popular"
              ? "text-[#003049] border-b-2 border-[#003049]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Popular
        </button>
        {companyPosts.length > 0 && (
          <button
            onClick={() => setActiveTab("company")}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "company"
                ? "text-[#003049] border-b-2 border-[#003049]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Company
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "recent" && renderPostList(recentPosts)}
        {activeTab === "popular" && renderPostList(popularPosts)}
        {activeTab === "company" && renderPostList(companyPosts)}
      </div>
    </div>
  );
}