import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Chip,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material'
import {
  Search,
  LocationOn,
  Star,
  Verified,
  Security,
  Schedule,
  Assignment,
  CheckCircle,
  TrendingUp,
  People,
  WorkspacePremium
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isAuthenticated } = useAuth()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  // Service categories data
  const serviceCategories = [
    {
      id: 1,
      name: 'Home Cleaning',
      icon: '🧹',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
      startingPrice: '₹149',
      professionals: 200,
      description: 'Professional home and office cleaning services',
      rating: 4.8,
      bookings: '50K+'
    },
    {
      id: 2,
      name: 'Electrical Services',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      startingPrice: '₹299',
      professionals: 150,
      description: 'Expert electrical repairs and installations',
      rating: 4.7,
      bookings: '30K+'
    },
    {
      id: 3,
      name: 'Plumbing',
      icon: '🔧',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      startingPrice: '₹199',
      professionals: 120,
      description: 'Quick plumbing solutions for your home',
      rating: 4.6,
      bookings: '25K+'
    },
    {
      id: 4,
      name: 'AC Repair',
      icon: '❄️',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      startingPrice: '₹499',
      professionals: 90,
      description: 'Air conditioning maintenance and repair',
      rating: 4.9,
      bookings: '20K+'
    },
    {
      id: 5,
      name: 'Carpentry',
      icon: '🔨',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      startingPrice: '₹399',
      professionals: 80,
      description: 'Custom woodwork and furniture solutions',
      rating: 4.5,
      bookings: '15K+'
    },
    {
      id: 6,
      name: 'Painting',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
      startingPrice: '₹599',
      professionals: 70,
      description: 'Interior and exterior painting services',
      rating: 4.7,
      bookings: '12K+'
    }
  ]

  // Featured professionals data
  const featuredProfessionals = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      profession: 'Master Electrician',
      rating: 4.9,
      reviews: 127,
      experience: '8 years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedJobs: 245,
      specialties: ['Wiring', 'Appliance Repair', 'Safety Inspection']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      profession: 'Cleaning Specialist',
      rating: 4.8,
      reviews: 89,
      experience: '5 years',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedJobs: 156,
      specialties: ['Deep Cleaning', 'Sanitization', 'Office Cleaning']
    },
    {
      id: 3,
      name: 'Amit Singh',
      profession: 'Plumbing Expert',
      rating: 4.7,
      reviews: 203,
      experience: '10 years',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedJobs: 312,
      specialties: ['Pipe Repair', 'Bathroom Fitting', 'Water Heater']
    }
  ]

  // Tips for rotating display
  const tips = [
    'Book verified professionals with background checks',
    'Get instant quotes and transparent pricing',
    'Track your service professional in real-time',
    'Rate and review after service completion',
    'Enjoy 30-day service guarantee'
  ]

  // Rotate tips every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`)
    }
  }

  const handleServiceClick = (service) => {
    navigate(`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              component="h1"
              gutterBottom
              align="center"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              India's Largest Home Services Platform
            </Typography>
            
            <Typography
              variant={isMobile ? "h6" : "h5"}
              align="center"
              sx={{ mb: 6, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
            >
              Book trusted professionals for cleaning, repairs, and more. 
              Verified experts at your doorstep.
            </Typography>

            {/* Search Section */}
            <Box sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Search for services (e.g., cleaning, plumbing, electrical)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: 'grey.500' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                sx={{
                  mt: 3,
                  backgroundColor: '#f59e0b',
                  '&:hover': { backgroundColor: '#d97706' },
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                  display: 'block',
                  mx: 'auto'
                }}
              >
                Search Services
              </Button>
            </Box>

            {/* Trust Indicators */}
            <Grid container spacing={3} sx={{ justifyContent: 'center', textAlign: 'center' }}>
              {[
                { icon: <Verified />, text: '50K+ Verified Professionals', subtext: 'Background verified' },
                { icon: <Security />, text: 'Secure Payments', subtext: '100% payment protection' },
                { icon: <Star />, text: '4.8 Average Rating', subtext: 'From 2M+ customers' },
                { icon: <WorkspacePremium />, text: 'Service Guarantee', subtext: '30-day warranty' }
              ].map((item, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ mb: 1, fontSize: '2rem' }}>{item.icon}</Box>
                      <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {item.text}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {item.subtext}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Popular Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Most Booked Services
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Millions of people book these services every month
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {serviceCategories.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    },
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                  onClick={() => handleServiceClick(service)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 1, fontSize: '1.5rem' }}>
                        {service.icon}
                      </Typography>
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {service.name}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={service.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {service.rating} ({service.bookings} bookings)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={`Starting ${service.startingPrice}`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {service.professionals}+ pros
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/services')}
            sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
          >
            View All Services
          </Button>
        </Box>
      </Container>

      {/* Featured Professionals Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Top Rated Professionals
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Meet our verified and highly-rated service experts
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuredProfessionals.map((professional, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={professional.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      height: '100%',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      },
                      borderRadius: 3
                    }}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                      <Avatar
                        src={professional.avatar}
                        alt={professional.name}
                        sx={{ width: 80, height: 80, mx: 'auto' }}
                      />
                      {professional.verified && (
                        <Verified
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            color: 'primary.main',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            fontSize: 20
                          }}
                        />
                      )}
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {professional.name}
                    </Typography>

                    <Typography variant="body2" color="primary" fontWeight="medium" sx={{ mb: 2 }}>
                      {professional.profession}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Rating value={professional.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {professional.rating} ({professional.reviews})
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {professional.specialties.slice(0, 2).map((specialty, idx) => (
                        <Chip
                          key={idx}
                          label={specialty}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {professional.experience} experience
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {professional.completedJobs} jobs completed
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            How Urban Skill Works
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Get your work done in 3 simple steps
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <Search sx={{ fontSize: 40 }} />,
              title: 'Search & Select',
              description: 'Browse verified professionals based on your location, ratings, and availability. Compare prices and read reviews.'
            },
            {
              icon: <Schedule sx={{ fontSize: 40 }} />,
              title: 'Book & Schedule',
              description: 'Choose your preferred time slot and confirm your booking with secure payment. Get instant confirmation.'
            },
            {
              icon: <CheckCircle sx={{ fontSize: 40 }} />,
              title: 'Get Work Done',
              description: 'Professional arrives on time and completes the work to your satisfaction. Rate and review the service.'
            }
          ].map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      mb: 3,
                      position: 'relative'
                    }}
                  >
                    {step.icon}
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {step.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            {[
              { number: '2M+', label: 'Happy Customers', icon: <People /> },
              { number: '50K+', label: 'Verified Professionals', icon: <Verified /> },
              { number: '100+', label: 'Cities Covered', icon: <LocationOn /> },
              { number: '4.8', label: 'Average Rating', icon: <Star /> }
            ].map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ mb: 2, fontSize: '2rem' }}>{stat.icon}</Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Rotating Tips Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              💡 Pro Tip
            </Typography>
            <Fade in key={currentTipIndex} timeout={500}>
              <Typography variant="h5" color="text.secondary">
                {tips[currentTipIndex]}
              </Typography>
            </Fade>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box sx={{ backgroundColor: 'secondary.main', color: 'white', py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join millions of satisfied customers who trust Urban Skill for their home service needs
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'white',
                  color: 'secondary.main',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                Sign Up Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register?role=worker')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Join as Professional
              </Button>
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  )
}

export default Home
