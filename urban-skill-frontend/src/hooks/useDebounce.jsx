// src/hooks/useChat.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { useApi, useApiMutation } from './useApi';

// Chat message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
  TYPING: 'typing'
};

// Chat status enum
export const CHAT_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

// Main chat hook
export const useChat = (chatId, options = {}) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(new Set());
  const [status, setStatus] = useState(CHAT_STATUS.DISCONNECTED);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const { socket, emit, on, off } = useSocket();
  const { user } = useAuth();
  const typingTimeoutRef = useRef(null);
  const lastMessageRef = useRef(null);

  const {
    autoMarkAsRead = true,
    typingTimeout = 3000,
    messageLimit = 50,
    onNewMessage,
    onUserJoined,
    onUserLeft,
    onTypingStart,
    onTypingStop,
    onError
  } = options;

  // Load chat history
  const { data: chatHistory, loading: historyLoading, refetch: refetchHistory } = useApi(
    chatId ? `/chats/${chatId}/messages?limit=${messageLimit}` : null,
    {
      enabled: !!chatId,
      onSuccess: (data) => {
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
    }
  );

  // Send message mutation
  const { mutate: sendMessageMutation, loading: sendingMessage } = useApiMutation(
    `/chats/${chatId}/messages`,
    {
      onSuccess: (data) => {
        // Message will be added via socket event
        if (onNewMessage) {
          onNewMessage(data);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error);
        }
      }
    }
  );

  // Mark messages as read
  const { mutate: markAsReadMutation } = useApiMutation(
    `/chats/${chatId}/mark-read`,
    {
      method: 'PATCH',
      onSuccess: () => {
        setUnreadCount(0);
      }
    }
  );

  // Socket event handlers
  useEffect(() => {
    if (!socket || !chatId || !user) return;

    setStatus(CHAT_STATUS.CONNECTING);

    // Join chat room
    emit('join_chat', { 
      chatId, 
      userId: user.id,
      userInfo: {
        name: user.name,
        avatar: user.avatar,
        role: user.role
      }
    });

    // Listen for connection status
    on('chat_joined', ({ chatId: joinedChatId }) => {
      if (joinedChatId === chatId) {
        setStatus(CHAT_STATUS.CONNECTED);
      }
    });

    // Listen for new messages
    on('new_message', (message) => {
      if (message.chatId === chatId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(msg => msg.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Update unread count if message is not from current user
        if (message.senderId !== user.id) {
          setUnreadCount(prev => prev + 1);
          
          // Auto mark as read if enabled and chat is active
          if (autoMarkAsRead && document.hasFocus()) {
            setTimeout(() => markAsRead(), 1000);
          }
        }

        // Store reference to last message
        lastMessageRef.current = message;

        if (onNewMessage) {
          onNewMessage(message);
        }
      }
    });

    // Listen for typing indicators
    on('user_typing', ({ chatId: typingChatId, userId, isTyping: userIsTyping, userInfo }) => {
      if (typingChatId === chatId && userId !== user.id) {
        setTyping(prev => {
          const newTyping = new Set(prev);
          if (userIsTyping) {
            newTyping.add({ userId, ...userInfo });
            if (onTypingStart) {
              onTypingStart({ userId, ...userInfo });
            }
          } else {
            newTyping.delete({ userId, ...userInfo });
            if (onTypingStop) {
              onTypingStop({ userId, ...userInfo });
            }
          }
          return newTyping;
        });
      }
    });

    // Listen for user events
    on('user_joined', ({ chatId: joinedChatId, userInfo }) => {
      if (joinedChatId === chatId && onUserJoined) {
        onUserJoined(userInfo);
      }
    });

    on('user_left', ({ chatId: leftChatId, userInfo }) => {
      if (leftChatId === chatId && onUserLeft) {
        onUserLeft(userInfo);
      }
    });

    // Listen for errors
    on('chat_error', ({ chatId: errorChatId, error }) => {
      if (errorChatId === chatId) {
        setStatus(CHAT_STATUS.ERROR);
        if (onError) {
          onError(error);
        }
      }
    });

    // Cleanup function
    return () => {
      off('chat_joined');
      off('new_message');
      off('user_typing');
      off('user_joined');
      off('user_left');
      off('chat_error');
      
      emit('leave_chat', { chatId, userId: user.id });
      setStatus(CHAT_STATUS.DISCONNECTED);
    };
  }, [socket, chatId, user, autoMarkAsRead, onNewMessage, onUserJoined, onUserLeft, onTypingStart, onTypingStop, onError]);

  // Send message function
  const sendMessage = useCallback(async (content, type = MESSAGE_TYPES.TEXT, metadata = {}) => {
    if (!socket || !chatId || !content.trim()) return;

    const messageData = {
      chatId,
      senderId: user.id,
      content: content.trim(),
      type,
      metadata,
      timestamp: new Date().toISOString(),
      tempId: `temp_${Date.now()}_${Math.random()}`
    };

    // Add message optimistically
    setMessages(prev => [...prev, { ...messageData, status: 'sending' }]);

    try {
      // Send via API for persistence
      await sendMessageMutation(messageData);
      
      // Also emit via socket for real-time delivery
      emit('send_message', messageData);
    } catch (error) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.tempId !== messageData.tempId));
      throw error;
    }
  }, [socket, chatId, user, sendMessageMutation, emit]);

  // Send typing indicator
  const sendTyping = useCallback((isCurrentlyTyping) => {
    if (!socket || !chatId) return;

    setIsTyping(isCurrentlyTyping);
    
    emit('typing', { 
      chatId, 
      userId: user.id, 
      isTyping: isCurrentlyTyping,
      userInfo: {
        name: user.name,
        avatar: user.avatar
      }
    });

    // Auto-stop typing after timeout
    if (isCurrentlyTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
      }, typingTimeout);
    }
  }, [socket, chatId, user, emit, typingTimeout]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (unreadCount > 0) {
      try {
        await markAsReadMutation();
        emit('mark_read', { chatId, userId: user.id });
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    }
  }, [unreadCount, markAsReadMutation, emit, chatId, user]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (messages.length === 0) return;
    
    const oldestMessage = messages[0];
    try {
      const response = await fetch(
        `/api/chats/${chatId}/messages?before=${oldestMessage.id}&limit=${messageLimit}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(prev => [...data.messages, ...prev]);
      }
      
      return data.messages;
    } catch (error) {
      console.error('Failed to load more messages:', error);
      return [];
    }
  }, [messages, chatId, messageLimit, user.token]);

  // Send file/image
  const sendFile = useCallback(async (file, caption = '') => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);
    formData.append('caption', caption);

    try {
      const response = await fetch('/api/chats/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const messageType = file.type.startsWith('image/') ? MESSAGE_TYPES.IMAGE : MESSAGE_TYPES.FILE;
        await sendMessage(data.fileUrl, messageType, {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          caption
        });
      }
      
      return data;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }, [chatId, user.token, sendMessage]);

  // Get typing users list
  const typingUsers = Array.from(typing);

  // Get last message
  const lastMessage = messages[messages.length - 1] || lastMessageRef.current;

  return {
    // State
    messages,
    typing: typingUsers,
    status,
    unreadCount,
    isTyping,
    loading: historyLoading,
    sendingMessage,
    lastMessage,
    
    // Actions
    sendMessage,
    sendTyping,
    sendFile,
    markAsRead,
    loadMoreMessages,
    refetchHistory,
    
    // Utilities
    isConnected: status === CHAT_STATUS.CONNECTED,
    hasUnreadMessages: unreadCount > 0,
    canSendMessages: status === CHAT_STATUS.CONNECTED && !sendingMessage
  };
};

// Hook for chat list management
export const useChatList = () => {
  const { user } = useAuth();
  const { socket, emit, on, off } = useSocket();

  const { data: chats, loading, refetch } = useApi('/chats', {
    enabled: !!user,
    onSuccess: (data) => {
      // Sort chats by last message time
      return data.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    }
  });

  // Create new chat
  const { mutate: createChat, loading: creatingChat } = useApiMutation('/chats', {
    onSuccess: (newChat) => {
      refetch();
    }
  });

  // Listen for chat updates
  useEffect(() => {
    if (!socket || !user) return;

    on('chat_updated', (updatedChat) => {
      refetch();
    });

    on('new_chat_created', (newChat) => {
      if (newChat.participants.includes(user.id)) {
        refetch();
      }
    });

    return () => {
      off('chat_updated');
      off('new_chat_created');
    };
  }, [socket, user, refetch]);

  const startChat = useCallback(async (participantIds, chatType = 'direct') => {
    return await createChat({
      participants: [user.id, ...participantIds],
      type: chatType
    });
  }, [createChat, user.id]);

  return {
    chats: chats || [],
    loading,
    creatingChat,
    startChat,
    refetch
  };
};

// Hook for chat notifications
export const useChatNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket, on, off } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user) return;

    on('chat_notification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10
    });

    return () => {
      off('chat_notification');
    };
  }, [socket, user]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  return {
    notifications,
    clearNotifications,
    removeNotification,
    hasNotifications: notifications.length > 0
  };
};

// Default export
export default useChat;
