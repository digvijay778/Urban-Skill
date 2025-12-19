import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import toast from 'react-hot-toast';

const AIBotButton = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your AI assistant. Just describe your problem and I'll find the perfect worker for you!\n\nTry: 'My AC is not cooling' or 'Need plumber for leaking pipe'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingPreview, setBookingPreview] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    if (!isAuthenticated) {
      toast.error('Please login to use the AI assistant');
      setIsOpen(false);
      navigate('/login');
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setIsProcessing(true);

    try {
      const response = await api.post('/ai/process-request', {
        message: userMessage,
        location: user?.location || '',
      });

      const data = response.data.data;

      if (data.needsClarification) {
        const questionsText = data.questions.join('\n\n');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I need a bit more information:\n\n${questionsText}`,
            timestamp: new Date(),
          },
        ]);
      } else if (data.noWorkersFound) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Sorry, no workers available right now for this service. You can:\n• Browse all workers\n• Try different requirements\n• Check back later`,
            timestamp: new Date(),
          },
        ]);
      } else {
        setBookingPreview(data);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.summary,
            timestamp: new Date(),
            hasBookingPreview: true,
          },
        ]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble processing that. Could you try describing it differently?',
          timestamp: new Date(),
        },
      ]);
      toast.error(error.response?.data?.message || 'AI assistant error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingPreview) return;

    try {
      const response = await api.post('/ai/create-booking', {
        workerId: bookingPreview.recommendedWorker._id,
        bookingDetails: bookingPreview.bookingDetails,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        additionalNotes: '',
      });

      toast.success('Booking created successfully!');
      setIsOpen(false);
      navigate(`/bookings/${response.data.data.booking._id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBotClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to use AI assistant');
      navigate('/login');
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Bot Button */}
      <button
        onClick={handleBotClick}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <span className="text-3xl animate-bounce">🤖</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Need help? Ask AI! 💬
          </span>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-xs text-purple-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white text-gray-900 shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Worker Preview */}
                  {message.hasBookingPreview && bookingPreview && (
                    <div className="mt-3 bg-white border-2 border-purple-200 rounded-xl p-3 shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {bookingPreview.recommendedWorker.userId?.firstName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {bookingPreview.recommendedWorker.userId?.firstName} {bookingPreview.recommendedWorker.userId?.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-yellow-500">⭐ {bookingPreview.recommendedWorker.averageRating || 0}</span>
                            <span className="text-gray-500">({bookingPreview.recommendedWorker.totalReviews || 0})</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2 mb-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rate:</span>
                          <span className="font-semibold">₹{bookingPreview.recommendedWorker.hourlyRate}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated:</span>
                          <span className="font-semibold text-purple-600">
                            ₹{bookingPreview.estimatedCost.minCost} - ₹{bookingPreview.estimatedCost.maxCost}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmBooking}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your problem..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="2"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIBotButton;
