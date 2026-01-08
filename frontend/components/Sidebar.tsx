'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiOutlineHome, 
  HiOutlineBriefcase, 
  HiOutlineDocumentText, 
  HiOutlineDocumentSearch,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineLogout
} from 'react-icons/hi';
import { useAuthStore } from '@/lib/store';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome },
  { name: 'Applications', href: '/applications', icon: HiOutlineBriefcase },
  { name: 'Resume Analyzer', href: '/resume-analyzer', icon: HiOutlineDocumentSearch },
  { name: 'Cover Letters', href: '/cover-letter', icon: HiOutlineDocumentText },
  { name: 'Analytics', href: '/analytics', icon: HiOutlineChartBar },
  { name: 'Profile', href: '/profile', icon: HiOutlineUser },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col w-64 bg-slate-900 min-h-screen text-white fixed left-0 top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto filter brightness-0 invert" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            CareerSync AI
          </h1>
        </Link>
      </div>

      <nav className="flex-1 mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-4 transition-colors ${
                isActive 
                  ? 'bg-blue-600 border-r-4 border-white' 
                  : 'hover:bg-slate-800'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center text-slate-400 hover:text-white transition-colors w-full px-2"
        >
          <HiOutlineLogout className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
