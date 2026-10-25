
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute, Job, Proposal } from '../types';
import { JobService } from '../services/api';

const ClientDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Job[]>([]);
  const [viewingProposals, setViewingProposals] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      const allJobs = await JobService.getAll();
      // Filter for jobs posted by "me" (mocked client ID)
      setPosts(allJobs.filter(j => j.client_id === 'me' || j.client_id === 'c1'));
      setIsLoading(false);
    };
    loadJobs();
  }, []);

  const handleAcceptProposal = (jobId: string, proposalId: string) => {
    setPosts(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'in-progress' as const,
          proposals: job.proposals?.map(p => p.id === proposalId ? { ...p, status: 'accepted' as const } : { ...p, status: 'rejected' as const })
        };
      }
      return job;
    }));
    setViewingProposals(null);
    alert("Worker hired! They have been notified.");
  };

  const totalSpent = posts.reduce((acc, job) => job.status === 'completed' ? acc + job.budget_numeric : acc, 0);
  const activeHires = posts.filter(job => job.status === 'in-progress').length;

  return (
    <div className="bg-slate-50 min-h-screen relative pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Projects</h1>
          <p className="text-slate-500">Manage your active jobs and recently hired professionals.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Active Job Posts</h2>
            
            {isLoading ? (
               <div className="flex items-center justify-center p-20 animate-pulse text-slate-300">Loading your projects...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${post.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {post.status}
                        </span>
                        <span className="font-extrabold text-slate-800">{post.budget}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-2">{post.title}</h3>
                      <p className="text-xs text-slate-400 mb-6 line-clamp-3">{post.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <img key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src={`https://picsum.photos/seed/w${i}${post.id}/40`} alt="" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-bold">{post.applicants_count} applicants</span>
                      </div>
                      {post.status === 'open' ? (
                        <button 
                          onClick={() => setViewingProposals(post)}
                          className="text-blue-600 font-extrabold text-sm hover:text-blue-700 transition"
                        >
                          Review Bids
                        </button>
                      ) : (
                        <span className="text-blue-600 font-bold text-sm">In Progress</span>
                      )}
                    </div>
                  </div>
                ))}
                
                <Link to={AppRoute.POST_JOB} className="bg-white border-4 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center p-8 group hover:border-blue-200 transition min-h-[220px]">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                  </div>
                  <span className="font-bold text-slate-400 group-hover:text-blue-600 transition">Post New Job</span>
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-800">Quick Stats</h2>
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Spent total</p>
                  <p className="text-3xl font-black text-slate-800">${totalSpent || '0'}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15m0 1v-8m0 0V7"/></svg>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Active Hires</p>
                  <p className="text-3xl font-black text-slate-800">{activeHires}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Modal */}
      {viewingProposals && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Applicants for: {viewingProposals.title}</h2>
                <p className="text-slate-500 text-sm">Review bids and hire the best professional.</p>
              </div>
              <button 
                onClick={() => setViewingProposals(null)}
                className="p-3 bg-white rounded-2xl border border-slate-100 hover:border-blue-400 transition"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              {viewingProposals.proposals?.length ? viewingProposals.proposals.map(proposal => (
                <div key={proposal.id} className="bg-white p-8 rounded-[32px] border border-slate-100 hover:border-blue-100 shadow-sm transition flex flex-col md:flex-row gap-8">
                  <div className="md:w-48 flex flex-col items-center text-center">
                    <img src={proposal.worker_avatar} className="w-24 h-24 rounded-[32px] mb-4 shadow-lg border-2 border-white" alt="" />
                    <h4 className="font-bold text-slate-800">{proposal.worker_name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-xs font-bold">★</span>
                      <span className="text-xs text-slate-800 font-bold">{proposal.worker_rating}</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="bg-blue-50 px-4 py-2 rounded-xl">
                        <p className="text-[10px] text-blue-400 font-bold uppercase">Bid Amount</p>
                        <p className="font-black text-blue-600 text-lg">{proposal.bid_amount}</p>
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Timeline</p>
                        <p className="font-black text-slate-800 text-lg">{proposal.delivery_time}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">"{proposal.cover_letter}"</p>
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleAcceptProposal(viewingProposals.id, proposal.id)}
                        className="flex-grow bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                      >
                        Hire Professional
                      </button>
                      <button className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition">
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-bold italic">No proposals received yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAB Mobile */}
      <Link 
        to={AppRoute.POST_JOB} 
        className="fixed bottom-20 right-6 md:hidden w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-400 flex items-center justify-center animate-bounce z-40"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
      </Link>
    </div>
  );
};

export default ClientDashboard;
