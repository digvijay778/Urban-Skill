import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material'
import {
  Lock,
  Warning,
  Refresh,
  Login,
  VerifiedUser
} from '@mui/icons-material'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const ProtectedRoute = ({ 
  children, 
  roles = [], 
  requireVerification = false,
  fallbackPath = '/login',
  showUnauthorized = true,
  loadingComponent: LoadingComponent,
  unauthorizedComponent: UnauthorizedComponent
}) => {
  const { user, isAuthenticated, loading, checkAuthStatus, hasRole } = useAuth()
  const location = useLocation()
  const [authChecked, setAuthChecked] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated && !loading) {
        await checkAuthStatus()
      }
      setAuthChecked(true)
    }

    verifyAuth()
  }, [isAuthenticated, loading, checkAuthStatus])

  // Show loading while checking authentication
  if (loading || !authChecked) {
    if (LoadingComponent) {
      return <LoadingComponent />
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="h6" color="text.secondary">
              Verifying authentication...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location, message: 'Please login to access this page' }}
        replace 
      />
    )
  }

  // Check role-based access
  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    if (UnauthorizedComponent) {
      return <UnauthorizedComponent requiredRoles={roles} userRole={user?.role} />
    }

    if (!showUnauthorized) {
      return <Navigate to="/dashboard" replace />
    }

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: 3
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'error.light',
                  color: 'error.main',
                  mb: 3
                }}
              >
                <Lock sx={{ fontSize: 40 }} />
              </Box>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Access Denied
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You don't have permission to access this page. 
                {roles.length > 0 && (
                  <>
                    <br />
                    Required role(s): <strong>{roles.join(', ')}</strong>
                    <br />
                    Your role: <strong>{user?.role || 'Unknown'}</strong>
                  </>
                )}
              </Typography>

              <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
                If you believe this is an error, please contact your administrator 
                or try logging in with a different account.
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                  startIcon={<Refresh />}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => window.location.href = '/dashboard'}
                  startIcon={<Lock />}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    )
  }

  // Check verification requirement
  if (requireVerification && !user?.verified) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          p: 3
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'warning.light',
                  color: 'warning.main',
                  mb: 3
                }}
              >
                <VerifiedUser sx={{ fontSize: 40 }} />
              </Box>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Verification Required
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You need to verify your account to access this page. 
                Please check your email or phone for verification instructions.
              </Typography>

              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>Account Status:</strong> Unverified
                  <br />
                  <strong>Email:</strong> {user?.email} {user?.emailVerified ? '✓' : '✗'}
                  <br />
                  <strong>Phone:</strong> {user?.phone} {user?.phoneVerified ? '✓' : '✗'}
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = '/profile'}
                  startIcon={<Warning />}
                >
                  Verify Account
                </Button>
                <Button
                  variant="contained"
                  onClick={() => window.location.href = '/dashboard'}
                  startIcon={<Lock />}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    )
  }

  // Render protected content
  return <>{children}</>
}

// Higher-order component for role-based protection
export const withRoleProtection = (WrappedComponent, allowedRoles = []) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute roles={allowedRoles}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }
}

// Specific role-based route components
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={['admin']} {...props}>
    {children}
  </ProtectedRoute>
)

export const WorkerRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={['worker', 'admin']} {...props}>
    {children}
  </ProtectedRoute>
)

export const CustomerRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={['customer', 'admin']} {...props}>
    {children}
  </ProtectedRoute>
)

export const VerifiedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireVerification={true} {...props}>
    {children}
  </ProtectedRoute>
)

// Custom loading component for protected routes
export const AuthLoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        </motion.div>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Securing your session...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we verify your credentials
        </Typography>
      </Box>
    </motion.div>
  </Box>
)

// Custom unauthorized component
export const UnauthorizedScreen = ({ requiredRoles, userRole }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'background.default',
      p: 3
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={{ maxWidth: 600, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'error.light',
              color: 'error.main',
              mb: 3
            }}
          >
            <Lock sx={{ fontSize: 50 }} />
          </Box>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Access Restricted
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This area is restricted to authorized personnel only.
          </Typography>

          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Access Level:</strong> {userRole || 'Unknown'}
              <br />
              <strong>Required Level:</strong> {requiredRoles?.join(' or ') || 'Higher privileges'}
              <br />
              <strong>Contact:</strong> admin@urbanskill.com for access requests
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              startIcon={<Refresh />}
            >
              Go Back
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/login'}
              startIcon={<Login />}
            >
              Switch Account
            </Button>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/dashboard'}
              startIcon={<Lock />}
            >
              Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  </Box>
)

export default ProtectedRoute
