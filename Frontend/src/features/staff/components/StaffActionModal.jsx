import React from 'react';
import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';

export default function StaffActionModal({
  appointment,
  targetStatus, // 'confirmed' | 'cancelled'
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen || !appointment || !targetStatus) return null;

  const isConfirm = targetStatus === 'confirmed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full border border-sky-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isConfirm
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {isConfirm ? (
                <CheckCircle className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <XCircle className="w-5 h-5 stroke-[2.2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isConfirm ? 'Confirm Appointment' : 'Cancel Appointment'}
              </h3>
              <p className="text-xs text-slate-500">
                Appointment ID #{appointment.appointment_id || appointment.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to {isConfirm ? 'confirm' : 'cancel'} this consultation?
          </p>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-semibold text-slate-900">
                {appointment.patient_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-semibold text-sky-800">
                Dr. {appointment.doctor_name} ({appointment.specialization})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-medium text-slate-800">
                {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                {appointment.appointment_time}
              </span>
            </div>
            {appointment.reason && (
              <div className="pt-2 border-t border-sky-100 text-slate-500">
                <span className="font-medium text-slate-700">Reason:</span>{' '}
                {appointment.reason}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            {isConfirm
              ? 'Once confirmed, the doctor and patient will see this appointment locked in as scheduled.'
              : 'Once cancelled, this slot will be released and marked as cancelled.'}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(
                appointment.appointment_id || appointment.id,
                targetStatus
              )
            }
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              isConfirm
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>
              {isConfirm ? 'Confirm Appointment' : 'Cancel Appointment'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
