import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppointment } from '../hook/useAppointment';
import { useAuth } from '../../auth/hook/useAuth';
import {
  Stethoscope,
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCircle2,
  Award,
  IndianRupee,
  CalendarCheck,
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

/* ── Get today's date as YYYY-MM-DD ── */
function todayStr() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/* ── Format "09:00" → "9:00 AM" ── */
function formatTime(slot) {
  if (!slot) return '';
  const [h, m] = slot.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

/* ── Info row for summary/success screen ── */
function InfoRow(props) {
  const Icon = props.icon;
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-sky-500" />
      </div>
      <div className="flex-1 flex items-center justify-between gap-2">
        <span className="text-sm text-slate-400">{props.label}</span>
        <span className="text-sm font-medium text-slate-700">{props.value}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOKING PAGE
══════════════════════════════════════════════════════════════ */
export default function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    selectedDoctor,
    selectedDepartment,
    availableSlots,
    loading,
    error,
    handleFetchDoctorById,
    handleFetchSlots,
    handleSelectDate,
    handleSelectSlot,
    handleBookAppointment,
    selectedDate,
    selectedSlot,
  } = useAppointment();

  const [reason, setReason] = useState('');
  const [slotsMessage, setSlotsMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState(null);

  /* Redirect if not authenticated */
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  /* Re-hydrate doctor details if page accessed directly or refreshed */
  useEffect(() => {
    if (doctorId && (!selectedDoctor || String(selectedDoctor.doctor_id || selectedDoctor.id) !== String(doctorId))) {
      handleFetchDoctorById(doctorId);
    }
  }, [doctorId]);

  async function onDateChange(e) {
    const date = e.target.value;
    handleSelectDate(date);
    setSlotsMessage('');
    if (date && doctorId) {
      const result = await handleFetchSlots(doctorId, date);
      if (result.message) setSlotsMessage(result.message);
    }
  }

  async function onConfirm() {
    if (!selectedSlot || !selectedDate) return;
    const result = await handleBookAppointment({
      doctor_id: Number(doctorId),
      appointment_date: selectedDate,
      appointment_time: selectedSlot,
      reason: reason.trim() || undefined,
    });
    if (result.success) {
      setConfirmedAppt(result.appointment);
      setBookingSuccess(true);
    }
  }

  /* ── Success screen ── */
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-10 max-w-md w-full text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-sky-500" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">
              Appointment Confirmed!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your appointment has been successfully scheduled. We look forward to seeing you.
            </p>
          </div>

          {/* Details */}
          {confirmedAppt && (
            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3">
              {selectedDoctor && (
                <InfoRow
                  icon={Stethoscope}
                  label="Doctor"
                  value={`Dr. ${selectedDoctor.doctor_name || selectedDoctor.name}`}
                />
              )}
              <InfoRow
                icon={Calendar}
                label="Date"
                value={
                  confirmedAppt.appointment_date?.split('T')[0] || selectedDate
                }
              />
              <InfoRow
                icon={Clock}
                label="Time"
                value={formatTime(
                  confirmedAppt.appointment_time?.slice(0, 5) || selectedSlot
                )}
              />
              {confirmedAppt.status && (
                <InfoRow
                  icon={CheckCircle2}
                  label="Status"
                  value={
                    <span className="capitalize text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-full text-xs">
                      {confirmedAppt.status}
                    </span>
                  }
                />
              )}
              {reason && <InfoRow icon={FileText} label="Reason" value={reason} />}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              id="book-another"
              onClick={() => navigate('/appointments')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
            >
              Book Another Appointment
            </button>
            <button
              id="go-home"
              onClick={() => navigate('/')}
              className="w-full text-slate-500 hover:text-slate-700 font-medium py-2.5 px-6 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main booking form ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top nav bar ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* ── Step progress ── */}
        <div className="flex items-center gap-3 max-w-sm">
          <StepBadge step={1} label="Department" done />
          <div className="flex-1 h-px bg-sky-200" />
          <StepBadge step={2} label="Doctor" done />
          <div className="flex-1 h-px bg-sky-200" />
          <StepBadge step={3} label="Slot" active />
        </div>

        {/* ── Back button ── */}
        <button
          id="back-to-doctors"
          onClick={() => {
            if (selectedDepartment?.id) {
              navigate(`/appointments/departments/${selectedDepartment.id}/doctors`);
            } else {
              navigate(-1);
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Doctors
        </button>

        {/* ── Doctor summary card ── */}
        {selectedDoctor && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center flex-shrink-0">
              <UserCircle2 className="w-10 h-10 text-sky-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-800 text-lg">
                  Dr. {selectedDoctor.doctor_name || selectedDoctor.name}
                </h3>
                <span className="inline-block text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  {selectedDoctor.specialization}
                </span>
                {selectedDoctor.department_name && (
                  <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {selectedDoctor.department_name}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 mt-2.5">
                {selectedDoctor.qualification && (
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-sky-400" />
                    {selectedDoctor.qualification}
                  </span>
                )}
                {selectedDoctor.experience_years != null && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-400" />
                    {selectedDoctor.experience_years} yrs exp.
                  </span>
                )}
                {selectedDoctor.consultation_fee != null && (
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <IndianRupee className="w-4 h-4 text-sky-500" />
                    ₹{selectedDoctor.consultation_fee} consultation fee
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* ── Booking form card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">

          {/* Date picker section */}
          <div className="p-6 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Calendar className="w-4 h-4 text-sky-500" />
              1. Select Appointment Date
            </label>
            <p className="text-xs text-slate-400">
              Choose the day you would like to visit
            </p>
            <input
              id="appointment-date"
              type="date"
              min={todayStr()}
              value={selectedDate}
              onChange={onDateChange}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Time slots section */}
          <div className="p-6 space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock className="w-4 h-4 text-sky-500" />
              2. Available Time Slots
            </label>

            {/* Loading slots */}
            {loading && selectedDate && (
              <div className="flex items-center gap-2 text-sky-500 text-sm bg-sky-50 px-4 py-3 rounded-xl">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking doctor availability…
              </div>
            )}

            {/* No date selected */}
            {!selectedDate && (
              <p className="text-slate-400 text-sm bg-slate-50 rounded-xl px-4 py-3">
                Select a date above to view available time slots
              </p>
            )}

            {/* No slots message */}
            {selectedDate && !loading && slotsMessage && availableSlots.length === 0 && (
              <p className="text-slate-500 text-sm bg-amber-50 border border-amber-100 text-amber-700 rounded-xl px-4 py-3">
                {slotsMessage}
              </p>
            )}

            {/* Slot grid */}
            {selectedDate && !loading && availableSlots.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Select a slot for your 15-minute consultation:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      id={`slot-${slot.replace(':', '')}`}
                      onClick={() => handleSelectSlot(slot)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                        selectedSlot === slot
                          ? 'bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reason section */}
          <div className="p-6 space-y-3">
            <label
              htmlFor="appointment-reason"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <FileText className="w-4 h-4 text-sky-500" />
              3. Reason for Consultation
              <span className="text-xs text-slate-400 font-normal ml-1">
                (optional)
              </span>
            </label>
            <textarea
              id="appointment-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe symptoms, medical history, or specific questions for the doctor…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none placeholder-slate-300 shadow-sm"
            />
          </div>

          {/* Summary + Confirm */}
          <div className="p-6 bg-slate-50 rounded-b-2xl space-y-4">
            {/* Booking preview summary */}
            {selectedDate && selectedSlot && (
              <div className="bg-white border border-sky-100 rounded-xl p-4 text-sm space-y-2 shadow-xs">
                <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Appointment Summary
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Date</span>
                  <span className="font-medium text-slate-800">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                      'en-IN',
                      {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Time Slot</span>
                  <span className="font-medium text-sky-600">
                    {formatTime(selectedSlot)}
                  </span>
                </div>
                {selectedDoctor?.consultation_fee != null && (
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                    <span className="text-slate-400">Consultation Fee</span>
                    <span className="font-bold text-slate-800">
                      ₹{selectedDoctor.consultation_fee}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Confirm button */}
            <button
              id="confirm-booking"
              onClick={onConfirm}
              disabled={!selectedSlot || !selectedDate || loading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedSlot && selectedDate && !loading
                  ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking Appointment…
                </>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  Confirm and Book Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
