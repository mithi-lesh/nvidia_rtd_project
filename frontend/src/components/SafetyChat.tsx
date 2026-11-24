/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface SafetyChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isGenerating: boolean;
}

const QUICK_PROMPTS = [
  {
    title: "Blast Zone Clearance",
    text: "What are the required clearance radii for a standard emulsion blast in Zone 4?",
  },
  {
    title: "Secondary Ventilation Failure",
    text: "What is the secondary ventilation failure protocol in Zone B?",
  },
  {
    title: "Gas Leak Protocol",
    text: "What should teams do if CO or NOx gas levels remain elevated after a blast?",
  },
  {
    title: "PPE Verification",
    text: "Provide a quick audit checklist for heavy excavator operators' PPE.",
  },
];

export const SafetyChat: React.FC<SafetyChatProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (text: string) => {
    if (isGenerating) return;
    onSendMessage(text);
  };

  // Export current chat log
  const handleExportChat = () => {
    const formattedText = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === 'user' ? 'Admin User' : 'MineSecure AI'}:\n${m.content}\n`
      )
      .join('\n');
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MineSecure_AI_Chat_Export_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] bg-[#020617] relative overflow-hidden">
      {/* Chat header area */}
      <header className="h-16 shrink-0 border-b border-slate-850 bg-slate-900/30 backdrop-blur-sm flex items-center justify-between px-6 z-10 text-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-100 tracking-tight">
            Blast Zone 4 Safety Review
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 font-sans text-[11px] text-slate-400 flex items-center gap-1.5 shadow-sm font-semibold">
            <span className="material-symbols-outlined text-[13px]" style={{ fontSize: '13px' }}>
              history
            </span>{' '}
            Safety Log Real-time
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportChat}
            id="btn-export-chat"
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Export Chat History"
          >
            <span className="material-symbols-outlined text-xl">download</span>
          </button>
          <button
            onClick={onClearChat}
            id="btn-clear-chat"
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </header>

      {/* Main message list stream layout */}
      <div className="flex-1 overflow-y-auto chat-scroll p-6 flex flex-col gap-6 scroll-smooth pb-36">
        {/* Helper Date badge */}
        <div className="flex justify-center my-2">
          <span className="text-[11px] text-slate-400 px-4 py-1 bg-slate-900 border border-slate-850 rounded-full font-bold uppercase tracking-wider shadow-sm">
            Operational Audit log
          </span>
        </div>

        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex gap-4 max-w-3xl ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {isUser ? (
                <img
                  alt="Admin User Headshot"
                  className="w-8 h-8 rounded-full shrink-0 border border-slate-800 shadow-sm object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApYRdf_RUhfOilkB8ZAXpf3wthJHOavpvn7O0GxGDlxp8kAKi9Mh0l9BBxBTAENqzy6hc1-NJe0ElhO8J7YR05HQd_CVayH8NZ_xPZwj-D8EDz5a7dXNLEyglfoQ_U7iOwP8U1kb_N7jpoCNclzm68ERfoPlTBuVJqJkD9eHm1QksgDFJhrZ0FWxUEZgCDU168spSW4bvEly8werlQ3NgGlFo0yfzkO09aaOutOORvr2a8WU4AN1IJFNotx0DFqsgNge0DD5Nmlqnd"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md border border-blue-500">
                  <span className="material-symbols-outlined text-white text-xs">
                    psychology
                  </span>
                </div>
              )}

              <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                <span className="text-[11px] text-slate-450 font-bold">
                  {isUser ? `Admin • ${message.timestamp}` : `MineSecure AI • ${message.timestamp}`}
                </span>

                <div
                  className={`px-5 py-4 rounded-xl shadow-md border ${
                    isUser
                      ? 'bg-slate-900 text-slate-100 border-slate-800 rounded-tr-sm'
                      : 'bg-[#0b1329] text-slate-200 border-slate-800/80 rounded-tl-sm'
                  }`}
                >
                  <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Attachment page source citations */}
                  {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center flex-wrap gap-2">
                      <span className="text-xs text-slate-400 mr-1 font-semibold">
                        Sources:
                      </span>
                      {message.sources.map((src, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-blue-400 text-xs font-bold border border-slate-800 shadow-sm hover:bg-slate-900 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {src.icon || 'description'}
                          </span>
                          {src.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Animated dynamic typing feedback indicator */}
        {isGenerating && (
          <div className="flex gap-4 max-w-3xl mt-2 self-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md border border-blue-500">
              <span className="material-symbols-outlined text-white text-xs">
                psychology
              </span>
            </div>
            <div className="flex flex-col gap-1 items-start w-full justify-center">
              <span className="text-xs text-slate-400 font-semibold">
                Generating Safety Synthesis...
              </span>
              <div className="bg-[#0b1329] border border-slate-800 px-5 py-3 rounded-xl rounded-tl-sm shadow-sm flex items-center gap-1.5 w-24 h-11">
                <div className="w-2 h-2 rounded-full bg-blue-500 typing-dot animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 typing-dot animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 typing-dot animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Floating control input panel */}
      <div className="absolute bottom-0 left-0 w-full bg-[#020617]/90 backdrop-blur-md border-t border-slate-800/80 p-4 z-20">
        <div className="max-w-4xl mx-auto relative flex flex-col gap-3">
          


          {/* Interactive input and secondary operations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none rounded-xl px-4 py-4 pr-24 font-sans text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-0 max-h-32 min-h-[56px]"
              placeholder="Ask a question about mining safety, ventilation, blasting, or emergency protocols..."
            />
            
            <div className="absolute right-3.5 bottom-3 flex items-center gap-1.5 bg-slate-900 rounded-lg p-1">
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isGenerating}
                className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
                title="Send Message"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontSize: '20px' }}>
                  send
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] text-slate-500 font-semibold">
              MineSecure AI can make mistakes. Verify important safety information with site supervisor.
            </p>
            <p className="text-[10px] text-slate-500 hidden md:block font-semibold">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] mx-0.5">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] mx-0.5">Shift</kbd> + <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] mx-0.5">Enter</kbd> for newline
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
