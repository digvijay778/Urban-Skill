import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Slide,
  Fade,
  CircularProgress,
  Divider,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Chat,
  Close,
  Send,
  SmartToy,
  Person,
  Minimize,
  Refresh,
  SupportAgent
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@context/AuthContext'
import { apiService } from '@services/api'

const ChatWidget = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, isAuthenticated } = useAuth()
  
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  
  // Refs
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initial welcome message
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Hi ${user?.firstName || 'there'}! 👋 I'm your Urban Skill assistant. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      }
      setMessages([welcomeMessage])
    }
  }, [isAuthenticated, user, messages.length])

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Quick action suggestions
  const quickActions = [
    { label: 'Book a Service', action: 'book_service' },
    { label: 'Find Electrician', action: 'find_electrician' },
    { label: 'Check Booking', action: 'check_booking' },
    { label: 'Get Support', action: 'get_support' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleToggleChat = () => {
    setIsOpen(!isOpen)
    setHasNewMessage(false)
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setIsLoading(true)

    try {
      // Simulate AI response (replace with actual API call)
      const response = await simulateAIResponse(inputMessage)
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          type: response.type,
          actions: response.actions
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
        setIsLoading(false)
        
        if (!isOpen) {
          setHasNewMessage(true)
        }
      }, 1500)
    } catch (error) {
      setIsTyping(false)
      setIsLoading(false)
      console.error('Chat error:', error)
    }
  }

  // Simulate AI response (replace with actual chatbot API)
  const simulateAIResponse = async (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('book') || lowerMessage.includes('service')) {
      return {
        text: "I'd be happy to help you book a service! What type of service are you looking for? We have electricians, plumbers, cleaners, and more.",
        type: 'service_inquiry',
        actions: ['book_service']
      }
    }
    
    if (lowerMessage.includes('electrician') || lowerMessage.includes('electrical')) {
      return {
        text: "Great! I can help you find a qualified electrician. We have 150+ verified electrical professionals available. What's your location?",
        type: 'service_specific',
        actions: ['find_electrician']
      }
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        text: "Our pricing is transparent and competitive! Electrical services start from ₹299, plumbing from ₹199, and cleaning from ₹149. Would you like a detailed quote?",
        type: 'pricing',
        actions: ['get_quote']
      }
    }
    
    if (lowerMessage.includes('booking') || lowerMessage.includes('order')) {
      return {
        text: "I can help you check your booking status. Could you please provide your booking ID or registered phone number?",
        type: 'booking_inquiry',
        actions: ['check_booking']
      }
    }
    
    return {
      text: "I understand you're looking for help with home services. I can assist you with booking services, finding professionals, checking prices, or answering any questions about Urban Skill. What would you like to know?",
      type: 'general',
      actions: ['book_service', 'get_support']
    }
  }

  const handleQuickAction = (action) => {
    const actionMessages = {
      book_service: "I'd like to book a service",
      find_electrician: "Find me an electrician",
      check_booking: "Check my booking status",
      get_support: "I need help with my account"
    }
    
    setInputMessage(actionMessages[action])
    handleSendMessage()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot'
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: isBot ? 'flex-start' : 'flex-end',
            mb: 2,
            alignItems: 'flex-end'
          }}
        >
          {isBot && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                backgroundColor: 'primary.main'
              }}
            >
              <SmartToy sx={{ fontSize: 18 }} />
            </Avatar>
          )}
          
          <Paper
            elevation={1}
            sx={{
              px: 2,
              py: 1.5,
              maxWidth: '75%',
              backgroundColor: isBot ? 'grey.100' : 'primary.main',
              color: isBot ? 'text.primary' : 'white',
              borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px'
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {message.text}
            </Typography>
            
            {message.actions && (
              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {message.actions.map((action, index) => (
                  <Chip
                    key={index}
                    label={quickActions.find(qa => qa.action === action)?.label || action}
                    size="small"
                    onClick={() => handleQuickAction(action)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'grey.100'
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
          
          {!isBot && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                ml: 1,
                backgroundColor: 'secondary.main'
              }}
            >
              <Person sx={{ fontSize: 18 }} />
            </Avatar>
          )}
        </Box>
      </motion.div>
    )
  }

  return (
    <>
      {/* Chat Fab Button */}
      <Fab
        color="primary"
        onClick={handleToggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 64,
          height: 64,
          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 24px rgba(99, 102, 241, 0.4)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <AnimatePresence mode="wait">
          {hasNewMessage && !isOpen ? (
            <motion.div
              key="notification"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 20,
                height: 20,
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}
            />
          ) : null}
        </AnimatePresence>
        
        {isOpen ? <Close /> : <Chat />}
      </Fab>

      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: isMobile ? 'calc(100vw - 48px)' : 380,
            height: isMinimized ? 60 : 500,
            zIndex: 1300,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'height 0.3s ease'
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1.5, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <SmartToy />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Urban Skill Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {isTyping ? 'Typing...' : 'Online'}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <IconButton size="small" onClick={handleMinimize} sx={{ color: 'white', mr: 0.5 }}>
                <Minimize />
              </IconButton>
              <IconButton size="small" onClick={handleToggleChat} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 2,
                  backgroundColor: '#fafafa'
                }}
              >
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <SmartToy sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Start a conversation with our AI assistant
                    </Typography>
                  </Box>
                ) : (
                  messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))
                )}
                
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, backgroundColor: 'primary.main' }}>
                      <SmartToy sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        px: 2,
                        py: 1.5,
                        backgroundColor: 'grey.100',
                        borderRadius: '16px 16px 16px 4px'
                      }}
                    >
                      <CircularProgress size={16} />
                    </Paper>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <Box sx={{ px: 2, pb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Quick actions:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {quickActions.map((action, index) => (
                      <Chip
                        key={index}
                        label={action.label}
                        size="small"
                        onClick={() => handleQuickAction(action.action)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider />

              {/* Input Area */}
              <Box sx={{ p: 2, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    ref={inputRef}
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      },
                      '&:disabled': {
                        backgroundColor: 'grey.300'
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  </IconButton>
                </Box>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Powered by Urban Skill AI
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Slide>
    </>
  )
}

export default ChatWidget

