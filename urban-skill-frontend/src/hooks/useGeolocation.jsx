// src/hooks/useGeolocation.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

// Geolocation error types
export const GEOLOCATION_ERRORS = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE: 'POSITION_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  UNKNOWN: 'UNKNOWN'
};

// Default options for geolocation
const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
};

/**
 * Main useGeolocation hook
 * @param {object} options - Geolocation options
 * @returns {object} - Location state and methods
 */
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestamp: null,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
  
  const watchIdRef = useRef(null);
  const optionsRef = useRef({ ...DEFAULT_OPTIONS, ...options });

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = { ...DEFAULT_OPTIONS, ...options };
  }, [options]);

  // Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  // Get error type from GeolocationPositionError
  const getErrorType = useCallback((error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return GEOLOCATION_ERRORS.PERMISSION_DENIED;
      case error.POSITION_UNAVAILABLE:
        return GEOLOCATION_ERRORS.POSITION_UNAVAILABLE;
      case error.TIMEOUT:
        return GEOLOCATION_ERRORS.TIMEOUT;
      default:
        return GEOLOCATION_ERRORS.UNKNOWN;
    }
  }, []);

  // Success callback
  const handleSuccess = useCallback((position) => {
    const {
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
    } = position.coords;

    setLocation({
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
      timestamp: position.timestamp,
    });

    setError(null);
    setLoading(false);
    setPermission('granted');
  }, []);

  // Error callback
  const handleError = useCallback((error) => {
    const errorType = getErrorType(error);
    
    setError({
      type: errorType,
      message: error.message,
      code: error.code,
    });

    setLoading(false);
    
    if (errorType === GEOLOCATION_ERRORS.PERMISSION_DENIED) {
      setPermission('denied');
    }
  }, [getErrorType]);

  // Get current position
  const getCurrentPosition = useCallback(async (customOptions = {}) => {
    if (!isSupported) {
      const notSupportedError = {
        type: GEOLOCATION_ERRORS.NOT_SUPPORTED,
        message: 'Geolocation is not supported by this browser',
        code: -1,
      };
      setError(notSupportedError);
      return Promise.reject(notSupportedError);
    }

    setLoading(true);
    setError(null);

    const finalOptions = { ...optionsRef.current, ...customOptions };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess(position);
          resolve(position);
        },
        (error) => {
          handleError(error);
          reject(error);
        },
        finalOptions
      );
    });
  }, [isSupported, handleSuccess, handleError]);

  // Start watching position
  const startWatching = useCallback((customOptions = {}) => {
    if (!isSupported) {
      setError({
        type: GEOLOCATION_ERRORS.NOT_SUPPORTED,
        message: 'Geolocation is not supported by this browser',
        code: -1,
      });
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setLoading(true);
    setError(null);

    const finalOptions = { ...optionsRef.current, ...customOptions };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      finalOptions
    );

    return watchIdRef.current;
  }, [isSupported, handleSuccess, handleError]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setLoading(false);
    }
  }, []);

  // Check permission status
  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermission(result.state);
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermission(result.state);
        });
        
        return result.state;
      } catch (error) {
        console.warn('Could not check geolocation permission:', error);
      }
    }
    return permission;
  }, [permission]);

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      await getCurrentPosition();
      return 'granted';
    } catch (error) {
      if (error.code === 1) { // PERMISSION_DENIED
        return 'denied';
      }
      throw error;
    }
  }, [getCurrentPosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    // Location data
    location,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    altitude: location.altitude,
    heading: location.heading,
    speed: location.speed,
    timestamp: location.timestamp,
    
    // State
    loading,
    error,
    permission,
    isSupported,
    
    // Methods
    getCurrentPosition,
    startWatching,
    stopWatching,
    checkPermission,
    requestPermission,
    
    // Computed properties
    hasLocation: location.latitude !== null && location.longitude !== null,
    isWatching: watchIdRef.current !== null,
    canUseLocation: isSupported && permission === 'granted',
  };
};

/**
 * Hook for distance calculations
 * @param {object} fromLocation - Starting location {latitude, longitude}
 * @param {object} toLocation - Destination location {latitude, longitude}
 * @returns {object} - Distance calculations
 */
export const useDistance = (fromLocation, toLocation) => {
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);

  // Calculate distance using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Calculate bearing
  const calculateBearing = useCallback((lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360; // Normalize to 0-360
  }, []);

  useEffect(() => {
    if (fromLocation?.latitude && fromLocation?.longitude && 
        toLocation?.latitude && toLocation?.longitude) {
      
      const dist = calculateDistance(
        fromLocation.latitude,
        fromLocation.longitude,
        toLocation.latitude,
        toLocation.longitude
      );
      
      const bear = calculateBearing(
        fromLocation.latitude,
        fromLocation.longitude,
        toLocation.latitude,
        toLocation.longitude
      );
      
      setDistance(dist);
      setBearing(bear);
    } else {
      setDistance(null);
      setBearing(null);
    }
  }, [fromLocation, toLocation, calculateDistance, calculateBearing]);

  return {
    distance, // in kilometers
    distanceInMiles: distance ? distance * 0.621371 : null,
    distanceInMeters: distance ? distance * 1000 : null,
    bearing, // in degrees (0-360)
    bearingCompass: bearing ? getBearingCompass(bearing) : null,
  };
};

/**
 * Hook for nearby locations
 * @param {object} currentLocation - Current location {latitude, longitude}
 * @param {array} locations - Array of locations to check
 * @param {number} radius - Radius in kilometers
 * @returns {object} - Nearby locations
 */
export const useNearbyLocations = (currentLocation, locations = [], radius = 5) => {
  const [nearbyLocations, setNearbyLocations] = useState([]);

  useEffect(() => {
    if (!currentLocation?.latitude || !currentLocation?.longitude || !locations.length) {
      setNearbyLocations([]);
      return;
    }

    const nearby = locations.filter(location => {
      if (!location.latitude || !location.longitude) return false;
      
      const distance = calculateHaversineDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        location.latitude,
        location.longitude
      );
      
      return distance <= radius;
    }).map(location => ({
      ...location,
      distance: calculateHaversineDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        location.latitude,
        location.longitude
      )
    })).sort((a, b) => a.distance - b.distance);

    setNearbyLocations(nearby);
  }, [currentLocation, locations, radius]);

  return {
    nearbyLocations,
    count: nearbyLocations.length,
    closest: nearbyLocations[0] || null,
  };
};

/**
 * Hook for address geocoding
 * @returns {object} - Geocoding methods
 */
export const useGeocoding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert address to coordinates (requires geocoding service)
  const geocodeAddress = useCallback(async (address) => {
    setLoading(true);
    setError(null);

    try {
      // This would integrate with your geocoding service (Google Maps, etc.)
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(address)}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  // Convert coordinates to address (reverse geocoding)
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reverse-geocode?lat=${latitude}&lng=${longitude}`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    geocodeAddress,
    reverseGeocode,
    loading,
    error,
  };
};

// Utility functions
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getBearingCompass = (bearing) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

// Default export
export default useGeolocation;
