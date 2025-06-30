// src/pages/NotFound.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Support as SupportIcon,
  Build as BuildIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const quickLinks = [
    {
      title: 'Browse Services',
      description: 'Explore our wide range of professional services',
      icon: <BuildIcon />,
      action: () => navigate('/services'),
      color: 'primary'
    },
    {
      title: 'Search',
      description: 'Find exactly what you\'re looking for',
      icon: <SearchIcon />,
      action: () => navigate('/services'),
      color: 'secondary'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: <SupportIcon />,
      action: () => navigate('/contact'),
      color: 'info'
    },
    {
      title: 'Help Center',
      description: 'Find answers to common questions',
      icon: <PhoneIcon />,
      action: () => navigate('/contact'),
      color: 'success'
    }
  ];

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          {/* Left Side - 404 Illustration */}
          <Grid xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                {/* Large 404 Text */}
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '8rem', md: '12rem' },
                    fontWeight: 'bold',
                    color: 'primary.main',
                    lineHeight: 0.8,
                    mb: 2,
                    textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  404
                </Typography>
                
                {/* Animated Icon */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: 'warning.light',
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3
                  }}>
                    <SearchIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Avatar>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side - Content */}
          <Grid xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2" fontWeight="bold" gutterBottom color="text.primary">
                  Oops! Page Not Found
                </Typography>
                
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  The page you're looking for doesn't exist or has been moved. 
                  Don't worry, let's get you back on track!
                </Typography>

                {/* Action Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ mb: 4 }}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/')}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    Go Home
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { 
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Go Back
                  </Button>
                  
                  <Button
                    variant="text"
                    size="large"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { 
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </Stack>

                {/* Error Details */}
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.8)',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>What happened?</strong><br />
                    • The URL might be typed incorrectly<br />
                    • The page might have been moved or deleted<br />
                    • You might not have permission to access this page<br />
                    • There might be a temporary server issue
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Quick Links Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            What would you like to do?
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Here are some helpful links to get you back on track
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            {quickLinks.map((link, index) => (
              <Grid xs={12} sm={6} md={3} key={link.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    textAlign: 'center',
                    '&:hover': { 
                      transform: 'translateY(-8px)', 
                      transition: 'all 0.3s ease',
                      boxShadow: 6
                    }
                  }}
                  onClick={link.action}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar sx={{ 
                        bgcolor: `${link.color}.light`, 
                        width: 64, 
                        height: 64, 
                        mx: 'auto', 
                        mb: 3,
                        color: `${link.color}.main`
                      }}>
                        {link.icon}
                      </Avatar>
                      
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {link.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Card sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Still Need Help?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              Our support team is here to help you 24/7
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  support@urbanskill.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  +91-1234567890
                </Typography>
              </Box>
              
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
                Contact Support
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
