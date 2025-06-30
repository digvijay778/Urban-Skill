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
  Alert,
  useTheme,
  useMediaQuery,
  RadioGroup,
  FormControlLabel,
  Radio
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
  Verified,
  Work,
  Star
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'

const BookingForm = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  // Get pre-selected service and worker from URL params
  const preSelectedService = searchParams.get('service')
  const preSelectedWorker = searchParams.get('worker')

  // State management
  const [activeStep, setActiveStep] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [availableWorkers, setAvailableWorkers] = useState([])
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    workerId: '',
    date: '',
    time: '',
    address: user?.addresses?.[0] || '',
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
  const [services, setServices] = useState([])

  // Mock data
  const mockServices = [
    {
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
    },
    {
      id: 2,
      name: 'Electrical Repair',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      basePrice: 299,
      description: 'Expert electrical repairs and installations',
      duration: '1-2 hours',
      includes: [
        'Electrical troubleshooting',
        'Wiring repairs',
        'Switch and outlet installation',
        'Safety inspection',
        'Quality parts included'
      ]
    },
    {
      id: 3,
      name: 'Plumbing Service',
      icon: '🔧',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      basePrice: 199,
      description: 'Quick plumbing solutions for your home',
      duration: '1-2 hours',
      includes: [
        'Pipe repairs and installation',
        'Leak fixing',
        'Drain cleaning',
        'Faucet installation',
        'Emergency service available'
      ]
    }
  ]

  const mockWorkers = [
    {
      id: 1,
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviews: 89,
      experience: '5 years',
      verified: true,
      specialties: ['Deep Cleaning', 'Sanitization', 'Office Cleaning'],
      hourlyRate: 149,
      availability: ['today', 'tomorrow'],
      completedJobs: 156
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviews: 127,
      experience: '8 years',
      verified: true,
      specialties: ['Electrical Wiring', 'Appliance Repair', 'Safety Inspection'],
      hourlyRate: 299,
      availability: ['today', 'tomorrow'],
      completedJobs: 245
    },
    {
      id: 3,
      name: 'Amit Singh',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      reviews: 203,
      experience: '10 years',
      verified: true,
      specialties: ['Pipe Repair', 'Bathroom Fitting', 'Water Heater'],
      hourlyRate: 199,
      availability: ['tomorrow'],
      completedJobs: 312
    }
  ]

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ]

  const steps = ['Select Service', 'Choose Professional', 'Schedule & Details', 'Review & Payment']

  // Initialize data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/booking')
      return
    }

    // Load services and workers
    setServices(mockServices)
    setAvailableWorkers(mockWorkers)

    // Pre-select service if provided
    if (preSelectedService) {
      const service = mockServices.find(s => s.name.toLowerCase().includes(preSelectedService.toLowerCase()))
      if (service) {
        setSelectedService(service)
        setBookingData(prev => ({ ...prev, serviceId: service.id }))
        setActiveStep(1)
      }
    }

    // Pre-select worker if provided
    if (preSelectedWorker) {
      const worker = mockWorkers.find(w => w.name.toLowerCase().includes(preSelectedWorker.toLowerCase()))
      if (worker) {
        setSelectedWorker(worker)
        setBookingData(prev => ({ ...prev, workerId: worker.id }))
        if (selectedService) setActiveStep(2)
      }
    }
  }, [isAuthenticated, navigate, preSelectedService, preSelectedWorker, selectedService])

  // Calculate pricing
  useEffect(() => {
    if (selectedService && selectedWorker) {
      const basePrice = selectedService.basePrice
      const platformFee = Math.round(basePrice * 0.1)
      const discount = 0
      const totalAmount = basePrice + platformFee - discount

      setBookingData(prev => ({
        ...prev,
        totalAmount,
        platformFee,
        discount
      }))
    }
  }, [selectedService, selectedWorker])

  // Validate step
  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 0: // Service selection
        if (!selectedService) newErrors.service = 'Please select a service'
        break
      case 1: // Worker selection
        if (!selectedWorker) newErrors.worker = 'Please select a professional'
        break
      case 2: // Schedule & details
        if (!bookingData.date) newErrors.date = 'Please select a date'
        if (!bookingData.time) newErrors.time = 'Please select a time'
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

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setBookingData(prev => ({ ...prev, serviceId: service.id }))
    
    // Filter workers based on service
    const filteredWorkers = mockWorkers.filter(worker => 
      worker.specialties.some(specialty => 
        service.name.toLowerCase().includes(specialty.toLowerCase().split(' ')[0])
      )
    )
    setAvailableWorkers(filteredWorkers)
  }

  // Handle worker selection
  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker)
    setBookingData(prev => ({ ...prev, workerId: worker.id }))
  }

  // Handle input changes
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

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!validateStep(activeStep)) return

    setLoading(true)
    try {
      // Navigate to payment gateway
      navigate('/payment', {
        state: {
          bookingData: {
            ...bookingData,
            service: selectedService,
            worker: selectedWorker
          }
        }
      })
    } catch (error) {
      console.error('Booking submission failed:', error)[3]
      setErrors({ submit: 'Booking failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Service selection
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Select a Service
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the service you need
            </Typography>

            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid size={{ xs: 12, md: 6 }} key={service.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedService?.id === service.id ? 2 : 1,
                      borderColor: selectedService?.id === service.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.name}
                      sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 1, fontSize: '1.5rem' }}>
                          {service.icon}
                        </Typography>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {service.duration}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                      </Typography>

                      <Typography variant="h6" color="primary" fontWeight="bold">
                        Starting ₹{service.basePrice}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )

      case 1: // Worker selection
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Choose Your Professional
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select from our verified professionals
            </Typography>

            <Grid container spacing={3}>
              {availableWorkers.map((worker) => (
                <Grid size={{ xs: 12, md: 6 }} key={worker.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedWorker?.id === worker.id ? 2 : 1,
                      borderColor: selectedWorker?.id === worker.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => handleWorkerSelect(worker)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={worker.avatar}
                          alt={worker.name}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {worker.name}
                            </Typography>
                            {worker.verified && (
                              <Verified color="primary" fontSize="small" />
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Rating value={worker.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {worker.rating} ({worker.reviews} reviews)
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {worker.experience} • {worker.completedJobs} jobs completed
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Specialties:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {worker.specialties.slice(0, 3).map((specialty, index) => (
                            <Chip
                              key={index}
                              label={specialty}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ₹{worker.hourlyRate}/hour
                        </Typography>
                        <Chip
                          label={worker.availability.includes('today') ? 'Available Today' : 'Available Tomorrow'}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )

      case 2: // Schedule & details
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Schedule & Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              When and where do you need the service?
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
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Special Requirements (Optional)"
                  multiline
                  rows={3}
                  value={bookingData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Any specific requirements or instructions..."
                />
              </Grid>
            </Grid>
          </motion.div>
        )

      case 3: // Review & payment
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Review & Payment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review your booking details and choose payment method
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Booking Summary
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon><Work /></ListItemIcon>
                        <ListItemText
                          primary="Service"
                          secondary={selectedService?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Person /></ListItemIcon>
                        <ListItemText
                          primary="Professional"
                          secondary={selectedWorker?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CalendarToday /></ListItemIcon>
                        <ListItemText
                          primary="Date & Time"
                          secondary={`${bookingData.date} at ${bookingData.time}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><LocationOn /></ListItemIcon>
                        <ListItemText
                          primary="Address"
                          secondary={bookingData.address}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Price Breakdown
                    </Typography>

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

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Security color="success" />
                      <Typography variant="body2" color="success.main">
                        100% Safe & Secure
                      </Typography>
                    </Box>
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Book a Service
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Complete your booking in a few simple steps
        </Typography>
      </motion.div>

      {/* Stepper */}
      <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
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
                    {index === steps.length - 1 ? 'Proceed to Payment' : 'Next'}
                  </Button>
                </Box>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>

      {!isMobile && (
        <Box>
          {/* Error Alert */}
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          {/* Step Content */}
          {getStepContent(activeStep)}
          
          {/* Navigation Buttons */}
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
              {activeStep === steps.length - 1 ? 'Proceed to Payment' : 'Next'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default BookingForm
