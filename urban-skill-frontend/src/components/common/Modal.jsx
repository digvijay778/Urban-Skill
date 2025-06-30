import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  Slide,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Backdrop,
  Paper
} from '@mui/material'
import {
  Close,
  Fullscreen,
  FullscreenExit,
  Minimize,
  Warning,
  Info,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

// Transition components for different animations
const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const FadeTransition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const ZoomTransition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />
})

const Modal = ({
  open = false,
  onClose,
  title,
  children,
  actions,
  variant = 'default', // 'default', 'confirmation', 'form', 'fullscreen', 'drawer'
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl', 'fullWidth'
  animation = 'slide', // 'slide', 'fade', 'zoom', 'none'
  showCloseButton = true,
  showFullscreenButton = false,
  closable = true,
  backdrop = true,
  backdropClose = true,
  persistent = false,
  loading = false,
  type = 'default', // 'default', 'success', 'warning', 'error', 'info'
  className,
  onFullscreenToggle,
  ...props
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // State management
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const modalRef = useRef(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && closable && !persistent) {
        onClose?.()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, closable, persistent, onClose])

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (backdropClose && closable && !persistent && event.target === event.currentTarget) {
      onClose?.()
    }
  }

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreenToggle?.(!isFullscreen)
  }

  // Handle minimize
  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  // Get transition component
  const getTransitionComponent = () => {
    switch (animation) {
      case 'fade':
        return FadeTransition
      case 'zoom':
        return ZoomTransition
      case 'slide':
        return SlideTransition
      case 'none':
        return undefined
      default:
        return SlideTransition
    }
  }

  // Get modal size
  const getMaxWidth = () => {
    if (isFullscreen || variant === 'fullscreen') return false
    if (size === 'fullWidth') return false
    return size
  }

  // Get type icon and color
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircle />, color: 'success.main' }
      case 'warning':
        return { icon: <Warning />, color: 'warning.main' }
      case 'error':
        return { icon: <ErrorIcon />, color: 'error.main' }
      case 'info':
        return { icon: <Info />, color: 'info.main' }
      default:
        return { icon: null, color: 'text.primary' }
    }
  }

  const typeConfig = getTypeConfig()

  // Confirmation variant
  if (variant === 'confirmation') {
    return (
      <Dialog
        open={open}
        onClose={closable ? onClose : undefined}
        TransitionComponent={getTransitionComponent()}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={!closable || persistent}
        {...props}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          {typeConfig.icon && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: `${typeConfig.color.split('.')[0]}.light`,
                color: typeConfig.color,
                mb: 2
              }}
            >
              {React.cloneElement(typeConfig.icon, { sx: { fontSize: 32 } })}
            </Box>
          )}
          
          {title && (
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
          )}
          
          <Typography variant="body1" color="text.secondary">
            {children}
          </Typography>
        </DialogContent>
        
        {actions && (
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            {actions}
          </DialogActions>
        )}
      </Dialog>
    )
  }

  // Fullscreen variant
  if (variant === 'fullscreen' || isFullscreen) {
    return (
      <Dialog
        open={open}
        onClose={closable ? onClose : undefined}
        fullScreen
        TransitionComponent={getTransitionComponent()}
        disableEscapeKeyDown={!closable || persistent}
        {...props}
      >
        {/* Fullscreen Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {showFullscreenButton && (
              <IconButton onClick={handleFullscreenToggle}>
                <FullscreenExit />
              </IconButton>
            )}
            {showCloseButton && closable && (
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Fullscreen Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {children}
        </Box>

        {/* Fullscreen Actions */}
        {actions && (
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            {actions}
          </Box>
        )}
      </Dialog>
    )
  }

  // Drawer variant (slide from side)
  if (variant === 'drawer') {
    return (
      <Dialog
        open={open}
        onClose={closable ? onClose : undefined}
        TransitionComponent={SlideTransition}
        maxWidth={false}
        fullWidth={false}
        disableEscapeKeyDown={!closable || persistent}
        PaperProps={{
          sx: {
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: { xs: '100vw', sm: 400, md: 500 },
            margin: 0,
            borderRadius: 0
          }
        }}
        {...props}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          {showCloseButton && closable && (
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          {children}
        </DialogContent>

        {actions && (
          <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
            {actions}
          </DialogActions>
        )}
      </Dialog>
    )
  }

  // Default variant
  return (
    <Dialog
      open={open}
      onClose={closable && !persistent ? onClose : undefined}
      TransitionComponent={getTransitionComponent()}
      maxWidth={getMaxWidth()}
      fullWidth={size === 'fullWidth' || isFullscreen}
      fullScreen={isFullscreen}
      disableEscapeKeyDown={!closable || persistent}
      BackdropComponent={backdrop ? Backdrop : undefined}
      BackdropProps={{
        onClick: handleBackdropClick,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
      PaperProps={{
        sx: {
          borderRadius: isFullscreen ? 0 : 3,
          minHeight: isMinimized ? 60 : 'auto',
          ...(className && { className })
        }
      }}
      {...props}
    >
      {/* Modal Header */}
      {(title || showCloseButton || showFullscreenButton) && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            ...(isMinimized && { pb: 0 })
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {typeConfig.icon && (
              <Box sx={{ color: typeConfig.color }}>
                {typeConfig.icon}
              </Box>
            )}
            <Typography variant="h6" fontWeight="bold" color={typeConfig.color}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={handleMinimize}>
              <Minimize />
            </IconButton>
            
            {showFullscreenButton && (
              <IconButton size="small" onClick={handleFullscreenToggle}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            )}
            
            {showCloseButton && closable && (
              <IconButton size="small" onClick={onClose}>
                <Close />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
      )}

      {/* Modal Content */}
      {!isMinimized && (
        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 200
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    border: '4px solid',
                    borderColor: 'primary.light',
                    borderTopColor: 'primary.main',
                    borderRadius: '50%'
                  }}
                />
              </motion.div>
            </Box>
          ) : (
            children
          )}
        </DialogContent>
      )}

      {/* Modal Actions */}
      {!isMinimized && actions && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  )
}

// Confirmation Modal Hook
export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({})

  const showConfirmation = ({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    onConfirm,
    onCancel
  }) => {
    setConfig({
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
      onCancel
    })
    setIsOpen(true)
  }

  const handleConfirm = () => {
    config.onConfirm?.()
    setIsOpen(false)
  }

  const handleCancel = () => {
    config.onCancel?.()
    setIsOpen(false)
  }

  const ConfirmationModal = () => (
    <Modal
      open={isOpen}
      onClose={handleCancel}
      title={config.title}
      variant="confirmation"
      type={config.type}
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            size="large"
          >
            {config.cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            size="large"
            color={config.type === 'error' ? 'error' : 'primary'}
          >
            {config.confirmText}
          </Button>
        </Box>
      }
    >
      {config.message}
    </Modal>
  )

  return {
    showConfirmation,
    ConfirmationModal
  }
}

// Alert Modal Hook
export const useAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({})

  const showAlert = ({
    title = 'Alert',
    message = '',
    type = 'info',
    buttonText = 'OK',
    onClose
  }) => {
    setConfig({
      title,
      message,
      type,
      buttonText,
      onClose
    })
    setIsOpen(true)
  }

  const handleClose = () => {
    config.onClose?.()
    setIsOpen(false)
  }

  const AlertModal = () => (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={config.title}
      variant="confirmation"
      type={config.type}
      actions={
        <Button
          variant="contained"
          onClick={handleClose}
          size="large"
        >
          {config.buttonText}
        </Button>
      }
    >
      {config.message}
    </Modal>
  )

  return {
    showAlert,
    AlertModal
  }
}

export default Modal
