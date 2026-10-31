import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDepartments,
  getDoctorsByDepartment,
  getDoctorById,
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} from '../services/appointment.api';
import {
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
} from '../appointment.slice';

export function useAppointment() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.appointment);

  async function handleFetchDepartments() {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await getAllDepartments();
      dispatch(setDepartments(data.departments || []));
      return { success: true, departments: data.departments || [] };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load departments';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleSelectDepartment(deptOrId) {
    const id = typeof deptOrId === 'object' && deptOrId !== null ? deptOrId.id : deptOrId;
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await getDoctorsByDepartment(id);
      const departmentObj =
        typeof deptOrId === 'object' && deptOrId !== null && deptOrId.name
          ? deptOrId
          : { id, name: data.department || `Department #${id}` };
      dispatch(setSelectedDepartment(departmentObj));
      dispatch(setDoctors(data.doctors || []));
      return { success: true, doctors: data.doctors || [] };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load doctors';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleSelectDoctor(doctor) {
    dispatch(setSelectedDoctor(doctor));
  }

  async function handleFetchDoctorById(doctorId) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await getDoctorById(doctorId);
      if (data.doctor) {
        dispatch(setSelectedDoctor(data.doctor));
      }
      return { success: true, doctor: data.doctor };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load doctor details';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleFetchSlots(doctorId, date) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await getAvailableSlots(doctorId, date);
      dispatch(setAvailableSlots(data.slots || []));
      return { success: true, slots: data.slots || [], message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load slots';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleSelectDate(date) {
    dispatch(setSelectedDate(date));
  }

  function handleSelectSlot(slot) {
    dispatch(setSelectedSlot(slot));
  }

  async function handleBookAppointment({ doctor_id, appointment_date, appointment_time, reason }) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await bookAppointment({ doctor_id, appointment_date, appointment_time, reason });
      dispatch(setLastBooking(data.appointment));
      dispatch(resetBooking());
      return { success: true, appointment: data.appointment };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleFetchMyAppointments() {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await getMyAppointments();
      dispatch(setMyAppointments(data.appointments || []));
      return { success: true, appointments: data.appointments || [] };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load appointments';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleCancelAppointment(appointmentId) {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await cancelAppointment(appointmentId);
      dispatch(updateAppointmentStatus({ id: appointmentId, status: 'cancelled' }));
      return { success: true, appointment: data.appointment };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel appointment';
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleResetBooking() {
    dispatch(resetBooking());
  }

  return {
    ...state,
    handleFetchDepartments,
    handleSelectDepartment,
    handleSelectDoctor,
    handleFetchDoctorById,
    handleFetchSlots,
    handleSelectDate,
    handleSelectSlot,
    handleBookAppointment,
    handleFetchMyAppointments,
    handleCancelAppointment,
    handleResetBooking,
  };
}
