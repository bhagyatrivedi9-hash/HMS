import React from 'react';

export default function AuthBanner({ subtitle = "Specialist & Clinical Portal" }) {
  return (
    <div className="hidden lg:flex lg:w-[46%] relative bg-gradient-to-br from-sky-900 via-sky-800 to-sky-950 flex-col justify-between p-10 xl:p-12 overflow-hidden text-white">
      {/* Background Soft Overlay Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />

      {/* Decorative Light Cyan Glow orbs */}
      <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

      {/* Top Floating Telemetry Status Pill */}
      <div className="relative z-10 self-end">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-xs font-medium text-sky-100">
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30 animate-pulse" />
          <span className="font-semibold text-emerald-300">Triage System:</span>
          <span>Level 1 Optimal Response</span>
        </div>
      </div>

      {/* Center Branding & Info */}
      <div className="relative z-10 my-auto max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-semibold tracking-wide uppercase mb-4 border border-sky-400/30">
          <svg className="w-3.5 h-3.5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {subtitle}
        </div>

        <h2 className="text-3xl xl:text-4xl font-bold font-heading tracking-tight text-white leading-tight">
          Next-generation care, <br />
          <span className="text-sky-300">powered by unified intelligence.</span>
        </h2>
        <p className="mt-3 text-sm xl:text-base text-sky-100/90 leading-relaxed">
          CareWell Health System centralizes electronic health records, diagnostic scheduling, and collaborative inpatient management under HIPAA-compliant security.
        </p>
      </div>

      {/* Lower Glassmorphic Telemetry Cards */}
      <div className="relative z-10 space-y-3.5 max-w-md mt-6">
        {/* Card 1: Live Staffing */}
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg flex items-center justify-between transition-all hover:bg-white/15 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-400/20 flex items-center justify-center text-sky-300 border border-sky-300/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-sky-200/80 font-semibold">Active On-Duty Staff</p>
              <h4 className="text-sm font-bold text-white">140+ Specialists across 28 Units</h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
            Live
          </span>
        </div>

        {/* Card 2: EHR Synchronization */}
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg flex items-center gap-3 transition-all hover:bg-white/15 duration-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-300 border border-emerald-300/30">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-sky-200/80 font-semibold">Electronic Health Records</p>
              <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 99.98% Synced
              </span>
            </div>
            <p className="text-xs text-sky-100/80 mt-0.5">Real-time telemetry, lab panels & telehealth synchronized.</p>
          </div>
        </div>

        {/* Quote */}
        <div className="p-3.5 rounded-xl bg-sky-950/60 backdrop-blur-md border border-white/10">
          <p className="text-xs italic text-sky-200 leading-relaxed">
            “Delivering compassionate, technology-driven patient care around the clock.”
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-white">Dr. Aaron Vance, MD</span>
            <span className="text-sky-300">Chief Medical Officer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
