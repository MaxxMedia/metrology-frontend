"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { submitContentGateForm, ContentGateFormData } from "@/lib/api/content-gate"

interface ContentGateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  contentTitle?: string
}

const inputClassName =
  "w-full rounded-lg border border-[#292C30] bg-[#171A1E] px-4 py-3 text-white placeholder:text-[#6B7280] outline-none transition focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/25 disabled:cursor-not-allowed disabled:opacity-50"

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
    subscribe: false,
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

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

      setSuccessMessage(`Registration successful! You now have access to ${contentTitle}.`)

      setFormData({
        firstName: "",
        lastName: "",
        jobTitle: "",
        company: "",
        email: "",
        subscribe: false,
      })

      if (onSuccess) {
        onSuccess()
      }

      setTimeout(() => {
        onClose()
        setSuccessMessage("")
      }, 2000)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#292C30] bg-[#1D2125] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#292C30] bg-gradient-to-r from-[#0a0d14] via-[#171A1E] to-[#0073FF] p-6">
          <h2 className="text-2xl font-bold text-white">Welcome to Metrology!</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 transition hover:bg-white/10 hover:text-white"

            disabled={loading}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="mb-6 text-center text-lg font-semibold text-[#CCCCCC]">
            Unlimited access to our free premium content requires a little more information from you.
          </p>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#CCCCCC]">
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
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#CCCCCC]">
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
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Job and Company Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#CCCCCC]">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={loading}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#CCCCCC]">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={loading}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#CCCCCC]">
                Email <span className="text-[#00B5ED]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                required
                disabled={loading}
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Subscribe Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#292C30] bg-[#171A1E] text-[#0073FF] focus:ring-[#0073FF] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              />
              <label htmlFor="subscribe" className="text-sm text-[#B8B8B8]">
                Also, please subscribe me to the Metrology Weekly e-newsletter!
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#0073FF] py-4 font-bold uppercase tracking-widest text-white transition hover:bg-[#0060D0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Privacy notice */}
            <p className="mt-4 text-center text-xs text-[#B8B8B8]">
              Your email address will be used to communicate with you about Metrology subscription
              offers, related products and services. Refer to our{" "}
              <a href="/privacy-policy" className="text-[#00B5ED] hover:underline">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
