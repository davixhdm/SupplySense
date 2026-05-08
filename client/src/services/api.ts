// Centralized API utility
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }
  
  return response.json()
}
