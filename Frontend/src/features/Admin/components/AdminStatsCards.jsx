import React from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminStatsCards({ stats, loading }) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients ?? '—',
      icon: Users,
      color: 'sky',
      caption: 'Registered patient accounts',
    },
    {
      title: 'Total Doctors',
      value: stats?.total_doctors ?? '—',
      icon: UserCheck,
      color: 'sky',
      caption: 'Active medical specialists',
    },
    {
      title: 'Hospital Staff',
      value: stats?.total_staff ?? '—',
      icon: ShieldCheck,
      color: 'sky',
      caption: 'Operational & front-desk staff',
    },
    {
      title: 'Departments',
      value: stats?.total_departments ?? '—',
      icon: Building2,
      color: 'sky',
      caption: 'Specialized clinical units',
    },
    {
      title: 'Total Appointments',
      value: stats?.total_appointments ?? '—',
      icon: CalendarCheck2,
      color: 'sky',
      caption: 'Booked consultations',
    },
    {
      title: 'Pending Review',
      value: stats?.pending_appointments ?? '—',
      icon: Clock,
      color: 'amber',
      caption: 'Awaiting staff confirmation',
    },
    {
      title: 'Confirmed',
      value: stats?.confirmed_appointments ?? '—',
      icon: CheckCircle2,
      color: 'emerald',
      caption: 'Scheduled upcoming visits',
    },
    {
      title: 'Completed',
      value: stats?.completed_appointments ?? '—',
      icon: CheckCircle2,
      color: 'teal',
      caption: 'Fulfilled patient consults',
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'teal':
        return {
          iconBg: 'bg-teal-50 text-teal-600 border border-teal-100',
          badge: 'bg-teal-50 text-teal-700 border-teal-200',
        };
      default:
        return {
          iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const colorClasses = getColorClasses(card.color);

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-sky-100/70 p-5 shadow-xs hover:shadow-sm hover:border-sky-200 transition-all duration-200 flex flex-col justify-between"
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
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClasses.iconBg}`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
              <span>{card.caption}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
