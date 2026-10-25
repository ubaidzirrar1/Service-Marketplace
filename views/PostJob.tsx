
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { optimizeJobDescription } from '../services/geminiService';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    location: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleOptimize = async () => {
    if (!formData.title || !formData.description) {
      alert("Please provide a title and draft description first.");
      return;
    }
    setIsOptimizing(true);
    const optimized = await optimizeJobDescription(formData.title, formData.description);
    setFormData(prev => ({ ...prev, description: optimized }));
    setIsOptimizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Job Posted Successfully!");
    navigate(AppRoute.CLIENT_DASHBOARD);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex flex-col items-center gap-2 ${step >= i ? 'text-blue-600' : 'text-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">What do you need?</h2>
            <div className="space-y-6">
              <input type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none font-bold" placeholder="Job Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <select className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none font-bold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Web Dev">Web Dev</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Details</h2>
              {/* Fix: Removed duplicate onClick attribute and invalid handleAiBio reference */}
              <button 
                type="button" 
                className="text-[10px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? 'Optimizing...' : '✨ Optimize Description'}
              </button>
            </div>
            <div className="space-y-6">
              <textarea rows={6} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none font-medium text-slate-600 leading-relaxed" placeholder="Description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <input type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none font-bold" placeholder="Budget ($)" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Location</h2>
            <input type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none font-bold" placeholder="Address" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
        )}

        <div className="mt-12 flex justify-between">
          {step > 1 ? <button onClick={prevStep} className="px-8 py-4 font-bold text-slate-500">Back</button> : <div />}
          {step < 3 ? <button onClick={nextStep} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold">Next</button> : <button onClick={handleSubmit} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold">Post Job</button>}
        </div>
      </div>
    </div>
  );
};

export default PostJob;
