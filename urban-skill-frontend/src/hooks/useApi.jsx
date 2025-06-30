// src/hooks/useApi.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// HTTP methods enum
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

// Main useApi hook for data fetching
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const {
    method = 'GET',
    body = null,
    headers = {},
    dependencies = [],
    enabled = true,
    onSuccess,
    onError,
    ...fetchOptions
  } = options;

  const fetchData = useCallback(async (customUrl = url, customOptions = {}) => {
    if (!enabled || !customUrl) return;

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers,
        ...customOptions.headers,
      };

      // Add authorization header if token exists
      const token = localStorage.getItem('urbanskill_auth_token');
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const requestOptions = {
        method: customOptions.method || method,
        headers: requestHeaders,
        signal: abortControllerRef.current.signal,
        ...fetchOptions,
        ...customOptions,
      };

      // Add body for non-GET requests
      if (requestOptions.method !== 'GET' && (body || customOptions.body)) {
        requestOptions.body = JSON.stringify(customOptions.body || body);
      }

      const fullUrl = customUrl.startsWith('http') ? customUrl : `${API_BASE_URL}${customUrl}`;
      const response = await fetch(fullUrl, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }

      setError(err.message);
      
      // Call error callback
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, enabled, onSuccess, onError, ...dependencies]);

  useEffect(() => {
    fetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback((customOptions = {}) => {
    return fetchData(url, customOptions);
  }, [fetchData, url]);

  const mutate = useCallback((newData) => {
    setData(newData);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    mutate,
    isValidating: loading 
  };
};

// Hook for API mutations (POST, PUT, DELETE)
export const useApiMutation = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = 'POST',
    onSuccess,
    onError,
    ...defaultOptions
  } = options;

  const mutate = useCallback(async (data, customOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const requestHeaders = {
        'Content-Type': 'application/json',
        ...defaultOptions.headers,
        ...customOptions.headers,
      };

      // Add authorization header if token exists
      const token = localStorage.getItem('urbanskill_auth_token');
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const requestOptions = {
        method: customOptions.method || method,
        headers: requestHeaders,
        body: JSON.stringify(data),
        ...defaultOptions,
        ...customOptions,
      };

      const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
      const response = await fetch(fullUrl, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      setError(err.message);
      
      // Call error callback
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, onSuccess, onError, defaultOptions]);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
    isLoading: loading
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (url, options = {}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);
  const [totalCount, setTotalCount] = useState(0);

  const paginatedUrl = `${url}?page=${page}&limit=${pageSize}`;
  
  const { data, loading, error, refetch } = useApi(paginatedUrl, {
    ...options,
    dependencies: [page, pageSize, ...(options.dependencies || [])],
    onSuccess: (result) => {
      if (result.totalCount !== undefined) {
        setTotalCount(result.totalCount);
      }
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    }
  });

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(totalCount / pageSize) - 1;
    setPage(prev => Math.min(prev + 1, maxPage));
  }, [totalCount, pageSize]);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(prev - 1, 0));
  }, []);

  const goToPage = useCallback((newPage) => {
    const maxPage = Math.ceil(totalCount / pageSize) - 1;
    setPage(Math.max(0, Math.min(newPage, maxPage)));
  }, [totalCount, pageSize]);

  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page
  }, []);

  return {
    data: data?.items || data?.data || data,
    loading,
    error,
    refetch,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasNext: page < Math.ceil(totalCount / pageSize) - 1,
      hasPrev: page > 0,
      nextPage,
      prevPage,
      goToPage,
      changePageSize
    }
  };
};

// Default export
export default useApi;
