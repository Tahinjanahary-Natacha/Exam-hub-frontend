const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('examHubToken');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
  });

  const data = await response.json().catch(() => ({ message: 'Réponse serveur invalide.' }));
  if (!response.ok) throw new ApiError(response.status, data.message ?? 'Erreur API.');
  return data;
}
