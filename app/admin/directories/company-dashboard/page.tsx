"use client"
/** Implements the admin directories company dashboard page and its route-specific behavior. */


import { useEffect, useState } from "react"
import Link from "next/link"
import SectionCard from "@/app/admin/components/SectionCard"
import CompanyTable from "@/app/admin/components/CompanyTable"
import RecruiterTable from "@/app/admin/components/RecruiterTable"
import DirectoryTable from "@/app/admin/components/DirectoryTable"
import StatCard from "@/app/admin/components/StatCard"

/* ================= TYPES ================= */

import type { Company, Recruiter, Directory } from "@/types/admin"


/* ================= PAGE ================= */

export default function CompanyDashboard() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const [companies, setCompanies] = useState<Company[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [directories, setDirectories] = useState<Directory[]>([])
  const [loading, setLoading] = useState(true)

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!token) return

    /** Loads data for the current workflow. */
    async function fetchData() {
      try {
        const [cRes, rRes, dRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`),

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const c = await cRes.json()
        const r = await rRes.json()
        const d = await dRes.json()

        setCompanies(Array.isArray(c) ? c : [])
        setRecruiters(Array.isArray(r) ? r : [])
        setDirectories(Array.isArray(d) ? d : [])
      } catch (error) {
        console.error("Dashboard fetch error:", error)
        setCompanies([])
        setRecruiters([])
        setDirectories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  /* ================= LOADING STATE ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fc]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">
            Company Management Overview
          </h1>
          <p className="text-sm text-gray-500">
            Manage companies, recruiters and directories
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Companies"
            value={companies.length}
          />
          <StatCard
            label="Total Recruiters"
            value={recruiters.length}
          />
          <StatCard
            label="Total Directories"
            value={directories.length}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <Link
            href="/admin/companies/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            + Create Company
          </Link>

          <Link
            href="/admin/recruiters/create"
            className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            + Link to Company
          </Link>

          <Link
            href="/admin/directories/create"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            + Create Directory
          </Link>
        </div>

        {/* COMPANIES */}
        <SectionCard title="Companies">
          <CompanyTable companies={companies} />
        </SectionCard>

        {/* RECRUITERS */}
        <SectionCard title="Recruiters">
          <RecruiterTable recruiters={recruiters} />
        </SectionCard>

        {/* DIRECTORIES */}
        <SectionCard title="Directories">
          <DirectoryTable directories={directories} />
        </SectionCard>

      </div>
    </div>
  )
}
