/** Provides candidate education API helpers for reading and updating candidate data. */
const API = process.env.NEXT_PUBLIC_API_URL;

/** Builds request headers with the current bearer token and JSON content type. */
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Loads or retrieves education data for this workflow. */
export async function getEducation() {
  const res = await fetch(`${API}/api/candidate-education`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load education");

  return res.json();
}

/** Creates education through the configured API. */
export async function createEducation(data: any) {
  const res = await fetch(`${API}/api/candidate-education`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create education");

  return res.json();
}

/** Updates education through the configured API. */
export async function updateEducation(id: number, data: any) {
  const res = await fetch(`${API}/api/candidate-education/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update education");

  return res.json();
}

/** Removes education through the configured API. */
export async function deleteEducation(id: number) {
  const res = await fetch(`${API}/api/candidate-education/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete education");

  return res.json();
}