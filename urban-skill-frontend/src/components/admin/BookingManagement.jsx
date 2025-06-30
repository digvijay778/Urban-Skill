import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  Badge,
  Tabs,
  Tab,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Search,
  FilterList,
  GetApp,
  Assignment,
  Schedule,
  CheckCircle,
  Cancel,
  Warning,
  Phone,
  Email,
  LocationOn,
  AttachMoney,
  Star,
  Message,
  Refresh
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    service: '',
    dateFrom: null,
    dateTo: null,
    worker: '',
    customer: ''
  });

  // Mock booking data
  const mockBookings = [
    {
      id: 'BK001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        avatar: ''
      },
      worker: {
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '+91 8765432109',
        avatar: '',
        rating: 4.8
      },
      service: 'House Cleaning',
      category: 'Cleaning',
      date: '2025-06-30',
      time: '10:00 AM',
      duration: '3 hours',
      status: 'confirmed',
      amount: 1500,
      address: '123 Main Street, Mumbai',
      description: 'Deep cleaning for 3BHK apartment',
      createdAt: '2025-06-28T10:30:00Z',
      updatedAt: '2025-06-28T14:20:00Z'
    },
    {
      id: 'BK002',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+91 9765432108',
        avatar: ''
      },
      worker: {
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+91 8654321098',
        avatar: '',
        rating: 4.6
      },
      service: 'Plumbing Repair',
      category: 'Plumbing',
      date: '2025-06-29',
      time: '2:00 PM',
      duration: '2 hours',
      status: 'in_progress',
      amount: 800,
      address: '456 Oak Avenue, Delhi',
      description: 'Kitchen sink pipe repair',
      createdAt: '2025-06-27T09:15:00Z',
      updatedAt: '2025-06-29T14:00:00Z'
    },
    {
      id: 'BK003',
      customer: {
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+91 9654321087',
        avatar: ''
      },
      worker: {
        name: 'John Smith',
        email: 'johnsmith@example.com',
        phone: '+91 8543210987',
        avatar: '',
        rating: 4.9
      },
      service: 'Electrical Installation',
      category: 'Electrical',
      date: '2025-07-01',
      time: '11:00 AM',
      duration: '4 hours',
      status: 'pending',
      amount: 2200,
      address: '789 Pine Road, Bangalore',
      description: 'New electrical wiring for bedroom',
      createdAt: '2025-06-26T16:45:00Z',
      updatedAt: '2025-06-26T16:45:00Z'
    },
    {
      id: 'BK004',
      customer: {
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '+91 9543210976',
        avatar: ''
      },
      worker: {
        name: 'Sarah Wilson',
        email: 'sarahw@example.com',
        phone: '+91 8432109876',
        avatar: '',
        rating: 4.7
      },
      service: 'House Painting',
      category: 'Painting',
      date: '2025-06-28',
      time: '9:00 AM',
      duration: '6 hours',
      status: 'completed',
      amount: 3500,
      address: '321 Elm Street, Chennai',
      description: 'Living room and bedroom painting',
      createdAt: '2025-06-25T11:20:00Z',
      updatedAt: '2025-06-28T15:30:00Z'
    },
    {
      id: 'BK005',
      customer: {
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        phone: '+91 9432109865',
        avatar: ''
      },
      worker: {
        name: 'Tom Johnson',
        email: 'tom@example.com',
        phone: '+91 8321098765',
        avatar: '',
        rating: 4.5
      },
      service: 'AC Repair',
      category: 'Appliance',
      date: '2025-06-27',
      time: '3:00 PM',
      duration: '2 hours',
      status: 'cancelled',
      amount: 1200,
      address: '654 Maple Drive, Pune',
      description: 'AC not cooling properly',
      createdAt: '2025-06-24T13:10:00Z',
      updatedAt: '2025-06-27T10:15:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      setLoading(true);
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#6366f1',
      in_progress: '#10b981',
      completed: '#059669',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
          : booking
      )
    );
    setSnackbar({
      open: true,
      message: `Booking ${bookingId} status updated to ${getStatusLabel(newStatus)}`,
      severity: 'success'
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || booking.status === filters.status;
    const matchesService = !filters.service || booking.category === filters.service;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      inProgress: bookings.filter(b => b.status === 'in_progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getBookingStats();

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <Card sx={{ textAlign: 'center', height: '100%' }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Icon sx={{ fontSize: 32, color }} />
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Booking Management</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" color="#6366f1">
            Booking Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard title="Total Bookings" value={stats.total} color="#6366f1" icon={Assignment} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard title="Pending" value={stats.pending} color="#f59e0b" icon={Schedule} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard title="Confirmed" value={stats.confirmed} color="#6366f1" icon={CheckCircle} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard title="In Progress" value={stats.inProgress} color="#10b981" icon={Schedule} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard title="Completed" value={stats.completed} color="#059669" icon={CheckCircle} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard title="Cancelled" value={stats.cancelled} color="#ef4444" icon={Cancel} />
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                placeholder="Search bookings..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ minWidth: 300 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Service</InputLabel>
                <Select
                  value={filters.service}
                  label="Service"
                  onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
                >
                  <MenuItem value="">All Services</MenuItem>
                  <MenuItem value="Cleaning">Cleaning</MenuItem>
                  <MenuItem value="Plumbing">Plumbing</MenuItem>
                  <MenuItem value="Electrical">Electrical</MenuItem>
                  <MenuItem value="Painting">Painting</MenuItem>
                  <MenuItem value="Appliance">Appliance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Worker</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {booking.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
                            {booking.customer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {booking.customer.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {booking.customer.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: '#f59e0b', width: 32, height: 32 }}>
                            {booking.worker.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {booking.worker.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                              <Typography variant="caption">
                                {booking.worker.rating}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {booking.service}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {booking.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(booking.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {booking.time} ({booking.duration})
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            sx={{
                              '& .MuiSelect-select': {
                                color: getStatusColor(booking.status),
                                fontWeight: 'medium'
                              }
                            }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="#10b981">
                          ₹{booking.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Contact Customer">
                            <IconButton size="small" color="primary">
                              <Phone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Message">
                            <IconButton size="small" color="secondary">
                              <Message />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredBookings.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          />
        </Card>

        {/* Booking Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Booking Details - {selectedBooking?.id}</Typography>
              <Chip
                label={getStatusLabel(selectedBooking?.status)}
                sx={{
                  backgroundColor: getStatusColor(selectedBooking?.status),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Customer Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1} mb={3}>
                    <Typography><strong>Name:</strong> {selectedBooking.customer.name}</Typography>
                    <Typography><strong>Email:</strong> {selectedBooking.customer.email}</Typography>
                    <Typography><strong>Phone:</strong> {selectedBooking.customer.phone}</Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom color="primary">
                    Service Details
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Service:</strong> {selectedBooking.service}</Typography>
                    <Typography><strong>Category:</strong> {selectedBooking.category}</Typography>
                    <Typography><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</Typography>
                    <Typography><strong>Time:</strong> {selectedBooking.time}</Typography>
                    <Typography><strong>Duration:</strong> {selectedBooking.duration}</Typography>
                    <Typography><strong>Amount:</strong> ₹{selectedBooking.amount.toLocaleString()}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Worker Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1} mb={3}>
                    <Typography><strong>Name:</strong> {selectedBooking.worker.name}</Typography>
                    <Typography><strong>Email:</strong> {selectedBooking.worker.email}</Typography>
                    <Typography><strong>Phone:</strong> {selectedBooking.worker.phone}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography><strong>Rating:</strong></Typography>
                      <Star sx={{ color: '#f59e0b', fontSize: 16 }} />
                      <Typography>{selectedBooking.worker.rating}</Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom color="primary">
                    Additional Details
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography><strong>Address:</strong> {selectedBooking.address}</Typography>
                    <Typography><strong>Description:</strong> {selectedBooking.description}</Typography>
                    <Typography><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
                    <Typography><strong>Updated:</strong> {new Date(selectedBooking.updatedAt).toLocaleString()}</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <Button variant="contained" color="primary">
              Contact Customer
            </Button>
            <Button variant="contained" color="secondary">
              Contact Worker
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default BookingManagement;
