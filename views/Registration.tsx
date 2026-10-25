
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, AppRoute } from '../types';
import { AuthService } from '../services/api';

interface RegistrationProps {
  role: UserRole;
  onComplete: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ role, onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    latitude: 0,
    longitude: 0,
    locationDisplay: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 13) value = value.substring(0, 13);
    
    let masked = value;
    if (value.length > 5 && value.length <= 12) {
      masked = `${value.substring(0, 5)}-${value.substring(5)}`;
    } else if (value.length > 12) {
      masked = `${value.substring(0, 5)}-${value.substring(5, 12)}-${value.substring(12, 13)}`;
    }
    
    setFormData({ ...formData, cnic: masked });
  };

  const detectLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({ 
          ...formData, 
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationDisplay: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` 
        });
        setIsLoading(false);
      }, () => {
        alert("Unable to retrieve location.");
        setIsLoading(false);
      });
    } else {
      alert("Geolocation not supported.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Persist to "DB"
    await AuthService.register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cnic: formData.cnic,
      latitude: formData.latitude,
      longitude: formData.longitude,
      role: role
    });

    onComplete();
    if (role === 'worker') {
      navigate(AppRoute.VERIFICATION);
    } else {
      navigate(AppRoute.CLIENT_DASHBOARD);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] overflow-hidden bg-white">
      <div className="hidden lg:block w-1/2 bg-[#6366f1] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/reg/1200/800')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Global Connectivity.</h2>
          <p className="text-xl text-blue-100 max-w-md text-center">
            Register your coordinates and join a worldwide network of professionals.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Register as a <span className="text-indigo-600 font-bold capitalize">{role}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-100 transition font-bold" 
                placeholder="e.g. Ali Ahmed"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-100 transition font-bold" 
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-100 transition font-bold" 
                  placeholder="+92 XXX XXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">CNIC Number</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-100 transition font-bold" 
                placeholder="XXXXX-XXXXXXX-X"
                value={formData.cnic}
                onChange={handleCnicChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Location (Longs/Lats)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  required
                  className="flex-grow px-5 py-4 rounded-2xl bg-slate-100 border-none font-bold text-slate-500" 
                  placeholder="Detect my coordinates"
                  value={formData.locationDisplay}
                />
                <button 
                  type="button"
                  onClick={detectLocation}
                  className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 mt-4 active:scale-95"
            >
              Initialize Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
