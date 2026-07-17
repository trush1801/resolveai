import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home'; // Import the new home page
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import SupportDashboard from './pages/SupportDashboard';
import CustomerChat from './pages/CustomerChat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Authentication Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-Enforced Protected Application Dashboards */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['agent', 'admin']}>
              <SupportDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute allowedRoles={['customer', 'agent', 'admin']}>
              <CustomerChat />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;