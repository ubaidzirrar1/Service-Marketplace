
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute, Worker, Category } from '../types';
import { CategoryService } from '../services/api';

const FEATURED_WORKERS: Partial<Worker>[] = [
  { id: 'w1', name: 'Ahmed K.', category: 'Plumbing', rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=ahmed' },
  { id: 'w2', name: 'Sarah M.', category: 'Web Developer', rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'w3', name: 'Bilal H.', category: 'AC Repair', rating: 4.7, avatar: 'https://i.pravatar.cc/150?u=bilal' },
  { id: 'w4', name: 'Usman T.', category: 'Electrician', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=usman' },
];

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(CategoryService.getAll());
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        // Just checking permission for landing visuals
      });
    }
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <section className="relative pt-24 pb-32 px-4 md:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight animate-slide-up">
            Global Talent <br/><span className="text-indigo-600">Local Service</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Find certified professionals based on your exact coordinates. Trusted, verified, and always nearby.
          </p>

          <div className="relative max-w-4xl mx-auto bg-white rounded-[40px] p-4 shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-grow w-full flex items-center px-6 py-4 md:py-0 md:border-r border-slate-100">
              <svg className="w-6 h-6 text-slate-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="What service do you need?"
                className="w-full bg-transparent text-slate-800 focus:outline-none font-bold placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="w-full md:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[28px] font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 active:scale-95"
            >
              Find Experts
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Top Categories</h2>
            <p className="text-slate-500 font-bold">Most requested services this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.slice(0, 10).map(cat => (
            <div key={cat.id} className="group flex flex-col items-center cursor-pointer">
              <div className={`w-24 h-24 rounded-[32px] ${cat.color} flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-transparent group-hover:border-white/50 group-hover:shadow-xl`}>
                <i className={`fas ${cat.icon_class} text-3xl`}></i>
              </div>
              <span className="font-black text-slate-600 text-[11px] group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Nearby Professionals</h2>
              <p className="text-slate-500 font-bold">Trusted experts within your immediate radius.</p>
            </div>
            <Link to={AppRoute.MAP} className="text-indigo-600 font-black text-sm hover:underline flex items-center gap-1">
              Interactive Map <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {FEATURED_WORKERS.map(worker => (
              <div key={worker.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100">{worker.category}</span>
                </div>
                
                <h3 className="font-black text-2xl text-slate-800 mb-6 tracking-tight group-hover:text-indigo-600 transition">{worker.name}</h3>

                <div className="flex items-center gap-5 mb-10">
                  <img src={worker.avatar} alt="" className="w-16 h-16 rounded-[24px] object-cover shadow-lg group-hover:scale-105 transition" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 font-black text-lg">★</span>
                      <span className="text-lg font-black text-slate-800">{worker.rating}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Verified Expert</p>
                  </div>
                </div>

                <Link 
                  to={AppRoute.PROFILE.replace(':id', worker.id!)}
                  className="w-full py-5 bg-slate-50 rounded-[24px] text-center font-black text-slate-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-200 transition-all duration-500 text-sm"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
