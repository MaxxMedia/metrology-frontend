"use client"
/** Implements the forgot password form component and its related interface behavior. */


import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

/** Renders the forgot password form interface. */
export default function ForgotPasswordForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  /** Handles the submit interaction and its related state changes. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      setSuccess("OTP sent to your email.")
      setTimeout(() => {
        router.push(`/reset-password?email=${email}`)
      }, 1500)

    } catch {
      setError("Request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">

      <h2 className="text-3xl font-semibold mb-6 text-center">
        Reset your password
      </h2>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[52px] px-4 rounded-md border border-gray-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[52px] bg-[#0073FF] text-white rounded-md font-medium"
        >
          {loading ? "Sending..." : "Send Reset OTP"}
        </button>

        <p className="text-center text-sm">
          Back to{" "}
          <Link href="/login" className="text-[#0073FF]">
            Login
          </Link>
        </p>

      </form>
    </div>
  )
}
