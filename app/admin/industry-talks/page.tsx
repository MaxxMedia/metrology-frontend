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
  bannerImage?: string
  publishedAt?: string
  views: number
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks?page=${page}&limit=${PAGE_SIZE}&search=${debouncedSearch}`
        )

        const json = await res.json()

        setTalks(json.items || [])
        setTotal(json.total || 0)
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
    if (!token) return alert("Unauthorized")

    if (!confirm("Delete this industry talk?")) return

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    setTalks((t) => t.filter((x) => x.id !== id))
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
            className="rounded object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="text-gray-400" />
          </div>
        )
      },
    }),

    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <div>
          <p className="font-semibold line-clamp-2">
            {info.getValue()}
          </p>
          <p className="text-xs text-gray-500">
            /{info.row.original.slug}
          </p>
        </div>
      ),
    }),

    columnHelper.accessor("views", {
      header: "Views",
      cell: (info) => (
        <div className="flex items-center gap-1 text-gray-700 font-medium">
          <Eye size={14} className="text-gray-400" />
          {info.getValue()}
        </div>
      ),
    }),

    columnHelper.display({
      id: "published",
      header: "Published",
      cell: (info) =>
        info.row.original.publishedAt ? (
          new Date(info.row.original.publishedAt).toLocaleDateString()
        ) : (
          <span className="text-gray-400">Draft</span>
        ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/admin/industry-talks/edit/${info.row.original.id}`)
            }
            className="p-2 bg-blue-50 text-blue-600 rounded"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-2 bg-red-50 text-red-600 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: talks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            🎤 Industry Talks
          </h1>

          <button
            onClick={() => router.push("/admin/industry-talks/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> New Industry Talk
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search industry talks..."
                className="pl-10 pr-4 py-2 border rounded w-full"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {talks.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">
              No industry talks found.
            </p>
          )}

          {/* PAGINATION */}
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages || 1}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft />
              </button>

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}