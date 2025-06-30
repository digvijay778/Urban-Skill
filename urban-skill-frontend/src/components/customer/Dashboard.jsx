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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material'
import {
  BookOnline,
  History,
  Favorite,
  Star,
  LocationOn,
  Phone,
  Schedule,
  Payment,
  Person,
  Notifications,
  Settings,
  Support,
  TrendingUp,
  CheckCircle,
  AccessTime,
  Cancel,
  RateReview,
  Repeat
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import ServiceCard from '@components/common/ServiceCard'

const CustomerDashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  // State management
  const [recentBookings, setRecentBookings] = useState([])
  const [favoriteServices, setFavoriteServices] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data (replace with API calls)
  const mockRecentBookings = [
    {
      id: 1,
      serviceName: 'Deep Home Cleaning',
      workerName: 'Priya Sharma',
      workerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-25',
      time: '10:00 AM',
      status: 'completed',
      amount: 299,
      rating: 5,
      canReview: false,
      canRebook: true
    },
    {
      id: 2,
      serviceName: 'Electrical Repair',
      workerName: 'Rajesh Kumar',
      workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-26',
      time: '02:00 PM',
      status: 'in_progress',
      amount: 450,
      rating: null,
      canReview: false,
      canRebook: false
    },
    {
      id: 3,
      serviceName: 'Plumbing Service',
      workerName: 'Amit Singh',
      workerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      date: '2025-06-28',
      time: '11:00 AM',
      status: 'scheduled',
      amount: 350,
      rating: null,
      canReview: false,
      canRebook: false
    }
  ]

  const mockFavoriteServices = [
    {
      id: 1,
      name: 'Deep Home Cleaning',
      icon: '🧹',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
      startingPrice: '₹149',
      rating: 4.8,
      bookings: '50K+',
      isFavorited: true
    },
    {
      id: 2,
      name: 'AC Repair',
      icon: '❄️',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      startingPrice: '₹499',
      rating: 4.9,
      bookings: '20K+',
      isFavorited: true
    }
  ]

  const mockRecommendations = [
    {
      id: 3,
      name: 'Carpentry Services',
      icon: '🔨',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      startingPrice: '₹399',
      rating: 4.5,
      bookings: '15K+',
      trending: true
    }
  ]

  // Load dashboard data
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setRecentBookings(mockRecentBookings)
      setFavoriteServices(mockFavoriteServices)
      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 1000)
  }, [])

  // Get status color and icon
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

  // Handle quick actions
  const handleBookService = () => {
    navigate('/services')
  }

  const handleViewBookings = () => {
    navigate('/bookings')
  }

  const handleRateService = (bookingId) => {
    navigate(`/booking/${bookingId}/review`)
  }

  const handleRebookService = (booking) => {
    navigate(`/booking?service=${booking.serviceName}&worker=${booking.workerName}`)
  }

  const handleViewProfile = () => {
    navigate('/profile')
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.firstName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your bookings and discover new services
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<BookOnline />}
                      onClick={handleBookService}
                      sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                    >
                      Book Service
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<History />}
                      onClick={handleViewBookings}
                      sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                    >
                      My Bookings
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Favorite />}
                      onClick={() => navigate('/favorites')}
                      sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                    >
                      Favorites
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Support />}
                      onClick={() => navigate('/support')}
                      sx={{ py: 2, flexDirection: 'column', gap: 1 }}
                    >
                      Support
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Bookings
                  </Typography>
                  <Button
                    variant="text"
                    onClick={handleViewBookings}
                    endIcon={<TrendingUp />}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                ) : recentBookings.length === 0 ? (
                  <Alert severity="info">
                    No bookings yet. Book your first service to get started!
                  </Alert>
                ) : (
                  <List>
                    {recentBookings.map((booking, index) => {
                      const statusInfo = getStatusInfo(booking.status)
                      return (
                        <React.Fragment key={booking.id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 2,
                              '&:hover': { backgroundColor: 'action.hover' },
                              borderRadius: 2
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={booking.workerAvatar} alt={booking.workerName} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {booking.serviceName}
                                  </Typography>
                                  <Chip
                                    label={statusInfo.label}
                                    color={statusInfo.color}
                                    size="small"
                                    icon={statusInfo.icon}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Professional: {booking.workerName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold" color="primary">
                                    ₹{booking.amount}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                              {booking.canReview && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RateReview />}
                                  onClick={() => handleRateService(booking.id)}
                                >
                                  Rate
                                </Button>
                              )}
                              {booking.canRebook && (
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<Repeat />}
                                  onClick={() => handleRebookService(booking)}
                                >
                                  Rebook
                                </Button>
                              )}
                              {booking.rating && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                  <Typography variant="caption">
                                    {booking.rating}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </ListItem>
                          {index < recentBookings.length - 1 && <Divider />}
                        </React.Fragment>
                      )
                    })}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorite Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Your Favorite Services
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate('/favorites')}
                    endIcon={<Favorite />}
                  >
                    View All
                  </Button>
                </Box>

                {favoriteServices.length === 0 ? (
                  <Alert severity="info">
                    No favorite services yet. Add services to favorites for quick access!
                  </Alert>
                ) : (
                  <Grid container spacing={2}>
                    {favoriteServices.map((service) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={service.id}>
                        <ServiceCard service={service} variant="compact" />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Recommended for You
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Based on your booking history and preferences
                </Typography>

                <Grid container spacing={2}>
                  {recommendations.map((service) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={service.id}>
                      <ServiceCard service={service} variant="compact" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={user?.avatar}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    {user?.firstName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.phone}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={handleViewProfile}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Your Stats
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {recentBookings.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed Services
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {recentBookings.filter(b => b.status === 'completed').length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Favorite Services
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {favoriteServices.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      ₹{recentBookings.reduce((total, booking) => total + booking.amount, 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Links
                </Typography>
                
                <List dense>
                  <ListItem button onClick={() => navigate('/profile')}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/payment-methods')}>
                    <ListItemIcon>
                      <Payment />
                    </ListItemIcon>
                    <ListItemText primary="Payment Methods" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/addresses')}>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText primary="Saved Addresses" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/notifications')}>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/settings')}>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/help')}>
                    <ListItemIcon>
                      <Support />
                    </ListItemIcon>
                    <ListItemText primary="Help & Support" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CustomerDashboard
