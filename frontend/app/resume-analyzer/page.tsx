'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resumeAPI } from '@/lib/api';
import AppLayout from '@/components/AppLayout';
import { 
  HiOutlineDocumentSearch, 
  HiOutlineSparkles, 
  HiOutlineCheckCircle, 
  HiOutlineExclamationCircle,
  HiOutlineLibrary,
  HiOutlineChip,
  HiOutlineClock,
  HiOutlineChevronRight
} from 'react-icons/hi';

type ViewMode = 'analyze' | 'history';

export default function ResumeAnalyzerPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('analyze');
  const [history, setHistory] = useState<any[]>([]);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  React.useEffect(() => {
    if (viewMode === 'history') {
      fetchHistory();
    }
  }, [viewMode]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await resumeAPI.listAnalyses();
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await resumeAPI.analyze({
        resume_text: resumeText,
        job_description: jobDescription,
      });
      setAnalysis(response.data.analysis);
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Resume Analyzer</h1>
            <p className="text-slate-600 mt-1">Optimize your resume for ATS and get personalized recommendations.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setViewMode('analyze')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'analyze' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <HiOutlineDocumentSearch className="w-4 h-4" />
              Analyze
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <HiOutlineClock className="w-4 h-4" />
              History
            </button>
          </div>
        </div>

        {viewMode === 'analyze' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <HiOutlineDocumentSearch className="text-primary-600 w-5 h-5" />
                    Analysis Input
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleAnalyze} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Content *</label>
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={12}
                        placeholder="Paste your resume text here..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono text-sm resize-none shadow-inner"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                        Target Job Description
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Optional but recommended</span>
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={6}
                        placeholder="Paste the target job description to see how you match up..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono text-sm resize-none shadow-inner"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !resumeText}
                      className="w-full bg-primary-600 text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-200/50 group"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <HiOutlineSparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span>Run Full Analysis</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {!analysis ? (
                <div className="h-full bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <HiOutlineLibrary className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Ready for analysis</h3>
                  <p className="text-slate-500 max-w-xs leading-relaxed">
                    Upload your resume content to see your ATS score and personalized career roadmap.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                  {/* Score Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/30 text-center group hover:border-primary-300 transition-all">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">ATS Score</p>
                      <div className="relative inline-flex items-center justify-center mb-2">
                        <span className={`text-5xl font-black ${analysis.ats_score >= 75 ? 'text-emerald-500' : analysis.ats_score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                          {analysis.ats_score}
                        </span>
                        <span className="text-slate-300 text-sm ml-0.5 font-bold">%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${analysis.ats_score >= 75 ? 'bg-emerald-500' : analysis.ats_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${analysis.ats_score}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/30 text-center group hover:border-primary-300 transition-all">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Skills Match</p>
                      <div className="relative inline-flex items-center justify-center mb-2">
                        <span className="text-5xl font-black text-primary-600">
                          {analysis.skills_match_percentage}
                        </span>
                        <span className="text-slate-300 text-sm ml-0.5 font-bold">%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                          style={{ width: `${analysis.skills_match_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Keyword Gaps */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-white">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <HiOutlineChip className="text-rose-500 w-5 h-5" />
                        Missing Keywords
                      </h3>
                    </div>
                    <div className="p-5 bg-slate-50/30">
                      {analysis.keyword_gaps && analysis.keyword_gaps.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {analysis.keyword_gaps.map((gap: string, idx: number) => (
                            <span key={idx} className="bg-white text-rose-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-rose-100 uppercase tracking-wider shadow-sm">
                              {gap}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm italic">No significant keyword gaps identified.</p>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-sm">
                    <div className="p-5 border-b border-slate-100 bg-white">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <HiOutlineExclamationCircle className="text-amber-500 w-5 h-5" />
                        AI Recommendations
                      </h3>
                    </div>
                    <div className="p-0 bg-slate-50/30">
                      {analysis.recommendations?.map((rec: string, idx: number) => (
                        <div key={idx} className={`p-5 flex items-start gap-4 ${idx !== analysis.recommendations.length - 1 ? 'border-b border-slate-100/50' : ''} hover:bg-white transition-colors`}>
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                            <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-semibold text-slate-700 leading-relaxed">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Your Past Analyses</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">
                {history.length} Saved
              </span>
            </div>
            <div className="p-0">
              {historyLoading ? (
                <div className="p-12 text-center text-slate-400">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="p-20 text-center">
                  <HiOutlineClock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No saved analyses yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${item.ats_score >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'}`}>
                          {item.ats_score}%
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Resume Analysis</p>
                          <p className="text-xs text-slate-500 font-medium">{new Date(item.created_at).toLocaleDateString()} • {item.keyword_gaps?.length || 0} gaps found</p>
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
