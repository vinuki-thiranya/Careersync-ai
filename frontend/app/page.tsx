import React from 'react';
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineDocumentSearch } from 'react-icons/hi';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <HiOutlineSparkles className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">CareerSync AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <HiOutlineLightningBolt className="text-blue-600" />
          <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Powered by Gemini & GPT-4</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
          Land more offers with <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">AI-powered intelligence.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
          CareerSync AI is the all-in-one platform for job seekers to track applications, 
          optimize resumes, and generate professional cover letters matching any job description.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center">
            Start Your Free Journey
            <HiOutlineArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm">
            Watch Demo
          </button>
        </div>
        
        {/* Mockup Preview */}
        <div className="mt-20 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur opacity-20"></div>
          <div className="relative bg-white border border-slate-200 rounded-[2rem] shadow-2xl p-4 md:p-8 aspect-video flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-slate-50 rounded-xl border border-slate-100 flex p-6 gap-6">
                <div className="w-64 bg-slate-900 rounded-lg hidden md:block"></div>
                <div className="flex-1 space-y-6">
                   <div className="h-12 w-48 bg-slate-200 rounded-lg"></div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-blue-100 rounded-xl"></div>
                      <div className="h-32 bg-indigo-100 rounded-xl"></div>
                      <div className="h-32 bg-emerald-100 rounded-xl"></div>
                   </div>
                   <div className="h-64 bg-slate-200 rounded-xl"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white border-y border-slate-200 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Everything you need to succeed.</h2>
            <p className="text-slate-500 font-medium mt-4">Professional tools designed for modern career growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={HiOutlineChartBar} 
              title="Intelligent Tracking" 
              desc="Monitor your entire application lifecycle with automated status updates and success metrics."
              color="bg-blue-600"
            />
            <FeatureCard 
              icon={HiOutlineDocumentSearch} 
              title="Resume Optimizer" 
              desc="Deep AI scanning to match your resume against ATS requirements and job descriptions."
              color="bg-indigo-600"
            />
            <FeatureCard 
              icon={HiOutlineSparkles} 
              title="Cover Letter Gen" 
              desc="Generate hyper-personalized cover letters that capture your unique voice and match the role."
              color="bg-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to synchronize your <br className="hidden md:block"/> career with tomorrow?</h2>
            <Link href="/register" className="inline-flex bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all">
              Join 10,000+ Job Seekers
            </Link>
            <div className="flex items-center justify-center gap-8 mt-12 opacity-50">
               <span className="font-bold tracking-widest text-sm underline decoration-blue-500 decoration-4">SaaS INC</span>
               <span className="font-bold tracking-widest text-sm italic">TECH CORP</span>
               <span className="font-bold tracking-widest text-sm">GLOBAL SYSTEMS</span>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-slate-900 rounded-md flex items-center justify-center">
              <HiOutlineSparkles className="text-white h-4 w-4" />
            </div>
            <span className="font-black text-slate-900 tracking-tight">CareerSync AI</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
             <Link href="#" className="hover:text-blue-600">Privacy</Link>
             <Link href="#" className="hover:text-blue-600">Terms</Link>
             <Link href="#" className="hover:text-blue-600">Contact</Link>
          </div>
          <p className="text-sm text-slate-400">© 2026 CareerSync AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all group">
      <div className={`h-14 w-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

