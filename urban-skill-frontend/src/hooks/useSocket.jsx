// src/hooks/useSocket.jsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';

// Socket connection states
export const SOCKET_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
};

// Socket event types for Urban Skill Platform
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  
  // User events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  USER_STATUS_CHANGE: 'user_status_change',
  
  // Booking events
  BOOKING_CREATED: 'booking_created',
  BOOKING_UPDATED: 'booking_updated',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_COMPLETED: 'booking_completed',
  WORKER_ASSIGNED: 'worker_assigned',
  
  // Chat events
  NEW_MESSAGE: 'new_message',
  MESSAGE_READ: 'message_read',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',
  
  // Notification events
  NEW_NOTIFICATION: 'new_notification',
  NOTIFICATION_READ: 'notification_read',
  
  // Worker events
  WORKER_LOCATION_UPDATE: 'worker_location_update',
  JOB_REQUEST: 'job_request',
  JOB_ACCEPTED: 'job_accepted',
  JOB_REJECTED: 'job_rejected',
  
  // Admin events
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  USER_VERIFICATION: 'user_verification',
  PAYMENT_UPDATE: 'payment_update'
};

// Default socket configuration
const DEFAULT_CONFIG = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: false
};

/**
 * Main useSocket hook
 * @param {string} serverPath - Socket server URL
 * @param {object} options - Socket configuration options
 * @returns {object} - Socket state and methods
 */
export const useSocket = (serverPath = null, options = {}) => {
  const { user, token, isAuthenticated } = useAuth();
  const [connectionState, setConnectionState] = useState(SOCKET_STATES.DISCONNECTED);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastConnectedAt, setLastConnectedAt] = useState(null);
  
  const socketRef = useRef(null);
  const eventListenersRef = useRef(new Map());
  const reconnectTimeoutRef = useRef(null);

  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    auth: {
      token,
      userId: user?.id,
      userRole: user?.role,
      ...options.auth
    }
  };

  // Get server URL
  const getServerUrl = useCallback(() => {
    if (serverPath) return serverPath;
    
    // Default server URLs based on environment
    const baseUrl = process.env.REACT_APP_SOCKET_URL || 
                   process.env.REACT_APP_API_URL || 
                   'http://localhost:5000';
    
    return baseUrl.replace('/api', ''); // Remove /api if present
  }, [serverPath]);

  // Connect to socket server
  const connect = useCallback(() => {
    if (!isAuthenticated || !user || !token) {
      setConnectionState(SOCKET_STATES.DISCONNECTED);
      return;
    }

    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    try {
      setConnectionState(SOCKET_STATES.CONNECTING);
      setError(null);

      const serverUrl = getServerUrl();
      
      socketRef.current = io(serverUrl, {
        ...config,
        auth: {
          ...config.auth,
          token,
          userId: user.id,
          userRole: user.role
        }
      });

      // Connection event handlers
      socketRef.current.on('connect', () => {
        setConnectionState(SOCKET_STATES.CONNECTED);
        setLastConnectedAt(new Date());
        setReconnectAttempts(0);
        setError(null);
        
        // Emit user online status
        socketRef.current.emit(SOCKET_EVENTS.USER_ONLINE, {
          userId: user.id,
          userRole: user.role,
          timestamp: new Date().toISOString()
        });
      });

      socketRef.current.on('disconnect', (reason) => {
        setConnectionState(SOCKET_STATES.DISCONNECTED);
        
        // Emit user offline status if it was a clean disconnect
        if (reason === 'io client disconnect') {
          socketRef.current.emit(SOCKET_EVENTS.USER_OFFLINE, {
            userId: user.id,
            timestamp: new Date().toISOString()
          });
        }
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        setConnectionState(SOCKET_STATES.CONNECTED);
        setReconnectAttempts(attemptNumber);
        setError(null);
      });

      socketRef.current.on('reconnect_attempt', (attemptNumber) => {
        setConnectionState(SOCKET_STATES.RECONNECTING);
        setReconnectAttempts(attemptNumber);
      });

      socketRef.current.on('reconnect_error', (error) => {
        setError(error.message);
      });

      socketRef.current.on('connect_error', (error) => {
        setConnectionState(SOCKET_STATES.ERROR);
        setError(error.message);
      });

      return socketRef.current;
    } catch (err) {
      setConnectionState(SOCKET_STATES.ERROR);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated, user, token, config, getServerUrl]);

  // Disconnect from socket server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      // Emit user offline status before disconnecting
      socketRef.current.emit(SOCKET_EVENTS.USER_OFFLINE, {
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
      
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setConnectionState(SOCKET_STATES.DISCONNECTED);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, [user]);

  // Emit event to server
  const emit = useCallback((event, data, callback) => {
    if (socketRef.current?.connected) {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
      return true;
    }
    return false;
  }, []);

  // Listen for events from server
  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      
      // Store event listener for cleanup
      if (!eventListenersRef.current.has(event)) {
        eventListenersRef.current.set(event, new Set());
      }
      eventListenersRef.current.get(event).add(handler);
    }
  }, []);

  // Remove event listener
  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event, handler);
        
        // Remove from stored listeners
        if (eventListenersRef.current.has(event)) {
          eventListenersRef.current.get(event).delete(handler);
        }
      } else {
        socketRef.current.off(event);
        eventListenersRef.current.delete(event);
      }
    }
  }, []);

  // Listen for event once
  const once = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.once(event, handler);
    }
  }, []);

  // Join a room
  const joinRoom = useCallback((roomId, data = {}) => {
    return emit('join_room', { roomId, ...data });
  }, [emit]);

  // Leave a room
  const leaveRoom = useCallback((roomId, data = {}) => {
    return emit('leave_room', { roomId, ...data });
  }, [emit]);

  // Send message to specific user
  const sendToUser = useCallback((userId, event, data) => {
    return emit('send_to_user', { userId, event, data });
  }, [emit]);

  // Send message to room
  const sendToRoom = useCallback((roomId, event, data) => {
    return emit('send_to_room', { roomId, event, data });
  }, [emit]);

  // Update user status
  const updateUserStatus = useCallback((status, metadata = {}) => {
    return emit(SOCKET_EVENTS.USER_STATUS_CHANGE, {
      userId: user?.id,
      status,
      metadata,
      timestamp: new Date().toISOString()
    });
  }, [emit, user]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && token && config.autoConnect) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user, token, connect, disconnect, config.autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all event listeners
      eventListenersRef.current.clear();
      
      // Disconnect socket
      disconnect();
    };
  }, [disconnect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (connectionState === SOCKET_STATES.CONNECTED) {
      const heartbeatInterval = setInterval(() => {
        emit('heartbeat', { timestamp: new Date().toISOString() });
      }, 30000); // Every 30 seconds

      return () => clearInterval(heartbeatInterval);
    }
  }, [connectionState, emit]);

  return {
    // Socket instance
    socket: socketRef.current,
    
    // Connection state
    connectionState,
    isConnected: connectionState === SOCKET_STATES.CONNECTED,
    isConnecting: connectionState === SOCKET_STATES.CONNECTING,
    isReconnecting: connectionState === SOCKET_STATES.RECONNECTING,
    isDisconnected: connectionState === SOCKET_STATES.DISCONNECTED,
    hasError: connectionState === SOCKET_STATES.ERROR,
    
    // Connection info
    error,
    reconnectAttempts,
    lastConnectedAt,
    
    // Connection methods
    connect,
    disconnect,
    
    // Event methods
    emit,
    on,
    off,
    once,
    
    // Room methods
    joinRoom,
    leaveRoom,
    
    // Messaging methods
    sendToUser,
    sendToRoom,
    
    // Status methods
    updateUserStatus,
    
    // Utility
    socketId: socketRef.current?.id,
  };
};

/**
 * Hook for real-time notifications
 * @returns {object} - Notification state and methods
 */
export const useSocketNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { emit, on, off, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // Listen for notification read
    const handleNotificationRead = ({ notificationId }) => {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    on(SOCKET_EVENTS.NEW_NOTIFICATION, handleNewNotification);
    on(SOCKET_EVENTS.NOTIFICATION_READ, handleNotificationRead);

    return () => {
      off(SOCKET_EVENTS.NEW_NOTIFICATION, handleNewNotification);
      off(SOCKET_EVENTS.NOTIFICATION_READ, handleNotificationRead);
    };
  }, [isConnected, on, off]);

  const markAsRead = useCallback((notificationId) => {
    emit(SOCKET_EVENTS.NOTIFICATION_READ, { notificationId });
  }, [emit]);

  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    unreadIds.forEach(id => markAsRead(id));
  }, [notifications, markAsRead]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};

/**
 * Hook for real-time location tracking (for workers)
 * @returns {object} - Location tracking state and methods
 */
export const useSocketLocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const { emit, isConnected } = useSocket();
  const watchIdRef = useRef(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation || !isConnected) return;

    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };

        setLastLocation(location);
        emit(SOCKET_EVENTS.WORKER_LOCATION_UPDATE, location);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    );
  }, [isConnected, emit]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    isTracking,
    lastLocation,
    startTracking,
    stopTracking,
  };
};

// Default export
export default useSocket;
