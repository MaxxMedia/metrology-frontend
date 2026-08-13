"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Building2, CheckCircle, Lock } from "lucide-react"

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
]

const WORKPLACE_TYPES = [
  { value: "ON_SITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
]

const SENIORITY_LEVELS = [
  { value: "ENTRY", label: "Entry level" },
  { value: "ASSOCIATE", label: "Associate" },
  { value: "MID_SENIOR", label: "Mid-Senior level" },
  { value: "DIRECTOR", label: "Director" },
  { value: "EXECUTIVE", label: "Executive" },
]

const START_OPTIONS = [
  { value: "IMMEDIATELY", label: "Immediately" },
  { value: "WITHIN_2_WEEKS", label: "Within 2 weeks" },
  { value: "WITHIN_MONTH", label: "Within a month" },
  { value: "FLEXIBLE", label: "Flexible" },
]

const SALARY_PERIODS = [
  { value: "PER_YEAR", label: "per year" },
  { value: "PER_MONTH", label: "per month" },
]

const DEFAULT_BENEFITS = [
  "Health insurance",
  "Flexible working",
  "Provident Fund",
  "Paid time off",
  "Learning & development",
]

type FormState = {
  title: string
  location: string
  employmentType: string
  workplaceType: string
  jobFunction: string
  seniorityLevel: string
  experience: string
  salaryMin: string
  salaryMax: string
  salaryPeriod: string
  openings: string
  startDate: string
  applicationDeadline: string
  description: string
  responsibilities: string
  requirements: string
  benefits: string[]
  industry: string
  companySize: string
  reportsTo: string
  referralBonus: string
  applyUrl: string
  linkedinUrl: string
  featured: boolean
  slug?: string
  companyId?: number
}

const initialForm: FormState = {
  title: "",
  location: "",
  employmentType: "FULL_TIME",
  workplaceType: "ON_SITE",
  jobFunction: "",
  seniorityLevel: "",
  experience: "",
  salaryMin: "",
  salaryMax: "",
  salaryPeriod: "PER_YEAR",
  openings: "1",
  startDate: "IMMEDIATELY",
  applicationDeadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: [],
  industry: "",
  companySize: "",
  reportsTo: "",
  referralBonus: "",
  applyUrl: "",
  linkedinUrl: "",
  featured: false,
  slug: "",
  companyId: undefined,
}

const REQUIRED_FIELDS: { key: keyof FormState; label: string }[] = [
  { key: "title", label: "Job title" },
  { key: "location", label: "Job location" },
  { key: "employmentType", label: "Employment type" },
  { key: "workplaceType", label: "Workplace type" },
  { key: "jobFunction", label: "Job function" },
  { key: "seniorityLevel", label: "Seniority level" },
  { key: "openings", label: "Job openings" },
  { key: "startDate", label: "When should this job start?" },
  { key: "description", label: "About the job" },
  { key: "responsibilities", label: "Key responsibilities" },
  { key: "requirements", label: "Requirements" },
  { key: "industry", label: "Industry" },
  { key: "companySize", label: "Company size" },
  { key: "reportsTo", label: "Reports to" },
]

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.jobId as string
  
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [form, setForm] = useState<FormState>(initialForm)
  const [customBenefit, setCustomBenefit] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  // ✅ Company state
  const [company, setCompany] = useState<{
    id: number
    name: string
    logoUrl?: string
    website?: string
    isVerified?: boolean
    location?: string
  } | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ✅ Fetch recruiter's profile and company
  useEffect(() => {
    if (!token) return

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (res.ok) {
          const data = await res.json()
          
          // ✅ If user has company, set it
          if (data.Company) {
            setCompany({
              id: data.Company.id,
              name: data.Company.name,
              logoUrl: data.Company.logoUrl,
              website: data.Company.website,
              isVerified: data.Company.isVerified,
              location: data.Company.location,
            })
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [token])

  useEffect(() => {
    if (!id || !token) return

    const fetchJob = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/recruiter/me/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const job = await res.json()

        if (!res.ok) {
          alert(job.error || "Failed to load job")
          return
        }

        setForm({
          title: job.title || "",
          location: job.location || "",
          employmentType: job.employmentType || "FULL_TIME",
          workplaceType: job.workplaceType || "ON_SITE",
          jobFunction: job.jobFunction || "",
          seniorityLevel: job.seniorityLevel || "",
          experience: job.experience || "",
          salaryMin: job.salaryMin?.toString() || "",
          salaryMax: job.salaryMax?.toString() || "",
          salaryPeriod: job.salaryPeriod || "PER_YEAR",
          openings: job.openings?.toString() || "1",
          startDate: job.startDate || "IMMEDIATELY",
          applicationDeadline: job.applicationDeadline
            ? job.applicationDeadline.slice(0, 10)
            : "",
          description: job.description || "",
          responsibilities: job.responsibilities || "",
          requirements: job.requirements || "",
          benefits: job.benefits || [],
          industry: job.industry || "",
          companySize: job.companySize || "",
          reportsTo: job.reportsTo || "",
          referralBonus: job.referralBonus?.toString() || "",
          applyUrl: job.applyUrl || "",
          linkedinUrl: job.linkedinUrl || "",
          featured: job.isFeatured || false,
          slug: job.slug || "",
          companyId: job.companyId || undefined,
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchJob()
  }, [id, token])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    REQUIRED_FIELDS.forEach(({ key, label }) => {
      const value = form[key]
      if (typeof value === "string" && value.trim() === "") {
        nextErrors[key] = `${label} is required`
      }
    })
    return nextErrors
  }

  const toggleBenefit = (benefit: string) => {
    setForm(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit],
    }))
  }

  const addCustomBenefit = () => {
    const trimmed = customBenefit.trim()
    if (!trimmed || form.benefits.includes(trimmed)) return
    setForm(prev => ({ ...prev, benefits: [...prev.benefits, trimmed] }))
    setCustomBenefit("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstKey = REQUIRED_FIELDS.find(f => nextErrors[f.key])?.key
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`)
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
        ;(el as HTMLElement)?.focus?.()
      }
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...form,
        ...(form.slug && { slug: form.slug }),
        companyId: company?.id || form.companyId, // Use company from profile or existing
        companyName: company?.name, // Send company name
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to save job")
        setLoading(false)
        return
      }

      router.push("/recruiter/jobs")
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
      setLoading(false)
    }
  }

  const responsibilityLines = form.responsibilities
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#00B5ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#CCCCCC]">Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#FFFFFF]">
              Edit Job Post
            </h1>
            <p className="text-sm text-[#CCCCCC] mt-1">
              Edit a job post that will appear on your job board.
            </p>
          </div>
          <span className="text-xs text-[#B8B8B8]">* Required fields</span>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm rounded-xl px-4 py-3">
            Please fill in all required fields before saving the job (
            {Object.keys(errors).length} missing).
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-6">

              {/* 1. Company details (Auto-filled, read-only) */}
              <Section number={1} title="Company details">
                {company ? (
                  <div className="bg-[#171A1E] border border-[#292C30] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {/* Company Logo */}
                      <div className="w-12 h-12 rounded-xl bg-[#1D2125] border border-[#292C30] flex items-center justify-center flex-shrink-0">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-[#00B5ED]" />
                        )}
                      </div>

                      {/* Company Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#FFFFFF]">
                            {company.name}
                          </h3>
                          {company.isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>

                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#00B5ED] hover:underline"
                          >
                            {company.website}
                          </a>
                        )}

                        {company.location && (
                          <p className="text-xs text-[#B8B8B8] mt-1">
                            📍 {company.location}
                          </p>
                        )}
                      </div>

                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>

                    <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      This job is posted under your company profile
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      No company associated with your account.
                    </p>
                  </div>
                )}
              </Section>

              {/* 2. Job details */}
              <Section number={2} title="Job details">
                <Input
                  label="Job title"
                  required
                  name="title"
                  error={errors.title}
                  value={form.title}
                  onChange={v => update("title", v)}
                />

                <Input
                  label="Job location"
                  required
                  name="location"
                  error={errors.location}
                  value={form.location}
                  onChange={v => update("location", v)}
                />

                <Row cols={3}>
                  <Select
                    label="Employment type"
                    required
                    name="employmentType"
                    error={errors.employmentType}
                    value={form.employmentType}
                    onChange={v => update("employmentType", v)}
                    options={EMPLOYMENT_TYPES}
                  />
                  <Select
                    label="Workplace type"
                    required
                    name="workplaceType"
                    error={errors.workplaceType}
                    value={form.workplaceType}
                    onChange={v => update("workplaceType", v)}
                    options={WORKPLACE_TYPES}
                  />
                  <Input
                    label="Job function"
                    required
                    name="jobFunction"
                    error={errors.jobFunction}
                    value={form.jobFunction}
                    onChange={v => update("jobFunction", v)}
                    placeholder="e.g. Marketing"
                  />
                </Row>

                <Row cols={2}>
                  <Select
                    label="Seniority level"
                    required
                    name="seniorityLevel"
                    error={errors.seniorityLevel}
                    value={form.seniorityLevel}
                    onChange={v => update("seniorityLevel", v)}
                    options={SENIORITY_LEVELS}
                    placeholder="Select level"
                  />
                  <Input
                    label="Experience"
                    value={form.experience}
                    onChange={v => update("experience", v)}
                    placeholder="e.g. 3 – 5 years"
                  />
                </Row>

                <div>
                  <FieldLabel>Salary range (₹)</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full border border-[#292C30] rounded-xl p-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
                      placeholder="Min"
                      value={form.salaryMin}
                      onChange={e => update("salaryMin", e.target.value)}
                    />
                    <span className="text-[#B8B8B8]">–</span>
                    <input
                      className="w-full border border-[#292C30] rounded-xl p-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
                      placeholder="Max"
                      value={form.salaryMax}
                      onChange={e => update("salaryMax", e.target.value)}
                    />
                    <select
                      className="border border-[#292C30] rounded-xl p-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
                      value={form.salaryPeriod}
                      onChange={e => update("salaryPeriod", e.target.value)}
                    >
                      {SALARY_PERIODS.map(o => (
                        <option key={o.value} value={o.value} className="bg-[#171A1E] text-[#FFFFFF]">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-[#B8B8B8] mt-1">
                    This will be displayed on your job post.
                  </p>
                </div>

                <Row cols={2}>
                  <Input
                    label="Job openings"
                    required
                    name="openings"
                    error={errors.openings}
                    value={form.openings}
                    onChange={v => update("openings", v.replace(/[^\d]/g, ""))}
                  />
                  <Select
                    label="When should this job start?"
                    required
                    name="startDate"
                    error={errors.startDate}
                    value={form.startDate}
                    onChange={v => update("startDate", v)}
                    options={START_OPTIONS}
                  />
                </Row>

                <Input
                  label="Application deadline"
                  type="date"
                  value={form.applicationDeadline}
                  onChange={v => update("applicationDeadline", v)}
                />
              </Section>

              {/* 3. Job description */}
              <Section number={3} title="Job description">
                <Textarea
                  label="About the job"
                  required
                  name="description"
                  error={errors.description}
                  value={form.description}
                  onChange={v => update("description", v)}
                  rows={5}
                  maxLength={5000}
                />

                <Textarea
                  label="Key responsibilities"
                  required
                  name="responsibilities"
                  error={errors.responsibilities}
                  value={form.responsibilities}
                  onChange={v => update("responsibilities", v)}
                  rows={4}
                  maxLength={5000}
                  placeholder={"One per line, e.g.\nManage SEO, SEM, social media, email and content marketing."}
                />

                <Textarea
                  label="Requirements"
                  required
                  name="requirements"
                  error={errors.requirements}
                  value={form.requirements}
                  onChange={v => update("requirements", v)}
                  rows={4}
                  maxLength={5000}
                  placeholder={"One per line, e.g.\n3–5 years of relevant experience."}
                />

                <div>
                  <FieldLabel>Benefits & perks (select all that apply)</FieldLabel>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3 mt-1">
                    {Array.from(new Set([...DEFAULT_BENEFITS, ...form.benefits])).map(
                      benefit => (
                        <label
                          key={benefit}
                          className="flex items-center gap-2 text-sm text-[#CCCCCC] cursor-pointer hover:text-[#FFFFFF]"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-[#292C30] bg-[#171A1E] text-[#0073FF] focus:ring-[#00B5ED]"
                            checked={form.benefits.includes(benefit)}
                            onChange={() => toggleBenefit(benefit)}
                          />
                          {benefit}
                        </label>
                      )
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      className="border border-[#292C30] rounded-xl p-2.5 text-sm flex-1 bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
                      placeholder="Add custom benefit"
                      value={customBenefit}
                      onChange={e => setCustomBenefit(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addCustomBenefit()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCustomBenefit}
                      className="text-sm font-semibold text-[#00B5ED] hover:text-[#0073FF] whitespace-nowrap transition"
                    >
                      + Add benefit
                    </button>
                  </div>
                </div>
              </Section>

              {/* 4. Additional details */}
              <Section number={4} title="Additional details">
                <Row cols={2}>
                  <Input
                    label="Industry"
                    required
                    name="industry"
                    error={errors.industry}
                    value={form.industry}
                    onChange={v => update("industry", v)}
                  />
                  <Input
                    label="Company size"
                    required
                    name="companySize"
                    error={errors.companySize}
                    value={form.companySize}
                    onChange={v => update("companySize", v)}
                    placeholder="e.g. 1,201 – 5,000 employees"
                  />
                </Row>

                <Row cols={2}>
                  <Input
                    label="Reports to"
                    required
                    name="reportsTo"
                    error={errors.reportsTo}
                    value={form.reportsTo}
                    onChange={v => update("reportsTo", v)}
                  />
                  <Input
                    label="Referral bonus (₹) (optional)"
                    value={form.referralBonus}
                    onChange={v => update("referralBonus", v.replace(/[^\d]/g, ""))}
                    placeholder="Enter amount"
                  />
                </Row>

                <Row cols={2}>
                  <Input
                    label="Apply URL (Company website)"
                    value={form.applyUrl}
                    onChange={v => update("applyUrl", v)}
                  />
                  <Input
                    label="LinkedIn job URL"
                    value={form.linkedinUrl}
                    onChange={v => update("linkedinUrl", v)}
                  />
                </Row>
              </Section>

              {/* Featured job */}
              <Section number={5} title="Visibility">
                <label
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                    form.featured
                      ? "bg-[#00B5ED]/10 border-[#00B5ED]"
                      : "bg-[#171A1E] border-[#292C30] hover:border-[#00B5ED]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-[#292C30] bg-[#171A1E] text-[#0073FF] focus:ring-[#00B5ED]"
                    checked={form.featured}
                    onChange={e => update("featured", e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-[#FFFFFF]">
                      Featured job
                    </span>
                    <span className="block text-sm text-[#B8B8B8]">
                      Pin this job to the top of listings and highlight it on the job board.
                    </span>
                  </span>
                </label>
              </Section>

              <div className="flex justify-end gap-4 pt-2 pb-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-5 py-2.5 border border-[#292C30] rounded-xl text-sm font-semibold text-[#CCCCCC] bg-[#171A1E] hover:text-[#FFFFFF] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#0073FF] text-white rounded-xl text-sm font-semibold hover:bg-[#0060D0] disabled:opacity-60 transition shadow-md"
                >
                  {loading ? "Updating..." : "Update Job"}
                </button>
              </div>
            </div>

            {/* ================= PREVIEW COLUMN ================= */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-[#1D2125] rounded-xl shadow-sm p-6 border border-[#292C30] text-[#CCCCCC]">
                <h2 className="text-sm font-semibold text-[#FFFFFF] mb-4 border-b border-[#292C30] pb-2">
                  Job post preview
                </h2>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0073FF] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {company ? company.name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#FFFFFF]">
                      {company?.name || "Company name"}
                    </p>
                    {form.companySize && (
                      <p className="text-xs text-[#B8B8B8]">{form.companySize}</p>
                    )}
                  </div>
                </div>

                <p className="text-base font-semibold text-[#FFFFFF] mb-1">
                  {form.title || "Job title"}
                </p>

                <div className="flex flex-col gap-1 text-xs text-[#B8B8B8] mb-3">
                  {form.location && (
                    <span>
                      {form.location}
                      {form.workplaceType &&
                        ` (${WORKPLACE_TYPES.find(w => w.value === form.workplaceType)?.label})`}
                    </span>
                  )}
                  <span>
                    {EMPLOYMENT_TYPES.find(e => e.value === form.employmentType)?.label}
                    {form.seniorityLevel &&
                      ` · ${SENIORITY_LEVELS.find(s => s.value === form.seniorityLevel)?.label}`}
                  </span>
                  {(form.salaryMin || form.salaryMax) && (
                    <span>
                      ₹{form.salaryMin || "0"} – ₹{form.salaryMax || "0"}{" "}
                      {SALARY_PERIODS.find(p => p.value === form.salaryPeriod)?.label}
                    </span>
                  )}
                </div>

                {form.description && (
                  <>
                    <p className="text-xs font-semibold text-[#FFFFFF] mb-1">
                      About the job
                    </p>
                    <p className="text-xs text-[#CCCCCC] line-clamp-3 mb-3">
                      {form.description}
                    </p>
                  </>
                )}

                {responsibilityLines.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-[#FFFFFF] mb-1">
                      Key responsibilities
                    </p>
                    <ul className="text-xs text-[#CCCCCC] list-disc pl-4 space-y-0.5">
                      {responsibilityLines.slice(0, 3).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </>
                )}

                {form.featured && (
                  <span className="inline-block mt-4 text-xs font-medium text-[#00B5ED] bg-[#00B5ED]/15 px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ================= LAYOUT HELPERS ================= */

function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#1D2125] rounded-xl shadow-sm p-6 border border-[#292C30] text-[#CCCCCC]">
      <h2 className="text-sm font-semibold text-[#FFFFFF] mb-5 border-b border-[#292C30] pb-2">
        {number}. {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function Row({
  cols,
  children,
}: {
  cols: 2 | 3
  children: React.ReactNode
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-[#CCCCCC] mb-1">
      {children}
    </label>
  )
}

/* ================= FIELD COMPONENTS ================= */

function Input({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  name,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  type?: string
  name?: string
  error?: string
}) {
  return (
    <div>
      <FieldLabel>
        {label} {required && <span className="text-rose-400">*</span>}
      </FieldLabel>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-xl p-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-500 focus:ring-rose-500"
            : "border-[#292C30] focus:ring-[#00B5ED]"
        }`}
      />
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  )
}

function Textarea({
  label,
  value,
  onChange,
  required,
  rows = 4,
  maxLength,
  placeholder,
  name,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  rows?: number
  maxLength?: number
  placeholder?: string
  name?: string
  error?: string
}) {
  return (
    <div>
      <FieldLabel>
        {label} {required && <span className="text-rose-400">*</span>}
      </FieldLabel>
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        className={`w-full border rounded-xl p-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 resize-y ${
          error
            ? "border-rose-500 focus:ring-rose-500"
            : "border-[#292C30] focus:ring-[#00B5ED]"
        }`}
      />
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="text-xs text-rose-400">{error}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p className="text-right text-xs text-[#B8B8B8]">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
  placeholder,
  name,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
  name?: string
  error?: string
}) {
  return (
    <div>
      <FieldLabel>
        {label} {required && <span className="text-rose-400">*</span>}
      </FieldLabel>
      <select
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-xl p-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-500 focus:ring-rose-500"
            : "border-[#292C30] focus:ring-[#00B5ED]"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#171A1E] text-[#FFFFFF]">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  )
}