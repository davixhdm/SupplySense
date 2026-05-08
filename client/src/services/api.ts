import { ApiError } from './types'

// Centralized API utility
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Request/Response interceptor for debugging
const logRequest = (endpoint: string, options: RequestInit) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${options.method || 'GET'} ${endpoint}`)
  }
}

const logResponse = (endpoint: string, response: Response) => {
  if (import.meta.env.DEV) {
    console.log(`[API] Response: ${response.status} ${endpoint}`)
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const requestOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  }

  logRequest(endpoint, requestOptions)

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions)

    logResponse(endpoint, response)

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch {
        // If response is not JSON, use default error message
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        `API error: ${response.status} ${response.statusText}`

      throw new ApiError(response.status, errorMessage, errorData)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw new ApiError(0, `Network error: ${error.message}`)
    }

    throw new ApiError(0, 'Unknown error occurred')
  }
}

// Helper for file uploads
export async function apiFetchFormData<T>(
  endpoint: string,
  data: FormData,
  options: Omit<RequestInit, 'body' | 'method'> = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const requestOptions: RequestInit = {
    method: 'POST',
    credentials: 'include',
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    body: data,
  }

  logRequest(endpoint, requestOptions)

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions)

    logResponse(endpoint, response)

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch {
        // If response is not JSON, use default error message
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        `API error: ${response.status} ${response.statusText}`

      throw new ApiError(response.status, errorMessage, errorData)
    }

    const result = await response.json()
    return result
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw new ApiError(0, `Network error: ${error.message}`)
    }

    throw new ApiError(0, 'Unknown error occurred')
  }
}
