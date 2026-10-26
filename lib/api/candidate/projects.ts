/** Provides candidate projects API helpers for reading and updating candidate data. */
const API = process.env.NEXT_PUBLIC_API_URL;

/** Builds request headers with the current bearer token and JSON content type. */
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Loads or retrieves projects data for this workflow. */
export async function getProjects() {
  const res = await fetch(`${API}/api/candidate-projects`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load projects");

  return res.json();
}

/** Creates project through the configured API. */
export async function createProject(data: any) {
  const res = await fetch(`${API}/api/candidate-projects`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create project");

  return res.json();
}

/** Updates project through the configured API. */
export async function updateProject(id: number, data: any) {
  const res = await fetch(`${API}/api/candidate-projects/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update project");

  return res.json();
}

/** Removes project through the configured API. */
export async function deleteProject(id: number) {
  const res = await fetch(`${API}/api/candidate-projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete project");

  return res.json();
}