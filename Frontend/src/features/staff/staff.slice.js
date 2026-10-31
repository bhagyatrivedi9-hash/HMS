import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  statusFilter: 'all', // 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  dateFilter: '', // 'YYYY-MM-DD' or ''
  searchQuery: '',
  loading: false,
  actionLoadingId: null,
  error: null,
  successMessage: null,
};

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      state.loading = false;
    },
    updateAppointmentInList: (state, action) => {
      const updated = action.payload;
      state.appointments = state.appointments.map((a) =>
        a.appointment_id === updated.id || a.id === updated.id
          ? { ...a, status: updated.status }
          : a
      );
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setActionLoadingId: (state, action) => {
      state.actionLoadingId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.actionLoadingId = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearStaffMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetStaffFilters: (state) => {
      state.statusFilter = 'all';
      state.dateFilter = '';
      state.searchQuery = '';
    },
    resetStaffState: () => initialState,
  },
});

export const {
  setAppointments,
  updateAppointmentInList,
  setStatusFilter,
  setDateFilter,
  setSearchQuery,
  setLoading,
  setActionLoadingId,
  setError,
  setSuccessMessage,
  clearStaffMessages,
  resetStaffFilters,
  resetStaffState,
} = staffSlice.actions;

export default staffSlice.reducer;
