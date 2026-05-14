import { useState, useEffect } from 'react';
import { ArrowLeftIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function GeneralGuidelines() {
  const navigate = useNavigate();
  const [guidelines, setGuidelines] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'generalGuidelines'));
        if (snap.exists()) {
          setGuidelines(snap.data());
        }
      } catch (err) {
        console.error("Error fetching guidelines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuidelines();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-surface)]">
        <ArrowPathIcon className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body bg-[var(--color-surface)] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors mr-4"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-display font-bold text-gray-900">General Guidelines</h2>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><DocumentTextIcon className="w-24 h-24" /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mt-4 leading-tight">What to Do</h2>
          <div className="flex items-center mt-6 space-x-2">
            <span className="font-body text-sm font-medium opacity-90">General preparations for all laboratory tests.</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <h3 className="font-bold font-display text-lg mb-4 text-gray-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            General Rules
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {guidelines?.rules || 'No general rules set yet.'}
          </p>
        </div>

        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50 shadow-sm transition-all hover:shadow-md">
          <h3 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Do's
          </h3>
          <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">
            {guidelines?.dos || "No Do's set yet."}
          </p>
        </div>

        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100/50 shadow-sm transition-all hover:shadow-md">
          <h3 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            Don'ts
          </h3>
          <p className="text-sm text-red-900 leading-relaxed whitespace-pre-wrap">
            {guidelines?.donts || "No Don'ts set yet."}
          </p>
        </div>

      </div>

    </div>
  );
}
