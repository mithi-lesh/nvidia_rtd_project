/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveView } from '../types';

interface LandingPageProps {
  onLogin: (initialView: ActiveView, username?: string) => void;
  onTriggerEmergency: () => void;
  isEmergencyActive: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onTriggerEmergency,
  isEmergencyActive,
}) => {
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = showAuthModal === 'login' ? '/api/auth/login/' : '/api/auth/register/';
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        onLogin('chat', data.username);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Navbar header */}
      <header className="bg-slate-950/70 border-b border-slate-800/80 w-full px-6 md:px-8 h-16 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined fill text-blue-500" style={{ fontSize: '32px' }}>
            engineering
          </span>
          <span className="font-sans text-xl font-bold text-slate-100 tracking-tight">
            MineSecure AI
          </span>
        </div>
        
        <nav className="hidden md:flex gap-8">
          <a
            href="#capabilities"
            className="text-slate-400 hover:text-slate-200 transition-colors font-semibold text-sm"
          >
            Features
          </a>
          <a
            href="#benefits"
            className="text-slate-400 hover:text-slate-200 transition-colors font-semibold text-sm"
          >
            Benefits
          </a>
          <a
            href="#compliance"
            className="text-slate-400 hover:text-slate-200 transition-colors font-semibold text-sm"
          >
            Compliance
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAuthModal('login')}
            id="btn-login-main"
            className="flex items-center justify-center px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded transition-all active:scale-95 cursor-pointer"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center w-full">
        
        {/* Hero Section */}
        <section className="w-full bg-[#030712] relative border-b border-slate-800/80 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
          
          {/* Subtle design schematics background overlay */}
          <div
            className="absolute right-0 top-0 w-1/2 h-full opacity-5 bg-center bg-cover bg-no-repeat z-0 pointer-events-none hidden lg:block"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuagB1mTEZNPHH6MNgbgXkOJ9z-g_3dxBHA-1q3TMgYe-_VONb7ecJhq4WCuV8ctB361cYNvhPO39YZ_N9X3GInp-VNe85M2iyJ_s6s_9yj3dBD_jp2cH_rX6-QTYdUdWO04MhBZhRmNNAFPlqv9pu6Nh76Tim1jUJt3KdYT164s37frIQAaUgWmWD5958_NgHqTsogximLHzQGmtQBdtJzUpwQ-v7fR7NkQzxlUR_JjZF2mwGlInMRPUAHMe_wtbdAVBktEyF4CYW')",
            }}
          ></div>
          
          <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-20 md:py-28 relative z-10">
            <div className="max-w-3xl flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800 font-semibold text-xs text-slate-350 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                  System Operational &amp; Secure
                </span>
              </div>
              
              <h1 className="font-sans text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight leading-none md:max-w-xl">
                Mine Safety Assistant
              </h1>
              
              <p className="font-sans text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
                AI-Powered Safety Knowledge Assistant for Mining Operations. Access approved SOPs, retrieve instant citations, and maintain emergency readiness with precision engineered for high-stakes environments.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <button
                  onClick={() => setShowAuthModal('register')}
                  id="btn-get-started"
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Get Started</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button
                  onClick={() => setShowAuthModal('login')}
                  id="btn-view-docs"
                  className="px-8 py-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>View Documentation</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Capabilities Section */}
        <section id="capabilities" className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20">
          <div className="mb-12">
            <h2 className="font-sans text-3xl font-extrabold text-slate-100 mb-3 tracking-tight">Core Capabilities</h2>
            <p className="font-sans text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
              Engineered for cognitive ease under pressure. Information retrieval designed for the reality of industrial operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
            
            {/* Feature 1: RAG & Citations (Large Card) */}
            <div
              onClick={() => onLogin('chat')}
              id="bento-rag"
              className="col-span-1 md:col-span-8 bg-slate-900/65 border border-slate-800 rounded-xl p-8 flex flex-col hover:border-slate-700 transition-all duration-300 relative overflow-hidden group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <span className="font-sans text-xl font-bold text-slate-100 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-2xl">search_insights</span>
                  RAG Search &amp; Citations
                </span>
                <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open Interactive Chat <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
              <p className="font-sans text-sm text-slate-400 mb-6 max-w-xl leading-relaxed">
                Instantly query thousands of approved safety manuals. Every AI response includes direct, verifiable citations to the source document, ensuring absolute compliance and trust.
              </p>
              
              {/* Mock Chat View */}
              <div className="mt-auto bg-[#050b1a] rounded-lg border border-slate-800/80 p-4 z-10 w-full max-w-md self-end transform transition-transform group-hover:-translate-y-2 duration-300 shadow-xl">
                <div className="flex gap-2.5 mb-3">
                  <span className="material-symbols-outlined text-slate-500 mt-1">account_circle</span>
                  <div className="bg-slate-900 border border-blue-900/60 rounded-xl p-3 text-xs font-medium text-slate-200">
                    What is the protocol for secondary ventilation failure in Zone B?
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <span className="material-symbols-outlined fill text-blue-500 mt-1">robot_2</span>
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 text-xs text-slate-350 flex-1">
                    In the event of secondary ventilation failure in Zone B, immediately halt all drilling operations and evacuate personnel to Refuge Chamber 4.
                    <div className="mt-2.5 flex">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-blue-405 rounded-full text-[10px] font-bold border border-slate-800">
                        <span className="material-symbols-outlined text-[11px]" style={{ fontSize: '11px' }}>
                          description
                        </span>
                        SOP-Vent-04, pg. 12
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Emergency Readiness */}
            <div
              className="col-span-1 md:col-span-4 bg-[#0a101f] border border-slate-850 rounded-xl p-8 flex flex-col text-white shadow-xl relative overflow-hidden group hover:border-slate-750 transition-colors"
              id="bento-emergency"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500 opacity-5 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <span className="font-sans text-xl font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-orange-500">warning</span>
                  Emergency Readiness
                </span>
              </div>
              <p className="font-sans text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                Bypass standard search during critical incidents. Access high-priority emergency checklists instantly with zero latency.
              </p>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerEmergency();
                }}
                id="btn-emergency-trigger-landing"
                className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                  isEmergencyActive
                    ? 'bg-slate-900 text-orange-500 border border-orange-500 animate-pulse'
                    : 'bg-orange-600 hover:bg-orange-500 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">notifications_active</span>
                {isEmergencyActive ? 'DISMISS PROTOCOL' : 'Trigger Protocol'}
              </button>
            </div>

            {/* Feature 3: Approved Manuals */}
            <div
              onClick={() => onLogin('documents')}
              id="bento-manuals"
              className="col-span-1 md:col-span-6 bg-slate-900/65 border border-slate-800 rounded-xl p-8 flex flex-col hover:border-slate-700 transition-all duration-300 group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <span className="font-sans text-xl font-bold text-slate-100 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400">verified</span>
                  Approved Safety Manuals
                </span>
                <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Manage Manuals <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
              <p className="font-sans text-sm text-slate-400 mb-6 leading-relaxed">
                A centralized, immutable repository of all active Standard Operating Procedures. Version control guarantees you are always viewing the latest compliance requirements.
              </p>
              
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-slate-950/60 transition-all hover:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">folder</span>
                    <span className="font-bold text-xs text-slate-200">Heavy Machinery Ops 2024</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-blue-500 fill">check_circle</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-800 rounded-lg bg-slate-950/60 transition-all hover:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">folder</span>
                    <span className="font-bold text-xs text-slate-200">Shaft Maintenance V2</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-blue-500 fill">check_circle</span>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full bg-[#050b1a] border-t border-slate-800/80 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800/70">
              <div className="px-6 py-4 flex flex-col items-center text-center">
                <span className="material-symbols-outlined fill text-blue-500 text-4xl mb-4">gavel</span>
                <h3 className="font-sans text-lg font-bold text-slate-100 mb-2">Safety Compliance</h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed">100% adherence to regulatory standards with fully auditable query logs.</p>
              </div>
              <div className="px-6 py-4 flex flex-col items-center text-center">
                <span className="material-symbols-outlined fill text-blue-500 text-4xl mb-4">bolt</span>
                <h3 className="font-sans text-lg font-bold text-slate-100 mb-2">Instant SOP Access</h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed">Reduce information retrieval time from hours to seconds during critical operations.</p>
              </div>
              <div className="px-6 py-4 flex flex-col items-center text-center">
                <span className="material-symbols-outlined fill text-blue-500 text-4xl mb-4">trending_down</span>
                <h3 className="font-sans text-lg font-bold text-slate-100 mb-2">Reduced Incidents</h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed">Empower frontline teams with immediate knowledge, lowering the probability of operational errors.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="compliance" className="bg-slate-950 border-t border-slate-800/80 w-full py-8 mt-auto text-slate-400">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-7xl mx-auto gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined fill text-blue-500" style={{ fontSize: '20px' }}>
              engineering
            </span>
            <span className="font-bold text-slate-200">MineSecure AI</span>
          </div>
          
          <div className="flex gap-6">
            <a className="text-slate-400 hover:text-blue-400 transition-colors font-medium hover:underline" href="#privacy">
              Privacy Policy
            </a>
            <a className="text-slate-400 hover:text-blue-400 transition-colors font-medium hover:underline" href="#terms">
              Terms of Service
            </a>
            <a className="text-slate-400 hover:text-blue-400 transition-colors font-medium hover:underline" href="#security">
              Security Audit
            </a>
          </div>
          
          <div className="text-slate-500 font-medium">
            &copy; 2026 Industrial Safety Systems. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              {showAuthModal === 'login' ? 'Log In' : 'Create Account'}
            </h2>
            
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded mt-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processing...' : (showAuthModal === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
            
            <div className="mt-4 text-center text-sm text-slate-400">
              {showAuthModal === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => { setShowAuthModal('register'); setError(''); }} className="text-blue-400 hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => { setShowAuthModal('login'); setError(''); }} className="text-blue-400 hover:underline">
                    Log in
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowAuthModal(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
