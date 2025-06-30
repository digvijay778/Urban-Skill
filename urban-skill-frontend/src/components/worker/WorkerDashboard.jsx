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
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Work,
  Schedule,
  Star,
  TrendingUp,
  Payment,
  Person,
  Notifications,
  Settings,
  Support,
  CheckCircle,
  AccessTime,
  Cancel,
  Phone,
  Message,
  LocationOn,
  Visibility,
  Edit,
  Assignment,
  AccountBalanceWallet,
  BarChart,
  CalendarToday,
  Circle as OnlineStatus
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const WorkerDashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  // State management
  const [jobRequests, setJobRequests] = useState([])
  const [recentJobs, setRecentJobs] = useState([])
  const [earnings, setEarnings] = useState({})
  const [isOnline, setIsOnline] = useState(true)
  const [loading, setLoading] = useState(true)

  // Mock data (replace with API calls)
  const mockJobRequests = [
    {
      id: 1,
      serviceName: 'Deep Home Cleaning',
      customerName: 'Priya Sharma',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      location: 'Kota, Rajasthan',
      scheduledDate: '2025-06-27',
      scheduledTime: '10:00 AM',
      amount: 299,
      status: 'pending',
      requestTime: '2 hours ago',
      description: 'Need deep cleaning for 2BHK apartment',
      customerRating: 4.5
    },
    {
      id: 2,
      serviceName: 'Electrical Repair',
      customerName: 'Amit Singh',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      location: 'Kota, Rajasthan',
      scheduledDate: '2025-06-27',
      scheduledTime: '02:00 PM',
      amount: 450,
      status: 'pending',
      requestTime: '1 hour ago',
      description: 'Fan installation and wiring issue',
      customerRating: 4.8
    },
    {
      id: 3,
      serviceName: 'Home Cleaning',
      customerName: 'Sunita Patel',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      location: 'Kota, Rajasthan',
      scheduledDate: '2025-06-28',
      scheduledTime: '11:00 AM',
      amount: 199,
      status: 'accepted',
      requestTime: '3 hours ago',
      description: 'Regular house cleaning',
      customerRating: 4.2
    }
  ]

  const mockRecentJobs = [
    {
      id: 1,
      serviceName: 'Electrical Wiring',
      customerName: 'Rajesh Kumar',
      date: '2025-06-25',
      amount: 650,
      status: 'completed',
      rating: 5,
      review: 'Excellent work! Very professional and timely.'
    },
    {
      id: 2,
      serviceName: 'Home Cleaning',
      customerName: 'Meera Gupta',
      date: '2025-06-24',
      amount: 250,
      status: 'completed',
      rating: 4,
      review: 'Good service, satisfied with the cleaning.'
    },
    {
      id: 3,
      serviceName: 'Fan Installation',
      customerName: 'Vikash Sharma',
      date: '2025-06-23',
      amount: 300,
      status: 'completed',
      rating: 5,
      review: 'Quick and efficient service.'
    }
  ]

  const mockEarnings = {
    today: 450,
    thisWeek: 2150,
    thisMonth: 8750,
    totalEarnings: 45600,
    pendingPayments: 1200,
    completedJobs: 156,
    averageRating: 4.8,
    responseRate: 95
  }

  // Load dashboard data
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setJobRequests(mockJobRequests)
      setRecentJobs(mockRecentJobs)
      setEarnings(mockEarnings)
      setLoading(false)
    }, 1000)
  }, [])

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', icon: <AccessTime />, label: 'Pending' }
      case 'accepted':
        return { color: 'info', icon: <CheckCircle />, label: 'Accepted' }
      case 'in_progress':
        return { color: 'primary', icon: <Work />, label: 'In Progress' }
      case 'completed':
        return { color: 'success', icon: <CheckCircle />, label: 'Completed' }
      case 'cancelled':
        return { color: 'error', icon: <Cancel />, label: 'Cancelled' }
      default:
        return { color: 'default', icon: <Schedule />, label: 'Unknown' }
    }
  }

  // Handle job actions
  const handleAcceptJob = (jobId) => {
    setJobRequests(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status: 'accepted' } : job
      )
    )
  }

  const handleRejectJob = (jobId) => {
    setJobRequests(prev => prev.filter(job => job.id !== jobId))
  }

  const handleContactCustomer = (phone) => {
    window.open(`tel:${phone}`)
  }

  const handleMessageCustomer = (customerId) => {
    navigate(`/messages/${customerId}`)
  }

  const handleViewJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  const handleToggleOnlineStatus = () => {
    setIsOnline(!isOnline)
    // API call to update online status
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back, {user?.firstName}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your jobs and grow your business
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isOnline}
                  onChange={handleToggleOnlineStatus}
                  color="success"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <OnlineStatus color={isOnline ? 'success' : 'disabled'} />
                  <Typography variant="body2">
                    {isOnline ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Earnings Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Earnings Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        ₹{earnings.today}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Today
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        ₹{earnings.thisWeek}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This Week
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        ₹{earnings.thisMonth}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This Month
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        ₹{earnings.totalEarnings}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    New Job Requests ({jobRequests.filter(j => j.status === 'pending').length})
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate('/jobs')}
                    endIcon={<TrendingUp />}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                ) : jobRequests.length === 0 ? (
                  <Alert severity="info">
                    No new job requests. Stay online to receive more bookings!
                  </Alert>
                ) : (
                  <List>
                    {jobRequests.map((job, index) => {
                      const statusInfo = getStatusInfo(job.status)
                      return (
                        <React.Fragment key={job.id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 2,
                              '&:hover': { backgroundColor: 'action.hover' },
                              borderRadius: 2
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={job.customerAvatar} alt={job.customerName} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {job.serviceName}
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
                                    Customer: {job.customerName} ⭐ {job.customerRating}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    📍 {job.location}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    📅 {new Date(job.scheduledDate).toLocaleDateString()} at {job.scheduledTime}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    💬 {job.description}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold" color="primary">
                                    ₹{job.amount} • {job.requestTime}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                              {job.status === 'pending' && (
                                <>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAcceptJob(job.id)}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRejectJob(job.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {job.status === 'accepted' && (
                                <>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Phone />}
                                    onClick={() => handleContactCustomer(job.customerPhone)}
                                  >
                                    Call
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Message />}
                                    onClick={() => handleMessageCustomer(job.customerId)}
                                  >
                                    Message
                                  </Button>
                                </>
                              )}
                              <Button
                                size="small"
                                variant="text"
                                startIcon={<Visibility />}
                                onClick={() => handleViewJobDetails(job.id)}
                              >
                                Details
                              </Button>
                            </Box>
                          </ListItem>
                          {index < jobRequests.length - 1 && <Divider />}
                        </React.Fragment>
                      )
                    })}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Completed Jobs
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => navigate('/job-history')}
                    endIcon={<TrendingUp />}
                  >
                    View All
                  </Button>
                </Box>

                <List>
                  {recentJobs.map((job, index) => (
                    <React.Fragment key={job.id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {job.serviceName}
                              </Typography>
                              <Chip
                                label="Completed"
                                color="success"
                                size="small"
                                icon={<CheckCircle />}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Customer: {job.customerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Date: {new Date(job.date).toLocaleDateString()}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                <Typography variant="body2" fontWeight="bold">
                                  {job.rating}/5
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  - "{job.review}"
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          ₹{job.amount}
                        </Typography>
                      </ListItem>
                      {index < recentJobs.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
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
                      {user?.profession || 'Professional'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" fontWeight="bold">
                        {earnings.averageRating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({earnings.completedJobs} jobs)
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate('/worker/profile')}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Performance Stats
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Response Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {earnings.responseRate}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed Jobs
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {earnings.completedJobs}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                      ⭐ {earnings.averageRating}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pending Payments
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                      ₹{earnings.pendingPayments}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>
                
                <List dense>
                  <ListItem button onClick={() => navigate('/worker/schedule')}>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText primary="Manage Schedule" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/worker/earnings')}>
                    <ListItemIcon>
                      <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText primary="View Earnings" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/worker/analytics')}>
                    <ListItemIcon>
                      <BarChart />
                    </ListItemIcon>
                    <ListItemText primary="Analytics" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/worker/reviews')}>
                    <ListItemIcon>
                      <Star />
                    </ListItemIcon>
                    <ListItemText primary="Customer Reviews" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/worker/documents')}>
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText primary="Documents" />
                  </ListItem>
                  
                  <ListItem button onClick={() => navigate('/worker/support')}>
                    <ListItemIcon>
                      <Support />
                    </ListItemIcon>
                    <ListItemText primary="Support" />
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

export default WorkerDashboard
