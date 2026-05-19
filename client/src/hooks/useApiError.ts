import { useCallback } from 'react'
import { ApiError } from '../services/types'

interface NotificationState {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface UseHandleApiErrorOptions {
  onError?: (message: string) => void
  onSuccess?: (message: string) => void
  defaultErrorMessage?: string
}

/**
 * Hook for consistent error handling across the app
 */
export function useHandleApiError(options: UseHandleApiErrorOptions = {}) {
  const {
    onError,
    onSuccess,
    defaultErrorMessage = 'An error occurred',
  } = options

  const handleError = useCallback(
    (error: unknown, fallbackMessage = defaultErrorMessage): string => {
      let message = fallbackMessage

      if (error instanceof ApiError) {
        message = error.message
      } else if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'string') {
        message = error
      }

      if (onError) {
        onError(message)
      }

      return message
    },
    [onError, defaultErrorMessage]
  )

  const handleSuccess = useCallback(
    (message: string) => {
      if (onSuccess) {
        onSuccess(message)
      }
    },
    [onSuccess]
  )

  return { handleError, handleSuccess }
}

/**
 * Hook for API response notification display
 */
export function useApiNotification() {
  const showNotification = useCallback(
    (state: NotificationState) => {
      // This can be integrated with a toast/notification system
      console.log(`[${state.type.toUpperCase()}] ${state.message}`)
      
      // Example integration with a global notification store:
      // const { addNotification } = useNotificationStore()
      // addNotification(state)
    },
    []
  )

  return { showNotification }
}

/**
 * Hook for request retry logic
 */
export function useRetry(maxAttempts = 3, delay = 1000) {
  const retry = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      onRetry?: (attempt: number) => void
    ): Promise<T> => {
      let lastError: unknown

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn()
        } catch (error) {
          lastError = error
          if (attempt < maxAttempts) {
            if (onRetry) {
              onRetry(attempt)
            }
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError
    },
    [maxAttempts, delay]
  )

  return { retry }
}
