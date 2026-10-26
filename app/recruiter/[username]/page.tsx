/** Implements the recruiter username page and its route-specific behavior. */

import Image from "next/image"
import { MapPin, Link2, CheckCircle } from "lucide-react"
import Link from "next/link"
import RecruiterJobPosts from "./RecruiterJobPosts"

type Recruiter = {
  username: string
  fullName?: string
  headline?: string
  about?: string
  location?: string
  avatarUrl?: string
  websiteUrl?: string
}

/** Renders the recruiter profile page interface. */
export default async function RecruiterProfilePage(props: {
  params: Promise<{ username: string }>
}) {
  // ✅ Next.js 15+
  const { username } = await props.params

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/${username}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return (
      <div className="p-10 text-center text-gray-600">
        Recruiter profile not found
      </div>
    )
  }

  const recruiter: Recruiter = await res.json()

  return (
    <div className="bg-[#f3f2ef] min-h-screen">

      {/* ================= COVER + PROFILE ================= */}
      <div className="bg-white">
        <div className="h-48 bg-[#4b5d4b]" />

        <div className="max-w-6xl mx-auto px-6 -mt-16 pb-6">
          <div className="flex gap-6">

            {/* Avatar */}
           <div className="relative w-36 h-36">
  <Image
    src={
      recruiter.avatarUrl ||
      "https://i.pravatar.cc/160"
    }
    alt={recruiter.username}
    fill
    className="rounded-full border-4 border-white object-cover"
    sizes="144px"
  />
</div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {recruiter.fullName || recruiter.username}
                <CheckCircle className="text-blue-600" size={18} />
              </h1>

              {recruiter.headline && (
                <p className="text-gray-700 mt-1">
                  {recruiter.headline}
                </p>
              )}

              {recruiter.location && (
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <MapPin size={14} />
                  {recruiter.location}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-sm">
                  Follow
                </button>

                <button className="border px-5 py-1.5 rounded-full text-sm">
                  Message
                </button>

                {recruiter.websiteUrl && (
                  <Link
                    href={recruiter.websiteUrl}
                    target="_blank"
                    className="border px-5 py-1.5 rounded-full text-sm flex items-center gap-1"
                  >
                    <Link2 size={14} />
                    Website
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN (MAIN FEED) */}
        <div className="lg:col-span-2 space-y-6">

          <Section title="About">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {recruiter.about || "No description provided."}
            </p>
          </Section>

          <Section title="Experience">
            <p className="text-sm text-gray-600">
              Recruiter · Talent Acquisition · Hiring Specialist
            </p>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {[
                "Recruiting",
                "Talent Acquisition",
                "Human Resources",
                "Interviewing",
              ].map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>

          {/* 🔥 LINKEDIN-STYLE ACTIVITY FEED */}
          <Section title="Activity">
            <RecruiterJobPosts username={username} />
          </Section>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="space-y-6">
          <Section title="Contact Info">
            <p className="text-sm text-gray-700">
              Username: {recruiter.username}
            </p>

            {recruiter.websiteUrl && (
              <p className="text-sm text-gray-700">
                Website: {recruiter.websiteUrl}
              </p>
            )}
          </Section>

          <Section title="Status">
            <p className="text-sm text-gray-600">
              Actively hiring · Posting jobs · Engaging with candidates
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ================= SECTION COMPONENT ================= */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}
