// src/pages/ServiceDetails.jsx - Complete Fixed Version
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
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  NavigateNext as NavigateNextIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ServiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useAuth();

  const [service, setService] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockService = {
        id: id,
        name: 'Professional Home Cleaning',
        category: 'Cleaning',
        description: 'Complete home cleaning service including all rooms, kitchen, and bathrooms. Our professional cleaners use eco-friendly products and modern equipment to ensure your home is spotless and healthy.',
        startingPrice: 299,
        duration: '2-3 hours',
        rating: 4.8,
        totalReviews: 245,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
          'All rooms cleaning',
          'Kitchen deep clean',
          'Bathroom sanitization',
          'Eco-friendly products',
          'Insured professionals',
          'Satisfaction guarantee'
        ],
        includes: [
          'Dusting and wiping surfaces',
          'Vacuuming and mopping floors',
          'Cleaning windows and mirrors',
          'Kitchen appliance cleaning',
          'Bathroom deep cleaning',
          'Trash removal'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ],
        faqs: [
          {
            question: 'What cleaning products do you use?',
            answer: 'We use eco-friendly, non-toxic cleaning products that are safe for your family and pets.'
          },
          {
            question: 'How long does the service take?',
            answer: 'Typically 2-3 hours depending on the size of your home and specific requirements.'
          },
          {
            question: 'Do I need to be home during cleaning?',
            answer: 'No, you can provide access and we can clean while you\'re away. All our cleaners are background verified.'
          }
        ]
      };

      const mockWorkers = [
        {
          id: 1,
          name: 'Priya Sharma',
          rating: 4.9,
          reviews: 89,
          experience: '5 years',
          price: 299,
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          verified: true,
          available: true,
          specialties: ['Deep Cleaning', 'Kitchen Specialist']
        },
        {
          id: 2,
          name: 'Rajesh Kumar',
          rating: 4.7,
          reviews: 156,
          experience: '3 years',
          price: 279,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          verified: true,
          available: true,
          specialties: ['Bathroom Expert', 'Quick Service']
        },
        {
          id: 3,
          name: 'Anita Singh',
          rating: 4.8,
          reviews: 203,
          experience: '4 years',
          price: 319,
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          verified: true,
          available: false,
          specialties: ['Eco-Friendly', 'Pet-Safe Cleaning']
        }
      ];

      const mockReviews = [
        {
          id: 1,
          customerName: 'John Doe',
          rating: 5,
          comment: 'Excellent service! Very thorough and professional.',
          date: '2025-06-20',
          workerName: 'Priya Sharma'
        },
        {
          id: 2,
          customerName: 'Sarah Wilson',
          rating: 4,
          comment: 'Good cleaning service, arrived on time.',
          date: '2025-06-18',
          workerName: 'Rajesh Kumar'
        },
        {
          id: 3,
          customerName: 'Mike Johnson',
          rating: 5,
          comment: 'Amazing work! Will definitely book again.',
          date: '2025-06-15',
          workerName: 'Anita Singh'
        }
      ];

      setService(mockService);
      setWorkers(mockWorkers);
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (worker) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedWorker(worker);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Booking submitted:', {
        service: service.id,
        worker: selectedWorker.id,
        ...bookingForm
      });
      setBookingDialogOpen(false);
      navigate('/booking/confirmation/123');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const WorkerCard = ({ worker }) => (
    <Card sx={{ 
      height: '100%',
      textAlign: 'center',
      '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s', boxShadow: 4 }
    }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={worker.image}
          sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
        >
          {worker.name.charAt(0)}
        </Avatar>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {worker.name}
          </Typography>
          {worker.verified && (
            <CheckCircleIcon sx={{ color: 'success.main', ml: 1, fontSize: 20 }} />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Rating value={worker.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {worker.rating} ({worker.reviews})
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          {worker.experience} experience
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
          {worker.specialties.map((specialty, index) => (
            <Chip
              key={index}
              label={specialty}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
        
        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
          ₹{worker.price}
        </Typography>
        
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleBookNow(worker)}
          disabled={!worker.available}
          sx={{ py: 1.5 }}
        >
          {worker.available ? 'Book Now' : 'Not Available'}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading service details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Service not found</Alert>
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
        {/* Breadcrumbs */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ justifyContent: 'center', display: 'flex' }}>
            <Link color="inherit" href="/" onClick={() => navigate('/')}>
              Home
            </Link>
            <Link color="inherit" href="/services" onClick={() => navigate('/services')}>
              Services
            </Link>
            <Typography color="text.primary">{service.name}</Typography>
          </Breadcrumbs>
        </Box>

        {/* Back Button */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to Services
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Service Details */}
          <Grid xs={12} md={8}>
            {/* Service Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
                    {service.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Chip label={service.category} color="primary" />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Add to Favorites">
                    <IconButton onClick={() => setIsFavorited(!isFavorited)}>
                      {isFavorited ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={service.rating} precision={0.1} readOnly />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {service.rating} ({service.totalReviews} reviews)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body1">{service.duration}</Typography>
                </Box>
                
                <Typography variant="h5" color="primary" fontWeight="bold">
                  Starting ₹{service.startingPrice}
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img
                  src={service.image}
                  alt={service.name}
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>

              <Grid container spacing={2} justifyContent="center">
                {service.gallery.map((image, index) => (
                  <Grid xs={4} key={index}>
                    <img
                      src={image}
                      alt={`Service ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Service Description */}
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                About This Service
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3, maxWidth: 600, mx: 'auto' }}>
                {service.description}
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                What's Included:
              </Typography>
              <List sx={{ maxWidth: 500, mx: 'auto' }}>
                {service.includes.map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.5, justifyContent: 'center' }}>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={item} sx={{ textAlign: 'left' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Features */}
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Service Features
              </Typography>
              <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600, mx: 'auto' }}>
                {service.features.map((feature, index) => (
                  <Grid xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <CheckCircleIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Reviews */}
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                Customer Reviews
              </Typography>
              {reviews.map((review) => (
                <Box key={review.id} sx={{ mb: 3, pb: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Service by: {review.workerName}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid xs={12} md={4}>
            {/* Service Trust Badge Photo */}
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Professional Service"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                Trusted by 50,000+ Customers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Professional, verified, and insured service providers
              </Typography>
            </Paper>

            {/* Quick Booking */}
            <Paper sx={{ 
              p: 4, 
              mb: 3, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Booking
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                ₹{service.startingPrice}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                Starting price • Professional service
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => handleBookNow(workers[0])}
                sx={{ 
                  mb: 2,
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { 
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Book Now
              </Button>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Choose from available professionals below
              </Typography>
            </Paper>

            {/* Service Guarantees */}
            <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Our Guarantees
              </Typography>
              <List sx={{ py: 2 }}>
                <ListItem sx={{ 
                  justifyContent: 'center', 
                  flexDirection: 'column',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mb: 1 }}>
                    <SecurityIcon color="primary" />
                  </Avatar>
                  <Typography variant="body1" fontWeight="bold">
                    Verified Professionals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Background checked & trained
                  </Typography>
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem sx={{ 
                  justifyContent: 'center', 
                  flexDirection: 'column',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Avatar sx={{ bgcolor: 'success.light', mb: 1 }}>
                    <CheckCircleIcon color="success" />
                  </Avatar>
                  <Typography variant="body1" fontWeight="bold">
                    Satisfaction Guarantee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    100% satisfaction or money back
                  </Typography>
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem sx={{ 
                  justifyContent: 'center', 
                  flexDirection: 'column',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Avatar sx={{ bgcolor: 'info.light', mb: 1 }}>
                    <PaymentIcon color="info" />
                  </Avatar>
                  <Typography variant="body1" fontWeight="bold">
                    Secure Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Multiple payment options available
                  </Typography>
                </ListItem>
              </List>
            </Paper>

            {/* Customer Reviews Summary */}
            <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Reviews
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Rating value={service.rating} precision={0.1} readOnly size="large" />
                <Typography variant="h5" fontWeight="bold" sx={{ ml: 2 }}>
                  {service.rating}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Based on {service.totalReviews} verified reviews
              </Typography>
              
              <Box sx={{ textAlign: 'left' }}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 20 }}>
                      {rating}
                    </Typography>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main', mx: 1 }} />
                    <Box sx={{ 
                      flex: 1, 
                      height: 8, 
                      bgcolor: 'grey.200', 
                      borderRadius: 4,
                      mr: 1
                    }}>
                      <Box sx={{ 
                        width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%`,
                        height: '100%',
                        bgcolor: 'warning.main',
                        borderRadius: 4
                      }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {rating === 5 ? '80%' : rating === 4 ? '15%' : '5%'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Contact Support */}
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Avatar sx={{ 
                bgcolor: 'secondary.main', 
                width: 56, 
                height: 56, 
                mx: 'auto', 
                mb: 2 
              }}>
                <SupportIcon />
              </Avatar>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Need Help?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Our support team is available 24/7 to assist you
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<PhoneIcon />}
                  size="small"
                  fullWidth
                >
                  Call Support
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<EmailIcon />}
                  size="small"
                  fullWidth
                >
                  Chat Now
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Available Professionals */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Available Professionals
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
            Choose from our verified and experienced professionals
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {workers.map((worker) => (
              <Grid xs={12} sm={6} md={4} key={worker.id}>
                <WorkerCard worker={worker} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Booking Dialog */}
        <Dialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center' }}>
            Book {service.name}
            {selectedWorker && (
              <Typography variant="subtitle2" color="text.secondary">
                with {selectedWorker.name}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Preferred Date"
                  type="date"
                  fullWidth
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Preferred Time"
                  type="time"
                  fullWidth
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  label="Service Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  label="Additional Notes"
                  fullWidth
                  multiline
                  rows={3}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any specific requirements or instructions..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleBookingSubmit}
              disabled={!bookingForm.date || !bookingForm.time || !bookingForm.address}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
};

export default ServiceDetails;
