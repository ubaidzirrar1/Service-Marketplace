
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState({
    front: false,
    back: false,
    selfie: false
  });

  const handleUpload = (key: keyof typeof uploads) => {
    // Simulated upload
    setUploads({ ...uploads, [key]: true });
  };

  const isComplete = uploads.front && uploads.back && uploads.selfie;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Identity Verification</h1>
        <p className="text-slate-500">To build trust in our community, we require all workers to verify their identity.</p>
      </div>

      <div className="space-y-8">
        {/* CNIC Front */}
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition cursor-pointer" onClick={() => handleUpload('front')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${uploads.front ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                {uploads.front ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">CNIC / ID Front</h3>
                <p className="text-slate-400 text-sm">Clear photo of the front side</p>
              </div>
            </div>
            {uploads.front && <span className="text-green-600 font-bold text-sm">Uploaded</span>}
          </div>
        </div>

        {/* CNIC Back */}
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition cursor-pointer" onClick={() => handleUpload('back')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${uploads.back ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                 {uploads.back ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">CNIC / ID Back</h3>
                <p className="text-slate-400 text-sm">Clear photo of the back side</p>
              </div>
            </div>
            {uploads.back && <span className="text-green-600 font-bold text-sm">Uploaded</span>}
          </div>
        </div>

        {/* Selfie */}
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition cursor-pointer" onClick={() => handleUpload('selfie')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${uploads.selfie ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                 {uploads.selfie ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Selfie with ID</h3>
                <p className="text-slate-400 text-sm">Hold your ID next to your face</p>
              </div>
            </div>
            {uploads.selfie && <span className="text-green-600 font-bold text-sm">Uploaded</span>}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p className="text-sm text-blue-700 leading-relaxed">
          Your data is encrypted and stored securely. Verification typically takes 12-24 hours. You can still set up your profile while waiting.
        </p>
      </div>

      <button 
        disabled={!isComplete}
        onClick={() => navigate(AppRoute.WORKER_DASHBOARD)}
        className={`w-full py-5 rounded-2xl font-extrabold text-lg transition shadow-2xl mt-12 ${
          isComplete ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Submit for Review
      </button>
    </div>
  );
};

export default Verification;
