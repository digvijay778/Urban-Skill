// src/hooks/usePagination.jsx
import { useState, useMemo, useCallback, useEffect } from 'react';

/**
 * Main usePagination hook
 * @param {array} data - Array of data to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 10)
 * @param {object} options - Additional options
 * @returns {object} - Pagination state and methods
 */
export const usePagination = (data = [], itemsPerPage = 10, options = {}) => {
  const {
    initialPage = 0,
    resetOnDataChange = true,
    onPageChange = null,
    onPageSizeChange = null
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  // Reset to first page when data changes (if enabled)
  useEffect(() => {
    if (resetOnDataChange) {
      setCurrentPage(0);
    }
  }, [data, resetOnDataChange]);

  // Calculate pagination values
  const paginationInfo = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      startIndex,
      endIndex,
      paginatedData,
      hasNextPage: currentPage < totalPages - 1,
      hasPreviousPage: currentPage > 0,
      isFirstPage: currentPage === 0,
      isLastPage: currentPage === totalPages - 1,
      isEmpty: totalItems === 0,
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: endIndex,
    };
  }, [data, currentPage, pageSize]);

  // Navigation functions
  const goToPage = useCallback((page) => {
    const targetPage = Math.max(0, Math.min(page, paginationInfo.totalPages - 1));
    setCurrentPage(targetPage);
    
    if (onPageChange) {
      onPageChange(targetPage);
    }
  }, [paginationInfo.totalPages, onPageChange]);

  const nextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, paginationInfo.hasNextPage, goToPage]);

  const previousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, paginationInfo.hasPreviousPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(0);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(paginationInfo.totalPages - 1);
  }, [paginationInfo.totalPages, goToPage]);

  const changePageSize = useCallback((newPageSize) => {
    const newTotalPages = Math.ceil(data.length / newPageSize);
    const newCurrentPage = Math.min(currentPage, newTotalPages - 1);
    
    setPageSize(newPageSize);
    setCurrentPage(Math.max(0, newCurrentPage));
    
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  }, [data.length, currentPage, onPageSizeChange]);

  // Material-UI Table Pagination handlers
  const handlePageChange = useCallback((event, newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handleRowsPerPageChange = useCallback((event) => {
    changePageSize(parseInt(event.target.value, 10));
  }, [changePageSize]);

  return {
    // Data
    paginatedData: paginationInfo.paginatedData,
    
    // Pagination info
    currentPage: paginationInfo.currentPage,
    pageSize: paginationInfo.pageSize,
    totalItems: paginationInfo.totalItems,
    totalPages: paginationInfo.totalPages,
    startIndex: paginationInfo.startIndex,
    endIndex: paginationInfo.endIndex,
    startItem: paginationInfo.startItem,
    endItem: paginationInfo.endItem,
    
    // Status flags
    hasNextPage: paginationInfo.hasNextPage,
    hasPreviousPage: paginationInfo.hasPreviousPage,
    isFirstPage: paginationInfo.isFirstPage,
    isLastPage: paginationInfo.isLastPage,
    isEmpty: paginationInfo.isEmpty,
    
    // Navigation methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    
    // Material-UI handlers
    handlePageChange,
    handleRowsPerPageChange,
  };
};

/**
 * Hook for server-side pagination
 * @param {function} fetchFunction - Function to fetch data
 * @param {object} options - Pagination options
 * @returns {object} - Server pagination state and methods
 */
export const useServerPagination = (fetchFunction, options = {}) => {
  const {
    initialPage = 0,
    initialPageSize = 10,
    onError = null,
    onSuccess = null
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate derived values
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;
  const startItem = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  // Fetch data function
  const fetchData = useCallback(async (page = currentPage, size = pageSize) => {
    if (!fetchFunction) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction({
        page,
        pageSize: size,
        offset: page * size,
        limit: size
      });

      setData(result.data || result.items || []);
      setTotalItems(result.totalItems || result.total || 0);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, onSuccess, onError]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigation functions
  const goToPage = useCallback(async (page) => {
    const targetPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(targetPage);
    await fetchData(targetPage, pageSize);
  }, [totalPages, pageSize, fetchData]);

  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  const previousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await goToPage(currentPage - 1);
    }
  }, [hasPreviousPage, currentPage, goToPage]);

  const changePageSize = useCallback(async (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page
    await fetchData(0, newPageSize);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(currentPage, pageSize);
  }, [fetchData, currentPage, pageSize]);

  // Material-UI handlers
  const handlePageChange = useCallback((event, newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handleRowsPerPageChange = useCallback((event) => {
    changePageSize(parseInt(event.target.value, 10));
  }, [changePageSize]);

  return {
    // Data
    data,
    loading,
    error,
    
    // Pagination info
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startItem,
    endItem,
    
    // Status flags
    hasNextPage,
    hasPreviousPage,
    isEmpty: totalItems === 0,
    
    // Navigation methods
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    refresh,
    
    // Material-UI handlers
    handlePageChange,
    handleRowsPerPageChange,
  };
};

/**
 * Hook for infinite scroll pagination
 * @param {function} fetchFunction - Function to fetch data
 * @param {object} options - Options for infinite scroll
 * @returns {object} - Infinite scroll state and methods
 */
export const useInfiniteScroll = (fetchFunction, options = {}) => {
  const {
    pageSize = 20,
    threshold = 0.8,
    onError = null,
    onSuccess = null
  } = options;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Load more data
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !fetchFunction) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction({
        page: currentPage,
        pageSize,
        offset: currentPage * pageSize,
        limit: pageSize
      });

      const newData = result.data || result.items || [];
      
      if (currentPage === 0) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }

      setHasMore(newData.length === pageSize);
      setCurrentPage(prev => prev + 1);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, loading, hasMore, onSuccess, onError]);

  // Reset and reload
  const reset = useCallback(() => {
    setData([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  const reload = useCallback(async () => {
    reset();
    await loadMore();
  }, [reset, loadMore]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []); // Only run once on mount

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    reload,
    isEmpty: data.length === 0 && !loading,
  };
};

/**
 * Hook for table pagination with sorting and filtering
 * @param {array} data - Data to paginate
 * @param {object} options - Table options
 * @returns {object} - Table pagination state and methods
 */
export const useTablePagination = (data = [], options = {}) => {
  const {
    initialPageSize = 10,
    initialSortBy = null,
    initialSortOrder = 'asc',
    initialFilters = {},
    searchFields = [],
    onSort = null,
    onFilter = null
  } = options;

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');

  // Apply filters and search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      result = result.filter(item =>
        searchFields.some(field =>
          String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchFields, filters, sortBy, sortOrder]);

  // Use pagination hook with filtered data
  const pagination = usePagination(filteredData, pageSize, {
    resetOnDataChange: true
  });

  // Sorting functions
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }

    if (onSort) {
      onSort(field, sortOrder);
    }
  }, [sortBy, sortOrder, onSort]);

  // Filter functions
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    if (onFilter) {
      onFilter({ ...filters, [key]: value });
    }
  }, [filters, onFilter]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm('');
  }, [initialFilters]);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    // Pagination
    ...pagination,
    
    // Sorting
    sortBy,
    sortOrder,
    handleSort,
    
    // Filtering
    filters,
    searchTerm,
    updateFilter,
    clearFilter,
    clearFilters,
    setSearchTerm,
    
    // Data
    filteredData,
    originalData: data,
    
    // Stats
    filteredCount: filteredData.length,
    originalCount: data.length,
  };
};

// Default export
export default usePagination;
