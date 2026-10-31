import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStaffAppointments,
  updateStaffAppointmentStatus,
} from '../services/staff.api';
import {
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
} from '../staff.slice';

export function useStaff() {
  const dispatch = useDispatch();
  const {
    appointments,
    statusFilter,
    dateFilter,
    searchQuery,
    loading,
    actionLoadingId,
    error,
    successMessage,
  } = useSelector((state) => state.staff);

  const fetchAppointments = useCallback(
    async (overrideFilters = {}) => {
      try {
        dispatch(setLoading(true));
        const status =
          overrideFilters.status !== undefined
            ? overrideFilters.status
            : statusFilter;
        const date =
          overrideFilters.date !== undefined
            ? overrideFilters.date
            : dateFilter;

        const res = await getStaffAppointments({ date, status });
        if (res.success && res.appointments) {
          dispatch(setAppointments(res.appointments));
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to load appointments';
        dispatch(setError(msg));
      }
    },
    [dispatch, statusFilter, dateFilter]
  );

  const updateStatus = useCallback(
    async (id, newStatus) => {
      try {
        dispatch(clearStaffMessages());
        dispatch(setActionLoadingId(id));
        const res = await updateStaffAppointmentStatus(id, newStatus);
        if (res.success && res.appointment) {
          dispatch(updateAppointmentInList(res.appointment));
          dispatch(
            setSuccessMessage(
              res.message || `Appointment ${newStatus} successfully.`
            )
          );
          return { success: true, appointment: res.appointment };
        }
        return { success: false };
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to update appointment status';
        dispatch(setError(msg));
        return { success: false, error: msg };
      } finally {
        dispatch(setActionLoadingId(null));
      }
    },
    [dispatch]
  );

  const handleStatusChange = useCallback(
    (newStatus) => {
      dispatch(setStatusFilter(newStatus));
      fetchAppointments({ status: newStatus });
    },
    [dispatch, fetchAppointments]
  );

  const handleDateChange = useCallback(
    (newDate) => {
      dispatch(setDateFilter(newDate));
      fetchAppointments({ date: newDate });
    },
    [dispatch, fetchAppointments]
  );

  const handleSearchChange = useCallback(
    (query) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetStaffFilters());
    fetchAppointments({ status: 'all', date: '' });
  }, [dispatch, fetchAppointments]);

  const handleClear = useCallback(() => {
    dispatch(clearStaffMessages());
  }, [dispatch]);

  // Client-side quick search filter on current loaded list
  const filteredAppointments = appointments.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchPatient = item.patient_name?.toLowerCase().includes(q);
    const matchEmail = item.patient_email?.toLowerCase().includes(q);
    const matchDoctor = item.doctor_name?.toLowerCase().includes(q);
    const matchSpecialization = item.specialization?.toLowerCase().includes(q);
    const matchReason = item.reason?.toLowerCase().includes(q);
    const matchId = String(item.appointment_id || item.id).includes(q);
    return (
      matchPatient ||
      matchEmail ||
      matchDoctor ||
      matchSpecialization ||
      matchReason ||
      matchId
    );
  });

  return {
    appointments,
    filteredAppointments,
    statusFilter,
    dateFilter,
    searchQuery,
    loading,
    actionLoadingId,
    error,
    successMessage,
    fetchAppointments,
    updateStatus,
    handleStatusChange,
    handleDateChange,
    handleSearchChange,
    handleResetFilters,
    handleClear,
  };
}
