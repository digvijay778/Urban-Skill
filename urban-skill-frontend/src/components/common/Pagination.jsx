import React, { useState, useEffect } from 'react'
import {
  Box,
  Pagination as MuiPagination,
  PaginationItem,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  MoreHoriz
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  variant = 'default', // 'default', 'compact', 'detailed', 'simple'
  showItemsPerPage = true,
  showTotalItems = true,
  showFirstLast = true,
  itemsPerPageOptions = [10, 20, 50, 100],
  size = 'medium', // 'small', 'medium', 'large'
  color = 'primary',
  disabled = false,
  hideOnSinglePage = false
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // State for items per page
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage)

  // Update local state when props change
  useEffect(() => {
    setLocalItemsPerPage(itemsPerPage)
  }, [itemsPerPage])

  // Hide pagination if only one page and hideOnSinglePage is true
  if (hideOnSinglePage && totalPages <= 1) {
    return null
  }

  // Handle page change
  const handlePageChange = (event, page) => {
    if (page !== currentPage && !disabled) {
      onPageChange?.(page)
    }
  }

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = event.target.value
    setLocalItemsPerPage(newItemsPerPage)
    onItemsPerPageChange?.(newItemsPerPage)
  }

  // Calculate display information
  const startItem = (currentPage - 1) * localItemsPerPage + 1
  const endItem = Math.min(currentPage * localItemsPerPage, totalItems)

  // Get size props
  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { size: 'small', sx: { '& .MuiPaginationItem-root': { minWidth: 28, height: 28 } } }
      case 'large':
        return { size: 'large', sx: { '& .MuiPaginationItem-root': { minWidth: 44, height: 44 } } }
      default:
        return { size: 'medium' }
    }
  }

  // Simple variant (just prev/next buttons)
  if (variant === 'simple') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}
      >
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={(e) => handlePageChange(e, currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          size={size}
        >
          Previous
        </Button>

        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>

        <Button
          variant="outlined"
          endIcon={<NavigateNext />}
          onClick={(e) => handlePageChange(e, currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          size={size}
        >
          Next
        </Button>
      </Box>
    )
  }

  // Compact variant (minimal info)
  if (variant === 'compact') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          py: 2
        }}
      >
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color={color}
          disabled={disabled}
          showFirstButton={showFirstLast && !isMobile}
          showLastButton={showFirstLast && !isMobile}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
          {...getSizeProps()}
        />
        
        {showTotalItems && (
          <Typography variant="caption" color="text.secondary">
            {totalItems} items
          </Typography>
        )}
      </Box>
    )
  }

  // Detailed variant (full information)
  if (variant === 'detailed') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          py: 3,
          px: 1
        }}
      >
        {/* Items per page and total info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2
          }}
        >
          {showItemsPerPage && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Items per page</InputLabel>
              <Select
                value={localItemsPerPage}
                label="Items per page"
                onChange={handleItemsPerPageChange}
                disabled={disabled}
              >
                {itemsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {showTotalItems && (
            <Typography variant="body2" color="text.secondary">
              Showing {startItem}-{endItem} of {totalItems} items
            </Typography>
          )}
        </Box>

        {/* Pagination controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            alignItems: 'center'
          }}
        >
          <MuiPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color={color}
            disabled={disabled}
            showFirstButton={showFirstLast && !isMobile}
            showLastButton={showFirstLast && !isMobile}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            {...getSizeProps()}
          />
        </Box>
      </Box>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          py: 2
        }}
      >
        {/* Left side - Items info and per page selector */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        >
          {showTotalItems && (
            <Typography variant="body2" color="text.secondary">
              Showing {startItem}-{endItem} of {totalItems} results
            </Typography>
          )}

          {showItemsPerPage && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Show:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={localItemsPerPage}
                  onChange={handleItemsPerPageChange}
                  disabled={disabled}
                  variant="outlined"
                >
                  {itemsPerPageOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Right side - Pagination controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            alignItems: 'center'
          }}
        >
          <MuiPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color={color}
            disabled={disabled}
            showFirstButton={showFirstLast && !isMobile}
            showLastButton={showFirstLast && !isMobile}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: `${color}.main`,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: `${color}.dark`,
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${color}.light`,
                  },
                }}
              />
            )}
            {...getSizeProps()}
          />
        </Box>
      </Box>
    </motion.div>
  )
}

// Custom pagination hook for easier state management
export const usePagination = (initialPage = 1, initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const reset = () => {
    setCurrentPage(1)
    setItemsPerPage(initialItemsPerPage)
  }

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    reset,
    // Calculated values
    offset: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage
  }
}

// Pagination info component for displaying summary
export const PaginationInfo = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage,
  variant = 'default' // 'default', 'compact'
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (variant === 'compact') {
    return (
      <Typography variant="caption" color="text.secondary">
        {currentPage} of {totalPages} pages
      </Typography>
    )
  }

  return (
    <Typography variant="body2" color="text.secondary">
      Showing {startItem}-{endItem} of {totalItems} results
    </Typography>
  )
}

export default Pagination
