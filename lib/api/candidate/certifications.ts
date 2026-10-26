/** Provides candidate certifications API helpers for reading and updating candidate data. */
const API = process.env.NEXT_PUBLIC_API_URL;

/** Builds request headers with the current bearer token and JSON content type. */
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** Loads or retrieves certifications data for this workflow. */
export async function getCertifications() {
  const res = await fetch(`${API}/api/candidate-certifications`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load certifications");

  return res.json();
}

/** Creates certification through the configured API. */
export async function createCertification(data: any) {
  const res = await fetch(`${API}/api/candidate-certifications`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Server response:", errorText);
    throw new Error(`Failed to create certification: ${res.status} ${errorText}`);
  }

  return res.json();
}

/** Updates certification through the configured API. */
export async function updateCertification(id: number, data: any) {
  const res = await fetch(`${API}/api/candidate-certifications/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Server response:", errorText);
    throw new Error(`Failed to update certification: ${res.status} ${errorText}`);
  }

  return res.json();
}

/** Removes certification through the configured API. */
export async function deleteCertification(id: number) {
  const res = await fetch(`${API}/api/candidate-certifications/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete certification");

  return res.json();
}