// lib/api/candidate/resume.ts
// Thin client for the existing /api/candidate-resume endpoints.
// Mirrors the fetch pattern already used by getMyProfile / getExperiences.

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface CandidateResume {
    id: number
    userId: number
    fileName: string
    fileUrl: string
    fileSize?: number | null
    mimeType?: string | null
    uploadedAt: string
    updatedAt: string
}

function authHeaders(): HeadersInit {
    if (typeof window === "undefined") return {}
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * GET /api/candidate-resume/me
 * Returns null if the candidate hasn't uploaded a resume yet.
 */
export async function getMyResume(): Promise<CandidateResume | null> {
    const res = await fetch(`${API_URL}/api/candidate-resume/me`, {
        headers: { ...authHeaders() },
    })

    if (!res.ok) {
        throw new Error("Failed to load your resume")
    }

    const json = await res.json()
    return json?.data ?? null
}

/**
 * POST /api/candidate-resume/upload
 * Uploads or replaces the candidate's single stored resume.
 */
export async function uploadMyResume(file: File): Promise<CandidateResume> {
    const formData = new FormData()
    formData.append("resume", file)

    const res = await fetch(`${API_URL}/api/candidate-resume/upload`, {
        method: "POST",
        headers: { ...authHeaders() },
        body: formData,
    })

    const json = await res.json().catch(() => null)

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to upload resume")
    }

    return json.data
}