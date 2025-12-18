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
  const [cancelling, setCancelling] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data.data);
        
        // Check if review exists
        try {
          const reviewRes = await api.get(`/reviews/booking/${id}`);
          if (reviewRes.data.data) {
            setExistingReview(reviewRes.data.data);
          }
        } catch (err) {
          // No review exists, which is fine
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        toast.error('Failed to load booking details');
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelling(true);
      const response = await api.patch(`/bookings/${id}/cancel`, {
        cancellationReason: 'Cancelled by customer',
      });
      toast.success('Booking cancelled successfully');
      // Update booking data with response
      setBooking(response.data.data);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!review.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await api.post(`/reviews/${id}`, review);
      toast.success('Review submitted successfully!');
      setExistingReview(response.data.data);
      setShowReviewModal(false);
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
        <Link to="/my-bookings" className="text-primary-600 hover:text-primary-700">
          Back to my bookings
        </Link>
      </div>
    );
  }

  const statusColor = BOOKING_STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800';
  const canCancel = ['PENDING', 'ACCEPTED'].includes(booking.status);
  const canReview = booking.status === 'COMPLETED' && !existingReview;

  const workerName = booking.workerId?.firstName
    ? `${booking.workerId.firstName} ${booking.workerId.lastName}`
    : 'Worker';
  const workerInitial = workerName.charAt(0).toUpperCase();

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
                <p className="text-sm text-gray-500 mb-1">Budget</p>
                <p className="text-lg font-bold text-primary-600">
                  {formatCurrency(booking.budget)}
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

        {/* Worker Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Worker Information</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {workerInitial}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{workerName}</h3>
              {booking.workerId?.email && (
                <p className="text-gray-600 mt-1">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {booking.workerId.email}
                </p>
              )}
              {booking.workerId?.phone && (
                <p className="text-gray-600 mt-1">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {booking.workerId.phone}
                </p>
              )}
            </div>
            <Link
              to={`/workers/${booking.workerId?._id}`}
              className="btn-primary px-6 py-2"
            >
              View Profile
            </Link>
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
        {(canCancel || canReview) && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
            {canCancel && (
              <>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  You can cancel this booking before it starts
                </p>
              </>
            )}
            {canReview && (
              <>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Leave a Review
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Share your experience with this worker
                </p>
              </>
            )}
          </div>
        )}

        {/* Review Display */}
        {existingReview && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Review</h2>
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-6 h-6 ${
                    index < existingReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600 text-sm">
                {formatDate(existingReview.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{existingReview.comment}</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave a Review</h3>
            
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({ ...review, rating: star })}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Share your experience with this worker..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
