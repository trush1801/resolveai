import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
        role
      });

      const data = response.data;
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token);
      
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'agent') navigate('/dashboard');
      else navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration processing failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
      {/* Ambient Glowing Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full filter blur-[90px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md border border-gray-800 p-8 rounded-xl shadow-2xl relative z-10">
        
        {/* Navigation Link Back to Home */}
        <Link to="/" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors mb-6 group">
          <span className="mr-1 transform group-hover:-translate-x-0.5 transition-transform">←</span> 
          Back to Home
        </Link>

        <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Create Account</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Join Resolve-AI Core Platform Infrastructure</p>

        {error && <div className="mb-4 p-3 bg-red-900/40 border border-red-500 text-red-200 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Account Role Setup (Dev Mode)</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition">
              <option value="customer">Customer (Chat Engine Interface)</option>
              <option value="agent">Support Agent (Queue Center Console)</option>
              <option value="admin">System Administrator (Global Panel Config)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-lg transition mt-6 shadow-lg shadow-emerald-600/10">
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already registered? <Link to="/login" className="text-blue-500 hover:underline">Sign In here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;