import { apiService } from '@services/api'
import { errorUtils } from '@utils/errorHandler'
import { 
  API_ENDPOINTS, 
  STORAGE_KEYS, 
  VALIDATION_RULES 
} from '@utils/constants'

// Authentication Service Class
class AuthService {
  constructor() {
    this.tokenRefreshPromise = null
  }

  // User Authentication Methods
  
  // Login user
  async login(credentials) {
    try {
      const { email, password, rememberMe = false } = credentials
      
      // Validate credentials
      this.validateLoginCredentials({ email, password })
      
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: email.toLowerCase().trim(),
        password,
        rememberMe
      })

      const { user, token, refreshToken, expiresIn } = response

      // Store authentication data
      this.storeAuthData({ user, token, refreshToken, expiresIn })

      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { 
        action: 'login', 
        email: credentials.email 
      })
    }
  }

  // Register new user
  async register(userData) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        role = 'customer',
        agreeToTerms
      } = userData

      // Validate registration data
      this.validateRegistrationData(userData)

      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone.replace(/\D/g, ''), // Remove non-digits
        role,
        agreeToTerms
      })

      const { user, token, refreshToken, requiresVerification } = response

      if (!requiresVerification) {
        // Store authentication data if no verification required
        this.storeAuthData({ user, token, refreshToken })
      }

      return {
        success: true,
        user,
        token,
        requiresVerification,
        message: requiresVerification 
          ? 'Please verify your email to complete registration'
          : 'Registration successful'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { 
        action: 'register', 
        email: userData.email 
      })
    }
  }

  // Logout user
  async logout() {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      
      if (refreshToken) {
        // Notify server about logout
        await apiService.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
      }
    } catch (error) {
      // Log error but don't throw - logout should always succeed locally
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local storage
      this.clearAuthData()
    }
  }

  // Refresh authentication token
  async refreshToken() {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise
    }

    this.tokenRefreshPromise = this.performTokenRefresh()
    
    try {
      const result = await this.tokenRefreshPromise
      return result
    } finally {
      this.tokenRefreshPromise = null
    }
  }

  // Perform actual token refresh
  async performTokenRefresh() {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      })

      const { token, refreshToken: newRefreshToken, user, expiresIn } = response

      // Update stored authentication data
      this.storeAuthData({ 
        user, 
        token, 
        refreshToken: newRefreshToken, 
        expiresIn 
      })

      return {
        success: true,
        token,
        user
      }
    } catch (error) {
      // Clear auth data if refresh fails
      this.clearAuthData()
      throw errorUtils.handleAuthError(error, { action: 'refreshToken' })
    }
  }

  // Password Management Methods

  // Forgot password
  async forgotPassword(email) {
    try {
      this.validateEmail(email)

      await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: email.toLowerCase().trim()
      })

      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { 
        action: 'forgotPassword', 
        email 
      })
    }
  }

  // Reset password
  async resetPassword(token, newPassword, confirmPassword) {
    try {
      this.validatePasswordReset({ newPassword, confirmPassword })

      await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
        confirmPassword
      })

      return {
        success: true,
        message: 'Password reset successfully'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { action: 'resetPassword' })
    }
  }

  // Change password (authenticated user)
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      this.validatePasswordChange({ currentPassword, newPassword, confirmPassword })

      await apiService.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword
      })

      return {
        success: true,
        message: 'Password changed successfully'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { action: 'changePassword' })
    }
  }

  // Email Verification Methods

  // Verify email with token
  async verifyEmail(token) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        token
      })

      const { user, token: authToken, refreshToken } = response

      // Store authentication data after verification
      this.storeAuthData({ user, token: authToken, refreshToken })

      return {
        success: true,
        user,
        message: 'Email verified successfully'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { action: 'verifyEmail' })
    }
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    try {
      this.validateEmail(email)

      await apiService.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        email: email.toLowerCase().trim()
      })

      return {
        success: true,
        message: 'Verification email sent'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { 
        action: 'resendVerification', 
        email 
      })
    }
  }

  // OTP Methods

  // Send OTP
  async sendOTP(phone, purpose = 'verification') {
    try {
      this.validatePhone(phone)

      await apiService.post(API_ENDPOINTS.AUTH.SEND_OTP, {
        phone: phone.replace(/\D/g, ''),
        purpose
      })

      return {
        success: true,
        message: 'OTP sent successfully'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { 
        action: 'sendOTP', 
        phone 
      })
    }
  }

  // Verify OTP
  async verifyOTP(phone, otp, purpose = 'verification') {
    try {
      this.validateOTP(otp)

      const response = await apiService.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        phone: phone.replace(/\D/g, ''),
        otp,
        purpose
      })

      return {
        success: true,
        data: response,
        message: 'OTP verified successfully'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { 
        action: 'verifyOTP', 
        phone 
      })
    }
  }

  // User Profile Methods

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.ME)
      const user = response.user || response

      // Update stored user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))

      return {
        success: true,
        user
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { action: 'getCurrentUser' })
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData)
      const user = response.user || response

      // Update stored user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))

      return {
        success: true,
        user,
        message: 'Profile updated successfully'
      }
    } catch (error) {
      throw errorUtils.handleAuthError(error, { action: 'updateProfile' })
    }
  }

  // Utility Methods

  // Store authentication data
  storeAuthData({ user, token, refreshToken, expiresIn }) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    }
    
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }
    
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
    }

    if (expiresIn) {
      const expirationTime = Date.now() + (expiresIn * 1000)
      localStorage.setItem('token_expiration', expirationTime.toString())
    }
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem('token_expiration')
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const user = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return !!(token && user)
  }

  // Get stored user data
  getStoredUser() {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing stored user data:', error)
      return null
    }
  }

  // Validation Methods

  validateLoginCredentials({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    this.validateEmail(email)
    
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
    }
  }

  validateRegistrationData(userData) {
    const { firstName, lastName, email, password, confirmPassword, phone, agreeToTerms } = userData

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new Error('All fields are required')
    }

    if (!agreeToTerms) {
      throw new Error('You must agree to the terms and conditions')
    }

    this.validateEmail(email)
    this.validatePassword(password)
    
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    if (phone) {
      this.validatePhone(phone)
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address')
    }
  }

  validatePassword(password) {
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
    }
    
    // Add more password complexity rules as needed
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    }
  }

  validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== VALIDATION_RULES.PHONE_LENGTH) {
      throw new Error(`Phone number must be ${VALIDATION_RULES.PHONE_LENGTH} digits`)
    }
  }

  validateOTP(otp) {
    if (!otp || otp.length !== VALIDATION_RULES.OTP_LENGTH) {
      throw new Error(`OTP must be ${VALIDATION_RULES.OTP_LENGTH} digits`)
    }
  }

  validatePasswordReset({ newPassword, confirmPassword }) {
    this.validatePassword(newPassword)
    
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match')
    }
  }

  validatePasswordChange({ currentPassword, newPassword, confirmPassword }) {
    if (!currentPassword) {
      throw new Error('Current password is required')
    }
    
    this.validatePasswordReset({ newPassword, confirmPassword })
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
