"use client"
/** Implements the admin companies create page and its route-specific behavior. */


import { useState } from "react"
import { useRouter } from "next/navigation"

/** Renders the create company interface. */
export default function CreateCompany() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    location: "",
  })

  /** Handles the submit interaction and its related state changes. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const token = localStorage.getItem("token")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/companies/admin-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    )

    if (res.ok) {
      router.push("/admin/companies")
    } else {
      alert("Failed to create company")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Company</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Company Name"
          className="input"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Website"
          className="input"
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
        <input
          placeholder="Location"
          className="input"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="input"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button className="btn-primary">Create</button>
      </form>
    </div>
  )
}
