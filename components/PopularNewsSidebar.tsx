"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "../types/Post";

export default function PopularNewsSidebar() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=6`
      );
      const data = await res.json();
      setPosts(data.data || data);
    }
    load();
  }, []);

  const imageUrl = (post: Post) =>
    post.imageUrl?.startsWith("http")
      ? post.imageUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`;

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-xl font-semibold mb-6">Popular News</h3>

      <div className="space-y-6">
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
                sizes="84px"
                className="object-cover"
              />
            </div>

            <div>
              <span className="inline-block mb-1 text-[11px] font-bold uppercase px-2 py-1 rounded bg-green-500 text-white">
                {typeof post.category === "object"
                  ? post.category?.name
                  : post.category}
              </span>

              <h4 className="text-sm font-semibold leading-snug line-clamp-2">
                {post.title}
              </h4>

              <div className="text-xs text-gray-400 mt-1">
                By {post.author?.name} · {post.views?.toLocaleString()} Views
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
