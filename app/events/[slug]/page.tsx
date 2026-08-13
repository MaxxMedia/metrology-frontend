import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Globe, Mail, Phone } from "lucide-react"
import SupplierAds from "@/components/SupplierAds"
import EventViewTracker from "@/components/events/EventViewTracker"
import EventEnquireForm from "@/components/events/Eventenquireform"
import EventTabs from "@/components/events/Eventtabs"

type Event = {
  id: number
  title: string
  slug: string
  logoUrl?: string
  bannerUrl?: string
  startDate: string
  endDate: string
  timings?: string
  location?: string
  description: string
  websiteUrl?: string
  calendarUrl?: string
  email?: string
  phone?: string
  otherImages?: string[]
  videoGallery?: string[]
  frequency?: string
  edition?: string
  expectedVisitors?: string
  exhibitors?: string
  organizer?: string
  highlights?: string[]
  mapEmbedUrl?: string
  mapUrl?: string
}

type UpcomingEvent = {
  id: number
  title: string
  slug: string
  bannerUrl?: string
  startDate: string
  endDate: string
  location?: string
}

async function getEvent(slug: string): Promise<Event | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

async function getUpcomingEvents(excludeSlug: string): Promise<UpcomingEvent[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  const events: UpcomingEvent[] = await res.json()
  return events.filter(e => e.slug !== excludeSlug).slice(0, 2)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-10 min-h-screen bg-[#171A1E] text-white">
        <h1 className="text-[24px] font-bold text-white">Event not found</h1>
      </div>
    )
  }

  const upcomingEvents = await getUpcomingEvents(slug)

  return (
    <div className="w-full bg-[#171A1E] text-[#CCCCCC] min-h-screen">
      <EventViewTracker slug={slug} />

      {/* ================= HEADER ================= */}
      <div className="relative bg-gradient-to-r from-[#171A1E] via-[#1D2125] to-[#1D247B] text-white border-b border-[#292C30] overflow-hidden">
        {event.bannerUrl && (
          <Image src={event.bannerUrl} alt={event.title} fill className="object-cover opacity-20" priority />
        )}
        <div className="relative max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center gap-6">
          {event.logoUrl && (
            <div className="p-2 border border-[#292C30] bg-[#171A1E] rounded-2xl w-24 flex-shrink-0">
              <Image src={event.logoUrl} alt={event.title} width={90} height={50} className="object-contain rounded-sm" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">{event.title}</h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#CCCCCC] mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-[#00B5ED]" />
                {formatDate(event.startDate)} – {formatDate(event.endDate)}
              </span>
              {event.timings && (
                <span className="flex items-center gap-2">
                  <Clock size={15} className="text-[#00B5ED]" />
                  {event.timings}
                </span>
              )}
            </div>

            {event.location && (
              <span className="flex items-center gap-2 text-sm text-[#CCCCCC]">
                <MapPin size={15} className="text-[#00B5ED]" />
                {event.location}
              </span>
            )}
          </div>

          <div className="text-xs space-y-2 md:text-right text-[#CCCCCC]">
            {event.websiteUrl && (
              <span className="flex md:justify-end items-center gap-2">
                <Globe size={14} className="text-[#00B5ED]" />
                {event.websiteUrl.replace(/^https?:\/\//, "")}
              </span>
            )}
            {event.email && (
              <span className="flex md:justify-end items-center gap-2">
                <Mail size={14} className="text-[#00B5ED]" />
                {event.email}
              </span>
            )}
            {event.phone && (
              <span className="flex md:justify-end items-center gap-2">
                <Phone size={14} className="text-[#00B5ED]" />
                {event.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-4 text-xs text-[#B8B8B8]">
        <Link href="/" className="hover:underline hover:text-white">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/events" className="hover:underline hover:text-white">Events</Link>
        <span className="mx-2">›</span>
        <span className="text-white font-medium">{event.title}</span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        <main className="lg:col-span-8">
          <EventTabs
            event={{
              title: event.title,
              description: event.description,
              images: event.otherImages ?? [],
              videos: event.videoGallery ?? [],
              videoUrl: event.videoGallery && event.videoGallery.length > 0 ? event.videoGallery[0] : undefined,
              frequency: event.frequency,
              edition: event.edition,
              expectedVisitors: event.expectedVisitors,
              exhibitors: event.exhibitors,
              organizer: event.organizer,
              websiteUrl: event.websiteUrl,
              email: event.email,
              phone: event.phone,
              highlights: event.highlights,
            }}
          />
        </main>

        <aside className="lg:col-span-4 space-y-6">

          {/* LOCATION */}
          {event.location && (
            <div className="bg-[#1D2125] border border-[#292C30] rounded-xl overflow-hidden text-white">
              <div className="px-4 py-3 border-b border-[#292C30] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Location</h3>
                <Link
                  href={event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  className="text-xs text-[#00B5ED] hover:underline"
                >
                  Open in Maps ↗
                </Link>
              </div>
              <iframe
                src={
                  event.mapEmbedUrl ||
                  `https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`
                }
                className="w-full h-56 border-0"
                loading="lazy"
              />
            </div>
          )}

          {/* ENQUIRE FORM */}
          <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-4 text-white">
            <h3 className="text-lg font-semibold text-white mb-3">Enquire Form</h3>
            <EventEnquireForm slug={slug} />
          </div>

          {/* UPCOMING EVENTS */}
          {upcomingEvents.length > 0 && (
            <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-4 text-white">
              <h3 className="text-lg font-semibold text-white border-b-2 border-[#00B5ED] inline-block pb-1 mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((e, i) => (
                  <Link key={e.id} href={`/events/${e.slug}`} className="block group">
                    {e.bannerUrl && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden mb-2 border border-[#292C30] bg-[#171A1E]">
                        <Image src={e.bannerUrl} alt={e.title} fill className="object-cover group-hover:scale-105 transition duration-300" unoptimized />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-white group-hover:text-[#00B5ED] transition-colors mb-1">{e.title}</p>
                    <p className="flex items-center gap-2 text-xs text-[#B8B8B8] mb-1">
                      <Calendar size={12} className="text-[#00B5ED]" />
                      {formatDate(e.startDate)}
                    </p>
                    {e.location && (
                      <p className="flex items-center gap-2 text-xs text-[#B8B8B8]">
                        <MapPin size={12} className="text-[#00B5ED]" />
                        {e.location}
                      </p>
                    )}
                    {i < upcomingEvents.length - 1 && <hr className="mt-4 border-[#292C30]" />}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <SupplierAds />
        </aside>
      </div>
    </div>
  )
}