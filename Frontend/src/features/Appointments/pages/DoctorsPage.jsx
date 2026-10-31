import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppointment } from '../hook/useAppointment';
import {
  Stethoscope,
  ArrowLeft,
  Clock,
  Award,
  IndianRupee,
  ChevronRight,
  AlertCircle,
  Loader2,
  UserCircle2,
  Users,
} from 'lucide-react';

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

/* ── Doctor card skeleton ── */
function DoctorSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="flex gap-3">
          <div className="h-3 bg-slate-100 rounded w-20" />
          <div className="h-3 bg-slate-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DOCTORS PAGE
══════════════════════════════════════════════════════════════ */
export default function DoctorsPage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const {
    doctors,
    selectedDepartment,
    loading,
    error,
    handleSelectDepartment,
    handleSelectDoctor,
  } = useAppointment();

  /* Re-hydrate doctors if page is accessed directly or refreshed */
  useEffect(() => {
    if (departmentId && (!selectedDepartment || String(selectedDepartment.id) !== String(departmentId))) {
      handleSelectDepartment(departmentId);
    }
  }, [departmentId]);

  async function onSelect(doctor) {
    handleSelectDoctor(doctor);
    navigate(`/appointments/doctors/${doctor.doctor_id}/book`);
  }

  const deptName = selectedDepartment?.name || 'Department Doctors';

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
              className="text-xs sm:text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors"
            >
              Departments
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* ── Step progress ── */}
        <div className="flex items-center gap-3 max-w-sm">
          <StepBadge step={1} label="Department" done />
          <div className="flex-1 h-px bg-sky-200" />
          <StepBadge step={2} label="Doctor" active />
          <div className="flex-1 h-px bg-slate-200" />
          <StepBadge step={3} label="Slot" />
        </div>

        {/* ── Back + heading ── */}
        <div className="space-y-4">
          <button
            id="back-to-departments"
            onClick={() => navigate('/appointments')}
            className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Departments
          </button>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">{deptName}</h2>
            <p className="text-slate-500 text-sm">
              Select your preferred doctor to schedule a consultation
            </p>
          </div>
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
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <DoctorSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Doctor list ── */}
        {!loading && !error && doctors.length > 0 && (
          <div className="flex flex-col gap-4">
            {doctors.map((doc) => (
              <button
                key={doc.doctor_id}
                id={`doctor-${doc.doctor_id}`}
                onClick={() => onSelect(doc)}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-sky-300 hover:shadow-md p-5 sm:p-6 text-left shadow-sm transition-all duration-200 flex items-center gap-5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                  <UserCircle2 className="w-8 h-8 text-sky-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base group-hover:text-sky-600 transition-colors">
                        Dr. {doc.doctor_name}
                      </h3>
                      <span className="inline-block text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full mt-1">
                        {doc.specialization}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-1">
                    {doc.qualification && (
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-sky-400" />
                        {doc.qualification}
                      </span>
                    )}
                    {doc.experience_years != null && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-sky-400" />
                        {doc.experience_years} years experience
                      </span>
                    )}
                    {doc.consultation_fee != null && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <IndianRupee className="w-4 h-4 text-sky-500" />
                        ₹{doc.consultation_fee} fee
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-24 space-y-4 bg-white rounded-2xl border border-slate-100 p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">
                No doctors currently listed in this department
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Please check other departments or try again later
              </p>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Departments
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
