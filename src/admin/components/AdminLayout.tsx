import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon, 
  BellIcon, 
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Hospitals', href: '/admin/hospitals', icon: BuildingOfficeIcon },
  { name: 'Patients', href: '/admin/patients', icon: UsersIcon },
  { name: 'Procedures', href: '/admin/procedures', icon: ClipboardDocumentListIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f5f7f9] font-body overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e5e9eb] flex flex-col shadow-2xl md:shadow-sm transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between md:justify-center border-b border-[#e5e9eb]">
          <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
            LabPrep Admin
          </h1>
          <button 
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={closeSidebar}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e5e9eb]">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-[#e5e9eb] flex items-center px-4 md:px-8 shadow-sm justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-display font-semibold text-gray-800 truncate">Administrator Portal</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f5f7f9]">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
