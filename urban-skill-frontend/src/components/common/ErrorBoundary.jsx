import React from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  Alert,
  Collapse,
  IconButton
} from '@mui/material'
import {
  ErrorOutline,
  Refresh,
  Home,
  BugReport,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material'
import { handleGlobalError } from '@utils/errorHandler'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Use your error handler
    const appError = handleGlobalError(error, errorInfo)
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Report to error monitoring service (if available)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      })
    }
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportBug = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    // You can integrate with your bug reporting system
    console.log('Bug Report:', errorReport)
    
    // For now, mailto link
    const subject = encodeURIComponent('Urban Skill - Bug Report')
    const body = encodeURIComponent(`
Bug Report Details:
- Error: ${this.state.error?.message}
- URL: ${window.location.href}
- Time: ${new Date().toLocaleString()}
- Browser: ${navigator.userAgent}

Please describe what you were doing when this error occurred:
[Your description here]
    `)
    
    window.open(`mailto:support@urbanskill.com?subject=${subject}&body=${body}`)
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }))
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI based on error type
      const isNetworkError = this.state.error?.message?.includes('fetch') || 
                            this.state.error?.message?.includes('network')
      
      const isChunkError = this.state.error?.message?.includes('ChunkLoadError') ||
                          this.state.error?.message?.includes('Loading chunk')

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}
          >
            {/* Error Icon */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'error.light',
                color: 'error.main',
                mb: 3
              }}
            >
              <ErrorOutline sx={{ fontSize: 40 }} />
            </Box>

            {/* Error Title */}
            <Typography variant="h4" fontWeight="bold" gutterBottom color="error.main">
              {isNetworkError ? 'Connection Problem' :
               isChunkError ? 'App Update Available' :
               'Oops! Something went wrong'}
            </Typography>

            {/* Error Description */}
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              {isNetworkError ? 
                'Please check your internet connection and try again.' :
               isChunkError ?
                'The app has been updated. Please refresh to get the latest version.' :
                'We\'re sorry for the inconvenience. Our team has been notified and is working on a fix.'}
            </Typography>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Refresh />}
                onClick={this.handleRefresh}
                sx={{ px: 4 }}
              >
                {isChunkError ? 'Update App' : 'Try Again'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                sx={{ px: 4 }}
              >
                Go Home
              </Button>

              {!isNetworkError && !isChunkError && (
                <Button
                  variant="text"
                  size="large"
                  startIcon={<BugReport />}
                  onClick={this.handleReportBug}
                  sx={{ px: 4 }}
                >
                  Report Bug
                </Button>
              )}
            </Stack>

            {/* Error Details (for development/debugging) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="text"
                  onClick={this.toggleDetails}
                  endIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                  sx={{ mb: 2 }}
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                </Button>
                
                <Collapse in={this.state.showDetails}>
                  <Alert severity="error" sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Error Message:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace' }}>
                      {this.state.error.message}
                    </Typography>
                    
                    {this.state.error.stack && (
                      <>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Stack Trace:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.75rem',
                            whiteSpace: 'pre-wrap',
                            maxHeight: 200,
                            overflow: 'auto',
                            backgroundColor: 'grey.100',
                            p: 1,
                            borderRadius: 1
                          }}
                        >
                          {this.state.error.stack}
                        </Typography>
                      </>
                    )}
                  </Alert>
                </Collapse>
              </Box>
            )}

            {/* Support Information */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact our support team at{' '}
                <Typography 
                  component="a" 
                  href="mailto:support@urbanskill.com"
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  support@urbanskill.com
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for hooks (if needed)
export const ErrorBoundaryWrapper = ({ children, fallback }) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}

// Higher-order component for wrapping specific components
export const withErrorBoundary = (Component, errorFallback) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

export default ErrorBoundary
