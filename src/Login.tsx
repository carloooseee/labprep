import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from './context/AuthContext';
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  BeakerIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

type AuthView = 'welcome' | 'signin' | 'signup';

export default function Login() {
  const [view, setView] = useState<AuthView>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Handle redirection once profile is loaded
  useEffect(() => {
    if (profile) {
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (profile.role === 'patient') {
        navigate('/patient/home');
      }
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-[#3b82f6] flex flex-col items-center justify-between p-10 relative overflow-hidden">
        {/* Fluid Background Effect */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-24 h-24 mb-10 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-full h-full animate-pop">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl animate-float">
                <BeakerIcon className="w-12 h-12 text-[#3b82f6]" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-display font-black text-white mb-4 tracking-tight">
            Welcome to LabPrep
          </h1>
          <p className="text-blue-100 text-lg max-w-xs font-body leading-relaxed">
            Your premium health preparation companion. Simple, secure, and reliable.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => setView('signup')}
            className="w-full py-4 bg-white text-[#3b82f6] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Sign Up
          </button>
          <div className="text-center pt-2">
            <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest mb-1">Already a member?</p>
            <button 
              onClick={() => setView('signin')}
              className="text-white font-black text-base hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#3b82f6] h-64 relative overflow-hidden rounded-b-[4rem] shadow-lg shrink-0">
        {/* Subtle Fluid Effect in Header */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
        
        <button 
          onClick={() => setView('welcome')}
          className="absolute top-8 left-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all z-20"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <BeakerIcon className="w-64 h-64 text-white animate-float" />
        </div>
        
        <div className="relative h-full flex items-center justify-center pt-8">
          <div className="animate-pop">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 animate-float">
              <BeakerIcon className="w-10 h-10 text-[#3b82f6]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 -mt-12 pb-12 overflow-y-auto">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl shadow-blue-500/5 p-8 md:p-10 border border-gray-100 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-gray-900 tracking-tight">
              {view === 'signin' ? 'Sign In Now' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">Please enter your details to continue</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center animate-in zoom-in-95 duration-200">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 shrink-0"></span>
              {error}
            </div>
          )}

          <form onSubmit={view === 'signin' ? handleLogin : handleSignUp} className="space-y-5">
            {view === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#3b82f6] transition-all outline-none font-bold"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="relative">
              <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#3b82f6] transition-all outline-none font-bold"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#3b82f6] transition-all outline-none font-bold"
                placeholder="Password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3b82f6] transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {view === 'signup' && (
              <div className="relative">
                <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3b82f6]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#3b82f6] transition-all outline-none font-bold"
                  placeholder="Repeat Password"
                  required
                />
              </div>
            )}

            {view === 'signin' && (
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border-2 border-gray-200 group-hover:border-[#3b82f6] transition-colors bg-white"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remember me</span>
                </label>
                <button type="button" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#3b82f6]">Forgot Password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-blue-500/10 ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#3b82f6] text-white hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Processing...
                </div>
              ) : view === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              {view === 'signin' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => {
                setView(view === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="mt-2 text-[#3b82f6] font-black text-sm hover:underline"
            >
              {view === 'signin' ? 'Sign Up from here' : 'Sign In from here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
