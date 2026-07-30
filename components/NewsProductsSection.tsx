"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "../types/Post";

type NewsProductsSectionProps = {
  newsPosts: Post[];
  productPosts: Post[];
};

export default function NewsProductsSection({
  newsPosts,
  productPosts,
}: NewsProductsSectionProps) {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* News Column */}
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              News
            </h2>

            <ol className="space-y-4">
              {newsPosts.slice(0, 7).map((post, idx) => (
                <li key={post.id} className="flex items-start gap-3">
                  <span className="text-lg font-bold text-gray-400 shrink-0 leading-6">
                    {idx + 1}.
                  </span>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-gray-900 hover:text-[#006E6D] transition-all leading-[1.3] text-[16px] font-semibold"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Products Column */}
          <div>
            <h2 className="text-[28px] font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Products
            </h2>

            <div className="space-y-8">
              {productPosts.slice(0, 2).map((post) => {
                const imageUrl =
                  post.imageUrl && post.imageUrl.startsWith("http")
                    ? post.imageUrl
                    : post.imageUrl
                      ? `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                      : "/placeholder.svg";

                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Today";

                return (
                  <div key={post.id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 shrink-0 border border-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        {date}
                      </div>

                      <h3 className="text-[16px] font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-[16px] text-gray-600 mb-3 leading-relaxed line-clamp-2">
                        {post.excerpt || post.content?.substring(0, 100) || ""}
                      </p>

                      <Link
                        href={`/post/${post.slug}`}
                        className="text-[#006E6D] font-bold text-xs hover:text-[#005956] uppercase tracking-wide"
                      >
                        Read More -&gt;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advertisement Column */}
          <div className="space-y-6">
            {/* Ad 1 */}
            <div className="border border-gray-300 overflow-hidden">
              <div className="relative w-full h-48">
                <Image
                  src="/green-factory-team.jpg"
                  alt="Advertisement"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-2 bg-gray-50 text-center text-xs text-gray-600 font-medium">
                Advertisement
              </div>
            </div>

            {/* Ad 2 */}
            <div className="bg-orange-500 p-4 text-white rounded-md">
              <h4 className="font-bold text-[16px] mb-1">SWAP ToolingVERSION FASTER</h4>

              <p className="text-[16px] mb-3 leading-relaxed">
                Directly Through the Parting Line
              </p>

              <div className="relative w-full h-40 mb-3 bg-orange-600 p-2 rounded">
                <Image
                  src="/insert-changer-tool.jpg"
                  alt="Insert Changer"
                  fill
                  className="object-contain rounded"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              <div className="flex gap-2 items-center justify-between">
                <span className="bg-yellow-400 text-orange-600 px-2 py-1 rounded font-bold text-xs">
                  IC
                </span>
                <span className="font-bold text-xs">INSERT CHANGER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
