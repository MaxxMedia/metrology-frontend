/** Provides candidate candidate api API helpers for reading and updating candidate data. */
const API = process.env.NEXT_PUBLIC_API_URL;

/** Builds request headers with the current bearer token and JSON content type. */
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Loads or retrieves my profile data for this workflow. */
export async function getMyProfile() {
  const res = await fetch(`${API}/api/candidates/me`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  return res.json();
}

/** Updates my profile through the configured API. */
export async function updateMyProfile(data: {
  fullName: string;
  headline?: string;
  location?: string;
  about?: string;
  avatarUrl?: string;
  websiteUrl?: string;
}) {
  const res = await fetch(`${API}/api/candidates/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}