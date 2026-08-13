"use client"

import { useEffect, useState } from "react"
import { MapPin, Users, Eye, Pencil } from "lucide-react"
import Link from "next/link"
import { useRecruiterGuard } from "@/lib/useRecruiterGuard"
import PostJobButton from "@/components/recruiter/PostJobButton"
import { fetchJobPostingEligibility, type JobPostingEligibility } from "@/lib/jobPosting"

type Job = {
  id: number
  title: string
  slug: string
  location: string
  createdAt: string
  views: number
  isActive?: boolean
  employmentType?: string
  _count?: {
    JobApplication: number
  }
}

export default function MyJobsPage() {
  const allowed = useRecruiterGuard()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [eligibility, setEligibility] = useState<JobPostingEligibility | null>(null)

  useEffect(() => {
    if (!allowed) return

    async function loadJobs() {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          console.error("Auth token missing")
          return
        }

        const [jobsRes, eligibilityData] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/recruiter/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          ),
          fetchJobPostingEligibility(token),
        ])

        if (!jobsRes.ok) {
          throw new Error("Failed to fetch recruiter jobs")
        }

        const data = await jobsRes.json()
        setJobs(Array.isArray(data) ? data : [])
        setEligibility(eligibilityData)
      } catch (err) {
        console.error("Failed to load recruiter jobs", err)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [allowed])

  function getPostedText(createdAt: string) {
    const created = new Date(createdAt)
    const now = new Date()

    const diffMs = now.getTime() - created.getTime()

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 60) {
      return "Posted just now"
    }

    if (diffHours < 24) {
      return `Posted ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    }

    if (diffDays === 1) {
      return "Posted yesterday"
    }

    return `Posted ${diffDays} days ago`
  }

  if (!allowed) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#00B5ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#CCCCCC]">Loading jobs…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] px-6 py-10">
      <div className="max-w-[1200px] mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#FFFFFF]">My Jobs</h1>

          <PostJobButton eligibility={eligibility} />
        </div>

        {eligibility && (
          <p className="mb-8 text-sm text-[#B8B8B8]">{eligibility.message}</p>
        )}

        {jobs.some((job) => job.isActive === false) && eligibility && (
          <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Your {eligibility.planLabel} plan allows {eligibility.effectiveLimit} active job
            postings. Only your newest {eligibility.effectiveLimit} jobs appear on the feed —
            older jobs are marked inactive until you upgrade.
          </p>
        )}

        {jobs.length === 0 ? (
          <div className="rounded-xl bg-[#1D2125] border border-[#292C30] p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-[#FFFFFF]">No jobs posted yet</h2>
            <p className="mt-2 text-sm text-[#CCCCCC]">
              {eligibility?.canPost
                ? "Create your first job listing to start receiving applications."
                : "Upgrade your package to start posting jobs."}
            </p>
            <div className="mt-6 flex justify-center">
              <PostJobButton eligibility={eligibility} label="Post Your First Job" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#1D2125] border border-[#292C30] rounded-xl p-6 hover:border-[#00B5ED]/40 transition shadow-sm"
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h2 className="text-lg font-semibold text-[#FFFFFF]">{job.title}</h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                      job.isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-[#171A1E] text-[#B8B8B8] border border-[#292C30]"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive (plan limit)"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-[#B8B8B8] mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#00B5ED]" />
                    {job.location}
                  </span>

                  {job.employmentType && (
                    <span className="bg-[#00B5ED] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {job.employmentType}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#292C30]">
                  <span className="text-xs text-[#B8B8B8]">
                    {getPostedText(job.createdAt)}
                  </span>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-[#B8B8B8]">
                      <Eye size={14} />
                      {job.views} Views
                    </span>

                    <Link
                      href={`/jobs/${job.slug}`}
                      className="flex items-center gap-1 text-xs text-[#00B5ED] hover:text-[#0073FF] font-medium"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    <Link
                      href={`/recruiter/jobs/${job.id}/edit`}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:underline font-medium"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <Link
                      href={`/recruiter/jobs/${job.id}/applications`}
                      className="flex items-center gap-1 text-xs text-[#CCCCCC] hover:text-[#FFFFFF] font-medium"
                    >
                      <Users size={14} />
                      Applicants ({job._count?.JobApplication ?? 0})
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
