import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerChat from './pages/CustomerChat';
import SupportDashboard from './pages/SupportDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
        {/* Navigation Core Shell header */}
        <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-2 bg-gradient-to-b from-blue-500 to-indigo-600 rounded" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              ResolveAI
            </h1>
          </div>
          <nav className="flex space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-indigo-400 hover:scale-105 transition-all">Chat Hub</Link>
            <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-indigo-400 hover:scale-105 transition-all">Analytics Dashboard</Link>
            <Link to="/admin" className="text-sm font-medium text-slate-400 hover:text-indigo-400 hover:scale-105 transition-all">Control Panel</Link>
          </nav>
        </header>
        
        {/* Layout Mounting Viewport Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:py-10">
          <Routes>
            <Route path="/" element={<CustomerChat />} />
            <Route path="/dashboard" element={<SupportDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;