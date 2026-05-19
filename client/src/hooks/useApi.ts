import { useState, useEffect, useCallback } from 'react'
import { ApiError } from '../services/types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>
  setData: (data: T) => void
}

/**
 * Generic hook for fetching data from API
 * @param apiFunction - The async function to call
 * @param dependencies - Dependencies array for useEffect
 * @returns State object with data, loading, error, and refetch function
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await apiFunction()
      setState({ data: result, loading: false, error: null })
    } catch (err) {
      let errorMessage = 'An error occurred'
      if (err instanceof ApiError) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setState({ data: null, loading: false, error: errorMessage })
    }
  }, [apiFunction])

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    ...state,
    refetch: fetchData,
    setData: (data: T) => setState((prev) => ({ ...prev, data })),
  }
}

/**
 * Hook for paginated API calls
 */
export function useApiPaginated<T>(
  apiFunction: (page: number, limit: number) => Promise<any>,
  initialPage = 1,
  initialLimit = 20
) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  
  const { data, loading, error, refetch } = useApi(
    () => apiFunction(page, limit),
    [page, limit]
  )

  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => (p > 1 ? p - 1 : 1))
  const setPageSize = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }

  return {
    data: data?.data || [],
    total: data?.total || 0,
    page,
    limit,
    loading,
    error,
    nextPage,
    prevPage,
    setPageSize,
    refetch,
  }
}

/**
 * Hook for API mutations (POST, PUT, DELETE)
 */
export function useApiMutation<T, P = any>(
  mutationFunction: (payload: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const mutate = useCallback(
    async (payload: P) => {
      setLoading(true)
      setError(null)
      try {
        const result = await mutationFunction(payload)
        setData(result)
        return result
      } catch (err) {
        let errorMessage = 'An error occurred'
        if (err instanceof ApiError) {
          errorMessage = err.message
        } else if (err instanceof Error) {
          errorMessage = err.message
        }
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [mutationFunction]
  )

  const reset = () => {
    setLoading(false)
    setError(null)
    setData(null)
  }

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  }
}

/**
 * Hook for combined fetch and mutation operations
 */
export function useApiCrud<T, P = any>(
  fetchFunction: () => Promise<any>,
  createFunction: (payload: P) => Promise<T>,
  updateFunction: (id: string, payload: Partial<P>) => Promise<T>,
  deleteFunction: (id: string) => Promise<void>
) {
  const {
    data: items,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useApi(fetchFunction)

  const {
    mutate: create,
    loading: createLoading,
    error: createError,
  } = useApiMutation(createFunction)

  const {
    mutate: update,
    loading: updateLoading,
    error: updateError,
  } = useApiMutation((payload: { id: string; data: Partial<P> }) =>
    updateFunction(payload.id, payload.data)
  )

  const {
    mutate: remove,
    loading: deleteLoading,
    error: deleteError,
  } = useApiMutation(deleteFunction)

  return {
    items,
    fetchLoading,
    fetchError,
    refetch,
    create,
    createLoading,
    createError,
    update,
    updateLoading,
    updateError,
    remove,
    deleteLoading,
    deleteError,
    isLoading: fetchLoading || createLoading || updateLoading || deleteLoading,
    error: fetchError || createError || updateError || deleteError,
  }
}
