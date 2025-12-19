import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import toast from 'react-hot-toast';

const AIBookingAssistant = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm your booking assistant. Just tell me what you need help with, and I'll find the perfect worker for you. For example, you could say:\n\n• 'My bathroom sink is leaking'\n• 'I need to fix a broken door'\n• 'Electrical socket not working'",
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
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    if (!user) {
      toast.error('Please login to use the booking assistant');
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
      // Send to AI assistant
      const response = await api.post('/ai/process-request', {
        message: userMessage,
        location: user.location || '',
      });

      const data = response.data.data;

      if (data.needsClarification) {
        // AI needs more information
        const questionsText = data.questions.join('\n\n');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I'd like to help you better. Could you please clarify:\n\n${questionsText}`,
            timestamp: new Date(),
          },
        ]);
      } else if (data.noWorkersFound) {
        // No workers available
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `I couldn't find any workers available for this service right now. You can try:\n\n• Browse our service categories\n• Post your requirement and wait for worker responses\n• Adjust your location or requirements`,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Found workers!
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
      console.error('AI Assistant Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble understanding that. Could you describe your problem in a different way?',
          timestamp: new Date(),
        },
      ]);
      toast.error(error.response?.data?.message || 'Failed to process request');
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
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        additionalNotes: '',
      });

      toast.success('Booking created successfully!');
      navigate(`/booking/${response.data.data.booking._id}`);
    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Booking Assistant</h1>
              <p className="text-gray-600">Tell me what you need, and I'll find the perfect worker for you</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Booking Preview Card */}
                  {message.hasBookingPreview && bookingPreview && (
                    <div className="mt-4 bg-white border-2 border-primary-200 rounded-xl p-4 shadow-md">
                      <h3 className="font-bold text-gray-900 mb-3">Recommended Worker</h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {bookingPreview.recommendedWorker.userId?.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {bookingPreview.recommendedWorker.userId?.firstName} {bookingPreview.recommendedWorker.userId?.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">⭐ {bookingPreview.recommendedWorker.averageRating || 0}</span>
                            <span className="text-gray-500">({bookingPreview.recommendedWorker.totalReviews || 0} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hourly Rate:</span>
                          <span className="font-semibold text-gray-900">₹{bookingPreview.recommendedWorker.hourlyRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-semibold text-gray-900">{bookingPreview.recommendedWorker.experience || 0} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Cost:</span>
                          <span className="font-semibold text-primary-600">
                            ₹{bookingPreview.estimatedCost.minCost} - ₹{bookingPreview.estimatedCost.maxCost}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmBooking}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md"
                      >
                        Confirm Booking
                      </button>

                      {bookingPreview.alternativeWorkers && bookingPreview.alternativeWorkers.length > 0 && (
                        <p className="text-xs text-center text-gray-500 mt-2">
                          +{bookingPreview.alternativeWorkers.length} more workers available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your problem... (e.g., 'My AC is not cooling')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="2"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-600">Smart understanding of your needs</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Instant Matching</h3>
            <p className="text-sm text-gray-600">Find the best worker in seconds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No Hassle</h3>
            <p className="text-sm text-gray-600">Just describe, we do the rest</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBookingAssistant;
