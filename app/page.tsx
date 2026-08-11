
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"
import PassionOnWheels from "../components/PassionOnWheels"
import LatestHero from "../components/LatestHero"
import TrendingAd from "../components/TrendingAd"
import ShopTalkAd from "../components/ShopTalkAd"
import ManufacturingConnected from "../components/ManufacturingConnected"
import BasicsSection from "../components/BasicsSection"
import VideosSection from "../components/VideosSection"
import NewsProductsSection from "../components/NewsProductsSection"
import LatestIssues from "../components/LatestIssues"
import Footer from "../components/Footer"

import type { Post } from "../types/Post"
import TrendingSection from "@/components/TrendingSection"
import CompanyArticles from "@/components/company/CompanyArticles"
import HomeCompanyArticles from "@/components/HomeCompanyArticles"
import Banner from "@/components/Banners/Banner";


export default async function Home() {
  /* ================= FETCH POSTS ================= */

  const postsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`,
    { cache: "no-store" }
  );

  const text = await postsRes.text();

  console.log("Posts API:", text);

  if (!text) {
    throw new Error("Posts API returned empty response");
  }

  const postsData = JSON.parse(text);

  const posts: Post[] = postsData.data || postsData

  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className="text-center p-10 text-[16px]">No posts available</div>
  }

  /* ================= CATEGORY HELPER ================= */

  const getCategorySlug = (post: Post) =>
    typeof post.category === "object"
      ? post.category?.slug?.toLowerCase()
      : String(post.category || "").toLowerCase()

  /* ================= GROUP POSTS ================= */

  // Manufacturing is still its own dedicated section, so it keeps its
  // category filter. Everything else no longer filters by category —
  // every post is eligible everywhere else (LatestHero, Trending, etc.)
  const manufacturingPosts = posts.filter(
    (p) => getCategorySlug(p) === "manufacturing"
  )

  /* ================= FEATURED ================= */

  // Previously this only looked at posts tagged "latest" — if none
  // existed (e.g. on a local/empty-ish dataset), latestPost was
  // undefined and LatestHero never rendered at all. Now it just takes
  // the single most recent post overall, regardless of category, so
  // the hero always has something to show as long as ANY posts exist.
  const sortedByRecency = [...posts].sort((a, b) => {
    const aTime = new Date((a as any).publishedAt || (a as any).createdAt || 0).getTime()
    const bTime = new Date((b as any).publishedAt || (b as any).createdAt || 0).getTime()
    return bTime - aTime
  })

  const latestPost = sortedByRecency[0]

  return (
    <div className="flex flex-col w-full min-w-0 overflow-x-hidden bg-[#1D2125]">
      {/* ================= HOME TOP BANNER ================= */}
      {/* <Banner placement="HOME_TOP" /> */}

      {/* 📰 Latest Hero — shows the most recent post + next 3, all categories */}
      {latestPost && <LatestHero post={latestPost} posts={posts} />}

      {/* 📈 Trending + Popular */}
      <TrendingSection posts={posts} />

      {/* ================= HOME MIDDLE BANNER ================= */}
      <Banner placement="HOME_MIDDLE" />

      <BasicsSection posts={posts} />

      

      {/* 🎥 Videos */}
      <VideosSection posts={posts} />

      {/* Optical & Vision Metrology */}
      <CompanyArticles posts={posts} />

      {/* 🏭 Manufacturing (currently disabled) */}
      {/* <ManufacturingConnected posts={manufacturingPosts.slice(0, 4)} /> */}

      <HomeCompanyArticles posts={posts} />

      {/* ================= HOME BOTTOM BANNER ================= */}
      <Banner placement="HOME_BOTTOM" />
    </div>
  )
}