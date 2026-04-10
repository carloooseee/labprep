import { useState } from 'react';
import { seedFirestore } from '../../utils/migration';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function SeedDatabase() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setStatus('loading');
    setError(null);
    const result = await seedFirestore();
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setError(result.error?.toString() || 'Unknown error');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Database Migration</h1>
      <p className="text-gray-500 mb-8">
        This utility will populate your Firestore database with the initial hospitals, global test guides, 
        and user profiles defined in the definitive schema.
      </p>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
        {status === 'idle' && (
          <button
            onClick={handleSeed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-3"
          >
            <span>Run Initial Seeding</span>
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="font-bold text-gray-700">Seeding in progress...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4 text-emerald-600">
            <CheckCircleIcon className="w-16 h-16" />
            <p className="font-bold text-xl">Database Seeded Successfully!</p>
            <p className="text-gray-500 text-sm">You can now view dynamic data in the app.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4 text-rose-600">
            <ExclamationCircleIcon className="w-16 h-16" />
            <p className="font-bold text-xl">Seeding Failed</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="text-left bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">Important Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-2 list-disc pl-5 font-medium">
          <li>Ensure your Firestore Security Rules are in "Test Mode" or allow Admin writes.</li>
          <li>This script uses your production Firebase config.</li>
          <li>It will overwrite documents with IDs defined in `seedData.ts`.</li>
        </ul>
      </div>
    </div>
  );
}
