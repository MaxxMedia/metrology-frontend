"use client"
/** Implements the admin jobs create page and its route-specific behavior. */


import { useState } from "react"
import { useRouter } from "next/navigation"

/** Renders the create job page interface. */
export default function CreateJobPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    employmentType: "FULL_TIME",
    description: "",
    applyUrl: "",
    linkedinUrl: "",
  })

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  /** Handles the submit interaction and its related state changes. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            slug: form.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, ""),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to create job")
        setLoading(false)
        return
      }

      router.push("/admin/jobs")
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6">
          Create External Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Job Title"
            value={form.title}
            onChange={v => setForm({ ...form, title: v })}
          />

          <Input
            label="Company Name"
            value={form.companyName}
            onChange={v => setForm({ ...form, companyName: v })}
          />

          <Input
            label="Location"
            value={form.location}
            onChange={v => setForm({ ...form, location: v })}
          />

          <Select
            label="Employment Type"
            value={form.employmentType}
            onChange={v => setForm({ ...form, employmentType: v })}
          />

          <Textarea
            label="Job Description"
            value={form.description}
            onChange={v => setForm({ ...form, description: v })}
          />

          <Input
            label="Apply URL (Company Website)"
            value={form.applyUrl}
            onChange={v => setForm({ ...form, applyUrl: v })}
          />

          <Input
            label="LinkedIn Job URL"
            value={form.linkedinUrl}
            onChange={v => setForm({ ...form, linkedinUrl: v })}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg p-2"
      />
    </div>
  )
}

/** Renders the textarea interface. */
function Textarea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full border rounded-lg p-2"
      />
    </div>
  )
}

/** Renders the select interface. */
function Select({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg p-2"
      >
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERNSHIP">Internship</option>
      </select>
    </div>
  )
}