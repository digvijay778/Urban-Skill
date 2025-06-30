// src/pages/Contact.jsx - Fixed Center Alignment
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Rating
} from '@mui/material';
import {
  Send as SendIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  Support as SupportIcon,
  QuestionAnswer as FAQIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const contactCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Customer Support' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const contactMethods = [
    {
      title: 'Customer Support',
      icon: <SupportIcon />,
      phone: '+91-1234567890',
      email: 'support@urbanskill.com',
      hours: 'Mon-Fri: 9 AM - 6 PM'
    },
    {
      title: 'Business Inquiries',
      icon: <BusinessIcon />,
      phone: '+91-9876543210',
      email: 'business@urbanskill.com',
      hours: 'Mon-Sat: 10 AM - 7 PM'
    },
    {
      title: 'Emergency Support',
      icon: <SecurityIcon />,
      phone: '+91-9999888777',
      email: 'emergency@urbanskill.com',
      hours: '24/7 Available'
    }
  ];

  const officeLocations = [
    {
      city: 'Delhi (Head Office)',
      address: '123 Business Street, Connaught Place, New Delhi - 110001',
      phone: '+91-1234567890',
      email: 'delhi@urbanskill.com'
    },
    {
      city: 'Mumbai',
      address: '456 Corporate Avenue, Bandra West, Mumbai - 400050',
      phone: '+91-2234567890',
      email: 'mumbai@urbanskill.com'
    },
    {
      city: 'Bangalore',
      address: '789 Tech Park, Koramangala, Bangalore - 560034',
      phone: '+91-8034567890',
      email: 'bangalore@urbanskill.com'
    }
  ];

  const faqs = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond to general inquiries within 24 hours. For urgent matters, our emergency support team responds within 30 minutes.'
    },
    {
      question: 'What are your support hours?',
      answer: 'Our customer support is available Monday to Friday from 9 AM to 6 PM IST. Emergency support is available 24/7.'
    },
    {
      question: 'Can I schedule a call?',
      answer: 'Yes! You can schedule a call by selecting "Partnership" or "Business Inquiry" in the contact form.'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: { xs: 8, md: 12 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
              Have questions or need assistance? We're here to help you every step of the way.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Contact Methods */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Choose the best way to reach our team
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {contactMethods.map((method, index) => (
              <Grid xs={12} md={4} key={method.title}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  p: 3,
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    transition: 'all 0.3s ease',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 64, 
                      height: 64, 
                      mx: 'auto', 
                      mb: 3
                    }}>
                      {method.icon}
                    </Avatar>
                    
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {method.title}
                    </Typography>
                    
                    {/* FIXED: Center aligned contact details */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <PhoneIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{method.phone}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <EmailIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{method.email}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TimeIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{method.hours}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Content */}
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid xs={12} md={8}>
            <Paper sx={{ p: 4 }} elevation={2}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Send us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Fill out the form below and we'll get back to you within 24 hours.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                    />
                  </Grid>
                  
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>
                  
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                    />
                  </Grid>
                  
                  <Grid xs={12} sm={6}>
                    <TextField
                      select
                      label="Category"
                      fullWidth
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      {contactCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid xs={12}>
                    <TextField
                      label="Subject"
                      fullWidth
                      required
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      error={!!formErrors.subject}
                      helperText={formErrors.subject}
                    />
                  </Grid>
                  
                  <Grid xs={12}>
                    <TextField
                      label="Message"
                      fullWidth
                      required
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      error={!!formErrors.message}
                      helperText={formErrors.message}
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <AnimatePresence>
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Thank you for your message! We'll get back to you within 24 hours.
                      </Alert>
                    )}
                  </AnimatePresence>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{ mt: 3, py: 1.5 }}
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid xs={12} md={4}>
            {/* FIXED: Quick Answers - Center Aligned */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Answers
                </Typography>
                <Box sx={{ textAlign: 'left' }}>
                  {faqs.map((faq, index) => (
                    <Accordion key={index} sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* FIXED: Quick Actions - Center Aligned */}
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<FAQIcon />} 
                    sx={{ width: '100%', maxWidth: 200 }}
                  >
                    View All FAQ
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<SupportIcon />} 
                    sx={{ width: '100%', maxWidth: 200 }}
                  >
                    Help Center
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<ScheduleIcon />} 
                    sx={{ width: '100%', maxWidth: 200 }}
                  >
                    Schedule Call
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FIXED: Office Locations - Better Center Alignment */}
        <Box sx={{ mt: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Our Offices
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Visit us at any of our locations across India
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {officeLocations.map((office, index) => (
              <Grid xs={12} sm={6} md={4} key={office.city}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    transition: 'all 0.3s ease',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56, 
                      mx: 'auto', 
                      mb: 3
                    }}>
                      <LocationIcon />
                    </Avatar>
                    
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {office.city}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, minHeight: 60 }}>
                      {office.address}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* FIXED: Center aligned contact info */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">{office.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">{office.email}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
