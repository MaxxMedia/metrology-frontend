"use client"
/** Implements the magazine registration modal component and its related interface behavior. */


import { useState } from "react"

/** Renders the registration modal interface. */
export default function RegistrationModal({ magazineId, onClose }: any) {
  const [loading, setLoading] = useState(false)

  /** Handles the submit interaction and its related state changes. */
  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    const formData = Object.fromEntries(new FormData(e.target))

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/magazines/${magazineId}/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )

    alert("Check your email for the magazine.")
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Access Digital Edition
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" required placeholder="First Name" className="input w-full" />
          <input name="lastName" required placeholder="Last Name" className="input w-full" />
          <input name="email" required type="email" placeholder="Email" className="input w-full" />
          <input name="companyName" placeholder="Company" className="input w-full" />
          <input name="jobTitle" placeholder="Job Title" className="input w-full" />
          <input name="country" placeholder="Country" className="input w-full" />

          <button
            disabled={loading}
            className="bg-black text-white w-full py-2 rounded"
          >
            {loading ? "Submitting..." : "Get Magazine"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 mt-4"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
