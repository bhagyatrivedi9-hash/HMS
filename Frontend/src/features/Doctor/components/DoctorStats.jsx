import React from 'react';
import { Calendar, UserCheck, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

export default function DoctorStats({ appointments = [], profile }) {
  // Compute counts
  const total = appointments.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => {
    if (!a.appointment_date) return false;
    const d = new Date(a.appointment_date).toISOString().split('T')[0];
    return d === todayStr;
  });

  const confirmedList = appointments.filter((a) => a.status === 'confirmed');
  const completedList = appointments.filter((a) => a.status === 'completed');

  const fee = Number(profile?.consultation_fee) || 0;
  const estimatedRevenue = completedList.length * fee;

  const completionRate = total > 0 ? Math.round((completedList.length / total) * 100) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Today's Appointments */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-md hover:border-sky-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today's Schedule
          </span>
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {todayAppointments.length}
            </span>
            <span className="text-xs font-medium text-slate-500">patient visits</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-sky-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-semibold">{total} total</span>
            <span className="text-slate-400">&bull; on your clinical roster</span>
          </div>
        </div>
      </div>

      {/* 2. Confirmed Visits */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-md hover:border-sky-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Confirmed Visits
          </span>
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {confirmedList.length}
            </span>
            <span className="text-xs font-medium text-slate-500">queued patients</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-500">
            Active patient appointments
          </div>
        </div>
      </div>

      {/* 3. Completed Consultations */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-md hover:border-sky-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed Consults
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {completedList.length}
            </span>
            <span className="text-xs font-medium text-slate-500">of {total} slots</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="font-semibold text-emerald-700 shrink-0">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* 4. Consultation Fee */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-md hover:border-sky-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Consultation Fee
          </span>
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              ₹{fee.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">/ consultation</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-500">
            Est. Completed Value: <span className="font-semibold text-slate-800">₹{estimatedRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
