"use client"

import { useState, useEffect } from "react"
import EventRegistrationForm from "@/components/EventRegistrationForm"

interface Props {
  slug: string
}

export default function EventRegisterModal({ slug }: Props) {
  const [open, setOpen] = useState(false)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-block bg-[#0073FF] hover:bg-[#0060D0] text-white px-8 py-3 font-bold transition rounded-xl shadow-lg shadow-[#0073FF]/20"
      >
        REGISTER NOW
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative bg-[#1D2125] border border-[#292C30] text-[#CCCCCC] w-full max-w-4xl rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#B8B8B8] hover:text-white text-xl transition"
            >
              ✕
            </button>

            <EventRegistrationForm slug={slug} />
          </div>
        </div>
      )}
    </>
  )
}
