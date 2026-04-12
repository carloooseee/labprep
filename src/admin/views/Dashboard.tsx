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
    { name: 'Total Patients', value: patients.length.toString(), icon: UsersIcon },
    { name: 'Active Hospitals', value: hospitals.length.toString(), icon: BuildingOfficeIcon },
    { name: 'Tests Completed', value: stats?.testsCompleted.toLocaleString() || '0', icon: ClipboardDocumentCheckIcon },
    { name: 'Notifications Sent', value: stats?.notificationsSent.toLocaleString() || '0', icon: BellIcon },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e9eb] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="mt-2 text-3xl font-display font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.name === 'Total Patients' ? 'bg-blue-100 text-blue-600' :
                  stat.name === 'Active Hospitals' ? 'bg-purple-100 text-purple-600' :
                  stat.name === 'Tests Completed' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6 lg:h-96 flex flex-col">
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

        {/* Book Lab Visit Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6 text-gray-800">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-semibold">Book Lab Visit</h3>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Hospital</label>
              <select 
                value={selectedHospitalId || ''}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1d2530] text-white font-medium py-3 rounded-xl hover:bg-black transition-all shadow-sm active:scale-[0.98] mt-2"
            >
              Confirm Booking
            </button>
          </form>
          
          <p className="text-[11px] text-gray-400 text-center mt-4 italic">
            * Bookings are automatically synchronized with patient records.
          </p>
        </div>
      </div>
      
    </div>
  );
}
