'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applicationAPI } from '@/lib/api';
import AppLayout from '@/components/AppLayout';
import { 
  HiOutlineOfficeBuilding, 
  HiOutlineBriefcase, 
  HiOutlineCurrencyDollar, 
  HiOutlineLink, 
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineArrowLeft,
  HiOutlineSparkles
} from 'react-icons/hi';
import Link from 'next/link';

export default function NewApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    status: 'applied',
    applied_at: new Date().toISOString().split('T')[0],
    job_description: '',
    salary_range: '',
    job_url: '',
  });

  useEffect(() => {
    // Pre-fill from query params if coming from Discovery
    const company = searchParams.get('company');
    const title = searchParams.get('title');
    const url = searchParams.get('url');
    const salary = searchParams.get('salary');

    if (company || title || url || salary) {
      setFormData(prev => ({
        ...prev,
        company_name: company || prev.company_name,
        position_title: title || prev.position_title,
        job_url: url || prev.job_url,
        salary_range: salary || prev.salary_range,
      }));
    }
  }, [searchParams]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await applicationAPI.create(formData);
      router.push('/applications');
    } catch (err) {
      console.error('Failed to create application:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs/Back */}
        <Link 
          href="/applications" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-6 transition-colors group"
        >
          <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Applications</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add New Application</h1>
          <p className="text-slate-600 mt-1">Keep track of your job search details in one place.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineBriefcase className="text-primary-600" />
                Company & Role
              </h3>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                <div className="relative">
                  <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Google, Stripe"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="applied">Applied</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="offer">Offer Received</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Application Date *</label>
                <div className="relative">
                  <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="date"
                    name="applied_at"
                    value={formData.applied_at}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineCurrencyDollar className="text-primary-600" />
                Additional Details
              </h3>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range (Optional)</label>
                <div className="relative">
                  <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g. $120k - $150k"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Listing URL (Optional)</label>
                <div className="relative">
                  <HiOutlineLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="url"
                    name="job_url"
                    value={formData.job_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/jobs/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Job Description
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full uppercase">
                    <HiOutlineSparkles className="w-3 h-3" />
                    AI Ready
                  </span>
                </label>
                <div className="relative">
                  <HiOutlineDocumentText className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <textarea
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Paste the job description here for career insights and success predictions..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Our AI uses this description to analyze your profile's compatibility.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link 
              href="/applications"
              className="px-6 py-3 text-slate-600 font-bold hover:text-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Application</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
