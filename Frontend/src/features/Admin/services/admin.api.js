import api from '../../auth/services/auth.api';

/**
 * Fetch overall hospital metrics and statistics for the admin dashboard
 */
export async function getAdminDashboardStats() {
  const response = await api.get('/admin/dashboard');
  return response.data;
}

/**
 * Fetch all registered users with optional role filtering
 * @param {string} [role] - 'patient' | 'doctor' | 'staff'
 */
export async function getAllHospitalUsers(role) {
  const params = {};
  if (role && role !== 'all') {
    params.role = role;
  }
  const response = await api.get('/admin/users', { params });
  return response.data;
}

/**
 * Toggle user active/inactive status
 * @param {number|string} id - user ID
 * @param {boolean} isActive - new status
 */
export async function updateUserActiveStatus(id, isActive) {
  const response = await api.patch(`/admin/users/${id}/status`, {
    is_active: Boolean(isActive),
  });
  return response.data;
}
