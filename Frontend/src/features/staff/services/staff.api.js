import api from '../../auth/services/auth.api';

/**
 * Fetch all appointments with optional filters for date and status
 * @param {Object} [params]
 * @param {string} [params.date] - 'YYYY-MM-DD'
 * @param {string} [params.status] - 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
 */
export async function getStaffAppointments(params = {}) {
  const queryParams = {};
  if (params.date) queryParams.date = params.date;
  if (params.status && params.status !== 'all') queryParams.status = params.status;

  const response = await api.get('/staff/appointments', {
    params: queryParams,
  });
  return response.data;
}

/**
 * Update appointment status (only 'confirmed' or 'cancelled' allowed by controller)
 * @param {number|string} id - Appointment ID
 * @param {'confirmed'|'cancelled'} status
 */
export async function updateStaffAppointmentStatus(id, status) {
  const response = await api.patch(`/staff/appointments/${id}/status`, {
    status,
  });
  return response.data;
}
