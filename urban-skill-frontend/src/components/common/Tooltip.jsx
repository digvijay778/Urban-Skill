import React, { useState, useRef, useEffect } from 'react'
import {
  Tooltip as MuiTooltip,
  Box,
  Typography,
  Paper,
  Popper,
  Fade,
  ClickAwayListener,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Info,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  Help,
  LightbulbOutlined
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const Tooltip = ({
  children,
  title,
  content,
  variant = 'default', // 'default', 'rich', 'interactive', 'info', 'warning', 'error', 'success'
  placement = 'top',
  arrow = true,
  trigger = 'hover', // 'hover', 'click', 'focus', 'manual'
  delay = 0,
  enterDelay = 100,
  leaveDelay = 0,
  open: controlledOpen,
  onOpen,
  onClose,
  disabled = false,
  maxWidth = 300,
  showIcon = false,
  interactive = false,
  followCursor = false,
  offset = [0, 8],
  className,
  ...props
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // State management
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const childRef = useRef(null)
  const tooltipRef = useRef(null)

  // Use controlled open state if provided
  const isOpen = controlledOpen !== undefined ? controlledOpen : open

  // Handle open/close
  const handleOpen = (event) => {
    if (disabled) return
    
    setAnchorEl(event.currentTarget)
    setOpen(true)
    onOpen?.(event)
  }

  const handleClose = (event) => {
    setOpen(false)
    onClose?.(event)
  }

  // Handle mouse events
  const handleMouseEnter = (event) => {
    if (trigger === 'hover' || trigger === 'focus') {
      setTimeout(() => handleOpen(event), enterDelay)
    }
  }

  const handleMouseLeave = (event) => {
    if (trigger === 'hover') {
      setTimeout(() => handleClose(event), leaveDelay)
    }
  }

  // Handle click events
  const handleClick = (event) => {
    if (trigger === 'click') {
      if (isOpen) {
        handleClose(event)
      } else {
        handleOpen(event)
      }
    }
  }

  // Handle focus events
  const handleFocus = (event) => {
    if (trigger === 'focus') {
      handleOpen(event)
    }
  }

  const handleBlur = (event) => {
    if (trigger === 'focus') {
      handleClose(event)
    }
  }

  // Handle click away for interactive tooltips
  const handleClickAway = (event) => {
    if (trigger === 'click' && interactive) {
      handleClose(event)
    }
  }

  // Get variant configuration
  const getVariantConfig = () => {
    switch (variant) {
      case 'info':
        return {
          icon: <Info />,
          color: theme.palette.info.main,
          backgroundColor: theme.palette.info.light,
          textColor: theme.palette.info.contrastText
        }
      case 'warning':
        return {
          icon: <Warning />,
          color: theme.palette.warning.main,
          backgroundColor: theme.palette.warning.light,
          textColor: theme.palette.warning.contrastText
        }
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: theme.palette.error.main,
          backgroundColor: theme.palette.error.light,
          textColor: theme.palette.error.contrastText
        }
      case 'success':
        return {
          icon: <CheckCircle />,
          color: theme.palette.success.main,
          backgroundColor: theme.palette.success.light,
          textColor: theme.palette.success.contrastText
        }
      default:
        return {
          icon: <Help />,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.grey[800],
          textColor: theme.palette.common.white
        }
    }
  }

  const variantConfig = getVariantConfig()

  // Default tooltip for simple cases
  if (variant === 'default' && !content && !interactive) {
    return (
      <MuiTooltip
        title={title}
        placement={placement}
        arrow={arrow}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
        open={controlledOpen}
        onOpen={onOpen}
        onClose={onClose}
        disableHoverListener={disabled}
        disableFocusListener={disabled}
        disableTouchListener={disabled}
        followCursor={followCursor}
        {...props}
      >
        {children}
      </MuiTooltip>
    )
  }

  // Rich tooltip content
  const renderTooltipContent = () => {
    if (variant === 'rich' || content) {
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            maxWidth,
            backgroundColor: variantConfig.backgroundColor,
            color: variantConfig.textColor,
            borderRadius: 2,
            ...(className && { className })
          }}
        >
          {showIcon && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
              <Box sx={{ color: variantConfig.color, mt: 0.25 }}>
                {variantConfig.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                {title && (
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {title}
                  </Typography>
                )}
                {content && (
                  <Typography variant="body2">
                    {content}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          
          {!showIcon && (
            <Box>
              {title && (
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {title}
                </Typography>
              )}
              {content && (
                <Typography variant="body2">
                  {content}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      )
    }

    return (
      <Paper
        elevation={8}
        sx={{
          px: 1.5,
          py: 1,
          backgroundColor: variantConfig.backgroundColor,
          color: variantConfig.textColor,
          borderRadius: 1,
          maxWidth
        }}
      >
        <Typography variant="body2">
          {title}
        </Typography>
      </Paper>
    )
  }

  // Interactive tooltip
  if (interactive || trigger === 'click') {
    const TooltipContent = () => (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Popper
            open={isOpen}
            anchorEl={anchorEl}
            placement={placement}
            transition
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: offset,
                },
              },
            ]}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <div>
                  {renderTooltipContent()}
                </div>
              </Fade>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    )

    return (
      <>
        {React.cloneElement(children, {
          ref: childRef,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          onClick: handleClick,
          onFocus: handleFocus,
          onBlur: handleBlur,
        })}
        {isOpen && <TooltipContent />}
      </>
    )
  }

  // Animated tooltip with Framer Motion
  return (
    <Box
      sx={{ display: 'inline-block', position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: placement.includes('top') ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: placement.includes('top') ? 10 : -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              zIndex: theme.zIndex.tooltip,
              ...(placement.includes('top') && { bottom: '100%', marginBottom: 8 }),
              ...(placement.includes('bottom') && { top: '100%', marginTop: 8 }),
              ...(placement.includes('left') && { right: '100%', marginRight: 8 }),
              ...(placement.includes('right') && { left: '100%', marginLeft: 8 }),
              ...(placement === 'top' && { left: '50%', transform: 'translateX(-50%)' }),
              ...(placement === 'bottom' && { left: '50%', transform: 'translateX(-50%)' }),
              ...(placement === 'left' && { top: '50%', transform: 'translateY(-50%)' }),
              ...(placement === 'right' && { top: '50%', transform: 'translateY(-50%)' }),
            }}
          >
            {renderTooltipContent()}
            
            {/* Arrow */}
            {arrow && (
              <Box
                sx={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  ...(placement.includes('top') && {
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${variantConfig.backgroundColor}`,
                  }),
                  ...(placement.includes('bottom') && {
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: `6px solid ${variantConfig.backgroundColor}`,
                  }),
                  ...(placement.includes('left') && {
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: `6px solid ${variantConfig.backgroundColor}`,
                  }),
                  ...(placement.includes('right') && {
                    right: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: `6px solid ${variantConfig.backgroundColor}`,
                  }),
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

// Specialized tooltip components
export const InfoTooltip = ({ children, ...props }) => (
  <Tooltip variant="info" showIcon {...props}>
    {children}
  </Tooltip>
)

export const WarningTooltip = ({ children, ...props }) => (
  <Tooltip variant="warning" showIcon {...props}>
    {children}
  </Tooltip>
)

export const ErrorTooltip = ({ children, ...props }) => (
  <Tooltip variant="error" showIcon {...props}>
    {children}
  </Tooltip>
)

export const SuccessTooltip = ({ children, ...props }) => (
  <Tooltip variant="success" showIcon {...props}>
    {children}
  </Tooltip>
)

// Help tooltip with question mark icon
export const HelpTooltip = ({ title, content, placement = 'top', ...props }) => (
  <Tooltip
    title={title}
    content={content}
    variant="info"
    placement={placement}
    showIcon
    {...props}
  >
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: 'info.main',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        cursor: 'help',
        ml: 0.5
      }}
    >
      ?
    </Box>
  </Tooltip>
)

// Tooltip hook for programmatic control
export const useTooltip = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const showTooltip = (element) => {
    setAnchorEl(element)
    setOpen(true)
  }

  const hideTooltip = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const toggleTooltip = (element) => {
    if (open) {
      hideTooltip()
    } else {
      showTooltip(element)
    }
  }

  return {
    open,
    anchorEl,
    showTooltip,
    hideTooltip,
    toggleTooltip
  }
}

export default Tooltip
