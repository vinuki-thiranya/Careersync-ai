'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineBriefcase, 
  HiOutlineChip, 
  HiOutlineCalendar, 
  HiOutlineSave
} from 'react-icons/hi';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const setUser = useAuthStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_role: '',
    target_role: '',
    years_of_experience: 0,
    skills: [] as string[],
  });

  const [skillsText, setSkillsText] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      const user = response.data;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        current_role: user.current_role || '',
        target_role: user.target_role || '',
        years_of_experience: user.years_of_experience || 0,
        skills: user.skills || [],
      });
      setSkillsText((user.skills || []).join(', '));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_of_experience' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedSkills = skillsText.split(',').map(s => s.trim()).filter(s => s !== '');
      const dataToSave = {
        ...formData,
        skills: updatedSkills
      };

      const response = await authAPI.updateProfile(dataToSave);
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
          <p className="text-slate-600 mt-2">Manage your personal information and career preferences.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineUser className="text-primary-600 w-5 h-5" />
                Personal Information
              </h3>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold px-1 italic">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineBriefcase className="text-primary-600 w-5 h-5" />
                Career Background
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Role</label>
                  <input
                    type="text"
                    name="current_role"
                    value={formData.current_role}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Role</label>
                  <input
                    type="text"
                    name="target_role"
                    value={formData.target_role}
                    onChange={handleChange}
                    placeholder="e.g. Lead Engineer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  className="w-32 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  Technical Skills
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Comma separated</span>
                </label>
                <textarea
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  rows={4}
                  placeholder="React, Next.js, TypeScript, Tailwind, Node.js..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <HiOutlineSave className="w-5 h-5" />
                  Save Profile Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
