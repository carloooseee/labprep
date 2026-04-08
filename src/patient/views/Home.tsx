import { UserCircleIcon, CalendarIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <div className="pt-8 pb-24 relative overflow-hidden">
      {/* Top Background Decoration */}
      <div className="absolute top-[-50px] left-0 right-0 h-64 gradient-primary opacity-5 transform -skew-y-3 z-0" />

      <div className="relative z-10 px-6">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <p className="text-sm font-body text-[var(--color-on-surface-variant)] font-semibold uppercase tracking-widest mb-1">Good Morning</p>
            <h1 className="text-4xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">John Doe</h1>
          </div>
          <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container-low)] flex flex-shrink-0 items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <UserCircleIcon className="w-14 h-14 text-[var(--color-primary-container)]" />
          </div>
        </header>

        {/* Hero Card */}
        <div className="gradient-primary rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><EllipsisHorizontalCircleIcon className="w-24 h-24" /></div>
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">Upcoming Test</span>
            <h2 className="text-3xl font-display font-bold mt-4 leading-tight">Fasting Blood Sugar</h2>
            <div className="flex items-center mt-6 space-x-2">
              <CalendarIcon className="w-5 h-5 opacity-90" />
              <span className="font-body text-sm font-medium">Tomorrow, 08:00 AM</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform shadow-sm">
            <div className="w-10 h-10 bg-[var(--color-secondary-container)] rounded-full flex items-center justify-center mb-3">
              <span className="text-[var(--color-secondary)] font-bold text-lg">H</span>
            </div>
            <span className="font-bold font-display text-sm">Find Hospital</span>
          </button>
          <button className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl text-left hover:scale-[1.02] transition-transform shadow-sm">
            <div className="w-10 h-10 bg-[var(--color-primary-container)] rounded-full flex items-center justify-center mb-3">
              <span className="text-[var(--color-primary)] font-bold text-lg">G</span>
            </div>
            <span className="font-bold font-display text-sm">View Guides</span>
          </button>
        </div>
      </div>
    </div>
  );
}
