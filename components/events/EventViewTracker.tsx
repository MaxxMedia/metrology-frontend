"use client"
/** Implements the events event view tracker component and its related interface behavior. */


import { useEffect, useRef } from "react"

/** Renders the event view tracker interface. */
export default function EventViewTracker({ slug }: { slug: string }) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}/view`, {
      method: "POST",
    }).catch(() => {
      // silent — view tracking should never block or affect the page
    })
  }, [slug])

  return null
}