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
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  Badge,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar
} from '@mui/material';
import {
  Verified,
  Pending,
  Cancel,
  CheckCircle,
  Error,
  Warning,
  Visibility,
  Download,
  Upload,
  Search,
  FilterList,
  GetApp,
  Refresh,
  Assignment,
  Description,
  CreditCard,
  Security,
  School,
  Work,
  Home,
  Phone,
  Email,
  LocationOn,
  Star,
  TrendingUp,
  TrendingDown,
  Schedule,
  ExpandMore,
  Close,
  ZoomIn,
  RotateLeft,
  RotateRight,
  Comment
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';




const WorkerVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    documentType: '',
    priority: '',
    submissionDate: ''
  });
  const [verificationAction, setVerificationAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Mock verification data
  const mockVerificationRequests = [
    {
      id: 1,
      workerId: 'WK001',
      workerName: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+91 9654321087',
      location: 'Bangalore, Karnataka',
      avatar: '',
      submissionDate: '2025-06-28T10:30:00Z',
      status: 'pending',
      priority: 'high',
      completionPercentage: 85,
      documents: [
        {
          type: 'aadhaar',
          name: 'Aadhaar Card',
          status: 'approved',
          uploadDate: '2025-06-28T10:30:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'front' },
            { url: '/api/placeholder/400/250', type: 'back' }
          ],
          verifiedBy: 'Admin User',
          verificationDate: '2025-06-28T14:20:00Z',
          notes: 'Clear and readable document'
        },
        {
          type: 'pan',
          name: 'PAN Card',
          status: 'pending',
          uploadDate: '2025-06-28T11:15:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'front' }
          ],
          notes: ''
        },
        {
          type: 'police_verification',
          name: 'Police Verification',
          status: 'pending',
          uploadDate: '2025-06-28T12:00:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'certificate' }
          ],
          notes: ''
        },
        {
          type: 'skill_certificate',
          name: 'Skill Certificate',
          status: 'rejected',
          uploadDate: '2025-06-27T16:45:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'certificate' }
          ],
          verifiedBy: 'Admin User',
          verificationDate: '2025-06-28T09:30:00Z',
          rejectionReason: 'Certificate appears to be expired',
          notes: 'Please upload a valid certificate'
        }
      ],
      skills: ['Plumbing', 'Electrical'],
      experience: '5 years',
      previousWork: 'Freelance plumber',
      references: [
        { name: 'John Doe', phone: '+91 9876543210', relation: 'Previous Client' },
        { name: 'Sarah Smith', phone: '+91 9765432109', relation: 'Colleague' }
      ]
    },
    {
      id: 2,
      workerId: 'WK002',
      workerName: 'Emma Davis',
      email: 'emma.davis@example.com',
      phone: '+91 9543210976',
      location: 'Chennai, Tamil Nadu',
      avatar: '',
      submissionDate: '2025-06-27T14:20:00Z',
      status: 'in_review',
      priority: 'medium',
      completionPercentage: 60,
      documents: [
        {
          type: 'aadhaar',
          name: 'Aadhaar Card',
          status: 'approved',
          uploadDate: '2025-06-27T14:20:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'front' },
            { url: '/api/placeholder/400/250', type: 'back' }
          ],
          verifiedBy: 'Admin User',
          verificationDate: '2025-06-27T16:30:00Z',
          notes: 'Document verified successfully'
        },
        {
          type: 'pan',
          name: 'PAN Card',
          status: 'pending',
          uploadDate: '2025-06-27T15:00:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'front' }
          ],
          notes: ''
        }
      ],
      skills: ['Cleaning', 'Painting'],
      experience: '3 years',
      previousWork: 'Cleaning service company',
      references: [
        { name: 'Michael Brown', phone: '+91 9432109865', relation: 'Previous Employer' }
      ]
    },
    {
      id: 3,
      workerId: 'WK003',
      workerName: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+91 9432109865',
      location: 'Pune, Maharashtra',
      avatar: '',
      submissionDate: '2025-06-26T09:15:00Z',
      status: 'approved',
      priority: 'low',
      completionPercentage: 100,
      documents: [
        {
          type: 'aadhaar',
          name: 'Aadhaar Card',
          status: 'approved',
          uploadDate: '2025-06-26T09:15:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'front' },
            { url: '/api/placeholder/400/250', type: 'back' }
          ],
          verifiedBy: 'Admin User',
          verificationDate: '2025-06-26T11:20:00Z',
          notes: 'All documents verified'
        },
        {
          type: 'pan',
          name: 'PAN Card',
          status: 'approved',
          uploadDate: '2025-06-26T09:30:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'front' }
          ],
          verifiedBy: 'Admin User',
          verificationDate: '2025-06-26T11:25:00Z',
          notes: 'Valid PAN card'
        },
        {
          type: 'police_verification',
          name: 'Police Verification',
          status: 'approved',
          uploadDate: '2025-06-26T10:00:00Z',
          images: [
            { url: '/api/placeholder/400/250', type: 'certificate' }
          ],
          verifiedBy: 'Admin User',
          verificationDate: '2025-06-26T12:00:00Z',
          notes: 'Police verification complete'
        }
      ],
      skills: ['Electrical', 'AC Repair'],
      experience: '7 years',
      previousWork: 'Electrical contractor',
      references: [
        { name: 'Lisa Anderson', phone: '+91 9321098754', relation: 'Business Partner' },
        { name: 'Tom Wilson', phone: '+91 9210987643', relation: 'Previous Client' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchVerificationRequests = async () => {
      setLoading(true);
      setTimeout(() => {
        setVerificationRequests(mockVerificationRequests);
        setLoading(false);
      }, 1000);
    };

    fetchVerificationRequests();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      in_review: '#6366f1',
      approved: '#10b981',
      rejected: '#ef4444',
      incomplete: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      in_review: '#6366f1'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setVerificationDialogOpen(true);
  };

  const handleImageView = (image) => {
    setSelectedImage(image);
    setImageViewerOpen(true);
  };

  const handleDocumentAction = (action, document) => {
    setVerificationAction(action);
    setSelectedRequest(prev => ({
      ...prev,
      selectedDocument: document
    }));
    setActionDialogOpen(true);
  };

  const executeDocumentAction = () => {
    const newStatus = verificationAction === 'approve' ? 'approved' : 'rejected';
    
    setVerificationRequests(prev =>
      prev.map(request =>
        request.id === selectedRequest.id
          ? {
              ...request,
              documents: request.documents.map(doc =>
                doc.type === selectedRequest.selectedDocument.type
                  ? {
                      ...doc,
                      status: newStatus,
                      verifiedBy: 'Current Admin',
                      verificationDate: new Date().toISOString(),
                      rejectionReason: verificationAction === 'reject' ? rejectionReason : '',
                      notes: verificationNotes
                    }
                  : doc
              )
            }
          : request
      )
    );

    setSnackbar({
      open: true,
      message: `Document ${verificationAction}d successfully`,
      severity: 'success'
    });

    setActionDialogOpen(false);
    setRejectionReason('');
    setVerificationNotes('');
  };

  const handleCompleteVerification = (requestId, status) => {
    setVerificationRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status, verificationDate: new Date().toISOString() }
          : request
      )
    );

    setSnackbar({
      open: true,
      message: `Worker verification ${status}`,
      severity: 'success'
    });
  };

  const filteredRequests = verificationRequests.filter(request => {
    const matchesSearch = 
      request.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.workerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesPriority = !filters.priority || request.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getVerificationStats = () => {
    return {
      total: verificationRequests.length,
      pending: verificationRequests.filter(r => r.status === 'pending').length,
      inReview: verificationRequests.filter(r => r.status === 'in_review').length,
      approved: verificationRequests.filter(r => r.status === 'approved').length,
      rejected: verificationRequests.filter(r => r.status === 'rejected').length,
      highPriority: verificationRequests.filter(r => r.priority === 'high').length
    };
  };

  const stats = getVerificationStats();

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: '#ef4444', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? '#10b981' : '#ef4444'}
                  fontWeight="medium"
                >
                  {Math.abs(trend)}% vs last week
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color, fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Worker Verification</Typography>
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
            Worker Verification
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<GetApp />}>
              Export Report
            </Button>
            <Button variant="contained" startIcon={<Refresh />}>
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Requests" />
            <Tab label="Pending Review" />
            <Tab label="In Progress" />
            <Tab label="Completed" />
          </Tabs>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Total Requests"
              value={stats.total}
              subtitle="All submissions"
              icon={Assignment}
              color="#6366f1"
              trend={12.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Pending"
              value={stats.pending}
              subtitle="Awaiting review"
              icon={Schedule}
              color="#f59e0b"
              trend={8.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="In Review"
              value={stats.inReview}
              subtitle="Being processed"
              icon={Visibility}
              color="#6366f1"
              trend={-2.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Approved"
              value={stats.approved}
              subtitle="Verified workers"
              icon={CheckCircle}
              color="#10b981"
              trend={15.7}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="Rejected"
              value={stats.rejected}
              subtitle="Failed verification"
              icon={Cancel}
              color="#ef4444"
              trend={-5.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard
              title="High Priority"
              value={stats.highPriority}
              subtitle="Urgent reviews"
              icon={Warning}
              color="#ef4444"
              trend={22.1}
            />
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <TextField
                placeholder="Search workers..."
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
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="">All Priority</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Verification Requests Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Worker</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              request.status === 'approved' ? (
                                <Verified sx={{ fontSize: 16, color: '#10b981' }} />
                              ) : request.status === 'pending' ? (
                                <Schedule sx={{ fontSize: 16, color: '#f59e0b' }} />
                              ) : null
                            }
                          >
                            <Avatar sx={{ bgcolor: '#6366f1', width: 40, height: 40 }}>
                              {request.workerName.charAt(0)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {request.workerName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ID: {request.workerId}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {request.skills.join(', ')}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.email}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2">{request.phone}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="textSecondary">
                              {request.location}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                          sx={{
                            backgroundColor: getStatusColor(request.status),
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {request.completionPercentage}%
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ({request.documents.filter(d => d.status === 'approved').length}/{request.documents.length} docs)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={request.completionPercentage}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#f3f4f6',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: request.completionPercentage === 100 ? '#10b981' : '#6366f1'
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.priority.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(request.priority),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(request.submissionDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(request.submissionDate).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="Review Documents">
                            <IconButton
                              size="small"
                              onClick={() => handleViewRequest(request)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Documents">
                            <IconButton size="small" color="primary">
                              <Download />
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
            count={filteredRequests.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          />
        </Card>

        {/* Verification Details Dialog */}
        <Dialog
          open={verificationDialogOpen}
          onClose={() => setVerificationDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Worker Verification - {selectedRequest?.workerName}
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label={selectedRequest?.status?.charAt(0).toUpperCase() + selectedRequest?.status?.slice(1).replace('_', ' ')}
                  sx={{
                    backgroundColor: getStatusColor(selectedRequest?.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <IconButton onClick={() => setVerificationDialogOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Grid container spacing={3}>
                {/* Worker Information */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Worker Information
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: '#6366f1', width: 60, height: 60 }}>
                            {selectedRequest.workerName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {selectedRequest.workerName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ID: {selectedRequest.workerId}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            <strong>Email:</strong> {selectedRequest.email}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Phone:</strong> {selectedRequest.phone}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Location:</strong> {selectedRequest.location}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Skills:</strong> {selectedRequest.skills.join(', ')}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Experience:</strong> {selectedRequest.experience}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Previous Work:</strong> {selectedRequest.previousWork}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                            References:
                          </Typography>
                          {selectedRequest.references.map((ref, index) => (
                            <Box key={index} mb={1}>
                              <Typography variant="body2">
                                {ref.name} - {ref.relation}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {ref.phone}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Documents */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Document Verification
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {selectedRequest.documents.map((document, index) => (
                      <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box display="flex" alignItems="center" gap={2} width="100%">
                            <Description />
                            <Typography variant="body1" fontWeight="medium" flex={1}>
                              {document.name}
                            </Typography>
                            <Chip
                              label={document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                              size="small"
                              sx={{
                                backgroundColor: getDocumentStatusColor(document.status),
                                color: 'white',
                                fontWeight: 'medium'
                              }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" gutterBottom>
                                <strong>Upload Date:</strong> {new Date(document.uploadDate).toLocaleString()}
                              </Typography>
                              {document.verificationDate && (
                                <Typography variant="body2" gutterBottom>
                                  <strong>Verified Date:</strong> {new Date(document.verificationDate).toLocaleString()}
                                </Typography>
                              )}
                              {document.verifiedBy && (
                                <Typography variant="body2" gutterBottom>
                                  <strong>Verified By:</strong> {document.verifiedBy}
                                </Typography>
                              )}
                              {document.rejectionReason && (
                                <Alert severity="error" sx={{ mt: 1 }}>
                                  <strong>Rejection Reason:</strong> {document.rejectionReason}
                                </Alert>
                              )}
                              {document.notes && (
                                <Alert severity="info" sx={{ mt: 1 }}>
                                  <strong>Notes:</strong> {document.notes}
                                </Alert>
                              )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom>
                                Document Images:
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                {document.images.map((image, imgIndex) => (
                                  <Card
                                    key={imgIndex}
                                    sx={{ 
                                      width: 120, 
                                      height: 80, 
                                      cursor: 'pointer',
                                      '&:hover': { boxShadow: 4 }
                                    }}
                                    onClick={() => handleImageView(image)}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="60"
                                      image={image.url}
                                      alt={`${document.name} - ${image.type}`}
                                      sx={{ objectFit: 'cover' }}
                                    />
                                    <Typography variant="caption" align="center" display="block" p={0.5}>
                                      {image.type}
                                    </Typography>
                                  </Card>
                                ))}
                              </Box>
                              {document.status === 'pending' && (
                                <Box display="flex" gap={1} mt={2}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => handleDocumentAction('approve', document)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDocumentAction('reject', document)}
                                  >
                                    Reject
                                  </Button>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerificationDialogOpen(false)}>Close</Button>
            {selectedRequest?.status !== 'approved' && selectedRequest?.status !== 'rejected' && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCompleteVerification(selectedRequest.id, 'rejected')}
                >
                  Reject Worker
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleCompleteVerification(selectedRequest.id, 'approved')}
                >
                  Approve Worker
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Image Viewer Dialog */}
        <Dialog
          open={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Document Image</Typography>
              <IconButton onClick={() => setImageViewerOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedImage && (
              <Box display="flex" justifyContent="center" p={2}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.type}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button startIcon={<Download />}>Download</Button>
            <Button startIcon={<ZoomIn />}>Zoom</Button>
          </DialogActions>
        </Dialog>

        {/* Document Action Dialog */}
        <Dialog
          open={actionDialogOpen}
          onClose={() => setActionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {verificationAction === 'approve' ? 'Approve Document' : 'Reject Document'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={2}>
              <Alert severity={verificationAction === 'approve' ? 'success' : 'error'}>
                Are you sure you want to {verificationAction} this document?
              </Alert>
              
              {verificationAction === 'reject' && (
                <TextField
                  label="Rejection Reason"
                  multiline
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  fullWidth
                  required
                  placeholder="Please provide a reason for rejection..."
                />
              )}
              
              <TextField
                label="Verification Notes"
                multiline
                rows={2}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                fullWidth
                placeholder="Add any additional notes..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color={verificationAction === 'approve' ? 'success' : 'error'}
              onClick={executeDocumentAction}
              disabled={verificationAction === 'reject' && !rejectionReason}
            >
              {verificationAction === 'approve' ? 'Approve' : 'Reject'} Document
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

export default WorkerVerification;
