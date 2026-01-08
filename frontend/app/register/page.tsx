'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiArrowRight } from 'react-icons/hi';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  // Profile details
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [skills, setSkills] = useState('');

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        current_role: currentRole,
        target_role: targetRole,
        years_of_experience: parseInt(yearsExp) || 0,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      });
      
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration Error:', err.response?.data);
      const data = err.response?.data;
      if (data?.errors) {
        const messages = Object.values(data.errors).flat().join(' ');
        setError(messages);
      } else {
        setError(data?.message || 'Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
              CareerSync AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">{step === 1 ? 'Create your account' : 'Complete your profile'}</h2>
          <p className="text-slate-600 mt-2">
            {step === 1 ? 'Join thousands of job seekers optimizing their careers' : 'Help us personalize your job matching experience'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineUser className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 group"
              >
                Next Step
                <HiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Role / Title</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Role / Goal</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                  placeholder="e.g. Senior Product Manager"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Exp.</label>
                  <input
                    type="number"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all"
                    placeholder="3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 text-sm italic">Skills (Comma separated)</label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  rows={3}
                  className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50/50 text-slate-900 transition-all resize-none"
                  placeholder="React, TypeScript, Laravel, Python..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Complete Register'}
                  {!loading && <HiArrowRight className="h-5 w-5" />}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-slate-400 leading-relaxed px-4">
          By clicking "Create Account", you agree to our{' '}
          <Link href="#" className="underline hover:text-slate-600">Terms of Service</Link> and{' '}
          <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
