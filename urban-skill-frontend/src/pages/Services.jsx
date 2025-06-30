import React, { useState, useEffect } from 'react'
import { useSearchDebounce, useGeolocation, useLocalStorage,useApi } from '../hooks';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material'
import {
  Search,
  LocationOn,
  FilterList,
  Sort,
  ExpandMore,
  Star,
  TuneRounded
} from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ServiceCard from '@components/common/ServiceCard'
import { useAuth } from '@context/AuthContext'

const Services = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  // State management
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState('popularity')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const itemsPerPage = 12

  // Service categories for filtering
  const categories = [
    { id: 'all', name: 'All Services', count: 45 },
    { id: 'cleaning', name: 'Home Cleaning', count: 12 },
    { id: 'electrical', name: 'Electrical Services', count: 8 },
    { id: 'plumbing', name: 'Plumbing', count: 6 },
    { id: 'ac-repair', name: 'AC Repair', count: 5 },
    { id: 'carpentry', name: 'Carpentry', count: 7 },
    { id: 'painting', name: 'Painting', count: 4 },
    { id: 'appliance', name: 'Appliance Repair', count: 3 }
  ]

  // Mock services data (replace with API call)
  const mockServices = [
    {
      id: 1,
      name: 'Deep Home Cleaning',
      category: 'cleaning',
      icon: '🧹',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
      startingPrice: '₹149',
      originalPrice: '₹199',
      professionals: 200,
      description: 'Professional deep cleaning for your entire home',
      rating: 4.8,
      bookings: '50K+',
      verified: true,
      trending: true,
      features: ['Deep Cleaning', 'Sanitization', 'Eco-friendly'],
      availability: 'today'
    },
    {
      id: 2,
      name: 'Electrical Wiring & Repair',
      category: 'electrical',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      startingPrice: '₹299',
      originalPrice: '₹399',
      professionals: 150,
      description: 'Expert electrical repairs and installations',
      rating: 4.7,
      bookings: '30K+',
      verified: true,
      features: ['Licensed', '24/7 Support', 'Warranty'],
      availability: 'within 2 hours'
    },
    {
      id: 3,
      name: 'Plumbing Services',
      category: 'plumbing',
      icon: '🔧',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      startingPrice: '₹199',
      originalPrice: '₹299',
      professionals: 120,
      description: 'Quick plumbing solutions for your home',
      rating: 4.6,
      bookings: '25K+',
      verified: true,
      features: ['Emergency Service', 'Quality Parts', 'Guarantee'],
      availability: 'within 1 hour'
    },
    {
      id: 4,
      name: 'AC Installation & Repair',
      category: 'ac-repair',
      icon: '❄️',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      startingPrice: '₹499',
      originalPrice: '₹699',
      professionals: 90,
      description: 'Air conditioning maintenance and repair',
      rating: 4.9,
      bookings: '20K+',
      verified: true,
      features: ['All Brands', 'Gas Refill', 'Service Warranty'],
      availability: 'tomorrow'
    },
    {
      id: 5,
      name: 'Furniture Assembly',
      category: 'carpentry',
      icon: '🔨',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
      startingPrice: '₹399',
      originalPrice: '₹499',
      professionals: 80,
      description: 'Professional furniture assembly and repair',
      rating: 4.5,
      bookings: '15K+',
      verified: true,
      features: ['Tool Included', 'Assembly Expert', 'Damage Protection'],
      availability: 'today'
    },
    {
      id: 6,
      name: 'Interior Painting',
      category: 'painting',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
      startingPrice: '₹599',
      originalPrice: '₹799',
      professionals: 70,
      description: 'Professional interior and exterior painting',
      rating: 4.7,
      bookings: '12K+',
      verified: true,
      features: ['Premium Paint', 'Color Consultation', '2 Year Warranty'],
      availability: 'within 3 days'
    }
  ]

  // Initialize services
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices)
      setFilteredServices(mockServices)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...services]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    // Price filter
    filtered = filtered.filter(service => {
      const price = parseInt(service.startingPrice.replace('₹', ''))
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort logic
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseInt(a.startingPrice.replace('₹', '')) - parseInt(b.startingPrice.replace('₹', '')))
        break
      case 'price-high':
        filtered.sort((a, b) => parseInt(b.startingPrice.replace('₹', '')) - parseInt(a.startingPrice.replace('₹', '')))
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'popularity':
      default:
        filtered.sort((a, b) => parseInt(b.bookings.replace(/[^\d]/g, '')) - parseInt(a.bookings.replace(/[^\d]/g, '')))
        break
    }

    setFilteredServices(filtered)
    setCurrentPage(1)
  }, [services, searchQuery, selectedCategory, priceRange, sortBy])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory)
    setSearchParams(params)
  }, [searchQuery, location, selectedCategory, setSearchParams])

  const handleSearch = () => {
    // Search logic is handled by useEffect
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" align="center">
            Professional Services
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Find verified professionals for all your home service needs
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  placeholder="Search for services..."
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
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Mobile Filter Toggle */}
              {isMobile && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TuneRounded />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ mb: 2 }}
                >
                  Filters
                </Button>
              )}

              <Box sx={{ display: { xs: showFilters ? 'block' : 'none', md: 'block' } }}>
                {/* Categories */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Categories
                    </Typography>
                    {categories.map((category) => (
                      <Box
                        key={category.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                          cursor: 'pointer',
                          borderRadius: 1,
                          px: 1,
                          mb: 0.5,
                          backgroundColor: selectedCategory === category.id ? 'primary.light' : 'transparent',
                          '&:hover': { backgroundColor: 'grey.100' }
                        }}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                            color: selectedCategory === category.id ? 'primary.main' : 'text.primary'
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Chip
                          label={category.count}
                          size="small"
                          variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                          color={selectedCategory === category.id ? 'primary' : 'default'}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Price Range */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Price Range
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={2000}
                        step={50}
                        marks={[
                          { value: 0, label: '₹0' },
                          { value: 500, label: '₹500' },
                          { value: 1000, label: '₹1000' },
                          { value: 2000, label: '₹2000+' }
                        ]}
                        sx={{ mt: 2 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Quick Filters */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Quick Filters
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label="Available Today"
                        variant="outlined"
                        size="small"
                        clickable
                        sx={{ justifyContent: 'flex-start' }}
                      />
                      <Chip
                        label="Highly Rated (4.5+)"
                        variant="outlined"
                        size="small"
                        clickable
                        sx={{ justifyContent: 'flex-start' }}
                      />
                      <Chip
                        label="Verified Professionals"
                        variant="outlined"
                        size="small"
                        clickable
                        sx={{ justifyContent: 'flex-start' }}
                      />
                      <Chip
                        label="Emergency Service"
                        variant="outlined"
                        size="small"
                        clickable
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>

          {/* Services Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Results Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {loading ? 'Loading...' : `${filteredServices.length} services found`}
                {searchQuery && (
                  <Typography component="span" color="text.secondary">
                    {' '}for "{searchQuery}"
                  </Typography>
                )}
              </Typography>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="popularity">Most Popular</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Services Grid */}
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                    <ServiceCard loading={true} />
                  </Grid>
                ))}
              </Grid>
            ) : filteredServices.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" gutterBottom>
                  No services found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search criteria or browse all services
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPriceRange([0, 2000])
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {currentServices.map((service, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={service.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ServiceCard service={service} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Services
