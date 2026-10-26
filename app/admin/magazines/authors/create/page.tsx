"use client"
/** Implements the admin magazines authors create page and its route-specific behavior. */


import { useState } from "react"
import { useRouter } from "next/navigation"
import UploadBox from "@/components/UploadBox"

/** Renders the create author page interface. */
export default function CreateAuthorPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    profileImageUrl: "",
    designation: "",
    linkedinUrl: "",
  })

  /** Handles the submit interaction and its related state changes. */
  async function handleSubmit() {
    const token = localStorage.getItem("token")

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines/authors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    router.push("/admin/magazines/authors")
  }

  /** Uploads the file asset and returns its result to the form. */
  async function uploadFile(file: File) {
    const data = new FormData()
    data.append("image", file)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
      method: "POST",
      body: data,
    })

    const result = await res.json()

    setForm(prev => ({
      ...prev,
      profileImageUrl: result.imageUrl,
    }))
  }

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-2xl font-bold">Create Author</h1>

      <input
        placeholder="Author Name"
        className="w-full border p-3 rounded"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <UploadBox
        label="Profile Image"
        value={form.profileImageUrl}
        onUpload={uploadFile}
      />

      <input
        placeholder="Designation"
        className="w-full border p-3 rounded"
        onChange={e => setForm({ ...form, designation: e.target.value })}
      />

      <input
        placeholder="LinkedIn URL"
        className="w-full border p-3 rounded"
        onChange={e => setForm({ ...form, linkedinUrl: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Create Author
      </button>
    </div>
  )
}
