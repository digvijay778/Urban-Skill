// src/components/worker/JobHistory.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { formatters } from '../../utils/formatters';
import LoadingScreen from '../common/LoadingScreen';

const JobHistory = () => {
  const { user } = useAuth();
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'all',
    dateRange: 'all'
  });

  // Statistics
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    thisMonthJobs: 0,
    thisMonthEarnings: 0
  });

  const tabLabels = [
    { label: 'All Jobs', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'This Month', value: 'this_month' }
  ];

  useEffect(() => {
    fetchJobHistory();
  }, [filters]);

  useEffect(() => {
    calculateStats();
  }, [jobHistory]);

  const fetchJobHistory = async () => {
    try {
      setLoading(true);
      const response = await jobService.getWorkerJobHistory(user.id, filters);
      setJobHistory(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch job history');
      console.error('Error fetching job history:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const completed = jobHistory.filter(job => job.status === 'completed');
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthJobs = jobHistory.filter(job => 
      new Date(job.completedAt) >= thisMonth && job.status === 'completed'
    );

    const totalEarnings = completed.reduce((sum, job) => sum + (job.workerEarnings || 0), 0);
    const thisMonthEarnings = thisMonthJobs.reduce((sum, job) => sum + (job.workerEarnings || 0), 0);
    const averageRating = completed.length > 0 
      ? completed.reduce((sum, job) => sum + (job.rating || 0), 0) / completed.length 
      : 0;

    setStats({
      totalJobs: jobHistory.length,
      completedJobs: completed.length,
      totalEarnings,
      averageRating,
      thisMonthJobs: thisMonthJobs.length,
      thisMonthEarnings
    });
  };

  const getFilteredJobs = () => {
    let filtered = jobHistory;
    
    if (selectedTab > 0) {
      const tabFilter = tabLabels[selectedTab].value;
      if (tabFilter === 'this_month') {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        filtered = filtered.filter(job => new Date(job.completedAt) >= thisMonth);
      } else {
        filtered = filtered.filter(job => job.status === tabFilter);
      }
    }
    
    return filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'in_progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
  };

  const handleDownloadInvoice = async (jobId) => {
    try {
      await jobService.downloadInvoice(jobId);
    } catch (err) {
      setError('Failed to download invoice');
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
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
        </Box>
      </CardContent>
    </Card>
  );

  const JobCard = ({ job, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
        <CardContent>
          {/* Job Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Avatar
                src={job.customer?.profileImage}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                {job.customer?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {job.service?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer: {job.customer?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={job.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(job.status)}
                    size="small"
                  />
                  {job.status === 'completed' && job.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={job.rating} readOnly size="small" />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        ({job.rating})
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ₹{job.workerEarnings || job.totalAmount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {job.status === 'completed' ? 'Earned' : 'Amount'}
              </Typography>
            </Box>
          </Box>

          {/* Job Details */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {formatters.formatDate(job.scheduledDate)} at {job.scheduledTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" noWrap>
                  {job.address}
                </Typography>
              </Box>
            </Grid>
            
            <Grid xs={12} sm={6}>
              {job.completedAt && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 18, mr: 1, color: 'success.main' }} />
                  <Typography variant="body2">
                    Completed: {formatters.formatDate(job.completedAt)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Payment: {job.paymentStatus || 'Pending'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Customer Review */}
          {job.review && (
            <Accordion sx={{ mb: 2, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Customer Review</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={job.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {job.rating}/5
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  "{job.review}"
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={() => handleViewDetails(job)}
              size="small"
            >
              View Details
            </Button>
            
            {job.status === 'completed' && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadInvoice(job.id)}
                size="small"
              >
                Invoice
              </Button>
            )}
          </Box>

          {/* Timeline */}
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Booked {formatters.formatRelativeTime(job.createdAt)}
              {job.completedAt && (
                <> • Completed {formatters.formatRelativeTime(job.completedAt)}</>
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Job History
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Jobs"
              value={stats.totalJobs}
              icon={<ScheduleIcon />}
              color="primary"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Completed Jobs"
              value={stats.completedJobs}
              icon={<CheckCircleIcon />}
              color="success"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Earnings"
              value={`₹${formatters.formatNumber(stats.totalEarnings)}`}
              icon={<PaymentIcon />}
              color="primary"
              subtitle={`This month: ₹${formatters.formatNumber(stats.thisMonthEarnings)}`}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Average Rating"
              value={stats.averageRating.toFixed(1)}
              icon={<StarIcon />}
              color="warning"
              subtitle={`From ${stats.completedJobs} reviews`}
            />
          </Grid>
        </Grid>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert 
                severity="error" 
                onClose={() => setError('')}
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Service</InputLabel>
              <Select
                value={filters.service}
                onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
                label="Service"
              >
                <MenuItem value="all">All Services</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                label="Date Range"
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="this_week">This Week</MenuItem>
                <MenuItem value="this_month">This Month</MenuItem>
                <MenuItem value="last_month">Last Month</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Status Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabLabels.map((tab, index) => (
              <Tab
                key={tab.value}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Job History List */}
        {getFilteredJobs().length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Job History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTab === 0 
                  ? "You haven't completed any jobs yet"
                  : `No ${tabLabels[selectedTab].label.toLowerCase()} jobs found`
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box>
            {getFilteredJobs().map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </Box>
        )}

        {/* Job Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Job Details
          </DialogTitle>
          
          <DialogContent>
            {selectedJob && (
              <Box>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Service Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Service:</strong> {selectedJob.service?.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Date:</strong> {formatters.formatDate(selectedJob.scheduledDate)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Time:</strong> {selectedJob.scheduledTime}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Duration:</strong> {selectedJob.duration} hours
                    </Typography>
                  </Grid>
                  
                  <Grid xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Customer Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {selectedJob.customer?.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Phone:</strong> {selectedJob.customer?.phone}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Address:</strong> {selectedJob.address}
                    </Typography>
                  </Grid>
                  
                  <Grid xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Payment Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Total Amount:</strong> ₹{selectedJob.totalAmount}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Your Earnings:</strong> ₹{selectedJob.workerEarnings}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Payment Status:</strong> {selectedJob.paymentStatus}
                    </Typography>
                  </Grid>
                  
                  {selectedJob.description && (
                    <Grid xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Job Description
                      </Typography>
                      <Typography variant="body2">
                        {selectedJob.description}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Close
            </Button>
            {selectedJob?.status === 'completed' && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadInvoice(selectedJob.id)}
              >
                Download Invoice
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default JobHistory;
