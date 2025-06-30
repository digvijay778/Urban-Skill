import { ERROR_MESSAGES, FEATURES } from '@utils/constants'

// Error types enum
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
}

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

// Error classification based on status codes
const classifyError = (error) => {
  if (!error.response) {
    return {
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      retryable: true,
    }
  }

  const status = error.response.status

  switch (true) {
    case status >= 400 && status < 500:
      return {
        type: status === 401 ? ERROR_TYPES.AUTHENTICATION : 
              status === 403 ? ERROR_TYPES.AUTHORIZATION :
              status === 404 ? ERROR_TYPES.NOT_FOUND :
              ERROR_TYPES.VALIDATION,
        severity: status === 401 || status === 403 ? ERROR_SEVERITY.HIGH : ERROR_SEVERITY.MEDIUM,
        retryable: status === 401, // Only retry auth errors (token refresh)
      }
    case status >= 500:
      return {
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.CRITICAL,
        retryable: true,
      }
    default:
      return {
        type: ERROR_TYPES.UNKNOWN,
        severity: ERROR_SEVERITY.MEDIUM,
        retryable: false,
      }
  }
}

// Enhanced error object
export class AppError extends Error {
  constructor(message, originalError = null, context = {}) {
    super(message)
    this.name = 'AppError'
    this.originalError = originalError
    this.context = context
    this.timestamp = new Date().toISOString()
    
    if (originalError) {
      const classification = classifyError(originalError)
      this.type = classification.type
      this.severity = classification.severity
      this.retryable = classification.retryable
      this.statusCode = originalError.response?.status
      this.data = originalError.response?.data
    }
  }

  // Convert to plain object for logging
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    }
  }
}

// Error handler class
export class ErrorHandler {
  constructor() {
    this.errorQueue = []
    this.maxQueueSize = 100
    this.listeners = []
  }

  // Add error listener
  addListener(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notify all listeners
  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error)
      } catch (err) {
        console.error('Error in error listener:', err)
      }
    })
  }

  // Handle error
  handle(error, context = {}) {
    const appError = error instanceof AppError ? error : new AppError(
      error.message || ERROR_MESSAGES.UNKNOWN,
      error,
      context
    )

    // Add to queue
    this.addToQueue(appError)

    // Log error
    this.logError(appError)

    // Notify listeners (for UI notifications)
    this.notifyListeners(appError)

    // Send to monitoring service (if enabled)
    if (FEATURES.ERROR_REPORTING) {
      this.reportError(appError)
    }

    return appError
  }

  // Add error to queue
  addToQueue(error) {
    this.errorQueue.unshift(error)
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.pop()
    }
  }

  // Log error with appropriate level
  logError(error) {
    const logData = {
      message: error.message,
      type: error.type,
      severity: error.severity,
      context: error.context,
      timestamp: error.timestamp,
    }

    switch (error.severity) {
      case ERROR_SEVERITY.CRITICAL:
        console.error('🚨 CRITICAL ERROR:', logData)
        break
      case ERROR_SEVERITY.HIGH:
        console.error('❌ HIGH ERROR:', logData)
        break
      case ERROR_SEVERITY.MEDIUM:
        console.warn('⚠️ MEDIUM ERROR:', logData)
        break
      case ERROR_SEVERITY.LOW:
        console.info('ℹ️ LOW ERROR:', logData)
        break
      default:
        console.log('📝 ERROR:', logData)
    }

    // Log stack trace in debug mode
    if (FEATURES.DEBUG_MODE && error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }

  // Report error to monitoring service
  reportError(error) {
    // Integration with services like Sentry, LogRocket, etc.
    try {
      if (window.Sentry) {
        window.Sentry.captureException(error.originalError || error, {
          tags: {
            type: error.type,
            severity: error.severity,
          },
          extra: {
            context: error.context,
            statusCode: error.statusCode,
          },
        })
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  // Get recent errors
  getRecentErrors(count = 10) {
    return this.errorQueue.slice(0, count)
  }

  // Clear error queue
  clearErrors() {
    this.errorQueue = []
  }

  // Get error statistics
  getStats() {
    const stats = {
      total: this.errorQueue.length,
      byType: {},
      bySeverity: {},
      recent: this.errorQueue.slice(0, 5),
    }

    this.errorQueue.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1
    })

    return stats
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler()

// Utility functions for common error scenarios
export const errorUtils = {
  // Handle API errors
  handleApiError: (error, context = {}) => {
    return errorHandler.handle(error, { ...context, source: 'API' })
  },

  // Handle form validation errors
  handleValidationError: (errors, context = {}) => {
    const message = Array.isArray(errors) 
      ? errors.join(', ')
      : typeof errors === 'object'
      ? Object.values(errors).flat().join(', ')
      : errors.toString()

    return errorHandler.handle(
      new AppError(message, null, { ...context, source: 'VALIDATION' })
    )
  },

  // Handle authentication errors
  handleAuthError: (error, context = {}) => {
    return errorHandler.handle(error, { ...context, source: 'AUTH' })
  },

  // Handle network errors
  handleNetworkError: (context = {}) => {
    return errorHandler.handle(
      new AppError(ERROR_MESSAGES.NETWORK_ERROR, null, { ...context, source: 'NETWORK' })
    )
  },

  // Create user-friendly error message
  getUserMessage: (error) => {
    if (error instanceof AppError) {
      switch (error.type) {
        case ERROR_TYPES.NETWORK:
          return 'Please check your internet connection and try again.'
        case ERROR_TYPES.AUTHENTICATION:
          return 'Please log in to continue.'
        case ERROR_TYPES.AUTHORIZATION:
          return 'You don\'t have permission to perform this action.'
        case ERROR_TYPES.NOT_FOUND:
          return 'The requested resource was not found.'
        case ERROR_TYPES.VALIDATION:
          return error.message || 'Please check your input and try again.'
        case ERROR_TYPES.SERVER:
          return 'Something went wrong on our end. Please try again later.'
        default:
          return error.message || 'An unexpected error occurred.'
      }
    }
    return error.message || 'An unexpected error occurred.'
  },

  // Check if error is retryable
  isRetryable: (error) => {
    return error instanceof AppError ? error.retryable : false
  },

  // Format error for display
  formatError: (error) => {
    return {
      message: errorUtils.getUserMessage(error),
      type: error.type || ERROR_TYPES.UNKNOWN,
      severity: error.severity || ERROR_SEVERITY.MEDIUM,
      retryable: errorUtils.isRetryable(error),
      timestamp: error.timestamp || new Date().toISOString(),
    }
  },
}

// Global error boundary error handler
export const handleGlobalError = (error, errorInfo) => {
  const appError = new AppError(
    'Application crashed',
    error,
    { errorInfo, source: 'REACT_ERROR_BOUNDARY' }
  )
  
  errorHandler.handle(appError)
  return appError
}

// Unhandled promise rejection handler
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const error = new AppError(
      'Unhandled promise rejection',
      event.reason,
      { source: 'UNHANDLED_PROMISE' }
    )
    
    errorHandler.handle(error)
    event.preventDefault() // Prevent console error
  })
}

export default errorHandler
