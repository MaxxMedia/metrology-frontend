"use client"
/** Implements the admin directories create page and its route-specific behavior. */


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UploadBox from "@/components/UploadBox"

interface Company {
  id: number
  name: string
}

interface Recruiter {
  id: number
  email: string
  username: string
  companyId: number
}

/** Coordinates the generate slug behavior for this workflow. */
function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

/** Renders the admin create directory page interface. */
export default function AdminCreateDirectoryPage() {
  const router = useRouter()

  const [companies, setCompanies] = useState<Company[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    companyId: "",
    submittedById: "",
  })

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  /* ================= FETCH COMPANIES ================= */

  useEffect(() => {
    /** Loads companies for the current workflow. */
    async function fetchCompanies() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies`
      )
      const data = await res.json()
      setCompanies(Array.isArray(data) ? data : [])
    }

    fetchCompanies()
  }, [])

  /* ================= FETCH RECRUITERS ================= */

  useEffect(() => {
    if (!form.companyId) return

    /** Loads recruiters for the current workflow. */
    async function fetchRecruiters() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiters?companyId=${form.companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      setRecruiters(Array.isArray(data) ? data : [])
    }

    fetchRecruiters()
  }, [form.companyId, token])

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-directory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          companyId: Number(form.companyId),
          submittedById: Number(form.submittedById),
        }),
      }
    )

    if (res.ok) {
      alert("Directory created successfully")
      router.push("/admin/directories")
    } else {
      const error = await res.json()
      alert(error.error || "Failed to create directory")
    }
  }

  /* ================= UI ================= */

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Create Directory (Admin)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Company Dropdown */}
        <div>
          <label className="block font-medium mb-1">
            Select Company
          </label>
          <select
            className="w-full border p-2 rounded"
            value={form.companyId}
            onChange={(e) =>
              setForm({
                ...form,
                companyId: e.target.value,
                submittedById: "", // reset recruiter when company changes
              })
            }
            required
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recruiter Dropdown */}
        <div>
          <label className="block font-medium mb-1">
            Select Recruiter
          </label>
          <select
            className="w-full border p-2 rounded"
            value={form.submittedById}
            onChange={(e) =>
              setForm({ ...form, submittedById: e.target.value })
            }
            required
          >
            <option value="">Select recruiter</option>
            {recruiters.map((rec) => (
              <option key={rec.id} value={rec.id}>
                {rec.username} ({rec.email})
              </option>
            ))}
          </select>
        </div>

        {/* Directory Name */}
        <div>
          <label className="block font-medium mb-1">
            Directory Name
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value
              setForm({
                ...form,
                name,
                slug: generateSlug(name), // ✅ Auto Slug
              })
            }}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-medium mb-1">
            Slug
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
            required
          />
        </div>

        {/* Logo Upload */}
      <UploadBox
  label="Directory Logo"
  value={form.logoUrl}
  onUpload={async (file) => {
    const formData = new FormData()
    formData.append("image", file) // ✅ must match backend

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await res.json()

    setForm((prev) => ({
      ...prev,
      logoUrl: data.imageUrl, // ✅ FIXED
    }))
  }}
/>


        {/* Description */}
        <div>
          <label className="block font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full border p-2 rounded"
            rows={5}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded hover:opacity-90"
        >
          Create Directory
        </button>

      </form>
    </div>
  )
}
