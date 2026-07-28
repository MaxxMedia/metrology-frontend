"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import UploadBox from "@/components/UploadBox"
import {
  Menu,
  Save,
  Eye,
  ChevronDown,
  Upload,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import "react-quill-new/dist/quill.snow.css"
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

/* ================= TYPES ================= */

type QA = {
  id: string
  question: string
  answer: string
  videoTimestamp: string
  highlightQuote: string
  displayOrder: number
}

// NOTE: these values must match the backend validator's `isIn(["youtube", "vimeo", "upload"])`
type VideoType = "youtube" | "vimeo" | "upload"

type FormState = {
  title: string
  slug: string

  industryIds: number[]
  tags: string[]

  interviewDate: string
  readingTime: string
  status: "DRAFT" | "PUBLISHED"
  featured: boolean
  trending: boolean
  homepage: boolean

  bannerImage: string
  videoType: VideoType
  videoUrl: string
  uploadedVideo: string
  thumbnailUrl: string
  duration: string
  autoplay: boolean
  showControls: boolean

  guestPhoto: string
  guestName: string
  designation: string
  companyName: string
  companyLogo: string
  linkedinUrl: string
  website: string
  companyProfileUrl: string
  shortBio: string

  introduction: string
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  industryIds: [],
  tags: [],
  interviewDate: "",
  readingTime: "",
  status: "DRAFT",
  featured: false,
  trending: false,
  homepage: false,
  bannerImage: "",
  videoType: "youtube",
  videoUrl: "",
  uploadedVideo: "",
  thumbnailUrl: "",
  duration: "",
  autoplay: false,
  showControls: true,
  guestPhoto: "",
  guestName: "",
  designation: "",
  companyName: "",
  companyLogo: "",
  linkedinUrl: "",
  website: "",
  companyProfileUrl: "",
  shortBio: "",
  introduction: "",
}

function newQA(order: number): QA {
  return {
    id: crypto.randomUUID(),
    question: "",
    answer: "",
    videoTimestamp: "",
    highlightQuote: "",
    displayOrder: order,
  }
}

/* ================= SMALL UI HELPERS ================= */

function SectionCard({
  number,
  title,
  children,
  headerRight,
}: {
  number: number
  title: string
  children: React.ReactNode
  headerRight?: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#0F5B78] text-white text-xs font-bold flex items-center justify-center">
            {number}
          </span>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        </div>
        {headerRight}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5B78]/40 focus:border-[#0F5B78]"

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-600">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#0F5B78]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}
function ChipInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
}) {
  const [draft, setDraft] = useState("")

  function addValue() {
    const v = draft.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setDraft("")
  }

  return (
    <Field label={label}>
      <div className="border border-gray-200 rounded-lg px-2 py-2 flex flex-wrap gap-1.5 items-center focus-within:ring-2 focus-within:ring-[#0F5B78]/40">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 bg-[#0F5B78]/10 text-[#0F5B78] text-xs font-medium px-2 py-1 rounded-full"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="hover:text-[#B30F24]"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              addValue()
            }
          }}
          onBlur={addValue}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] text-sm outline-none py-0.5"
        />
      </div>
    </Field>
  )
}

/* ================= PAGE ================= */

export default function CreateIndustryTalkPage() {
  const router = useRouter()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [qas, setQAs] = useState<QA[]>([newQA(1)])
  const [openQAId, setOpenQAId] = useState<string | null>(null)

  const [industries, setIndustries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries`)
        const data = await res.json()
        setIndustries(data.data || data || [])
      } catch (err) {
        console.error("Initialization error:", err)
      } finally {
        setInitializing(false)
      }
    }
    loadData()
  }, [])

  /* ---------- helpers ---------- */

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setForm((prev) => ({ ...prev, title, slug }))
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function uploadFile(file: File, onDone: (url: string) => void) {
    setUploading(true)
    setMessage("Uploading...")
    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: fd,
      })
      const data = await res.json()
      if (res.ok && data.imageUrl) {
        onDone(data.imageUrl)
        setMessage("")
      } else {
        throw new Error()
      }
    } catch {
      setMessage("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  function toggleIndustry(id: number) {
    setForm((prev) => ({
      ...prev,
      industryIds: prev.industryIds.includes(id)
        ? prev.industryIds.filter((x) => x !== id)
        : [...prev.industryIds, id],
    }))
  }

  /* ---------- Q&A management ---------- */

  function addQA() {
    setQAs((prev) => [...prev, newQA(prev.length + 1)])
  }

  function removeQA(id: string) {
    setQAs((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, displayOrder: i + 1 }))
    )
  }

  function updateQA(id: string, patch: Partial<QA>) {
    setQAs((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  function moveQA(id: string, direction: -1 | 1) {
    setQAs((prev) => {
      const idx = prev.findIndex((q) => q.id === id)
      const swapWith = idx + direction
      if (swapWith < 0 || swapWith >= prev.length) return prev
      const copy = [...prev]
      ;[copy[idx], copy[swapWith]] = [copy[swapWith], copy[idx]]
      return copy.map((q, i) => ({ ...q, displayOrder: i + 1 }))
    })
  }

  /* ---------- submit ---------- */

  async function submit(status: "DRAFT" | "PUBLISHED") {
    if (!form.title.trim()) {
      setMessage("Title is required")
      return
    }
    if (form.videoType !== "upload" && !form.videoUrl.trim()) {
      setMessage("Video URL is required for YouTube/Vimeo")
      return
    }

    setLoading(true)
    setMessage("")

    const token = localStorage.getItem("token")

    // The backend create/update routes run a multer middleware
    // (`uploadIndustryTalkFiles`) ahead of validation. Multer only
    // populates req.body for `multipart/form-data` requests — sending
    // JSON here means the server sees an empty body and every field
    // fails validation. So we build FormData instead.
    const fd = new FormData()

    fd.append("title", form.title)
    fd.append("slug", form.slug)
    fd.append("interviewDate", form.interviewDate)
    if (form.readingTime) fd.append("readingTime", form.readingTime)
    fd.append("status", status)
    fd.append("featured", String(form.featured))
    fd.append("trending", String(form.trending))
    fd.append("homepage", String(form.homepage))

    // Backend model only supports a single industryId today.
    if (form.industryIds[0] != null) {
      fd.append("industryId", String(form.industryIds[0]))
    }
    form.tags.forEach((t) => fd.append("tags[]", t))

    fd.append("bannerImage", form.bannerImage)
    fd.append("videoType", form.videoType)
    if (form.videoType !== "upload") {
      fd.append("videoUrl", form.videoUrl)
    }
    if (form.uploadedVideo) fd.append("uploadedVideo", form.uploadedVideo)
    fd.append("thumbnailUrl", form.thumbnailUrl)
    fd.append("duration", form.duration)
    fd.append("autoplay", String(form.autoplay))
    fd.append("showControls", String(form.showControls))

    // Backend/Prisma field is `profileImage`, not `guestPhoto`.
    fd.append("profileImage", form.guestPhoto)
    fd.append("guestName", form.guestName)
    fd.append("designation", form.designation)
    fd.append("companyName", form.companyName)
    fd.append("companyLogo", form.companyLogo)
    if (form.linkedinUrl) fd.append("linkedinUrl", form.linkedinUrl)
    if (form.website) fd.append("website", form.website)
    if (form.companyProfileUrl) fd.append("companyProfileUrl", form.companyProfileUrl)
    fd.append("shortBio", form.shortBio)

    fd.append("introduction", form.introduction)

    fd.append(
      "questions",
      JSON.stringify(
        qas.map((q) => ({
          question: q.question,
          answer: q.answer,
          videoTimestamp: q.videoTimestamp,
          highlightQuote: q.highlightQuote,
          displayOrder: q.displayOrder,
        }))
      )
    )

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industry-talks`, {
        method: "POST",
        headers: {
          // Do NOT set Content-Type manually for FormData — the browser
          // needs to set it (including the multipart boundary) itself.
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      })

      const data = await res.json()
      setLoading(false)

      if (res.ok) {
        setMessage(status === "PUBLISHED" ? "Interview published!" : "Draft saved!")
        setTimeout(() => router.push("/admin/industry-talks"), 900)
      } else {
        setMessage(data?.message || data?.errors?.[0]?.msg || "Something went wrong")
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
      setMessage("Network error")
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    submit("PUBLISHED")
  }

  if (initializing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0F5B78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Menu size={20} className="text-gray-400" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Create CEO Interview / Industry Talk
              </h1>
              <p className="text-xs text-gray-400">
                Dashboard &gt; CEO Interviews &gt; Add New Interview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => submit("DRAFT")}
              disabled={loading || uploading}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              <Save size={14} />
              Save Draft
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              type="button"
              onClick={() => submit("PUBLISHED")}
              disabled={loading || uploading}
              className="flex items-center gap-1 bg-[#0F5B78] text-white text-sm font-semibold pl-4 pr-2 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Interview"}
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto px-6 py-6">
        {message && (
          <div className="mb-4 text-sm font-medium text-[#0F5B78] bg-[#0F5B78]/5 border border-[#0F5B78]/20 rounded-lg px-4 py-2">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ============ 1. INTERVIEW INFORMATION ============ */}
          <SectionCard number={1} title="Interview Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Interview Title" required>
                  <input
                    value={form.title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g. Driving Innovation and Sustainability in Modern Manufacturing"
                    className={inputClass}
                  />
                </Field>
                <Field label="URL Slug" required>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    placeholder="driving-innovation-sustainability"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Industry (Select Multiple)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {industries.length === 0 && (
                      <p className="text-xs text-gray-400">No industries loaded</p>
                    )}
                    {industries.map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => toggleIndustry(ind.id)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                          form.industryIds.includes(ind.id)
                            ? "bg-[#0F5B78] text-white border-[#0F5B78]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#0F5B78]"
                        }`}
                      >
                        {ind.name}
                      </button>
                    ))}
                  </div>
                  {form.industryIds.length > 1 && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      Only the first selected industry will be saved (backend currently supports one industry per interview).
                    </p>
                  )}
                </div>

                <ChipInput
                  label="Tags (Select Multiple)"
                  values={form.tags}
                  onChange={(v) => set("tags", v)}
                  placeholder="Type and press Enter"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end">
                <Field label="Interview Date" required>
                  <input
                    type="date"
                    name="interviewDate"
                    value={form.interviewDate}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </Field>
                <Field label="Reading Time (minutes)">
                  <input
                    type="number"
                    name="readingTime"
                    value={form.readingTime}
                    onChange={handleChange}
                    placeholder="18"
                    className={inputClass}
                  />
                </Field>
                <Field label="Status" required>
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as any)}
                    className={inputClass}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </Field>
              </div>

              <div className="flex items-center gap-8 pt-1">
                <Toggle
                  label="Featured Interview"
                  checked={form.featured}
                  onChange={(v) => set("featured", v)}
                />
                <Toggle
                  label="Trending"
                  checked={form.trending}
                  onChange={(v) => set("trending", v)}
                />
                <Toggle
                  label="Homepage Feature"
                  checked={form.homepage}
                  onChange={(v) => set("homepage", v)}
                />
              </div>
            </div>
          </SectionCard>

          {/* ============ 2. BANNER / HERO IMAGE ============ */}
          <SectionCard number={2} title="Interview Banner / Hero Image">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Banner Image
                </label>
                <UploadBox
                  label=""
                  value={form.bannerImage}
                  onUpload={(file: File) => uploadFile(file, (url) => set("bannerImage", url))}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Recommended: 1920 x 1080 px (16:9) · JPG, PNG, WebP (Max 2MB)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Video Type
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {(
                      [
                        { value: "youtube", label: "YouTube" },
                        { value: "vimeo", label: "Vimeo" },
                        { value: "upload", label: "Upload MP4" },
                      ] as const
                    ).map((t) => (
                      <label key={t.value} className="flex items-center gap-1.5 text-xs text-gray-700">
                        <input
                          type="radio"
                          name="videoType"
                          checked={form.videoType === t.value}
                          onChange={() => set("videoType", t.value)}
                          className="accent-[#0F5B78]"
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>

                {form.videoType === "upload" ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Video File <span className="text-red-500">*</span>
                    </label>
                    <UploadBox
                      label=""
                      value={form.uploadedVideo}
                      onUpload={(file: File) =>
                        uploadFile(file, (url) => set("uploadedVideo", url))
                      }
                    />
                    <p className="text-[11px] text-gray-400 mt-1">MP4, max 200MB</p>
                  </div>
                ) : (
                  <Field label="Video URL" required>
                    <input
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      placeholder="https://www.youtube.com/watch?v=abc123xyz"
                      className={inputClass}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Paste YouTube or Vimeo link here
                    </p>
                  </Field>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Video Thumbnail
                    </label>
                    <UploadBox
                      label=""
                      value={form.thumbnailUrl}
                      onUpload={(file: File) =>
                        uploadFile(file, (url) => set("thumbnailUrl", url))
                      }
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Recommended: 1280x720px
                    </p>
                  </div>

                  <Field label="Duration (mm:ss)">
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="18:45"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.autoplay}
                      onChange={(e) => set("autoplay", e.target.checked)}
                      className="accent-[#0F5B78]"
                    />
                    Autoplay
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.showControls}
                      onChange={(e) => set("showControls", e.target.checked)}
                      className="accent-[#0F5B78]"
                    />
                    Show Controls
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ============ 4. GUEST / SPEAKER INFORMATION ============ */}
          <SectionCard number={4} title="Guest / Speaker Information">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Guest Photo <span className="text-red-500">*</span>
                </label>
                <UploadBox
                  label=""
                  value={form.guestPhoto}
                  onUpload={(file: File) => uploadFile(file, (url) => set("guestPhoto", url))}
                />
                <p className="text-[11px] text-gray-400 mt-1">JPG, PNG (500x500px)</p>
              </div>

              <div className="space-y-4">
                <Field label="Guest Name" required>
                  <input
                    name="guestName"
                    value={form.guestName}
                    onChange={handleChange}
                    required
                    placeholder="Mr. Rajesh Sharma"
                    className={inputClass}
                  />
                </Field>
                <Field label="Company" required>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                    placeholder="Ace Micromatic Group"
                    className={inputClass}
                  />
                </Field>
                <Field label="LinkedIn Profile">
                  <input
                    name="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://www.linkedin.com/in/rajeshsharma"
                    className={inputClass}
                  />
                </Field>
                <Field label="Company Profile URL">
                  <input
                    name="companyProfileUrl"
                    value={form.companyProfileUrl}
                    onChange={handleChange}
                    placeholder="https://tooling-trends.com/company/ace-micromatic"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="space-y-4">
                <Field label="Designation" required>
                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    required
                    placeholder="CEO"
                    className={inputClass}
                  />
                </Field>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Company Logo
                  </label>
                  <UploadBox
                    label=""
                    value={form.companyLogo}
                    onUpload={(file: File) => uploadFile(file, (url) => set("companyLogo", url))}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">JPG, PNG (500x250px)</p>
                </div>

                <Field label="Website">
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://acemicromatic.com"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Short Bio
              </label>
              <ReactQuill
                theme="snow"
                value={form.shortBio}
                onChange={(v) => set("shortBio", v)}
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">
                {form.shortBio.replace(/<[^>]+>/g, "").length} characters
              </p>
            </div>
          </SectionCard>

          {/* ============ 5. INTRODUCTION / OVERVIEW ============ */}
          <SectionCard number={5} title="Interview Introduction / Overview">
            <ReactQuill
              theme="snow"
              value={form.introduction}
              onChange={(v) => set("introduction", v)}
            />
            <p className="text-[11px] text-gray-400 mt-1 text-right">
              {form.introduction.replace(/<[^>]+>/g, "").length} characters
            </p>
          </SectionCard>
        </div>

        {/* ============ 6. QUESTIONS & ANSWERS (full width) ============ */}
        <div className="mt-5">
          <SectionCard
            number={6}
            title="Interview Questions & Answers"
            headerRight={
              <button
                type="button"
                onClick={addQA}
                className="flex items-center gap-1.5 bg-[#0F5B78] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90"
              >
                <Plus size={14} />
                Add Question
              </button>
            }
          >
            <div className="space-y-2">
              {qas.map((qa, idx) => {
                const isOpen = openQAId === qa.id
                return (
                  <div key={qa.id} className="border border-gray-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOpenQAId(isOpen ? null : qa.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-gray-800 truncate pr-4">
                        Q{idx + 1}.{" "}
                        {qa.question || (
                          <span className="text-gray-400 font-normal">Untitled question</span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 text-gray-400">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveQA(qa.id, -1)
                          }}
                          className="hover:text-gray-700"
                          aria-label="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveQA(qa.id, 1)
                          }}
                          className="hover:text-gray-700"
                          aria-label="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeQA(qa.id)
                          }}
                          className="hover:text-[#B30F24]"
                          aria-label="Delete question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100">
                        <Field label="Question" required>
                          <input
                            value={qa.question}
                            onChange={(e) => updateQA(qa.id, { question: e.target.value })}
                            placeholder="e.g. Sustainability is a major focus today. What steps is your organization taking?"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Answer" required>
                          <ReactQuill
                            theme="snow"
                            value={qa.answer}
                            onChange={(v) => updateQA(qa.id, { answer: v })}
                          />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Field label="Video Timestamp (mm:ss)">
                            <input
                              value={qa.videoTimestamp}
                              onChange={(e) =>
                                updateQA(qa.id, { videoTimestamp: e.target.value })
                              }
                              placeholder="07:15"
                              className={inputClass}
                            />
                          </Field>
                          <Field label="Highlight Quote (Optional)">
                            <input
                              value={qa.highlightQuote}
                              onChange={(e) =>
                                updateQA(qa.id, { highlightQuote: e.target.value })
                              }
                              placeholder="A short pull-quote from the answer"
                              className={inputClass}
                            />
                          </Field>
                          <Field label="Display Order">
                            <input
                              type="number"
                              value={qa.displayOrder}
                              onChange={(e) =>
                                updateQA(qa.id, { displayOrder: Number(e.target.value) })
                              }
                              className={inputClass}
                            />
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {qas.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No questions yet — click "Add Question" to start.
                </p>
              )}
            </div>
          </SectionCard>
        </div>
      </form>
    </div>
  )
}