import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';

const WorkerCard = ({ worker }) => {
  // Extract user data - handle both populated and non-populated userId
  const userName = worker.userId?.firstName 
    ? `${worker.userId.firstName} ${worker.userId.lastName}`
    : worker.name || 'Worker';
  
  // Generate consistent profile picture using worker ID or name
  const getProfileImage = () => {
    if (worker.profilePicture) return worker.profilePicture;
    if (worker.userId?.profileImage) return worker.userId.profileImage;
    // Use pravatar with consistent ID based on worker ID
    const avatarId = worker._id ? parseInt(worker._id.slice(-2), 16) % 70 : Math.floor(Math.random() * 70);
    return `https://i.pravatar.cc/400?img=${avatarId}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Profile Image */}
      <div className="relative h-56 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        <img
          src={getProfileImage()}
          alt={userName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=400&background=3b82f6&color=fff&bold=true`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Verified Badge */}
        {worker.isVerified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-lg">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </div>
        )}

        {/* Experience Badge */}
        {worker.experience && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            {worker.experience}+ years exp
          </div>
        )}
      </div>

      {/* Worker Info */}
      <div className="p-5">
        {/* Name and Location */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {userName}
          </h3>
          {(worker.location?.city || worker.locationText) && (
            <div className="flex items-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {worker.location?.city && worker.location?.state
                ? `${worker.location.city}, ${worker.location.state}`
                : worker.locationText || worker.location?.city || worker.location?.state || 'Location not specified'
              }
            </div>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          {worker.averageRating > 0 ? (
            <div className="flex items-center">
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-gray-900">{worker.averageRating.toFixed(1)}</span>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({worker.totalReviews || 0} reviews)
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">New on platform</span>
          )}
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {worker.skills?.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold border border-primary-200"
              >
                {skill}
              </span>
            ))}
            {worker.skills?.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                +{worker.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {worker.bio}
          </p>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(worker.hourlyRate)}
              </span>
              <span className="text-gray-500 text-sm ml-1">/hr</span>
            </div>
            {worker.completedJobs > 0 && (
              <span className="text-xs text-gray-500">
                {worker.completedJobs} jobs completed
              </span>
            )}
          </div>

          {/* View Profile Button */}
          <Link
            to={`/workers/${worker._id}`}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
