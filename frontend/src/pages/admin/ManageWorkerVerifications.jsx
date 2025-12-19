import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Loader from '@components/common/Loader';

const ManageWorkerVerifications = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, VERIFIED, REJECTED, ALL
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, [filter]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/workers/pending');
      let workersData = response.data.data || [];
      
      // Filter based on selected status
      if (filter !== 'ALL') {
        workersData = workersData.filter(w => w.verificationStatus === filter);
      }
      
      setWorkers(workersData);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (workerId, status) => {
    try {
      await api.patch(`/admin/workers/${workerId}/verify`, {
        isVerified: status === 'VERIFIED',
        verificationStatus: status,
      });
      
      toast.success(`Worker ${status === 'VERIFIED' ? 'verified' : 'rejected'} successfully`);
      fetchWorkers();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update verification:', error);
      toast.error('Failed to update verification status');
    }
  };

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setShowModal(true);
  };

  if (loading) {
    return <Loader fullScreen text="Loading workers..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Worker Verifications</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Workers List */}
      {workers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No workers found in {filter} status</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {workers.map((worker) => (
            <div key={worker._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Profile Picture */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {worker.profilePicture ? (
                      <img src={worker.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Worker Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {worker.userId?.firstName} {worker.userId?.lastName}
                    </h3>
                    <p className="text-gray-600 mt-1">{worker.userId?.email}</p>
                    <p className="text-gray-600">{worker.userId?.phone}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
                        {worker.category?.name}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {worker.experience} yrs exp
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        ₹{worker.hourlyRate}/hr
                      </span>
                    </div>

                    {worker.skills && worker.skills.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">Skills: {worker.skills.join(', ')}</span>
                      </div>
                    )}

                    {(worker.location?.city || worker.locationText) && (
                      <p className="text-sm text-gray-600 mt-2">
                        📍 {worker.location?.city && worker.location?.state
                          ? `${worker.location.city}, ${worker.location.state}`
                          : worker.locationText || worker.location?.city || worker.location?.state || 'Location not specified'
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="ml-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    worker.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                    worker.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {worker.verificationStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => openModal(worker)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  View Details
                </button>
                
                {worker.verificationStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleVerify(worker._id, 'VERIFIED')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerify(worker._id, 'REJECTED')}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      Reject
                    </button>
                  </>
                )}

                {worker.verificationStatus === 'REJECTED' && (
                  <button
                    onClick={() => handleVerify(worker._id, 'VERIFIED')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Approve
                  </button>
                )}

                {worker.verificationStatus === 'VERIFIED' && (
                  <button
                    onClick={() => handleVerify(worker._id, 'REJECTED')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedWorker && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Worker Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Picture */}
              <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200">
                  {selectedWorker.profilePicture ? (
                    <img src={selectedWorker.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {selectedWorker.bio && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{selectedWorker.bio}</p>
                </div>
              )}

              {/* Experience Details */}
              {selectedWorker.experienceDetails && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Experience Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedWorker.experienceDetails.previousCompany && (
                      <p><span className="font-semibold">Previous Company:</span> {selectedWorker.experienceDetails.previousCompany}</p>
                    )}
                    {selectedWorker.experienceDetails.previousRole && (
                      <p><span className="font-semibold">Previous Role:</span> {selectedWorker.experienceDetails.previousRole}</p>
                    )}
                    {selectedWorker.experienceDetails.yearsOfExperience && (
                      <p><span className="font-semibold">Years of Experience:</span> {selectedWorker.experienceDetails.yearsOfExperience}</p>
                    )}
                    {selectedWorker.experienceDetails.certifications && selectedWorker.experienceDetails.certifications.length > 0 && (
                      <p><span className="font-semibold">Certifications:</span> {selectedWorker.experienceDetails.certifications.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Verification Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedWorker.documents?.aadharCard && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Aadhar Card</p>
                      <img src={selectedWorker.documents.aadharCard} alt="Aadhar" className="w-full rounded border" />
                    </div>
                  )}
                  {selectedWorker.documents?.idProof && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">ID Proof</p>
                      <img src={selectedWorker.documents.idProof} alt="ID Proof" className="w-full rounded border" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedWorker.verificationStatus === 'PENDING' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleVerify(selectedWorker._id, 'VERIFIED')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Verify Worker
                  </button>
                  <button
                    onClick={() => handleVerify(selectedWorker._id, 'REJECTED')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWorkerVerifications;
