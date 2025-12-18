import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Service Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
        {service.icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{service.icon}</span>
          </div>
        )}
      </div>

      {/* Service Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {service.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-1 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>
              {service.workerCount || 0} Workers
            </span>
          </div>
          {service.averageRating > 0 && (
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-1 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{service.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <Link
          to={`/services/${service._id}`}
          className="block w-full bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Find Workers
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
