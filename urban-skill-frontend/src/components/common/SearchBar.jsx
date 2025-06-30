import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Autocomplete,
  CircularProgress
} from '@mui/material'
import {
  Search,
  LocationOn,
  Clear,
  History,
  TrendingUp,
  Work,
  Person,
  FilterList,
  Mic,
  MicOff
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDebounce } from '@hooks/useDebounce'
import { apiService } from '@services/api'

const SearchBar = ({
  placeholder = "Search for services or professionals...",
  variant = 'default', // 'default', 'compact', 'hero'
  showFilters = true,
  showLocation = true,
  showVoiceSearch = true,
  onSearch,
  onFilterClick,
  initialValue = '',
  autoFocus = false
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  
  // Refs
  const searchInputRef = useRef(null)
  const resultsRef = useRef(null)

  // State management
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const [locationQuery, setLocationQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [trendingSearches, setTrendingSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Mock data
  const mockTrendingSearches = [
    { id: 1, text: 'Home Cleaning', type: 'service', count: '2.5K searches' },
    { id: 2, text: 'Electrician', type: 'service', count: '1.8K searches' },
    { id: 3, text: 'Plumber', type: 'service', count: '1.2K searches' },
    { id: 4, text: 'AC Repair', type: 'service', count: '980 searches' },
    { id: 5, text: 'Carpenter', type: 'service', count: '750 searches' }
  ]

  const mockRecentSearches = [
    { id: 1, text: 'Deep cleaning service', type: 'service', timestamp: '2025-06-26' },
    { id: 2, text: 'Electrical repair', type: 'service', timestamp: '2025-06-25' },
    { id: 3, text: 'Rajesh Kumar', type: 'worker', timestamp: '2025-06-24' }
  ]

  // Initialize speech recognition
  useEffect(() => {
    if (showVoiceSearch && 'webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition()
      speechRecognition.continuous = false
      speechRecognition.interimResults = false
      speechRecognition.lang = 'en-IN'

      speechRecognition.onstart = () => {
        setIsListening(true)
      }

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }

      speechRecognition.onerror = () => {
        setIsListening(false)
      }

      speechRecognition.onend = () => {
        setIsListening(false)
      }

      setRecognition(speechRecognition)
    }
  }, [showVoiceSearch])

  // Load initial data
  useEffect(() => {
    setTrendingSearches(mockTrendingSearches)
    setRecentSearches(mockRecentSearches)
  }, [])

  // Fetch suggestions
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
      fetchSuggestions(debouncedSearchQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedSearchQuery])

  // Auto focus
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [autoFocus])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch search suggestions
  const fetchSuggestions = async (query) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const mockSuggestions = [
        { id: 1, text: `${query} service`, type: 'service', category: 'Services' },
        { id: 2, text: `${query} professional`, type: 'worker', category: 'Professionals' },
        { id: 3, text: `${query} near me`, type: 'location', category: 'Location' },
        { id: 4, text: `Best ${query}`, type: 'service', category: 'Services' },
        { id: 5, text: `${query} in Kota`, type: 'location', category: 'Location' }
      ]
      
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = (query = searchQuery, loc = locationQuery) => {
    if (!query.trim()) return

    // Add to recent searches
    const newSearch = {
      id: Date.now(),
      text: query,
      type: 'service',
      timestamp: new Date().toISOString().split('T')[0]
    }
    setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)])

    // Close suggestions
    setShowSuggestions(false)

    // Navigate to search results or call callback
    if (onSearch) {
      onSearch(query, loc)
    } else {
      const searchParams = new URLSearchParams()
      if (query) searchParams.set('q', query)
      if (loc) searchParams.set('location', loc)
      navigate(`/services?${searchParams.toString()}`)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text)
    handleSearch(suggestion.text, locationQuery)
  }

  // Handle voice search
  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop()
      } else {
        recognition.start()
      }
    }
  }

  // Handle key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // Clear search
  const handleClear = () => {
    setSearchQuery('')
    setShowSuggestions(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Get search icon
  const getSearchIcon = (type) => {
    switch (type) {
      case 'worker':
        return <Person fontSize="small" />
      case 'service':
        return <Work fontSize="small" />
      case 'location':
        return <LocationOn fontSize="small" />
      default:
        return <Search fontSize="small" />
    }
  }

  // Hero variant (for homepage)
  if (variant === 'hero') {
    return (
      <Box sx={{ position: 'relative', maxWidth: 800, mx: 'auto' }}>
        <Paper
          elevation={8}
          sx={{
            p: 2,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              ref={searchInputRef}
              fullWidth
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {searchQuery && (
                        <IconButton size="small" onClick={handleClear}>
                          <Clear />
                        </IconButton>
                      )}
                      {showVoiceSearch && (
                        <IconButton
                          size="small"
                          onClick={handleVoiceSearch}
                          color={isListening ? 'error' : 'default'}
                        >
                          {isListening ? <MicOff /> : <Mic />}
                        </IconButton>
                      )}
                    </Box>
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  },
                }
              }}
              sx={{ flexGrow: 1 }}
            />
            
            {showLocation && (
              <TextField
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                    },
                  }
                }}
                sx={{ width: 200 }}
              />
            )}
            
            <Button
              variant="contained"
              size="large"
              onClick={() => handleSearch()}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Paper
                elevation={8}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  maxHeight: 400,
                  overflow: 'auto',
                  zIndex: 1000,
                  borderRadius: 2
                }}
              >
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {!loading && suggestions.length > 0 && (
                  <List>
                    {suggestions.map((suggestion) => (
                      <ListItem
                        key={suggestion.id}
                        button
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ListItemIcon>
                          {getSearchIcon(suggestion.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion.text}
                          secondary={suggestion.category}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {!loading && suggestions.length === 0 && searchQuery && (
                  <>
                    {/* Trending Searches */}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Trending Searches
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {trendingSearches.slice(0, 5).map((trend) => (
                          <Chip
                            key={trend.id}
                            label={trend.text}
                            size="small"
                            onClick={() => handleSuggestionClick(trend)}
                            icon={<TrendingUp />}
                            clickable
                          />
                        ))}
                      </Box>
                    </Box>
                  </>
                )}

                {!loading && suggestions.length === 0 && !searchQuery && (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <>
                        <Box sx={{ p: 2, pb: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Recent Searches
                          </Typography>
                        </Box>
                        <List>
                          {recentSearches.map((recent) => (
                            <ListItem
                              key={recent.id}
                              button
                              onClick={() => handleSuggestionClick(recent)}
                            >
                              <ListItemIcon>
                                <History fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={recent.text} />
                            </ListItem>
                          ))}
                        </List>
                        <Divider />
                      </>
                    )}

                    {/* Trending Searches */}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Trending Searches
                      </Typography>
                      <List dense>
                        {trendingSearches.map((trend) => (
                          <ListItem
                            key={trend.id}
                            button
                            onClick={() => handleSuggestionClick(trend)}
                          >
                            <ListItemIcon>
                              <TrendingUp fontSize="small" color="warning" />
                            </ListItemIcon>
                            <ListItemText
                              primary={trend.text}
                              secondary={trend.count}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          ref={searchInputRef}
          fullWidth
          size="small"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Compact Suggestions */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 0.5,
                  maxHeight: 300,
                  overflow: 'auto',
                  zIndex: 1000
                }}
              >
                <List dense>
                  {suggestions.length > 0
                    ? suggestions.slice(0, 5).map((suggestion) => (
                        <ListItem
                          key={suggestion.id}
                          button
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {getSearchIcon(suggestion.type)}
                          </ListItemIcon>
                          <ListItemText primary={suggestion.text} />
                        </ListItem>
                      ))
                    : recentSearches.slice(0, 3).map((recent) => (
                        <ListItem
                          key={recent.id}
                          button
                          onClick={() => handleSuggestionClick(recent)}
                          sx={{ py: 0.5 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <History fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={recent.text} />
                        </ListItem>
                      ))}
                </List>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    )
  }

  // Default variant
  return (
    <Box sx={{ position: 'relative', display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        ref={searchInputRef}
        fullWidth
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setShowSuggestions(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {searchQuery && (
                  <IconButton size="small" onClick={handleClear}>
                    <Clear />
                  </IconButton>
                )}
                {showVoiceSearch && (
                  <IconButton
                    size="small"
                    onClick={handleVoiceSearch}
                    color={isListening ? 'error' : 'default'}
                  >
                    {isListening ? <MicOff /> : <Mic />}
                  </IconButton>
                )}
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{ flexGrow: 1 }}
      />

      {showFilters && (
        <IconButton onClick={onFilterClick}>
          <FilterList />
        </IconButton>
      )}

      {/* Default Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: showFilters ? 56 : 0,
                mt: 1,
                maxHeight: 400,
                overflow: 'auto',
                zIndex: 1000,
                borderRadius: 2
              }}
            >
              {/* Similar content as hero variant but more compact */}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {!loading && suggestions.length > 0 && (
                <List>
                  {suggestions.map((suggestion) => (
                    <ListItem
                      key={suggestion.id}
                      button
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <ListItemIcon>
                        {getSearchIcon(suggestion.type)}
                      </ListItemIcon>
                      <ListItemText primary={suggestion.text} />
                    </ListItem>
                  ))}
                </List>
              )}

              {!loading && suggestions.length === 0 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Start typing to see suggestions...
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default SearchBar
