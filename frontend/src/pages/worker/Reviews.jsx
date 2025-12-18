import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '@/services/api';
import { formatDate } from '@/utils/formatDate';
import Loader from '@components/common/Loader';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch worker profile to get userId
        const profileRes = await api.get('/workers/profile');
        const workerId = profileRes.data.data.userId?._id || profileRes.data.data.userId;
        
        if (workerId) {
          // Fetch reviews
          const reviewsRes = await api.get(`/reviews/worker/${workerId}`);
          const reviewsData = reviewsRes.data.data?.reviews || [];
          setReviews(reviewsData);
          
          // Calculate stats
          const total = reviewsData.length;
          const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
          const average = total > 0 ? sum / total : 0;
          
          // Calculate distribution
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          reviewsData.forEach(r => {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
          });
          
          setStats({ average, total, distribution });
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderRatingBar = (rating, count) => {
    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 w-8">{rating} ★</span>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return <Loader fullScreen text="Loading reviews..." />;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Reviews</h1>

      {/* Stats Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Overall Rating */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Overall Rating</h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {stats.average.toFixed(1)}
              </div>
              {renderStars(Math.round(stats.average))}
              <p className="text-sm text-gray-600 mt-2">
                Based on {stats.total} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating}>
                {renderRatingBar(rating, stats.distribution[rating])}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">
          All Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600">
              Complete jobs to start receiving customer reviews
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.customerId?.firstName} {review.customerId?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                )}
                
                {review.bookingId && (
                  <div className="mt-3 text-sm text-gray-500">
                    Booking ID: {review.bookingId._id || review.bookingId}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
