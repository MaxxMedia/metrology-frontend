"use client"
/** Implements the admin jobs page and its route-specific behavior. */


import { useEffect, useMemo, useState } from "react"
import {
  ChevronDown,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  Search,
  Eye,
  FileText,
} from "lucide-react"
import AdminPagination, { ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination"

const PAGE_SIZE = ADMIN_PAGE_SIZE

/* ================= TYPES ================= */

type Job = {
  id: number
  title: string
  location: string
  employmentType: string
  createdAt: string
  views: number
  appliedCount: number // ✅ NEW
}

type CompanyJobs = {
  id: number
  name: string
  slug: string
  jobsCount: number
  jobs: Job[]
}

/* ================= PAGE ================= */

export default function AdminJobsPage() {
  const [companies, setCompanies] = useState<CompanyJobs[]>([])
  const [openCompanyId, setOpenCompanyId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!token) return

    setLoading(true)

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/admin/company-jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
  const companiesData = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
    ? data.data
    : []

  setCompanies(companiesData)
  setLoading(false)
})
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [token])

  /* ================= STATS ================= */

  const filteredCompanies = useMemo(
    () =>
      companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [companies, searchTerm]
  )

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE))

  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCompanies.slice(start, start + PAGE_SIZE)
  }, [filteredCompanies, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const totalJobs = companies.reduce(
    (sum, c) => sum + c.jobsCount,
    0
  )

  const totalJobViews = companies.reduce(
    (sum, c) =>
      sum + c.jobs.reduce((jSum, j) => jSum + (j.views ?? 0), 0),
    0
  )

  const totalAppliedJobs = companies.reduce(
    (sum, c) =>
      sum + c.jobs.reduce((jSum, j) => jSum + (j.appliedCount ?? 0), 0),
    0
  )

  /* ================= HELPERS ================= */

  const getEmploymentTypeColor = (type: string) => {
    const types: { [key: string]: string } = {
      FULL_TIME: "bg-green-100 text-green-700 border-green-200",
      PART_TIME: "bg-blue-100 text-blue-700 border-blue-200",
      CONTRACT: "bg-purple-100 text-purple-700 border-purple-200",
      INTERNSHIP: "bg-orange-100 text-orange-700 border-orange-200",
      REMOTE: "bg-cyan-100 text-cyan-700 border-cyan-200",
    }
    return types[type] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  /** Normalizes the employment type value for consistent display or use. */
  const formatEmploymentType = (type: string) =>
    type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading jobs...</p>
        </div>
      </div>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
       {/* HEADER */}
<div className="mb-8 flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      Job Management
    </h1>
    <p className="text-gray-600">
      Manage all job listings across companies
    </p>
  </div>

  <div>
   <a
  href="/admin/jobs/create"
  className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition font-medium"
>
  + Create Job
</a>
  </div>
</div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <StatCard
            label="Total Jobs"
            value={totalJobs}
            icon={<Briefcase className="w-7 h-7 text-white" />}
            color="from-green-500 to-green-600"
          />

          <StatCard
            label="Total Job Views"
            value={totalJobViews}
            icon={<Eye className="w-7 h-7 text-white" />}
            color="from-indigo-500 to-indigo-600"
          />

          <StatCard
            label="Number of Applied Jobs"
            value={totalAppliedJobs}
            icon={<FileText className="w-7 h-7 text-white" />}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl shadow-sm  p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3  rounded-lg"
            />
          </div>
        </div>

        {/* COMPANIES */}
        <div className="space-y-4">
          {paginatedCompanies.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              No companies found matching your search.
            </div>
          ) : (
            paginatedCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl shadow-sm  overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenCompanyId(
                    openCompanyId === company.id ? null : company.id
                  )
                }
                className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {company.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {company.jobsCount} active jobs
                  </p>
                </div>
                <ChevronDown
                  className={`transition-transform ${
                    openCompanyId === company.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openCompanyId === company.id && (
                <div className="border-t bg-gray-50 divide-y">
                  {company.jobs.map(job => (
                    <div key={job.id} className="p-6 bg-white">
                      <h3 className="font-semibold text-lg mb-2">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {job.location}
                        </span>

                        <span className={`px-3 py-1 rounded-full border text-xs ${getEmploymentTypeColor(job.employmentType)}`}>
                          <Clock size={12} />
                          {formatEmploymentType(job.employmentType)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {job.views} views
                        </span>

                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {job.appliedCount} applied
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            ))
          )}
        </div>

        {filteredCompanies.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCompanies.length}
            pageSize={PAGE_SIZE}
            itemLabel="companies"
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>
    </div>
  )
}

/** Renders the stat card interface. */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm  p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div
        className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  )
}
