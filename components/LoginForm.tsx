"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

function setTokenCookie(token: string) {
  const maxAge = 60 * 60 * 24 * 7 // 7 days — match your JWT expiry
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      // Keep localStorage for existing client-side reads...
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("permissions", JSON.stringify(data.permissions || []))
      window.dispatchEvent(new Event("userChanged"))

      // ...and ALSO set a real cookie, since Next.js server components
      // (e.g. app/supplier/[slug]/page.tsx) read auth via cookies(),
      // not localStorage. Without this, isLoggedIn is always false server-side.
      setTokenCookie(data.token)

      const user = data.user
      const redirectTo = searchParams.get("redirect")
      const requiredRole = searchParams.get("role")

      // If we were sent here specifically to log in as a candidate
      // (e.g. clicking "Connect" on a supplier page) but this account
      // isn't a candidate, don't silently redirect somewhere unrelated —
      // tell them why.
      if (requiredRole && user.role !== requiredRole) {
        setError(
          `This action requires a ${requiredRole} account. You're logged in as ${user.role}.`
        )
        return
      }

      if (redirectTo) {
        // Hard reload (not router.push) so the server re-reads the
        // fresh cookie instead of serving a cached RSC payload.
        window.location.href = redirectTo
        return
      }

      if (user.role === "admin" || user.role === "sub_admin") {
        window.location.href = "/admin/dashboard"
      } else if (user.role === "recruiter") {
        if (!user.packageSelected) {
          window.location.href = "/packages?from=login"
        } else if (!user.isOnboarded) {
          window.location.href = "/recruiter/onboarding"
        } else {
          window.location.href = "/recruiter/dashboard"
        }
      } else if (user.role === "candidate") {
        if (!user.isOnboarded) {
          window.location.href = "/candidate/onboarding"
        } else {
          const candUsername = user.username || user.email?.split("@")[0] || "gopinath2322002"
          window.location.href = `/candidate/${candUsername}`
        }
      } else {
        window.location.href = "/"
      }
    } catch (err) {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {error && (
        <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-white text-[14px] font-semibold mb-2">
            Username or Email Address:
          </label>
          <input
            type="email"
            placeholder="Username or Email Address:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-[50px] px-4 rounded-md bg-[#0f1115] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0073FF] transition-colors"
          />
        </div>

        <div>
          <label className="block text-white text-[14px] font-semibold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] px-4 pr-12 rounded-md bg-[#0f1115] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0073FF] transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/80">
            <input type="checkbox" className="rounded accent-[#0073FF]" />
            Remember me
          </label>

          <Link href="/forgot-password" className="text-white/50 hover:text-white transition-colors">
            Forgot Password?
          </Link>
        </div>

        <div className="flex items-center gap-5 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="h-[48px] px-8 bg-[#0073FF] text-white rounded-md font-semibold hover:bg-[#005fe0] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>

          <Link
            href="/signup"
            className="text-white/50 hover:text-white transition-colors text-[14px] font-medium"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  )
}