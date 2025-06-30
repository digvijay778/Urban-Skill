// src/pages/Terms.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Gavel as GavelIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Policy as PolicyIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSection, setExpandedSection] = useState('overview');

  const lastUpdated = 'January 15, 2025';
  const effectiveDate = 'January 1, 2025';

  const termsSections = [
    {
      id: 'overview',
      title: 'Terms Overview',
      icon: <InfoIcon />,
      color: 'primary',
      content: {
        summary: 'Welcome to Urban Skill. These terms govern your use of our platform and services.',
        details: [
          'By using Urban Skill, you agree to these terms and conditions',
          'These terms apply to all users: customers, service professionals, and visitors',
          'We may update these terms from time to time with notice',
          'Continued use of our platform constitutes acceptance of updated terms',
          'If you disagree with any terms, please discontinue use of our services'
        ]
      }
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: <PolicyIcon />,
      color: 'secondary',
      content: {
        summary: 'Key terms and definitions used throughout this agreement.',
        details: [
          '"Platform" refers to the Urban Skill website and mobile applications',
          '"Services" refers to home services provided by professionals on our platform',
          '"Customer" refers to users who book services through our platform',
          '"Professional" refers to verified service providers on our platform',
          '"Booking" refers to a service request made through our platform',
          '"Content" refers to all text, images, and data on our platform'
        ]
      }
    },
    {
      id: 'eligibility',
      title: 'User Eligibility',
      icon: <PersonIcon />,
      color: 'info',
      content: {
        summary: 'Requirements for using our platform and creating an account.',
        details: [
          'You must be at least 18 years old to use our services',
          'You must provide accurate and complete registration information',
          'You are responsible for maintaining the security of your account',
          'One person may not maintain multiple accounts',
          'We reserve the right to suspend or terminate accounts that violate our terms',
          'Businesses must have proper licenses and insurance to offer services'
        ]
      }
    },
    {
      id: 'platform_use',
      title: 'Platform Use',
      icon: <SecurityIcon />,
      color: 'warning',
      content: {
        summary: 'Guidelines for proper use of our platform and prohibited activities.',
        details: [
          'Use the platform only for its intended purpose of connecting customers with professionals',
          'Do not attempt to circumvent our booking and payment systems',
          'Respect other users and maintain professional communication',
          'Do not post false, misleading, or inappropriate content',
          'Do not use the platform for illegal activities or fraud',
          'Report any suspicious activity or violations to our support team'
        ]
      }
    },
    {
      id: 'bookings_payments',
      title: 'Bookings & Payments',
      icon: <PaymentIcon />,
      color: 'success',
      content: {
        summary: 'Terms governing service bookings, payments, and cancellations.',
        details: [
          'All bookings must be made through our platform',
          'Payment is processed securely through our payment partners',
          'Service fees are clearly displayed before booking confirmation',
          'Cancellation policies vary by service type and timing',
          'Refunds are processed according to our refund policy',
          'Disputes should be reported within 24 hours of service completion'
        ]
      }
    },
    {
      id: 'professional_terms',
      title: 'Professional Terms',
      icon: <BusinessIcon />,
      color: 'error',
      content: {
        summary: 'Specific terms and requirements for service professionals.',
        details: [
          'Professionals must complete our verification process',
          'Maintain valid licenses, insurance, and certifications',
          'Provide services professionally and safely',
          'Respond to booking requests promptly',
          'Complete services as described and agreed upon',
          'Platform fees are deducted from service payments'
        ]
      }
    },
    {
      id: 'liability',
      title: 'Liability & Disclaimers',
      icon: <ShieldIcon />,
      color: 'warning',
      content: {
        summary: 'Important disclaimers and limitations of liability.',
        details: [
          'Urban Skill is a platform connecting customers with independent professionals',
          'We do not directly provide home services',
          'Professionals are independent contractors, not our employees',
          'We are not liable for the quality or outcome of services',
          'Our liability is limited to the amount paid for platform fees',
          'Users assume responsibility for their interactions and transactions'
        ]
      }
    }
  ];

  const feeStructure = [
    {
      userType: 'Customers',
      bookingFee: 'Free',
      serviceFee: '2-5%',
      cancellationFee: '₹50 (within 2 hours)',
      description: 'No booking fees, small service fee for platform maintenance'
    },
    {
      userType: 'Professionals',
      bookingFee: 'Free',
      serviceFee: '8-12%',
      cancellationFee: 'Rating impact',
      description: 'Commission-based model, no upfront costs'
    }
  ];

  const importantPolicies = [
    {
      title: 'Cancellation Policy',
      description: 'Free cancellation up to 2 hours before scheduled service',
      icon: <WarningIcon />,
      color: 'warning'
    },
    {
      title: 'Refund Policy',
      description: 'Full refunds for unsatisfactory services within 24 hours',
      icon: <CheckCircleIcon />,
      color: 'success'
    },
    {
      title: 'Privacy Protection',
      description: 'Your personal information is protected and never sold',
      icon: <SecurityIcon />,
      color: 'primary'
    },
    {
      title: 'Quality Assurance',
      description: 'All professionals are background verified and insured',
      icon: <ShieldIcon />,
      color: 'info'
    }
  ];

  const handleSectionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3 
              }}>
                <GavelIcon sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Terms of Service
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Please read these terms carefully before using our platform
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Last Updated: ${lastUpdated}`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontSize: '1rem',
                    py: 1
                  }}
                />
                <Chip 
                  label={`Effective: ${effectiveDate}`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontSize: '1rem',
                    py: 1
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Quick Summary */}
        <Alert severity="info" sx={{ mb: 6, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Terms Summary
          </Typography>
          <Typography variant="body1">
            By using Urban Skill, you agree to our terms of service. We connect customers with 
            independent service professionals. We are not responsible for the quality of services 
            but ensure all professionals are verified. Payments are secure, and we offer dispute 
            resolution support.
          </Typography>
        </Alert>

        {/* Important Policies */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Key Policies
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Important policies that affect your use of our platform
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {importantPolicies.map((policy, index) => (
              <Grid xs={12} sm={6} md={3} key={policy.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
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
                        bgcolor: `${policy.color}.light`, 
                        width: 64, 
                        height: 64, 
                        mx: 'auto', 
                        mb: 3,
                        color: `${policy.color}.main`
                      }}>
                        {policy.icon}
                      </Avatar>
                      
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {policy.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {policy.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Fee Structure */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Fee Structure
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Transparent pricing for all users
          </Typography>

          <TableContainer component={Paper} sx={{ maxWidth: 800, mx: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell><Typography fontWeight="bold">User Type</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Booking Fee</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Service Fee</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Cancellation</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feeStructure.map((fee) => (
                  <TableRow key={fee.userType}>
                    <TableCell>
                      <Typography fontWeight="bold">{fee.userType}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fee.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{fee.bookingFee}</TableCell>
                    <TableCell>{fee.serviceFee}</TableCell>
                    <TableCell>{fee.cancellationFee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Detailed Terms */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Detailed Terms & Conditions
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Comprehensive terms governing your use of our platform
          </Typography>

          {termsSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Accordion 
                expanded={expandedSection === section.id}
                onChange={handleSectionChange(section.id)}
                sx={{ 
                  mb: 2,
                  '&:hover': { boxShadow: 2 },
                  '&.Mui-expanded': { boxShadow: 4 }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: `${section.color}.light`, 
                      mr: 2,
                      color: `${section.color}.main`
                    }}>
                      {section.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {section.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.content.summary}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {section.content.details.map((detail, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircleIcon color={section.color} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={detail}
                          sx={{ '& .MuiListItemText-primary': { lineHeight: 1.6 } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>

        {/* Legal Notice */}
        <Paper sx={{ p: 4, mb: 6, bgcolor: 'grey.50' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
            Legal Notice
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            These terms constitute a legally binding agreement between you and Urban Skill Technologies Pvt. Ltd. 
            If any provision of these terms is found to be unenforceable, the remaining provisions will remain 
            in full force and effect. These terms are governed by the laws of India, and any disputes will be 
            resolved in the courts of New Delhi.
          </Typography>
        </Paper>

        {/* Contact Section */}
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Questions About Our Terms?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Our legal team is here to help clarify any questions about our terms of service
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  legal@urbanskill.com
                </Typography>
              </Box>
            </Grid>
            
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  +91-1234567890
                </Typography>
              </Box>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { 
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Legal Team
                </Button>
                
                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onClick={() => navigate('/privacy')}
                >
                  View Privacy Policy
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Terms;
