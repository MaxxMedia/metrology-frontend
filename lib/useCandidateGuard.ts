// "use client"

// import { useEffect } from "react"
// import { useRouter, usePathname } from "next/navigation"

// export function useCandidateGuard() {
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     // ✅ Allow public job pages
//     if (pathname.startsWith("/jobs")) return

//     const raw = localStorage.getItem("user")
//     if (!raw) {
//       router.push("/login")
//       return
//     }

//     const user = JSON.parse(raw)

//     if (!user?.id) {
//       router.push("/login")
//       return
//     }

//     if (user.role !== "candidate") {
//       router.push("/")
//       return
//     }

//     if (!user.isOnboarded) {
//       router.push("/candidate/onboarding")
//     }
//   }, [pathname, router])
// }


"use client"
/** Protects candidate-only flows by checking the current candidate session and redirecting when needed. */


import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

/** Provides the candidate guard hook and its shared access behavior. */
export function useCandidateGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try {
      if (pathname.startsWith("/jobs")) return

      const raw = localStorage.getItem("user")

      if (!raw) {
        router.replace("/login")
        return
      }

      let user

      try {
        user = JSON.parse(raw)
      } catch {
        console.error("Invalid user JSON")
        localStorage.removeItem("user")
        router.replace("/login")
        return
      }

      if (!user?.id) {
        router.replace("/login")
        return
      }

      if (user.role !== "candidate") {
        router.replace("/")
        return
      }

      if (!user.isOnboarded) {
        router.replace("/candidate/onboarding")
      }

    } catch (err) {
      console.error("Guard error:", err)
      router.replace("/login")
    }
  }, [pathname, router])
}
