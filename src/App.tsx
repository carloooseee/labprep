import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
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
              <Route path="seed" element={<SeedDatabase />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

