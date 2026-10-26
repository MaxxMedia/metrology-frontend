"use client"
/** Implements the admin magazines page and its route-specific behavior. */


import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import CreateIssuePost from "@/components/CreateIssuePost" // ✅ NEW IMPORT

export default function AdminMagazinesPage() {
  const [magazines, setMagazines] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const [coverStories, setCoverStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showIssueForm, setShowIssueForm] = useState(false) // ✅ NEW STATE


useEffect(() => {
  const token = localStorage.getItem("token")

  /** Loads data for the current workflow. */
  async function fetchData() {
    try {
      const [magRes, authRes, coverRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines/authors`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines/cover-stories`),
      ])
      // ✅ LOGS MUST BE HERE — BEFORE .json()
console.log("=== API URL ===", process.env.NEXT_PUBLIC_API_URL)
console.log("mag:", magRes.status, magRes.url)
console.log("auth:", authRes.status, authRes.url)
console.log("cover:", coverRes.status, coverRes.url)

const magText = await magRes.clone().text()
const authText = await authRes.clone().text()
const coverText = await coverRes.clone().text()
console.log("mag body:", magText.slice(0, 300))
console.log("auth body:", authText.slice(0, 300))
console.log("cover body:", coverText.slice(0, 300))


console.log({
  magazine: {
    status: magRes.status,
    ok: magRes.ok,
    url: magRes.url,
  },
  authors: {
    status: authRes.status,
    ok: authRes.ok,
    url: authRes.url,
  },
  coverStories: {
    status: coverRes.status,
    ok: coverRes.ok,
    url: coverRes.url,
  },
})

if (!magRes.ok) {
  const body = await magRes.text()
  console.error("Magazine API:", body)
  return
}

if (!authRes.ok) {
  const body = await authRes.text()
  console.error("Authors API:", body)
  return
}

if (!coverRes.ok) {
  const body = await coverRes.text()
  console.error("Cover Stories API:", body)
  return
}


      const [mags, auths, covers] = await Promise.all([
        magRes.json(),
        authRes.json(),
        coverRes.json(),
      ])
        
      setMagazines(mags)
      setAuthors(auths)
      setCoverStories(covers)

    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])

  /** Removes the magazine record or interface element. */
  async function deleteMagazine(id: number) {
    const token = localStorage.getItem("token")

    if (!confirm("Delete this magazine?")) return

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    setMagazines(prev => prev.filter(m => m.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Magazines</h1>

        <div className="flex gap-4">
          <Link
            href="/admin/magazines/create"
            className="bg-black text-white px-5 py-2 rounded"
          >
            + Create Magazine
          </Link>

          <Link
            href="/admin/magazines/authors/create"
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            + Create Author
          </Link>

          <Link
            href="/admin/magazines/cover-stories/create"
            className="bg-purple-600 text-white px-5 py-2 rounded"
          >
            + Create Cover Story
          </Link>

          {/* ✅ NEW ISSUE BUTTON (ADDED ONLY) */}
          <button
            onClick={() => setShowIssueForm(prev => !prev)}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            + Issue
          </button>
        </div>
      </div>

      {/* ✅ ISSUE FORM (ADDED ONLY) */}
      {showIssueForm && (
        <div className="bg-gray-50 p-6 rounded-xl border">
          <CreateIssuePost />
        </div>
      )}

      {/* ================= MAGAZINES ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Magazines</h2>

        {magazines.length === 0 && (
          <p className="text-gray-500">No magazines found.</p>
        )}

        <div className="grid gap-6">
          {magazines.map(m => (
            <div
              key={m.id}
              className="bg-white  rounded-xl shadow p-6 flex gap-6"
            >
              <div className="w-32 h-40 relative shrink-0">
                {m.coverImageUrl ? (
                  <Image
                    src={m.coverImageUrl}
                    alt={m.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{m.title}</h3>

                <p className="text-sm text-gray-600">
                  Author: {m.MagazineAuthor?.name || "—"}
                </p>

                <p className="text-sm text-gray-600">
                  Cover Story: {m.CoverStory?.title || "—"}
                </p>

                <div className="flex gap-4 pt-3">
                  <Link
                    href={`/admin/magazines/${m.id}/registrations`}
                    className="text-blue-600 text-sm"
                  >
                    Registrations
                  </Link>

                  <button
                    onClick={() => deleteMagazine(m.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= AUTHORS ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Authors</h2>

        {authors.length === 0 && (
          <p className="text-gray-500">No authors found.</p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {authors.map(author => (
            <div key={author.id} className="border p-4 rounded shadow bg-white">
              <p className="font-semibold">{author.name}</p>
              <p className="text-sm text-gray-500">
                {author.designation || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= COVER STORIES ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Cover Stories</h2>

        {coverStories.length === 0 && (
          <p className="text-gray-500">No cover stories found.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {coverStories.map(story => (
            <div key={story.id} className="border p-4 rounded shadow bg-white">
              <p className="font-semibold">{story.title}</p>
              <p className="text-sm text-gray-500">
                Author: {story.author?.name || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
