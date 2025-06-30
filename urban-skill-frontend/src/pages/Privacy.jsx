// src/pages/Privacy.jsx
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
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSection, setExpandedSection] = useState('overview');

  const lastUpdated = 'January 15, 2025';

  const privacySections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: <InfoIcon />,
      color: 'primary',
      content: {
        summary: 'We are committed to protecting your privacy and ensuring the security of your personal information.',
        details: [
          'We collect only necessary information to provide our services',
          'Your data is encrypted and stored securely',
          'We never sell your personal information to third parties',
          'You have full control over your data and privacy settings',
          'We comply with all applicable privacy laws and regulations'
        ]
      }
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <VisibilityIcon />,
      color: 'secondary',
      content: {
        summary: 'We collect information you provide directly and automatically when you use our platform.',
        details: [
          'Personal Information: Name, email, phone number, address',
          'Account Information: Username, password, preferences',
          'Service Information: Booking history, reviews, ratings',
          'Payment Information: Billing details (securely processed)',
          'Device Information: IP address, browser type, device ID',
          'Usage Data: Pages visited, features used, time spent'
        ]
      }
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <SecurityIcon />,
      color: 'info',
      content: {
        summary: 'Your information helps us provide, improve, and personalize our services.',
        details: [
          'Provide and maintain our services',
          'Process bookings and payments',
          'Communicate with you about services and updates',
          'Improve our platform and user experience',
          'Ensure security and prevent fraud',
          'Comply with legal obligations'
        ]
      }
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: <ShieldIcon />,
      color: 'warning',
      content: {
        summary: 'We share your information only when necessary to provide services or comply with law.',
        details: [
          'Service Professionals: Basic contact info for service delivery',
          'Payment Processors: Secure payment processing only',
          'Legal Requirements: When required by law or legal process',
          'Business Transfers: In case of merger or acquisition',
          'Consent: When you explicitly agree to sharing',
          'Never for Marketing: We don\'t sell data to advertisers'
        ]
      }
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: <LockIcon />,
      color: 'success',
      content: {
        summary: 'We implement industry-standard security measures to protect your information.',
        details: [
          'End-to-end encryption for sensitive data',
          'Secure servers with regular security audits',
          'Two-factor authentication available',
          'Regular security training for our team',
          'Incident response procedures in place',
          'Compliance with security standards'
        ]
      }
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: <CheckCircleIcon />,
      color: 'error',
      content: {
        summary: 'You have several rights regarding your personal information and how we use it.',
        details: [
          'Access: Request a copy of your personal data',
          'Correction: Update or correct inaccurate information',
          'Deletion: Request deletion of your personal data',
          'Portability: Export your data in a readable format',
          'Restriction: Limit how we process your information',
          'Objection: Object to certain types of processing'
        ]
      }
    }
  ];

  const dataTypes = [
    {
      category: 'Personal Data',
      description: 'Information that identifies you personally',
      examples: ['Name', 'Email', 'Phone', 'Address'],
      retention: '5 years after account closure',
      icon: <SecurityIcon />,
      color: 'primary'
    },
    {
      category: 'Service Data',
      description: 'Information about your use of our services',
      examples: ['Bookings', 'Reviews', 'Preferences', 'History'],
      retention: '3 years for service improvement',
      icon: <VisibilityIcon />,
      color: 'secondary'
    },
    {
      category: 'Technical Data',
      description: 'Information about your device and usage',
      examples: ['IP Address', 'Browser', 'Device ID', 'Cookies'],
      retention: '1 year for analytics',
      icon: <LockIcon />,
      color: 'info'
    },
    {
      category: 'Communication Data',
      description: 'Records of our communications with you',
      examples: ['Support Chats', 'Emails', 'Notifications', 'Calls'],
      retention: '2 years for support purposes',
      icon: <EmailIcon />,
      color: 'success'
    }
  ];

  const privacyControls = [
    {
      title: 'Account Settings',
      description: 'Manage your account information and preferences',
      action: 'Manage',
      icon: <SecurityIcon />,
      color: 'primary'
    },
    {
      title: 'Privacy Preferences',
      description: 'Control how your data is used and shared',
      action: 'Configure',
      icon: <ShieldIcon />,
      color: 'secondary'
    },
    {
      title: 'Data Export',
      description: 'Download a copy of your personal data',
      action: 'Download',
      icon: <DownloadIcon />,
      color: 'info'
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      action: 'Delete',
      icon: <DeleteIcon />,
      color: 'error'
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
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Privacy Policy
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Your privacy is important to us. Learn how we collect, use, and protect your information.
              </Typography>
              <Chip 
                label={`Last Updated: ${lastUpdated}`}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontSize: '1rem',
                  py: 1
                }}
              />
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Quick Summary */}
        <Alert severity="info" sx={{ mb: 6, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Privacy at a Glance
          </Typography>
          <Typography variant="body1">
            We collect only the information necessary to provide our services, keep it secure, 
            and give you full control over your data. We never sell your personal information 
            and are committed to transparency in all our data practices.
          </Typography>
        </Alert>

        {/* Main Privacy Sections */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Privacy Policy Details
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Comprehensive information about our privacy practices
          </Typography>

          {privacySections.map((section, index) => (
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
                        <ListItemText primary={detail} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>

        {/* Data Types Section */}
       {/* Data Types Section - FIXED CENTER ALIGNMENT */}
<Box sx={{ mb: 8 }}>
  <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
    Types of Data We Collect
  </Typography>
  <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
    Understanding what information we collect and how long we keep it
  </Typography>

  <Grid container spacing={4} justifyContent="center">
    {dataTypes.map((dataType, index) => (
      <Grid xs={12} md={6} key={dataType.category}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card sx={{ 
            height: '100%',
            textAlign: 'center', // FIXED: Added center alignment
            '&:hover': { 
              transform: 'translateY(-4px)', 
              transition: 'all 0.3s ease',
              boxShadow: 4
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* FIXED: Centered icon and title */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: `${dataType.color}.light`, 
                  mr: 2,
                  color: `${dataType.color}.main`
                }}>
                  {dataType.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {dataType.category}
                </Typography>
              </Box>
              
              {/* FIXED: Centered description */}
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                {dataType.description}
              </Typography>
              
              {/* FIXED: Centered examples label */}
              <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>
                Examples:
              </Typography>
              
              {/* FIXED: Centered chips */}
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                {dataType.examples.map((example, idx) => (
                  <Chip 
                    key={idx}
                    label={example} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Box>
              
              {/* FIXED: Centered retention info */}
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                <strong>Retention:</strong> {dataType.retention}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    ))}
  </Grid>
</Box>


        {/* Privacy Controls */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Your Privacy Controls
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Manage your privacy settings and data preferences
          </Typography>

          <Grid container spacing={4}>
            {privacyControls.map((control, index) => (
              <Grid xs={12} sm={6} md={3} key={control.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-4px)', 
                      transition: 'all 0.3s ease',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Avatar sx={{ 
                        bgcolor: `${control.color}.light`, 
                        width: 64, 
                        height: 64, 
                        mx: 'auto', 
                        mb: 3,
                        color: `${control.color}.main`
                      }}>
                        {control.icon}
                      </Avatar>
                      
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {control.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {control.description}
                      </Typography>
                      
                      <Button 
                        variant="outlined" 
                        color={control.color}
                        fullWidth
                      >
                        {control.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Questions About Privacy?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Our privacy team is here to help you understand and control your data
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  privacy@urbanskill.com
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
                  Contact Privacy Team
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
                  onClick={() => navigate('/terms')}
                >
                  View Terms of Service
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Privacy;
