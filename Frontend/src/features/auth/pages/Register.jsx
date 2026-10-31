import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

export default function Register({ onNavigateToLogin }) {
  const navigate = useNavigate();
  const { handleRegister, loading, error, successMessage, handleClearMessages } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    handleClearMessages();

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const res = await handleRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (res.success) {
       setTimeout(() => {
    navigate('/');
  }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-sky-50/50 flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/20 mb-3">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          CareWell
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Multispecialist Hospital • Patient Registration
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-sky-100 shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Create Patient Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register to book appointments and view your medical records.
          </p>
        </div>

        {/* Error notification */}
        {(localError || error) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{localError || error}</span>
          </div>
        )}

        {/* Success notification */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage} Redirecting to login...</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full h-11 pl-10 pr-3.5 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-100 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-email">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@gmail.com"
                required
                className="w-full h-11 pl-10 pr-3.5 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-100 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-password">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full h-11 pl-10 pr-10 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="confirm-pass">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input
                id="confirm-pass"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full h-11 pl-10 pr-3.5 bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-100 transition-all"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            {onNavigateToLogin ? (
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <Link
                to="/login"
                className="font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                Sign In
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
