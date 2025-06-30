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
  Rating,
  TextField,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import {
  Star,
  ThumbUp,
  Send,
  CheckCircle,
  Person,
  Work,
  Schedule,
  MonetizationOn,
  Camera,
  Close,
  Verified
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'

const BookingReview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  // State management
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reviewData, setReviewData] = useState({
    overallRating: 0,
    professionalismRating: 0,
    qualityRating: 0,
    timelinessRating: 0,
    valueRating: 0,
    comment: '',
    wouldRecommend: false,
    highlights: [],
    photos: []
  })

  // Mock booking data
  const mockBooking = {
    id: 'BK123456',
    service: {
      name: 'Deep Home Cleaning',
      icon: '🧹',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop'
    },
    worker: {
      id: 'W001',
      name: 'Priya Sharma',
      profession: 'Cleaning Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    schedule: {
      date: '2025-06-26',
      time: '10:00 AM'
    },
    payment: {
      amount: 299
    },
    completedAt: '2025-06-26T13:30:00Z',
    canReview: true
  }

  // Review highlights options
  const highlightOptions = [
    { id: 'punctual', label: 'Punctual', icon: '⏰' },
    { id: 'professional', label: 'Professional', icon: '👔' },
    { id: 'thorough', label: 'Thorough Work', icon: '✨' },
    { id: 'friendly', label: 'Friendly', icon: '😊' },
    { id: 'clean', label: 'Left Place Clean', icon: '🧹' },
    { id: 'efficient', label: 'Efficient', icon: '⚡' },
    { id: 'skilled', label: 'Skilled', icon: '🛠️' },
    { id: 'respectful', label: 'Respectful', icon: '🙏' }
  ]

  // Load booking data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setBooking(mockBooking)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to load booking:', error)
        navigate('/bookings')
      }
    }

    loadBookingData()
  }, [id, navigate])

  // Handle rating changes
  const handleRatingChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle highlight toggle
  const handleHighlightToggle = (highlightId) => {
    setReviewData(prev => ({
      ...prev,
      highlights: prev.highlights.includes(highlightId)
        ? prev.highlights.filter(h => h !== highlightId)
        : [...prev.highlights, highlightId]
    }))
  }

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    // Handle photo upload logic
    console.log('Photos uploaded:', files)
  }

  // Handle review submission
  const handleSubmitReview = async () => {
    if (reviewData.overallRating === 0) {
      alert('Please provide an overall rating')
      return
    }

    setSubmitting(true)
    try {
      await apiService.post(`/bookings/${booking.id}/review`, {
        ...reviewData,
        workerId: booking.worker.id,
        serviceId: booking.service.id
      })
      
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    )
  }

  if (!booking || !booking.canReview) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Review not available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This booking cannot be reviewed or has already been reviewed.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/bookings')}>
          View My Bookings
        </Button>
      </Container>
    )
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'success.main',
              color: 'white',
              mb: 3
            }}
          >
            <CheckCircle sx={{ fontSize: 50 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Thank You! 🎉
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your review has been submitted successfully
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/bookings')}
            >
              View My Bookings
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/services')}
            >
              Book Another Service
            </Button>
          </Box>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Rate Your Experience ⭐
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Help others by sharing your experience with {booking.worker.name}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Service Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    component="img"
                    src={booking.service.image}
                    alt={booking.service.name}
                    sx={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {booking.service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(booking.schedule.date).toLocaleDateString()} at {booking.schedule.time}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={booking.worker.avatar}
                    alt={booking.worker.name}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {booking.worker.name}
                      </Typography>
                      {booking.worker.verified && (
                        <Verified color="primary" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {booking.worker.profession}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overall Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              How was your overall experience?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Rate your experience from 1 to 5 stars
            </Typography>
            
            <Rating
              value={reviewData.overallRating}
              onChange={(event, newValue) => handleRatingChange('overallRating', newValue)}
              size="large"
              sx={{
                fontSize: '3rem',
                mb: 2,
                '& .MuiRating-iconFilled': {
                  color: '#ffd700'
                }
              }}
            />
            
            <Box>
              {reviewData.overallRating === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Tap to rate
                </Typography>
              )}
              {reviewData.overallRating === 1 && (
                <Typography variant="h6" color="error.main">Poor</Typography>
              )}
              {reviewData.overallRating === 2 && (
                <Typography variant="h6" color="warning.main">Fair</Typography>
              )}
              {reviewData.overallRating === 3 && (
                <Typography variant="h6" color="info.main">Good</Typography>
              )}
              {reviewData.overallRating === 4 && (
                <Typography variant="h6" color="success.main">Very Good</Typography>
              )}
              {reviewData.overallRating === 5 && (
                <Typography variant="h6" color="success.main">Excellent</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Ratings */}
      {reviewData.overallRating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Rate Different Aspects
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Professionalism</Typography>
                    <Rating
                      value={reviewData.professionalismRating}
                      onChange={(event, newValue) => handleRatingChange('professionalismRating', newValue)}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Quality of Work</Typography>
                    <Rating
                      value={reviewData.qualityRating}
                      onChange={(event, newValue) => handleRatingChange('qualityRating', newValue)}
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Timeliness</Typography>
                    <Rating
                      value={reviewData.timelinessRating}
                      onChange={(event, newValue) => handleRatingChange('timelinessRating', newValue)}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1">Value for Money</Typography>
                    <Rating
                      value={reviewData.valueRating}
                      onChange={(event, newValue) => handleRatingChange('valueRating', newValue)}
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Highlights */}
      {reviewData.overallRating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                What did you like? (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select all that apply
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {highlightOptions.map((highlight) => (
                  <Chip
                    key={highlight.id}
                    label={`${highlight.icon} ${highlight.label}`}
                    variant={reviewData.highlights.includes(highlight.id) ? 'filled' : 'outlined'}
                    color={reviewData.highlights.includes(highlight.id) ? 'primary' : 'default'}
                    onClick={() => handleHighlightToggle(highlight.id)}
                    clickable
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Written Review */}
      {reviewData.overallRating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Share Your Experience (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tell others about your experience to help them make better decisions
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe your experience with the service and professional..."
                value={reviewData.comment}
                onChange={(e) => handleRatingChange('comment', e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Photo Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Photos (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Camera />}
                  component="label"
                >
                  Upload Photos
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </Button>
              </Box>

              {/* Recommendation */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reviewData.wouldRecommend}
                    onChange={(e) => handleRatingChange('wouldRecommend', e.target.checked)}
                    color="primary"
                  />
                }
                label="I would recommend this professional to others"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Submit Button */}
      {reviewData.overallRating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Ready to submit your review?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your review will help other customers and improve our services
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/bookings')}
                  disabled={submitting}
                >
                  Skip for Now
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  sx={{ px: 4 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Container>
  )
}

export default BookingReview
