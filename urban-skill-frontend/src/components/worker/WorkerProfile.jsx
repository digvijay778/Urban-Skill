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
  Paper,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  
 
} from '@mui/material'
import {
  Person,
  Edit,
  Save,
  Cancel,
  Work,
  Add,
  Delete,
  Star,
  Verified,
  Camera,
  Upload,
  Download,
  Schedule,
  LocationOn,
  Phone,
  Email,
  Security,
  Visibility,
  MonetizationOn,
  Assignment,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../..context/AuthContext'
import { apiService } from '../../services/api'

const WorkerProfile = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, updateProfile } = useAuth()

  // State management
  const [activeTab, setActiveTab] = useState(0)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profession: user?.profession || '',
    experience: user?.experience || '',
    location: user?.location || '',
    description: user?.description || '',
    avatar: user?.avatar || '',
    hourlyRate: user?.hourlyRate || '',
    minimumCharge: user?.minimumCharge || '',
    emergencyRate: user?.emergencyRate || ''
  })
  
  const [skills, setSkills] = useState([])
  const [documents, setDocuments] = useState([])
  const [availability, setAvailability] = useState({})
  const [portfolio, setPortfolio] = useState([])
  const [verificationStatus, setVerificationStatus] = useState({})

  // Dialog states
  const [skillDialogOpen, setSkillDialogOpen] = useState(false)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newDocument, setNewDocument] = useState({
    type: '',
    name: '',
    file: null
  })
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    images: [],
    completedDate: ''
  })

  // Mock data
  const mockSkills = [
    { id: 1, name: 'Electrical Wiring', verified: true },
    { id: 2, name: 'Appliance Repair', verified: true },
    { id: 3, name: 'Safety Inspection', verified: false },
    { id: 4, name: 'Smart Home Setup', verified: true }
  ]

  const mockDocuments = [
    {
      id: 1,
      type: 'identity',
      name: 'Aadhaar Card',
      status: 'verified',
      uploadedAt: '2025-06-20',
      expiryDate: null
    },
    {
      id: 2,
      type: 'professional',
      name: 'Electrician License',
      status: 'verified',
      uploadedAt: '2025-06-20',
      expiryDate: '2026-06-20'
    },
    {
      id: 3,
      type: 'address',
      name: 'Utility Bill',
      status: 'pending',
      uploadedAt: '2025-06-25',
      expiryDate: null
    }
  ]

  const mockAvailability = {
    monday: { available: true, startTime: '09:00', endTime: '18:00' },
    tuesday: { available: true, startTime: '09:00', endTime: '18:00' },
    wednesday: { available: true, startTime: '09:00', endTime: '18:00' },
    thursday: { available: true, startTime: '09:00', endTime: '18:00' },
    friday: { available: true, startTime: '09:00', endTime: '18:00' },
    saturday: { available: true, startTime: '10:00', endTime: '16:00' },
    sunday: { available: false, startTime: '', endTime: '' }
  }

  const mockPortfolio = [
    {
      id: 1,
      title: 'Complete House Rewiring',
      description: 'Full electrical rewiring for 3BHK apartment with modern switches and safety features',
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop'],
      completedDate: '2025-06-20',
      rating: 5
    },
    {
      id: 2,
      title: 'Smart Home Installation',
      description: 'Smart switches and automation setup for modern home',
      images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'],
      completedDate: '2025-06-15',
      rating: 5
    }
  ]

  const mockVerificationStatus = {
    profile: { status: 'verified', completedAt: '2025-06-20' },
    documents: { status: 'pending', completedAt: null },
    skills: { status: 'verified', completedAt: '2025-06-21' },
    background: { status: 'verified', completedAt: '2025-06-22' }
  }

  // Document types
  const documentTypes = [
    { value: 'identity', label: 'Identity Proof (Aadhaar/PAN/Passport)' },
    { value: 'address', label: 'Address Proof (Utility Bill/Bank Statement)' },
    { value: 'professional', label: 'Professional License/Certificate' },
    { value: 'education', label: 'Educational Certificate' },
    { value: 'experience', label: 'Experience Certificate' }
  ]

  // Load profile data
  useEffect(() => {
    setSkills(mockSkills)
    setDocuments(mockDocuments)
    setAvailability(mockAvailability)
    setPortfolio(mockPortfolio)
    setVerificationStatus(mockVerificationStatus)
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

  // Handle skill operations
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    
    try {
      const newId = skills.length + 1
      setSkills(prev => [...prev, { id: newId, name: newSkill, verified: false }])
      setSkillDialogOpen(false)
      setNewSkill('')
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  }

  const handleDeleteSkill = async (skillId) => {
    try {
      setSkills(prev => prev.filter(skill => skill.id !== skillId))
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  // Handle document operations
  const handleUploadDocument = async () => {
    if (!newDocument.type || !newDocument.name || !newDocument.file) return

    try {
      const newId = documents.length + 1
      setDocuments(prev => [...prev, {
        id: newId,
        type: newDocument.type,
        name: newDocument.name,
        status: 'pending',
        uploadedAt: new Date().toISOString().split('T')[0],
        expiryDate: null
      }])
      setDocumentDialogOpen(false)
      setNewDocument({ type: '', name: '', file: null })
    } catch (error) {
      console.error('Failed to upload document:', error)
    }
  }

  // Handle availability update
  const handleAvailabilityUpdate = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  // Get verification progress
  const getVerificationProgress = () => {
    const statuses = Object.values(verificationStatus)
    const completed = statuses.filter(s => s.status === 'verified').length
    return (completed / statuses.length) * 100
  }

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'verified':
        return { color: 'success', icon: <CheckCircle />, label: 'Verified' }
      case 'pending':
        return { color: 'warning', icon: <Warning />, label: 'Pending' }
      case 'rejected':
        return { color: 'error', icon: <ErrorIcon />, label: 'Rejected' }
      default:
        return { color: 'default', icon: <Assignment />, label: 'Not Started' }
    }
  }

  // Tab content
  const getTabContent = () => {
    switch (activeTab) {
      case 0: // Professional Info
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Professional Information
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
                    sx={{ width: 120, height: 120, mr: 3 }}
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
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {profileData.profession}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Star sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="body1" fontWeight="bold">
                      4.8 (127 reviews)
                    </Typography>
                  </Box>
                  <Chip
                    label="Verified Professional"
                    color="success"
                    icon={<Verified />}
                    sx={{ mb: 1 }}
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
                    disabled={true}
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
                    disabled={true}
                    InputProps={{
                      endAdornment: <Verified color="success" />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Profession"
                    value={profileData.profession}
                    onChange={(e) => setProfileData(prev => ({ ...prev, profession: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Experience"
                    value={profileData.experience}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                    disabled={!editing}
                    placeholder="e.g., 5 years"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Professional Description"
                    multiline
                    rows={4}
                    value={profileData.description}
                    onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!editing}
                    placeholder="Describe your expertise and services..."
                  />
                </Grid>

                {/* Pricing Section */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Pricing Information
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Hourly Rate (₹)"
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Minimum Charge (₹)"
                    type="number"
                    value={profileData.minimumCharge}
                    onChange={(e) => setProfileData(prev => ({ ...prev, minimumCharge: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label="Emergency Rate (₹)"
                    type="number"
                    value={profileData.emergencyRate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, emergencyRate: e.target.value }))}
                    disabled={!editing}
                  />
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

      case 1: // Skills & Certifications
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Skills & Certifications
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setSkillDialogOpen(true)}
                >
                  Add Skill
                </Button>
              </Box>

              <Grid container spacing={2}>
                {skills.map((skill) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={skill.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {skill.name}
                            </Typography>
                            <Chip
                              label={skill.verified ? 'Verified' : 'Pending'}
                              color={skill.verified ? 'success' : 'warning'}
                              size="small"
                              icon={skill.verified ? <Verified /> : <Warning />}
                            />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )

      case 2: // Documents
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Documents & Verification
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => setDocumentDialogOpen(true)}
                >
                  Upload Document
                </Button>
              </Box>

              <List>
                {documents.map((doc, index) => {
                  const statusInfo = getStatusInfo(doc.status)
                  return (
                    <React.Fragment key={doc.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Assignment />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {doc.name}
                              </Typography>
                              <Chip
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                                icon={statusInfo.icon}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Type: {documentTypes.find(t => t.value === doc.type)?.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                              </Typography>
                              {doc.expiryDate && (
                                <Typography variant="body2" color="text.secondary">
                                  Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <Visibility />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < documents.length - 1 && <Divider />}
                    </React.Fragment>
                  )
                })}
              </List>
            </CardContent>
          </Card>
        )

      case 3: // Availability
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Weekly Availability
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set your working hours for each day of the week
              </Typography>

              {Object.entries(availability).map(([day, schedule]) => (
                <Box key={day} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={schedule.available}
                            onChange={(e) => handleAvailabilityUpdate(day, 'available', e.target.checked)}
                          />
                        }
                        label={<Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>{day}</Typography>}
                      />
                    </Grid>
                    {schedule.available && (
                      <>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            fullWidth
                            label="Start Time"
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => handleAvailabilityUpdate(day, 'startTime', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            fullWidth
                            label="End Time"
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => handleAvailabilityUpdate(day, 'endTime', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              ))}

              <Button variant="contained" startIcon={<Save />} sx={{ mt: 2 }}>
                Save Availability
              </Button>
            </CardContent>
          </Card>
        )

      case 4: // Portfolio
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Work Portfolio
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setPortfolioDialogOpen(true)}
                >
                  Add Work
                </Button>
              </Box>

              <Grid container spacing={3}>
                {portfolio.map((work) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={work.id}>
                    <Card variant="outlined">
                      <Box
                        component="img"
                        src={work.images[0]}
                        alt={work.title}
                        sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {work.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {work.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(work.completedDate).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption">{work.rating}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
          Professional Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your professional information and showcase your skills
        </Typography>
      </motion.div>

      {/* Verification Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Verification Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getVerificationProgress()}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              {Math.round(getVerificationProgress())}% Complete - Complete your profile to get more bookings
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
        >
          <Tab icon={<Person />} label="Professional Info" />
          <Tab icon={<Work />} label="Skills" />
          <Tab icon={<Assignment />} label="Documents" />
          <Tab icon={<Schedule />} label="Availability" />
          <Tab icon={<Star />} label="Portfolio" />
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

      {/* Add Skill Dialog */}
      <Dialog open={skillDialogOpen} onClose={() => setSkillDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Skill Name"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., Electrical Wiring, Plumbing, etc."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkillDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={documentDialogOpen} onClose={() => setDocumentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={newDocument.type}
                  label="Document Type"
                  onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Document Name"
                value={newDocument.name}
                onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Aadhaar Card, License, etc."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload />}
                sx={{ py: 2 }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setNewDocument(prev => ({ ...prev, file: e.target.files[0] }))}
                />
              </Button>
              {newDocument.file && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Selected: {newDocument.file.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUploadDocument}>
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default WorkerProfile
