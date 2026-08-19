"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Lock } from "lucide-react"
import { submitContentGateForm, ContentGateFormData } from "@/lib/api/content-gate"

interface ContentGateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  contentTitle?: string
}

const inputClassName =
  "w-full rounded-[10px] border border-[#292C30] bg-[#171A1E] px-3.5 py-2.5 sm:py-3 text-[14px] text-[#FFFFFF] placeholder:text-[#858585] outline-none transition-all duration-200 focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/25 disabled:cursor-not-allowed disabled:opacity-50 font-normal"

export default function ContentGateModal({
  isOpen,
  onClose,
  onSuccess,
  contentTitle = "premium content",
}: ContentGateModalProps) {
  const [formData, setFormData] = useState<ContentGateFormData>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    company: "",
    email: "",
    subscribe: true,
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, loading, onClose])

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      await submitContentGateForm(formData)

      setSuccessMessage(`Welcome to Metrology! You now have unrestricted access.`)

      try {
        localStorage.setItem("premiumAccess", "true")
      } catch {}

      if (onSuccess) {
        onSuccess()
      }

      setTimeout(() => {
        onClose()
        setSuccessMessage("")
      }, 1500)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to register. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-gate-title"
    >
      <div className="relative my-auto w-full max-w-[620px] overflow-hidden rounded-[12px] border border-[#292C30] bg-[#1D2125] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
        {/* Subtle Ambient Accent Header */}
        <div className="relative border-b border-[#292C30] bg-gradient-to-r from-[#171A1E] via-[#1D247B]/40 to-[#171A1E] px-6 py-6 sm:px-8 sm:py-7">
          {/* Decorative Corner Glow */}
          <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-[#0073FF]/15 blur-2xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#292C30] bg-[#171A1E] text-[#B8B8B8] transition-all hover:border-[#0073FF]/50 hover:bg-[#292C30] hover:text-[#FFFFFF]"
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Category Badge */}
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-[4px] bg-[#00B5ED] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            <Sparkles className="h-3 w-3" />
            <span>Premium Industry Access</span>
          </div>

          {/* Main Heading */}
          <h2
            id="content-gate-title"
            className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#FFFFFF] leading-tight"
          >
            Unlock Full Access to Metrology
          </h2>

          {/* Secondary Description */}
          <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#CCCCCC]">
            Get unrestricted access to technical articles, market intelligence reports, exclusive industry interviews, and engineering insights.
          </p>
        </div>

        {/* Benefits Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-b border-[#292C30] bg-[#171A1E]/80 px-6 py-3 sm:px-8">
          <div className="flex items-center gap-2 text-[12px] text-[#B8B8B8]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00B5ED]" />
            <span className="truncate">Technical Articles</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#B8B8B8]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00B5ED]" />
            <span className="truncate">Industry Trends & Data</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#B8B8B8]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00B5ED]" />
            <span className="truncate">Weekly Intelligence</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {successMessage && (
            <div className="mb-5 flex items-center gap-3 rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 p-4 text-[14px] text-emerald-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 rounded-[10px] border border-red-500/30 bg-red-500/10 p-3.5 text-[13px] text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#CCCCCC]">
                  First Name <span className="text-[#00B5ED]">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                  disabled={loading}
                  placeholder="e.g. Marcus"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#CCCCCC]">
                  Last Name <span className="text-[#00B5ED]">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                  disabled={loading}
                  placeholder="e.g. Vance"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Job and Company Row */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#CCCCCC]">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={loading}
                  placeholder="e.g. Quality Engineer"
                  autoComplete="organization-title"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#CCCCCC]">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={loading}
                  placeholder="e.g. Precision Robotics"
                  autoComplete="organization"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#CCCCCC]">
                Work Email <span className="text-[#00B5ED]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                required
                disabled={loading}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>

            {/* Subscribe Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="subscribe"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#292C30] bg-[#171A1E] text-[#0073FF] accent-[#0073FF] focus:ring-[#0073FF]/30 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />
                <span className="text-[13px] text-[#B8B8B8] leading-snug">
                  Also subscribe me to the <strong className="text-white font-medium">Metrology Weekly Intelligence</strong> e-newsletter for free.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0073FF] py-3.5 px-6 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(0,115,255,0.35)] transition-all duration-200 hover:bg-[#0062D6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Unlocking Access...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Full Access</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Privacy notice & Trust footer */}
            <div className="pt-2 flex flex-col items-center gap-1.5 text-center">
              <div className="flex items-center gap-1.5 text-[11px] text-[#858585]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00B5ED]" />
                <span>Zero spam. Unsubscribe at any time.</span>
              </div>
              <p className="text-[11px] text-[#858585] leading-relaxed">
                By submitting, you agree to our{" "}
                <a href="/privacy-policy" className="text-[#00B5ED] hover:underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-[#00B5ED] hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}