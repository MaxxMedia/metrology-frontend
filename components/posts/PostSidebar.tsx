// components/post/PostSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Calendar, Search } from "lucide-react";

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
  const [trendyPosts, setTrendyPosts] = useState<Post[]>([]);
  const [companyPosts, setCompanyPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "popular" | "trendy" | "company">("recent");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Better error handling and loading states
  useEffect(() => {
    async function fetchSidebarData() {
      setLoading(true);
      try {
        // Fetch recent posts
        const recentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=5&page=1`
        );
        let recentList: any[] = [];
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          recentList = recentData.data || [];
          setRecentPosts(
            recentList
              .filter((p: any) => p.id !== currentPostId)
              .slice(0, 4)
          );
        }

        // Fetch popular posts (all-time) - with fallback if endpoint fails
        let popularList: any[] = [];
        try {
          const popularRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/popular?limit=5`
          );
          if (popularRes.ok) {
            const popularData = await popularRes.json();
            popularList = popularData.data || [];
            setPopularPosts(
              popularList
                .filter((p: any) => p.id !== currentPostId)
                .slice(0, 4)
            );
          } else {
            // Fallback: get popular from main endpoint with view sorting
            const fallbackRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=10&page=1`
            );
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              popularList = fallbackData.data || [];
              const sorted = [...popularList]
                .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
                .filter((p: any) => p.id !== currentPostId)
                .slice(0, 4);
              setPopularPosts(sorted);
            }
          }
        } catch (err) {
          console.error("Failed to fetch popular posts:", err);
          // Set empty array so UI doesn't break
          setPopularPosts([]);
        }

        // Trendy = recently published posts sorted by views (short-term momentum)
        try {
          const trendyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=16&page=1`
          );
          if (trendyRes.ok) {
            const trendyData = await trendyRes.json();
            const trendyList = trendyData.data || [];
            const sorted = [...trendyList]
              .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
              .filter((p: any) => p.id !== currentPostId)
              .slice(0, 4);
            setTrendyPosts(sorted);
          }
        } catch (err) {
          console.error("Failed to fetch trendy posts:", err);
          setTrendyPosts([]);
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
                .slice(0, 4)
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    window.location.href = `/blog?search=${encodeURIComponent(searchTerm.trim())}`;
  };

  const filterBySearch = (posts: Post[]) => {
    if (!searchTerm.trim()) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter((p) => p.title.toLowerCase().includes(term));
  };

  const renderPostList = (posts: Post[]) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const filtered = filterBySearch(posts);

    if (filtered.length === 0) {
      return (
        <p className="text-gray-500 text-sm text-center py-4">
          No posts found
        </p>
      );
    }

    return (
      <div className="space-y-5">
        {filtered.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="flex gap-3 group"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-800">
              <Image
                src={getImageUrl(post)}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-400">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                {post.author?.name && (
                  <span>By {post.author.name}</span>
                )}
                {typeof post.views === "number" && (
                  <>
                    <span className="text-gray-700">•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} className="text-gray-500" />
                      {post.views.toLocaleString()} Views
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
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Keyword..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 w-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Search size={16} className="text-white" />
        </button>
      </form>

      <div>
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "recent"
                ? "bg-blue-600 text-white"
                : "bg-transparent border border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "popular"
                ? "bg-blue-600 text-white"
                : "bg-transparent border border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("trendy")}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "trendy"
                ? "bg-blue-600 text-white"
                : "bg-transparent border border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            Trendy
          </button>
          {/* {companyPosts.length > 0 && (
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "company"
                  ? "bg-blue-600 text-white"
                  : "bg-transparent border border-gray-700 text-gray-300 hover:border-gray-500"
              }`}
            >
              Company
            </button>
          )} */}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "recent" && renderPostList(recentPosts)}
          {activeTab === "popular" && renderPostList(popularPosts)}
          {activeTab === "trendy" && renderPostList(trendyPosts)}
          {/* {activeTab === "company" && renderPostList(companyPosts)} */}
        </div>
      </div>
    </div>
  );
}
