import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Loader from '@components/common/Loader';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await api.get('/workers/profile');
      const profile = response.data.data;
      
      // Initialize availability from profile or default
      const initialAvailability = {};
      DAYS_OF_WEEK.forEach((day) => {
        initialAvailability[day] = profile.availability?.[day] || {
          available: false,
          startTime: '09:00',
          endTime: '17:00',
        };
      });
      setAvailability(initialAvailability);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      toast.error('Failed to load availability');
      // Initialize with defaults
      const defaultAvailability = {};
      DAYS_OF_WEEK.forEach((day) => {
        defaultAvailability[day] = {
          available: false,
          startTime: '09:00',
          endTime: '17:00',
        };
      });
      setAvailability(defaultAvailability);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (day) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        available: !availability[day].available,
      },
    });
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('Saving availability:', availability);
      const response = await api.patch('/workers/profile', { availability });
      console.log('Save response:', response.data);
      toast.success('Availability updated successfully!');
      await fetchAvailability(); // Refresh to show saved data
    } catch (error) {
      console.error('Failed to save availability:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleSetAllDays = () => {
    const firstAvailable = Object.values(availability).find(day => day.available);
    if (!firstAvailable) {
      toast.error('Please set at least one day first');
      return;
    }

    const newAvailability = {};
    DAYS_OF_WEEK.forEach((day) => {
      newAvailability[day] = {
        available: true,
        startTime: firstAvailable.startTime,
        endTime: firstAvailable.endTime,
      };
    });
    setAvailability(newAvailability);
    toast.success('Applied to all days');
  };

  if (loading) {
    return <Loader text="Loading availability..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Availability</h1>
        <button
          onClick={handleSetAllDays}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Apply to All Days
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600 mb-6">
          Set your working hours for each day of the week. Customers can book you during these times.
        </p>

        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              {/* Day Checkbox */}
              <div className="flex items-center min-w-[140px]">
                <input
                  type="checkbox"
                  id={day}
                  checked={availability[day]?.available || false}
                  onChange={() => handleToggleDay(day)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor={day}
                  className="ml-3 font-semibold text-gray-900 cursor-pointer"
                >
                  {day}
                </label>
              </div>

              {/* Time Inputs */}
              {availability[day]?.available ? (
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">From:</label>
                    <input
                      type="time"
                      value={availability[day]?.startTime || '09:00'}
                      onChange={(e) =>
                        handleTimeChange(day, 'startTime', e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <span className="text-gray-400">—</span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">To:</label>
                    <input
                      type="time"
                      value={availability[day]?.endTime || '17:00'}
                      onChange={(e) =>
                        handleTimeChange(day, 'endTime', e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 italic">Not available</span>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Availability;
