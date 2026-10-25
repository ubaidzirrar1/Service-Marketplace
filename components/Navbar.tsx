
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, AppRoute } from '../types';

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b h-16 px-8 flex items-center justify-between sticky top-0 z-[100]">
      {/* Logo */}
      <Link to={AppRoute.HOME} className="flex items-center">
        <span className="text-xl font-bold text-[#1f2937] tracking-tight">servicefinder</span>
        <span className="text-[#6366f1] text-xl font-bold">.</span>
      </Link>

      {/* Action Icons */}
      <div className="flex items-center h-full">
        <div className="flex items-center gap-1 h-full pr-4 border-r border-slate-100">
          <button 
            onClick={() => navigate(AppRoute.INBOX)} 
            className="p-2 text-slate-400 hover:text-indigo-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        <Link to={AppRoute.SETTINGS} className="ml-4 w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
          <img src="https://i.pravatar.cc/150?u=me" alt="Profile" className="w-full h-full object-cover opacity-60" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
