// lib/candidateProfile.ts
import { getSocials, createSocial, updateSocial, deleteSocial } from "@/lib/api/candidate/socials";
// ✅ ADDED: the real resume storage lives in the CandidateResume table via
// these endpoints. Previously this file reinvented "resume storage" using
// the CandidateSocial table (platform: "resume") and /api/upload/document,
// which never touched CandidateResume at all. That's why the profile page
// and the Apply modal disagreed about whether a resume existed — they were
// reading from two different, disconnected places.
import { CandidateResume, getMyResume as fetchResumeFromApi, uploadMyResume as uploadResumeToApi } from "@/lib/api/candidate/resume";
// ✅ Re-export the single canonical CandidateResume type instead of
// redeclaring a second, slightly different one in this file. The old local
// type had `fileSize?: number` (no null) while the real API type has
// `fileSize?: number | null`, which caused a TS2322 mismatch anywhere a
// value from resume.ts flowed into a variable typed with this file's
// version. One shared type = no more drift between the two.
export type { CandidateResume } from "@/lib/api/candidate/resume";

export type CandidateProfile = {
  id?: number;
  email: string;
  username: string;
  fullName?: string;
  headline?: string;
  about?: string;
  location?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  companyId?: number;
  // Support both lowercase and capitalized versions
  company?: {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
    tagline?: string;
    description?: string;
  };
  Company?: {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
    tagline?: string;
    description?: string;
  };
};

export async function uploadCandidateImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok || !data.imageUrl) {
    throw new Error(data.error || "Image upload failed");
  }

  return data.imageUrl;
}

export async function fetchMyCandidateProfile(): Promise<CandidateProfile> {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidates/me`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  const data = await res.json();

  // Normalize the data - if company exists but Company doesn't, copy it
  if (data.company && !data.Company) {
    data.Company = data.company;
  }

  return data;
}

export async function updateMyCandidateProfile(
  profile: Partial<CandidateProfile>
): Promise<CandidateProfile> {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidates/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}

export function syncCandidateUserInStorage(profile: CandidateProfile) {
  const stored = localStorage.getItem("user");
  if (!stored) return;

  const existing = JSON.parse(stored);
  localStorage.setItem(
    "user",
    JSON.stringify({
      ...existing,
      avatarUrl: profile.avatarUrl,
      fullName: profile.fullName,
      username: profile.username,
    })
  );
  window.dispatchEvent(new Event("userChanged"));
}

/**
 * ✅ REWRITTEN: now reads from the real CandidateResume table
 * (GET /api/candidate-resume/me) instead of scanning CandidateSocial
 * for a fake "resume" platform entry.
 */
export async function fetchMyResume(): Promise<CandidateResume | null> {
  try {
    const resume = await fetchResumeFromApi();
    return resume;
  } catch {
    return null;
  }
}

/**
 * ✅ REWRITTEN: previously always returned null (dead code) since resumes
 * were never stored per-user in a lookup-by-id-friendly way. The real
 * per-user lookup already exists on the backend at
 * GET /api/candidate-resume/:userId — wire it up properly.
 */
export async function fetchCandidateResume(userId: number): Promise<CandidateResume | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/candidate-resume/${userId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * ✅ REWRITTEN: now uploads through POST /api/candidate-resume/upload
 * (field name "resume"), which writes a proper CandidateResume row via
 * uploadResumeToCloudinary(). Previously this posted to
 * /api/upload/document (field name "document") and stashed the resulting
 * URL as a CandidateSocial row with platform "resume" — a parallel,
 * disconnected storage path that the Apply modal and getMyResume() never
 * looked at, which is why "resume already uploaded" never showed up
 * correctly across the app.
 */
export async function uploadCandidateResume(file: File): Promise<CandidateResume> {
  return uploadResumeToApi(file);
}

/**
 * ✅ REWRITTEN: deletes from the real CandidateResume table via
 * DELETE /api/candidate-resume/delete, instead of deleting a
 * CandidateSocial row that was never the real source of truth.
 */
export async function deleteCandidateResume(): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate-resume/delete`,
    {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to delete resume");
  }
}