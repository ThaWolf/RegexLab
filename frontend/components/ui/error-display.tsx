import React from 'react'
import { Button } from './button'
import { ApiErrorHandler } from '../../lib/error-handling'

interface ErrorDisplayProps {
  error: string | null
  onRetry?: () => void
  onDismiss?: () => void
  title?: string
  className?: string
  showDetails?: boolean
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  title = 'Error',
  className = '',
  showDetails = false
}: ErrorDisplayProps) {
  if (!error) return null

  const isNetworkError = ApiErrorHandler.isNetworkError(error)
  const isValidationError = ApiErrorHandler.isValidationError(error)

  const getErrorIcon = () => {
    if (isNetworkError) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    }
    
    if (isValidationError) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }

    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    )
  }

  const getErrorColor = () => {
    if (isNetworkError) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200'
    if (isValidationError) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
  }

  return (
    <div className={`rounded-lg border p-4 ${getErrorColor()} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getErrorIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
          
          <p className="text-sm">
            {error}
          </p>

          {showDetails && process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer opacity-75 hover:opacity-100">
                Technical Details
              </summary>
              <pre className="text-xs mt-1 whitespace-pre-wrap opacity-75">
                {error}
              </pre>
            </details>
          )}
        </div>

        <div className="flex-shrink-0 flex space-x-2">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-current opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {(onRetry || isNetworkError) && (
        <div className="mt-3 flex space-x-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          )}
          
          {isNetworkError && (
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              Refresh Page
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 