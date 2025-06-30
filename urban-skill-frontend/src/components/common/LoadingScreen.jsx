import React from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Fade,
  useTheme
} from '@mui/material'
import { APP_CONFIG } from '@utils/constants'

const LoadingScreen = ({ 
  message = 'Loading...', 
  showProgress = false, 
  progress = 0,
  variant = 'circular' // 'circular', 'linear', 'dots', 'skeleton'
}) => {
  const theme = useTheme()

  // Circular loading (default)
  const CircularLoader = () => (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          gap: 3
        }}
      >
        {/* App Logo/Brand */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 1
            }}
          >
            {APP_CONFIG.NAME}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Professional Service Platform
          </Typography>
        </Box>

        {/* Loading Animation */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: 'primary.main',
              animationDuration: '1.5s'
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="primary.main"
              fontWeight="bold"
            >
              ⚡
            </Typography>
          </Box>
        </Box>

        {/* Loading Message */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>

        {/* Progress Bar (if enabled) */}
        {showProgress && (
          <Box sx={{ width: 200, mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                }
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block', textAlign: 'center' }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
        )}

        {/* Loading Tips */}
        <Box sx={{ mt: 4, maxWidth: 300, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Tip:</strong> Book verified professionals for all your home service needs
          </Typography>
        </Box>
      </Box>
    </Fade>
  )

  // Linear loading
  const LinearLoader = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'background.paper'
      }}
    >
      <LinearProgress
        sx={{
          height: 4,
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
          }
        }}
      />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Box>
  )

  // Dots loading
  const DotsLoader = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 1
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: 'bounce 1.4s ease-in-out infinite both',
            animationDelay: `${index * 0.16}s`,
            '@keyframes bounce': {
              '0%, 80%, 100%': {
                transform: 'scale(0)',
              },
              '40%': {
                transform: 'scale(1)',
              },
            },
          }}
        />
      ))}
      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
        {message}
      </Typography>
    </Box>
  )

  // Skeleton loading
  const SkeletonLoader = () => (
    <Box sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      {[...Array(3)].map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box
            sx={{
              height: 20,
              backgroundColor: 'grey.200',
              borderRadius: 1,
              mb: 1,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.4 },
                '100%': { opacity: 1 },
              },
            }}
          />
          <Box
            sx={{
              height: 16,
              backgroundColor: 'grey.200',
              borderRadius: 1,
              width: '60%',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          />
        </Box>
      ))}
    </Box>
  )

  // Render based on variant
  switch (variant) {
    case 'linear':
      return <LinearLoader />
    case 'dots':
      return <DotsLoader />
    case 'skeleton':
      return <SkeletonLoader />
    default:
      return <CircularLoader />
  }
}

// Specialized loading components for different scenarios
export const PageLoader = ({ message = 'Loading page...' }) => (
  <LoadingScreen message={message} variant="circular" />
)

export const InlineLoader = ({ message = 'Loading...' }) => (
  <LoadingScreen message={message} variant="dots" />
)

export const ProgressLoader = ({ message = 'Processing...', progress = 0 }) => (
  <LoadingScreen message={message} showProgress={true} progress={progress} />
)

export const SkeletonLoader = ({ message = 'Loading content...' }) => (
  <LoadingScreen message={message} variant="skeleton" />
)

export default LoadingScreen
