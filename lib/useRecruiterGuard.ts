"use client"
/** Protects recruiter-only flows by checking recruiter authentication and access state. */


import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

/** Provides the recruiter guard hook and its shared access behavior. */
export function useRecruiterGuard(): boolean {
  const router = useRouter()
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    /** Coordinates the redirect to login behavior used by this module. */
    const redirectToLogin = () => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("permissions")
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax"
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    /** Checks whether recruiter meets this workflow?s conditions. */
    async function checkRecruiter() {
      const token = localStorage.getItem("token")
      const userRaw = localStorage.getItem("user")

      if (!token || !userRaw) {
        redirectToLogin()
        if (!cancelled) setChecking(false)
        return
      }

      let user: { role?: string }
      try {
        user = JSON.parse(userRaw)
      } catch {
        redirectToLogin()
        if (!cancelled) setChecking(false)
        return
      }

      if (user.role !== "recruiter") {
        router.replace("/")
        if (!cancelled) setChecking(false)
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        )

        if (response.status === 401) {
          redirectToLogin()
          if (!cancelled) setChecking(false)
          return
        }

        if (response.ok) {
          const freshUser = await response.json()
          localStorage.setItem("user", JSON.stringify({ ...user, ...freshUser }))
        }
      } catch {
        // Keep the cached identity if the API is temporarily unreachable.
      }

      if (!cancelled) {
        setAllowed(true)
        setChecking(false)
      }
    }

    checkRecruiter()
    return () => {
      cancelled = true
    }
  }, [pathname, router])

  if (checking) return false
  return allowed
}