import React, { useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  FileText,
  AlertCircle,
  Filter,
  Check,
  ChevronRight,
  Loader2,
} from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function DoctorAppointmentsTable({
  appointments = [],
  activeFilter = 'all',
  searchQuery = '',
  onFilterChange,
  onSearchChange,
  onViewPatient,
  onCompleteClick,
  actionLoadingId,
  loading = false,
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Counts for tabs
  const counts = useMemo(() => {
    const total = appointments.length;
    const today = appointments.filter((a) => {
      if (!a.appointment_date) return false;
      return new Date(a.appointment_date).toISOString().split('T')[0] === todayStr;
    }).length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    return { total, today, confirmed, completed };
  }, [appointments, todayStr]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // 1. Tab filter
      if (activeFilter === 'today') {
        const itemDate = item.appointment_date
          ? new Date(item.appointment_date).toISOString().split('T')[0]
          : '';
        if (itemDate !== todayStr) return false;
      } else if (activeFilter === 'confirmed') {
        if (item.status !== 'confirmed') return false;
      } else if (activeFilter === 'completed') {
        if (item.status !== 'completed') return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const pName = (item.patient_name || '').toLowerCase();
        const pEmail = (item.patient_email || '').toLowerCase();
        const reason = (item.reason || '').toLowerCase();
        if (!pName.includes(q) && !pEmail.includes(q) && !reason.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, activeFilter, searchQuery, todayStr]);

  const tabs = [
    { id: 'all', label: 'All Appointments', count: counts.total },
    { id: 'today', label: "Today's Schedule", count: counts.today },
    { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden">
      {/* ── Table Header / Filters ── */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-sky-50/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Patient Appointments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review assigned patient visits, inspect medical complaints, and complete consultations.
            </p>
          </div>

          {/* Quick counter badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sky-200 text-xs font-semibold text-sky-800 shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>{filteredAppointments.length} visible visits</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by patient name, email, or visit reason..."
            className="w-full h-10 pl-10 pr-4 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-100 transition-all"
          />
        </div>
      </div>

      {/* ── Table Content (Desktop / Tablet) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Patient</th>
              <th className="py-3.5 px-6">Schedule / Slot</th>
              <th className="py-3.5 px-6">Visit Reason</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                    <span className="text-xs">Loading appointments...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No appointments found</p>
                    <p className="text-xs text-slate-400">
                      Try selecting another filter tab or clearing your search keywords.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => {
                const isConfirmed = appt.status === 'confirmed';
                const isCompleted = appt.status === 'completed';
                const isActionLoading = actionLoadingId === appt.appointment_id;

                return (
                  <tr
                    key={appt.appointment_id}
                    className="hover:bg-sky-50/30 transition-colors group"
                  >
                    {/* Patient info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 text-sky-700 font-bold flex items-center justify-center text-sm shrink-0">
                          {(appt.patient_name || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {appt.patient_name || 'Unnamed Patient'}
                          </div>
                          <div className="text-xs text-slate-500">{appt.patient_email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>{formatDate(appt.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatTime(appt.appointment_time)}</span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-medium max-w-xs truncate" title={appt.reason}>
                        {appt.reason || 'Routine consultation'}
                      </div>
                      <div className="text-xs text-slate-400">ID #{appt.appointment_id}</div>
                    </td>

                    {/* Status Chip */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      ) : isConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {appt.status || 'Pending'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Patient Details */}
                        <button
                          onClick={() => onViewPatient(appt.patient_id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Patient Record & History"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Patient Info</span>
                        </button>

                        {/* Mark as Completed */}
                        {isConfirmed && (
                          <button
                            onClick={() => onCompleteClick(appt)}
                            disabled={isActionLoading}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                            title="Mark this consultation completed"
                          >
                            {isActionLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            <span>Complete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card View (Small screens) ── */}
      <div className="md:hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-10 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-sky-600 mx-auto mb-2" />
            <span className="text-xs">Loading appointments...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-6 h-6 text-sky-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No appointments found</p>
            <p className="text-xs text-slate-400">Adjust filters to see other appointments.</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            const isConfirmed = appt.status === 'confirmed';
            const isCompleted = appt.status === 'completed';
            const isActionLoading = actionLoadingId === appt.appointment_id;

            return (
              <div key={appt.appointment_id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
                      {(appt.patient_name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{appt.patient_name}</h4>
                      <p className="text-xs text-slate-500">{appt.patient_email}</p>
                    </div>
                  </div>

                  {/* Status chip */}
                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  ) : isConfirmed ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Confirmed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {appt.status}
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date & Time:</span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(appt.appointment_date)} at {formatTime(appt.appointment_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reason:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                      {appt.reason || 'General'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onViewPatient(appt.patient_id)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Patient Details</span>
                  </button>

                  {isConfirmed && (
                    <button
                      onClick={() => onCompleteClick(appt)}
                      disabled={isActionLoading}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>Complete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
