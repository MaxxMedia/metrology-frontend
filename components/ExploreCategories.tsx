"use client";
/** Implements the explore categories component and its related interface behavior. */

import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Gaming", count: 24, bg: "/images/cat-gaming.jpg" },
  { name: "Sports", count: 30, bg: "/images/cat-sports.jpg" },
  { name: "Technology", count: 22, bg: "/images/cat-tech.jpg" },
  { name: "Politics", count: 25, bg: "/images/cat-politics.jpg" },
  { name: "Travel", count: 16, bg: "/images/cat-travel.jpg" },
];

/** Renders the explore categories interface. */
export default function ExploreCategories() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="text-xl font-semibold mb-6">Explore Categories</h3>

      <div className="space-y-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.name.toLowerCase()}`}
            className="relative block h-[70px] rounded-lg overflow-hidden group"
          >
            <Image
  src={cat.bg}
  alt={cat.name}
  fill
  className="object-cover group-hover:scale-105 transition"
  sizes="(max-width:768px) 100vw, 300px"
/>

            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 flex items-center justify-between px-4 h-full text-white font-semibold">
              <span>
                {cat.name} ({cat.count})
              </span>
              <span className="text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
