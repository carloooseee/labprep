import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { AppProvider } from './patient/context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Views
import Login from './Login';

// Patient Views
import Layout from './patient/components/Layout';
import Home from './patient/views/Home';
import HospitalPicker from './patient/views/HospitalPicker';
import TestGuides from './patient/views/TestGuides';
import Notifications from './patient/views/Notifications';
import Profile from './patient/views/Profile';
import GeneralGuidelines from './patient/views/GeneralGuidelines';

// Admin Views
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/views/Dashboard';
import AdminHospitals from './admin/views/Hospitals';
import AdminPatients from './admin/views/Patients';
import AdminProcedures from './admin/views/Procedures';
import AdminNotifications from './admin/views/Notifications';
import AdminSettings from './admin/views/Settings';
import SeedDatabase from './admin/views/SeedDatabase';

// Protected Route Component
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'patient' }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && profile?.role !== role) {
    // Redirect to their own home if they try to cross-access
    return <Navigate to={profile?.role === 'admin' ? "/admin/dashboard" : "/patient/home"} replace />;
  }

  return <>{children}</>;
}

// Hardware back button handler (Android)
function HardwareBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = CapApp.addListener('backButton', () => {
      // Check if any modal or overlay is open (usually has .fixed.inset-0)
      const hasModal = document.querySelector('.fixed.inset-0');
      if (hasModal) {
        window.dispatchEvent(new CustomEvent('hardwareBackButton'));
        return;
      }

      // Home screens — exit the app
      const exitPaths = ['/patient/home', '/admin/dashboard', '/login'];
      if (exitPaths.includes(location.pathname)) {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      handler.then(h => h.remove());
    };
  }, [navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <HardwareBackButton />
          <Routes>
            {/* Default Redirect to Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Patient Application Routes */}
            <Route path="/patient" element={
              <ProtectedRoute role="patient">
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="home" element={<Home />} />
              <Route path="hospitals" element={<HospitalPicker />} />
              <Route path="test-guides" element={<TestGuides />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="general-guidelines" element={<GeneralGuidelines />} />
            </Route>

            {/* Admin Application Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="hospitals" element={<AdminHospitals />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="procedures" element={<AdminProcedures />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public Migration Route */}
            <Route path="/seed" element={<SeedDatabase />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

