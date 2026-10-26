"use client"
/** Implements the scroll highlight component and its related interface behavior. */


import { useEffect, useState } from "react"

/** Renders the scroll highlight interface. */
export default function ScrollHighlight() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    /** Handles the scroll interaction and its related state changes. */
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setVisible(false)
      } else {
        setVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`bg-red-600 text-white text-sm font-semibold px-4 py-2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
    >
      What’s New and What Works in Mold Manufacturing
    </div>
  )
}