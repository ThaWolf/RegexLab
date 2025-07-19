export interface ApiError {
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
  method: string
  stack?: string
}

export class ApiErrorHandler {
  static async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      let errorData: ApiError
      
      try {
        errorData = await response.json()
      } catch {
        // If response is not JSON, create a generic error
        errorData = {
          statusCode: response.status,
          message: response.statusText || 'An error occurred',
          error: 'Request Failed',
          timestamp: new Date().toISOString(),
          path: response.url,
          method: 'GET'
        }
      }

      throw new Error(this.formatErrorMessage(errorData))
    }

    return response.json()
  }

  static formatErrorMessage(error: ApiError): string {
    const { statusCode, message, error: errorType } = error
    
    switch (statusCode) {
      case 400:
        return `Invalid request: ${message}`
      case 401:
        return 'Authentication required. Please sign in.'
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 422:
        return `Validation error: ${message}`
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.'
      default:
        return message || 'An unexpected error occurred.'
    }
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    return 'An unexpected error occurred.'
  }

  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('fetch') || 
             error.message.includes('network') ||
             error.message.includes('Failed to fetch')
    }
    return false
  }

  static isValidationError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('validation') ||
             error.message.includes('Invalid') ||
             error.message.includes('required')
    }
    return false
  }

  static logError(error: unknown, context?: string): void {
    const errorMessage = this.getErrorMessage(error)
    const timestamp = new Date().toISOString()
    
    console.error(`[${timestamp}] ${context ? `[${context}] ` : ''}Error:`, {
      message: errorMessage,
      error,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
    })

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service (e.g., Sentry, LogRocket)
    }
  }
}

export const createApiErrorHandler = (context?: string) => {
  return {
    handleResponse: (response: Response) => ApiErrorHandler.handleResponse(response),
    logError: (error: unknown) => ApiErrorHandler.logError(error, context),
    getErrorMessage: (error: unknown) => ApiErrorHandler.getErrorMessage(error),
    isNetworkError: (error: unknown) => ApiErrorHandler.isNetworkError(error),
    isValidationError: (error: unknown) => ApiErrorHandler.isValidationError(error)
  }
} 