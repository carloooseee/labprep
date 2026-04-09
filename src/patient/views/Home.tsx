import { Link } from 'react-router-dom';
import { 
  SparklesIcon,
  EllipsisHorizontalCircleIcon, 
  BuildingOfficeIcon, 
  BellAlertIcon,
  UserIcon,
  BeakerIcon,
  DocumentTextIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <div className="pt-8 pb-24 relative overflow-hidden">
      {/* Top Background Decoration */}
      <div className="absolute top-[-50px] left-0 right-0 h-64 gradient-primary opacity-5 transform -skew-y-3 z-0" />

      <div className="relative z-10 px-6">
        <header className="mb-10 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold font-display text-[var(--color-primary)] tracking-tight mb-1">LabPrep</h1>
            <p className="text-xs font-body text-[var(--color-on-surface-variant)] font-semibold uppercase tracking-widest">Prepare Right. Test Right.</p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <Link to="/patient/hospitals" className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e9eb] shadow-sm hover:scale-105 transition-transform">
              <BuildingOfficeIcon className="w-6 h-6 text-[var(--color-primary)]" />
            </Link>
            <Link to="/patient/notifications" className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e9eb] shadow-sm hover:scale-105 transition-transform">
              <BellAlertIcon className="w-6 h-6 text-emerald-600" />
            </Link>
          </div>
        </header>

        {/* Hero Card */}
        <div className="bg-gradient-to-r from-[#417af0] to-[#27c463] rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><SparklesIcon className="w-24 h-24" /></div>
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider backdrop-blur-md">Good Afternoon!</span>
            <h2 className="text-3xl font-display font-bold mt-4 leading-tight">Welcome</h2>
            <div className="flex items-center mt-6 space-x-2">
              <span className="font-body text-sm font-medium">Ready to prepare for your next test?</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Actions</h3>
        <div className="flex flex-col space-y-3">
          <Link to="/patient/profile" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-blue-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Profile</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
          
          {/* <Link to="/patient/hospitals" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-emerald-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <BeakerIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Test</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link> */}
          
          <Link to="/patient/test-guides" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-purple-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Test Guides</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link to="/patient/notifications" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-amber-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <BellAlertIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Reminders</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Popular Test Guides Section */}
        <div className="mt-10 mb-4 flex justify-between items-end">
          <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)]">Popular Guides</h3>
          <Link to="/patient/test-guides" className="text-sm font-bold text-[var(--color-primary)]">See all</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pb-2">
          <Link to="/patient/test-guides" className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] transition-transform active:scale-95 flex flex-col h-full">

            <h4 className="font-bold font-display text-gray-800 text-sm leading-tight mb-1">Urinalysis</h4>
            <p className="text-[11px] font-body text-[var(--color-on-surface-variant)] leading-snug flex-grow">A test of your urine to check for UTIs, kidney issues, or diabetes.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-block bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Urine Test
              </span>
              <span className="inline-block bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                No Fasting
              </span>
            </div>
          </Link>

          <Link to="/patient/test-guides" className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] transition-transform active:scale-95 flex flex-col h-full">

            <h4 className="font-bold font-display text-gray-800 text-sm leading-tight mb-1">Fasting Blood Sugar</h4>
            <p className="text-[11px] font-body text-[var(--color-on-surface-variant)] leading-snug flex-grow">Measures your blood sugar after an overnight fast for diabetes.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-block bg-rose-50 text-rose-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Blood Test
              </span>
              <span className="inline-block bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Fasting Required
              </span>
            </div>
          </Link>

          <Link to="/patient/test-guides" className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] transition-transform active:scale-95 flex flex-col h-full">

            <h4 className="font-bold font-display text-gray-800 text-sm leading-tight mb-1">Complete Blood Count</h4>
            <p className="text-[11px] font-body text-[var(--color-on-surface-variant)] leading-snug flex-grow">Evaluates your overall health and detects a wide range of disorders.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-block bg-rose-50 text-rose-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Blood Test
              </span>
              <span className="inline-block bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                No Fasting
              </span>
            </div>
          </Link>

          <Link to="/patient/test-guides" className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] transition-transform active:scale-95 flex flex-col h-full">

            <h4 className="font-bold font-display text-gray-800 text-sm leading-tight mb-1">Lipid Profile</h4>
            <p className="text-[11px] font-body text-[var(--color-on-surface-variant)] leading-snug flex-grow">A complete test measuring the amount of cholesterol and triglycerides.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-block bg-rose-50 text-rose-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Blood Test
              </span>
              <span className="inline-block bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Fasting Required
              </span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
