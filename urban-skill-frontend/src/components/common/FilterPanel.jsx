import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Radio,
  RadioGroup,
  Chip,
  Button,
  Divider,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar
} from '@mui/material'
import {
  ExpandMore,
  Close,
  FilterList,
  Clear,
  Star,
  LocationOn,
  MonetizationOn,
  Schedule,
  Verified,
  TrendingUp
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const FilterPanel = ({
  open = false,
  onClose,
  filters = {},
  onFiltersChange,
  variant = 'sidebar', // 'sidebar', 'drawer', 'inline'
  showApplyButton = true,
  categories = [],
  locations = [],
  onReset
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State management
  const [localFilters, setLocalFilters] = useState({
    categories: [],
    priceRange: [0, 2000],
    rating: 0,
    location: '',
    availability: '',
    verified: false,
    experience: '',
    sortBy: 'popularity',
    ...filters
  })
  const [expandedPanels, setExpandedPanels] = useState({
    categories: true,
    price: true,
    rating: true,
    location: false,
    availability: false,
    other: false
  })

  // Default categories
  const defaultCategories = [
    { id: 'cleaning', name: 'Home Cleaning', count: 45, icon: '🧹' },
    { id: 'electrical', name: 'Electrical Services', count: 32, icon: '⚡' },
    { id: 'plumbing', name: 'Plumbing', count: 28, icon: '🔧' },
    { id: 'ac-repair', name: 'AC Repair', count: 22, icon: '❄️' },
    { id: 'carpentry', name: 'Carpentry', count: 18, icon: '🔨' },
    { id: 'painting', name: 'Painting', count: 15, icon: '🎨' },
    { id: 'appliance', name: 'Appliance Repair', count: 12, icon: '🔌' },
    { id: 'gardening', name: 'Gardening', count: 8, icon: '🌱' }
  ]

  // Default locations
  const defaultLocations = [
    { id: 'kota', name: 'Kota', count: 120 },
    { id: 'jaipur', name: 'Jaipur', count: 85 },
    { id: 'udaipur', name: 'Udaipur', count: 65 },
    { id: 'jodhpur', name: 'Jodhpur', count: 45 },
    { id: 'ajmer', name: 'Ajmer', count: 32 }
  ]

  // Availability options
  const availabilityOptions = [
    { id: 'today', name: 'Available Today', icon: '⚡' },
    { id: 'tomorrow', name: 'Available Tomorrow', icon: '📅' },
    { id: 'this-week', name: 'This Week', icon: '📆' },
    { id: 'emergency', name: 'Emergency Service', icon: '🚨' }
  ]

  // Experience options
  const experienceOptions = [
    { id: '0-2', name: '0-2 years' },
    { id: '2-5', name: '2-5 years' },
    { id: '5-10', name: '5-10 years' },
    { id: '10+', name: '10+ years' }
  ]

  // Sort options
  const sortOptions = [
    { id: 'popularity', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'experience', name: 'Most Experienced' },
    { id: 'newest', name: 'Newest First' }
  ]

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }))
  }, [filters])

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value }
    setLocalFilters(newFilters)
    
    if (!showApplyButton) {
      onFiltersChange?.(newFilters)
    }
  }

  // Handle category toggle
  const handleCategoryToggle = (categoryId) => {
    const currentCategories = localFilters.categories || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]
    
    handleFilterChange('categories', newCategories)
  }

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    handleFilterChange('priceRange', newValue)
  }

  // Handle panel expansion
  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: isExpanded
    }))
  }

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange?.(localFilters)
    if (isMobile) {
      onClose?.()
    }
  }

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      categories: [],
      priceRange: [0, 2000],
      rating: 0,
      location: '',
      availability: '',
      verified: false,
      experience: '',
      sortBy: 'popularity'
    }
    setLocalFilters(resetFilters)
    onReset?.(resetFilters)
    if (!showApplyButton) {
      onFiltersChange?.(resetFilters)
    }
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.categories?.length > 0) count++
    if (localFilters.rating > 0) count++
    if (localFilters.location) count++
    if (localFilters.availability) count++
    if (localFilters.verified) count++
    if (localFilters.experience) count++
    if (localFilters.priceRange && (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 2000)) count++
    return count
  }

  // Filter content
  const filterContent = (
    <Box sx={{ width: variant === 'drawer' ? 320 : '100%' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
          {getActiveFilterCount() > 0 && (
            <Badge badgeContent={getActiveFilterCount()} color="primary" />
          )}
        </Box>
        <Box>
          <Button
            size="small"
            onClick={handleResetFilters}
            startIcon={<Clear />}
            disabled={getActiveFilterCount() === 0}
          >
            Clear All
          </Button>
          {variant === 'drawer' && (
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Filter Content */}
      <Box sx={{ p: 2, maxHeight: variant === 'drawer' ? 'calc(100vh - 120px)' : 'auto', overflow: 'auto' }}>
        {/* Sort By */}
        <Accordion 
          expanded={expandedPanels.sortBy} 
          onChange={handlePanelChange('sortBy')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Sort By
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio size="small" />}
                  label={option.name}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        {/* Categories */}
        <Accordion 
          expanded={expandedPanels.categories} 
          onChange={handlePanelChange('categories')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Service Categories
            </Typography>
            {localFilters.categories?.length > 0 && (
              <Chip 
                label={localFilters.categories.length} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }} 
              />
            )}
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {(categories.length > 0 ? categories : defaultCategories).map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={localFilters.categories?.includes(category.id) || false}
                      onChange={() => handleCategoryToggle(category.id)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{category.icon}</Typography>
                        <Typography variant="body2">{category.name}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        ({category.count})
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Price Range */}
        <Accordion 
          expanded={expandedPanels.price} 
          onChange={handlePanelChange('price')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MonetizationOn fontSize="small" />
              <Typography variant="subtitle1" fontWeight="bold">
                Price Range
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2 }}>
              <Slider
                value={localFilters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={50}
                marks={[
                  { value: 0, label: '₹0' },
                  { value: 500, label: '₹500' },
                  { value: 1000, label: '₹1000' },
                  { value: 2000, label: '₹2000+' }
                ]}
                sx={{ mt: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                ₹{localFilters.priceRange[0]} - ₹{localFilters.priceRange[1]}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Rating */}
        <Accordion 
          expanded={expandedPanels.rating} 
          onChange={handlePanelChange('rating')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star fontSize="small" />
              <Typography variant="subtitle1" fontWeight="bold">
                Minimum Rating
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={localFilters.rating}
              onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
            >
              {[4.5, 4.0, 3.5, 3.0, 0].map((rating) => (
                <FormControlLabel
                  key={rating}
                  value={rating}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {rating > 0 ? (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                sx={{
                                  fontSize: 16,
                                  color: i < Math.floor(rating) ? 'warning.main' : 'grey.300'
                                }}
                              />
                            ))}
                          </Box>
                          <Typography variant="body2">
                            {rating}+ stars
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">All ratings</Typography>
                      )}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        {/* Location */}
        <Accordion 
          expanded={expandedPanels.location} 
          onChange={handlePanelChange('location')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" />
              <Typography variant="subtitle1" fontWeight="bold">
                Location
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={localFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label="All Locations"
              />
              {(locations.length > 0 ? locations : defaultLocations).map((location) => (
                <FormControlLabel
                  key={location.id}
                  value={location.id}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2">{location.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({location.count})
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        {/* Availability */}
        <Accordion 
          expanded={expandedPanels.availability} 
          onChange={handlePanelChange('availability')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule fontSize="small" />
              <Typography variant="subtitle1" fontWeight="bold">
                Availability
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={localFilters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label="Any time"
              />
              {availabilityOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{option.icon}</Typography>
                      <Typography variant="body2">{option.name}</Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        {/* Other Filters */}
        <Accordion 
          expanded={expandedPanels.other} 
          onChange={handlePanelChange('other')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Other Filters
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Verified fontSize="small" color="primary" />
                    <Typography variant="body2">Verified Professionals Only</Typography>
                  </Box>
                }
              />
            </FormGroup>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Experience Level
            </Typography>
            <RadioGroup
              value={localFilters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <FormControlLabel
                value=""
                control={<Radio size="small" />}
                label="Any experience"
              />
              {experienceOptions.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio size="small" />}
                  label={option.name}
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Apply Button */}
      {showApplyButton && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleApplyFilters}
            disabled={getActiveFilterCount() === 0}
          >
            Apply Filters ({getActiveFilterCount()})
          </Button>
        </Box>
      )}
    </Box>
  )

  // Drawer variant (mobile)
  if (variant === 'drawer') {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        {filterContent}
      </Drawer>
    )
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={2} sx={{ mt: 2, borderRadius: 2 }}>
              {filterContent}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Sidebar variant (default)
  return (
    <Paper elevation={1} sx={{ borderRadius: 2, height: 'fit-content', position: 'sticky', top: 100 }}>
      {filterContent}
    </Paper>
  )
}

export default FilterPanel
