const RESPONSE_MESSAGES = {
  // Auth Messages
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_REGISTER_SUCCESS: 'User registered successfully',
  AUTH_LOGOUT_SUCCESS: 'Logout successful',
  AUTH_TOKEN_REFRESHED: 'Token refreshed successfully',
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_UNAUTHORIZED: 'Unauthorized access',
  AUTH_TOKEN_EXPIRED: 'Token has expired',

  // User Messages
  USER_CREATED_SUCCESS: 'User created successfully',
  USER_UPDATED_SUCCESS: 'User updated successfully',
  USER_DELETED_SUCCESS: 'User deleted successfully',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',

  // Worker Messages
  WORKER_PROFILE_CREATED: 'Worker profile created successfully',
  WORKER_PROFILE_UPDATED: 'Worker profile updated successfully',
  WORKER_NOT_FOUND: 'Worker not found',

  // Booking Messages
  BOOKING_CREATED_SUCCESS: 'Booking created successfully',
  BOOKING_ACCEPTED: 'Booking accepted',
  BOOKING_COMPLETED: 'Booking completed',
  BOOKING_CANCELLED: 'Booking cancelled',
  BOOKING_NOT_FOUND: 'Booking not found',

  // Payment Messages
  PAYMENT_SUCCESS: 'Payment successful',
  PAYMENT_FAILED: 'Payment failed',
  PAYMENT_NOT_FOUND: 'Payment not found',

  // Review Messages
  REVIEW_CREATED_SUCCESS: 'Review created successfully',
  REVIEW_UPDATED_SUCCESS: 'Review updated successfully',
  REVIEW_DELETED_SUCCESS: 'Review deleted successfully',

  // Error Messages
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
};

module.exports = {
  RESPONSE_MESSAGES,
};
