import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  appointments: [],
  selectedPatient: null, // { patient, appointments }
  activeFilter: 'all', // 'all' | 'today' | 'confirmed' | 'completed'
  searchQuery: '',
  loading: false,
  patientLoading: false,
  actionLoadingId: null,
  error: null,
  successMessage: null,
};

export const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setDoctorProfile: (state, action) => {
      state.profile = action.payload;
    },
    setDoctorAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status } = action.payload;
      state.appointments = state.appointments.map((appt) =>
        appt.appointment_id === appointmentId ? { ...appt, status } : appt
      );
      if (state.selectedPatient?.appointments) {
        state.selectedPatient.appointments = state.selectedPatient.appointments.map((a) =>
          a.appointment_id === appointmentId ? { ...a, status } : a
        );
      }
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
      state.patientLoading = false;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPatientLoading: (state, action) => {
      state.patientLoading = action.payload;
    },
    setActionLoadingId: (state, action) => {
      state.actionLoadingId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.patientLoading = false;
      state.actionLoadingId = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearDoctorMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetDoctorState: () => initialState,
  },
});

export const {
  setDoctorProfile,
  setDoctorAppointments,
  updateAppointmentStatus,
  setSelectedPatient,
  clearSelectedPatient,
  setActiveFilter,
  setSearchQuery,
  setLoading,
  setPatientLoading,
  setActionLoadingId,
  setError,
  setSuccessMessage,
  clearDoctorMessages,
  resetDoctorState,
} = doctorSlice.actions;

export default doctorSlice.reducer;
