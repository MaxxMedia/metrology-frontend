"use client"
/** Implements the reset password form component and its related interface behavior. */


import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

/** Renders the reset password form interface. */
export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  /** Handles the submit interaction and its related state changes. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Reset failed")
        return
      }

      setSuccess("Password reset successful!")

      setTimeout(() => {
        router.push("/login")
      }, 1500)

    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">

      <h2 className="text-3xl font-semibold mb-6 text-center">
        Set New Password
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
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full h-[52px] px-4 rounded-md border text-center tracking-widest"
        />

        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-[52px] px-4 rounded-md border"
        />

        <button
          disabled={loading}
          className="w-full h-[52px] bg-[#0073FF] text-white rounded-md"
        >
          {loading ? "Resetting..." : "Reset Password"}
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
