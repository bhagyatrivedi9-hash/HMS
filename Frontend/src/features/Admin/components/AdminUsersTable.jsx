import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Stethoscope,
  Shield,
  User,
  Power,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import AdminStatusModal from './AdminStatusModal';

export default function AdminUsersTable({
  users,
  filteredUsers,
  roleFilter,
  statusFilter,
  searchQuery,
  loading,
  actionLoadingId,
  onRoleChange,
  onStatusChange,
  onSearchChange,
  onToggleStatus,
}) {
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);

  // Tab definitions
  const tabs = [
    { id: 'all', label: 'All Users', count: users.length },
    {
      id: 'doctor',
      label: 'Doctors',
      count: users.filter((u) => u.role === 'doctor').length,
    },
    {
      id: 'staff',
      label: 'Staff',
      count: users.filter((u) => u.role === 'staff').length,
    },
    {
      id: 'patient',
      label: 'Patients',
      count: users.filter((u) => u.role === 'patient').length,
    },
  ];

  const handleOpenStatusModal = (user) => {
    setSelectedUserForModal(user);
  };

  const handleConfirmStatus = async (id, currentStatus) => {
    const res = await onToggleStatus(id, currentStatus);
    if (res?.success) {
      setSelectedUserForModal(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <Stethoscope className="w-3 h-3 text-sky-600" />
            Doctor
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Shield className="w-3 h-3 text-indigo-600" />
            Staff
          </span>
        );
      case 'patient':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200/60">
            <User className="w-3 h-3 text-slate-500" />
            Patient
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {role}
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100/80 shadow-xs overflow-hidden">
      {/* ── Table Top Bar & Filters ── */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900">
              User Directory & Account Controls
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage permissions, roles, and active standing for hospital personnel & patients
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="font-semibold text-slate-700">{filteredUsers.length}</span> of {users.length} users
          </div>
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onRoleChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs shadow-sky-600/20'
                    : 'bg-slate-50 hover:bg-sky-50/70 text-slate-600 hover:text-sky-700 border border-transparent hover:border-sky-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filter controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          {/* Search Box */}
          <div className="relative w-full sm:flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-1/2 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full h-10 pl-10 pr-3.5 bg-slate-50/80 hover:bg-slate-50 text-slate-800 placeholder:text-slate-400 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-3 focus:ring-sky-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full sm:w-auto h-10 px-3 bg-slate-50 hover:bg-slate-50/90 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-sky-50/40 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3.5 px-5">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4">Member Since</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Loading Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3.5 bg-slate-100 rounded" />
                        <div className="w-40 h-2.5 bg-slate-50 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-5 bg-slate-100 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-5 bg-slate-100 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-3 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="w-20 h-7 bg-slate-100 rounded-xl ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 flex items-center justify-center mx-auto mb-3">
                      <UserX className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">
                      No users found
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      No matching records found for the applied search query or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isActive = u.is_active !== false;
                const isActionLoading = actionLoadingId === u.id;

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-sky-50/30 transition-colors group"
                  >
                    {/* User info & avatar */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-100 to-sky-50 text-sky-700 border border-sky-200/50 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Deactivated
                        </span>
                      )}
                    </td>

                    {/* Registration date */}
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(u.created_at)}</span>
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(u)}
                        disabled={isActionLoading}
                        title={
                          isActive
                            ? 'Click to deactivate user'
                            : 'Click to activate user'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'text-rose-600 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/50'
                            : 'text-emerald-700 hover:text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/50'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>
                          {isActionLoading
                            ? 'Updating...'
                            : isActive
                            ? 'Deactivate'
                            : 'Activate'}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <AdminStatusModal
        user={selectedUserForModal}
        isOpen={Boolean(selectedUserForModal)}
        onClose={() => setSelectedUserForModal(null)}
        onConfirm={handleConfirmStatus}
        loading={actionLoadingId === selectedUserForModal?.id}
      />
    </div>
  );
}
