
import { Outlet, NavLink } from 'react-router-dom';
import { HomeIcon, BuildingOfficeIcon, DocumentTextIcon, BellAlertIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, BuildingOfficeIcon as BuildingSolid, DocumentTextIcon as DocumentSolid, BellAlertIcon as BellSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid';

export default function Layout() {
  const tabs = [
    { name: 'Home', path: '/patient/home', icon: HomeIcon, iconActive: HomeSolid },
    { name: 'Hospitals', path: '/patient/hospitals', icon: BuildingOfficeIcon, iconActive: BuildingSolid },
    { name: 'Guides', path: '/patient/test-guides', icon: DocumentTextIcon, iconActive: DocumentSolid },
    { name: 'Alerts', path: '/patient/notifications', icon: BellAlertIcon, iconActive: BellSolid },
    { name: 'Profile', path: '/patient/profile', icon: UserIcon, iconActive: UserSolid },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f5f7f9] overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 w-full bg-white/90 backdrop-blur-lg border-t border-[#e5e9eb] px-2 pb-[env(safe-area-inset-bottom,0px)] z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = isActive ? tab.iconActive : tab.icon;
                return (
                  <>
                    <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                    <span className="text-[10px] font-medium font-body">{tab.name}</span>
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
