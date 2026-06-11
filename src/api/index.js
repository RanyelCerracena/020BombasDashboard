// Base URL do backend (no browser). Em deploy, você DEVE setar VITE_BACKEND_URL.
// Ex: https://seu-backend.railway.app/api
const BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";
if (!BASE_URL) {
  console.error(
    "VITE_BACKEND_URL não definido. Defina no ambiente do frontend para apontar para o backend em produção.",
  );
}

const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY || "";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (BACKEND_API_KEY) {
    headers["x-api-key"] = BACKEND_API_KEY;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage =
      json?.error?.message || json?.error || response.statusText;
    throw new Error(errorMessage);
  }

  return json;
}

export const getClients = () => request("/clients");
export const createClient = (payload) =>
  request("/api/clients", { method: "POST", body: JSON.stringify(payload) });
export const updateClient = (id, payload) =>
  request(`/api/clients/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteClient = (id) =>
  request(`/api/clients/${id}`, { method: "DELETE" });

export const getTemplates = () => request("/templates");
export const createTemplate = (payload) =>
  request("/templates", { method: "POST", body: JSON.stringify(payload) });
export const updateTemplate = (id, payload) =>
  request(`/templates/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteTemplate = (id) =>
  request(`/templates/${id}`, { method: "DELETE" });
