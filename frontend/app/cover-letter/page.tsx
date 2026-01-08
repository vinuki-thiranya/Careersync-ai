'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { coverLetterAPI } from '@/lib/api';
import AppLayout from '@/components/AppLayout';
import { 
  HiOutlinePencilAlt, 
  HiOutlineSparkles, 
  HiOutlineClipboardCopy, 
  HiOutlineOfficeBuilding, 
  HiOutlineBriefcase,
  HiOutlineInformationCircle,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineArrowRight
} from 'react-icons/hi';

type ViewMode = 'generate' | 'library';

export default function CoverLetterPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('generate');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<any>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    company_info: '',
    job_description: '',
  });

  React.useEffect(() => {
    if (viewMode === 'library') {
      fetchHistory();
    }
  }, [viewMode]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await coverLetterAPI.list();
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await coverLetterAPI.generate(formData);
      setGeneratedLetter(response.data.coverLetter);
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter.content);
      // In a real app we'd use a toast here
      alert('Copied to clipboard!');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Cover Letter Generator</h1>
            <p className="text-slate-600 mt-1">Stand out from the crowd with a professionally written, personalized cover letter.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setViewMode('generate')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'generate' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <HiOutlinePencilAlt className="w-4 h-4" />
              Generator
            </button>
            <button
              onClick={() => setViewMode('library')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'library' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <HiOutlineClock className="w-4 h-4" />
              Library
            </button>
          </div>
        </div>

        {viewMode === 'generate' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <HiOutlinePencilAlt className="text-primary-600 w-5 h-5" />
                    Letter Details
                  </h3>
                </div>
                <div className="p-6 md:p-8">
                  <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                        <div className="relative">
                          <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="e.g. Netflix"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Position Title *</label>
                        <div className="relative">
                          <HiOutlineBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input
                            type="text"
                            name="position_title"
                            value={formData.position_title}
                            onChange={handleChange}
                            placeholder="e.g. UX Designer"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 text-sm">
                        Company Context (Optional)
                        <HiOutlineInformationCircle className="w-4 h-4 text-slate-400" />
                      </label>
                      <textarea
                        name="company_info"
                        value={formData.company_info}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Culture, mission, or why you want to work here..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                      <textarea
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Paste the requirements to help the AI tailor your skills..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none font-mono text-sm shadow-inner"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !formData.company_name || !formData.position_title}
                      className="w-full bg-primary-600 text-white py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-200/50 group"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Crafting your letter...</span>
                        </>
                      ) : (
                        <>
                          <HiOutlineSparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span>Generate with AI</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              {!generatedLetter ? (
                <div className="h-full bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <HiOutlineDocumentText className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Awaiting generation</h3>
                  <p className="text-slate-500 max-w-xs">
                    Provide company details on the left and our AI will generate a personalized draft for you.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-full min-h-[600px] animate-in slide-in-from-right-4 duration-500">
                  <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800">Generated Draft</h3>
                      <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Professional
                      </span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="Copy to clipboard"
                    >
                      <HiOutlineClipboardCopy className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-8 overflow-y-auto flex-1 bg-slate-50/30">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm font-medium">
                        {generatedLetter.content}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                    <button
                      onClick={handleCopy}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                      <HiOutlineClipboardCopy className="w-5 h-5" />
                      <span>Copy Result</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Your Cover Letter Library</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">
                {history.length} Saved
              </span>
            </div>
            <div className="p-0">
              {historyLoading ? (
                <div className="p-12 text-center text-slate-400 font-medium">Loading library...</div>
              ) : history.length === 0 ? (
                <div className="p-20 text-center">
                  <HiOutlineClock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Your library is currently empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.map((letter) => (
                    <div key={letter.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                          <HiOutlineDocumentText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{letter.position_title}</p>
                          <p className="text-xs text-slate-500 font-medium">{letter.company_name} • {new Date(letter.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <HiOutlineChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
