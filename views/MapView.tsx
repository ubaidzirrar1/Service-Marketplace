
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Worker, AppRoute } from '../types';

declare const L: any;

const DUMMY_WORKERS: Worker[] = [
  { id: 'w1', name: 'Zaid Ali', category: 'Plumber', rating: 4.8, reviewsCount: 30, distance: '500m', avatar: 'https://picsum.photos/seed/zaid/150', location: { lat: 33.6844, lng: 73.0479 }, verified: true, about: '', skills: [], portfolio: [] },
  { id: 'w2', name: 'Amna Khan', category: 'Web Designer', rating: 4.9, reviewsCount: 15, distance: '1.2km', avatar: 'https://picsum.photos/seed/amna/150', location: { lat: 33.6944, lng: 73.0579 }, verified: true, about: '', skills: [], portfolio: [] },
  { id: 'w3', name: 'Bob Smith', category: 'Electrician', rating: 4.5, reviewsCount: 22, distance: '2km', avatar: 'https://picsum.photos/seed/bob/150', location: { lat: 33.6744, lng: 73.0379 }, verified: false, about: '', skills: [], portfolio: [] },
];

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const navigate = useNavigate();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Default center Islamabad
    mapInstance.current = L.map(mapContainer.current).setView([33.6844, 73.0479], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    DUMMY_WORKERS.forEach(worker => {
      const marker = L.marker([worker.location.lat, worker.location.lng]).addTo(mapInstance.current);
      marker.on('click', () => {
        setSelectedWorker(worker);
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Search Bar Floating */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-[1000]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search workers in this area..." 
            className="w-full bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border-none focus:ring-4 focus:ring-blue-100 transition font-bold"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-5 rounded-xl font-bold hover:bg-blue-700">Search</button>
        </div>
      </div>

      {/* Selected Worker Info Card (Popup) */}
      {selectedWorker && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-[1000] animate-slide-up">
          <div className="bg-white rounded-[32px] p-6 shadow-2xl shadow-blue-200 border border-blue-100 flex items-center gap-4 relative overflow-hidden">
            <button 
              onClick={() => setSelectedWorker(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <img src={selectedWorker.avatar} alt="" className="w-16 h-16 rounded-2xl border-2 border-slate-100 shadow-sm object-cover" />
            
            <div className="flex-grow">
              <div className="flex items-center gap-1 mb-1">
                <h4 className="font-bold text-slate-800">{selectedWorker.name}</h4>
                {selectedWorker.verified && (
                   <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">{selectedWorker.category} • {selectedWorker.distance}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs font-black">★</span>
                  <span className="text-xs text-slate-800 font-black">{selectedWorker.rating}</span>
                </div>
                <Link 
                  to={AppRoute.PROFILE.replace(':id', selectedWorker.id)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
