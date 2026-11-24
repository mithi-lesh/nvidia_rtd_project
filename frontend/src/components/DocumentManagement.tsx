/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SafetyDocument } from '../types';

interface DocumentManagementProps {
  documents: SafetyDocument[];
  onAddDocument: (formData: FormData) => void;
  onDeleteDocument: (id: string) => void;
  onReindexDocument: (id: string) => void;
  onReindexAll: () => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onReindexDocument,
  onReindexAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Blasting');
  const [newFile, setNewFile] = useState<File | null>(null);

  // Filter & Search Logic
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic (3 per page)
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['All', 'Blasting', 'Equipment', 'PPE', 'Ventilation', 'Compliance'];

  // Bento counts based on live state
  const totalCount = documents.length;
  const processingCount = documents.filter((d) => d.status === 'Processing').length;
  const indexedCount = documents.filter((d) => d.status === 'Indexed').length;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFile) return;

    const formData = new FormData();
    formData.append('title', newTitle.trim());
    formData.append('category', newCategory);
    formData.append('file', newFile);

    onAddDocument(formData);

    // Reset Form
    setNewTitle('');
    setNewFile(null);
    setIsUploadOpen(false);
    setCurrentPage(1);
  };

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-6 animate-fade-in text-slate-100">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="font-sans">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight mb-2">
            Knowledge Base Management
          </h1>
          <p className="text-sm text-slate-400">
            Manage, index, and audit operational manuals and standard operating procedures.
          </p>
        </div>
        
        <div className="flex gap-3 font-sans">
          <button
            onClick={onReindexAll}
            id="btn-reindex-all"
            className="bg-slate-900 text-slate-100 border border-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer active:scale-97"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            Re-index All
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            id="btn-upload-sop"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-97"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Upload PDF/SOP
          </button>
        </div>
      </div>

      {/* Bento counts summary indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        
        <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-6 flex flex-col shadow-md transition-all hover:border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 mb-4 font-bold">
            <span className="material-symbols-outlined text-[20px] text-blue-405">description</span>
            <span className="text-[10px] uppercase tracking-widest">Total Documents</span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-slate-50 tracking-tight font-mono">
            {totalCount.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-6 flex flex-col shadow-md relative overflow-hidden transition-all hover:border-slate-700">
          <div className="absolute right-0 top-0 w-16 h-16 bg-orange-500 opacity-5 rounded-bl-full"></div>
          <div className="flex items-center gap-2 text-slate-400 mb-4 font-bold">
            <span className="material-symbols-outlined text-[20px] text-orange-500 animate-pulse">
              hourglass_top
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">
              Processing Node
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-orange-500 tracking-tight font-mono">
            {processingCount}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-6 flex flex-col shadow-md transition-all hover:border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 mb-4 font-bold">
            <span className="material-symbols-outlined text-[20px] text-emerald-500">verified</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">
              Fully Indexed
            </span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-slate-50 tracking-tight font-mono">
            {indexedCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Categories Toolbar Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full border-b border-slate-850 py-1">
        <span className="text-xs font-bold text-slate-450 uppercase tracking-widest whitespace-nowrap mr-2">
          Category Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap active:scale-97 ${
              selectedCategory === cat
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-350 border-slate-800 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Data Table Container */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl shadow-md overflow-hidden flex flex-col">
        
        {/* Table Search & quick controls */}
        <div className="p-4 border-b border-slate-800/95 flex justify-between items-center bg-slate-950/20 font-sans">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg font-sans text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all md:text-sm"
              placeholder="Search manuals, SOPs..."
              type="text"
            />
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setCurrentPage(1);
            }}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-2 font-bold text-xs px-3 py-2 rounded-lg border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Clear Filter
          </button>
        </div>

        {/* The Safety Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-805 text-slate-400 font-semibold text-xs tracking-wider">
                <th className="py-3.5 px-6 uppercase">
                  Document Title &amp; Spec
                </th>
                <th className="py-3.5 px-6 uppercase">
                  Category
                </th>
                <th className="py-3.5 px-6 uppercase">
                  Upload Date
                </th>
                <th className="py-3.5 px-6 uppercase">
                  Status
                </th>
                <th className="py-3.5 px-6 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-805 text-slate-250">
              {paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-850/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-950 flex items-center justify-center text-blue-400 border border-slate-800 shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            {doc.type === 'PDF' ? 'picture_as_pdf' : 'description'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-xs md:text-sm text-slate-150">{doc.title}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono mt-0.5">
                            {doc.type} &bull; {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {doc.uploadDate}
                    </td>
                    <td className="py-4 px-6">
                      {doc.status === 'Indexed' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px] fill text-emerald-400">
                            check_circle
                          </span>
                          <span>Indexed</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-xs font-semibold animate-pulse">
                          <span className="material-symbols-outlined text-[14px] animate-spin text-orange-400">
                            progress_activity
                          </span>
                          <span>Processing</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1 px-1">
                        <button
                          onClick={() => onReindexDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800 transition-all cursor-pointer"
                          title="Recheck Index"
                        >
                          <span className="material-symbols-outlined text-[18px]">sync</span>
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium text-sm">
                    No active safety documents matched the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Stepper Pagination footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/30">
          <span className="text-xs font-semibold text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredDocs.length)} of {filteredDocs.length}{' '}
            entries
          </span>
          
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontSize: '18px' }}>
                chevron_left
              </span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`px-3 py-1 font-bold rounded text-xs transition-colors cursor-pointer ${
                  currentPage === idx
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-805 bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {idx}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontSize: '18px' }}>
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload SOP Modal overlay popup */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-[#0f172a] rounded-xl border border-slate-800 w-full max-w-md p-6 shadow-2xl relative animate-scale-up text-slate-100 font-sans">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">upload_file</span>
              Upload Safety Standard SOP
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-semibold">
              Add a new manual into MineSecure AI safety vector store. The file will be indexed for instant RAG citations.
            </p>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Document Title / SOP Code
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-100"
                  placeholder="e.g. Ventilation Fan Fail-Safe Check v2.1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Upload PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:outline-none focus:border-blue-500 rounded-lg text-sm text-slate-105"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Compliance Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:outline-none focus:border-blue-500 rounded-lg text-sm text-slate-205"
                >
                  <option value="Blasting">Blasting Protocol</option>
                  <option value="Equipment">Heavy Equipment</option>
                  <option value="PPE">PPE Guidelines</option>
                  <option value="Ventilation">Ventilation Control</option>
                  <option value="Compliance">Regulatory Compliance</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-150 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm active:scale-97"
                >
                  Submit &amp; Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
