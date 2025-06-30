import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material'
import {
  CheckCircle,
  Schedule,
  LocationOn,
  Phone,
  Message,
  Payment,
  Receipt,
  Star,
  Cancel,
  Edit,
  Download,
  Share,
  Refresh,
  AccessTime,
  Person,
  Work,
  CalendarToday,
  MonetizationOn,
  Security,
  Support,
  Verified
} from '@mui/icons-material'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'

const BookingConfirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  // Get booking data from navigation state or fetch from API
  const bookingFromState = location.state

  // State management
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Mock booking data (replace with API call)
  const mockBooking = {
    id: 'BK123456',
    status: 'confirmed',
    service: {
      name: 'Deep Home Cleaning',
      description: 'Professional deep cleaning for your entire home',
      icon: '🧹',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
      duration: '2-3 hours',
      includes: [
        'Deep cleaning of all rooms',
        'Kitchen and bathroom sanitization',
        'Floor mopping and vacuuming',
        'Dusting and surface cleaning',
        'Eco-friendly cleaning products'
      ]
    },
    worker: {
      id: 'W001',
      name: 'Priya Sharma',
      profession: 'Cleaning Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviews: 89,
      experience: '5 years',
      phone: '+91-9876543210',
      verified: true,
      specialties: ['Deep Cleaning', 'Sanitization', 'Office Cleaning']
    },
    customer: {
      name: user?.firstName + ' ' + user?.lastName,
      phone: user?.phone,
      email: user?.email
    },
    schedule: {
      date: '2025-06-28',
      time: '10:00 AM',
      estimatedDuration: '2-3 hours',
      estimatedCompletion: '1:00 PM'
    },
    address: {
      full: '123, Rajiv Gandhi Nagar, Near IIIT Kota, Kota, Rajasthan - 324005',
      landmark: 'Near IIIT Kota',
      instructions: 'Ring the bell twice. Blue gate house.'
    },
    payment: {
      method: 'Online Payment',
      status: 'paid',
      transactionId: 'TXN789123456',
      amount: {
        service: 149,
        platformFee: 15,
        taxes: 12,
        discount: 0,
        total: 176
      },
      paidAt: '2025-06-26T14:30:00Z'
    },
    timeline: [
      {
        status: 'booking_placed',
        title: 'Booking Placed',
        description: 'Your booking has been successfully placed',
        timestamp: '2025-06-26T14:30:00Z',
        completed: true
      },
      {
        status: 'payment_confirmed',
        title: 'Payment Confirmed',
        description: 'Payment of ₹176 has been processed successfully',
        timestamp: '2025-06-26T14:31:00Z',
        completed: true
      },
      {
        status: 'professional_assigned',
        title: 'Professional Assigned',
        description: 'Priya Sharma has been assigned to your booking',
        timestamp: '2025-06-26T14:35:00Z',
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Booking Confirmed',
        description: 'Professional has confirmed the appointment',
        timestamp: '2025-06-26T15:00:00Z',
        completed: true
      },
      {
        status: 'in_progress',
        title: 'Service in Progress',
        description: 'Professional has started the service',
        timestamp: null,
        completed: false
      },
      {
        status: 'completed',
        title: 'Service Completed',
        description: 'Service has been completed successfully',
        timestamp: null,
        completed: false
      }
    ],
    createdAt: '2025-06-26T14:30:00Z',
    canCancel: true,
    canReschedule: true,
    cancellationPolicy: 'Free cancellation up to 2 hours before service time'
  }

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        if (bookingFromState) {
          // Use data from navigation state
          setBooking(mockBooking)
        } else {
          // Fetch from API
          const response = await apiService.get(`/bookings/${id}`)
          setBooking(response.booking)
        }
      } catch (error) {
        console.error('Failed to load booking:', error)
        // Handle error - maybe redirect to bookings list
      } finally {
        setLoading(false)
      }
    }

    loadBookingData()
  }, [id, bookingFromState])

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: 'success', icon: <CheckCircle />, label: 'Confirmed', message: 'Your booking is confirmed!' }
      case 'in_progress':
        return { color: 'info', icon: <Work />, label: 'In Progress', message: 'Service is currently in progress' }
      case 'completed':
        return { color: 'success', icon: <CheckCircle />, label: 'Completed', message: 'Service completed successfully!' }
      case 'cancelled':
        return { color: 'error', icon: <Cancel />, label: 'Cancelled', message: 'Booking has been cancelled' }
      default:
        return { color: 'warning', icon: <Schedule />, label: 'Pending', message: 'Waiting for confirmation' }
    }
  }

  // Handle actions
  const handleContactWorker = () => {
    window.open(`tel:${booking.worker.phone}`)
  }

  const handleMessageWorker = () => {
    navigate(`/messages/${booking.worker.id}`)
  }

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) return

    setActionLoading(true)
    try {
      await apiService.post(`/bookings/${booking.id}/cancel`, {
        reason: cancelReason
      })
      
      setBooking(prev => ({ ...prev, status: 'cancelled' }))
      setCancelDialogOpen(false)
      setCancelReason('')
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRescheduleBooking = async () => {
    if (!newDate || !newTime) return

    setActionLoading(true)
    try {
      await apiService.post(`/bookings/${booking.id}/reschedule`, {
        date: newDate,
        time: newTime
      })
      
      setBooking(prev => ({
        ...prev,
        schedule: { ...prev.schedule, date: newDate, time: newTime }
      }))
      setRescheduleDialogOpen(false)
      setNewDate('')
      setNewTime('')
    } catch (error) {
      console.error('Failed to reschedule booking:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    console.log('Downloading receipt...')
  }

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Urban Skill Booking',
        text: `Booking confirmed for ${booking.service.name} on ${new Date(booking.schedule.date).toLocaleDateString()}`,
        url: window.location.href
      })
    }
  }

  const handleRateService = () => {
    navigate(`/booking/${booking.id}/review`)
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (!booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Booking not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/bookings')}>
          View My Bookings
        </Button>
      </Container>
    )
  }

  const statusInfo = getStatusInfo(booking.status)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette[statusInfo.color].light}20 0%, ${theme.palette[statusInfo.color].main}10 100%)`,
            border: `1px solid ${theme.palette[statusInfo.color].light}`,
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: `${statusInfo.color}.main`,
                color: 'white',
                mb: 2
              }}
            >
              {statusInfo.icon}
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {statusInfo.message}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Booking ID: {booking.id}
            </Typography>
            <Chip
              label={statusInfo.label}
              color={statusInfo.color}
              size="large"
              icon={statusInfo.icon}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadReceipt}
            >
              Download Receipt
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShareBooking}
            >
              Share
            </Button>
            {booking.status === 'completed' && (
              <Button
                variant="contained"
                startIcon={<Star />}
                onClick={handleRateService}
              >
                Rate Service
              </Button>
            )}
          </Box>
        </Paper>
      </motion.div>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Service Details
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    component="img"
                    src={booking.service.image}
                    alt={booking.service.name}
                    sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 2, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {booking.service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {booking.service.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.service.description}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  What's Included:
                </Typography>
                <List dense>
                  {booking.service.includes.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Assigned Professional
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={booking.worker.avatar}
                    alt={booking.worker.name}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {booking.worker.name}
                      </Typography>
                      {booking.worker.verified && (
                        <Verified color="primary" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {booking.worker.profession} • {booking.worker.experience}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2">
                        {booking.worker.rating} ({booking.worker.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    onClick={handleContactWorker}
                    fullWidth
                  >
                    Call Professional
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Message />}
                    onClick={handleMessageWorker}
                    fullWidth
                  >
                    Send Message
                  </Button>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Specialties:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {booking.worker.specialties.map((specialty, index) => (
                    <Chip
                      key={index}
                      label={specialty}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Booking Timeline
                </Typography>
                
                <Stepper orientation="vertical">
                  {booking.timeline.map((step, index) => (
                    <Step key={index} active={step.completed} completed={step.completed}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: step.completed ? 'success.main' : 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}
                          >
                            {step.completed ? <CheckCircle sx={{ fontSize: 16 }} /> : index + 1}
                          </Box>
                        )}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {step.title}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                        {step.timestamp && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(step.timestamp).toLocaleString()}
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Schedule Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Schedule Information
                </Typography>
                
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date"
                      secondary={new Date(booking.schedule.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary="Time"
                      secondary={`${booking.schedule.time} (${booking.schedule.estimatedDuration})`}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={booking.address.full}
                    />
                  </ListItem>
                </List>

                {(booking.canCancel || booking.canReschedule) && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {booking.canReschedule && (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setRescheduleDialogOpen(true)}
                        fullWidth
                      >
                        Reschedule
                      </Button>
                    )}
                    {booking.canCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => setCancelDialogOpen(true)}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Payment Details
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Payment sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    Payment Successful
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID: {booking.payment.transactionId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paid on: {new Date(booking.payment.paidAt).toLocaleString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Service Charge</Typography>
                  <Typography variant="body2">₹{booking.payment.amount.service}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Platform Fee</Typography>
                  <Typography variant="body2">₹{booking.payment.amount.platformFee}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Taxes</Typography>
                  <Typography variant="body2">₹{booking.payment.amount.taxes}</Typography>
                </Box>

                {booking.payment.amount.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main">Discount</Typography>
                    <Typography variant="body2" color="success.main">-₹{booking.payment.amount.discount}</Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total Paid</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{booking.payment.amount.total}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Need Help?
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Our support team is here to help you 24/7
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Support />}
                  onClick={() => navigate('/support')}
                  sx={{ mb: 2 }}
                >
                  Contact Support
                </Button>

                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                  <Typography variant="caption">
                    {booking.cancellationPolicy}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Are you sure you want to cancel this booking? Please provide a reason for cancellation.
          </Typography>
          <TextField
            fullWidth
            label="Cancellation Reason"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please tell us why you're cancelling..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Booking
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
            disabled={!cancelReason.trim() || actionLoading}
          >
            {actionLoading ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onClose={() => setRescheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a new date and time for your service
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="New Date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="New Time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRescheduleBooking}
            disabled={!newDate || !newTime || actionLoading}
          >
            {actionLoading ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BookingConfirmation
