"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  Printer,
  Copy,
  Check,
  Share2,
} from "lucide-react"

type SharePost = {
  title: string
  slug: string
  youtubeUrl?: string
  facebookUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  email?: string
  whatsappNumber?: string
}

type Props = {
  post: SharePost
}

export default function ShareSection({ post }: Props) {
  const [copied, setCopied] = useState(false)

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : ""

  const shareText = encodeURIComponent(post.title)

  /* Track Share API call */
  const trackShare = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.slug}/share`,
        { method: "POST" }
      )
    } catch (err) {
      console.error("Failed to track share")
    }
  }

  const handleCopy = async () => {
    if (typeof window === "undefined") return
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link")
    }
  }

  const shareButtons = [
    {
      label: "Facebook",
      icon: Facebook,
      href:
        post.facebookUrl ||
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      hoverClass: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white",
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href:
        post.linkedinUrl ||
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      hoverClass: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white",
    },
    {
      label: "Twitter",
      icon: Twitter,
      href:
        post.twitterUrl ||
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`,
      hoverClass: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white",
    },
    {
      label: "WhatsApp",
      customIcon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.277.443-1.025 3.743 3.837-1.006.454.272z" />
        </svg>
      ),
      href: post.whatsappNumber
        ? `https://wa.me/${post.whatsappNumber}?text=${shareText}%20${encodeURIComponent(pageUrl)}`
        : `https://wa.me/?text=${shareText}%20${encodeURIComponent(pageUrl)}`,
      hoverClass: "hover:bg-[#25D366] hover:border-[#25D366] hover:text-white",
    },
    {
      label: "Email",
      icon: Mail,
      href: post.email
        ? `mailto:${post.email}?subject=${shareText}&body=${encodeURIComponent(pageUrl)}`
        : `mailto:?subject=${shareText}&body=${encodeURIComponent(pageUrl)}`,
      hoverClass: "hover:bg-[#EA4335] hover:border-[#EA4335] hover:text-white",
    },
  ]

  return (
    <div className="w-full rounded-2xl bg-[#16181D] px-6 py-5 border border-[#23262D]/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg my-8">
      {/* Left Label */}
      <div className="flex items-center gap-2 text-white font-semibold text-sm md:text-base">
        <Share2 className="w-4 h-4 text-blue-400" />
        <span>Share this post:</span>
      </div>

      {/* Share Actions */}
      <div className="flex items-center flex-wrap gap-2.5">
        {shareButtons.map((btn) => {
          const Icon = btn.icon
          return (
            <Link
              key={btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackShare}
              className={`w-10 h-10 rounded-full bg-[#1D2125] border border-[#2A2E34] text-gray-300 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 ${btn.hoverClass}`}
              title={`Share on ${btn.label}`}
            >
              {Icon ? <Icon className="w-4 h-4" /> : btn.customIcon}
            </Link>
          )
        })}

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className={`h-10 px-3.5 rounded-full bg-[#1D2125] border border-[#2A2E34] text-gray-300 flex items-center gap-1.5 text-xs font-medium transition-all duration-200 shadow-sm hover:scale-105 hover:bg-blue-600 hover:border-blue-600 hover:text-white ${
            copied ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400" : ""
          }`}
          title="Copy post link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="w-10 h-10 rounded-full bg-[#1D2125] border border-[#2A2E34] text-gray-300 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 hover:bg-gray-700 hover:border-gray-700 hover:text-white"
          title="Print page"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
