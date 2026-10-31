import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminDashboardStats,
  getAllHospitalUsers,
  updateUserActiveStatus,
} from '../services/admin.api';
import {
  setStats,
  setUsers,
  updateUserInList,
  setRoleFilter,
  setStatusFilter,
  setSearchQuery,
  setLoading,
  setStatsLoading,
  setActionLoadingId,
  setError,
  setSuccessMessage,
  clearAdminMessages,
} from '../admin.slice';

export function useAdmin() {
  const dispatch = useDispatch();
  const {
    stats,
    users,
    roleFilter,
    statusFilter,
    searchQuery,
    loading,
    statsLoading,
    actionLoadingId,
    error,
    successMessage,
  } = useSelector((state) => state.admin);

  const fetchStats = useCallback(async () => {
    try {
      dispatch(setStatsLoading(true));
      const res = await getAdminDashboardStats();
      if (res.success && res.dashboard) {
        dispatch(setStats(res.dashboard));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load dashboard statistics';
      dispatch(setError(msg));
    }
  }, [dispatch]);

  const fetchUsers = useCallback(
    async (roleOverride) => {
      try {
        dispatch(setLoading(true));
        const activeRole = roleOverride !== undefined ? roleOverride : roleFilter;
        const res = await getAllHospitalUsers(activeRole);
        if (res.success && res.users) {
          dispatch(setUsers(res.users));
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load users';
        dispatch(setError(msg));
      }
    },
    [dispatch, roleFilter]
  );

  const toggleStatus = useCallback(
    async (id, currentStatus) => {
      try {
        dispatch(clearAdminMessages());
        dispatch(setActionLoadingId(id));
        const newStatus = !currentStatus;
        const res = await updateUserActiveStatus(id, newStatus);
        if (res.success && res.user) {
          dispatch(updateUserInList(res.user));
          dispatch(setSuccessMessage(res.message || 'User status updated successfully.'));
          return { success: true, user: res.user };
        }
        return { success: false };
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to update user status';
        dispatch(setError(msg));
        return { success: false, error: msg };
      } finally {
        dispatch(setActionLoadingId(null));
      }
    },
    [dispatch]
  );

  const handleRoleChange = useCallback(
    (newRole) => {
      dispatch(setRoleFilter(newRole));
      fetchUsers(newRole);
    },
    [dispatch, fetchUsers]
  );

  const handleStatusChange = useCallback(
    (newStatus) => {
      dispatch(setStatusFilter(newStatus));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (query) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    dispatch(clearAdminMessages());
  }, [dispatch]);

  // Derived filtered users list for instant, responsive search and status filter
  const filteredUsers = users.filter((u) => {
    // Role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    // Status filter
    const isActive = u.is_active !== false; // defaults to true
    if (statusFilter === 'active' && !isActive) return false;
    if (statusFilter === 'inactive' && isActive) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchRole = u.role?.toLowerCase().includes(q);
      const matchId = String(u.id).includes(q);
      return matchName || matchEmail || matchRole || matchId;
    }
    return true;
  });

  return {
    stats,
    users,
    filteredUsers,
    roleFilter,
    statusFilter,
    searchQuery,
    loading,
    statsLoading,
    actionLoadingId,
    error,
    successMessage,
    fetchStats,
    fetchUsers,
    toggleStatus,
    handleRoleChange,
    handleStatusChange,
    handleSearchChange,
    handleClear,
  };
}
