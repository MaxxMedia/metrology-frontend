"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Mail, Phone, Clock, FileText, Check, X } from "lucide-react"

type Application = {
  id: number
  resumeUrl: string | null
  coverNote: string | null
  status: string
  createdAt: string

  User: {
    id: number
    fullName: string | null
    email: string
    headline: string | null
    phone: string | null
  }

  Job: {
    title: string
    location: string
    employmentType: string

    Company: {
      name: string
    } | null
  } | null
}

export default function JobApplicantsPage() {
  const params = useParams()
  const jobId = params.jobId as string

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplicants() {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/job/${jobId}`,
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
        console.error("Failed to load applicants", err)
      } finally {
        setLoading(false)
      }
    }

    loadApplicants()
  }, [jobId])

  async function updateStatus(applicationId: number, status: "shortlisted" | "rejected") {
    const token = localStorage.getItem("token")

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    )

    // ✅ Update UI instantly
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status } : app
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] p-10 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00B5ED] border-t-transparent rounded-full animate-spin mr-3"></div>
        <span>Loading applicants...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6 text-[#FFFFFF]">
          Job Applicants
        </h1>

        {applications.length === 0 && (
          <div className="bg-[#1D2125] border border-[#292C30] p-6 rounded-xl text-[#B8B8B8]">
            No applications yet.
          </div>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-[#1D2125] border border-[#292C30] rounded-xl shadow-lg p-6 text-[#CCCCCC]"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[#00B5ED]">
                    {app.User?.fullName || "Candidate"}
                  </h2>

                  <p className="text-[#B8B8B8] mt-1">
                    {app.User?.headline || "—"}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize
                    ${
                      app.status === "shortlisted"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : app.status === "rejected"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-[#00B5ED]/20 text-[#00B5ED] border border-[#00B5ED]/30"
                    }`}
                >
                  {app.status}
                </span>
              </div>

              {/* ✅ META - Email and Date only */}
              <div className="flex flex-wrap gap-4 text-xs text-[#B8B8B8] mt-3">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-[#00B5ED]" />
                  {app.User?.email}
                </span>

                {app.User?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-[#00B5ED]" />
                    {app.User.phone}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-[#00B5ED]" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* ✅ JOB DETAILS - Moved here with border top */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm border-t border-[#292C30] pt-4">
                <div>
                  <span className="font-semibold text-[#FFFFFF]">Job:</span>{" "}
                  {app.Job?.title}
                </div>

                <div>
                  <span className="font-semibold text-[#FFFFFF]">Location:</span>{" "}
                  {app.Job?.location}
                </div>

                <div>
                  <span className="font-semibold text-[#FFFFFF]">Employment Type:</span>{" "}
                  {app.Job?.employmentType}
                </div>
              </div>

              {/* COVER NOTE */}
              {app.coverNote && (
                <div className="mt-5">
                  <p className="font-semibold text-[#FFFFFF] mb-2">
                    Cover Note
                  </p>

                  <div className="bg-[#171A1E] border border-[#292C30] rounded-xl p-4 text-sm text-[#CCCCCC]">
                    {app.coverNote}
                  </div>
                </div>
              )}

              {/* RESUME */}
              {app.resumeUrl && (
                <div className="mt-5">
                  <p className="font-semibold text-[#FFFFFF] mb-2">
                    Resume
                  </p>

                  <a
                    href={`${app.resumeUrl}?dl=1`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0073FF] text-white rounded-xl hover:bg-[#0060D0] transition font-medium text-sm"
                  >
                    <FileText size={18} />
                    Download Resume
                  </a>
                </div>
              )}

              {/* ACTIONS */}
              <hr className="my-5 border-[#292C30]" />
              {app.status === "applied" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(app.id, "shortlisted")}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    <Check size={14} />
                    Shortlist
                  </button>

                  <button
                    onClick={() => updateStatus(app.id, "rejected")}
                    className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    <X size={14} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}