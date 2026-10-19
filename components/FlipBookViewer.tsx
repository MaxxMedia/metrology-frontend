"use client"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Maximize2, X } from "lucide-react"

const HTMLFlipBook: any = dynamic(
  () => import("react-pageflip"),
  { ssr: false }
)

type Props = {
  pages: string[]
}

export default function FlipBookViewer({ pages }: Props) {
  const bookRef = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [size, setSize] = useState({
    width: 600,
    height: 800,
  })

  /* ================= RESPONSIVE SIZING ================= */

  useEffect(() => {
    const updateSize = () => {
      if (isFullscreen) {
        const headerHeight = 56

        const width = window.innerWidth * 0.95
        const height = (window.innerHeight - headerHeight) * 0.95

        setSize({ width, height })
      } else {
        if (window.innerWidth < 768) {
          setSize({ width: 350, height: 500 })
        } else {
          setSize({ width: 600, height: 800 })
        }
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [isFullscreen])
if (!pages?.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No flipbook pages available.
      </div>
    )
  }

  return (
    <>
      {/* ================= NORMAL MODE ================= */}
      {!isFullscreen && (
        <div className="relative flex justify-center py-10">
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-6 bg-white text-black shadow-md px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-100"
          >
            <Maximize2 size={16} />
            Fullscreen
          </button>

          <HTMLFlipBook
            ref={bookRef}
            width={size.width}
            height={size.height}
            size="stretch"
            minWidth={300}
            maxWidth={2000}
            minHeight={400}
            maxHeight={2000}
            showCover
            mobileScrollSupport
            className="shadow-2xl rounded-lg"
          >
            {pages.map((page, index) => (
              <div key={index} className="bg-white">
                <div className="relative w-full h-full">
  <Image
    src={page}
    alt={`Page ${index + 1}`}
    fill
    className="object-cover"
    unoptimized
    sizes="100vw"
  />
</div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      )}

      {/* ================= FULLSCREEN MODE ================= */}
   {isFullscreen && (
  <div className="fixed inset-0 z-[9999] bg-black">

    {/* HEADER */}
    <div className="absolute top-0 left-0 right-0 h-14 bg-black flex items-center justify-between px-6 z-10 border-b border-white/10">
      <h2 className="text-white text-sm font-medium">
        Digital Edition
      </h2>

      <button
        onClick={() => setIsFullscreen(false)}
        className="text-white hover:opacity-70"
      >
        <X size={22} />
      </button>
    </div>

    {/* BOOK AREA */}
    <div className="absolute inset-0 pt-14 flex items-center justify-center">

      <HTMLFlipBook
        ref={bookRef}
        width={(window.innerHeight - 80) * 0.85}   // ðŸ‘ˆ WIDTH based on height
        height={window.innerHeight - 80}           // ðŸ‘ˆ FULL HEIGHT
        size="fixed"
        minWidth={300}
        maxWidth={4000}
        minHeight={400}
        maxHeight={4000}
        showCover
        mobileScrollSupport
        className="shadow-2xl"
      >
        {pages.map((page, index) => (
          <div key={index} className="bg-white">
           <div className="relative w-full h-full">
  <Image
    src={page}
    alt={`Page ${index + 1}`}
    fill
    className="object-cover"
    unoptimized
    sizes="100vw"
  />
</div>
          </div>
        ))}
      </HTMLFlipBook>

    </div>
  </div>
)}

    </>
  )
}
