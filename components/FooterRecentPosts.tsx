"use client";
/** Implements the footer recent posts component and its related interface behavior. */


import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/types/Post";

/** Renders the footer recent posts interface. */
export default function FooterRecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    /** Loads posts for the current workflow. */
    async function fetchPosts() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=5`
      );
      const data = await res.json();
      setPosts(data.data || data || []);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <h3 className="text-white font-semibold mb-4 text-sm">
        Recent Posts
      </h3>

      <ul className="space-y-4">
        {posts.slice(0, 3).map((post) => {
          const publishedDate =
            post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—";

          return (
            <li key={post.id} className="flex gap-3">
              {/* Thumbnail */}
              <Link
                href={`/post/${post.slug}`}
                className="relative w-16 h-16 shrink-0 rounded overflow-hidden"
              >
                <Image
                  src={
                    post.imageUrl?.startsWith("http")
                      ? post.imageUrl
                      : post.imageUrl
                        ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                        : "/placeholder.jpg"
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </Link>

              {/* Content */}
              <div className="text-sm">
                <Link
                  href={`/post/${post.slug}`}
                  className="text-white hover:underline line-clamp-2"
                >
                  {post.title}
                </Link>

                <p className="text-xs text-gray-400 mt-1">
                  {publishedDate}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
