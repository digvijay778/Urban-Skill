// src/components/worker/JobRequests.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Paper,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Payment as PaymentIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Message as MessageIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { jobService } from '../../services/jobService';
import { notificationService } from '../../services/notificationService';
import { formatters } from '../../utils/formatters';
import LoadingScreen from '../common/LoadingScreen';

const JobRequests = () => {
  const { user } = useAuth();
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Job status counts
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    completed: 0,
    cancelled: 0
  });

  const tabLabels = [
    { label: 'All Requests', value: 'all', count: jobRequests.length },
    { label: 'Pending', value: 'pending', count: statusCounts.pending },
    { label: 'Accepted', value: 'accepted', count: statusCounts.accepted },
    { label: 'In Progress', value: 'in_progress', count: statusCounts.in_progress },
    { label: 'Completed', value: 'completed', count: statusCounts.completed }
  ];

  useEffect(() => {
    fetchJobRequests();
    // Set up real-time updates
    const interval = setInterval(fetchJobRequests, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateStatusCounts();
  }, [jobRequests]);

  const fetchJobRequests = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(!showLoading);
      
      const response = await jobService.getWorkerJobRequests(user.id);
      setJobRequests(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch job requests');
      console.error('Error fetching job requests:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStatusCounts = () => {
    const counts = jobRequests.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  const handleJobAction = async (job, action) => {
    try {
      const actionData = {
        jobId: job.id,
        workerId: user.id,
        action,
        message: responseMessage
      };

      const result = await jobService.respondToJobRequest(actionData);
      
      if (result.success) {
        setSuccess(`Job request ${action}ed successfully`);
        
        // Send notification to customer
        await notificationService.sendNotification({
          userId: job.customerId,
          title: `Job Request ${action.charAt(0).toUpperCase() + action.slice(1)}ed`,
          message: `Your job request for ${job.service?.name} has been ${action}ed by ${user.name}`,
          type: 'job_update'
        });
        
        await fetchJobRequests(false);
        handleCloseDialog();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} job request`);
    }
  };

  const handleOpenDialog = (job, action) => {
    setSelectedJob(job);
    setActionType(action);
    setResponseMessage('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedJob(null);
    setActionType('');
    setResponseMessage('');
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 100);
  };

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const getFilteredJobs = () => {
    let filtered = jobRequests;
    
    if (selectedTab > 0) {
      const statusFilter = tabLabels[selectedTab].value;
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'rejected':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatJobDateTime = (date, time) => {
    const jobDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateStr = '';
    if (jobDate.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (jobDate.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = formatters.formatDate(date);
    }
    
    return `${dateStr} at ${time}`;
  };

  const JobCard = ({ job, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ 
        mb: 2, 
        '&:hover': { boxShadow: 4 },
        border: job.priority === 'high' ? 2 : 1,
        borderColor: job.priority === 'high' ? 'error.main' : 'divider'
      }}>
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
                  {job.customer?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={job.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(job.status)}
                    size="small"
                  />
                  {job.priority && (
                    <Chip
                      label={`${job.priority.toUpperCase()} PRIORITY`}
                      color={getPriorityColor(job.priority)}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                ₹{job.totalAmount}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, job)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Job Details */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {formatJobDateTime(job.scheduledDate, job.scheduledTime)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimeIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Duration: {job.estimatedDuration} hours
                </Typography>
              </Box>
            </Grid>
            
            <Grid xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" noWrap>
                  {job.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {job.customer?.phone}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Job Description */}
          {job.description && (
            <Accordion sx={{ mb: 2, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Job Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {job.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Special Requirements */}
          {job.specialRequirements && job.specialRequirements.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Special Requirements:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {job.specialRequirements.map((req, idx) => (
                  <Chip
                    key={idx}
                    label={req}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {job.status === 'pending' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AcceptIcon />}
                  onClick={() => handleOpenDialog(job, 'accept')}
                  size="small"
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => handleOpenDialog(job, 'reject')}
                  size="small"
                >
                  Reject
                </Button>
              </>
            )}
            
            {job.status === 'accepted' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ScheduleIcon />}
                onClick={() => handleOpenDialog(job, 'start')}
                size="small"
              >
                Start Job
              </Button>
            )}
            
            {job.status === 'in_progress' && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleOpenDialog(job, 'complete')}
                size="small"
              >
                Mark Complete
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              onClick={() => {/* Open chat */}}
              size="small"
            >
              Message
            </Button>
          </Box>

          {/* Booking Timeline */}
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Requested {formatters.formatRelativeTime(job.createdAt)}
              {job.respondedAt && (
                <> • Responded {formatters.formatRelativeTime(job.respondedAt)}</>
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Job Requests
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={() => fetchJobRequests(false)}
                disabled={refreshing}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter"
                startAdornment={<FilterIcon />}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

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
          
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert 
                severity="success" 
                onClose={() => setSuccess('')}
                sx={{ mb: 2 }}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

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
                label={
                  <Badge badgeContent={tab.count} color="primary">
                    {tab.label}
                  </Badge>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Job Requests List */}
        {getFilteredJobs().length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Job Requests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTab === 0 
                  ? "You haven't received any job requests yet"
                  : `No ${tabLabels[selectedTab].label.toLowerCase()} job requests`
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

        {/* Job Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleOpenDialog(selectedJob, 'view');
            handleMenuClose();
          }}>
            <ViewIcon sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => {
            // Open chat functionality
            handleMenuClose();
          }}>
            <MessageIcon sx={{ mr: 1 }} />
            Message Customer
          </MenuItem>
          <MenuItem onClick={() => {
            // Open phone dialer
            window.location.href = `tel:${selectedJob?.customer?.phone}`;
            handleMenuClose();
          }}>
            <PhoneIcon sx={{ mr: 1 }} />
            Call Customer
          </MenuItem>
        </Menu>

        {/* Action Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {actionType === 'accept' && 'Accept Job Request'}
            {actionType === 'reject' && 'Reject Job Request'}
            {actionType === 'start' && 'Start Job'}
            {actionType === 'complete' && 'Complete Job'}
            {actionType === 'view' && 'Job Details'}
          </DialogTitle>
          
          <DialogContent>
            {selectedJob && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedJob.service?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Customer: {selectedJob.customer?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {formatJobDateTime(selectedJob.scheduledDate, selectedJob.scheduledTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Amount: ₹{selectedJob.totalAmount}
                </Typography>
                
                {actionType !== 'view' && (
                  <TextField
                    fullWidth
                    label={`${actionType === 'reject' ? 'Reason for rejection' : 'Message'} (Optional)`}
                    multiline
                    rows={3}
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    sx={{ mt: 2 }}
                    placeholder={
                      actionType === 'accept' 
                        ? 'Thank you for choosing me. I will be there on time.'
                        : actionType === 'reject'
                        ? 'Sorry, I am not available at this time.'
                        : 'Additional notes...'
                    }
                  />
                )}
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            {actionType !== 'view' && (
              <Button
                variant="contained"
                onClick={() => handleJobAction(selectedJob, actionType)}
                color={actionType === 'reject' ? 'error' : 'primary'}
              >
                {actionType === 'accept' && 'Accept Job'}
                {actionType === 'reject' && 'Reject Job'}
                {actionType === 'start' && 'Start Job'}
                {actionType === 'complete' && 'Complete Job'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default JobRequests;
