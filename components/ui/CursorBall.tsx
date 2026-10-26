"use client"
/** Provides the reusable cursor ball UI primitive and its interaction behavior. */


import { useEffect, useRef } from "react"

/** Renders the cursor ball interface. */
export default function CursorBall() {
  const ballRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const scale = useRef(1)

  useEffect(() => {
    /** Handles the mouse move interaction and its related state changes. */
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    /** Handles the mouse over interaction and its related state changes. */
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (target.tagName === "H1") {
        scale.current = 2.2   // Big zoom for H1
      } else if (
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      ) {
        scale.current = 1.5   // Medium zoom for links/buttons
      } else {
        scale.current = 1     // Normal
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)

    /** Coordinates the animate behavior for this component. */
    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.25
      pos.current.y += (mouse.current.y - pos.current.y) * 0.25

      if (ballRef.current) {
        ballRef.current.style.transform = `
          translate3d(${pos.current.x - 20}px, ${pos.current.y - 20}px, 0)
          scale(${scale.current})
        `
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  return (
    <div
      ref={ballRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]
                 w-10 h-10 rounded-full
                 border border-blue-500/50
                 bg-blue-500/20
                 transition-transform duration-300 ease-out
                 flex items-center justify-center"
    >
      <div className="w-1 h-1 rounded-full bg-blue-400/50" />
    </div>
  )
}
