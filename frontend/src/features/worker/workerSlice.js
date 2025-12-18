import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchWorkers = createAsyncThunk(
  'worker/fetchWorkers',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/workers?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workers');
    }
  }
);

export const fetchWorkerById = createAsyncThunk(
  'worker/fetchWorkerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/workers/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch worker');
    }
  }
);

const initialState = {
  workers: [],
  currentWorker: null,
  selectedWorker: null,
  pagination: null,
  loading: false,
  error: null,
};

const workerSlice = createSlice({
  name: 'worker',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object response formats
        if (Array.isArray(action.payload)) {
          state.workers = action.payload;
        } else if (action.payload?.workers) {
          state.workers = action.payload.workers;
          state.pagination = action.payload.pagination;
        } else {
          state.workers = [];
        }
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorker = action.payload;
        state.selectedWorker = action.payload;
      })
      .addCase(fetchWorkerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = workerSlice.actions;
export default workerSlice.reducer;
