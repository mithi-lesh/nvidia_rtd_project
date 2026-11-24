/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveView } from '../types';

interface HeaderProps {
  onViewChange: (view: ActiveView) => void;
  activeView: ActiveView;
  onTriggerEmergency: () => void;
  isEmergencyActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onViewChange,
  activeView,
  onTriggerEmergency,
  isEmergencyActive,
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 text-slate-100">
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6 font-sans">
          <button
            onClick={() => onViewChange('documents')}
            id="hdr-protocols"
            className={`text-sm transition-colors pb-1 ${
              activeView === 'documents'
                ? 'font-bold text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Safety Protocols
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Help & notifications segment */}
        <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4">
        </div>

        {/* SOS Emergency warning action */}
        <button
          onClick={onTriggerEmergency}
          id="btn-emergency-trigger"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all active:scale-95 shadow-sm ${
            isEmergencyActive
              ? 'bg-[#1b1b1d] text-white animate-pulse border border-safety-orange'
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">warning</span>
          {isEmergencyActive ? 'ACTIVE PROTOCOL' : 'Emergency Alert'}
        </button>

        {/* Avatar badge */}
        <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-800">
          <img
            alt="Administrator Headshot"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApYRdf_RUhfOilkB8ZAXpf3wthJHOavpvn7O0GxGDlxp8kAKi9Mh0l9BBxBTAENqzy6hc1-NJe0ElhO8J7YR05HQd_CVayH8NZ_xPZwj-D8EDz5a7dXNLEyglfoQ_U7iOwP8U1kb_N7jpoCNclzm68ERfoPlTBuVJqJkD9eHm1QksgDFJhrZ0FWxUEZgCDU168spSW4bvEly8werlQ3NgGlFo0yfzkO09aaOutOORvr2a8WU4AN1IJFNotx0DFqsgNge0DD5Nmlqnd"
          />
        </div>
      </div>
    </header>
  );
};
