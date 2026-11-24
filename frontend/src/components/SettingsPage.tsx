/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const SettingsPage: React.FC = () => {
  const [siteName, setSiteName] = useState('Zone B - West Shaft Complex');
  const [targetCompliance, setTargetCompliance] = useState('99.8');
  const [primaryModel, setPrimaryModel] = useState('gemini-2.5-flash');
  const [webhookUrl, setWebhookUrl] = useState('https://insights.minesecure.internal/v1/broadcast');
  const [strictCitation, setStrictCitation] = useState(true);
  const [voiceBroadcast, setVoiceBroadcast] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('safety-officer@minesecure.internal');
  
  // Save Feedback state
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className="flex-grow p-6 md:p-8 max-w-[1000px] mx-auto w-full animate-fade-in text-slate-100 flex flex-col gap-6">
      
      {/* Header section */}
      <div className="mb-2 font-sans">
        <h2 className="text-2xl md:text-3.5xl font-black text-slate-100 tracking-tight leading-none">
          Admin Configurations
        </h2>
        <p className="text-sm text-slate-400 mt-2 font-medium">
          Manage system rules, model choices, and field compliance parameters.
        </p>
      </div>

      {/* Settings Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 md:p-8 font-sans">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* Section 1: Site Metadata */}
          <div>
            <h3 className="text-base font-bold text-slate-150 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-blue-500">domain</span>
              Site Operational Metadata
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Active Site Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-100 placeholder-slate-600"
                  placeholder="e.g. Zone B Complex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Target Compliance Threshold (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={targetCompliance}
                  onChange={(e) => setTargetCompliance(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-100 placeholder-slate-600 font-mono"
                  placeholder="e.g. 99.8"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section 2: AI Knowledge Model Selection */}
          <div>
            <h3 className="text-base font-bold text-slate-150 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-blue-500">smart_toy</span>
              Safety AI Engine Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Intelligence Base Model
                </label>
                <select
                  value={primaryModel}
                  onChange={(e) => setPrimaryModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 rounded-lg text-sm text-slate-200 font-semibold"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash - Operational (Default)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro - Heavy Engineering &amp; Audit</option>
                  <option value="gemini-2.5-flash-grounded">Gemini 2.5 Flash - Web Grounded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Compliance Officer Alert Email
                </label>
                <input
                  type="email"
                  required
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-100 placeholder-slate-600"
                  placeholder="safety@minesecure.internal"
                />
              </div>
            </div>

            {/* Citation Strategy Toggles */}
            <div className="mt-4 space-y-3 bg-slate-950/65 border border-slate-800 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Enforce Strict Reference Filter Mode
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                    Strict mode blocks responses that fail to link directly to a specific uploaded manual or standard operating procedure.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStrictCitation(!strictCitation)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0 outline-none cursor-pointer ${
                    strictCitation ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                      strictCitation ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 border-t border-slate-800/80 pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Emergency Local Broadcast Audio Synthesizer
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                    Automatically convert any critical emergency incident checklists into speech broadcasts over facility PA nodes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceBroadcast(!voiceBroadcast)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0 outline-none cursor-pointer ${
                    voiceBroadcast ? 'bg-blue-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                      voiceBroadcast ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section 3: Webhook Integrations */}
          <div>
            <h3 className="text-base font-bold text-slate-150 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-blue-500">hub</span>
              External Compliance Webhooks
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Live Incident Dispatch HTTP Webhook Receiver URL
              </label>
              <input
                type="url"
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-100 placeholder-slate-600 font-mono"
                placeholder="https://your-domain.com/webhooks"
              />
              <span className="text-[10px] text-slate-500 mt-2.5 block leading-relaxed font-semibold">
                *Whenever an SOS emergency event triggers, a highly detailed diagnostic payload containing real-time safety manual instructions will be pushed onto this destination immediately.
              </span>
            </div>
          </div>

          {/* Action Form Footer */}
          <div className="flex items-center gap-4 justify-end border-t border-slate-800 pt-6 mt-4">
            {isSaved && (
              <span className="text-xs text-emerald-450 font-extrabold flex items-center gap-1.5 animate-fade-in animate-pulse">
                <span className="material-symbols-outlined text-[16px] fill text-emerald-505">check_circle</span>
                Compliance Parameters Saved Successfully!
              </span>
            )}
            
            <button
              type="submit"
              id="btn-settings-save"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase rounded-lg transition-all active:scale-97 cursor-pointer shadow-sm"
            >
              Save Configuration
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};
