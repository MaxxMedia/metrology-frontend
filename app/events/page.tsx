import { Suspense } from "react"
import EventsContent from "./EventsContent"

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f5b78] mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading events...</p>
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}