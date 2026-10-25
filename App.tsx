
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import RoleSelection from './views/RoleSelection';
import Registration from './views/Registration';
import Verification from './views/Verification';
import WorkerDashboard from './views/WorkerDashboard';
import ClientDashboard from './views/ClientDashboard';
import PostJob from './views/PostJob';
import MapView from './views/MapView';
import Settings from './views/Settings';
import WorkerProfile from './views/WorkerProfile';
import InboxView from './views/InboxView';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import { UserRole, AppRoute } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync with local storage or state
  useEffect(() => {
    const savedRole = localStorage.getItem('app_role') as UserRole;
    if (savedRole) {
      setRole(savedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('app_role', newRole);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen pb-20 md:pb-0">
        <Navbar role={role} setRole={handleSetRole} />
        
        <main className="flex-grow">
          <Routes>
            <Route path={AppRoute.HOME} element={<LandingPage />} />
            <Route path={AppRoute.ROLE_SELECTION} element={<RoleSelection onSelect={handleSetRole} />} />
            <Route path={AppRoute.REGISTER} element={<Registration role={role} onComplete={() => setIsAuthenticated(true)} />} />
            <Route path={AppRoute.VERIFICATION} element={<Verification />} />
            <Route path={AppRoute.WORKER_DASHBOARD} element={<WorkerDashboard />} />
            <Route path={AppRoute.CLIENT_DASHBOARD} element={<ClientDashboard />} />
            <Route path={AppRoute.POST_JOB} element={<PostJob />} />
            <Route path={AppRoute.MAP} element={<MapView />} />
            <Route path={AppRoute.SETTINGS} element={<Settings />} />
            <Route path={AppRoute.PROFILE} element={<WorkerProfile />} />
            <Route path={AppRoute.INBOX} element={<InboxView />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {role !== 'guest' && <BottomNav role={role} />}
      </div>
    </Router>
  );
};

export default App;
