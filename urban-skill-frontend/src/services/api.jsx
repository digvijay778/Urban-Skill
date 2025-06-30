import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES } from '@utils/constants'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Token management utilities
const tokenManager = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setTokens: (token, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }
  },
  clearTokens: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  },
}

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    if (API_CONFIG.DEBUG_MODE) {
      config.metadata = { startTime: new Date() }
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    // Log response time in debug mode
    if (API_CONFIG.DEBUG_MODE && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Log error in debug mode
    if (API_CONFIG.DEBUG_MODE) {
      console.error(`❌ API Error: ${error.response?.status} - ${error.config?.url}`)
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenManager.getRefreshToken()
        
        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refreshToken }
          )

          const { token, refreshToken: newRefreshToken } = response.data
          tokenManager.setTokens(token, newRefreshToken)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Redirect to login if refresh fails
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle different error types
    const errorMessage = getErrorMessage(error)
    const enhancedError = {
      ...error,
      message: errorMessage,
      isNetworkError: !error.response,
      statusCode: error.response?.status,
      data: error.response?.data,
    }

    return Promise.reject(enhancedError)
  }
)

// Error message handler
const getErrorMessage = (error) => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  const { status, data } = error.response

  switch (status) {
    case 400:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR
    case 401:
      return data?.message || ERROR_MESSAGES.UNAUTHORIZED
    case 403:
      return data?.message || ERROR_MESSAGES.FORBIDDEN
    case 404:
      return data?.message || ERROR_MESSAGES.NOT_FOUND
    case 422:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return data?.message || ERROR_MESSAGES.SERVER_ERROR
  }
}

// API request wrapper with retry logic
const apiRequest = async (config, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    const response = await api(config)
    return response.data
  } catch (error) {
    if (retries > 0 && error.isNetworkError) {
      console.log(`Retrying request... (${retries} attempts left)`)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      return apiRequest(config, retries - 1)
    }
    throw error
  }
}

// HTTP Methods
export const apiService = {
  // GET request
  get: async (url, params = {}, config = {}) => {
    return apiRequest({
      method: 'GET',
      url,
      params,
      ...config,
    })
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    return apiRequest({
      method: 'POST',
      url,
      data,
      ...config,
    })
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    return apiRequest({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    return apiRequest({
      method: 'PATCH',
      url,
      data,
      ...config,
    })
  },

  // DELETE request
  delete: async (url, config = {}) => {
    return apiRequest({
      method: 'DELETE',
      url,
      ...config,
    })
  },

  // File upload
  upload: async (url, formData, onUploadProgress = null) => {
    return apiRequest({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  },

  // Download file
  download: async (url, filename) => {
    const response = await api({
      method: 'GET',
      url,
      responseType: 'blob',
    })

    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  },
}

// Export token manager for use in auth context
export { tokenManager }

// Export configured axios instance
export default api
