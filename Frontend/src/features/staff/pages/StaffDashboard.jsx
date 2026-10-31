import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  X,
  ClipboardList,
  Sparkles,
  CalendarClock,
} from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth';
import { useStaff } from '../hook/useStaff';
import StaffNavbar from '../components/StaffNavbar';
import StaffStatsCards from '../components/StaffStatsCards';
import StaffAppointmentsTable from '../components/StaffAppointmentsTable';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
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
  } = useStaff();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Role guard: redirect if not staff
  useEffect(() => {
    if (user && user.role !== 'staff') {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  // Initial data load
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await fetchAppointments();
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      {/* Top Navbar */}
      <StaffNavbar onRefresh={handleRefreshAll} isRefreshing={isRefreshing} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Greeting & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-sky-50/40 p-6 rounded-3xl border border-sky-100/90 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 text-sky-700 text-xs font-semibold mb-2">
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Reception & Clinical Operations</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Staff Member'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Manage incoming patient appointment requests, allocate clinical slots, and coordinate daily consultations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-white border border-sky-100 rounded-2xl shadow-2xs flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Desk Station
                </p>
                <p className="text-xs font-semibold text-slate-800">
                  Ready For Triage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Notifications / Alerts */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleClear}
              className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-100/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={handleClear}
              className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-100/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Today's Consultation Flow
            </h2>
          </div>
          <StaffStatsCards appointments={appointments} loading={loading} />
        </section>

        {/* Appointments Management Table */}
        <section className="space-y-3">
          <StaffAppointmentsTable
            appointments={appointments}
            filteredAppointments={filteredAppointments}
            statusFilter={statusFilter}
            dateFilter={dateFilter}
            searchQuery={searchQuery}
            loading={loading}
            actionLoadingId={actionLoadingId}
            onStatusChange={handleStatusChange}
            onDateChange={handleDateChange}
            onSearchChange={handleSearchChange}
            onResetFilters={handleResetFilters}
            onUpdateStatus={updateStatus}
          />
        </section>
      </main>
    </div>
  );
}
