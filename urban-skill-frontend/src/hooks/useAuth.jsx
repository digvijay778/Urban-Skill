// src/hooks/useAuth.jsx
import { useContext, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext' // Fix import path
import { USER_ROLES } from '../utils/constants'
import AuthProvider, { useAuth as useAuthContext, AuthContext } from '../context/AuthContext';

// Main useAuth hook (UNCOMMENT AND EXPORT THIS)
export const useAuth = () => {
  return useAuthContext();
};

// Enhanced authentication hook with navigation
export const useAuthNavigation = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Login with redirect
  const loginWithRedirect = useCallback(async (credentials, redirectTo = null) => {
    const result = await auth.login(credentials)
    
    if (result.success) {
      // Redirect to intended page or dashboard based on role
      const targetPath = redirectTo || 
                        location.state?.from?.pathname || 
                        getDashboardPath(result.user.role)
      navigate(targetPath, { replace: true })
    }
    
    return result
  }, [auth, navigate, location])

  // Logout with redirect
  const logoutWithRedirect = useCallback(async (redirectTo = '/') => {
    await auth.logout()
    navigate(redirectTo, { replace: true })
  }, [auth, navigate])

  // Register with redirect
  const registerWithRedirect = useCallback(async (userData, redirectTo = null) => {
    const result = await auth.register(userData)
    
    if (result.success) {
      const targetPath = redirectTo || getDashboardPath(result.user.role)
      navigate(targetPath, { replace: true })
    }
    
    return result
  }, [auth, navigate])

  // Get dashboard path based on role
  const getDashboardPath = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case USER_ROLES.SUPER_ADMIN:
        return '/admin/dashboard'
      case USER_ROLES.WORKER:
        return '/worker/dashboard'
      case USER_ROLES.CUSTOMER:
      default:
        return '/dashboard'
    }
  }

  // Require authentication (redirect to login if not authenticated)
  const requireAuth = useCallback((redirectTo = '/login') => {
    if (!auth.isAuthenticated && !auth.loading) {
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      })
      return false
    }
    return true
  }, [auth.isAuthenticated, auth.loading, navigate, location])

  // Require specific role
  const requireRole = useCallback((requiredRole, redirectTo = '/unauthorized') => {
    if (!auth.hasRole(requiredRole)) {
      navigate(redirectTo, { replace: true })
      return false
    }
    return true
  }, [auth, navigate])

  // Require any of the specified roles
  const requireAnyRole = useCallback((roles, redirectTo = '/unauthorized') => {
    if (!auth.hasAnyRole(roles)) {
      navigate(redirectTo, { replace: true })
      return false
    }
    return true
  }, [auth, navigate])

  return {
    ...auth,
    loginWithRedirect,
    logoutWithRedirect,
    registerWithRedirect,
    requireAuth,
    requireRole,
    requireAnyRole,
    getDashboardPath,
  }
}

// Hook for protected routes
export const useProtectedRoute = (requiredRole = null, requiredPermissions = []) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthorized = useMemo(() => {
    if (!auth.isAuthenticated) return false
    
    if (requiredRole && !auth.hasRole(requiredRole)) return false
    
    if (requiredPermissions.length > 0 && !auth.hasAnyPermission(requiredPermissions)) {
      return false
    }
    
    return true
  }, [auth, requiredRole, requiredPermissions])

  const redirectToLogin = useCallback(() => {
    navigate('/login', {
      state: { from: location },
      replace: true
    })
  }, [navigate, location])

  const redirectToUnauthorized = useCallback(() => {
    navigate('/unauthorized', { replace: true })
  }, [navigate])

  return {
    isAuthenticated: auth.isAuthenticated,
    isAuthorized,
    loading: auth.loading,
    user: auth.user,
    redirectToLogin,
    redirectToUnauthorized,
  }
}

// Hook for role-based rendering
export const useRoleAccess = () => {
  const auth = useAuth()

  const canAccess = useCallback((roles, permissions = []) => {
    if (!auth.isAuthenticated) return false
    
    const hasRequiredRole = Array.isArray(roles) 
      ? auth.hasAnyRole(roles)
      : auth.hasRole(roles)
    
    const hasRequiredPermissions = permissions.length === 0 || 
      auth.hasAnyPermission(permissions)
    
    return hasRequiredRole && hasRequiredPermissions
  }, [auth])

  const renderForRoles = useCallback((roles, component, fallback = null) => {
    return canAccess(roles) ? component : fallback
  }, [canAccess])

  const renderForCustomer = useCallback((component, fallback = null) => {
    return renderForRoles(USER_ROLES.CUSTOMER, component, fallback)
  }, [renderForRoles])

  const renderForWorker = useCallback((component, fallback = null) => {
    return renderForRoles(USER_ROLES.WORKER, component, fallback)
  }, [renderForRoles])

  const renderForAdmin = useCallback((component, fallback = null) => {
    return renderForRoles([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN], component, fallback)
  }, [renderForRoles])

  return {
    canAccess,
    renderForRoles,
    renderForCustomer,
    renderForWorker,
    renderForAdmin,
  }
}

// Hook for authentication status
export const useAuthStatus = () => {
  const auth = useAuth()

  const status = useMemo(() => {
    if (auth.loading) return 'loading'
    if (!auth.isAuthenticated) return 'unauthenticated'
    if (!auth.user) return 'authenticating'
    return 'authenticated'
  }, [auth.loading, auth.isAuthenticated, auth.user])

  const isReady = status === 'authenticated'
  const isLoading = status === 'loading' || status === 'authenticating'
  const needsLogin = status === 'unauthenticated'

  return {
    status,
    isReady,
    isLoading,
    needsLogin,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  }
}

// Hook for user profile management
export const useUserProfile = () => {
  const auth = useAuth()

  const updateProfile = useCallback(async (profileData) => {
    return await auth.updateProfile(profileData)
  }, [auth])

  const changePassword = useCallback(async (passwordData) => {
    return await auth.changePassword(passwordData)
  }, [auth])

  const uploadAvatar = useCallback(async (file) => {
    // This would integrate with your file upload service
    const formData = new FormData()
    formData.append('avatar', file)
    
    // Implementation would depend on your API
    // return await apiService.upload('/users/avatar', formData)
  }, [])

  return {
    user: auth.user,
    updateProfile,
    changePassword,
    uploadAvatar,
    refreshProfile: auth.getCurrentUser,
  }
}

// Hook for session management
export const useSession = () => {
  const auth = useAuth()

  const extendSession = useCallback(async () => {
    try {
      await auth.getCurrentUser()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [auth])

  const isSessionValid = useMemo(() => {
    return auth.isAuthenticated && auth.user
  }, [auth.isAuthenticated, auth.user])

  const sessionInfo = useMemo(() => {
    if (!auth.user) return null
    
    return {
      userId: auth.user.id,
      email: auth.user.email,
      role: auth.user.role,
      loginTime: auth.user.loginTime,
      lastActivity: auth.user.lastActivity,
    }
  }, [auth.user])

  return {
    isSessionValid,
    sessionInfo,
    extendSession,
    endSession: auth.logout,
  }
}

// Default export
export default useAuth
