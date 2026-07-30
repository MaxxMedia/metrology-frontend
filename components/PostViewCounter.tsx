// components/PostViewCounter.tsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface PostViewCounterProps {
  slug: string
  type?: "post" | "industry-talk"
}

export default function PostViewCounter({ slug, type = "post" }: PostViewCounterProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Early return if no slug
    if (!slug || typeof window === "undefined") return

    // Determine the type
    const isIndustryTalk = type === "industry-talk" || pathname?.includes("/industry-talks/")
    const actualType = isIndustryTalk ? "industry-talk" : "post"
    
    const key = `viewed-${actualType}-${slug}`

    // Check session storage
    if (sessionStorage.getItem(key)) return

    // Build endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const endpoint = isIndustryTalk
      ? `${baseUrl}/api/industry-talks/slug/${slug}/view`
      : `${baseUrl}/api/posts/slug/${slug}/view`

    // Make the request
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem(key, "true")
        } else {
          // Optional: Log but don't show to user
          console.debug(`View count ${res.status} for ${actualType}:`, slug)
        }
      })
      .catch(() => {
        // Silent fail - don't break the user experience
        // Optional: Log to analytics in production
      })
  }, [slug, type, pathname])

  return null
}