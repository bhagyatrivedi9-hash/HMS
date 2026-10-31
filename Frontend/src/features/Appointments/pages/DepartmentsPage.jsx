import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../hook/useAppointment';
import {
  Activity,
  Brain,
  Heart,
  Stethoscope,
  Eye,
  Bone,
  Baby,
  Wind,
  Pill,
  Zap,
  ChevronRight,
  AlertCircle,
  Building2,
} from 'lucide-react';

/* ── Department icon mapping ── */
const DEPT_ICONS = {
  cardiology: Heart,
  neurology: Brain,
  orthopedics: Bone,
  pediatrics: Baby,
  ophthalmology: Eye,
  pulmonology: Wind,
  pharmacy: Pill,
  general: Stethoscope,
  emergency: Zap,
  default: Activity,
};

/* ── Soft colour tokens per card (icon bg) ── */
const CARD_ACCENTS = [
  { bg: 'bg-sky-100', icon: 'text-sky-600', border: 'hover:border-sky-300' },
  { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'hover:border-blue-300' },
  { bg: 'bg-cyan-100', icon: 'text-cyan-600', border: 'hover:border-cyan-300' },
  { bg: 'bg-indigo-100', icon: 'text-indigo-600', border: 'hover:border-indigo-300' },
  { bg: 'bg-teal-100', icon: 'text-teal-600', border: 'hover:border-teal-300' },
  { bg: 'bg-violet-100', icon: 'text-violet-600', border: 'hover:border-violet-300' },
];

function getDeptIcon(name) {
  const key = (name || '').toLowerCase();
  for (const [k, Icon] of Object.entries(DEPT_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return DEPT_ICONS.default;
}

/* ── Step indicator ── */
function StepBadge({ step, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
          done
            ? 'bg-sky-500 text-white'
            : active
            ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
            : 'bg-slate-100 text-slate-400'
        }`}
      >
        {done ? '✓' : step}
      </div>
      <span
        className={`text-sm font-medium hidden sm:block ${
          active || done ? 'text-sky-600' : 'text-slate-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Department card skeleton ── */
function DeptCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-slate-100 mb-4" />
      <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded-lg w-full mb-1" />
      <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEPARTMENTS PAGE
══════════════════════════════════════════════════════════════ */
export default function DepartmentsPage() {
  const navigate = useNavigate();
  const {
    departments,
    loading,
    error,
    handleFetchDepartments,
    handleSelectDepartment,
  } = useAppointment();

  useEffect(() => {
    handleFetchDepartments();
  }, []);

  async function onSelect(dept) {
    await handleSelectDepartment(dept);
    navigate(`/appointments/departments/${dept.id}/doctors`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top nav bar ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm group-hover:bg-sky-600 transition-colors">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800 leading-tight">
                CareWell
              </h1>
              <p className="text-xs text-slate-400">Multispecialist Hospital</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs sm:text-sm font-medium text-slate-500 hover:text-sky-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs sm:text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg"
            >
              Departments
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* ── Step progress ── */}
        <div className="flex items-center gap-3 max-w-sm">
          <StepBadge step={1} label="Department" active />
          <div className="flex-1 h-px bg-slate-200" />
          <StepBadge step={2} label="Doctor" />
          <div className="flex-1 h-px bg-slate-200" />
          <StepBadge step={3} label="Slot" />
        </div>

        {/* ── Page heading ── */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-800">
            Select a Medical Specialty
          </h2>
          <p className="text-slate-500 text-sm">
            Choose a department to see qualified specialist doctors and available appointment slots
          </p>
        </div>

        {/* ── Error ── */}
        {!loading && error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <DeptCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Department grid ── */}
        {!loading && !error && departments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept, i) => {
              const Icon = getDeptIcon(dept.name);
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              return (
                <button
                  key={dept.id}
                  id={`dept-${dept.id}`}
                  onClick={() => onSelect(dept)}
                  className={`group bg-white rounded-2xl border border-slate-100 ${accent.border} p-6 text-left shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${accent.bg} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className={`w-6 h-6 ${accent.icon}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-slate-800 text-base group-hover:text-sky-600 transition-colors">
                      {dept.name}
                    </h3>
                    {dept.description && (
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {dept.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                      View Doctors
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && departments.length === 0 && (
          <div className="text-center py-24 space-y-4 bg-white rounded-2xl border border-slate-100 p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-slate-600">No departments found</p>
              <p className="text-sm text-slate-400 mt-1">
                Please check back later or contact hospital administration
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
