import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Collapse,
  Badge,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Dashboard,
  Person,
  Work,
  Assignment,
  Payment,
  Settings,
  Help,
  Logout,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Notifications,
  Star,
  History,
  Analytics,
  People,
  VerifiedUser,
  Schedule,
  MonetizationOn,
  Support,
  Security,
  Language,
  DarkMode,
  LightMode,
  Home,
  Search,
  Favorite,
  Message,
  LocationOn,
  CreditCard,
  Receipt,
  Reviews,
  BookOnline,
  AccountBalance,
  Business,
  Verified,
  TrendingUp
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@context/AuthContext'

const Sidebar = ({
  open = true,
  onClose,
  onToggle,
  variant = 'permanent', // 'permanent', 'persistent', 'temporary'
  width = 280,
  collapsedWidth = 64,
  showUserProfile = true,
  showToggleButton = true,
  customMenuItems = [],
  darkMode = false,
  onDarkModeToggle
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, hasRole } = useAuth()

  // State management
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <Dashboard />,
        path: '/dashboard',
        roles: ['customer', 'worker', 'admin']
      },
      {
        id: 'home',
        label: 'Home',
        icon: <Home />,
        path: '/',
        roles: ['customer']
      },
      {
        id: 'services',
        label: 'Services',
        icon: <Search />,
        path: '/services',
        roles: ['customer']
      },
      {
        id: 'bookings',
        label: 'My Bookings',
        icon: <BookOnline />,
        path: '/bookings',
        badge: 3,
        roles: ['customer'],
        children: [
          { id: 'active-bookings', label: 'Active', path: '/bookings/active', icon: <Schedule /> },
          { id: 'booking-history', label: 'History', path: '/bookings/history', icon: <History /> }
        ]
      },
      {
        id: 'favorites',
        label: 'Favorites',
        icon: <Favorite />,
        path: '/favorites',
        roles: ['customer']
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: <Message />,
        path: '/messages',
        badge: 2,
        roles: ['customer', 'worker']
      }
    ]

    const workerItems = [
      {
        id: 'worker-dashboard',
        label: 'Dashboard',
        icon: <Dashboard />,
        path: '/worker/dashboard',
        roles: ['worker']
      },
      {
        id: 'job-requests',
        label: 'Job Requests',
        icon: <Assignment />,
        path: '/worker/jobs',
        badge: 5,
        roles: ['worker']
      },
      {
        id: 'schedule',
        label: 'Schedule',
        icon: <Schedule />,
        path: '/worker/schedule',
        roles: ['worker']
      },
      {
        id: 'earnings',
        label: 'Earnings',
        icon: <MonetizationOn />,
        path: '/worker/earnings',
        roles: ['worker'],
        children: [
          { id: 'current-earnings', label: 'Current', path: '/worker/earnings/current', icon: <TrendingUp /> },
          { id: 'payment-history', label: 'History', path: '/worker/earnings/history', icon: <Receipt /> }
        ]
      },
      {
        id: 'worker-profile',
        label: 'Profile',
        icon: <Person />,
        path: '/worker/profile',
        roles: ['worker']
      },
      {
        id: 'worker-reviews',
        label: 'Reviews',
        icon: <Star />,
        path: '/worker/reviews',
        roles: ['worker']
      }
    ]

    const adminItems = [
      {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: <Dashboard />,
        path: '/admin/dashboard',
        roles: ['admin']
      },
      {
        id: 'user-management',
        label: 'User Management',
        icon: <People />,
        path: '/admin/users',
        roles: ['admin'],
        children: [
          { id: 'customers', label: 'Customers', path: '/admin/users/customers', icon: <Person /> },
          { id: 'workers', label: 'Workers', path: '/admin/users/workers', icon: <Work /> }
        ]
      },
      {
        id: 'verifications',
        label: 'Verifications',
        icon: <VerifiedUser />,
        path: '/admin/verifications',
        badge: 12,
        roles: ['admin']
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <Analytics />,
        path: '/admin/analytics',
        roles: ['admin']
      },
      {
        id: 'service-management',
        label: 'Services',
        icon: <Business />,
        path: '/admin/services',
        roles: ['admin']
      },
      {
        id: 'payment-management',
        label: 'Payments',
        icon: <Payment />,
        path: '/admin/payments',
        roles: ['admin']
      }
    ]

    const profileItems = [
      {
        id: 'profile',
        label: 'My Profile',
        icon: <Person />,
        path: '/profile',
        roles: ['customer', 'worker', 'admin']
      },
      {
        id: 'payment-methods',
        label: 'Payment Methods',
        icon: <CreditCard />,
        path: '/payment-methods',
        roles: ['customer']
      },
      {
        id: 'addresses',
        label: 'Addresses',
        icon: <LocationOn />,
        path: '/addresses',
        roles: ['customer']
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: <Notifications />,
        path: '/notifications',
        badge: 7,
        roles: ['customer', 'worker', 'admin']
      }
    ]

    const settingsItems = [
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings />,
        path: '/settings',
        roles: ['customer', 'worker', 'admin'],
        children: [
          { id: 'account-settings', label: 'Account', path: '/settings/account', icon: <Person /> },
          { id: 'security-settings', label: 'Security', path: '/settings/security', icon: <Security /> },
          { id: 'language-settings', label: 'Language', path: '/settings/language', icon: <Language /> }
        ]
      },
      {
        id: 'help',
        label: 'Help & Support',
        icon: <Help />,
        path: '/help',
        roles: ['customer', 'worker', 'admin']
      }
    ]

    // Filter items based on user role
    const filterByRole = (items) => {
      return items.filter(item => {
        if (!item.roles) return true
        return item.roles.some(role => hasRole(role))
      })
    }

    let menuItems = []

    if (hasRole('customer')) {
      menuItems = [...baseItems, ...profileItems, ...settingsItems]
    } else if (hasRole('worker')) {
      menuItems = [...workerItems, ...profileItems, ...settingsItems]
    } else if (hasRole('admin')) {
      menuItems = [...adminItems, ...profileItems, ...settingsItems]
    }

    // Add custom menu items
    if (customMenuItems.length > 0) {
      menuItems = [...menuItems, ...customMenuItems]
    }

    return filterByRole(menuItems)
  }

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile && variant === 'temporary') {
      onClose?.()
    }
  }

  // Handle expand/collapse
  const handleToggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  // Handle sidebar toggle
  const handleToggle = () => {
    setCollapsed(!collapsed)
    onToggle?.(!collapsed)
  }

  // Check if item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  // Render menu item
  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]
    const active = isActive(item.path)

    return (
      <Box key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleToggleExpand(item.id)
              } else {
                handleNavigation(item.path)
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
              pl: level > 0 ? 4 : 2.5,
              backgroundColor: active ? 'primary.light' : 'transparent',
              color: active ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: active ? 'primary.light' : 'action.hover',
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 'auto' : 3,
                justifyContent: 'center',
                color: active ? 'primary.main' : 'inherit'
              }}
            >
              <Badge badgeContent={item.badge} color="error">
                {item.icon}
              </Badge>
            </ListItemIcon>
            
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: collapsed ? 0 : 1,
                    fontWeight: active ? 'bold' : 'normal'
                  }}
                />
                {hasChildren && (
                  isExpanded ? <ExpandLess /> : <ExpandMore />
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {/* Submenu items */}
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    )
  }

  // Sidebar content
  const sidebarContent = (
    <Box
      sx={{
        width: collapsed ? collapsedWidth : width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold" color="primary">
            Urban Skill
          </Typography>
        )}
        
        {showToggleButton && (
          <IconButton onClick={handleToggle} size="small">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {/* User Profile */}
      {showUserProfile && user && (
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            textAlign: collapsed ? 'center' : 'left'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 2
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{ width: collapsed ? 32 : 48, height: collapsed ? 32 : 48 }}
            >
              {user.firstName?.[0]}
            </Avatar>
            
            {!collapsed && (
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user.email}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={user.role}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {user.verified && (
                    <Verified color="success" fontSize="small" />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 1 }}>
        <List>
          {getMenuItems().map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Dark Mode Toggle */}
      {!collapsed && onDarkModeToggle && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => onDarkModeToggle(e.target.checked)}
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
              />
            }
            label="Dark Mode"
          />
        </Box>
      )}

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItemButton
          onClick={logout}
          sx={{
            justifyContent: collapsed ? 'center' : 'initial',
            px: 2,
            borderRadius: 1,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.dark'
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 'auto' : 3,
              justifyContent: 'center',
              color: 'inherit'
            }}
          >
            <Logout />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Logout" />
          )}
        </ListItemButton>
      </Box>
    </Box>
  )

  // Render based on variant
  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  if (variant === 'persistent') {
    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: collapsed ? collapsedWidth : width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : width,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  // Permanent variant (default)
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : width,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      open
    >
      {sidebarContent}
    </Drawer>
  )
}

export default Sidebar
