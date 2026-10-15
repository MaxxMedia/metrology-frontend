"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher (0 years)" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10+", label: "10+ years" },
]

export default function CandidateOnboardingPage() {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [fullName, setFullName] = useState("")
  const [currentRole, setCurrentRole] = useState("")
  const [headline, setHeadline] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [skills, setSkills] = useState("")
  const [location, setLocation] = useState("")
  const [about, setAbout] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(0) // track progress visually

  useEffect(() => {
    setMounted(true)
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user || user.role !== "candidate") {
      router.push("/login")
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/candidates/onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            currentRole,
            headline,
            experienceLevel,
            skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
            location,
            about,
          }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Onboarding failed")
        return
      }

      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}")
      updatedUser.isOnboarded = true
      localStorage.setItem("user", JSON.stringify(updatedUser))

      router.push("/candidate/feed")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Don't render until client-side check is done (avoids flash)
  if (!mounted) return null

  const filledCount = [fullName, currentRole, experienceLevel, skills].filter(Boolean).length
  const progress = Math.round((filledCount / 4) * 100)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f3f2ef 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "560px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #0073FF 0%, #00C6FF 100%)",
            height: "5px",
          }}
        />

        <div style={{ padding: "40px 40px 36px" }}>
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#EFF6FF",
                color: "#0073FF",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
                marginBottom: "14px",
                letterSpacing: "0.4px",
                textTransform: "uppercase",
              }}
            >
              <span style={{ fontSize: "14px" }}>✦</span>
              Candidate Profile Setup
            </div>

            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 6px",
                lineHeight: 1.25,
              }}
            >
              Set up your candidate profile
            </h1>
            <p style={{ fontSize: "15px", color: "#6B7280", margin: 0 }}>
              This helps recruiters discover you faster
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 500 }}>
                Profile completeness
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: progress === 100 ? "#10B981" : "#0073FF",
                }}
              >
                {progress}%
              </span>
            </div>
            <div
              style={{
                height: "6px",
                background: "#F3F4F6",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background:
                    progress === 100
                      ? "linear-gradient(90deg,#10B981,#34D399)"
                      : "linear-gradient(90deg,#0073FF,#00C6FF)",
                  borderRadius: "10px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Full Name */}
            <div>
              <label style={labelStyle}>
                Full Name <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ravi Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
            </div>

            {/* Current Role */}
            <div>
              <label style={labelStyle}>
                Current Role <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Tooling Engineer, Quality Inspector"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
            </div>

            {/* Headline */}
            <div>
              <label style={labelStyle}>Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. 5+ years in precision metrology & QA"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
            </div>

            {/* Experience Level */}
            <div>
              <label style={labelStyle}>
                Experience Level <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <select
                required
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              >
                <option value="">Select experience level</option>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label style={labelStyle}>
                Skills <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. CMM, GD&T, AutoCAD, Six Sigma"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
              <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#9CA3AF" }}>
                Separate skills with commas
              </p>
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
            </div>

            {/* About */}
            <div>
              <label style={labelStyle}>About You</label>
              <textarea
                placeholder="Brief overview of your background, expertise, and career goals..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                style={{
                  ...inputStyle,
                  height: "auto",
                  resize: "vertical",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                width: "100%",
                height: "52px",
                background: loading
                  ? "#93C5FD"
                  : "linear-gradient(135deg, #0073FF 0%, #0052B3 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 4px 14px rgba(0,115,255,0.35)",
                letterSpacing: "0.2px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 20px rgba(0,115,255,0.45)"
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 14px rgba(0,115,255,0.35)"
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Setting up your profile...
                </>
              ) : (
                <>✓ Finish setup & go to feed</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Shared style objects
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "48px",
  padding: "0 14px",
  fontSize: "14px",
  color: "#111827",
  background: "#F9FAFB",
  border: "1.5px solid #E5E7EB",
  borderRadius: "10px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
}

const inputFocusStyle: React.CSSProperties = {
  borderColor: "#0073FF",
  boxShadow: "0 0 0 3px rgba(0,115,255,0.12)",
  background: "#ffffff",
}

const inputBlurStyle: React.CSSProperties = {
  borderColor: "#E5E7EB",
  boxShadow: "none",
  background: "#F9FAFB",
}
