"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, TrendingUp, ArrowRight } from "lucide-react";

export default function TrendingArticlesCard() {
  const [articles, setArticles] = useState<{ id: number; title: string; slug: string; views?: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/approved`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        setArticles(sorted);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 shadow-sm overflow-hidden p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-[#0073ff]" />
          <h3 className="text-white font-bold text-base tracking-tight">
            Trending Articles
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center text-xs text-[#a1a1a1]">Loading trending articles...</div>
      ) : articles.length === 0 ? (
        <div className="p-4 text-center text-xs text-[#a1a1a1]">No trending articles at the moment.</div>
      ) : (
        <div className="space-y-3">
          {articles.slice(0, 5).map((article, index) => (
            <Link
              key={article.id}
              href={`/post/${article.slug}`}
              className="p-3.5 rounded-xl border border-white/10 bg-[#171A1E] hover:border-[#0073ff] hover:shadow-md transition-all group flex items-start gap-3 cursor-pointer block"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0073ff]/10 text-[#0073ff] font-bold text-xs flex items-center justify-center shrink-0 border border-[#0073ff]/20 mt-0.5 group-hover:bg-[#0073ff] group-hover:text-white transition-colors">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#0073ff] transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-[11px] text-[#a1a1a1] mt-1 font-medium flex items-center gap-1">
                  <Eye size={12} className="text-[#0073ff]" />
                  <span>{(article.views ?? 0).toLocaleString()} views</span>
                </p>
              </div>
            </Link>
          ))}

          {/* View All Articles Link */}
          <div className="pt-2 border-t border-white/10">
            <Link
              href="/articles"
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0073ff] hover:underline py-2 rounded-lg hover:bg-[#0073ff]/5 transition-colors cursor-pointer"
            >
              <span>View all articles</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
