import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  FileText,
  CalendarX2,
  CalendarCheck,
  RotateCcw,
} from 'lucide-react';
import StaffActionModal from './StaffActionModal';

export default function StaffAppointmentsTable({
  appointments,
  filteredAppointments,
  statusFilter,
  dateFilter,
  searchQuery,
  loading,
  actionLoadingId,
  onStatusChange,
  onDateChange,
  onSearchChange,
  onResetFilters,
  onUpdateStatus,
}) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    appointment: null,
    targetStatus: null,
  });

  const tabs = [
    { id: 'all', label: 'All', count: appointments.length },
    {
      id: 'pending',
      label: 'Pending',
      count: appointments.filter((a) => a.status === 'pending').length,
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      count: appointments.filter((a) => a.status === 'confirmed').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: appointments.filter((a) => a.status === 'completed').length,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: appointments.filter(
        (a) => a.status === 'cancelled' || a.status === 'rejected'
      ).length,
    },
  ];

  const handleOpenModal = (appointment, targetStatus) => {
    setModalConfig({
      isOpen: true,
      appointment,
      targetStatus,
    });
  };

  const handleConfirmModal = async (id, status) => {
    const res = await onUpdateStatus(id, status);
    if (res?.success) {
      setModalConfig({ isOpen: false, appointment: null, targetStatus: null });
    }
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending Review
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            <CheckCircle className="w-3 h-3 text-teal-600" />
            Completed
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle className="w-3 h-3 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const formatTimeSlot = (timeStr) => {
    if (!timeStr) return '';
    try {
      const parts = timeStr.split(':');
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1] || '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100/80 shadow-xs overflow-hidden">
      {/* ── Table Top Bar & Filter Controls ── */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">
              Appointment Schedule & Front Desk Triage
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, verify, and confirm consultation bookings across all hospital departments
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="font-semibold text-slate-700">{filteredAppointments.length}</span> consultations
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs shadow-sky-600/20'
                    : 'bg-slate-50 hover:bg-sky-50/70 text-slate-600 hover:text-sky-700 border border-transparent hover:border-sky-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <span className="absolute left-3.5 top-1/2 -translate-1/2 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by patient, doctor, specialization, or reason..."
              className="w-full h-10 pl-10 pr-3.5 bg-slate-50/80 hover:bg-slate-50 text-slate-800 placeholder:text-slate-400 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-3 focus:ring-sky-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Date Picker Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-1/2 text-slate-400 pointer-events-none">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={handleSetToday}
              className="h-10 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-100 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-2 flex items-center justify-end">
            {(dateFilter || statusFilter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={onResetFilters}
                className="w-full h-10 flex items-center justify-center gap-1.5 px-3 bg-slate-100 hover:bg-slate-200/70 text-slate-600 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-sky-50/40 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3.5 px-5">ID & Patient</th>
              <th className="py-3.5 px-4">Doctor & Dept</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100" />
                      <div className="space-y-1.5">
                        <div className="w-24 h-3.5 bg-slate-100 rounded" />
                        <div className="w-36 h-2.5 bg-slate-50 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-28 h-3.5 bg-slate-100 rounded mb-1" />
                    <div className="w-20 h-2.5 bg-slate-50 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-3.5 bg-slate-100 rounded mb-1" />
                    <div className="w-16 h-2.5 bg-slate-50 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-32 h-3.5 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-5 bg-slate-100 rounded-full" />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="w-24 h-7 bg-slate-100 rounded-xl ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 flex items-center justify-center mx-auto mb-3">
                      <CalendarX2 className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      No appointments found
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      No appointments match the selected filters or date range.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => {
                const apptId = appt.appointment_id || appt.id;
                const isActionLoading = actionLoadingId === apptId;
                const isPending = appt.status === 'pending';
                const isConfirmed = appt.status === 'confirmed';

                return (
                  <tr
                    key={apptId}
                    className="hover:bg-sky-50/30 transition-colors group"
                  >
                    {/* Patient & ID */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-100 to-sky-50 text-sky-700 border border-sky-200/50 flex items-center justify-center font-bold text-xs shrink-0">
                          {appt.patient_name
                            ? appt.patient_name.charAt(0).toUpperCase()
                            : 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                              {appt.patient_name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                              #{apptId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {appt.patient_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor & Dept */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>Dr. {appt.doctor_name}</span>
                      </div>
                      <p className="text-[11px] text-sky-600 font-medium pl-5">
                        {appt.specialization || 'Specialist'}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(appt.appointment_date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pl-5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatTimeSlot(appt.appointment_time)}</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      <span title={appt.reason}>
                        {appt.reason || 'General medical consultation'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(appt.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      {isPending && (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleOpenModal(appt, 'confirmed')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition-all cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleOpenModal(appt, 'cancelled')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-all cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}

                      {isConfirmed && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleOpenModal(appt, 'cancelled')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/50 transition-all cursor-pointer"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      )}

                      {!isPending && !isConfirmed && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          No action needed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      <StaffActionModal
        appointment={modalConfig.appointment}
        targetStatus={modalConfig.targetStatus}
        isOpen={modalConfig.isOpen}
        onClose={() =>
          setModalConfig({
            isOpen: false,
            appointment: null,
            targetStatus: null,
          })
        }
        onConfirm={handleConfirmModal}
        loading={
          actionLoadingId ===
          (modalConfig.appointment?.appointment_id ||
            modalConfig.appointment?.id)
        }
      />
    </div>
  );
}
