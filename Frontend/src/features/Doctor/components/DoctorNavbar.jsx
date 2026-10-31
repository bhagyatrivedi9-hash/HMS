import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  LogOut,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth';

export default function DoctorNavbar({ profile }) {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  const displayName = profile?.name || user?.name || 'Doctor';
  const specialization = profile?.specialization || 'Specialist';
  const department = profile?.department || 'General Medicine';
  const qualification = profile?.qualification || 'MBBS, MD';

  return (
    <header className="w-full bg-white border-b border-sky-100 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Hospital Subtitle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white flex items-center justify-center shadow-sm shadow-sky-600/20">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">CareWell</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
                  Doctor Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Multispecialist Hospital &bull; Central Clinical Wing
              </p>
            </div>
          </div>

          {/* Department Tag */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              {department}
            </span>
          </div>
        </div>

        {/* Doctor Identity & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 pl-2 sm:pl-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 border-2 border-sky-300 text-sky-800 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Profile info */}
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  Dr. {displayName.replace(/^dr\.?\s+/i, '')}
                </span>
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" title="Verified Practitioner" />
              </div>
              <p className="text-xs text-slate-500">
                {specialization} &bull; {qualification}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/80 transition-colors ml-1"
            title="Log Out of Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
