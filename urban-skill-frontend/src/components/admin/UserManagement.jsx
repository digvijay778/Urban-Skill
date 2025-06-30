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
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  GetApp,
  Refresh,
  Settings,
  Category,
  AttachMoney,
  Schedule,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  ExpandMore,
  Save,
  Close,
  Image,
  Description
} from '@mui/icons-material';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priceRange: ''
  });

  // Form states
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    basePrice: '',
    priceType: 'fixed', // fixed, hourly, per_sqft
    duration: '',
    isActive: true,
    featured: false,
    requirements: '',
    image: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    isActive: true,
    sortOrder: 0
  });

  // Mock data
  const mockCategories = [
    { id: 1, name: 'Cleaning', description: 'House and office cleaning services', icon: '🧹', isActive: true, sortOrder: 1, serviceCount: 8 },
    { id: 2, name: 'Plumbing', description: 'Plumbing repairs and installations', icon: '🔧', isActive: true, sortOrder: 2, serviceCount: 12 },
    { id: 3, name: 'Electrical', description: 'Electrical work and repairs', icon: '⚡', isActive: true, sortOrder: 3, serviceCount: 10 },
    { id: 4, name: 'Painting', description: 'Interior and exterior painting', icon: '🎨', isActive: true, sortOrder: 4, serviceCount: 6 },
    { id: 5, name: 'Appliance Repair', description: 'Home appliance repairs', icon: '🔌', isActive: true, sortOrder: 5, serviceCount: 15 }
  ];

  const mockServices = [
    {
      id: 1,
      name: 'Deep House Cleaning',
      description: 'Comprehensive cleaning service for entire house',
      category: 'Cleaning',
      categoryId: 1,
      basePrice: 1500,
      priceType: 'fixed',
      duration: '3-4 hours',
      isActive: true,
      featured: true,
      requirements: 'Access to all rooms, cleaning supplies provided',
      image: '/api/placeholder/300/200',
      bookings: 245,
      rating: 4.8,
      workers: 25,
      revenue: 367500,
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Kitchen Deep Clean',
      description: 'Specialized kitchen cleaning including appliances',
      category: 'Cleaning',
      categoryId: 1,
      basePrice: 800,
      priceType: 'fixed',
      duration: '2-3 hours',
      isActive: true,
      featured: false,
      requirements: 'Kitchen access, appliance cleaning included',
      image: '/api/placeholder/300/200',
      bookings: 189,
      rating: 4.7,
      workers: 18,
      revenue: 151200,
      createdAt: '2025-01-10T14:20:00Z'
    },
    {
      id: 3,
      name: 'Pipe Repair & Installation',
      description: 'Professional plumbing services for pipes',
      category: 'Plumbing',
      categoryId: 2,
      basePrice: 500,
      priceType: 'hourly',
      duration: '1-2 hours',
      isActive: true,
      featured: true,
      requirements: 'Access to plumbing area, materials extra',
      image: '/api/placeholder/300/200',
      bookings: 312,
      rating: 4.6,
      workers: 35,
      revenue: 468000,
      createdAt: '2025-01-08T09:15:00Z'
    },
    {
      id: 4,
      name: 'Electrical Wiring',
      description: 'New electrical wiring and installations',
      category: 'Electrical',
      categoryId: 3,
      basePrice: 800,
      priceType: 'hourly',
      duration: '2-6 hours',
      isActive: true,
      featured: false,
      requirements: 'Electrical access, safety clearance required',
      image: '/api/placeholder/300/200',
      bookings: 156,
      rating: 4.9,
      workers: 22,
      revenue: 374400,
      createdAt: '2025-01-05T16:45:00Z'
    },
    {
      id: 5,
      name: 'Interior Wall Painting',
      description: 'Professional interior wall painting service',
      category: 'Painting',
      categoryId: 4,
      basePrice: 25,
      priceType: 'per_sqft',
      duration: '1-3 days',
      isActive: false,
      featured: false,
      requirements: 'Room preparation, paint materials included',
      image: '/api/placeholder/300/200',
      bookings: 89,
      rating: 4.5,
      workers: 12,
      revenue: 133500,
      createdAt: '2025-01-03T11:30:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setServices(mockServices);
        setCategories(mockCategories);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const handleAddService = () => {
    setServiceForm({
      id: '',
      name: '',
      description: '',
      category: '',
      basePrice: '',
      priceType: 'fixed',
      duration: '',
      isActive: true,
      featured: false,
      requirements: '',
      image: ''
    });
    setDialogOpen(true);
  };

  const handleEditService = (service) => {
    setServiceForm({
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      priceType: service.priceType,
      duration: service.duration,
      isActive: service.isActive,
      featured: service.featured,
      requirements: service.requirements,
      image: service.image
    });
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceForm.name || !serviceForm.category || !serviceForm.basePrice) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    if (serviceForm.id) {
      // Update existing service
      setServices(prev =>
        prev.map(service =>
          service.id === serviceForm.id
            ? { ...service, ...serviceForm, updatedAt: new Date().toISOString() }
            : service
        )
      );
      setSnackbar({
        open: true,
        message: 'Service updated successfully',
        severity: 'success'
      });
    } else {
      // Add new service
      const newService = {
        ...serviceForm,
        id: Date.now(),
        bookings: 0,
        rating: 0,
        workers: 0,
        revenue: 0,
        createdAt: new Date().toISOString()
      };
      setServices(prev => [newService, ...prev]);
      setSnackbar({
        open: true,
        message: 'Service added successfully',
        severity: 'success'
      });
    }

    setDialogOpen(false);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setServices(prev => prev.filter(service => service.id !== selectedService.id));
    setSnackbar({
      open: true,
      message: 'Service deleted successfully',
      severity: 'success'
    });
    setDeleteDialogOpen(false);
  };

  const handleToggleStatus = (serviceId) => {
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || service.category === filters.category;
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && service.isActive) ||
      (filters.status === 'inactive' && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getServiceStats = () => {
    return {
      total: services.length,
      active: services.filter(s => s.isActive).length,
      featured: services.filter(s => s.featured).length,
      totalRevenue: services.reduce((sum, s) => sum + s.revenue, 0)
    };
  };

  const stats = getServiceStats();

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
                  {Math.abs(trend)}% vs last month
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
        <Typography variant="h4" gutterBottom>Service Management</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#6366f1">
          Service Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Category />}
            onClick={() => setCategoryDialogOpen(true)}
          >
            Manage Categories
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddService}
          >
            Add Service
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Services" />
          <Tab label="Categories" />
          <Tab label="Pricing Rules" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Services"
                value={stats.total}
                subtitle="All services"
                icon={Settings}
                color="#6366f1"
                trend={8.5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Services"
                value={stats.active}
                subtitle="Currently available"
                icon={CheckCircle}
                color="#10b981"
                trend={12.3}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Featured Services"
                value={stats.featured}
                subtitle="Promoted services"
                icon={Star}
                color="#f59e0b"
                trend={-2.1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
                subtitle="From all services"
                icon={AttachMoney}
                color="#ef4444"
                trend={15.7}
              />
            </Grid>
          </Grid>

          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <TextField
                  placeholder="Search services..."
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
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Services Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Pricing</TableCell>
                    <TableCell>Performance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((service) => (
                      <TableRow key={service.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={service.image}
                              sx={{ width: 50, height: 50, bgcolor: '#6366f1' }}
                            >
                              {service.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {service.name}
                                {service.featured && (
                                  <Star sx={{ ml: 1, fontSize: 16, color: '#f59e0b' }} />
                                )}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {service.description}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Duration: {service.duration}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={service.category}
                            size="small"
                            sx={{
                              backgroundColor: '#6366f1',
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="#10b981">
                            ₹{service.basePrice}
                            {service.priceType === 'hourly' && '/hr'}
                            {service.priceType === 'per_sqft' && '/sqft'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {service.priceType === 'fixed' ? 'Fixed Price' : 
                             service.priceType === 'hourly' ? 'Per Hour' : 'Per Sq Ft'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {service.bookings} bookings
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                              <Typography variant="caption">
                                {service.rating} ({service.workers} workers)
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="#10b981">
                              ₹{(service.revenue / 1000).toFixed(0)}K revenue
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={service.isActive}
                                onChange={() => handleToggleStatus(service.id)}
                                size="small"
                              />
                            }
                            label={service.isActive ? 'Active' : 'Inactive'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Service">
                              <IconButton
                                size="small"
                                onClick={() => handleEditService(service)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Service">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteService(service)}
                              >
                                <Delete />
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
              count={filteredServices.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </Card>
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h3">{category.icon}</Typography>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {category.serviceCount} services
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    {category.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={category.isActive ? 'success' : 'default'}
                    />
                    <Box>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Pricing Rules & Configuration
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure dynamic pricing rules, discounts, and promotional offers for services.
            </Alert>
            <Typography variant="body2" color="textSecondary">
              Pricing rules functionality will be implemented here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Service Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {serviceForm.id ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Service Name"
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={serviceForm.category}
                  label="Category"
                  onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Base Price"
                type="number"
                value={serviceForm.basePrice}
                onChange={(e) => setServiceForm(prev => ({ ...prev, basePrice: e.target.value }))}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Price Type</InputLabel>
                <Select
                  value={serviceForm.priceType}
                  label="Price Type"
                  onChange={(e) => setServiceForm(prev => ({ ...prev, priceType: e.target.value }))}
                >
                  <MenuItem value="fixed">Fixed Price</MenuItem>
                  <MenuItem value="hourly">Per Hour</MenuItem>
                  <MenuItem value="per_sqft">Per Square Foot</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Duration"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                fullWidth
                placeholder="e.g., 2-3 hours"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Requirements"
                value={serviceForm.requirements}
                onChange={(e) => setServiceForm(prev => ({ ...prev, requirements: e.target.value }))}
                fullWidth
                multiline
                rows={2}
                placeholder="Special requirements or notes for this service"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={serviceForm.isActive}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active Service"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={serviceForm.featured}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                }
                label="Featured Service"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveService}>
            {serviceForm.id ? 'Update' : 'Add'} Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
          </Alert>
          <Typography variant="body2" color="textSecondary">
            This will permanently remove the service and all associated data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete Service
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
  );
};

export default ServiceManagement;
