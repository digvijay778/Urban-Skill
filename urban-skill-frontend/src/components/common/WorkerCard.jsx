import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Rating,
  IconButton,
  Tooltip,
  Badge,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Verified,
  Star,
  LocationOn,
  Phone,
  Message,
  Favorite,
  FavoriteBorder,
  Share,
  Work,
  Schedule,
  TrendingUp,
  CheckCircle,
  AccessTime,
  MonetizationOn
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const WorkerCard = ({ 
  worker, 
  variant = 'default', // 'default', 'compact', 'detailed', 'featured'
  showActions = true,
  loading = false,
  onFavorite,
  onContact,
  onMessage,
  onShare
}) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { isAuthenticated } = useAuth()

  const [isFavorited, setIsFavorited] = useState(worker?.isFavorited || false)

  const handleCardClick = () => {
    navigate(`/worker/${worker.id}`)
  }

  const handleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    onFavorite?.(worker.id, !isFavorited)
  }

  const handleContact = (e) => {
    e.stopPropagation()
    if (isAuthenticated) {
      onContact?.(worker.phone)
    } else {
      navigate('/login')
    }
  }

  const handleMessage = (e) => {
    e.stopPropagation()
    if (isAuthenticated) {
      onMessage?.(worker.id)
    } else {
      navigate('/login')
    }
  }

  const handleShare = (e) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: `${worker.name} - ${worker.profession}`,
        text: worker.description,
        url: window.location.origin + `/worker/${worker.id}`
      })
    } else {
      onShare?.(worker)
    }
  }

  const handleBookNow = (e) => {
    e.stopPropagation()
    if (isAuthenticated) {
      navigate(`/booking?worker=${worker.id}`)
    } else {
      navigate('/login')
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card sx={{ height: '100%', borderRadius: 3 }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" height={24} width="70%" />
              <Skeleton variant="text" height={20} width="50%" />
            </Box>
          </Box>
          <Skeleton variant="text" height={20} width="80%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
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
            borderRadius: 2,
            height: '100%'
          }}
          onClick={handleCardClick}
        >
          <Avatar
            src={worker.avatar}
            alt={worker.name}
            sx={{ width: 80, height: 80, m: 2 }}
          >
            {worker.name?.[0]}
          </Avatar>
          <CardContent sx={{ flex: 1, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
                {worker.name}
              </Typography>
              {worker.verified && (
                <Verified color="primary" fontSize="small" />
              )}
              {worker.online && (
                <Badge
                  color="success"
                  variant="dot"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
              {worker.profession}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={worker.rating} precision={0.1} readOnly size="small" />
              <Typography variant="caption" sx={{ ml: 1 }}>
                {worker.rating} ({worker.reviews})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {worker.experience} • {worker.location}
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
              transform: 'translateY(-8px)',
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
              backgroundColor: 'warning.main',
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
            TOP RATED
          </Box>

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

          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={worker.avatar}
                alt={worker.name}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              >
                {worker.name?.[0]}
              </Avatar>
              {worker.verified && (
                <Verified
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 0,
                    color: 'primary.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    fontSize: 24
                  }}
                />
              )}
              {worker.online && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    border: '2px solid white'
                  }}
                />
              )}
            </Box>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {worker.name}
            </Typography>

            <Typography variant="body1" color="primary" fontWeight="medium" sx={{ mb: 2 }}>
              {worker.profession}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Rating value={worker.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                {worker.rating} ({worker.reviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              {worker.specialties?.slice(0, 2).map((specialty, index) => (
                <Chip
                  key={index}
                  label={specialty}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Chip
                icon={<Work />}
                label={`${worker.completedJobs} jobs`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<LocationOn />}
                label={worker.location}
                size="small"
                variant="outlined"
              />
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

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            height: '100%',
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
            </Box>
          )}

          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={worker.avatar}
                  alt={worker.name}
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {worker.name?.[0]}
                </Avatar>
                {worker.online && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 12,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      border: '2px solid white'
                    }}
                  />
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                    {worker.name}
                  </Typography>
                  {worker.verified && (
                    <Verified color="primary" fontSize="small" />
                  )}
                </Box>
                <Typography variant="body1" color="primary" fontWeight="medium" sx={{ mb: 1 }}>
                  {worker.profession}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={worker.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {worker.rating} ({worker.reviews})
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              {worker.description}
            </Typography>

            {/* Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {worker.completedJobs}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Jobs Done
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {worker.experience}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Experience
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  {worker.responseTime}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Response
                </Typography>
              </Box>
            </Box>

            {/* Specialties */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Specialties:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {worker.specialties?.slice(0, 3).map((specialty, index) => (
                  <Chip
                    key={index}
                    label={specialty}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* Location and Pricing */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {worker.location}
                </Typography>
              </Box>
              <Chip
                icon={<MonetizationOn />}
                label={`Starting ${worker.startingPrice}`}
                color="primary"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleBookNow}
                sx={{ flexGrow: 1, fontWeight: 'bold' }}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                startIcon={<Phone />}
                onClick={handleContact}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Call
              </Button>
              <Button
                variant="outlined"
                startIcon={<Message />}
                onClick={handleMessage}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Chat
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
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

        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={worker.avatar}
                alt={worker.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              >
                {worker.name?.[0]}
              </Avatar>
              {worker.verified && (
                <Verified
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 8,
                    color: 'primary.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    fontSize: 20
                  }}
                />
              )}
              {worker.online && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 8,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    border: '2px solid white'
                  }}
                />
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {worker.name}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="medium">
                {worker.profession}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={worker.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {worker.rating} ({worker.reviews} reviews)
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {worker.description?.substring(0, 100)}...
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {worker.location}
            </Typography>
            <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {worker.experience}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip
              label={`Starting ${worker.startingPrice}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            <Typography variant="body2" color="text.secondary">
              {worker.completedJobs} jobs completed
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleBookNow}
            sx={{ mt: 'auto', fontWeight: 'bold' }}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default WorkerCard
