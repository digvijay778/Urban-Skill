// src/components/worker/Schedule.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { scheduleService } from '../../services/scheduleService';
import { formatters } from '../../utils/formatters';
import LoadingScreen from '../common/LoadingScreen';

const Schedule = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [openTimeOffDialog, setOpenTimeOffDialog] = useState(false);
  const [openRecurringDialog, setOpenRecurringDialog] = useState(false);

  // Schedule state
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { available: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    tuesday: { available: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    wednesday: { available: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    thursday: { available: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    friday: { available: true, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' },
    saturday: { available: true, start: '09:00', end: '16:00', breakStart: '12:00', breakEnd: '13:00' },
    sunday: { available: false, start: '09:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' }
  });

  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState('available'); // available, busy, offline

  // Time off form
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'vacation' // vacation, sick, personal, other
  });

  // Recurring availability form
  const [recurringForm, setRecurringForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    days: [],
    startTime: '09:00',
    endTime: '18:00',
    type: 'unavailable' // available, unavailable
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const [scheduleResponse, timeOffResponse, jobsResponse] = await Promise.all([
        scheduleService.getWorkerSchedule(user.id),
        scheduleService.getTimeOffRequests(user.id),
        scheduleService.getUpcomingJobs(user.id)
      ]);

      if (scheduleResponse.data) {
        setWeeklySchedule(scheduleResponse.data.weeklySchedule || weeklySchedule);
        setAvailabilityStatus(scheduleResponse.data.status || 'available');
      }
      
      setTimeOffRequests(timeOffResponse.data || []);
      setUpcomingJobs(jobsResponse.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch schedule data');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      await scheduleService.updateWorkerSchedule(user.id, {
        weeklySchedule,
        status: availabilityStatus
      });
      setSuccess('Schedule updated successfully');
    } catch (err) {
      setError('Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeOffSubmit = async () => {
    try {
      await scheduleService.requestTimeOff(user.id, timeOffForm);
      setSuccess('Time off request submitted successfully');
      setOpenTimeOffDialog(false);
      setTimeOffForm({ startDate: '', endDate: '', reason: '', type: 'vacation' });
      await fetchScheduleData();
    } catch (err) {
      setError('Failed to submit time off request');
    }
  };

  const handleDeleteTimeOff = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this time off request?')) {
      return;
    }

    try {
      await scheduleService.deleteTimeOffRequest(requestId);
      setSuccess('Time off request cancelled');
      await fetchScheduleData();
    } catch (err) {
      setError('Failed to cancel time off request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'busy':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTimeOffStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const isTimeSlotAvailable = (day, time) => {
    const daySchedule = weeklySchedule[day];
    if (!daySchedule.available) return false;
    
    const timeValue = time.replace(':', '');
    const startValue = daySchedule.start.replace(':', '');
    const endValue = daySchedule.end.replace(':', '');
    const breakStartValue = daySchedule.breakStart.replace(':', '');
    const breakEndValue = daySchedule.breakEnd.replace(':', '');
    
    return timeValue >= startValue && timeValue <= endValue && 
           !(timeValue >= breakStartValue && timeValue <= breakEndValue);
  };

  const DayScheduleCard = ({ day, schedule }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {daysOfWeek.find(d => d.key === day)?.label}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={schedule.available}
                onChange={(e) => handleScheduleChange(day, 'available', e.target.checked)}
                color="primary"
              />
            }
            label="Available"
          />
        </Box>

        {schedule.available && (
          <Grid container spacing={2}>
            <Grid xs={6} sm={3}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={schedule.start}
                onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid xs={6} sm={3}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={schedule.end}
                onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid xs={6} sm={3}>
              <TextField
                fullWidth
                label="Break Start"
                type="time"
                value={schedule.breakStart}
                onChange={(e) => handleScheduleChange(day, 'breakStart', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid xs={6} sm={3}>
              <TextField
                fullWidth
                label="Break End"
                type="time"
                value={schedule.breakEnd}
                onChange={(e) => handleScheduleChange(day, 'breakEnd', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
          </Grid>
        )}

        {!schedule.available && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <BlockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Not available on {daysOfWeek.find(d => d.key === day)?.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
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
            My Schedule
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => fetchScheduleData()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenTimeOffDialog(true)}
            >
              Request Time Off
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSchedule}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </Button>
          </Box>
        </Box>

        {/* Current Status */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: `${getStatusColor(availabilityStatus)}.main`, mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Current Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You are currently {availabilityStatus}
                  </Typography>
                </Box>
              </Box>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="busy">Busy</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

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

        <Grid container spacing={3}>
          {/* Weekly Schedule */}
          <Grid xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Weekly Schedule
            </Typography>
            {daysOfWeek.map(({ key }) => (
              <DayScheduleCard
                key={key}
                day={key}
                schedule={weeklySchedule[key]}
              />
            ))}
          </Grid>

          {/* Sidebar */}
          <Grid xs={12} md={4}>
            {/* Upcoming Jobs */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upcoming Jobs
                </Typography>
                {upcomingJobs.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No upcoming jobs
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {upcomingJobs.slice(0, 5).map((job, index) => (
                      <ListItem key={job.id} divider={index < upcomingJobs.length - 1}>
                        <ListItemText
                          primary={job.service?.name}
                          secondary={`${formatters.formatDate(job.scheduledDate)} at ${job.scheduledTime}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={job.status}
                            color="primary"
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Time Off Requests */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Time Off Requests
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setOpenTimeOffDialog(true)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                
                {timeOffRequests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <TimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No time off requests
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {timeOffRequests.map((request, index) => (
                      <ListItem key={request.id} divider={index < timeOffRequests.length - 1}>
                        <ListItemText
                          primary={request.reason || `${request.type} time off`}
                          secondary={`${formatters.formatDate(request.startDate)} - ${formatters.formatDate(request.endDate)}`}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={request.status}
                              color={getTimeOffStatusColor(request.status)}
                              size="small"
                            />
                            {request.status === 'pending' && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTimeOff(request.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Time Off Request Dialog */}
        <Dialog
          open={openTimeOffDialog}
          onClose={() => setOpenTimeOffDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Request Time Off</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={timeOffForm.type}
                      onChange={(e) => setTimeOffForm(prev => ({ ...prev, type: e.target.value }))}
                      label="Type"
                    >
                      <MenuItem value="vacation">Vacation</MenuItem>
                      <MenuItem value="sick">Sick Leave</MenuItem>
                      <MenuItem value="personal">Personal</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={timeOffForm.startDate}
                    onChange={(e) => setTimeOffForm(prev => ({ ...prev, startDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={timeOffForm.endDate}
                    onChange={(e) => setTimeOffForm(prev => ({ ...prev, endDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Reason (Optional)"
                    multiline
                    rows={3}
                    value={timeOffForm.reason}
                    onChange={(e) => setTimeOffForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Provide additional details about your time off request..."
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTimeOffDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleTimeOffSubmit}
              disabled={!timeOffForm.startDate || !timeOffForm.endDate}
            >
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Schedule;
