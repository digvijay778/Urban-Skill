import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  BookOnline,
  Payment,
  Star,
  Work,
  LocalOffer,
  Security,
  Info,
  CheckCircle,
  Schedule,
  Delete,
  MarkAsUnread,
  MarkEmailRead,
  Settings,
  Clear,
  Refresh,
  Email,
  Sms,
  PhoneAndroid
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'

const Notifications = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()

  // State management
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      bookingUpdates: true,
      paymentConfirmations: true,
      promotions: false,
      reminders: true,
      reviews: true
    },
    sms: {
      bookingUpdates: true,
      paymentConfirmations: true,
      promotions: false,
      reminders: true,
      reviews: false
    },
    push: {
      bookingUpdates: true,
      paymentConfirmations: true,
      promotions: true,
      reminders: true,
      reviews: true
    }
  })

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your booking for Deep Home Cleaning has been confirmed for June 28, 2025 at 10:00 AM',
      timestamp: '2025-06-26T14:30:00Z',
      read: false,
      icon: <BookOnline />,
      color: 'success',
      actionUrl: '/bookings/BK123',
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment_successful',
      title: 'Payment Successful',
      message: 'Your payment of ₹299 for booking BK123 has been processed successfully',
      timestamp: '2025-06-26T14:25:00Z',
      read: false,
      icon: <Payment />,
      color: 'info',
      actionUrl: '/bookings/BK123',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'service_completed',
      title: 'Service Completed',
      message: 'Your electrical repair service has been completed. Please rate your experience.',
      timestamp: '2025-06-25T16:00:00Z',
      read: true,
      icon: <CheckCircle />,
      color: 'success',
      actionUrl: '/bookings/BK122/review',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'review_request',
      title: 'Rate Your Experience',
      message: 'How was your experience with Priya Sharma? Your feedback helps us improve.',
      timestamp: '2025-06-25T12:00:00Z',
      read: true,
      icon: <Star />,
      color: 'warning',
      actionUrl: '/bookings/BK121/review',
      priority: 'low'
    },
    {
      id: 5,
      type: 'worker_assigned',
      title: 'Professional Assigned',
      message: 'Rajesh Kumar has been assigned to your electrical repair booking',
      timestamp: '2025-06-24T10:15:00Z',
      read: true,
      icon: <Work />,
      color: 'info',
      actionUrl: '/worker/2',
      priority: 'medium'
    },
    {
      id: 6,
      type: 'promotion',
      title: 'Special Offer!',
      message: 'Get 20% off on your next home cleaning service. Use code CLEAN20',
      timestamp: '2025-06-23T09:00:00Z',
      read: true,
      icon: <LocalOffer />,
      color: 'primary',
      actionUrl: '/services?category=cleaning',
      priority: 'low'
    },
    {
      id: 7,
      type: 'reminder',
      title: 'Upcoming Service',
      message: 'Reminder: Your plumbing service is scheduled for tomorrow at 11:00 AM',
      timestamp: '2025-06-22T18:00:00Z',
      read: true,
      icon: <Schedule />,
      color: 'warning',
      actionUrl: '/bookings/BK124',
      priority: 'high'
    },
    {
      id: 8,
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from a different device. If this wasn\'t you, please secure your account.',
      timestamp: '2025-06-21T14:30:00Z',
      read: true,
      icon: <Security />,
      color: 'error',
      actionUrl: '/settings/security',
      priority: 'high'
    }
  ]

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      try {
        // Simulate API call
        setTimeout(() => {
          setNotifications(mockNotifications)
          setFilteredNotifications(mockNotifications)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to load notifications:', error)
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  // Filter notifications based on active tab
  useEffect(() => {
    let filtered = [...notifications]

    switch (activeTab) {
      case 1: // Unread
        filtered = filtered.filter(notification => !notification.read)
        break
      case 2: // Bookings
        filtered = filtered.filter(notification => 
          ['booking_confirmed', 'service_completed', 'worker_assigned', 'reminder'].includes(notification.type)
        )
        break
      case 3: // Payments
        filtered = filtered.filter(notification => 
          notification.type === 'payment_successful'
        )
        break
      case 4: // Promotions
        filtered = filtered.filter(notification => 
          notification.type === 'promotion'
        )
        break
    }

    setFilteredNotifications(filtered)
  }, [notifications, activeTab])

  // Get notification counts
  const getNotificationCounts = () => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      bookings: notifications.filter(n => 
        ['booking_confirmed', 'service_completed', 'worker_assigned', 'reminder'].includes(n.type)
      ).length,
      payments: notifications.filter(n => n.type === 'payment_successful').length,
      promotions: notifications.filter(n => n.type === 'promotion').length
    }
  }

  const counts = getNotificationCounts()

  // Handle notification actions
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // Navigate to action URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ))
  }

  const markAsUnread = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: false }
        : notification
    ))
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Handle notification settings
  const handleSettingChange = (channel, setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: value
      }
    }))
  }

  const saveNotificationSettings = async () => {
    try {
      // Save settings API call
      console.log('Saving notification settings:', notificationSettings)
      setSettingsOpen(false)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with your bookings and account activity
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setSettingsOpen(true)}
            >
              Settings
            </Button>
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={markAllAsRead}
              disabled={counts.unread === 0}
            >
              Mark All Read
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Clear />}
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
      >
        <Tab 
          label={
            <Badge badgeContent={counts.all} color="primary" max={99}>
              All
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={counts.unread} color="error" max={99}>
              Unread
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={counts.bookings} color="info" max={99}>
              Bookings
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={counts.payments} color="success" max={99}>
              Payments
            </Badge>
          } 
        />
        <Tab 
          label={
            <Badge badgeContent={counts.promotions} color="warning" max={99}>
              Offers
            </Badge>
          } 
        />
      </Tabs>

      {/* Notifications List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Loading notifications...
              </Typography>
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 1 ? 'All caught up! No unread notifications.' : 'You don\'t have any notifications yet.'}
              </Typography>
            </Box>
          ) : (
            <List>
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        backgroundColor: notification.read ? 'transparent' : 'action.hover',
                        borderLeft: notification.read ? 'none' : `4px solid ${theme.palette[notification.color].main}`,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            backgroundColor: `${notification.color}.light`,
                            color: `${notification.color}.main`,
                            width: 40,
                            height: 40
                          }}
                        >
                          {notification.icon}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={notification.read ? 'normal' : 'bold'}
                            >
                              {notification.title}
                            </Typography>
                            {notification.priority === 'high' && (
                              <Chip label="High" color="error" size="small" />
                            )}
                            {!notification.read && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.read 
                                ? markAsUnread(notification.id)
                                : markAsRead(notification.id)
                            }}
                          >
                            {notification.read ? <MarkAsUnread /> : <MarkEmailRead />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose how you want to receive notifications
          </Typography>

          <Grid container spacing={3}>
            {/* Email Notifications */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Email
                    </Typography>
                  </Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.email.bookingUpdates}
                          onChange={(e) => handleSettingChange('email', 'bookingUpdates', e.target.checked)}
                        />
                      }
                      label="Booking Updates"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.email.paymentConfirmations}
                          onChange={(e) => handleSettingChange('email', 'paymentConfirmations', e.target.checked)}
                        />
                      }
                      label="Payment Confirmations"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.email.promotions}
                          onChange={(e) => handleSettingChange('email', 'promotions', e.target.checked)}
                        />
                      }
                      label="Promotions & Offers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.email.reminders}
                          onChange={(e) => handleSettingChange('email', 'reminders', e.target.checked)}
                        />
                      }
                      label="Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.email.reviews}
                          onChange={(e) => handleSettingChange('email', 'reviews', e.target.checked)}
                        />
                      }
                      label="Review Requests"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            {/* SMS Notifications */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Sms sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      SMS
                    </Typography>
                  </Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sms.bookingUpdates}
                          onChange={(e) => handleSettingChange('sms', 'bookingUpdates', e.target.checked)}
                        />
                      }
                      label="Booking Updates"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sms.paymentConfirmations}
                          onChange={(e) => handleSettingChange('sms', 'paymentConfirmations', e.target.checked)}
                        />
                      }
                      label="Payment Confirmations"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sms.promotions}
                          onChange={(e) => handleSettingChange('sms', 'promotions', e.target.checked)}
                        />
                      }
                      label="Promotions & Offers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sms.reminders}
                          onChange={(e) => handleSettingChange('sms', 'reminders', e.target.checked)}
                        />
                      }
                      label="Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.sms.reviews}
                          onChange={(e) => handleSettingChange('sms', 'reviews', e.target.checked)}
                        />
                      }
                      label="Review Requests"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            {/* Push Notifications */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneAndroid sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Push
                    </Typography>
                  </Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.push.bookingUpdates}
                          onChange={(e) => handleSettingChange('push', 'bookingUpdates', e.target.checked)}
                        />
                      }
                      label="Booking Updates"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.push.paymentConfirmations}
                          onChange={(e) => handleSettingChange('push', 'paymentConfirmations', e.target.checked)}
                        />
                      }
                      label="Payment Confirmations"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.push.promotions}
                          onChange={(e) => handleSettingChange('push', 'promotions', e.target.checked)}
                        />
                      }
                      label="Promotions & Offers"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.push.reminders}
                          onChange={(e) => handleSettingChange('push', 'reminders', e.target.checked)}
                        />
                      }
                      label="Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.push.reviews}
                          onChange={(e) => handleSettingChange('push', 'reviews', e.target.checked)}
                        />
                      }
                      label="Review Requests"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Critical notifications like booking confirmations and security alerts 
              will always be sent regardless of your preferences.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveNotificationSettings}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Notifications
