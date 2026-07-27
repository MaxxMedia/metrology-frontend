// lib/candidateProfile.ts
import { getSocials, createSocial, updateSocial, deleteSocial } from "@/lib/api/candidate/socials";

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

export type CandidateResume = {
  id?: number;
  userId?: number;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchMyResume(): Promise<CandidateResume | null> {
  try {
    const socials = await getSocials().catch(() => []);
    const resumeSocial = (socials || []).find((s: any) =>
      ["resume", "cv"].includes((s.platform || "").toLowerCase())
    );
    if (resumeSocial?.url) {
      return { fileName: "Resume.pdf", fileUrl: resumeSocial.url };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchCandidateResume(userId: number): Promise<CandidateResume | null> {
  return null;
}

export async function uploadCandidateResume(file: File): Promise<CandidateResume> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const formData = new FormData();
  formData.append("document", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload/document`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok || (!data.documentUrl && !data.url)) {
    throw new Error(data.error || "Failed to upload document file");
  }

  const fileUrl = data.documentUrl || data.url || "";

  const mySocials = await getSocials().catch(() => []);
  const existingResumeSocial = (mySocials || []).find((s: any) =>
    ["resume", "cv"].includes((s.platform || "").toLowerCase())
  );

  if (existingResumeSocial?.id) {
    await updateSocial(existingResumeSocial.id, { platform: "resume", url: fileUrl });
  } else {
    await createSocial({ platform: "resume", url: fileUrl });
  }

  return { fileName: file.name, fileUrl };
}

export async function deleteCandidateResume(): Promise<void> {
  const mySocials = await getSocials().catch(() => []);
  const existingResumeSocial = (mySocials || []).find((s: any) =>
    ["resume", "cv"].includes((s.platform || "").toLowerCase())
  );
  if (existingResumeSocial?.id) {
    await deleteSocial(existingResumeSocial.id);
  }
}