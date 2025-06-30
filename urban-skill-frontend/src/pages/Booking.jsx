import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Avatar,
  Rating,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  Person,
  CreditCard,
  CheckCircle,
  Schedule,
  Home,
  Phone,
  Email,
  Payment,
  Security,
  Verified
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const Booking = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  // State management
  const [activeStep, setActiveStep] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [bookingData, setBookingData] = useState({
    serviceId: searchParams.get('service') || '',
    workerId: searchParams.get('worker') || '',
    date: '',
    time: '',
    address: '',
    phone: user?.phone || '',
    email: user?.email || '',
    requirements: '',
    paymentMethod: 'online',
    totalAmount: 0,
    platformFee: 0,
    discount: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Mock data (replace with API calls)
  const mockService = {
    id: 1,
    name: 'Deep Home Cleaning',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
    basePrice: 149,
    description: 'Professional deep cleaning for your entire home',
    duration: '2-3 hours',
    includes: [
      'Deep cleaning of all rooms',
      'Kitchen and bathroom sanitization',
      'Floor mopping and vacuuming',
      'Dusting and surface cleaning',
      'Eco-friendly cleaning products'
    ]
  }

  const mockWorker = {
    id: 1,
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviews: 89,
    experience: '5 years',
    verified: true,
    specialties: ['Deep Cleaning', 'Sanitization', 'Office Cleaning']
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ]

  const steps = [
    'Service Details',
    'Date & Time',
    'Address & Contact',
    'Payment & Confirmation'
  ]

  // Initialize data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/booking')
      return
    }

    // Load service and worker data
    setSelectedService(mockService)
    setSelectedWorker(mockWorker)
    
    // Calculate pricing
    calculatePricing()
  }, [isAuthenticated, navigate])

  const calculatePricing = () => {
    const basePrice = mockService.basePrice
    const platformFee = Math.round(basePrice * 0.1) // 10% platform fee
    const discount = 0 // Apply any discounts
    const totalAmount = basePrice + platformFee - discount

    setBookingData(prev => ({
      ...prev,
      totalAmount,
      platformFee,
      discount
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1: // Date & Time
        if (!bookingData.date) newErrors.date = 'Please select a date'
        if (!bookingData.time) newErrors.time = 'Please select a time'
        break
      case 2: // Address & Contact
        if (!bookingData.address) newErrors.address = 'Please enter your address'
        if (!bookingData.phone) newErrors.phone = 'Please enter your phone number'
        if (!bookingData.email) newErrors.email = 'Please enter your email'
        break
      case 3: // Payment
        if (!bookingData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleBookingSubmit = async () => {
    if (!validateStep(activeStep)) return

    setLoading(true)
    try {
      // Simulate API call for booking creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to confirmation page
      navigate('/booking/confirmation/123', {
        state: { bookingData, service: selectedService, worker: selectedWorker }
      })
    } catch (error) {
      console.error('Booking failed:', error)
      setErrors({ submit: 'Booking failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Service Details
                </Typography>
                
                {selectedService && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        component="img"
                        src={selectedService.image}
                        alt={selectedService.name}
                        sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 2, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedService.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {selectedService.duration}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ₹{selectedService.basePrice}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      What's Included:
                    </Typography>
                    <List dense>
                      {selectedService.includes.map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>

                    <TextField
                      fullWidth
                      label="Special Requirements (Optional)"
                      multiline
                      rows={3}
                      value={bookingData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="Any specific requirements or instructions..."
                      sx={{ mt: 2 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Select Date & Time
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Preferred Date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      error={!!errors.date}
                      helperText={errors.date}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!errors.time}>
                      <InputLabel>Preferred Time</InputLabel>
                      <Select
                        value={bookingData.time}
                        label="Preferred Time"
                        onChange={(e) => handleInputChange('time', e.target.value)}
                      >
                        {timeSlots.map((slot) => (
                          <MenuItem key={slot} value={slot}>
                            {slot}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {selectedWorker && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                      Assigned Professional
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={selectedWorker.avatar} sx={{ width: 50, height: 50, mr: 2 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {selectedWorker.name}
                          </Typography>
                          {selectedWorker.verified && (
                            <Verified color="primary" fontSize="small" />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={selectedWorker.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2">
                            {selectedWorker.rating} ({selectedWorker.reviews} reviews)
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {selectedWorker.experience} experience
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Address & Contact Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Service Address"
                      multiline
                      rows={3}
                      value={bookingData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete address where service is required"
                      error={!!errors.address}
                      helperText={errors.address}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    The professional will contact you 30 minutes before arrival to confirm the appointment.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Payment Method
                    </Typography>

                    <RadioGroup
                      value={bookingData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    >
                      <FormControlLabel
                        value="online"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCard sx={{ mr: 1 }} />
                            <Box>
                              <Typography variant="body1">Pay Online</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Credit/Debit Card, UPI, Net Banking
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Payment sx={{ mr: 1 }} />
                            <Box>
                              <Typography variant="body1">Pay After Service</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Cash payment to the professional
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </RadioGroup>

                    <Box sx={{ mt: 3, p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Security color="success" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          100% Safe & Secure
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Your payment information is encrypted and secure. We never store your card details.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Booking Summary
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Service
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedService?.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {bookingData.date} at {bookingData.time}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Professional
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedWorker?.name}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Service Charge</Typography>
                      <Typography variant="body2">₹{selectedService?.basePrice}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Platform Fee</Typography>
                      <Typography variant="body2">₹{bookingData.platformFee}</Typography>
                    </Box>

                    {bookingData.discount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">Discount</Typography>
                        <Typography variant="body2" color="success.main">-₹{bookingData.discount}</Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ₹{bookingData.totalAmount}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleBookingSubmit}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </Button>

                    {errors.submit && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {errors.submit}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
        Book Your Service
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Complete your booking in a few simple steps
      </Typography>

      <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            {isMobile && (
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {getStepContent(index)}
                </Box>
                <Box>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleBookingSubmit : handleNext}
                    disabled={loading}
                  >
                    {index === steps.length - 1 ? 'Confirm Booking' : 'Next'}
                  </Button>
                </Box>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>

      {!isMobile && (
        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              size="large"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleBookingSubmit : handleNext}
              disabled={loading}
              size="large"
            >
              {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default Booking
