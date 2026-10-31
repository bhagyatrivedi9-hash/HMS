import api from '../../auth/services/auth.api';

// Get all departments
export async function getAllDepartments() {
  const response = await api.get('/departments');
  return response.data;
}

// Get doctor by doctor ID
export async function getDoctorById(doctorId) {
  const response = await api.get(`/departments/doctor/${doctorId}`);
  return response.data;
}

// Get doctors by department ID
export async function getDoctorsByDepartment(departmentId) {
  const response = await api.get(`/departments/doctors/${departmentId}`);
  return response.data;
}

// Get available slots for a doctor on a date
export async function getAvailableSlots(doctorId, date) {
  const response = await api.get(`/departments/doctors/${doctorId}/slots`, {
    params: { date },
  });
  return response.data;
}

// Book an appointment
export async function bookAppointment({ doctor_id, appointment_date, appointment_time, reason }) {
  const response = await api.post('/appointments/book', {
    doctor_id,
    appointment_date,
    appointment_time,
    reason,
  });
  return response.data;
}

// Get appointments for current logged-in user
export async function getMyAppointments() {
  const response = await api.get('/appointments/my');
  return response.data;
}

// Cancel an appointment
export async function cancelAppointment(appointmentId) {
  const response = await api.patch(`/appointments/${appointmentId}/cancel`);
  return response.data;
}
