import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ArrowBack,
  Security
} from '@mui/icons-material'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '@services/authService'
import { APP_CONFIG } from '@utils/constants'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State management
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
        const result = await authService.validateResetToken(token)
        setTokenValid(result.success)
        
        if (!result.success) {
          setErrors({ token: result.error || 'Invalid or expired reset token' })
        }
      } catch (error) {
        setTokenValid(false)
        setErrors({ token: 'Failed to validate reset token' })
      }
    }

    validateToken()
  }, [token])

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const result = await authService.resetPasswordWithToken({
        token,
        newPassword: formData.newPassword
      })

      if (result.success) {
        setResetSuccess(true)
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Password reset successfully. Please login with your new password.',
              type: 'success'
            }
          })
        }, 3000)
      } else {
        setErrors({ submit: result.error || 'Failed to reset password' })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Toggle password visibility
  const handleTogglePassword = () => setShowPassword(!showPassword)
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1">
            Validating reset token...
          </Typography>
        </Card>
      </Box>
    )
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ borderRadius: 4, textAlign: 'center' }}>
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
                  <Security sx={{ fontSize: 40 }} />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Invalid Reset Link
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {errors.token || 'This password reset link is invalid or has expired. Please request a new one.'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    startIcon={<ArrowBack />}
                  >
                    Back to Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Request New Link
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Success state
  if (resetSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ borderRadius: 4, textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Password Reset Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your password has been successfully reset. You can now login with your new password.
                </Typography>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Redirecting to login page...
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    )
  }

  // Main reset password form
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                textAlign: 'center',
                py: 4
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {APP_CONFIG.NAME}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Create New Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose a strong password for your account
              </Typography>

              {/* Error Alert */}
              {errors.submit && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.submit}
                </Alert>
              )}

              {/* Reset Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword || 'Minimum 8 characters with uppercase, lowercase, and number'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                  autoComplete="new-password"
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleConfirmPassword}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    mb: 3,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                {/* Back to Login */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Remember your password?{' '}
                    <Link
                      component={RouterLink}
                      to="/login"
                      color="primary"
                      sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  )
}

export default ResetPassword
