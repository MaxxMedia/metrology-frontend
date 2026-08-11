import { Suspense } from "react"
import EventsContent from "./EventsContent"

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-[#171A1E] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073FF] mx-auto"></div>
          <p className="mt-4 text-[#CCCCCC]">Loading events...</p>
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}