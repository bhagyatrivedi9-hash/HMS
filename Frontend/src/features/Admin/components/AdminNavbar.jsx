import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LogOut,
  RefreshCw,
  User,
  Shield,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../auth/hook/useAuth';

export default function AdminNavbar({ onRefresh, isRefreshing }) {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const handleSignOut = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-sky-100/80 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Portal Tag */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Shield className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                  CareWell
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200/60">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hospital Operations & System Governance
              </p>
            </div>
          </div>

          {/* Right actions: Refresh, User Pill, Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Refresh statistics"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 border border-slate-200/70 hover:border-sky-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`}
                />
                <span className="hidden md:inline">Refresh</span>
              </button>
            )}

            {/* Admin User Info Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-sky-50/70 border border-sky-100 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 text-sky-700 flex items-center justify-center font-semibold text-xs shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-sky-600 font-medium">
                  Super Admin
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-100 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
