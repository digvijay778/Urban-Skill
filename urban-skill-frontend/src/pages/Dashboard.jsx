// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, hasRole } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentActivity: [],
    upcomingEvents: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call based on user role
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (hasRole('customer')) {
        setDashboardData({
          stats: {
            totalBookings: 12,
            completedServices: 8,
            savedAmount: 2500,
            favoriteWorkers: 5
          },
          recentActivity: [
            { id: 1, type: 'booking', title: 'Home Cleaning Completed', date: '2 hours ago', status: 'completed' },
            { id: 2, type: 'review', title: 'Review Posted for Plumbing Service', date: '1 day ago', status: 'completed' },
            { id: 3, type: 'booking', title: 'Electrical Work Scheduled', date: '2 days ago', status: 'scheduled' }
          ],
          upcomingEvents: [
            { id: 1, title: 'AC Repair Service', date: '2025-06-29', time: '10:00 AM', worker: 'Rajesh Kumar' },
            { id: 2, title: 'House Cleaning', date: '2025-06-30', time: '2:00 PM', worker: 'Priya Sharma' }
          ],
          notifications: [
            { id: 1, message: 'Your AC repair is scheduled for tomorrow', type: 'info' },
            { id: 2, message: 'Rate your recent cleaning service', type: 'action' }
          ]
        });
      } else if (hasRole('worker')) {
        setDashboardData({
          stats: {
            totalJobs: 45,
            completedJobs: 38,
            monthlyEarnings: 15000,
            averageRating: 4.8
          },
          recentActivity: [
            { id: 1, type: 'job', title: 'Plumbing Job Completed', date: '3 hours ago', status: 'completed' },
            { id: 2, type: 'payment', title: 'Payment Received - ₹800', date: '5 hours ago', status: 'completed' },
            { id: 3, type: 'booking', title: 'New Job Request Received', date: '1 day ago', status: 'pending' }
          ],
          upcomingEvents: [
            { id: 1, title: 'Kitchen Repair', date: '2025-06-29', time: '9:00 AM', customer: 'Amit Patel' },
            { id: 2, title: 'Bathroom Cleaning', date: '2025-06-29', time: '3:00 PM', customer: 'Sneha Gupta' }
          ],
          notifications: [
            { id: 1, message: 'You have 2 new job requests', type: 'info' },
            { id: 2, message: 'Update your availability for this week', type: 'warning' }
          ]
        });
      } else if (hasRole('admin')) {
        setDashboardData({
          stats: {
            totalUsers: 1250,
            activeWorkers: 180,
            monthlyRevenue: 125000,
            platformGrowth: 15.5
          },
          recentActivity: [
            { id: 1, type: 'user', title: '25 New Users Registered', date: '2 hours ago', status: 'info' },
            { id: 2, type: 'worker', title: '5 Workers Verified', date: '4 hours ago', status: 'completed' },
            { id: 3, type: 'revenue', title: 'Daily Revenue: ₹8,500', date: '1 day ago', status: 'completed' }
          ],
          upcomingEvents: [
            { id: 1, title: 'Weekly Team Meeting', date: '2025-06-29', time: '11:00 AM', type: 'meeting' },
            { id: 2, title: 'Platform Maintenance', date: '2025-06-30', time: '2:00 AM', type: 'maintenance' }
          ],
          notifications: [
            { id: 1, message: 'System maintenance scheduled for tomorrow', type: 'warning' },
            { id: 2, message: 'Monthly report is ready for review', type: 'info' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend = null }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: `${color}.light`, mr: 2 }}>
              {icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {trend && (
              <Chip
                label={`+${trend}%`}
                color="success"
                size="small"
                icon={<TrendingUpIcon />}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const QuickActionCard = ({ title, description, icon, action, color = 'primary' }) => (
    <Card sx={{ 
      height: '100%', 
      cursor: 'pointer',
      '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s', boxShadow: 4 }
    }}
    onClick={action}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Avatar sx={{ 
          bgcolor: `${color}.light`, 
          width: 56, 
          height: 56, 
          mx: 'auto', 
          mb: 2 
        }}>
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderRoleSpecificContent = () => {
    if (hasRole('customer')) {
      return (
        <>
          {/* Customer Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Total Bookings"
                value={dashboardData.stats.totalBookings}
                icon={<AssignmentIcon />}
                color="primary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Services"
                value={dashboardData.stats.completedServices}
                icon={<CheckCircleIcon />}
                color="success"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Amount Saved"
                value={`₹${dashboardData.stats.savedAmount}`}
                icon={<PaymentIcon />}
                color="info"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Favorite Workers"
                value={dashboardData.stats.favoriteWorkers}
                icon={<StarIcon />}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Customer Quick Actions */}
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Book Service"
                description="Find and book professional services"
                icon={<ScheduleIcon />}
                action={() => navigate('/services')}
                color="primary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="My Bookings"
                description="View your current and past bookings"
                icon={<AssignmentIcon />}
                action={() => navigate('/bookings')}
                color="secondary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Write Review"
                description="Rate your recent service experience"
                icon={<StarIcon />}
                action={() => navigate('/reviews')}
                color="warning"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Support"
                description="Get help with your account or services"
                icon={<NotificationsIcon />}
                action={() => navigate('/contact')}
                color="info"
              />
            </Grid>
          </Grid>
        </>
      );
    }

    if (hasRole('worker')) {
      return (
        <>
          {/* Worker Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Total Jobs"
                value={dashboardData.stats.totalJobs}
                icon={<AssignmentIcon />}
                color="primary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Jobs"
                value={dashboardData.stats.completedJobs}
                icon={<CheckCircleIcon />}
                color="success"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Monthly Earnings"
                value={`₹${dashboardData.stats.monthlyEarnings}`}
                icon={<PaymentIcon />}
                color="info"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Average Rating"
                value={dashboardData.stats.averageRating}
                icon={<StarIcon />}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Worker Quick Actions */}
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Job Requests"
                description="View and accept new job requests"
                icon={<AssignmentIcon />}
                action={() => navigate('/worker/job-requests')}
                color="primary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="My Schedule"
                description="Manage your availability and schedule"
                icon={<ScheduleIcon />}
                action={() => navigate('/worker/schedule')}
                color="secondary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Earnings"
                description="Track your earnings and payments"
                icon={<PaymentIcon />}
                action={() => navigate('/worker/earnings')}
                color="success"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Profile"
                description="Update your profile and skills"
                icon={<PersonIcon />}
                action={() => navigate('/worker/profile')}
                color="info"
              />
            </Grid>
          </Grid>
        </>
      );
    }

    if (hasRole('admin')) {
      return (
        <>
          {/* Admin Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={dashboardData.stats.totalUsers}
                icon={<PersonIcon />}
                color="primary"
                trend="12"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Active Workers"
                value={dashboardData.stats.activeWorkers}
                icon={<AssignmentIcon />}
                color="success"
                trend="8"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Monthly Revenue"
                value={`₹${dashboardData.stats.monthlyRevenue.toLocaleString()}`}
                icon={<PaymentIcon />}
                color="info"
                trend="15"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <StatCard
                title="Platform Growth"
                value={`${dashboardData.stats.platformGrowth}%`}
                icon={<TrendingUpIcon />}
                color="warning"
              />
            </Grid>
          </Grid>

          {/* Admin Quick Actions */}
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Admin Controls
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="User Management"
                description="Manage customers and workers"
                icon={<PersonIcon />}
                action={() => navigate('/admin/users')}
                color="primary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Analytics"
                description="View platform analytics and reports"
                icon={<TrendingUpIcon />}
                action={() => navigate('/admin/analytics')}
                color="secondary"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Settings"
                description="Configure platform settings"
                icon={<DashboardIcon />}
                action={() => navigate('/admin/settings')}
                color="info"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Support"
                description="Manage customer support tickets"
                icon={<NotificationsIcon />}
                action={() => navigate('/admin/support')}
                color="warning"
              />
            </Grid>
          </Grid>
        </>
      );
    }

    return (
      <Alert severity="info">
        Welcome to Urban Skill! Please contact support to set up your account properly.
      </Alert>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading your dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {getGreeting()}, {user?.firstName || user?.name || 'User'}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {hasRole('customer') && 'Manage your bookings and discover new services'}
            {hasRole('worker') && 'Track your jobs, earnings, and grow your business'}
            {hasRole('admin') && 'Monitor platform performance and manage operations'}
          </Typography>
        </Box>

        {/* Role-specific Content */}
        {renderRoleSpecificContent()}

        {/* Recent Activity and Upcoming Events */}
        <Grid container spacing={4}>
          {/* Recent Activity */}
          <Grid xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {dashboardData.recentActivity.map((activity, index) => (
                  <ListItem key={activity.id} divider={index < dashboardData.recentActivity.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.date}
                    />
                    <Chip
                      label={activity.status}
                      color={activity.status === 'completed' ? 'success' : 'primary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Upcoming Events */}
          <Grid xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Upcoming Events
              </Typography>
              <List>
                {dashboardData.upcomingEvents.map((event, index) => (
                  <ListItem key={event.id} divider={index < dashboardData.upcomingEvents.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.light' }}>
                        <CalendarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.date} at ${event.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Notifications */}
        {dashboardData.notifications.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
            {dashboardData.notifications.map((notification) => (
              <Alert
                key={notification.id}
                severity={notification.type}
                sx={{ mb: 1 }}
                action={
                  <Button color="inherit" size="small" endIcon={<ArrowForwardIcon />}>
                    View
                  </Button>
                }
              >
                {notification.message}
              </Alert>
            ))}
          </Box>
        )}
      </Container>
    </motion.div>
  );
};

export default Dashboard;
