import React, { useState } from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
  IconButton,
  Tooltip,
  Badge,
  Skeleton
} from '@mui/material'
import {
  Person,
  Favorite,
  FavoriteBorder,
  Share,
  Verified,
  TrendingUp,
  Schedule,
  LocationOn
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext' // Fixed import path

const ServiceCard = ({ 
  service, 
  variant = 'default', // 'default', 'compact', 'featured'
  showActions = true,
  loading = false,
  onFavorite,
  onShare
}) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isFavorited, setIsFavorited] = useState(service?.isFavorited || false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleBookNow = (e) => {
    e.stopPropagation()
    if (isAuthenticated) {
      navigate(`/booking?service=${service.id}`)
    } else {
      navigate(`/login?redirect=/booking?service=${service.id}`)
    }
  }

  const handleCardClick = () => {
    navigate(`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`)
  }

  const handleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    onFavorite?.(service.id, !isFavorited)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: service.description,
        url: window.location.origin + `/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`
      })
    } else {
      onShare?.(service)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card sx={{ height: '100%', borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={32} width="80%" />
          <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="text" width={60} />
          </Box>
          <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
        </CardContent>
      </Card>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          sx={{
            display: 'flex',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            },
            borderRadius: 2
          }}
          onClick={handleCardClick}
        >
          <CardMedia
            component="img"
            sx={{ width: 120, height: 120, objectFit: 'cover' }}
            image={service.image}
            alt={service.name}
          />
          <CardContent sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {service.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={service.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                ({service.bookings})
              </Typography>
            </Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Starting {service.startingPrice}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-12px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            },
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
          onClick={handleCardClick}
        >
          {/* Featured Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              backgroundColor: 'secondary.main',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <TrendingUp sx={{ fontSize: 14 }} />
            POPULAR
          </Box>

          <CardMedia
            component="img"
            height="220"
            image={service.image}
            alt={service.name}
            sx={{ objectFit: 'cover' }}
          />
          
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ mr: 1, fontSize: '1.8rem' }}>
                {service.icon}
              </Typography>
              <Typography variant="h5" component="h3" fontWeight="bold">
                {service.name}
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              {service.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={service.rating} precision={0.1} readOnly />
              <Typography variant="body1" component="span" sx={{ ml: 1, fontWeight: 500 }}>
                {service.rating} ({service.bookings} bookings)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" color="primary" fontWeight="bold">
                Starting {service.startingPrice}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" component="span" color="text.secondary">
                  {service.professionals}+ pros
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleBookNow}
              sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
          },
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={handleCardClick}
      >
        {/* Action Buttons */}
        {showActions && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              display: 'flex',
              gap: 0.5
            }}
          >
            <IconButton
              size="small"
              onClick={handleFavorite}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' }
              }}
            >
              {isFavorited ? (
                <Favorite sx={{ color: 'error.main', fontSize: 18 }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 18 }} />
              )}
            </IconButton>
            
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'white' }
              }}
            >
              <Share sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        {/* Trending Badge */}
        {service.trending && (
          <Chip
            label="Trending"
            size="small"
            icon={<TrendingUp />}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
              backgroundColor: 'warning.main',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        )}

        <CardMedia
          component="img"
          height="200"
          image={service.image}
          alt={service.name}
          sx={{ 
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none'
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <Skeleton variant="rectangular" height={200} />
        )}

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ mr: 1, fontSize: '1.5rem' }}>
              {service.icon}
            </Typography>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {service.name}
            </Typography>
            {service.verified && (
              <Verified sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {service.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={service.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
              {service.rating} ({service.bookings})
            </Typography>
          </Box>

          {/* Service Features */}
          {service.features && (
            <Box sx={{ mb: 2 }}>
              {service.features.slice(0, 2).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip
              label={`Starting ${service.startingPrice}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" component="span" color="text.secondary">
                {service.professionals}+ pros
              </Typography>
            </Box>
          </Box>

          {/* Availability Indicator */}
          {service.availability && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule fontSize="small" color="success" />
              <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                Available {service.availability}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 'auto',
              py: 1.5,
              fontWeight: 'bold'
            }}
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ServiceCard
