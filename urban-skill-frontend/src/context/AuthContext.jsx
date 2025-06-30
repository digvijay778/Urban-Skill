import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiService, tokenManager } from "@services/api";
import { errorUtils } from "@utils/errorHandler";
import {
  API_ENDPOINTS,
  USER_ROLES,
  STORAGE_KEYS,
  SUCCESS_MESSAGES,
} from "@utils/constants";

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState([]);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication
  // const initializeAuth = async () => {
  //   try {
  //     setLoading(true)
  //     const token = tokenManager.getToken()

  //     if (token) {
  //       // Verify token and get user data
  //       await getCurrentUser()
  //     } else {
  //       // No token found
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     console.error('Auth initialization failed:', error)
  //     await logout()
  //   }
  // }
  // In your AuthContext.jsx - Replace the initializeAuth function
  const initializeAuth = async () => {
    try {
      setLoading(true);
      const token = tokenManager.getToken();
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      console.log("🔄 Initializing auth...", { token, userData });

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("✅ Found user in localStorage:", parsedUser);

          setUser(parsedUser);
          setIsAuthenticated(true);
          setPermissions(parsedUser.permissions || []);

          setLoading(false);
          return;
        } catch (parseError) {
          console.error("❌ Error parsing user data:", parseError);
          tokenManager.clearTokens();
        }
      }

      // If no token/user data, try to get from API (for real backend)
      // For now, just set loading to false
      console.log("❌ No auth data found");
      setLoading(false);
    } catch (error) {
      console.error("Auth initialization failed:", error);
      await logout();
    }
  };

  // Get current user data
  const getCurrentUser = async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.AUTH.ME);
      const userData = response.user || response.data;

      setUser(userData);
      setIsAuthenticated(true);
      setPermissions(userData.permissions || []);

      // Store user data in localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      setLoading(false);
      return userData;
    } catch (error) {
      errorUtils.handleAuthError(error, { action: "getCurrentUser" });
      await logout();
      throw error;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await apiService.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      const { user: userData, token, refreshToken } = response;

      // Store tokens
      tokenManager.setTokens(token, refreshToken);

      // Set user state
      setUser(userData);
      setIsAuthenticated(true);
      setPermissions(userData.permissions || []);

      // Store user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      setLoading(false);

      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: userData,
      };
    } catch (error) {
      setLoading(false);
      const authError = errorUtils.handleAuthError(error, { action: "login" });

      return {
        success: false,
        error: authError.message || "Login failed",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await apiService.post(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      const { user: newUser, token, refreshToken } = response;

      // Store tokens
      tokenManager.setTokens(token, refreshToken);

      // Set user state
      setUser(newUser);
      setIsAuthenticated(true);
      setPermissions(newUser.permissions || []);

      // Store user data
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));

      setLoading(false);

      return {
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        user: newUser,
      };
    } catch (error) {
      setLoading(false);
      const authError = errorUtils.handleAuthError(error, {
        action: "register",
      });

      return {
        success: false,
        error: authError.message || "Registration failed",
      };
    }
  };

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API if user is authenticated
      if (isAuthenticated) {
        await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear all auth data regardless of API call result
      tokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setPermissions([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        profileData
      );
      const updatedUser = response.user || response.data;

      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));

      return {
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
        user: updatedUser,
      };
    } catch (error) {
      const authError = errorUtils.handleAuthError(error, {
        action: "updateProfile",
      });
      return {
        success: false,
        error: authError.message || "Profile update failed",
      };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await apiService.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      const authError = errorUtils.handleAuthError(error, {
        action: "changePassword",
      });
      return {
        success: false,
        error: authError.message || "Password change failed",
      };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });

      return {
        success: true,
        message: "Password reset link sent to your email",
      };
    } catch (error) {
      const authError = errorUtils.handleAuthError(error, {
        action: "forgotPassword",
      });
      return {
        success: false,
        error: authError.message || "Failed to send reset link",
      };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });

      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      const authError = errorUtils.handleAuthError(error, {
        action: "resetPassword",
      });
      return {
        success: false,
        error: authError.message || "Password reset failed",
      };
    }
  };

  // Verify OTP
  const verifyOTP = async (otp, context = {}) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        otp,
        ...context,
      });

      return {
        success: true,
        message: "OTP verified successfully",
        data: response,
      };
    } catch (error) {
      const authError = errorUtils.handleAuthError(error, {
        action: "verifyOTP",
      });
      return {
        success: false,
        error: authError.message || "OTP verification failed",
      };
    }
  };

  // Permission checking utilities
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission) => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyRole = useCallback(
    (roles) => {
      return roles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  const hasAnyPermission = useCallback(
    (perms) => {
      return perms.some((permission) => hasPermission(permission));
    },
    [hasPermission]
  );

  // Role checking shortcuts
  const isCustomer = useCallback(() => hasRole(USER_ROLES.CUSTOMER), [hasRole]);
  const isWorker = useCallback(() => hasRole(USER_ROLES.WORKER), [hasRole]);
  const isAdmin = useCallback(() => hasRole(USER_ROLES.ADMIN), [hasRole]);
  const isSuperAdmin = useCallback(
    () => hasRole(USER_ROLES.SUPER_ADMIN),
    [hasRole]
  );

  // Context value
  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    permissions,

    // Auth methods
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyOTP,

    // Permission methods
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,

    // Role shortcuts
    isCustomer,
    isWorker,
    isAdmin,
    isSuperAdmin,

    // Utility methods
    refreshAuth: getCurrentUser,
    clearAuth: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext }; // ADD THIS LINE
export default AuthProvider;

