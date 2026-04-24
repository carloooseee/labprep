import { useAppContext } from '../../patient/context/AppContext';

// Icons moved into map logic

import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  ClipboardDocumentCheckIcon, 
  BuildingOfficeIcon, 
  BellIcon,
  CalendarDaysIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { stats, activity, hospitals, patients, selectedHospitalId, setSelectedHospitalId } = useAppContext();

  const displayStats = [
    { name: 'Total Patients', value: patients.length.toString(), icon: UsersIcon, link: '/admin/patients' },
    { name: 'Active Hospitals', value: hospitals.length.toString(), icon: BuildingOfficeIcon, link: '/admin/hospitals' },
    { name: 'Notifications Sent', value: stats?.notificationsSent.toLocaleString() || '0', icon: BellIcon, link: '/admin/notifications' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link to={stat.link} key={stat.name} className="block">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e9eb] hover:shadow-md transition-shadow h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="mt-2 text-3xl font-display font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    stat.name === 'Total Patients' ? 'bg-blue-100 text-blue-600' :
                    stat.name === 'Active Hospitals' ? 'bg-purple-100 text-purple-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Chart Area placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6 lg:h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-display font-semibold text-gray-800">Recent Procedures</h3>
            </div>
            <Link 
              to="/admin/procedures" 
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              View All
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.user}</h4>
                    <p className="text-xs text-gray-500">{item.action}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              ))}
              {activity.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                  No recent activity found for this facility.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
