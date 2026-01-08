'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { applicationAPI } from '@/lib/api';
import AppLayout from '@/components/AppLayout';
import { 
  HiOutlineOfficeBuilding, 
  HiOutlineBriefcase, 
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineLink,
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineChartBar
} from 'react-icons/hi';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await applicationAPI.get(Number(id));
        setApplication(response.data.data);
      } catch (err) {
        console.error('Failed to fetch application:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationAPI.delete(Number(id));
        router.push('/applications');
      } catch (err) {
        console.error('Failed to delete application:', err);
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading application details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!application) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-800">Application not found</h2>
          <Link href="/applications" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to applications
          </Link>
        </div>
      </AppLayout>
    );
  }

  const statusColors: any = {
    'applied': 'bg-blue-50 text-blue-700 border-blue-100',
    'reviewing': 'bg-amber-50 text-amber-700 border-amber-100',
    'interview': 'bg-purple-50 text-purple-700 border-purple-100',
    'rejected': 'bg-slate-50 text-slate-600 border-slate-100',
    'offer': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/applications" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium transition-colors group"
          >
            <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to List</span>
          </Link>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => alert('Editing is disabled in this view')}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              title="Edit Application"
            >
              <HiOutlinePencilAlt className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Delete Application"
            >
              <HiOutlineTrash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0">
                <HiOutlineOfficeBuilding className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{application.position_title}</h1>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[application.status]}`}>
                    {application.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xl text-slate-600 font-medium">{application.company_name}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span>Applied {new Date(application.applied_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {application.salary_range && (
                    <div className="flex items-center gap-1.5">
                      <HiOutlineCurrencyDollar className="w-4 h-4" />
                      <span>{application.salary_range}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 px-8 py-6 rounded-3xl border border-primary-100 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">AI Compatibility</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-700">{Math.round(application.ai_score || 0)}</span>
                <span className="text-primary-400 font-bold">%</span>
              </div>
              <div className="w-24 bg-primary-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full rounded-full" 
                  style={{ width: `${application.ai_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <HiOutlineDocumentText className="text-primary-600 w-5 h-5" />
                  Job Description
                </h3>
              </div>
              <div className="p-6 md:p-8">
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                    {application.job_description || 'No job description provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                <HiOutlineSparkles className="text-amber-500 w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {application.job_url && (
                  <a 
                    href={application.job_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <HiOutlineLink className="text-slate-400 group-hover:text-primary-500 w-5 h-5" />
                      <span className="text-sm font-bold text-slate-700">Original Listing</span>
                    </div>
                  </a>
                )}
                <Link 
                  href="/resume-analyzer"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineChartBar className="text-slate-400 group-hover:text-primary-500 w-5 h-5" />
                    <span className="text-sm font-bold text-slate-700">Analyze with AI</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-200">
              <HiOutlineSparkles className="w-8 h-8 opacity-50 mb-4" />
              <h4 className="font-bold text-lg leading-tight mb-2">Need a tailored resume?</h4>
              <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                Generate a custom resume optimized for this specific job description to increase your chances.
              </p>
              <button 
                className="w-full bg-white text-primary-600 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm"
              >
                Tailor Resume Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
