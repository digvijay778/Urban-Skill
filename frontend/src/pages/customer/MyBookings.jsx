import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBookings } from '@features/booking/bookingSlice';
import BookingCard from '@components/cards/BookingCard';
import Loader from '@components/common/Loader';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);
  const intervalRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showReviewBanner, setShowReviewBanner] = useState(true);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchBookings()).finally(() => {
      setInitialLoad(false);
    });

    // Set up polling to refresh bookings every 30 seconds (reduced from 5s to avoid rate limiting)
    intervalRef.current = setInterval(() => {
      dispatch(fetchBookings());
    }, 30000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]);

  // Debug logging
  console.log('Customer Bookings - State:', { bookings, loading, initialLoad, bookingsLength: bookings?.length });

  // Count completed bookings that might need reviews
  const completedBookingsCount = bookings?.filter(b => b.status === 'COMPLETED')?.length || 0;

  if (loading && initialLoad) {
    return <Loader fullScreen text="Loading bookings..." />;
  }

  return (
    <div className="container py-12">
      {/* Review Reminder Banner */}
      {completedBookingsCount > 0 && showReviewBanner && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white rounded-xl shadow-lg p-6 mb-8 relative">
          <button
            onClick={() => setShowReviewBanner(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                🎉 You have {completedBookingsCount} completed {completedBookingsCount === 1 ? 'booking' : 'bookings'}!
              </h3>
              <p className="text-white/90 text-lg mb-3">
                Help the community by sharing your experience. Your reviews help workers grow and assist others in making informed decisions.
              </p>
              <p className="text-sm text-white/80">
                💡 Reviews with detailed feedback help workers improve their services
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Bookings</h1>
        {loading && !initialLoad && (
          <div className="flex items-center text-primary-600">
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Updating...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!bookings || bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg font-semibold">No bookings yet</p>
          <p className="text-gray-500 mt-2">Start by browsing our skilled workers</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
