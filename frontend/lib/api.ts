import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const applicationAPI = {
  list: (page = 1) => api.get(`/applications?page=${page}`),
  discover: (query = '') => api.get(`/applications/discover?query=${query}`),
  create: (data: any) => api.post('/applications', data),
  get: (id: number) => api.get(`/applications/${id}`),
  update: (id: number, data: any) => api.put(`/applications/${id}`, data),
  delete: (id: number) => api.delete(`/applications/${id}`),
};

export const resumeAPI = {
  analyze: (data: any) => api.post('/resume/analyze', data),
  listAnalyses: () => api.get('/resume/analyses'),
  getAnalysis: (id: number) => api.get(`/resume/analyses/${id}`),
};

export const coverLetterAPI = {
  generate: (data: any) => api.post('/cover-letters/generate', data),
  list: () => api.get('/cover-letters'),
  get: (id: number) => api.get(`/cover-letters/${id}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getTrends: (days = 30) => api.get(`/analytics/trends?days=${days}`),
  getSkillAnalysis: () => api.get('/analytics/skills'),
};

export default api;
