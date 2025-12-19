import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerById } from '../features/worker/workerSlice';
import BookingModal from '../components/common/BookingModal';
import ReviewSection from '../components/common/ReviewSection';
import toast from 'react-hot-toast';

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedWorker, loading } = useSelector((state) => state.worker);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('about');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkerById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!selectedWorker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Worker Not Found</h2>
          <button
            onClick={() => navigate('/workers')}
            className="btn-primary"
          >
            Back to Workers
          </button>
        </div>
      </div>
    );
  }

  const worker = selectedWorker;
  const userName = worker.userId?.firstName 
    ? `${worker.userId.firstName} ${worker.userId.lastName}`
    : 'Worker';

  const getProfileImage = () => {
    if (worker.profilePicture) return worker.profilePicture;
    if (worker.userId?.profileImage) return worker.userId.profileImage;
    const avatarId = worker._id ? parseInt(worker._id.slice(-2), 16) % 70 : 1;
    return `https://i.pravatar.cc/400?img=${avatarId}`;
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleContactWorker = () => {
    if (!user) {
      toast.error('Please login to contact this worker');
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container">
          <button
            onClick={() => navigate('/workers')}
            className="flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Workers
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={getProfileImage()}
                alt={userName}
                className="w-48 h-48 rounded-2xl object-cover shadow-2xl ring-4 ring-white/30"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=400&background=9333ea&color=fff&bold=true`;
                }}
              />
              {worker.isVerified && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{userName}</h1>
              
              {(worker.location?.city || worker.locationText) && (
                <div className="flex items-center text-white/90 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {worker.location?.city && worker.location?.state
                    ? `${worker.location.city}, ${worker.location.state}`
                    : worker.locationText || worker.location?.city || worker.location?.state || 'Location not specified'
                  }
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                {/* Rating */}
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{worker.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="ml-1 text-sm">({worker.totalReviews || 0} reviews)</span>
                </div>

                {/* Experience */}
                {worker.experience > 0 && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">{worker.experience}+ years</span>
                  </div>
                )}

                {/* Completed Jobs */}
                {worker.totalCompletedJobs > 0 && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">{worker.totalCompletedJobs} jobs completed</span>
                  </div>
                )}
              </div>

              {/* Hourly Rate */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
                <div className="text-sm text-white/80">Hourly Rate</div>
                <div className="text-3xl font-bold">₹{worker.hourlyRate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'about'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'skills'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'availability'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Availability
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'about' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About {userName}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {worker.bio || 'No bio available.'}
                    </p>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                    {worker.skills && worker.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {worker.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full font-semibold text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills listed.</p>
                    )}
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Availability</h3>
                    {worker.availability && typeof worker.availability === 'object' ? (
                      <div className="space-y-3">
                        {Object.entries(worker.availability).map(([day, schedule]) => (
                          <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-900 capitalize">{day}</span>
                            {schedule.available ? (
                              <span className="text-green-600 font-medium">
                                {schedule.slots || 'Available'}
                              </span>
                            ) : (
                              <span className="text-red-600 font-medium">Not Available</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Availability information not provided.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ReviewSection workerId={worker.userId?._id || worker.userId} />
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book This Professional</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="text-2xl font-bold text-primary-600">₹{worker.hourlyRate}</span>
                </div>
                
                <div className="flex items-center py-3 border-b">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Response time: Within 1 hour</span>
                </div>

                {worker.isVerified && (
                  <div className="flex items-center py-3 border-b">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600 font-semibold">Verified Professional</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleBookNow}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Book Now
                </button>
                
                <button
                  onClick={handleContactWorker}
                  className="w-full border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Contact Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        worker={worker}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Contact {userName}</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Email */}
              {worker.userId?.email && (
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a href={`mailto:${worker.userId.email}`} className="text-primary-600 font-semibold hover:underline">
                      {worker.userId.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {worker.userId?.phone && (
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <a href={`tel:${worker.userId.phone}`} className="text-primary-600 font-semibold hover:underline">
                      {worker.userId.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              {(worker.location?.city || worker.locationText) && (
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Service Location</p>
                    {worker.location?.street && (
                      <p className="text-gray-900">{worker.location.street}</p>
                    )}
                    <p className="text-gray-900 font-semibold">
                      {worker.location?.city && worker.location?.state
                        ? `${worker.location.city}, ${worker.location.state} ${worker.location.zipCode || ''}`
                        : worker.locationText || 'Location details not available'
                      }
                    </p>
                    {worker.location?.country && (
                      <p className="text-sm text-gray-600">{worker.location.country}</p>
                    )}
                  </div>
                </div>
              )}

              {!worker.userId?.email && !worker.userId?.phone && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">Contact information not available</p>
                  <p className="text-sm text-gray-500 mt-2">Please use the booking system to connect</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full mt-6 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        worker={worker}
      />
    </div>
  );
};

export default WorkerDetails;
