/** Provides candidate achievements API helpers for reading and updating candidate data. */
const API = process.env.NEXT_PUBLIC_API_URL;

/** Builds request headers with the current bearer token and JSON content type. */
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Loads or retrieves achievements data for this workflow. */
export async function getAchievements() {
  const res = await fetch(`${API}/api/candidate-achievements`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load achievements");

  return res.json();
}

/** Creates achievement through the configured API. */
export async function createAchievement(data: any) {
  const res = await fetch(`${API}/api/candidate-achievements`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create achievement");

  return res.json();
}

/** Updates achievement through the configured API. */
export async function updateAchievement(id: number, data: any) {
  const res = await fetch(`${API}/api/candidate-achievements/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update achievement");

  return res.json();
}

/** Removes achievement through the configured API. */
export async function deleteAchievement(id: number) {
  const res = await fetch(`${API}/api/candidate-achievements/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete achievement");

  return res.json();
}