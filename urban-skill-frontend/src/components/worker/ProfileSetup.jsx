import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  Paper
} from '@mui/material'
import {
  Person,
  Edit,
  Save,
  Cancel,
  LocationOn,
  Add,
  Delete,
  CreditCard,
  Phone,
  Email,
  Security,
  Notifications,
  Language,
  Help,
  Logout,
  Verified,
  Camera,
  Home,
  Work as WorkIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'

const CustomerProfile = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, updateProfile, logout } = useAuth()

  // State management
  const [activeTab, setActiveTab] = useState(0)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    avatar: user?.avatar || ''
  })
  const [addresses, setAddresses] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    language: 'en',
    currency: 'INR'
  })

  // Dialog states
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  })
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    isDefault: false
  })

  // Mock data
  const mockAddresses = [
    {
      id: 1,
      type: 'home',
      name: 'Home',
      address: '123, Rajiv Gandhi Nagar, Near IIIT Kota',
      city: 'Kota',
      state: 'Rajasthan',
      pincode: '324005',
      landmark: 'Near IIIT Kota',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Office',
      address: '456, Industrial Area, Kota',
      city: 'Kota',
      state: 'Rajasthan',
      pincode: '324007',
      landmark: 'Near City Mall',
      isDefault: false
    }
  ]

  const mockPaymentMethods = [
    {
      id: 1,
      type: 'card',
      cardNumber: '**** **** **** 1234',
      cardType: 'Visa',
      expiryDate: '12/26',
      cardholderName: 'John Doe',
      isDefault: true
    },
    {
      id: 2,
      type: 'upi',
      upiId: 'john@paytm',
      isDefault: false
    }
  ]

  // Load profile data
  useEffect(() => {
    setAddresses(mockAddresses)
    setPaymentMethods(mockPaymentMethods)
  }, [])

  // Handle profile update
  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const result = await updateProfile(profileData)
      if (result.success) {
        setEditing(false)
      }
    } catch (error) {
      console.error('Profile update failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle address operations
  const handleAddAddress = async () => {
    try {
      // API call to add address
      const newId = addresses.length + 1
      setAddresses(prev => [...prev, { ...newAddress, id: newId }])
      setAddressDialogOpen(false)
      setNewAddress({
        type: 'home',
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false
      })
    } catch (error) {
      console.error('Failed to add address:', error)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  // Handle payment method operations
  const handleAddPaymentMethod = async () => {
    try {
      const newId = paymentMethods.length + 1
      setPaymentMethods(prev => [...prev, { ...newPaymentMethod, id: newId }])
      setPaymentDialogOpen(false)
      setNewPaymentMethod({
        type: 'card',
        cardNumber: '',
        expiryDate: '',
        cardholderName: '',
        isDefault: false
      })
    } catch (error) {
      console.error('Failed to add payment method:', error)
    }
  }

  const handleDeletePaymentMethod = async (methodId) => {
    try {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
    } catch (error) {
      console.error('Failed to delete payment method:', error)
    }
  }

  // Tab content
  const getTabContent = () => {
    switch (activeTab) {
      case 0: // Personal Info
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Personal Information
                </Typography>
                <Button
                  variant={editing ? "outlined" : "contained"}
                  startIcon={editing ? <Cancel /> : <Edit />}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              {/* Avatar Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profileData.avatar}
                    sx={{ width: 100, height: 100, mr: 3 }}
                  >
                    {profileData.firstName?.[0]}
                  </Avatar>
                  {editing && (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' }
                      }}
                      size="small"
                    >
                      <Camera fontSize="small" />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </IconButton>
                  )}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {profileData.firstName} {profileData.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer since {new Date(user?.createdAt || Date.now()).getFullYear()}
                  </Typography>
                  <Chip
                    label="Verified"
                    color="success"
                    size="small"
                    icon={<Verified />}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              {/* Form Fields */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      endAdornment: <Verified color="success" />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      endAdornment: <Verified color="success" />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!editing}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Gender"
                    select
                    value={profileData.gender}
                    onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                    disabled={!editing}
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </TextField>
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleProfileUpdate}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )

      case 1: // Addresses
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Saved Addresses
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddressDialogOpen(true)}
                >
                  Add Address
                </Button>
              </Box>

              <List>
                {addresses.map((address, index) => (
                  <React.Fragment key={address.id}>
                    <ListItem>
                      <ListItemIcon>
                        {address.type === 'home' ? <Home /> : <WorkIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {address.name}
                            </Typography>
                            {address.isDefault && (
                              <Chip label="Default" color="primary" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {address.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {address.city}, {address.state} - {address.pincode}
                            </Typography>
                            {address.landmark && (
                              <Typography variant="body2" color="text.secondary">
                                Landmark: {address.landmark}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={address.isDefault}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < addresses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )

      case 2: // Payment Methods
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Payment Methods
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  Add Payment Method
                </Button>
              </Box>

              <List>
                {paymentMethods.map((method, index) => (
                  <React.Fragment key={method.id}>
                    <ListItem>
                      <ListItemIcon>
                        <CreditCard />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {method.type === 'card' ? method.cardNumber : method.upiId}
                            </Typography>
                            {method.isDefault && (
                              <Chip label="Default" color="primary" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          method.type === 'card' 
                            ? `${method.cardType} • Expires ${method.expiryDate}`
                            : 'UPI Payment'
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          disabled={method.isDefault}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < paymentMethods.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )

      case 3: // Settings
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Settings
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon><Notifications /></ListItemIcon>
                  <ListItemText primary="Notifications" secondary="Manage your notification preferences" />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">Configure</Button>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><Security /></ListItemIcon>
                  <ListItemText primary="Security" secondary="Change password and security settings" />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">Manage</Button>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><Language /></ListItemIcon>
                  <ListItemText primary="Language & Region" secondary="Change language and currency" />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">Change</Button>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon><Help /></ListItemIcon>
                  <ListItemText primary="Help & Support" secondary="Get help and contact support" />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">Contact</Button>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem>
                  <ListItemIcon><Logout color="error" /></ListItemIcon>
                  <ListItemText 
                    primary={<Typography color="error">Logout</Typography>}
                    secondary="Sign out of your account" 
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" color="error" onClick={logout}>
                      Logout
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your personal information and preferences
        </Typography>
      </motion.div>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
        >
          <Tab icon={<Person />} label="Personal Info" />
          <Tab icon={<LocationOn />} label="Addresses" />
          <Tab icon={<CreditCard />} label="Payment Methods" />
          <Tab icon={<Security />} label="Settings" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getTabContent()}
      </motion.div>

      {/* Add Address Dialog */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address Type"
                select
                value={newAddress.type}
                onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                SelectProps={{ native: true }}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Address Name"
                value={newAddress.name}
                onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Home, Office"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full Address"
                multiline
                rows={2}
                value={newAddress.address}
                onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Landmark (Optional)"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAddress}>
            Add Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Your payment information is encrypted and secure. We never store your card details.
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Payment Type"
                select
                value={newPaymentMethod.type}
                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, type: e.target.value }))}
                SelectProps={{ native: true }}
              >
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
              </TextField>
            </Grid>
            {newPaymentMethod.type === 'card' && (
              <>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={newPaymentMethod.expiryDate}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={newPaymentMethod.cardholderName}
                    onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPaymentMethod}>
            Add Payment Method
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CustomerProfile
