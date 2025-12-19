import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Loader from '@components/common/Loader';
import { updateUser } from '@/features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    experience: '',
    hourlyRate: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    category: '',
  });

  const [files, setFiles] = useState({
    profilePicture: null,
    aadharCard: null,
    idProof: null,
  });

  const [previews, setPreviews] = useState({
    profilePicture: null,
    aadharCard: null,
    idProof: null,
  });

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/workers/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/workers/profile');
      const profileData = response.data.data;
      
      setProfile(profileData);
      setFormData({
        bio: profileData.bio || '',
        skills: profileData.skills?.join(', ') || '',
        experience: profileData.experience || '',
        hourlyRate: profileData.hourlyRate || '',
        street: profileData.location?.street || '',
        city: profileData.location?.city || '',
        state: profileData.location?.state || '',
        zipCode: profileData.location?.zipCode || '',
        country: profileData.location?.country || 'India',
        category: profileData.category?._id || '',
      });

      setPreviews({
        profilePicture: profileData.profilePicture || null,
        aadharCard: profileData.documents?.aadharCard || null,
        idProof: profileData.documents?.idProof || null,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(selectedFiles[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();
      data.append('bio', formData.bio);
      data.append('skills', formData.skills);
      data.append('experience', formData.experience);
      data.append('hourlyRate', formData.hourlyRate);
      data.append('location', JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }));
      data.append('category', formData.category);

      if (files.profilePicture) data.append('profilePicture', files.profilePicture);
      if (files.aadharCard) data.append('aadharCard', files.aadharCard);
      if (files.idProof) data.append('idProof', files.idProof);

      const response = await api.patch('/workers/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user profile image in Redux if it was changed
      if (response.data.data.profilePicture) {
        dispatch(updateUser({ profileImage: response.data.data.profilePicture }));
      }

      toast.success('Profile updated successfully!');
      
      // Clear file inputs
      setFiles({
        profilePicture: null,
        aadharCard: null,
        idProof: null,
      });
      
      // Refetch profile to get updated data
      await fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading profile..." />;
  }

  const verificationStatus = profile?.verificationStatus || 'PENDING';
  const isVerified = profile?.isVerified || false;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Worker Profile</h1>
        
        {/* Verification Status Badge */}
        <div className={`px-4 py-2 rounded-full font-semibold ${
          isVerified ? 'bg-green-100 text-green-800' :
          verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {isVerified ? '✓ Verified' :
           verificationStatus === 'REJECTED' ? '✗ Rejected' :
           '⏳ Pending Verification'}
        </div>
      </div>

      {!isVerified && (
        <div className={`mb-6 p-4 rounded-lg border-2 ${
          verificationStatus === 'REJECTED' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start">
            <svg className={`w-6 h-6 mr-3 ${
              verificationStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className={`font-semibold ${
                verificationStatus === 'REJECTED' ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {verificationStatus === 'REJECTED' ? 'Verification Rejected' : 'Verification Pending'}
              </h3>
              <p className={`text-sm mt-1 ${
                verificationStatus === 'REJECTED' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {verificationStatus === 'REJECTED' 
                  ? 'Your profile verification was rejected. Please update your documents and resubmit.'
                  : 'Your profile is under review. Once verified by admin, you will appear in the workers list.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {previews.profilePicture ? (
                <img src={previews.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <div className="btn-primary px-6 py-3">
                Change Photo
              </div>
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Professional Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Rate (₹) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

          </div>

          {/* Address Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  placeholder="House No, Street Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="India"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills * (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="e.g., Plumbing, Pipe Fitting, Repair"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio / About Yourself
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers about your experience and expertise..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Verification Documents */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Verification Documents</h2>
          
          {/* Aadhar Card */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aadhar Card {!profile?.documents?.aadharCard && '*'}
            </label>
            {previews.aadharCard ? (
              <div className="flex items-center space-x-4">
                <img src={previews.aadharCard} alt="Aadhar" className="h-24 rounded border" />
                <label className="cursor-pointer">
                  <div className="text-primary-600 hover:text-primary-700 font-semibold">
                    Change Document
                  </div>
                  <input
                    type="file"
                    name="aadharCard"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload Aadhar card</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  name="aadharCard"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* ID Proof */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Government ID Proof {!profile?.documents?.idProof && '*'}
            </label>
            {previews.idProof ? (
              <div className="flex items-center space-x-4">
                <img src={previews.idProof} alt="ID Proof" className="h-24 rounded border" />
                <label className="cursor-pointer">
                  <div className="text-primary-600 hover:text-primary-700 font-semibold">
                    Change Document
                  </div>
                  <input
                    type="file"
                    name="idProof"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload ID proof</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  name="idProof"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
