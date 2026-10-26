"use client"
/** Implements the job job view tracker component and its related interface behavior. */


import { useEffect } from "react"

/** Renders the job view tracker interface. */
export default function JobViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${slug}/view`,
      { method: "POST" }
    )
  }, [slug])

  return null
}
