import { Link, Outlet, NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  BellAlertIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid, 
  BuildingOfficeIcon as BuildingSolid, 
  DocumentTextIcon as DocumentSolid, 
  BellAlertIcon as BellSolid, 
  UserIcon as UserSolid 
} from '@heroicons/react/24/solid';

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

export default function Layout() {
  const tabs = [
    { name: 'Home', path: '/patient/home', icon: HomeIcon, iconActive: HomeSolid },
    { name: 'Hospitals', path: '/patient/hospitals', icon: BuildingOfficeIcon, iconActive: BuildingSolid },
    { name: 'Guides', path: '/patient/test-guides', icon: DocumentTextIcon, iconActive: DocumentSolid },
    { name: 'Alerts', path: '/patient/notifications', icon: BellAlertIcon, iconActive: BellSolid },
    { name: 'Profile', path: '/patient/profile', icon: UserIcon, iconActive: UserSolid },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f8fafc] overflow-hidden font-body">
      {/* Top Global Brand Header (Replicated Navbar) */}
      <header className="shrink-0 w-full bg-[#f8fafc] border-b border-gray-200/50 px-6 py-4 z-50 flex justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#417af0] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TestTubeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-display text-gray-900 tracking-tight leading-none">LabPrep</h1>
            <p className="text-[10px] font-body text-gray-400 font-bold uppercase tracking-wider mt-0.5">Prepare Right. Test Right.</p>
          </div>
        </div>
        
        <div className="flex space-x-3 shrink-0">
          <Link to="/patient/hospitals" className="w-11 h-11 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-sm hover:scale-105 transition-transform">
            <BuildingOfficeIcon className="w-5 h-5 text-[#417af0]" />
          </Link>
          <Link to="/patient/notifications" className="w-11 h-11 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-sm hover:scale-105 transition-transform relative">
            <BellAlertIcon className="w-5 h-5 text-[#27c463]" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-[#417af0] rounded-full border-2 border-[#f8fafc]"></div>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative no-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 w-full bg-[#f8fafc] border-t border-gray-200/50 px-2 pb-[env(safe-area-inset-bottom,0px)] z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 ${
                  isActive ? 'text-[#417af0]' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = isActive ? tab.iconActive : tab.icon;
                return (
                  <>
                    <div className={`relative flex flex-col items-center justify-center ${isActive ? 'transform -translate-y-0.5' : ''}`}>
                      <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : ''}`} />
                      {isActive && (
                        <div className="absolute -bottom-2 w-1 h-1 bg-[#417af0] rounded-full animate-in fade-in zoom-in duration-300"></div>
                      )}
                    </div>
                    <span className={`text-[9px] font-black font-body uppercase tracking-[0.1em] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                      {tab.name}
                    </span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
