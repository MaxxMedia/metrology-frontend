"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react"

/* ================= TYPES ================= */

type IndustryTalkListItem = {
  id: number
  title: string
  slug: string
  status?: string
  bannerImage?: string
  publishedAt?: string
  interviewDate?: string
  createdAt?: string
  views: number
  featured?: boolean
  trending?: boolean
  homepage?: boolean
  guestName?: string
  companyName?: string
}

const PAGE_SIZE = 10

/* ================= PAGE ================= */

export default function IndustryTalksPage() {
  const router = useRouter()

  const [talks, setTalks] = useState<IndustryTalkListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  /* ================= DEBOUNCE ================= */

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  /* ================= FETCH INDUSTRY TALKS ================= */

  useEffect(() => {
    async function load() {
      setLoading(true)

      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
        const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

        const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

        const urlsToTry = [
          { url: `${baseUrl}/api/industry-talks?page=${page}&limit=${PAGE_SIZE}${searchParam}`, headers: authHeaders },
          { url: `${baseUrl}/api/industry-talks?limit=100`, headers: {} },
          { url: `${baseUrl}/api/industry-talks`, headers: {} },
          { url: `${baseUrl}/api/admin/industry-talks`, headers: authHeaders },
        ]

        let res: Response | null = null
        for (const target of urlsToTry) {
          try {
            const r = await fetch(target.url, { headers: target.headers, cache: "no-store" })
            if (r.ok) {
              res = r
              break
            }
          } catch {
            // try next URL
          }
        }

        if (!res || !res.ok) {
          console.error("Failed all fetch attempts for admin industry-talks")
          setTalks([])
          setTotal(0)
          return
        }

        const json = await res.json()

        const talksData = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.items)
              ? json.items
              : Array.isArray(json.posts)
                ? json.posts
                : []

        const totalCount = json.meta?.total || json.total || talksData.length

        setTalks(talksData)
        setTotal(totalCount)
      } catch (error) {
        console.error("Failed to load industry talks:", error)
        setTalks([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, debouncedSearch])

  /* ================= DELETE ================= */

  async function handleDelete(id: number) {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login first")
      return
    }

    if (!confirm("Delete this industry talk?")) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`)
      }

      setTalks((t) => t.filter((x) => x.id !== id))
      setTotal((t) => t - 1)
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete industry talk")
    }
  }

  /* ================= TABLE ================= */

  const columnHelper = createColumnHelper<IndustryTalkListItem>()

  const columns = [
    columnHelper.display({
      id: "image",
      header: "Image",
      cell: (info) => {
        const url = info.row.original.bannerImage
        return url ? (
          <Image
            src={
              url.startsWith("http")
                ? url
                : `${process.env.NEXT_PUBLIC_API_URL}${url}`
            }
            width={64}
            height={64}
            alt=""
            className="rounded object-cover w-16 h-16"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="text-gray-400" size={24} />
          </div>
        )
      },
    }),

    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => {
        const itemSlug = info.row.original.slug || String(info.row.original.id)
        return (
          <div>
            <a
              href={`/industry-talks/${itemSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold line-clamp-2 hover:text-[#0F5B78] hover:underline"
            >
              {info.getValue()}
            </a>
            <p className="text-xs text-gray-500">
              /{itemSlug}
            </p>
          </div>
        )
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue()
        return (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            status === 'PUBLISHED' 
              ? 'bg-green-100 text-green-700' 
              : status === 'DRAFT' 
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {status || 'DRAFT'}
          </span>
        )
      },
    }),

    columnHelper.accessor("views", {
      header: "Views",
      cell: (info) => (
        <div className="flex items-center gap-1 text-gray-700 font-medium">
          <Eye size={14} className="text-gray-400" />
          {info.getValue() || 0}
        </div>
      ),
    }),

    columnHelper.display({
      id: "published",
      header: "Status / Published",
      cell: (info) => {
        const item = info.row.original
        const isPublished =
          item.status?.toUpperCase() === "PUBLISHED" ||
          (!item.status && !!item.publishedAt)
        const dateStr = item.publishedAt || item.interviewDate || item.createdAt
        const formattedDate = dateStr
          ? new Date(dateStr).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : ""

        return (
          <div className="flex flex-col gap-0.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold w-fit ${
                isPublished
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
            {formattedDate && (
              <span className="text-[11px] text-gray-500">{formattedDate}</span>
            )}
          </div>
        )
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const itemSlug = info.row.original.slug || String(info.row.original.id)
        return (
          <div className="flex gap-2">
            <a
              href={`/industry-talks/${itemSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 text-gray-700 hover:bg-[#0F5B78] hover:text-white rounded transition-colors"
              title="View Industry Talk"
            >
              <Eye size={16} />
            </a>

            <button
              onClick={() =>
                router.push(`/admin/industry-talks/edit/${info.row.original.id}`)
              }
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Edit Industry Talk"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
              title="Delete Industry Talk"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: talks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  if (loading && talks.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0F5B78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🎤 Industry Talks
            </h1>
            <p className="text-sm text-gray-500">
              Manage CEO interviews and industry conversations
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/industry-talks/create")}
            className="bg-[#0F5B78] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> New Industry Talk
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search industry talks..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#0F5B78]/40 focus:border-[#0F5B78]"
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {total} {total === 1 ? 'talk' : 'talks'} found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {talks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">
                {search ? 'No talks match your search' : 'No industry talks found. Create your first one!'}
              </p>
            </div>
          )}

          {/* PAGINATION */}
          {talks.length > 0 && (
            <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-[#0F5B78] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}