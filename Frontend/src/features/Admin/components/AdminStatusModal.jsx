import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function AdminStatusModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen || !user) return null;

  const willActivate = user.is_active === false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full border border-sky-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                willActivate
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {willActivate ? (
                <CheckCircle className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {willActivate ? 'Activate User Account' : 'Deactivate User Account'}
              </h3>
              <p className="text-xs text-slate-500">
                Confirm account status modification
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

        {/* Body content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to{' '}
            <strong className="text-slate-900 font-semibold">
              {willActivate ? 'activate' : 'deactivate'}
            </strong>{' '}
            the account for{' '}
            <span className="font-semibold text-sky-700">{user.name}</span> (
            <span className="text-slate-500">{user.email}</span>)?
          </p>

          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Role:</span>
              <span className="font-semibold capitalize text-slate-800">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span
                className={`font-semibold ${
                  user.is_active !== false ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {user.is_active !== false ? 'Active' : 'Deactivated'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {willActivate
              ? 'Once activated, this user will regain full access to their hospital portal role and features.'
              : 'When deactivated, this user will be restricted from authenticating into their portal.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(user.id, user.is_active !== false)}
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              willActivate
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>{willActivate ? 'Activate Account' : 'Deactivate Account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
