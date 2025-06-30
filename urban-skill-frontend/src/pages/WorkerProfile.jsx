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
  Rating,
  Divider,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Skeleton,
  MenuItem,
  
} from '@mui/material'
import {
  Verified,
  Star,
  LocationOn,
  Phone,
  Email,
  Work,
  Schedule,
  CheckCircle,
  Message,
  BookOnline,
  Share,
  Favorite,
  FavoriteBorder,
  Report,
  ThumbUp,
  CalendarToday,
  AccessTime
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const WorkerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated } = useAuth()

  // State management
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  // Mock worker data (replace with API call)
  const mockWorker = {
    id: 1,
    name: 'Rajesh Kumar',
    profession: 'Master Electrician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop',
    rating: 4.9,
    totalReviews: 127,
    completedJobs: 245,
    experience: '8 years',
    location: 'Kota, Rajasthan',
    verified: true,
    online: true,
    responseTime: '10 mins',
    description: 'Experienced electrician specializing in residential and commercial electrical work. Licensed and insured with 8+ years of experience. Available for emergency services.',
    services: [
      'Electrical Wiring',
      'Circuit Installation',
      'Appliance Repair',
      'Safety Inspection',
      'Emergency Service',
      'Smart Home Setup'
    ],
    pricing: {
      hourlyRate: '₹299/hour',
      minimumCharge: '₹199',
      emergencyRate: '₹499/hour'
    },
    availability: {
      today: true,
      thisWeek: true,
      nextWeek: true
    },
    certifications: [
      'Licensed Electrician',
      'Safety Certified',
      'Smart Home Expert',
      'Emergency Response Trained'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'
    ],
    reviews: [
      {
        id: 1,
        customerName: 'Priya Sharma',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        comment: 'Excellent work! Rajesh fixed our electrical issue quickly and professionally. Highly recommended!',
        date: '2025-06-20',
        service: 'Electrical Wiring',
        helpful: 12
      },
      {
        id: 2,
        customerName: 'Amit Singh',
        customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        comment: 'Very professional and knowledgeable. Completed the smart home setup perfectly. Great service!',
        date: '2025-06-18',
        service: 'Smart Home Setup',
        helpful: 8
      },
      {
        id: 3,
        customerName: 'Sunita Patel',
        customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        rating: 4,
        comment: 'Good work and fair pricing. Arrived on time and explained everything clearly.',
        date: '2025-06-15',
        service: 'Circuit Installation',
        helpful: 5
      }
    ],
    workHistory: [
      {
        id: 1,
        title: 'Complete House Rewiring',
        description: 'Full electrical rewiring for 3BHK apartment',
        completedDate: '2025-06-22',
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=150&fit=crop']
      },
      {
        id: 2,
        title: 'Smart Home Installation',
        description: 'Smart switches and automation setup',
        completedDate: '2025-06-20',
        images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=150&fit=crop']
      }
    ]
  }

  // Load worker data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWorker(mockWorker)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleBookNow = () => {
    if (isAuthenticated) {
      setBookingDialogOpen(true)
    } else {
      navigate(`/login?redirect=/worker/${id}`)
    }
  }

  const handleMessage = () => {
    if (isAuthenticated) {
      setMessageDialogOpen(true)
    } else {
      navigate(`/login?redirect=/worker/${id}`)
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${worker.name} - ${worker.profession}`,
        text: worker.description,
        url: window.location.href
      })
    }
  }

  const handleReviewHelpful = (reviewId) => {
    // Handle review helpful action
    console.log('Review helpful:', reviewId)
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={120} height={120} />
                  <Skeleton variant="text" width={200} height={32} sx={{ mt: 2 }} />
                  <Skeleton variant="text" width={150} height={24} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Box>
      {/* Cover Image */}
      <Box
        sx={{
          height: 300,
          backgroundImage: `url(${worker.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', pb: 3 }}>
            <Avatar
              src={worker.avatar}
              alt={worker.name}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                mr: 3
              }}
            />
            <Box sx={{ color: 'white', flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mr: 2 }}>
                  {worker.name}
                </Typography>
                {worker.verified && (
                  <Verified sx={{ color: 'primary.light', fontSize: 28 }} />
                )}
                {worker.online && (
                  <Chip
                    label="Online"
                    size="small"
                    sx={{
                      ml: 1,
                      backgroundColor: 'success.main',
                      color: 'white'
                    }}
                  />
                )}
              </Box>
              <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                {worker.profession}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={worker.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {worker.rating} ({worker.totalReviews} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{worker.location}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={isFavorited ? <Favorite /> : <FavoriteBorder />}
                onClick={handleFavorite}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Share
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Quick Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<BookOnline />}
                    onClick={handleBookNow}
                    fullWidth
                  >
                    Book Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Message />}
                    onClick={handleMessage}
                    fullWidth
                  >
                    Send Message
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Professional Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed Jobs
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {worker.completedJobs}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Experience
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {worker.experience}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Response Time
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {worker.responseTime}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Pricing
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Hourly Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {worker.pricing.hourlyRate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Minimum Charge
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {worker.pricing.minimumCharge}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Emergency Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {worker.pricing.emergencyRate}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Availability
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Today</Typography>
                    <Chip
                      label={worker.availability.today ? 'Available' : 'Busy'}
                      size="small"
                      color={worker.availability.today ? 'success' : 'error'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">This Week</Typography>
                    <Chip
                      label={worker.availability.thisWeek ? 'Available' : 'Busy'}
                      size="small"
                      color={worker.availability.thisWeek ? 'success' : 'error'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Next Week</Typography>
                    <Chip
                      label={worker.availability.nextWeek ? 'Available' : 'Busy'}
                      size="small"
                      color={worker.availability.nextWeek ? 'success' : 'error'}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="auto"
              >
                <Tab label="Overview" />
                <Tab label="Reviews" />
                <Tab label="Portfolio" />
                <Tab label="About" />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Services */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Services Offered
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {worker.services.map((service, index) => (
                        <Chip
                          key={index}
                          label={service}
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Certifications & Skills
                    </Typography>
                    <List>
                      {worker.certifications.map((cert, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={cert} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Recent Work */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Recent Work
                    </Typography>
                    {worker.workHistory.map((work) => (
                      <Box key={work.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {work.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {work.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Completed on {new Date(work.completedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {work.images.map((image, idx) => (
                            <Box
                              key={idx}
                              component="img"
                              src={image}
                              alt={`Work ${idx + 1}`}
                              sx={{
                                width: 80,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Customer Reviews ({worker.totalReviews})
                    </Typography>
                    {worker.reviews.map((review) => (
                      <Box key={review.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={review.customerAvatar}
                            alt={review.customerName}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {review.customerName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.date).toLocaleDateString()}
                              </Typography>
                              <Chip label={review.service} size="small" variant="outlined" />
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {review.comment}
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<ThumbUp />}
                          onClick={() => handleReviewHelpful(review.id)}
                        >
                          Helpful ({review.helpful})
                        </Button>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Work Portfolio
                    </Typography>
                    <Grid container spacing={2}>
                      {worker.gallery.map((image, index) => (
                        <Grid size={{ xs: 6, md: 4 }} key={index}>
                          <Box
                            component="img"
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: 2,
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      About {worker.name}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                      {worker.description}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Professional Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Work sx={{ mr: 2, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Profession
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {worker.profession}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTime sx={{ mr: 2, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Experience
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {worker.experience}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {worker.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Verification
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              Verified Professional
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book {worker?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select your preferred date and time for the service
          </Typography>
          <TextField
            fullWidth
            label="Service Required"
            select
            sx={{ mb: 2 }}
          >
            {worker?.services.map((service) => (
              <MenuItem key={service} value={service}>
                {service}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Preferred Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Preferred Time"
            type="time"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            placeholder="Describe your requirements..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => navigate('/booking')}>
            Continue Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to {worker?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            sx={{ mb: 2 }}
            placeholder="What do you need help with?"
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            placeholder="Type your message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Send Message</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default WorkerProfile
