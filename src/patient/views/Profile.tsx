import { EnvelopeIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function Profile() {
  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col items-center mt-8 mb-10">
        <div className="w-28 h-28 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mb-4">
          <UserCircleIcon className="w-28 h-28 text-[var(--color-primary-container)]" />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">John Doe</h1>
        <p className="text-sm font-body text-[var(--color-on-surface-variant)] mt-1">Patient ID: 987654321</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl flex items-center">
          <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4">
            <EnvelopeIcon className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-xs font-body text-[var(--color-on-surface-variant)]">Email Address</p>
            <p className="font-bold font-body text-[var(--color-on-surface)]">john.doe@example.com</p>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl flex items-center">
          <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4">
            <PhoneIcon className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-xs font-body text-[var(--color-on-surface-variant)]">Phone Number</p>
            <p className="font-bold font-body text-[var(--color-on-surface)]">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl flex items-center">
          <div className="w-10 h-10 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mr-4">
            <IdentificationIcon className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <div>
            <p className="text-xs font-body text-[var(--color-on-surface-variant)]">Date of Birth</p>
            <p className="font-bold font-body text-[var(--color-on-surface)]">May 15, 1985</p>
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <button className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] font-bold py-4 rounded-xl active:scale-95 transition-transform">
          Log Out
        </button>
      </div>
    </div>
  );
}
