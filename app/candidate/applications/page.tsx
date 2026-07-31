"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Briefcase, MapPin, Clock } from "lucide-react"
import { useCandidateGuard } from "@/lib/useCandidateGuard"

type Application = {
  id: number
  status: string
  createdAt: string
  Job: {
    title: string
    slug: string
    location: string
    companyName?: string
    Company?: {
      name: string
      slug: string
    }
  }
}

export default function MyApplicationsPage() {
  useCandidateGuard()

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()
        if (Array.isArray(data)) {
          setApplications(data)
        }
      } catch (err) {
        console.error("Failed to load applications", err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  if (loading) {
    return <div className="p-10">Loading applications...</div>
  }

  return (
    <div className="bg-[#f3f2ef] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <h1 className="text-2xl font-bold mb-6">
          My Applications
        </h1>

        {applications.length === 0 && (
          <div className="bg-white p-6 rounded shadow-sm text-gray-500">
            You haven’t applied to any jobs yet.
          </div>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-sm p-5"
            >
              {/* HEADER */}
              <Link
                href={
                  app.Job?.Company?.slug
                    ? `/company/${app.Job.Company.slug}`
                    : `/jobs/${app.Job?.slug ?? ""}`
                }
                className="font-semibold text-sm text-blue-600 hover:underline"
              >
                {app.Job?.Company?.name || app.Job?.companyName || "Company"}
              </Link>

              {/* TITLE */}
              <Link
             href={`/jobs/${app.Job?.slug ?? ""}`}
                className="block text-lg font-medium mt-1 hover:underline"
              >
                {app.Job?.title}
              </Link>

              {/* META */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {app.Job?.location}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>

                <span className="flex items-center gap-1">
                  <Briefcase size={12} />
                  Status:{" "}
                  <span className="font-medium capitalize text-blue-600">
                    {app.status}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
