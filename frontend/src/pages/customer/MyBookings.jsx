import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '@features/booking/bookingSlice';
import BookingCard from '@components/cards/BookingCard';
import Loader from '@components/common/Loader';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchBookings());

    // Set up polling to refresh bookings every 10 seconds
    intervalRef.current = setInterval(() => {
      dispatch(fetchBookings());
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]);

  if (loading) {
    return <Loader fullScreen text="Loading bookings..." />;
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">No bookings yet</p>
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
