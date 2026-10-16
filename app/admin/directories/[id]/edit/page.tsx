"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type DirectoryForm = {
  name: string
  slug: string
  description: string
  logoUrl: string
  phoneNumber: string
  email: string
  website: string
  googleMapUrl: string
}

const emptyForm: DirectoryForm = {
  name: "", slug: "", description: "", logoUrl: "", phoneNumber: "", email: "", website: "", googleMapUrl: "",
}

export default function EditDirectoryPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<DirectoryForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/directories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load directory")
        setForm({
          name: data.name || "", slug: data.slug || "", description: data.description || "",
          logoUrl: data.logoUrl || "", phoneNumber: data.phoneNumber || "", email: data.email || "",
          website: data.website || "", googleMapUrl: data.googleMapUrl || "",
        })
      } catch (err: any) {
        setError(err.message || "Failed to load directory")
      } finally {
        setLoading(false)
      }
    }
    if (id) loadDirectory()
  }, [id, token])

  const updateField = (field: keyof DirectoryForm, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/directories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update directory")
      router.push("/admin/directories")
    } catch (err: any) {
      setError(err.message || "Failed to update directory")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading directory...</div>

  return (
    <main className="min-h-screen bg-[#f6f8fc] p-6 md:p-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Edit Supplier Directory</h1>
          <Link href="/admin/directories" className="text-sm text-blue-600 hover:underline">Back to directories</Link>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {!error || form.name ? (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
            {([
              ["name", "Directory name", true], ["slug", "URL slug", true], ["description", "Description", true],
              ["logoUrl", "Logo URL", false], ["phoneNumber", "Phone", false], ["email", "Email", false],
              ["website", "Website", false], ["googleMapUrl", "Google Maps URL", false],
            ] as const).map(([field, label, required]) => (
              <label key={field} className="block space-y-1 text-sm font-medium text-slate-700">
                {label}
                {field === "description" ? (
                  <textarea value={form[field]} onChange={(event) => updateField(field, event.target.value)} required={required} rows={5} className="w-full rounded-lg border p-3" />
                ) : (
                  <input value={form[field]} onChange={(event) => updateField(field, event.target.value)} required={required} className="w-full rounded-lg border p-3" />
                )}
              </label>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
              <Link href="/admin/directories" className="rounded-lg border px-5 py-2.5 text-slate-700">Cancel</Link>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  )
}
