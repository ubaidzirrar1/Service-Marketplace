
import React, { useState, useEffect } from 'react';
import { Job, AppRoute } from '../types';
import { JobService, ProfileService } from '../services/api';

const WorkerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'my-jobs'>('feed');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [smartMatchOnly, setSmartMatchOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      const profile = await ProfileService.get();
      if (profile && profile.latitude !== 0 && profile.longitude !== 0) {
        // Fetch jobs within 15km
        const nearJobs = await JobService.getNearMe(profile.latitude, profile.longitude, 15);
        
        // Filter by category if smart match is on
        const filtered = smartMatchOnly 
          ? nearJobs.filter(j => j.category_id === profile.category_id)
          : nearJobs;

        setJobs(filtered);
      } else {
        const all = await JobService.getAll();
        setJobs(all);
      }
      setIsLoading(false);
    };
    loadJobs();
  }, [smartMatchOnly]);

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    alert(`Proposal for "${selectedJob.title}" submitted successfully!`);
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50">
      <aside className="hidden lg:flex w-80 bg-white border-r flex-col p-10 space-y-6">
        <div>
          <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-6">Expert Navigation</h4>
          <div className="space-y-3">
            <button onClick={() => setActiveTab('feed')} className={`w-full text-left px-6 py-4 rounded-[24px] font-black text-sm transition-all ${activeTab === 'feed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>Live Job Feed</button>
            <button onClick={() => setActiveTab('my-jobs')} className={`w-full text-left px-6 py-4 rounded-[24px] font-black text-sm transition-all ${activeTab === 'my-jobs' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>My Proposals</button>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-50">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-2">Total Earnings</p>
            <h3 className="text-3xl font-black mb-1">$4,850</h3>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V3a1 1 0 011 1v5a1 1 0 11-2 0V7.414l-4.293 4.293a1 1 0 01-1.414 0L8 9.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 8.586 14.586 5H12z" clipRule="evenodd"/></svg>
              +15% this month
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-14">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Available Work</h1>
            <p className="text-slate-500 font-bold mt-1">Smart matching based on your expertise and location.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3">Expert Matching</span>
             <button 
                onClick={() => setSmartMatchOnly(!smartMatchOnly)} 
                className={`w-14 h-7 rounded-full relative transition-all duration-500 ${smartMatchOnly ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-200'}`}
             >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm ${smartMatchOnly ? 'left-8' : 'left-1'}`} />
             </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-bold">Scanning local grid for relevant jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-[48px] p-20 text-center border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-slate-300 text-4xl">📭</div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">No Jobs Found</h3>
             <p className="text-slate-400 font-bold">Try expanding your search radius or turning off Smart Match.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-10 rounded-[48px] border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                {smartMatchOnly && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-bl-[24px]">
                    Perfect Fit
                  </div>
                )}
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100">{job.category_id}</span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                        {job.distance_km ? `${job.distance_km.toFixed(1)} km away` : 'Nearby'}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition tracking-tight">{job.title}</h3>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed line-clamp-2 max-w-3xl">{job.description}</p>
                    <div className="flex items-center gap-6 mt-8">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/150?u=${job.id}${i}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{job.applicants_count} BIDS</span>
                      </div>
                      <span className="text-slate-300 font-bold">•</span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">POSTED {job.posted_at}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0 md:min-w-[180px]">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                      <span className="text-4xl font-black text-slate-800 tracking-tight">{job.budget}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(job)} 
                      className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-lg hover:bg-blue-600 transition shadow-xl shadow-slate-200 active:scale-95 mt-8 md:mt-0"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Proposal Submission Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedJob(null)} />
          <div className="bg-white w-full max-w-2xl rounded-[56px] p-10 md:p-14 shadow-2xl relative z-10 animate-slide-up">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Your Proposal</h2>
              <p className="text-slate-500 font-bold">Project: <span className="text-blue-600">{selectedJob.title}</span></p>
            </div>
            
            <form onSubmit={handleBid} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Bid Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">$</span>
                    <input type="number" required placeholder="0.00" className="w-full pl-12 pr-6 py-5 rounded-[24px] bg-slate-50 border-none font-black text-xl text-slate-800 focus:ring-4 focus:ring-blue-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Estimated Time</label>
                  <select required className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border-none font-black text-lg text-slate-800 focus:ring-4 focus:ring-blue-100">
                    <option>Within 24 Hours</option>
                    <option>1-3 Days</option>
                    <option>Within a Week</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pitch Your Services</label>
                <textarea rows={5} required placeholder="Tell the client why you're the best fit for this job..." className="w-full p-8 rounded-[32px] bg-slate-50 border-none font-medium text-slate-600 leading-relaxed focus:ring-4 focus:ring-blue-100 resize-none" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button type="submit" className="flex-grow py-6 bg-blue-600 text-white rounded-[28px] font-black text-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">Submit My Proposal</button>
                <button type="button" onClick={() => setSelectedJob(null)} className="px-10 py-6 bg-slate-100 text-slate-400 rounded-[28px] font-black text-lg hover:bg-slate-200 active:scale-95 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
