import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import appointmentReducer from '../features/Appointments/appointment.slice';
import doctorReducer from '../features/Doctor/doctor.slice';
import adminReducer from '../features/Admin/admin.slice';
import staffReducer from '../features/staff/staff.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
    doctor: doctorReducer,
    admin: adminReducer,
    staff: staffReducer,
  },
});

export default store;
