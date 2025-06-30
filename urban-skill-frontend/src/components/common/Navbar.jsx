import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  MoreVert,
  Home,
  Work,
  Info,
  ContactMail,
  Dashboard,
  Person,
  ExitToApp,
  Close
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const Navbar = ({
  position = 'static', // 'static', 'fixed', 'sticky'
  elevation = 1,
  showNotifications = true,
  showMobileMenu = true,
  transparent = false,
  onMenuToggle
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated, logout, hasRole } = useAuth()

  // State management
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(4)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  // Navigation items
  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home />, public: true },
    { label: 'Services', path: '/services', icon: <Work />, public: true },
    { label: 'About', path: '/about', icon: <Info />, public: true },
    { label: 'Contact', path: '/contact', icon: <ContactMail />, public: true }
  ]

  // User menu items
  const userMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Profile', path: '/profile', icon: <Person /> }
  ]

  // Handle menu actions
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
    onMenuToggle?.(!mobileDrawerOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    handleMenuClose()
    setMobileDrawerOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    handleMenuClose()
    navigate('/')
  }

  const handleNotificationClick = () => {
    navigate('/notifications')
    setNotificationCount(0)
  }

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path
  }

  // Profile menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1,
          borderRadius: 2,
          minWidth: 200,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }
        }
      }}
    >
      {userMenuItems.map((item) => (
        <MenuItem
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
        >
          {item.icon}
          {item.label}
        </MenuItem>
      ))}
      <Divider sx={{ my: 1 }} />
      <MenuItem
        onClick={handleLogout}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: 'error.main',
          '&:hover': {
            backgroundColor: 'error.light',
            color: 'error.dark'
          }
        }}
      >
        <ExitToApp />
        Logout
      </MenuItem>
    </Menu>
  )

  // Mobile menu
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {showNotifications && (
        <MenuItem onClick={handleNotificationClick}>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  // Mobile drawer
  const renderMobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: { width: 280 }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Urban Skill
        </Typography>
        <IconButton onClick={() => setMobileDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {isAuthenticated && (
        <>
          <Divider sx={{ my: 2 }} />
          <List>
            {userMenuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.main'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.dark'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  )

  return (
    <>
      <AppBar
        position={position}
        elevation={transparent ? 0 : elevation}
        sx={{
          backgroundColor: transparent ? 'transparent' : 'primary.main',
          backdropFilter: transparent ? 'blur(10px)' : 'none',
          borderBottom: transparent ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && showMobileMenu && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={handleMobileDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: isMobile ? 1 : 0,
                cursor: 'pointer',
                fontWeight: 'bold',
                mr: 4
              }}
              onClick={() => handleNavigation('/')}
            >
              Urban Skill
            </Typography>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Actions */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              {showNotifications && !isMobile && (
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationClick}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              )}

              {/* Profile Menu */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {user?.avatar ? (
                  <Avatar
                    src={user.avatar}
                    alt={user.firstName}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>

              {/* Mobile More Menu */}
              {isMobile && (
                <IconButton
                  size="large"
                  aria-label="show more"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreVert />
                </IconButton>
              )}
            </Box>
          ) : (
            /* Guest Actions */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                onClick={() => handleNavigation('/login')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleNavigation('/register')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Render Menus */}
      {renderMenu}
      {renderMobileMenu}
      {renderMobileDrawer}
    </>
  )
}

export default Navbar
