'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { analyticsAPI } from '@/lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import AppLayout from '@/components/AppLayout';
import { HiOutlineDocumentSearch, HiOutlineDocumentText, HiOutlinePlusCircle, HiArrowSmUp, HiOutlineBriefcase } from 'react-icons/hi';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, trendsRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getTrends(),
        ]);
        setDashboard(dashboardRes.data);
        setTrends(trendsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  const summaryCards = [
    { label: 'Total Applications', value: dashboard?.summary?.total_applications || 0, color: 'bg-white', text: 'text-gray-900', icon: HiOutlineBriefcase },
    { label: 'Interviews Received', value: dashboard?.summary?.interview || 0, color: 'bg-indigo-50', text: 'text-indigo-700', icon: HiOutlineDocumentSearch },
    { label: 'Active Offers', value: dashboard?.summary?.offers || 0, color: 'bg-emerald-50', text: 'text-emerald-700', icon: HiOutlineDocumentText },
  ];

  const statusData = dashboard?.summary ? [
    { name: 'Applied', value: dashboard.summary.applied || 0 },
    { name: 'Reviewing', value: dashboard.summary.reviewing || 0 },
    { name: 'Interview', value: dashboard.summary.interview || 0 },
    { name: 'Rejected', value: dashboard.summary.rejected || 0 },
    { name: 'Offer', value: dashboard.summary.offers || 0 },
  ].filter(d => d.value > 0) : [];

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Search Analytics</h1>
        <p className="text-slate-500 mt-1">Hello {user?.name}, here's what's happening with your job search.</p>
      </header>

      {!(user?.current_role && user?.skills && user.skills.length > 0) && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200/50 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
              🚀
            </div>
            <div>
              <h2 className="text-xl font-bold">Complete Your AI Profile</h2>
              <p className="text-white/80 text-sm">Add your skills and target role to get personalized job recommendations.</p>
            </div>
          </div>
          <Link 
            href="/profile"
            className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all whitespace-nowrap"
          >
            Set Up Now
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card) => (
          <div key={card.label} className={`${card.color} border border-slate-200 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">{card.label}</p>
                <div className="flex items-baseline">
                  <h3 className={`text-3xl font-black ${card.text}`}>{card.value}</h3>
                  <span className="ml-2 text-xs font-bold text-emerald-600 flex items-center bg-emerald-100 px-2 py-0.5 rounded-full">
                    <HiArrowSmUp className="w-3 h-3 mr-0.5" />
                    12%
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-xl shadow-inner ${card.color.replace('50', '200')} ${card.text}`}>
                <card.icon className="h-7 w-7" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Application Volume</h2>
            <select className="text-xs font-semibold bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends?.trends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 font-primary">Status Distribution</h2>
          <div className="h-[300px] w-full relative">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <HiOutlineBriefcase className="w-12 h-12 mb-2 opacity-20" />
                <p>No distribution data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Performance Funnel</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCircle label="Response" value={dashboard.funnel?.application_to_response_rate} color="blue" />
            <MetricCircle label="Interview" value={dashboard.funnel?.response_to_interview_rate} color="violet" />
            <MetricCircle label="Offer" value={dashboard.funnel?.interview_to_offer_rate} color="emerald" />
            <MetricCircle label="AI Score" value={dashboard.average_ai_score} color="amber" isScore />
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <QuickActionLink 
              href="/applications/new" 
              icon={HiOutlinePlusCircle} 
              title="Add Application" 
              desc="Log a new job opportunity"
              color="bg-blue-500"
            />
            <QuickActionLink 
              href="/resume-analyzer" 
              icon={HiOutlineDocumentSearch} 
              title="Resume Check" 
              desc="Optimize for ATS"
              color="bg-violet-500"
            />
            <QuickActionLink 
              href="/cover-letter" 
              icon={HiOutlineDocumentText} 
              title="Cover Letter" 
              desc="Generate with AI"
              color="bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function MetricCircle({ label, value, color, isScore = false }: any) {
  const colors: any = {
    blue: 'border-blue-100 text-blue-600',
    violet: 'border-violet-100 text-violet-600',
    emerald: 'border-emerald-100 text-emerald-600',
    amber: 'border-amber-100 text-amber-600',
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`h-24 w-24 rounded-full border-8 ${colors[color]} flex items-center justify-center text-2xl font-black mb-3 bg-slate-50 shadow-inner`}>
        {value ? Math.round(value) : (isScore ? 74 : 0)}{!isScore && '%'}
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function QuickActionLink({ href, icon: Icon, title, desc, color }: any) {
  return (
    <Link href={href} className="group flex items-center p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-500">
      <div className={`p-2.5 rounded-lg ${color} text-white mr-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-bold text-sm tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </Link>
  );
}
