import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth';
import { useDoctor } from '../hook/useDoctor';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorStats from '../components/DoctorStats';
import DoctorAppointmentsTable from '../components/DoctorAppointmentsTable';
import PatientDetailModal from '../components/PatientDetailModal';
import CompleteConfirmModal from '../components/CompleteConfirmModal';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    profile,
    appointments,
    selectedPatient,
    activeFilter,
    searchQuery,
    loading,
    patientLoading,
    actionLoadingId,
    error,
    successMessage,
    fetchProfile,
    fetchAppointments,
    fetchPatient,
    handleComplete,
    handleFilterChange,
    handleSearchChange,
    closePatientModal,
    clearMessages,
  } = useDoctor();

  const [confirmAppt, setConfirmAppt] = useState(null);
  const [completing, setCompleting] = useState(false);

  // Initial load
  useEffect(() => {
    // If user is not logged in or not a doctor, redirect
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.role !== 'doctor') {
      navigate('/', { replace: true });
      return;
    }

    fetchProfile();
    fetchAppointments();
  }, [user, navigate, fetchProfile, fetchAppointments]);

  // Handle Complete Confirmation
  const onConfirmComplete = async () => {
    if (!confirmAppt) return;
    setCompleting(true);
    await handleComplete(confirmAppt.appointment_id);
    setCompleting(false);
    setConfirmAppt(null);
  };

  const displayName = profile?.name || user?.name || 'Doctor';
  const departmentName = profile?.department || profile?.specialization || 'General Care';

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-sky-50/20 text-slate-800 flex flex-col font-sans">
      {/* ── Top Doctor Navbar ── */}
      <DoctorNavbar profile={profile} />

      {/* ── Main Dashboard Workspace ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Hero Welcome & Shift Status ── */}
        <section className="bg-white rounded-2xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-100/50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Good day, Dr. {displayName.replace(/^dr\.?\s+/i, '')}
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200">
                Active Duty
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-sky-600" />
                {todayFormatted}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-600">{departmentName} Department</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-sky-700 font-semibold">
                {appointments.length} total scheduled patient consultations
              </span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                fetchProfile();
                fetchAppointments();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Refresh clinic schedule"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Schedule</span>
            </button>
          </div>
        </section>

        {/* ── Status Notifications ── */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearMessages}
              className="text-rose-600 hover:text-rose-900 font-semibold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={clearMessages}
              className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── 4 Bento Metric Cards ── */}
        <DoctorStats appointments={appointments} profile={profile} />

        {/* ── Main Appointments Workspace ── */}
        <section className="space-y-4">
          <DoctorAppointmentsTable
            appointments={appointments}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onViewPatient={(patientId) => fetchPatient(patientId)}
            onCompleteClick={(appt) => setConfirmAppt(appt)}
            actionLoadingId={actionLoadingId}
            loading={loading}
          />
        </section>
      </main>

      {/* ── Patient Details Drawer / Modal ── */}
      <PatientDetailModal
        data={selectedPatient}
        onClose={closePatientModal}
        loading={patientLoading}
      />

      {/* ── Mark as Complete Confirmation Modal ── */}
      <CompleteConfirmModal
        appointment={confirmAppt}
        onConfirm={onConfirmComplete}
        onCancel={() => setConfirmAppt(null)}
        loading={completing}
      />

    
    </div>
  );
}
