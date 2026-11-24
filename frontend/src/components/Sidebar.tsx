/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onNewInquiry: () => void;
  username?: string | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onNewInquiry,
  username,
  onLogout,
}) => {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800/80 bg-slate-950 py-6 text-slate-400 shrink-0">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col gap-1 px-6 font-sans">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-blue-500 fill"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            security
          </span>
          <span className="font-headline-md text-headline-md font-bold text-slate-100 tracking-tight">
            MineSecure AI
          </span>
        </div>
        <span className="mt-2 font-label-sm text-[10px] text-slate-500 uppercase tracking-widest">
          Operational Admin
        </span>
      </div>

      {/* CTA Button */}
      <div className="mb-6 px-4">
        <button
          onClick={onNewInquiry}
          id="btn-new-inquiry"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-semibold text-white transition-all active:scale-98 shadow-md"
        >
          <span className="material-symbols-outlined text-base" style={{ fontSize: '18px' }}>
            add
          </span>
          New Safety Inquiry
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onViewChange('chat')}
          id="nav-chat"
          className={`flex w-full items-center gap-3 px-4 py-3 transition-colors text-sm font-medium ${
            activeView === 'chat'
              ? 'border-l-4 border-blue-500 bg-slate-900 text-blue-400 font-semibold'
              : 'border-l-4 border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
          }`}
        >
          <span className="material-symbols-outlined">chat_spark</span>
          <span>Safety Chat</span>
        </button>

        <button
          onClick={() => onViewChange('documents')}
          id="nav-docs"
          className={`flex w-full items-center gap-3 px-4 py-3 transition-all text-sm font-medium ${
            activeView === 'documents'
              ? 'border-l-4 border-blue-500 bg-slate-900 text-blue-400 font-semibold'
              : 'border-l-4 border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
          }`}
        >
          <span className="material-symbols-outlined">folder_open</span>
          <span>Documents</span>
        </button>
      </nav>

      {/* User Avatar footer */}
      <div className="flex flex-col gap-3 border-t border-slate-800/80 px-6 pt-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-700 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col font-sans">
            <span className="text-xs text-slate-200 font-semibold">{username || 'System User'}</span>
            <span className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-widest mt-0.5">Online</span>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="text-xs text-slate-400 hover:text-slate-200 text-left w-max transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};
