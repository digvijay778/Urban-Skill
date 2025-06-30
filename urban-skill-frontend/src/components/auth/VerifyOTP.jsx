import React, { useState, useEffect, useRef } from 'react'
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
  useTheme,
  useMediaQuery,
  CircularProgress,
  Grid
} from '@mui/material'
import {
  Sms,
  Timer,
  CheckCircle,
  ArrowBack,
  Refresh,
  Phone,
  Email
} from '@mui/icons-material'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '@services/authService'
import { useAuth } from '@context/AuthContext'
import { APP_CONFIG } from '@utils/constants'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { login } = useAuth()

  // Get data from navigation state
  const { 
    contact, 
    contactType = 'phone', 
    purpose = 'registration',
    userData 
  } = location.state || {}

  // Refs for OTP inputs
  const otpRefs = useRef([])

  // State management
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  // Redirect if no contact info
  useEffect(() => {
    if (!contact) {
      navigate('/login')
    }
  }, [contact, navigate])

  // Countdown timer
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

  // Auto-focus first input
  useEffect(() => {
    if (otpRefs.current[0]) {
      otpRefs.current[0].focus()
    }
  }, [])

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }))
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && !loading) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  // Handle backspace
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (event) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text/plain')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    
    if (digits.length === 6) {
      const newOtp = digits.split('')
      setOtp(newOtp)
      
      // Focus last input
      otpRefs.current[5]?.focus()
      
      // Auto-verify
      handleVerifyOTP(digits)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter complete 6-digit OTP' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const payload = {
        [contactType]: contact,
        otp: otpCode,
        purpose
      }

      const result = await authService.verifyOTP(payload)

      if (result.success) {
        setVerificationSuccess(true)

        // Handle different purposes
        if (purpose === 'registration') {
          // Complete registration with verified contact
          const registrationResult = await authService.completeRegistration({
            ...userData,
            [`${contactType}Verified`]: true,
            otp: otpCode
          })

          if (registrationResult.success) {
            // Auto-login after successful registration
            await login({
              [contactType]: contact,
              otpVerified: true
            })
          } else {
            setErrors({ submit: registrationResult.error || 'Registration failed' })
            setVerificationSuccess(false)
          }
        } else if (purpose === 'login') {
          // Complete OTP login
          const loginResult = await login({
            [contactType]: contact,
            otpVerified: true
          })

          if (!loginResult.success) {
            setErrors({ submit: loginResult.error || 'Login failed' })
            setVerificationSuccess(false)
          }
        } else if (purpose === 'password_reset') {
          // Redirect to password reset with verified token
          navigate('/reset-password', {
            state: {
              contact,
              contactType,
              otpVerified: true,
              resetToken: result.resetToken
            }
          })
          return
        }

        // Redirect after successful verification
        setTimeout(() => {
          const redirectTo = location.state?.redirectTo || '/dashboard'
          navigate(redirectTo, { replace: true })
        }, 2000)

      } else {
        setErrors({ otp: result.error || 'Invalid OTP. Please try again.' })
      }
    } catch (error) {
      console.error('OTP verification error:', error)[1]
      setErrors({ otp: 'Verification failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true)
    setErrors({})

    try {
      const result = await authService.sendOTP(contact, purpose, contactType)

      if (result.success) {
        setCountdown(60)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        
        // Focus first input
        otpRefs.current[0]?.focus()
        
        // Show success message briefly
        setErrors({ success: 'OTP sent successfully!' })
        setTimeout(() => setErrors({}), 3000)
      } else {
        setErrors({ submit: result.error || 'Failed to resend OTP' })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to resend OTP. Please try again.' })
    } finally {
      setResendLoading(false)
    }
  }

  // Format countdown
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get contact display
  const getContactDisplay = () => {
    if (contactType === 'email') {
      return contact?.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    } else {
      return contact?.replace(/(\d{2})(\d{6})(\d{2})/, '$1******$3')
    }
  }

  // Success state
  if (verificationSuccess) {
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
                  Verification Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your {contactType} has been verified successfully.
                </Typography>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Redirecting...
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    )
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
              <Sms sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Verify OTP
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {APP_CONFIG.NAME}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center">
                Enter Verification Code
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                We've sent a 6-digit verification code to{' '}
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                  {contactType === 'email' ? <Email fontSize="small" /> : <Phone fontSize="small" />}
                  <strong>{getContactDisplay()}</strong>
                </Box>
              </Typography>

              {/* Error/Success Alerts */}
              {errors.otp && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.otp}
                </Alert>
              )}
              
              {errors.submit && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.submit}
                </Alert>
              )}

              {errors.success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {errors.success}
                </Alert>
              )}

              {/* OTP Input Fields */}
              <Grid container spacing={1} sx={{ mb: 4, justifyContent: 'center' }}>
                {otp.map((digit, index) => (
                  <Grid size={2} key={index}>
                    <TextField
                      inputRef={el => otpRefs.current[index] = el}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          padding: '16px 8px'
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Verify Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleVerifyOTP()}
                disabled={loading || otp.some(digit => !digit)}
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
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              {/* Resend Section */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {countdown > 0 ? `Resend in ${formatCountdown(countdown)}` : 'Didn\'t receive the code?'}
                  </Typography>
                </Box>
                
                <Button
                  variant="text"
                  onClick={handleResendOTP}
                  disabled={!canResend || resendLoading}
                  startIcon={resendLoading ? <CircularProgress size={16} /> : <Refresh />}
                  size="small"
                >
                  Resend OTP
                </Button>
              </Box>

              {/* Back Navigation */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Back to Login
                </Link>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  )
}

export default VerifyOTP
