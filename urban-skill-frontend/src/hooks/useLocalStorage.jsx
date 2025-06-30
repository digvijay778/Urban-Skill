// src/hooks/useLocalStorage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

// Storage event types
export const STORAGE_EVENTS = {
  SET: 'localStorage:set',
  REMOVE: 'localStorage:remove',
  CLEAR: 'localStorage:clear',
  ERROR: 'localStorage:error'
};

// Storage keys for your Urban Skill Platform
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'urbanskill_auth_token',
  USER_DATA: 'urbanskill_user_data',
  USER_PREFERENCES: 'urbanskill_user_preferences',
  THEME: 'urbanskill_theme',
  LANGUAGE: 'urbanskill_language',
  CART: 'urbanskill_cart',
  BOOKING_DRAFT: 'urbanskill_booking_draft',
  SEARCH_HISTORY: 'urbanskill_search_history',
  LOCATION: 'urbanskill_location',
  NOTIFICATIONS: 'urbanskill_notifications',
  ADMIN_FILTERS: 'urbanskill_admin_filters',
  WORKER_PREFERENCES: 'urbanskill_worker_preferences'
};

/**
 * Main useLocalStorage hook
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @param {object} options - Additional options
 * @returns {array} - [value, setValue, removeValue, error]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError = null,
    syncAcrossTabs = true,
    validateValue = null,
    transformValue = null
  } = options;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      const parsed = deserialize(item);
      
      // Validate value if validator provided
      if (validateValue && !validateValue(parsed)) {
        console.warn(`Invalid value for key "${key}", using initial value`);
        return initialValue;
      }

      // Transform value if transformer provided
      return transformValue ? transformValue(parsed) : parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      if (onError) onError(error);
      return initialValue;
    }
  });

  const [error, setError] = useState(null);
  const prevKeyRef = useRef(key);

  // Update stored value when key changes
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          const parsed = deserialize(item);
          setStoredValue(transformValue ? transformValue(parsed) : parsed);
        } else {
          setStoredValue(initialValue);
        }
        setError(null);
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        setError(error);
        if (onError) onError(error);
      }
    }
  }, [key, initialValue, deserialize, transformValue, onError]);

  // Listen for storage changes across tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = deserialize(e.newValue);
          setStoredValue(transformValue ? transformValue(parsed) : parsed);
          setError(null);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
          setError(error);
          if (onError) onError(error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, deserialize, transformValue, syncAcrossTabs, onError]);

  // Set value function
  const setValue = useCallback((value) => {
    try {
      setError(null);
      
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Validate value if validator provided
      if (validateValue && !validateValue(valueToStore)) {
        const validationError = new Error(`Invalid value for key "${key}"`);
        setError(validationError);
        if (onError) onError(validationError);
        return;
      }

      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
        
        // Dispatch custom event for cross-component communication
        window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.SET, {
          detail: { key, value: valueToStore }
        }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(error);
      if (onError) onError(error);
    }
  }, [key, serialize, storedValue, validateValue, onError]);

  // Remove value function
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.REMOVE, {
          detail: { key }
        }));
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(error);
      if (onError) onError(error);
    }
  }, [key, initialValue, onError]);

  return [storedValue, setValue, removeValue, error];
};

/**
 * Hook for managing user preferences
 * @param {string} userId - User ID for scoped preferences
 * @returns {object} - Preferences management object
 */
export const useUserPreferences = (userId) => {
  const prefKey = userId ? `${STORAGE_KEYS.USER_PREFERENCES}_${userId}` : STORAGE_KEYS.USER_PREFERENCES;
  
  const [preferences, setPreferences, removePreferences] = useLocalStorage(prefKey, {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    dashboard: {
      layout: 'grid',
      itemsPerPage: 10
    },
    location: {
      autoDetect: true,
      savedAddresses: []
    }
  });

  const updatePreference = useCallback((path, value) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = path.split('.');
      let current = newPrefs;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newPrefs;
    });
  }, [setPreferences]);

  const getPreference = useCallback((path, defaultValue = null) => {
    const keys = path.split('.');
    let current = preferences;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    
    return current;
  }, [preferences]);

  return {
    preferences,
    updatePreference,
    getPreference,
    resetPreferences: removePreferences
  };
};

/**
 * Hook for managing shopping cart/booking draft
 * @returns {object} - Cart management object
 */
export const useCart = () => {
  const [cart, setCart, clearCart] = useLocalStorage(STORAGE_KEYS.CART, {
    items: [],
    total: 0,
    currency: 'INR'
  });

  const addItem = useCallback((item) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(i => i.id === item.id);
      let newItems;
      
      if (existingItemIndex >= 0) {
        newItems = [...prev.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + (item.quantity || 1)
        };
      } else {
        newItems = [...prev.items, { ...item, quantity: item.quantity || 1 }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        total
      };
    });
  }, [setCart]);

  const removeItem = useCallback((itemId) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        total
      };
    });
  }, [setCart]);

  const updateQuantity = useCallback((itemId, quantity) => {
    setCart(prev => {
      const newItems = prev.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        total
      };
    });
  }, [setCart]);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: cart.items.length,
    totalAmount: cart.total
  };
};

/**
 * Hook for managing search history
 * @param {number} maxItems - Maximum number of search items to keep
 * @returns {object} - Search history management
 */
export const useSearchHistory = (maxItems = 10) => {
  const [searchHistory, setSearchHistory] = useLocalStorage(STORAGE_KEYS.SEARCH_HISTORY, []);

  const addSearch = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== searchTerm);
      return [searchTerm, ...filtered].slice(0, maxItems);
    });
  }, [setSearchHistory, maxItems]);

  const removeSearch = useCallback((searchTerm) => {
    setSearchHistory(prev => prev.filter(item => item !== searchTerm));
  }, [setSearchHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  return {
    searchHistory,
    addSearch,
    removeSearch,
    clearHistory
  };
};

/**
 * Hook for managing admin filters
 * @param {string} componentName - Name of the admin component
 * @returns {object} - Filter management object
 */
export const useAdminFilters = (componentName) => {
  const filterKey = `${STORAGE_KEYS.ADMIN_FILTERS}_${componentName}`;
  const [filters, setFilters, clearFilters] = useLocalStorage(filterKey, {});

  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, [setFilters]);

  const removeFilter = useCallback((filterName) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterName];
      return newFilters;
    });
  }, [setFilters]);

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] !== null && filters[key] !== undefined && filters[key] !== ''
  );

  return {
    filters,
    updateFilter,
    removeFilter,
    clearFilters,
    hasActiveFilters
  };
};

/**
 * Hook for managing cached data with expiration
 * @param {string} key - Storage key
 * @param {number} ttl - Time to live in milliseconds
 * @returns {object} - Cache management object
 */
export const useStorageCache = (key, ttl = 5 * 60 * 1000) => { // 5 minutes default
  const [cache, setCache, removeCache] = useLocalStorage(key, null, {
    validateValue: (value) => {
      if (!value || !value.timestamp) return false;
      return Date.now() - value.timestamp < ttl;
    }
  });

  const setCachedData = useCallback((data) => {
    setCache({
      data,
      timestamp: Date.now()
    });
  }, [setCache]);

  const getCachedData = useCallback(() => {
    if (!cache || !cache.timestamp) return null;
    
    if (Date.now() - cache.timestamp > ttl) {
      removeCache();
      return null;
    }
    
    return cache.data;
  }, [cache, ttl, removeCache]);

  const isExpired = cache ? Date.now() - cache.timestamp > ttl : true;

  return {
    cachedData: getCachedData(),
    setCachedData,
    clearCache: removeCache,
    isExpired,
    age: cache ? Date.now() - cache.timestamp : 0
  };
};

/**
 * Hook for bulk localStorage operations
 * @returns {object} - Bulk operations object
 */
export const useBulkStorage = () => {
  const setMultiple = useCallback((items) => {
    Object.entries(items).forEach(([key, value]) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    });
  }, []);

  const getMultiple = useCallback((keys) => {
    const result = {};
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        result[key] = item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting localStorage key "${key}":`, error);
        result[key] = null;
      }
    });
    return result;
  }, []);

  const removeMultiple = useCallback((keys) => {
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
      }
    });
  }, []);

  const clearAll = useCallback(() => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, []);

  return {
    setMultiple,
    getMultiple,
    removeMultiple,
    clearAll
  };
};

// Default export
export default useLocalStorage;
