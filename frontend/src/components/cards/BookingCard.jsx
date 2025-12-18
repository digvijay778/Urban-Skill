import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { BOOKING_STATUS_COLORS, USER_ROLES } from '@/utils/constants';

const BookingCard = ({ booking }) => {
  const { user } = useSelector((state) => state.auth);
  const statusColor = BOOKING_STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800';
  
  // Determine the correct route based on user role
  const detailsRoute = user?.role === USER_ROLES.WORKER 
    ? `/worker/bookings/${booking._id}` 
    : `/bookings/${booking._id}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{booking._id?.slice(-6).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(booking.createdAt)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {booking.status}
        </span>
      </div>

      {/* Worker/Customer Info */}
      <div className="mb-4">
        {booking.worker && (
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              {booking.worker.profilePicture ? (
                <img
                  src={booking.worker.profilePicture}
                  alt={booking.worker.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 font-semibold">
                  {booking.worker.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {booking.worker.name}
              </p>
              <p className="text-xs text-gray-500">Worker</p>
            </div>
          </div>
        )}

        {booking.customer && (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-semibold">
                {booking.customer.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {booking.customer.name}
              </p>
              <p className="text-xs text-gray-500">Customer</p>
            </div>
          </div>
        )}
      </div>

      {/* Service Details */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Service Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(booking.scheduledDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Duration</p>
            <p className="text-sm font-medium text-gray-900">
              {booking.duration} hours
            </p>
          </div>
        </div>

        {booking.description && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {booking.description}
            </p>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <span className="text-gray-600 text-sm">Total Amount</span>
        <span className="text-xl font-bold text-primary-600">
          {formatCurrency(booking.totalAmount)}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4">
        <Link
          to={detailsRoute}
          className="block w-full bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;
