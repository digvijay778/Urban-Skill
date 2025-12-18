import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { BOOKING_STATUS_COLORS } from '@/utils/constants';
import Loader from '@components/common/Loader';
import toast from 'react-hot-toast';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data.data);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        toast.error('Failed to load booking details');
        navigate('/worker/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await api.patch(`/bookings/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
        <Link to="/worker/bookings" className="text-primary-600 hover:text-primary-700">
          Back to my bookings
        </Link>
      </div>
    );
  }

  const statusColor = BOOKING_STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800';
  const canAccept = booking.status === 'PENDING';
  const canComplete = booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS';
  const canReject = booking.status === 'PENDING';

  const customerName = booking.customerId?.firstName
    ? `${booking.customerId.firstName} ${booking.customerId.lastName}`
    : 'Customer';
  const customerInitial = customerName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">
                ID: #{booking._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor}`}>
              {booking.status}
            </span>
          </div>

          {/* Service Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Service Title</p>
                <p className="text-lg font-semibold text-gray-900">{booking.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.serviceCategory?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Scheduled Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(booking.scheduledDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(booking.totalAmount)}
                </p>
              </div>
            </div>

            {booking.description && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {booking.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {customerInitial}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{customerName}</h3>
              {booking.customerId?.email && (
                <p className="text-gray-600 mt-1">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {booking.customerId.email}
                </p>
              )}
              {booking.customerId?.phone && (
                <p className="text-gray-600 mt-1">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {booking.customerId.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Booking Created</p>
                <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
              </div>
            </div>

            {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
              <div className="flex items-start">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-4 h-4 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-500">{formatDate(booking.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {(canAccept || canComplete || canReject) && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {canAccept && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('ACCEPTED')}
                    disabled={updating}
                    className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Processing...' : 'Accept Booking'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={updating}
                    className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? 'Processing...' : 'Reject Booking'}
                  </button>
                </>
              )}

              {canComplete && (
                <button
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={updating}
                  className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
                >
                  {updating ? 'Processing...' : 'Mark as Completed'}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              {canAccept && 'Review the booking details before accepting or rejecting'}
              {canComplete && 'Complete this booking after finishing the service'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
