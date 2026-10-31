import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    departments: [],
    selectedDepartment: null,
    doctors: [],
    selectedDoctor: null,
    availableSlots: [],
    selectedDate: '',
    selectedSlot: '',
    lastBooking: null,
    myAppointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDepartments(state, action) {
      state.departments = action.payload;
    },
    setSelectedDepartment(state, action) {
      state.selectedDepartment = action.payload;
      state.doctors = [];
      state.selectedDoctor = null;
      state.availableSlots = [];
      state.selectedDate = '';
      state.selectedSlot = '';
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setSelectedDoctor(state, action) {
      state.selectedDoctor = action.payload;
      state.availableSlots = [];
      state.selectedDate = '';
      state.selectedSlot = '';
    },
    setAvailableSlots(state, action) {
      state.availableSlots = action.payload;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
      state.selectedSlot = '';
    },
    setSelectedSlot(state, action) {
      state.selectedSlot = action.payload;
    },
    setLastBooking(state, action) {
      state.lastBooking = action.payload;
    },
    setMyAppointments(state, action) {
      state.myAppointments = action.payload;
    },
    updateAppointmentStatus(state, action) {
      const { id, status } = action.payload;
      const index = state.myAppointments.findIndex((a) => a.id === id);
      if (index !== -1) {
        state.myAppointments[index].status = status;
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
    resetBooking(state) {
      state.selectedDepartment = null;
      state.doctors = [];
      state.selectedDoctor = null;
      state.availableSlots = [];
      state.selectedDate = '';
      state.selectedSlot = '';
    },
  },
});

export const {
  setDepartments,
  setSelectedDepartment,
  setDoctors,
  setSelectedDoctor,
  setAvailableSlots,
  setSelectedDate,
  setSelectedSlot,
  setLastBooking,
  setMyAppointments,
  updateAppointmentStatus,
  setLoading,
  setError,
  clearError,
  resetBooking,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
