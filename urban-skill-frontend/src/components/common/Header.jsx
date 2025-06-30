import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,  // Added this for Material-UI v6
  ListItemIcon,
  ListItemText,
  Divider,
  Container
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person,
  Language,
  Notifications,
  Dashboard,
  Settings,
  Logout,
  Home,
  Build,
  Info,
  Phone,
  Work,
  Close
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Temporary constants until you create the constants file
const APP_CONFIG = {
  NAME: 'Urban Skill',
  SUPPORT_PHONE: '+91-1234567890',
  SUPPORT_EMAIL: 'support@urbanskill.com'
}

const Header = () => {
  // Hooks
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated, logout, hasRole } = useAuth()

  // State
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null)

  // Navigation items
  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Services', path: '/services', icon: <Build /> },
    { label: 'How it Works', path: '/how-it-works', icon: <Info /> },
    { label: 'About', path: '/about', icon: <Info /> },
    { label: 'Contact', path: '/contact', icon: <Phone /> },
  ]

  // Worker/Professional navigation
  const workerNavItems = [
    { label: 'Join as Professional', path: '/register?role=worker', icon: <Work /> },
  ]

  // Handle menu actions
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null)
  }

  const handleNotificationMenuOpen = (event) => {
    setNotificationMenuAnchor(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null)
  }

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null)
  }

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileDrawerOpen(false)
    handleProfileMenuClose()
  }

  const handleLogout = async () => {
    await logout()
    handleProfileMenuClose()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (hasRole && hasRole('admin')) return '/admin/dashboard'
    if (hasRole && hasRole('worker')) return '/worker/dashboard'
    return '/dashboard'
  }

  // Profile menu items
  const profileMenuItems = [
    { label: 'Dashboard', path: getDashboardPath(), icon: <Dashboard /> },
    { label: 'Profile', path: '/profile', icon: <Person /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ]

  // Mobile drawer content
  const mobileDrawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {APP_CONFIG.NAME}
        </Typography>
        <IconButton onClick={handleMobileDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider />

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1 }}>
        {navigationItems.map((item) => (
          <ListItemButton 
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        {!isAuthenticated && workerNavItems.map((item) => (
          <ListItemButton 
            key={item.label}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      {/* User Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        {isAuthenticated ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={user?.avatar} 
                sx={{ width: 40, height: 40, mr: 2 }}
              >
                {user?.firstName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            
            {profileMenuItems.map((item) => (
              <ListItemButton 
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{ px: 0 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            
            <ListItemButton onClick={handleLogout} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => handleNavigation('/login')}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={() => handleNavigation('/register')}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleMobileDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                cursor: 'pointer',
                mr: { xs: 'auto', md: 4 }
              }}
              onClick={() => handleNavigation('/')}
            >
              {APP_CONFIG.NAME}
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => handleNavigation(item.path)}
                    sx={{ 
                      fontWeight: 500,
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Language Toggle */}
              <IconButton 
                color="inherit" 
                onClick={handleLanguageMenuOpen}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <Language />
              </IconButton>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <IconButton 
                    color="inherit" 
                    onClick={handleNotificationMenuOpen}
                  >
                    <Badge badgeContent={3} color="error">
                      <Notifications />
                    </Badge>
                  </IconButton>

                  {/* Profile Menu */}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ p: 0, ml: 1 }}
                  >
                    <Avatar 
                      src={user?.avatar}
                      sx={{ width: 32, height: 32 }}
                    >
                      {user?.firstName?.[0]}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                !isMobile && (
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <Button 
                      color="inherit" 
                      onClick={() => handleNavigation('/login')}
                      sx={{ fontWeight: 500 }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => handleNavigation('/register')}
                      sx={{ fontWeight: 500 }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {mobileDrawerContent}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        {/* Menu Items */}
        {profileMenuItems.map((item) => (
          <MenuItem 
            key={item.label}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ minWidth: 36 }}><Logout /></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            maxWidth: 320,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              New booking request
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Payment received
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Service completed
            </Typography>
            <Typography variant="caption" color="text.secondary">
              3 hours ago
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleNavigation('/notifications')}>
          <Typography variant="body2" color="primary" fontWeight="bold">
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { mt: 1.5 },
        }}
      >
        <MenuItem onClick={handleLanguageMenuClose}>
          <Typography>English</Typography>
        </MenuItem>
        <MenuItem onClick={handleLanguageMenuClose}>
          <Typography>हिंदी</Typography>
        </MenuItem>
        <MenuItem onClick={handleLanguageMenuClose}>
          <Typography>বাংলা</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default Header
