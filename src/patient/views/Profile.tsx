import { EnvelopeIcon, PhoneIcon, IdentificationIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { profile, signOut } = useAuth();

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col items-center mt-8 mb-10">
        <div className="w-28 h-28 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mb-4">
          <UserCircleIcon className="w-28 h-28 text-[var(--color-primary-container)]" />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">
          {profile?.displayName || 'Patient'}
        </h1>
        <p className="text-sm font-body text-[var(--color-on-surface-variant)] mt-1 tracking-widest uppercase font-bold">
          {profile?.role === 'patient' ? 'Patient Portal' : 'Administrator'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl border border-[#e5e9eb] flex items-center shadow-sm">
          <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4">
            <EnvelopeIcon className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-xs font-body text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">Email Address</p>
            <p className="font-bold font-body text-[var(--color-on-surface)]">{profile?.email}</p>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl border border-[#e5e9eb] flex items-center shadow-sm">
          <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4">
            <IdentificationIcon className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-xs font-body text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold">User UID</p>
            <p className="font-mono text-[10px] text-[var(--color-on-surface)] truncate max-w-[200px]">{profile?.uid}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-[#e5e9eb]">
        <button 
          onClick={() => signOut()}
          className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center border border-red-100 shadow-sm"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

