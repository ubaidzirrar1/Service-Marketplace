
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, AppRoute } from '../types';

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
      navigate(AppRoute.REGISTER);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4">How do you want to use GlobalServ?</h1>
        <p className="text-slate-500 text-lg">Choose your journey and start making connections today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Client Card */}
        <div 
          onClick={() => setSelected('client')}
          className={`relative group cursor-pointer bg-white rounded-3xl p-10 border-4 transition-all duration-300 shadow-xl ${
            selected === 'client' ? 'border-blue-600 scale-105' : 'border-transparent hover:border-blue-100'
          }`}
        >
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:rotate-6 transition-transform">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">I want to Hire</h2>
          <p className="text-slate-500">I am looking for talented professionals to help me with tasks and projects.</p>
          {selected === 'client' && (
            <div className="absolute top-4 right-4 bg-blue-600 rounded-full p-1 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          )}
        </div>

        {/* Worker Card */}
        <div 
          onClick={() => setSelected('worker')}
          className={`relative group cursor-pointer bg-white rounded-3xl p-10 border-4 transition-all duration-300 shadow-xl ${
            selected === 'worker' ? 'border-blue-600 scale-105' : 'border-transparent hover:border-blue-100'
          }`}
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:rotate-6 transition-transform">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">I want to Work</h2>
          <p className="text-slate-500">I am a skilled individual looking to provide services and earn income.</p>
          {selected === 'worker' && (
            <div className="absolute top-4 right-4 bg-blue-600 rounded-full p-1 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleContinue}
        disabled={!selected}
        className={`mt-12 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
          selected ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Continue as {selected ? (selected === 'worker' ? 'Freelancer' : 'Client') : 'Selection'}
      </button>
    </div>
  );
};

export default RoleSelection;
