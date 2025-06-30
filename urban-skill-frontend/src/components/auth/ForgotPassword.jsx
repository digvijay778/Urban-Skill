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
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import {
  Email,
  Phone,
  Lock,
  CheckCircle,
  ArrowBack,
  Send,
  Refresh
} from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '@services/authService'
import { APP_CONFIG } from '@utils/constants'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State management
  const [activeStep, setActiveStep] = useState(0)
  const [resetMethod, setResetMethod] = useState('email') // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(false)

  const steps = ['Verify Identity', 'Enter OTP', 'Reset Password']

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  // Form validation
  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 0: // Identity verification
        if (resetMethod === 'email') {
          if (!formData.email) {
            newErrors.email = 'Email is required'
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
          }
        } else {
          if (!formData.phone) {
            newErrors.phone = 'Phone number is required'
          } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number'
          }
        }
        break

      case 1: // OTP verification
        if (!formData.otp) {
          newErrors.otp = 'OTP is required'
        } else if (formData.otp.length !== 6) {
          newErrors.otp = 'OTP must be 6 digits'
        }
        break

      case 2: // Password reset
        if (!formData.newPassword) {
          newErrors.newPassword = 'New password is required'
        } else if (formData.newPassword.length < 8) {
          newErrors.newPassword = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
          newErrors.newPassword = 'Password must contain uppercase, lowercase, and number'
        }

        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        break
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

  // Send reset code
  const handleSendResetCode = async () => {
    if (!validateStep(0)) return

    setLoading(true)
    setErrors({})

    try {
      const payload = resetMethod === 'email' 
        ? { email: formData.email }
        : { phone: formData.phone }

      const result = await authService.sendPasswordResetCode(payload, resetMethod)

      if (result.success) {
        setOtpSent(true)
        setActiveStep(1)
        setCountdown(60)
        setCanResend(false)
      } else {
        setErrors({ submit: result.error || 'Failed to send reset code' })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!validateStep(1)) return

    setLoading(true)
    setErrors({})

    try {
      const payload = {
        [resetMethod]: resetMethod === 'email' ? formData.email : formData.phone,
        otp: formData.otp
      }

      const result = await authService.verifyPasswordResetOTP(payload)

      if (result.success) {
        setActiveStep(2)
      } else {
        setErrors({ otp: result.error || 'Invalid OTP' })
      }
    } catch (error) {
      setErrors({ otp: 'OTP verification failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const handleResetPassword = async () => {
    if (!validateStep(2)) return

    setLoading(true)
    setErrors({})

    try {
      const payload = {
        [resetMethod]: resetMethod === 'email' ? formData.email : formData.phone,
        otp: formData.otp,
        newPassword: formData.newPassword
      }

      const result = await authService.resetPassword(payload)

      if (result.success) {
        setActiveStep(3) // Success step
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Password reset successfully. Please login with your new password.' }
          })
        }, 3000)
      } else {
        setErrors({ submit: result.error || 'Failed to reset password' })
      }
    } catch (error) {
      setErrors({ submit: 'Password reset failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true)
    setErrors({})

    try {
      const payload = resetMethod === 'email' 
        ? { email: formData.email }
        : { phone: formData.phone }

      const result = await authService.sendPasswordResetCode(payload, resetMethod)

      if (result.success) {
        setCountdown(60)
        setCanResend(false)
        setErrors({})
      } else {
        setErrors({ otp: result.error || 'Failed to resend OTP' })
      }
    } catch (error) {
      setErrors({ otp: 'Failed to resend OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1)
    } else {
      navigate('/login')
    }
  }

  // Format countdown
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Identity verification
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              How would you like to reset your password?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose your preferred method to receive the reset code
            </Typography>

            {/* Reset Method Selection */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant={resetMethod === 'email' ? 'contained' : 'outlined'}
                onClick={() => setResetMethod('email')}
                startIcon={<Email />}
                sx={{ py: 1.5 }}
              >
                Email
              </Button>
              <Button
                fullWidth
                variant={resetMethod === 'phone' ? 'contained' : 'outlined'}
                onClick={() => setResetMethod('phone')}
                startIcon={<Phone />}
                sx={{ py: 1.5 }}
              >
                Phone
              </Button>
            </Box>

            {/* Input Field */}
            {resetMethod === 'email' ? (
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
            ) : (
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
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
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSendResetCode}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </motion.div>
        )

      case 1: // OTP verification
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Enter Verification Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a 6-digit code to {resetMethod === 'email' ? formData.email : formData.phone}
            </Typography>

            <TextField
              fullWidth
              label="Enter 6-digit code"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
              error={!!errors.otp}
              helperText={errors.otp}
              inputProps={{ 
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {countdown > 0 ? `Resend code in ${formatCountdown(countdown)}` : 'Didn\'t receive the code?'}
              </Typography>
              <Button
                variant="text"
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                startIcon={<Refresh />}
              >
                Resend
              </Button>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleVerifyOTP}
              disabled={loading || !formData.otp || formData.otp.length !== 6}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </motion.div>
        )

      case 2: // Password reset
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Create New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a strong password for your account
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              type="password"
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
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
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
              }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleResetPassword}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </motion.div>
        )

      case 3: // Success
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
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
            </Box>
          </motion.div>
        )

      default:
        return null
    }
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
                Reset Password
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {APP_CONFIG.NAME}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Stepper */}
              {activeStep < 3 && (
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{!isMobile ? label : ''}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}

              {/* Error Alert */}
              {errors.submit && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.submit}
                </Alert>
              )}

              {/* Step Content */}
              {getStepContent(activeStep)}

              {/* Navigation */}
              {activeStep < 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={loading}
                  >
                    {activeStep === 0 ? 'Back to Login' : 'Back'}
                  </Button>
                </Box>
              )}

              {/* Login Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
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
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  )
}

export default ForgotPassword
