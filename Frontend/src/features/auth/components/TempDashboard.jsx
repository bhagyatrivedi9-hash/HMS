import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  CalendarPlus,
  Clock,
  ShieldCheck,
  HeartPulse,
  LogOut,
  Calendar,
  User,
  AlertCircle,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../hook/useAuth';
import { useAppointment } from '../../Appointments/hook/useAppointment';

const FEATURES = [
  {
    icon: CalendarPlus,
    title: 'Specialist Consultations',
    desc: 'Schedule visits with certified doctors across medical specialties',
  },
  {
    icon: Clock,
    title: 'Real-Time Slot Booking',
    desc: 'Select preferred appointment time slots instantly',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Confidential',
    desc: 'Your consultation records and health history are strictly secured',
  },
];

function formatTime(slot) {
  if (!slot) return '';
  const [h, m] = slot.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

const TempDashboard = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const {
    myAppointments,
    handleFetchMyAppointments,
    handleCancelAppointment,
  } = useAppointment();

  useEffect(() => {
    if (user?.role === 'doctor') {
      navigate('/doctor/dashboard', { replace: true });
      return;
    }
    if (user) {
      handleFetchMyAppointments();
    }
  }, [user, navigate]);

  async function onLogout() {
    await handleLogout();
    navigate('/login');
  }

  const firstName = user?.name?.split(' ')[0] || 'Patient';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top nav ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs sm:text-sm font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Book Appointment
            </button>
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-sky-600">
                      {user.name?.charAt(0)?.toUpperCase() || 'P'}
                    </span>
                  </div>
                  <span className="text-sm text-slate-700 font-medium hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-xs sm:text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* ── Hero section ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-8 py-10 text-white">
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse className="w-5 h-5 text-sky-100" />
              <span className="text-sky-100 text-xs font-semibold uppercase tracking-wider">
                Patient Portal
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-sky-100 text-sm leading-relaxed max-w-lg">
              Easily connect with medical specialists, book consultation slots in a few clicks, and manage your health appointments in one place.
            </p>
          </div>

          <div className="px-8 py-5 bg-white flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Need medical care? Choose a specialty and schedule your visit.
            </div>
            <button
              id="book-appointment-cta"
              onClick={() => navigate('/appointments')}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors shadow-sm text-sm"
            >
              <CalendarPlus className="w-4 h-4" />
              Book New Appointment
            </button>
          </div>
        </div>

        {/* ── My Appointments Section ── */}
        {user && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                My Scheduled Appointments
              </h2>
              {myAppointments && myAppointments.length > 0 && (
                <span className="text-xs text-sky-600 bg-sky-50 font-semibold px-2.5 py-1 rounded-full">
                  {myAppointments.length} total
                </span>
              )}
            </div>

            {myAppointments && myAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAppointments.map((appt) => {
                  const isCancelled = appt.status === 'cancelled';
                  const isConfirmed = appt.status === 'confirmed';
                  return (
                    <div
                      key={appt.id}
                      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 hover:border-sky-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-base">
                            Dr. {appt.doctor_name}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-xs mt-1">
                            {appt.specialization && (
                              <span className="text-sky-600 bg-sky-50 font-medium px-2 py-0.5 rounded-md">
                                {appt.specialization}
                              </span>
                            )}
                            {appt.department_name && (
                              <span className="text-slate-500 bg-slate-100 font-medium px-2 py-0.5 rounded-md">
                                {appt.department_name}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-600'
                              : isConfirmed
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-50">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-sky-500" />
                          {appt.appointment_date?.split('T')[0]}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          {formatTime(appt.appointment_time?.slice(0, 5))}
                        </span>
                        {appt.consultation_fee && (
                          <span className="text-slate-400">
                            Fee: ₹{appt.consultation_fee}
                          </span>
                        )}
                      </div>

                      {appt.reason && (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-lg">
                          "{appt.reason}"
                        </p>
                      )}

                      {!isCancelled && appt.status === 'pending' && (
                        <div className="pt-1 flex justify-end">
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  You have no scheduled appointments yet
                </p>
                <button
                  onClick={() => navigate('/appointments')}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                >
                  Book your first appointment →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Feature highlights ── */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">
            Why Book with CareWell
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3 hover:border-sky-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TempDashboard;
