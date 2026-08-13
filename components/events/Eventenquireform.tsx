// app/components/events/EventEnquireForm.tsx
"use client"

import { useState } from "react"

export default function EventEnquireForm({ slug }: { slug: string }) {
  const [values, setValues] = useState({ name: "", email: "", mobile: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (key: keyof typeof values, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}/enquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit enquiry")
      }

      setSubmitted(true)
      setValues({ name: "", email: "", mobile: "", message: "" })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
        Thanks! Your enquiry has been sent. We'll get back to you soon.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Name"
        required
        value={values.name}
        onChange={e => update("name", e.target.value)}
        className="w-full border border-[#292C30] rounded-xl px-3 py-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={values.email}
        onChange={e => update("email", e.target.value)}
        className="w-full border border-[#292C30] rounded-xl px-3 py-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
      />
      <input
        type="tel"
        placeholder="Mobile"
        value={values.mobile}
        onChange={e => update("mobile", e.target.value)}
        className="w-full border border-[#292C30] rounded-xl px-3 py-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
      />
      <textarea
        placeholder="Message / Query"
        rows={4}
        required
        value={values.message}
        onChange={e => update("message", e.target.value)}
        className="w-full border border-[#292C30] rounded-xl px-3 py-2.5 text-sm bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] resize-y focus:outline-none focus:ring-2 focus:ring-[#00B5ED]"
      />

      {error && <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#0073FF] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#0060D0] transition shadow-md disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "SUBMIT"}
      </button>
    </form>
  )
}