"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { submitContentGateForm, ContentGateFormData } from "@/lib/api/content-gate"

interface ContentGateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  contentTitle?: string // Optional: to customize the message
}

export default function ContentGateModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  contentTitle = "premium content" 
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
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        jobTitle: "",
        company: "",
        email: "",
        subscribe: false,
      })
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal after a delay
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#003049] to-[#0077b6] text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Welcome to Tooling Technology!</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-center text-gray-700 text-lg font-semibold mb-6">
            Unlimited access to our free premium content requires a little more information from you.
          </p>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077b6] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077b6] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Job and Company Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077b6] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077b6] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077b6] focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={loading}
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Subscribe Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[#0077b6] focus:ring-[#0077b6] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
              <label htmlFor="subscribe" className="text-sm text-gray-700">
                Also, please subscribe me to the MMT Today Weekly e-newsletter!
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#003049] to-[#0077b6] text-white font-bold py-4 rounded uppercase tracking-widest hover:from-[#002340] hover:to-[#005a8d] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Privacy notice */}
            <p className="text-xs text-gray-600 text-center mt-4">
              Your email address will be used to communicate with you about Tooling Technology subscription offers,
              related products and services. Refer to our{" "}
              <a href="#" className="text-[#0077b6] hover:underline">
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