import React from 'react';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export default function CompleteConfirmModal({ appointment, onConfirm, onCancel, loading }) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl border border-sky-100 shadow-xl p-6 space-y-4">
        {/* Header icon */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            Complete Consultation?
          </h3>
          <p className="text-xs text-slate-500">
            This will mark the appointment with{' '}
            <span className="font-semibold text-slate-800">{appointment.patient_name}</span> as
            completed.
          </p>
        </div>

        {/* Appointment summary box */}
        <div className="bg-sky-50/50 rounded-xl p-3.5 border border-sky-100 text-xs text-slate-700 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Appointment ID:</span>
            <span className="font-semibold text-slate-800">#{appointment.appointment_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled Date:</span>
            <span className="font-semibold text-slate-800">
              {appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Reason:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">
              {appointment.reason || 'General'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Yes, Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
