import api from '../../auth/services/auth.api';

/**
 * Fetch profile information of the logged-in doctor
 */
export async function getDoctorProfile() {
  const response = await api.get('/doctor/profile');
  return response.data;
}

/**
 * Fetch all appointments scheduled with the logged-in doctor
 */
export async function getDoctorAppointments() {
  const response = await api.get('/doctor/appointments');
  return response.data;
}

/**
 * Fetch details & appointment history for a specific patient of this doctor
 * @param {number|string} patientId
 */
export async function getPatientDetails(patientId) {
  const response = await api.get(`/doctor/patients/${patientId}`);
  return response.data;
}

/**
 * Mark a confirmed appointment as completed
 * @param {number|string} appointmentId
 */
export async function completeAppointment(appointmentId) {
  const response = await api.post(`/doctor/appointments/${appointmentId}/complete`);
  return response.data;
}
