/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveView, Message, SafetyDocument } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SafetyChat } from './components/SafetyChat';
import { DocumentManagement } from './components/DocumentManagement';


export default function App() {
  // Session & Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_username') !== null;
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('auth_username');
  });
  const [activeView, setActiveView] = useState<ActiveView>(
    localStorage.getItem('auth_username') ? 'chat' : 'landing'
  );
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Pre-seed Initial Chat history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'new-start-1',
      role: 'assistant',
      content: 'System initialized. What safety protocols or SOP manuals can I verify for you today?',
      timestamp: 'Just now',
    },
  ]);

  // Pre-seed Core Safety Documents list
  const [documents, setDocuments] = useState<SafetyDocument[]>([]);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/documents/')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDocuments(data);
        }
      })
      .catch((err) => console.error('Failed to fetch documents:', err));
  }, []);

  // User Logs In & Transfers  // Event Handlers
  const handleLogin = (initialView: ActiveView, newUsername?: string) => {
    if (newUsername) {
      localStorage.setItem('auth_username', newUsername);
      setUsername(newUsername);
    }
    setIsAuthenticated(true);
    setActiveView(initialView);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('landing');
  };

  // Quick Action triggered in Sidebar
  const handleNewInquiry = () => {
    setIsAuthenticated(true);
    setActiveView('chat');
    // Clear out except the starting preseed to simulate clean state
    setMessages([
      {
        id: 'new-start-1',
        role: 'assistant',
        content: 'System initialized. What safety protocols or SOP manuals can I verify for you today?',
        timestamp: 'Just now',
      },
    ]);
  };

  // SOS Warning trigger toggle
  const handleTriggerEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
  };

  // Safe Document mutations
  const handleAddDocument = async (formData: FormData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/documents/', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const newDoc = await response.json();
        setDocuments((prev) => [newDoc, ...prev]);
      } else {
        console.error('Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/documents/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleReindexDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Processing' } : d))
    );
    // Automatically finish re-index operation in 2 seconds
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'Indexed' } : d))
      );
    }, 2000);
  };

  const handleReindexAll = () => {
    setDocuments((prev) => prev.map((d) => ({ ...d, status: 'Processing' })));
    setTimeout(() => {
      setDocuments((prev) => prev.map((d) => ({ ...d, status: 'Indexed' })));
    }, 2500);
  };

  // Submit dynamic prompt to backend server proxy
  const handleSendMessage = async (text: string) => {
    // Append User prompt bubbles
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error('API server pipeline returned non-200 state');
      }

      const data = await response.json();
      const sourcesArray = data.sources || [];
      const formattedSources = sourcesArray.map((s: any) => 
        typeof s === 'string' ? { title: s, icon: 'description' } : s
      );

      const assistMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.answer || data.content || 'No response',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: formattedSources,
      };

      setMessages((prev) => [...prev, assistMsg]);
    } catch (err: any) {
      console.error('Error querying backend:', err);
      // Construct fallback error warning message
      const errorMsg: Message = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: 'System error: Unable to dispatch cognitive query to Gemini pipeline. Please verify server endpoints or fallback node configurations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Conditionally render layout trees
  if (!isAuthenticated && activeView === 'landing') {
    return (
      <LandingPage
        onLogin={handleLogin}
        onTriggerEmergency={handleTriggerEmergency}
        isEmergencyActive={isEmergencyActive}
      />
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex font-sans overflow-hidden">
      
      {/* 256px wide fixed administrative sidebar panel */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onNewInquiry={handleNewInquiry}
        username={username}
        onLogout={() => {
          localStorage.removeItem('auth_username');
          setUsername(null);
          setIsAuthenticated(false);
          setActiveView('landing');
        }}
      />

      {/* Primary interactive dashboard grid */}
      <div className="flex-1 flex flex-col pl-64 h-screen relative overflow-hidden bg-surface-bright">
        
        {/* Pulsing hazard banner if SOS triggered */}
        {isEmergencyActive && (
          <div className="bg-error text-on-error px-6 py-2 flex items-center justify-between text-xs md:text-sm font-bold tracking-wide animate-pulse z-30 shadow-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>CRITICAL ALERT: Site Safety Emergency Protocol Active on Zone B facility nodes. Evacuate Zone B immediately.</span>
            </div>
            <button
              onClick={() => setIsEmergencyActive(false)}
              className="px-3 py-1 bg-white hover:bg-surface-variant text-primary rounded text-xs font-black transition-colors cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Global sticky top layout tools */}
        <Header
          onViewChange={setActiveView}
          activeView={activeView}
          onTriggerEmergency={handleTriggerEmergency}
          isEmergencyActive={isEmergencyActive}
        />

        {/* Inner page routing containers */}
        <div className="flex-1 overflow-y-auto">
          {activeView === 'chat' && (
            <SafetyChat
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearChat={clearChat}
              isGenerating={isGenerating}
            />
          )}

          {activeView === 'documents' && (
            <DocumentManagement
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onReindexDocument={handleReindexDocument}
              onReindexAll={handleReindexAll}
            />
          )}
        </div>
      </div>

      {/* Critical SOS Evacuation Checklist Modal */}
      {isEmergencyActive && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0f172a] rounded-xl border border-error/55 max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-scale-up text-slate-100">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6 text-error">
              <span className="material-symbols-outlined text-4xl animate-bounce">warning</span>
              <div>
                <h3 className="font-headline-md text-headline-md font-black tracking-tight text-error leading-tight text-red-500">
                  ZONE B EMERGENCY PROTOCOL ACTIVATED
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Compliance Dispatch sequence initiated
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-200 mb-6 leading-relaxed font-bold">
              Immediate actions required under active Mine Safety Authority directive NSW-C4:
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 items-start">
                <span className="bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Isolate Zone B Substations</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-medium">Power off primary line grids in Zone B East and West underground drifts immediately.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Initiate Evacuation Sirens</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-medium">Trigger facility sirens on repeating 15-second cycles across subterranean drifts.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Direct Personnel to Refuge Chamber 4</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-medium">Ensure all frontline drillers and blasters gather inside Refuge Chamber 4 (equipped with 72-hour air scrubbers).</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Dispatch Webhook Telemetry Payload</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-medium">Automated system has pushed active blast/ventilation safety records to the configured dispatch server receiver node.</p>
                </div>
              </li>
            </ul>

            <div className="flex gap-4 border-t border-slate-800 pt-6 justify-end">
              <button
                onClick={() => setIsEmergencyActive(false)}
                className="px-6 py-2.5 bg-slate-800 text-slate-100 hover:bg-slate-700 text-xs font-black rounded-lg transition-all active:scale-97 cursor-pointer shadow border border-slate-700"
              >
                DISMISS WARNING ALERTS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
