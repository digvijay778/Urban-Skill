// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
}

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Urban Skill',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Professional Service Booking Platform',
  SUPPORT_EMAIL: 'digvijayrana369@gmail.com',
  SUPPORT_PHONE: '+91-9813824250',
}

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/delete-account',
  },

  // Workers
  WORKERS: {
    LIST: '/workers',
    PROFILE: '/workers/profile',
    REGISTER: '/workers/register',
    UPDATE_PROFILE: '/workers/profile',
    UPLOAD_DOCUMENTS: '/workers/documents',
    VERIFY: '/workers/verify',
    AVAILABILITY: '/workers/availability',
    REVIEWS: '/workers/reviews',
    EARNINGS: '/workers/earnings',
  },

  // Services
  SERVICES: {
    LIST: '/services',
    CATEGORIES: '/services/categories',
    DETAILS: '/services/:id',
    SEARCH: '/services/search',
    POPULAR: '/services/popular',
  },

  // Bookings
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAILS: '/bookings/:id',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
    ACCEPT: '/bookings/:id/accept',
    COMPLETE: '/bookings/:id/complete',
    HISTORY: '/bookings/history',
  },

  // Payments
  PAYMENTS: {
    CREATE: '/payments',
    VERIFY: '/payments/verify',
    HISTORY: '/payments/history',
    METHODS: '/payments/methods',
    REFUND: '/payments/refund',
  },

  // Reviews
  REVIEWS: {
    CREATE: '/reviews',
    LIST: '/reviews',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/messages',
    SEND: '/chat/send',
    HISTORY: '/chat/history',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    WORKERS: '/admin/workers',
    BOOKINGS: '/admin/bookings',
    ANALYTICS: '/admin/analytics',
    REPORTS: '/admin/reports',
  },
}

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
}

// Service Categories
export const SERVICE_CATEGORIES = {
  ELECTRICAL: 'electrical',
  PLUMBING: 'plumbing',
  CARPENTRY: 'carpentry',
  CLEANING: 'cleaning',
  PAINTING: 'painting',
  AC_REPAIR: 'ac_repair',
  APPLIANCE_REPAIR: 'appliance_repair',
  PEST_CONTROL: 'pest_control',
  GARDENING: 'gardening',
  BEAUTY: 'beauty',
}

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
}

// Worker Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'urbanSkill_auth_token',
  REFRESH_TOKEN: 'urbanSkill_refresh_token',
  USER_DATA: 'urbanSkill_user_data',
  THEME_MODE: 'urbanSkill_theme_mode',
  LANGUAGE: 'urbanSkill_language',
  LOCATION: 'urbanSkill_user_location',
  SEARCH_HISTORY: 'urbanSkill_search_history',
  CART: 'urbanSkill_cart',
}

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#f59e0b',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  DARK: '#1f2937',
  LIGHT: '#f8fafc',
}

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
}

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 10,
  OTP_LENGTH: 6,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!',
}

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_BOOKING: 'new_booking',
  BOOKING_UPDATE: 'booking_update',
  NEW_MESSAGE: 'new_message',
  WORKER_ONLINE: 'worker_online',
  WORKER_OFFLINE: 'worker_offline',
  NOTIFICATION: 'notification',
}

// Feature Flags
export const FEATURES = {
  CHAT_ENABLED: import.meta.env.VITE_ENABLE_CHAT === 'true',
  NOTIFICATIONS_ENABLED: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  GEOLOCATION_ENABLED: import.meta.env.VITE_ENABLE_GEOLOCATION === 'true',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
}

// Platform Commission
export const COMMISSION = {
  RATE: 0.15, // 15%
  MIN_AMOUNT: 50, // Minimum ₹50
  MAX_AMOUNT: 1000, // Maximum ₹1000
}

// Rating System
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
}

export default {
  API_CONFIG,
  APP_CONFIG,
  API_ENDPOINTS,
  USER_ROLES,
  SERVICE_CATEGORIES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  VERIFICATION_STATUS,
  STORAGE_KEYS,
  THEME_COLORS,
  BREAKPOINTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SOCKET_EVENTS,
  FEATURES,
  PAGINATION,
  DATE_FORMATS,
  COMMISSION,
  RATING,
}
