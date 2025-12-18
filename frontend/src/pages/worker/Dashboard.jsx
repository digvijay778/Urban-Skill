import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import Loader from '@components/common/Loader';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch worker profile first to get the userId
        const profileRes = await api.get(`/workers/profile`);
        const profile = profileRes.data.data;
        setWorkerProfile(profile);
        
        // Use the userId from the worker profile to fetch reviews
        const workerId = profile.userId?._id || profile.userId;
        
        // Fetch bookings
        const bookingsRes = await api.get('/bookings/my-bookings?role=WORKER');
        const bookings = bookingsRes.data.data?.bookings || [];
        
        // Fetch reviews using the worker's userId
        let reviews = [];
        if (workerId) {
          const reviewsRes = await api.get(`/reviews/worker/${workerId}`);
          reviews = reviewsRes.data.data?.reviews || [];
        }
        
        // Calculate stats
        const completedJobs = bookings.filter(b => b.status === 'COMPLETED').length;
        const totalEarnings = bookings
          .filter(b => b.status === 'COMPLETED')
          .reduce((sum, b) => sum + (b.budget || 0), 0);
        
        setStats({
          totalBookings: bookings.length,
          completedJobs,
          totalEarnings,
          rating: profile.rating?.average || 0,
          reviewCount: profile.rating?.count || 0,
        });
        
        setRecentBookings(bookings.slice(0, 5));
        setRecentReviews(reviews.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Worker Dashboard</h1>
      
      {/* Profile Section */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <Link to="/worker/profile" className="text-primary-600 hover:text-primary-700 font-semibold">
            Edit Profile →
          </Link>
        </div>
        
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          {workerProfile?.profilePicture ? (
            <img
              src={workerProfile.profilePicture}
              alt={user?.firstName}
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-3xl">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {user?.role}
              </span>
              {workerProfile?.isVerified && (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
            <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
            <p className="text-gray-900">{workerProfile?.location || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
            <p className="text-gray-900">{workerProfile?.category?.name || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
            <p className="text-gray-900">{workerProfile?.experience ? `${workerProfile.experience} years` : 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Hourly Rate</h4>
            <p className="text-gray-900">{workerProfile?.hourlyRate ? `₹${workerProfile.hourlyRate}/hr` : 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Skills</h4>
            <p className="text-gray-900">{workerProfile?.skills?.join(', ') || 'Not provided'}</p>
          </div>
          {workerProfile?.bio && (
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
              <p className="text-gray-900">{workerProfile.bio}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Total Bookings</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{stats?.totalBookings || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Completed Jobs</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{stats?.completedJobs || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Total Earnings</h3>
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{formatCurrency(stats?.totalEarnings || 0)}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Rating</h3>
            <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{stats?.rating?.toFixed(1) || '0.0'}</p>
          <p className="text-sm opacity-90 mt-1">{stats?.reviewCount || 0} reviews</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Link to="/worker/bookings" className="text-primary-600 hover:text-primary-700 font-semibold">
            View All →
          </Link>
        </div>
        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{booking.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(booking.scheduledDate)} • {booking.customerId?.firstName} {booking.customerId?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'ACCEPTED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-lg font-bold text-primary-600 mt-2">{formatCurrency(booking.budget)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No bookings yet</p>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
        {recentReviews.length > 0 ? (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review._id} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {review.customerId?.firstName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.customerId?.firstName} {review.customerId?.lastName}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
