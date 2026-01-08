'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { applicationAPI } from '@/lib/api';
import AppLayout from '@/components/AppLayout';
import { 
  HiOutlinePlus, 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlineBriefcase, 
  HiOutlineOfficeBuilding, 
  HiOutlineCalendar,
  HiOutlineChevronRight,
  HiOutlineExternalLink,
  HiOutlineSparkles,
  HiOutlineDatabase
} from 'react-icons/hi';

type ViewType = 'tracker' | 'discovery';

export default function ApplicationsPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>('tracker');
  const [applications, setApplications] = useState<any[]>([]);
  const [discoveredJobs, setDiscoveredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [discoverySearch, setDiscoverySearch] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchDiscoveredJobs();
  }, [router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.list();
      setApplications(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscoveredJobs = async (query = '') => {
    try {
      setDiscoveryLoading(true);
      const response = await applicationAPI.discover(query);
      setDiscoveredJobs(response.data.results || []);
    } catch (err) {
      console.error('Failed to discover jobs:', err);
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handleDiscoverySearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDiscoveredJobs(discoverySearch);
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = filter === 'all' || app.status === filter;
    const matchesSearch = app.position_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusMap: any = {
    'applied': { color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Applied' },
    'reviewing': { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'In Review' },
    'interview': { color: 'bg-purple-50 text-purple-700 border-purple-100', label: 'Interviewing' },
    'rejected': { color: 'bg-slate-50 text-slate-600 border-slate-100', label: 'Rejected' },
    'offer': { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Offer Received' },
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Applications</h1>
            <p className="text-slate-600 mt-1">Discover, track and manage your career journey with AI</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/applications/new" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
              <HiOutlinePlus className="w-5 h-5" />
              <span>New Application</span>
            </Link>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveView('tracker')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeView === 'tracker'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <HiOutlineDatabase className="w-5 h-5" />
            My Tracker
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs">
              {applications.length}
            </span>
          </button>
          <button
            onClick={() => setActiveView('discovery')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeView === 'discovery'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <HiOutlineSparkles className="w-5 h-5" />
            AI Job Discovery
          </button>
        </div>

        {activeView === 'tracker' ? (
          <>
            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search tracker..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {['all', 'applied', 'reviewing', 'interview', 'offer', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
                      filter === status
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-100'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary-500 hover:text-primary-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading your applications...</p>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiOutlineBriefcase className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  {searchTerm || filter !== 'all' 
                    ? "Try adjusting your filters or search terms to find what you're looking for." 
                    : "You haven't added any applications yet. Use the discovery tool to find new roles!"}
                </p>
                <button 
                  onClick={() => setActiveView('discovery')}
                  className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 underline underline-offset-4"
                >
                  Go to Discovery
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredApps.map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => router.push(`/applications/${app.id}`)}
                    className="group bg-white rounded-2xl border border-slate-200 p-5 md:p-6 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                          <HiOutlineOfficeBuilding className="w-8 h-8 text-slate-400 group-hover:text-primary-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                            {app.position_title}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <span className="font-medium text-slate-700">{app.company_name}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <HiOutlineCalendar className="w-4 h-4" />
                              <span className="text-sm">{new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Match</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-500 rounded-full" 
                                style={{ width: `${app.ai_score || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{Math.round(app.ai_score || 0)}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusMap[app.status]?.color || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                            {statusMap[app.status]?.label || app.status}
                          </span>
                          <HiOutlineChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleDiscoverySearch} className="bg-gradient-to-r from-primary-600 to-indigo-600 p-8 rounded-3xl shadow-xl shadow-primary-200">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <HiOutlineSparkles className="w-6 h-6" />
                AI Job Discovery
              </h2>
              <p className="text-primary-100 mb-6 max-w-2xl">
                Searching across LinkedIn, Glassdoor, and 50+ job boards. Our AI analyzes your profile to find roles with the highest success probability.
              </p>
              <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                <input 
                  type="text"
                  placeholder="What role should AI find for you? (e.g. Senior Frontend remote...)"
                  className="w-full pl-12 pr-32 py-4 bg-white border-0 rounded-2xl shadow-lg focus:ring-4 focus:ring-white/20 transition-all text-slate-900 text-lg"
                  value={discoverySearch}
                  onChange={(e) => setDiscoverySearch(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-primary-600 text-white px-6 rounded-xl font-bold hover:bg-primary-700 transition-all active:scale-95"
                >
                  Pulse Search
                </button>
              </div>
            </form>

            {discoveryLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4" />
                    <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-3" />
                    <div className="h-4 bg-slate-50 rounded-lg w-1/2 mb-6" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveredJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="group bg-white rounded-3xl border border-slate-200 p-6 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-100 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-50 transition-colors">
                        {job.company_name.charAt(0)}
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                        <HiOutlineSparkles className="w-3 h-3" />
                        {job.ai_score}% Match
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-1">
                      {job.position_title}
                    </h3>
                    <p className="text-slate-600 font-medium mb-2">{job.company_name}</p>
                    
                    {job.match_reason && (
                      <div className="bg-primary-50/50 rounded-xl p-3 mb-4 border border-primary-100/50">
                        <p className="text-xs text-primary-700 font-medium leading-relaxed">
                          <span className="font-bold">AI Match:</span> {job.match_reason}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-medium border border-slate-100">
                          {job.location}
                        </span>
                        <span className="px-2 py-1 bg-slate-50 text-primary-600 rounded-lg text-xs font-bold border border-slate-100">
                          {job.salary_range}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-xs text-slate-400 italic">
                          Posted {new Date(job.posted_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/applications/new?company=${encodeURIComponent(job.company_name)}&title=${encodeURIComponent(job.position_title)}&url=${encodeURIComponent(job.job_url)}&salary=${encodeURIComponent(job.salary_range)}`}
                            className="bg-primary-50 text-primary-600 p-2 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm group/track"
                            title="Add to Tracker"
                          >
                            <HiOutlineBriefcase className="w-5 h-5 group-hover/track:scale-110 transition-transform" />
                          </Link>
                          <a 
                            href={job.job_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all group/btn"
                          >
                            View
                            <HiOutlineExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
