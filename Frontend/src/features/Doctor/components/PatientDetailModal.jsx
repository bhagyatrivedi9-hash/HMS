import React from 'react';
import {
  X,
  User,
  Mail,
  Calendar,
  Clock,
  Activity,
  History,
  CheckCircle2,
  AlertCircle,
  FileText,
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

export default function PatientDetailModal({ data, onClose, loading }) {
  if (!data && !loading) return null;

  const patient = data?.patient;
  const history = data?.appointments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-sky-100 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ── Modal Header ── */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 to-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-bold flex items-center justify-center text-lg shadow-sm shadow-sky-600/20">
              {(patient?.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {patient?.name || 'Patient Details'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold">
                  Patient #{patient?.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient?.email || 'No email registered'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Clinical summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Total Consultations
              </span>
              <div className="text-xl font-bold text-sky-800">
                {history.length} {history.length === 1 ? 'visit' : 'visits'}
              </div>
              <span className="text-xs text-slate-500">with your clinic</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Latest Status
              </span>
              <div className="text-sm font-bold text-slate-900 capitalize">
                {history[0]?.status || 'N/A'}
              </div>
              <span className="text-xs text-slate-500">
                {history[0] ? formatDate(history[0].appointment_date) : 'No records'}
              </span>
            </div>
          </div>

          {/* Consultation History Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Consultation History & Reasons
              </h4>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No prior visit records found.</p>
            ) : (
              <div className="space-y-3">
                {history.map((record, idx) => {
                  const isCompleted = record.status === 'completed';
                  const isConfirmed = record.status === 'confirmed';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-sky-200 transition-all space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          <span>{formatDate(record.appointment_date)}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-slate-500">{formatTime(record.appointment_time)}</span>
                        </div>

                        {/* Status Chip */}
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
                            {record.status}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-600">Chief Reason: </span>
                        <span>{record.reason || 'Standard checkup & consultation'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
