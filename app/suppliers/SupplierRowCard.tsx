"use client"

import Link from "next/link"
import Image from "next/image"
import {
  LucideFacebook,
  LucideLinkedin,
  LucideTwitter,
  LucideYoutube,
  LucideEye,
} from "lucide-react"

/* ---------------- HELPER ---------------- */
function stripHtml(html: string) {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

/* ---------------- COMPONENT ---------------- */
export default function SupplierRowCard({ supplier }: any) {
  const social = supplier.socialLinks || {}
  const views = supplier.views ?? 0

  /* 🔗 TRACK CONNECTION */
  const trackConnection = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${supplier.id}/connection`,
        { method: "POST" }
      )
    } catch (err) {
      console.error("Failed to track connection", err)
    }
  }

  return (
    <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-4 sm:p-6 flex flex-col lg:flex-row gap-6">

      {/* LOGO */}
      <div className="w-full lg:w-40 flex items-center justify-center shrink-0 bg-[#171A1E] border border-[#292C30] rounded-lg p-3">
        {supplier.logoUrl ? (
          <Image
            src={supplier.logoUrl}
            alt={supplier.name}
            width={160}
            height={90}
            className="object-contain max-h-24"
          />
        ) : (
          <div className="text-[#858585] text-sm">No Logo</div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TITLE */}
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {supplier.name}
        </h2>

        {supplier.location && (
          <p className="text-sm text-[#B8B8B8] mt-1">
            {supplier.location}
          </p>
        )}

        {/* DESCRIPTION */}
        <p className="text-sm text-[#CCCCCC] mt-3 line-clamp-4 leading-relaxed">
          {stripHtml(supplier.description)}
        </p>

        {/* FOOTER */}
        <div className="mt-5 pt-4 border-t border-[#292C30]">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">

            {/* LEFT INFO */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

              {/* VIEWS */}
              <div className="flex items-center gap-2 text-xs text-[#B8B8B8]">
                <LucideEye className="w-4 h-4 text-[#00B5ED]" />
                <span>{views.toLocaleString()} views</span>
              </div>

              {/* VIDEO */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[#B8B8B8]">
                  Video
                </span>
                <span className="w-9 h-9 flex items-center justify-center border border-[#292C30] rounded-lg bg-[#171A1E]">
                  <LucideYoutube className="w-5 h-5 text-red-500" />
                </span>
              </div>

              {/* SOCIAL */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase text-[#B8B8B8]">
                  Connect
                </span>

                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackConnection}
                    className="w-9 h-9 bg-[#3b5998] rounded-lg flex items-center justify-center hover:opacity-90 transition"
                  >
                    <LucideFacebook className="w-4 h-4 text-white" />
                  </a>
                )}

                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackConnection}
                    className="w-9 h-9 bg-[#0077b5] rounded-lg flex items-center justify-center hover:opacity-90 transition"
                  >
                    <LucideLinkedin className="w-4 h-4 text-white" />
                  </a>
                )}

                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackConnection}
                    className="w-9 h-9 bg-[#171A1E] border border-[#292C30] rounded-lg flex items-center justify-center hover:border-white transition"
                  >
                    <LucideTwitter className="w-4 h-4 text-white" />
                  </a>
                )}

                {social.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackConnection}
                    className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center hover:opacity-90 transition"
                  >
                    <LucideYoutube className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/suppliers/${supplier.slug}`}
              className="lg:ml-auto w-full lg:w-auto text-center bg-[#0073FF] hover:bg-[#0060d6] text-white px-6 py-3 text-sm font-semibold rounded-lg uppercase tracking-wider transition"
            >
              View Showroom
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}
