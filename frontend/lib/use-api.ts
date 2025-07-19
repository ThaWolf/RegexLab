import { useState, useCallback } from 'react'
import { ApiErrorHandler, createApiErrorHandler } from './error-handling'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  context?: string
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const errorHandler = createApiErrorHandler(options.context)

  const execute = useCallback(async (
    url: string,
    requestOptions: RequestInit = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        },
        ...requestOptions
      })

      const data = await ApiErrorHandler.handleResponse(response)
      
      setState({ data, loading: false, error: null })
      options.onSuccess?.(data)
      
      return data
    } catch (error) {
      const errorMessage = errorHandler.getErrorMessage(error)
      errorHandler.logError(error)
      
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      options.onError?.(errorMessage)
      
      return null
    }
  }, [options, errorHandler])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

export function useApiMutation<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const errorHandler = createApiErrorHandler(options.context)

  const mutate = useCallback(async (
    url: string,
    data?: any,
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined
      })

      const result = await ApiErrorHandler.handleResponse(response)
      
      setState({ data: result, loading: false, error: null })
      options.onSuccess?.(result)
      
      return result
    } catch (error) {
      const errorMessage = errorHandler.getErrorMessage(error)
      errorHandler.logError(error)
      
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      options.onError?.(errorMessage)
      
      return null
    }
  }, [options, errorHandler])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    mutate,
    reset
  }
} 