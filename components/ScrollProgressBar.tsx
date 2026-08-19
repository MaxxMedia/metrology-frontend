"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight || 0
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight || 0
      const totalScrollable = scrollHeight - clientHeight

      if (totalScrollable > 0) {
        const progress = (scrollTop / totalScrollable) * 100
        setScrollProgress(Math.min(100, Math.max(0, progress)))
      } else {
        setScrollProgress(0)
      }
    }

    // Attach scroll and resize listeners
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })

    // Calculate immediately and also after brief delays for dynamically rendered content
    updateProgress()
    const timer1 = setTimeout(updateProgress, 100)
    const timer2 = setTimeout(updateProgress, 500)

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [pathname])

  return (
    <div
      className="fixed top-0 left-0 right-0 w-full h-[3px] z-[100] pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#0052cc] via-[#0073ff] to-[#38bdf8] shadow-[0_0_8px_rgba(0,115,255,0.9),0_0_2px_rgba(56,189,248,0.8)] transition-[width] duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
