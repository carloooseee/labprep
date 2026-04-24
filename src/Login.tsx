import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useAuth } from './context/AuthContext';
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

type AuthView = 'welcome' | 'signin' | 'signup';

export default function Login() {
  const [view, setView] = useState<AuthView>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('labprep_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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
      if (rememberMe) {
        localStorage.setItem('labprep_remembered_email', email);
      } else {
        localStorage.removeItem('labprep_remembered_email');
      }
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset password.');
      setSuccess('');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError('Failed to send reset email. Verify your email address.');
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

  const TestTubeIcon = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 2h6" />
      <path d="M10 2v17.5a2.5 2.5 0 0 0 5 0V2" />
      <path d="M10 14h5" />
    </svg>
  );

  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#417af0] to-[#27c463] flex flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 w-full max-w-sm">
          <div className="mb-10 relative animate-in zoom-in duration-700">
            <div className="relative animate-float">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <TestTubeIcon className="w-24 h-24 text-white" />
                <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 border-2 border-[#27c463]">
                  <div className="w-full h-full bg-[#27c463]/10 rounded-lg flex items-center justify-center border-2 border-[#27c463]">
                    <svg className="w-6 h-6 text-[#27c463]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-display font-black text-white tracking-tight mb-2 animate-in slide-in-from-bottom-4 duration-700">
            LabPrep
          </h1>
          <p className="text-xl font-bold tracking-widest text-white animate-in slide-in-from-bottom-4 duration-1000">
            Prepare Right. Test Right.
          </p>

          <div className="flex space-x-3 mt-20 animate-pulse">
            <div className="h-3 w-12 bg-white rounded-full shadow-lg shadow-white/20"></div>
            <div className="h-3 w-3 bg-white/40 rounded-full"></div>
            <div className="h-3 w-3 bg-white/40 rounded-full"></div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4 relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
          <button 
            onClick={() => setView('signup')}
            className="w-full py-4 bg-white text-[#417af0] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Get Started
          </button>
          <div className="text-center pt-2">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Already a member?</p>
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
    <div className="min-h-screen bg-gradient-to-b from-[#417af0] to-[#27c463] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs for depth */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-10 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        <button 
          onClick={() => setView('welcome')}
          className="mb-8 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-lg border border-white/30 active:scale-90 transition-all"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/20 p-8 md:p-10 border border-gray-100 animate-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TestTubeIcon className="w-8 h-8 text-[#417af0]" />
            </div>
            <h2 className="text-3xl font-display font-black text-gray-900 tracking-tight">
              {view === 'signin' ? 'Sign In Now' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium font-body">Please enter your details to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 animate-in fade-in slide-in-from-top-2 duration-300">
              <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider font-body">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-600 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircleIcon className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider font-body">{success}</p>
            </div>
          )}

          <form onSubmit={view === 'signin' ? handleLogin : handleSignUp} className="space-y-4">
            {view === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#417af0]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#417af0] transition-all outline-none font-bold font-body"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="relative">
              <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#417af0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#417af0] transition-all outline-none font-bold font-body"
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                  inputMode="email"
                />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#417af0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#417af0] transition-all outline-none font-bold font-body"
                  placeholder="Password"
                  required
                  autoComplete={view === 'signin' ? "current-password" : "new-password"}
                />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#417af0] transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {view === 'signup' && (
              <div className="relative">
                <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#417af0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent text-gray-900 text-sm focus:bg-white focus:border-[#417af0] transition-all outline-none font-bold font-body"
                  placeholder="Repeat Password"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {view === 'signin' && (
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-2 cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`w-4 h-4 rounded border-2 transition-colors flex items-center justify-center ${rememberMe ? 'bg-[#417af0] border-[#417af0]' : 'bg-white border-gray-200 group-hover:border-[#417af0]'}`}>
                    {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-body">Remember me</span>
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#417af0] font-body">Forgot Password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-blue-500/10 font-body ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#417af0] text-white hover:bg-blue-600'
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
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest font-body">
              {view === 'signin' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => {
                setView(view === 'signin' ? 'signup' : 'signin');
                setError('');
                setSuccess('');
              }}
              className="mt-2 text-[#417af0] font-black text-sm hover:underline font-display"
            >
              {view === 'signin' ? 'Sign Up from here' : 'Sign In from here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
