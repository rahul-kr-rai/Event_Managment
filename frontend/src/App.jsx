import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Import Pages
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import AdminRegistrations from './pages/AdminRegistrations';
import AdminUsers from './pages/AdminUsers';
import ResetPassword from './pages/ResetPassword';

// --- CRITICAL FIX FOR REACT-QUILL (WHITE SCREEN ISSUE) ---
// This defines 'global' so the text editor doesn't crash the app
if (typeof window !== 'undefined') {
  window.global = window;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path="edit/:id" element={<EditEvent />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;