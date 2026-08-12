"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "../types/Post";

/* ------------------ EXPLORE CATEGORIES ------------------ */

function ExploreCategories() {
  const categories = [
    { name: "Gaming", count: 24 },
    { name: "Sports", count: 30 },
    { name: "Technology", count: 22 },
    { name: "Politics", count: 25 },
    { name: "Travel", count: 16 },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h5 className="text-[18px] font-semibold mb-5 text-[#121213]">
        Explore Categories
      </h5>

      <ul className="space-y-3">
        {categories.map((cat) => (
          <li key={cat.name}>
            <Link
              href={`/category/${cat.name.toLowerCase()}`}
              className="flex items-center justify-between px-4 py-3 rounded-md bg-[#f5f5f5] hover:bg-[#ededed] transition"
            >
              <span className="text-[15px] font-medium text-[#121213]">
                {cat.name} ({cat.count})
              </span>
              <span className="text-lg">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------ POPULAR NEWS ------------------ */

function PopularNewsSidebar() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=4`
      );
      const json = await res.json();
      setPosts(json.data || json);
    }
    fetchPosts();
  }, []);

  const imageUrl = (post: Post) =>
    post.imageUrl?.startsWith("http")
      ? post.imageUrl
      : post.imageUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
      : "/placeholder.jpg";

  return (
    <div className="bg-white border rounded-lg p-6">
      <h5 className="text-[18px] font-semibold mb-5 text-[#121213]">
        Popular News
      </h5>

      <div className="space-y-5">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="flex gap-4"
          >
            <div className="relative w-[84px] h-[112px] shrink-0 rounded-xl overflow-hidden shadow-sm">
              <Image
                src={imageUrl(post)}
                alt={post.title}
                fill
                className="object-cover"
                sizes="84px"
              />
            </div>

            <div>
                {(post.badge || post.category) && (


              <span className="inline-block mb-1 text-[11px] font-bold uppercase bg-[#54bd05] text-white px-2 py-[2px] rounded">
                 {post.badge
        ? post.badge
        : typeof post.category === "object"
        ? post.category?.name
        : post.category}
              </span>
                )}

              <h6 className="text-[14px] font-semibold leading-snug text-[#121213] line-clamp-2">
                {post.title}
              </h6>

              <div className="text-[12px] text-[#9a9a9a] mt-1">
                By {post.author?.name} · {post.views?.toLocaleString()} Views
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------ FOLLOW US ------------------ */

function FollowUsWidget() {
  const socials = [
    { name: "Facebook", followers: "88.2k Followers", bg: "#2463D3", icon: "ri-facebook-fill" },
    { name: "Twitter - X", followers: "48.6k Followers", bg: "#000000", icon: "ri-twitter-x-fill" },
    { name: "Dribbble", followers: "39.5k Followers", bg: "#EA4C89", icon: "ri-dribbble-fill" },
    { name: "Pinterest", followers: "28.2k Followers", bg: "#B7081B", icon: "ri-pinterest-fill" },
    { name: "LinkedIn", followers: "30.3k Followers", bg: "#0077B5", icon: "ri-linkedin-fill" },
    { name: "Instagram", followers: "24.5k Followers", bg: "#E1306C", icon: "ri-instagram-line" },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h5 className="text-[18px] font-semibold mb-5 text-[#121213]">
        Follow Us
      </h5>

      <ul className="space-y-3">
        {socials.map((s) => (
          <li key={s.name}>
            <div
              className="rounded-md px-4 py-3 flex items-center justify-between text-white"
              style={{ backgroundColor: s.bg }}
            >
              <div className="flex items-center gap-3 font-medium">
                <i className={`${s.icon} text-lg`} />
                {s.name}
              </div>
              <span className="text-[13px]">{s.followers}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------ RIGHT SIDEBAR ------------------ */

export default function RightSidebar() {
  return (
    <aside className="space-y-8 sticky top-[90px]">
      <ExploreCategories />
      <PopularNewsSidebar />
      <FollowUsWidget />
    </aside>
  );
}
