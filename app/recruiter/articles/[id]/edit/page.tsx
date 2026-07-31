"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import UploadBox from "@/components/UploadBox"
import { ARTICLE_TOPICS } from "@/lib/topic"

export default function EditRecruiterArticlePage() {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [badge, setBadge] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  /* ================= FETCH ARTICLE ================= */

  useEffect(() => {
    fetchArticle()
  }, [])

  async function fetchArticle() {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/articles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error("Failed to fetch articles")

      const data = await res.json()
      const articles = Array.isArray(data) ? data : data?.data || []

      const article = articles.find((a: any) => a.id === Number(id))

      if (!article) throw new Error("Article not found")

      setTitle(article.title || "")
      setExcerpt(article.excerpt || "")
      setContent(article.content || "")
      setImageUrl(article.imageUrl || "")
      setBadge(article.badge || "")
      // ✅ prefill topic category from the article's linked category
      setCategorySlug(article.category?.slug || "")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) throw new Error("Image upload failed")

      const data = await res.json()
      setImageUrl(data.imageUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  /* ================= UPDATE ARTICLE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categorySlug) {
      setError("Please select a topic category.")
      return
    }

    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recruiter/articles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            excerpt,
            content,
            imageUrl,
            badge: badge.trim() || null,
            categorySlug,
          }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Update failed")
      }

      router.push("/recruiter/articles")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-10">Loading article...</p>

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Article title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* TOPIC CATEGORY */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Topic Category
          </label>
          <select
            className="w-full border p-2 rounded bg-white"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            required
          >
            <option value="">Select a topic</option>
            {ARTICLE_TOPICS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Short excerpt"
          className="w-full border p-2 rounded"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <textarea
          placeholder="Article content"
          className="w-full border p-2 rounded h-48"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Badge (optional) e.g. FEATURED, TRENDING"
          className="w-full border p-2 rounded"
          value={badge}
          onChange={(e) => setBadge(e.target.value.toUpperCase())}
        />

        <UploadBox
          label="Article Image"
          value={imageUrl}
          height="h-52"
          accept="image/*"
          onUpload={handleImageUpload}
        />

        {uploading && (
          <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {saving ? "Updating..." : "Update Article"}
        </button>
      </form>
    </div>
  )
}