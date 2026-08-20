// app/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, Eye, User } from "lucide-react";

const PAGE_SIZE = 18; // 6 rows × 3 cards per row

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  badge?: string;
  publishedAt: string;
  views: number;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  slug: string;
  name: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        if (selectedCategory !== "all") {
          params.set("category", selectedCategory);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?${params.toString()}`
        );
        if (res.ok) {
          const data = await res.json();
          setPosts(Array.isArray(data.data) ? data.data : []);
          if (data.meta) {
            setPagination({
              page: data.meta.page ?? page,
              limit: data.meta.limit ?? PAGE_SIZE,
              total: data.meta.total ?? 0,
              pages: Math.max(1, data.meta.pages ?? 1),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [selectedCategory, page]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const getImageUrl = (post: Post) => {
    if (!post.imageUrl) return "/placeholder.svg";
    return post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get badge color
  const getBadgeColor = (badge?: string) => {
    if (!badge) return "bg-gray-500";
    const colors: Record<string, string> = {
      "Featured": "bg-yellow-500",
      "Popular": "bg-red-500",
      "New": "bg-green-500",
      "Trending": "bg-orange-500",
      "Exclusive": "bg-purple-500",
      "Sponsored": "bg-blue-500",
    };
    return colors[badge] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: PAGE_SIZE }, (_, i) => i + 1).map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#003049] to-[#005a8c] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Timely updates and reliable reporting on politics, global events, science, and culture.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Home</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">→</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Blog</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-[#003049] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-[#003049] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={getImageUrl(post)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {post.badge && (
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${getBadgeColor(
                            post.badge
                          )} animate-pulse`}
                        >
                          {post.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#003049] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt || post.content?.substring(0, 150) + "..." || "No description available."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[14px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {post.author?.name || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views || 0} Views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <h5 className="text-primary mt-4 mt-md-2 arrow-button flex items-center gap-2 text-[#0036a4] font-medium text-lg">
                        Know More
                        <svg
                          width="22"
                          height="22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="arrow animate-arrow-move"
                        >
                          <circle cx="11" cy="11" r="11" fill="#0036a4" />
                          <path
                            d="M9 7l4 4-4 4"
                            stroke="#F6F6F6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </h5>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pageNum === page
                        ? "bg-[#003049] text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Global styles for the animated button */}
      <style jsx global>{`
        .arrow-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        /* Continuous arrow movement animation */
        .animate-arrow-move {
          animation: arrowMove 1.5s ease-in-out infinite;
        }
        
        @keyframes arrowMove {
          0% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(6px);
          }
          100% {
            transform: translateX(0px);
          }
        }
        
        /* Pause animation on hover */
        .group:hover .animate-arrow-move {
          animation-play-state: paused;
        }
        
        /* Scale effect on hover */
        .group:hover .arrow svg circle {
          fill: #005a8c;
          transition: fill 0.3s ease;
        }
        
        .arrow-button svg circle {
          transition: fill 0.3s ease;
        }
        
        .group:hover .arrow-button {
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}