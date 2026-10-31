import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDoctorProfile,
  getDoctorAppointments,
  getPatientDetails,
  completeAppointment,
} from '../services/doctor.api';
import {
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
} from '../doctor.slice';

export function useDoctor() {
  const dispatch = useDispatch();
  const doctorState = useSelector((state) => state.doctor);

  const fetchProfile = useCallback(async () => {
    try {
      dispatch(clearDoctorMessages());
      const data = await getDoctorProfile();
      if (data.success && data.doctor) {
        dispatch(setDoctorProfile(data.doctor));
        return { success: true, doctor: data.doctor };
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch doctor profile';
      dispatch(setError(msg));
      return { success: false, error: msg };
    }
  }, [dispatch]);

  const fetchAppointments = useCallback(async () => {
    try {
      dispatch(clearDoctorMessages());
      dispatch(setLoading(true));
      const data = await getDoctorAppointments();
      if (data.success) {
        dispatch(setDoctorAppointments(data.appointments || []));
        return { success: true, appointments: data.appointments };
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch doctor appointments';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchPatient = useCallback(
    async (patientId) => {
      try {
        dispatch(setPatientLoading(true));
        const data = await getPatientDetails(patientId);
        if (data.success) {
          dispatch(
            setSelectedPatient({
              patient: data.patient,
              appointments: data.appointments || [],
            })
          );
          return { success: true, data };
        }
        return { success: false };
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch patient details';
        dispatch(setError(msg));
        return { success: false, error: msg };
      } finally {
        dispatch(setPatientLoading(false));
      }
    },
    [dispatch]
  );

  const handleComplete = useCallback(
    async (appointmentId) => {
      try {
        dispatch(clearDoctorMessages());
        dispatch(setActionLoadingId(appointmentId));
        const data = await completeAppointment(appointmentId);
        if (data.success) {
          dispatch(updateAppointmentStatus({ appointmentId, status: 'completed' }));
          dispatch(setSuccessMessage(data.message || 'Appointment marked as completed successfully!'));
          return { success: true };
        }
        return { success: false };
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || 'Failed to complete appointment';
        dispatch(setError(msg));
        return { success: false, error: msg };
      } finally {
        dispatch(setActionLoadingId(null));
      }
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (filter) => {
      dispatch(setActiveFilter(filter));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (query) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const closePatientModal = useCallback(() => {
    dispatch(clearSelectedPatient());
  }, [dispatch]);

  const clearMessages = useCallback(() => {
    dispatch(clearDoctorMessages());
  }, [dispatch]);

  return {
    ...doctorState,
    fetchProfile,
    fetchAppointments,
    fetchPatient,
    handleComplete,
    handleFilterChange,
    handleSearchChange,
    closePatientModal,
    clearMessages,
  };
}
