import React from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function StaffStatsCards({ appointments = [], loading }) {
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter(
    (a) => a.status === 'cancelled' || a.status === 'rejected'
  ).length;

  const cards = [
    {
      title: 'Total In Queue',
      value: total,
      icon: CalendarDays,
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
      caption: 'Appointments in database',
    },
    {
      title: 'Pending Action',
      value: pending,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      caption: 'Awaiting confirmation or triage',
      highlight: pending > 0,
    },
    {
      title: 'Confirmed Consultations',
      value: confirmed,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      caption: 'Scheduled and ready for doctor',
    },
    {
      title: 'Completed / Handled',
      value: completed,
      icon: CheckCircle2,
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-100',
      caption: 'Consultations completed',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all duration-200 flex flex-col justify-between ${
              card.highlight
                ? 'border-amber-200/80 ring-2 ring-amber-100/50'
                : 'border-sky-100/70 hover:border-sky-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {card.title}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
                    {loading ? (
                      <span className="inline-block w-12 h-7 bg-slate-100 rounded-md animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </span>
                </div>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
              <span>{card.caption}</span>
              {card.highlight && (
                <span className="text-amber-600 font-semibold inline-flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Needs Attention
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
