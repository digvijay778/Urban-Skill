import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material'
import {
  Search,
  FilterList,
  CalendarToday,
  LocationOn,
  Star,
  CheckCircle,
  Schedule,
  Cancel,
  AccessTime,
  RateReview,
  Repeat,
  Receipt,
  Phone,
  Message,
  MoreVert,
  Download,
  Refresh
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'
import { usePagination } from '@components/common/Pagination'

const BookingHistory = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  // State management
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [activeTab, setActiveTab] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  })

  // Pagination
  const {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    offset
  } = usePagination(1, 10)

  // Mock booking data
  const mockBookings = [
    {
      id: 'BK001',
      serviceName: 'Deep Home Cleaning',
      serviceIcon: '🧹',
      workerName: 'Priya Sharma',
      workerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-25',
      time: '10:00 AM',
      status: 'completed',
      amount: 299,
      rating: 5,
      review: 'Excellent service! Very professional and thorough.',
      address: '123, Rajiv Gandhi Nagar, Kota',
      duration: '2 hours',
      completedAt: '2025-06-25T12:00:00Z',
      canReview: false,
      canRebook: true,
      canCancel: false
    },
    {
      id: 'BK002',
      serviceName: 'Electrical Repair',
      serviceIcon: '⚡',
      workerName: 'Rajesh Kumar',
      workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-26',
      time: '02:00 PM',
      status: 'in_progress',
      amount: 450,
      rating: null,
      review: null,
      address: '456, Industrial Area, Kota',
      duration: '1.5 hours',
      completedAt: null,
      canReview: false,
      canRebook: false,
      canCancel: true
    },
    {
      id: 'BK003',
      serviceName: 'Plumbing Service',
      serviceIcon: '🔧',
      workerName: 'Amit Singh',
      workerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-28',
      time: '11:00 AM',
      status: 'scheduled',
      amount: 350,
      rating: null,
      review: null,
      address: '789, Civil Lines, Kota',
      duration: '2 hours',
      completedAt: null,
      canReview: false,
      canRebook: false,
      canCancel: true
    },
    {
      id: 'BK004',
      serviceName: 'AC Repair',
      serviceIcon: '❄️',
      workerName: 'Suresh Patel',
      workerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-20',
      time: '03:00 PM',
      status: 'completed',
      amount: 650,
      rating: 4,
      review: 'Good service, fixed the AC quickly.',
      address: '321, Vigyan Nagar, Kota',
      duration: '1 hour',
      completedAt: '2025-06-20T16:00:00Z',
      canReview: false,
      canRebook: true,
      canCancel: false
    },
    {
      id: 'BK005',
      serviceName: 'Home Cleaning',
      serviceIcon: '🧹',
      workerName: 'Meera Gupta',
      workerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-15',
      time: '09:00 AM',
      status: 'cancelled',
      amount: 199,
      rating: null,
      review: null,
      address: '654, Dadabari, Kota',
      duration: '1.5 hours',
      completedAt: null,
      canReview: false,
      canRebook: true,
      canCancel: false
    }
  ]

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        // Simulate API call
        setTimeout(() => {
          setBookings(mockBookings)
          setFilteredBookings(mockBookings)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to load bookings:', error)[1]
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Filter bookings
  useEffect(() => {
    let filtered = [...bookings]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const bookingDate = new Date(booking.date)
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date)
            return bookingDate.toDateString() === now.toDateString()
          })
          break
        case 'this_week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date)
            return bookingDate >= weekStart
          })
          break
        case 'this_month':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date)
            return bookingDate.getMonth() === now.getMonth() && 
                   bookingDate.getFullYear() === now.getFullYear()
          })
          break
      }
    }

    // Tab filter
    switch (activeTab) {
      case 1: // Active
        filtered = filtered.filter(booking => 
          ['scheduled', 'in_progress'].includes(booking.status)
        )
        break
      case 2: // Completed
        filtered = filtered.filter(booking => booking.status === 'completed')
        break
      case 3: // Cancelled
        filtered = filtered.filter(booking => booking.status === 'cancelled')
        break
    }

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, statusFilter, dateFilter, activeTab])

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'success', icon: <CheckCircle />, label: 'Completed' }
      case 'in_progress':
        return { color: 'info', icon: <AccessTime />, label: 'In Progress' }
      case 'scheduled':
        return { color: 'warning', icon: <Schedule />, label: 'Scheduled' }
      case 'cancelled':
        return { color: 'error', icon: <Cancel />, label: 'Cancelled' }
      default:
        return { color: 'default', icon: <Schedule />, label: 'Unknown' }
    }
  }

  // Handle actions
  const handleRateService = (booking) => {
    setSelectedBooking(booking)
    setReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    try {
      // Submit review API call
      console.log('Submitting review:', reviewData)
      setReviewDialogOpen(false)
      setReviewData({ rating: 0, comment: '' })
      
      // Update booking with review
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, rating: reviewData.rating, review: reviewData.comment, canReview: false }
          : booking
      ))
    } catch (error) {
      console.error('Failed to submit review:', error)[1]
    }
  }

  const handleRebookService = (booking) => {
    navigate(`/booking?service=${booking.serviceName}&worker=${booking.workerName}`)
  }

  const handleContactWorker = (booking) => {
    // Implement contact worker functionality
    console.log('Contacting worker:', booking.workerName)
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      // Cancel booking API call
      console.log('Cancelling booking:', bookingId)
      
      // Update booking status
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled', canCancel: false }
          : booking
      ))
    } catch (error) {
      console.error('Failed to cancel booking:', error)[1]
    }
  }

  const handleDownloadReceipt = (booking) => {
    // Implement receipt download
    console.log('Downloading receipt for:', booking.id)
  }

  // Get current page bookings
  const currentBookings = filteredBookings.slice(offset, offset + itemsPerPage)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Booking History
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Track and manage all your service bookings
        </Typography>
      </motion.div>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Date</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="this_week">This Week</MenuItem>
                  <MenuItem value="this_month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setDateFilter('all')
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => console.log('Export bookings')}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`All (${bookings.length})`} />
        <Tab label={`Active (${bookings.filter(b => ['scheduled', 'in_progress'].includes(b.status)).length})`} />
        <Tab label={`Completed (${bookings.filter(b => b.status === 'completed').length})`} />
        <Tab label={`Cancelled (${bookings.filter(b => b.status === 'cancelled').length})`} />
      </Tabs>

      {/* Bookings List */}
      <AnimatePresence>
        {loading ? (
          <Box>
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" height={24} width="60%" />
                      <Skeleton variant="text" height={20} width="40%" />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                  <Skeleton variant="text" height={20} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : currentBookings.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No bookings found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'You haven\'t made any bookings yet'
                }
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/services')}
              >
                Book a Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {currentBookings.map((booking, index) => {
              const statusInfo = getStatusInfo(booking.status)
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ mb: 2, '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.1)' } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, fontSize: '1.5rem' }}>
                          {booking.serviceIcon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {booking.serviceName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Booking ID: {booking.id}
                          </Typography>
                        </Box>
                        <Chip
                          label={statusInfo.label}
                          color={statusInfo.color}
                          icon={statusInfo.icon}
                          size="small"
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar
                              src={booking.workerAvatar}
                              alt={booking.workerName}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Typography variant="body2">
                              <strong>Professional:</strong> {booking.workerName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {booking.address}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Amount:
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              ₹{booking.amount}
                            </Typography>
                          </Box>
                          
                          {booking.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                Your Rating:
                              </Typography>
                              <Rating value={booking.rating} readOnly size="small" />
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                            {booking.canReview && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<RateReview />}
                                onClick={() => handleRateService(booking)}
                              >
                                Rate
                              </Button>
                            )}
                            {booking.canRebook && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Repeat />}
                                onClick={() => handleRebookService(booking)}
                              >
                                Rebook
                              </Button>
                            )}
                            {booking.canCancel && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Receipt />}
                                onClick={() => handleDownloadReceipt(booking)}
                              >
                                Receipt
                              </Button>
                            )}
                            {['scheduled', 'in_progress'].includes(booking.status) && (
                              <>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Phone />}
                                  onClick={() => handleContactWorker(booking)}
                                >
                                  Call
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Message />}
                                  onClick={() => handleContactWorker(booking)}
                                >
                                  Chat
                                </Button>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>

                      {booking.review && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Your Review:
                          </Typography>
                          <Typography variant="body2">
                            "{booking.review}"
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </Box>
        )}
      </AnimatePresence>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            How was your experience with {selectedBooking?.workerName}?
          </Typography>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Overall Rating
            </Typography>
            <Rating
              value={reviewData.rating}
              onChange={(event, newValue) => setReviewData(prev => ({ ...prev, rating: newValue }))}
              size="large"
              sx={{ fontSize: '2rem' }}
            />
          </Box>

          <TextField
            fullWidth
            label="Write a review (optional)"
            multiline
            rows={4}
            value={reviewData.comment}
            onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Share your experience to help other customers..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={reviewData.rating === 0}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BookingHistory
