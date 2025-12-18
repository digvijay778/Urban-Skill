import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers } from '@features/worker/workerSlice';
import WorkerCard from '@components/cards/WorkerCard';
import Loader from '@components/common/Loader';
import { useDebounce } from '@/hooks/useDebounce';

const Workers = () => {
  const dispatch = useDispatch();
  const { workers, loading, error } = useSelector((state) => state.worker);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const skills = ['all', 'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'gardening'];

  // Ensure workers is always an array
  const workersList = Array.isArray(workers) ? workers : [];

  // Filter and sort workers
  const filteredWorkers = workersList
    .filter(worker => {
      const matchesSearch = !debouncedSearch || 
        worker.userId?.firstName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        worker.userId?.lastName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        worker.skills?.some(skill => skill.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesSkill = selectedSkill === 'all' || 
        worker.skills?.some(skill => skill.toLowerCase() === selectedSkill);
      
      return matchesSearch && matchesSkill;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
      if (sortBy === 'price-low') return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      if (sortBy === 'price-high') return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      return 0;
    });

  if (loading) {
    return <Loader fullScreen text="Loading workers..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Skilled Workers</h1>
          <p className="text-xl text-primary-100">
            Browse verified professionals for your home services
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white shadow-sm sticky top-16 z-30">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search workers by name or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Skill Filter */}
            <div className="lg:w-64">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {skills.map(skill => (
                  <option key={skill} value={skill}>
                    {skill === 'all' ? 'All Skills' : skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredWorkers.length} {filteredWorkers.length === 1 ? 'worker' : 'workers'} found
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {filteredWorkers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('all');
                }}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {filteredWorkers.length > 0 && (
        <section className="py-12 bg-primary-50">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-6">
              Post your requirement and let workers reach out to you
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Post a Requirement
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Workers;
