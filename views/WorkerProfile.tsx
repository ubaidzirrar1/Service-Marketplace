
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ProfileService, AuthService } from '../services/api';

const WorkerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews'>('portfolio');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const currentProfile = await ProfileService.get();
      setUser(currentProfile);
    };
    loadProfile();
  }, []);

  const handleToggleAvailability = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      is_online: !user.is_online
    };
    
    setUser(updatedUser);
    AuthService.updateProfile(updatedUser);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Profile Info Card */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-8 relative">
            {/* Edit Pencil Icon (Card Level) */}
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>

            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${user.is_online ? 'border-emerald-100' : 'border-slate-100'} bg-white flex items-center justify-center transition-colors duration-500`}>
                  <img src={user.avatar} className="w-28 h-28 rounded-full object-cover" alt={user.name} />
                </div>
                
                {/* Status Dot */}
                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${user.is_online ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'} transition-all duration-500`}></div>

                {/* Camera Icon Button */}
                <button className="absolute -bottom-2 -left-2 bg-white border border-slate-200 p-1.5 rounded-full text-slate-400 shadow-sm hover:text-slate-600 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{user.name}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Certified Provider</p>
            </div>

            {/* Stats List */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>From</span>
                </div>
                <span className="text-slate-800 font-bold">Pakistan</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  <span>Member since</span>
                </div>
                <span className="text-slate-800 font-bold">{user.member_since}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Avg. Response</span>
                </div>
                <span className="text-slate-800 font-bold">{user.avg_response}</span>
              </div>
            </div>

            {/* Availability Box */}
            <div className="mt-8 border-t border-slate-50 pt-6">
              <div 
                className={`rounded-2xl p-4 flex flex-col gap-3 transition-all duration-500 border ${user.is_online ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_online ? 'text-emerald-600' : 'text-slate-400'}`}>
                    Current Status
                  </span>
                  <div 
                    onClick={handleToggleAvailability}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-500 ${user.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500 ${user.is_online ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className={`text-sm font-black tracking-tight ${user.is_online ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {user.is_online ? 'Available for Jobs' : 'Away / Offline'}
                  </span>
                </div>
                <p className={`text-[9px] font-bold leading-tight ${user.is_online ? 'text-emerald-600/70' : 'text-slate-400'}`}>
                  {user.is_online 
                    ? 'You are visible to clients nearby. New job alerts are active.' 
                    : 'You are hidden from the map. Switch to online to receive job requests.'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Setup Card */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">Profile Setup</h3>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[70%]" />
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Description</h3>
              <button className="text-[11px] font-medium text-blue-500 hover:underline">Edit Description</button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
              {user.bio || "Write something about yourself to attract clients..."}
            </p>
          </div>

          {/* Skills Card */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Skills</h3>
              <button className="text-[11px] font-medium text-blue-500 hover:underline">Add New</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.length > 0 ? user.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-600">
                  {skill}
                </span>
              )) : (
                <div className="text-slate-300 text-[10px] font-bold italic py-2">No skills added yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* System Update Blue Box */}
          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded p-5 flex gap-4">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1e40af] mb-1">System Update</h4>
              <p className="text-xs text-[#1e40af] leading-relaxed">
                We've updated our terms of service and added new features to help you get more jobs. Check your notifications for details.
              </p>
            </div>
          </div>

          {/* Tabs Card Section */}
          <div className="bg-white border border-slate-200 rounded shadow-sm min-h-[450px] flex flex-col overflow-hidden">
            <div className="border-b border-slate-100 flex px-8">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`py-5 px-1 text-sm font-bold relative mr-8 transition-colors ${activeTab === 'portfolio' ? 'text-blue-600' : 'text-slate-400'}`}
              >
                Portfolio
                {activeTab === 'portfolio' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`py-5 px-1 text-sm font-bold relative transition-colors ${activeTab === 'reviews' ? 'text-blue-600' : 'text-slate-400'}`}
              >
                Reviews
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            </div>
            
            <div className="flex-grow p-10 bg-white">
              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.portfolio.length > 0 ? user.portfolio.map(item => (
                    <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                      <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                        <p className="text-white font-black text-sm">{item.title}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full h-[300px] flex flex-col items-center justify-center border-4 border-dashed border-slate-50 rounded-[40px] text-slate-300">
                      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span className="font-bold text-sm">Add your best work to attract clients</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Job Activities Card */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Job Activities & Alerts</h3>
            <div className="mt-8 flex flex-col gap-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center text-slate-400 italic text-xs font-medium">
                No recent activity to show. Start applying for jobs to see updates here!
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkerProfile;
