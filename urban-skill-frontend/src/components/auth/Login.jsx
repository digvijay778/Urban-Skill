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
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Facebook,
  Phone,
  Sms,
  Timer
} from '@mui/icons-material'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { authService } from '@services/authService'
import { APP_CONFIG } from '@utils/constants'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { login, isAuthenticated } = useAuth()

  // State management
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState('email') // 'email', 'phone', 'otp'
  
  // OTP specific states
  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // OTP Timer countdown
  useEffect(() => {
    let interval = null
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => {
          if (timer <= 1) {
            setCanResendOtp(true)
            return 0
          }
          return timer - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    } else if (loginMethod === 'phone') {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number'
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    } else if (loginMethod === 'otp') {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle OTP login flow
  const handleOtpLogin = async () => {
    if (!validateForm()) return

    setOtpLoading(true)
    setErrors({})

    try {
      // Send OTP to phone number
      const result = await authService.sendOTP(formData.phone, 'login')
      
      if (result.success) {
        setOtpSent(true)
        setOtpDialogOpen(true)
        setOtpTimer(60) // 60 seconds countdown
        setCanResendOtp(false)
      } else {
        setErrors({ phone: result.error || 'Failed to send OTP' })
      }
    } catch (error) {
      setErrors({ phone: 'Failed to send OTP. Please try again.' })
    } finally {
      setOtpLoading(false)
    }
  }

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!formData.otp) {
      setErrors({ otp: 'Please enter the OTP' })
      return
    }

    if (formData.otp.length !== 6) {
      setErrors({ otp: 'OTP must be 6 digits' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Verify OTP and login
      const verifyResult = await authService.verifyOTP(formData.phone, formData.otp, 'login')
      
      if (verifyResult.success) {
        // Login with phone number after OTP verification
        const loginResult = await login({
          phone: formData.phone,
          otpVerified: true,
          rememberMe: formData.rememberMe
        })

        if (loginResult.success) {
          setOtpDialogOpen(false)
          // Redirect will be handled by useEffect
        } else {
          setErrors({ otp: loginResult.error || 'Login failed after OTP verification' })
        }
      } else {
        setErrors({ otp: verifyResult.error || 'Invalid OTP' })
      }
    } catch (error) {
      setErrors({ otp: 'OTP verification failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    setOtpLoading(true)
    setErrors({})

    try {
      const result = await authService.sendOTP(formData.phone, 'login')
      
      if (result.success) {
        setOtpTimer(60)
        setCanResendOtp(false)
        setErrors({})
      } else {
        setErrors({ otp: result.error || 'Failed to resend OTP' })
      }
    } catch (error) {
      setErrors({ otp: 'Failed to resend OTP. Please try again.' })
    } finally {
      setOtpLoading(false)
    }
  }

  // Handle regular form submission (email/phone + password)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (loginMethod === 'otp') {
      handleOtpLogin()
      return
    }
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const credentials = loginMethod === 'email' 
        ? { email: formData.email, password: formData.password, rememberMe: formData.rememberMe }
        : { phone: formData.phone, password: formData.password, rememberMe: formData.rememberMe }

      const result = await login(credentials)

      if (result.success) {
        // Redirect will be handled by useEffect
      } else {
        setErrors({ submit: result.error || 'Login failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
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

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
  }

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Sign in to {APP_CONFIG.NAME}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Login Method Toggle */}
              <Box sx={{ display: 'flex', mb: 3, backgroundColor: 'grey.100', borderRadius: 2, p: 0.5 }}>
                <Button
                  fullWidth
                  variant={loginMethod === 'email' ? 'contained' : 'text'}
                  onClick={() => setLoginMethod('email')}
                  sx={{ 
                    borderRadius: 1.5,
                    color: loginMethod === 'email' ? 'white' : 'text.primary',
                    fontSize: '0.8rem'
                  }}
                >
                  Email
                </Button>
                <Button
                  fullWidth
                  variant={loginMethod === 'phone' ? 'contained' : 'text'}
                  onClick={() => setLoginMethod('phone')}
                  sx={{ 
                    borderRadius: 1.5,
                    color: loginMethod === 'phone' ? 'white' : 'text.primary',
                    fontSize: '0.8rem'
                  }}
                >
                  Phone
                </Button>
                <Button
                  fullWidth
                  variant={loginMethod === 'otp' ? 'contained' : 'text'}
                  onClick={() => setLoginMethod('otp')}
                  sx={{ 
                    borderRadius: 1.5,
                    color: loginMethod === 'otp' ? 'white' : 'text.primary',
                    fontSize: '0.8rem'
                  }}
                >
                  OTP
                </Button>
              </Box>

              {/* Error Alert */}
              {errors.submit && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.submit}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit}>
                {loginMethod === 'email' ? (
                  <>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      autoComplete="email"
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={!!errors.password}
                      helperText={errors.password}
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
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      autoComplete="current-password"
                    />
                  </>
                ) : loginMethod === 'phone' ? (
                  <>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      placeholder="Enter 10-digit phone number"
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={!!errors.password}
                      helperText={errors.password}
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
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      autoComplete="current-password"
                    />
                  </>
                ) : (
                  // OTP Login
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone || 'We will send you a 6-digit OTP'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    placeholder="Enter 10-digit phone number"
                  />
                )}

                {/* Remember Me & Forgot Password */}
                {loginMethod !== 'otp' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.rememberMe}
                          onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Remember me"
                    />
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      color="primary"
                      sx={{ textDecoration: 'none', fontSize: '0.875rem' }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || otpLoading}
                  startIcon={loginMethod === 'otp' ? <Sms /> : null}
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
                  {loading || otpLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : loginMethod === 'otp' ? (
                    'Send OTP'
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Divider */}
                <Divider sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    or continue with
                  </Typography>
                </Divider>

                {/* Social Login Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google />}
                    onClick={() => handleSocialLogin('google')}
                    sx={{ py: 1.5 }}
                  >
                    Google
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Facebook />}
                    onClick={() => handleSocialLogin('facebook')}
                    sx={{ py: 1.5 }}
                  >
                    Facebook
                  </Button>
                </Box>

                {/* Sign Up Link */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      color="primary"
                      sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Professional Sign Up */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
              Are you a service professional?{' '}
              <Link
                component={RouterLink}
                to="/register?role=worker"
                sx={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                Join as Professional
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Container>

      {/* OTP Verification Dialog */}
      <Dialog 
        open={otpDialogOpen} 
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Sms sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">
            Verify OTP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter the 6-digit code sent to {formData.phone}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            label="Enter OTP"
            value={formData.otp}
            onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={!!errors.otp}
            helperText={errors.otp}
            inputProps={{ 
              maxLength: 6,
              style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
            }}
            sx={{ mb: 2 }}
          />

          {/* Timer and Resend */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Timer sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {otpTimer > 0 ? `Resend in ${formatTimer(otpTimer)}` : 'OTP expired'}
              </Typography>
            </Box>
            
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={!canResendOtp || otpLoading}
              size="small"
            >
              {otpLoading ? <CircularProgress size={16} /> : 'Resend OTP'}
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOtpDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleOtpVerification}
            disabled={loading || !formData.otp || formData.otp.length !== 6}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Verify & Login'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Login
