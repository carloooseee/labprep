import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
    
    // Temporarily hardcoded authentication flow
    if (username.toLowerCase() === 'admin') {
      navigate('/admin/dashboard');
    } else if (username.toLowerCase() === 'patient') {
      navigate('/patient/home');
    } else {
      setError('Invalid credentials. Use "admin" or "patient".');
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="glass max-w-sm w-full rounded-2xl shadow-2xl p-8 transform transition-all">
        <h1 className="text-3xl font-display font-bold text-center mb-8 text-gray-800">
          Welcome to LabPrep
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white/50 backdrop-blur-sm"
              placeholder="Enter patient or admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white/50 backdrop-blur-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0050d4] hover:bg-[#003da1] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Demo accounts:</p>
          <p className="font-medium mt-1">Username: <strong>admin</strong> | <strong>patient</strong></p>
          <p className="font-medium">Password: Any password works</p>
        </div>
      </div>
    </div>
  );
}
