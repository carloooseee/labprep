
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
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* Main Content Area */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full glass border-t border-[var(--color-surface-container-highest)]/20 px-2 pb-safe pt-2">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = isActive ? tab.iconActive : tab.icon;
                return (
                  <>
                    <Icon className={`w-6 h-6 ${isActive ? 'scale-110 shadow-sm' : ''}`} />
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
