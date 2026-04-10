import { 
  UsersIcon, 
  ClipboardDocumentCheckIcon, 
  BuildingOfficeIcon, 
  BellIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const stats = [
  { name: 'Total Patients', value: '1,245', icon: UsersIcon },
  { name: 'Active Hospitals', value: '14', icon: BuildingOfficeIcon },
  { name: 'Tests Completed', value: '8,392', icon: ClipboardDocumentCheckIcon },
  { name: 'Notifications Sent', value: '342', icon: BellIcon },
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'Completed Blood Test', time: '2 hours ago' },
  { id: 2, user: 'Jane Smith', action: 'Registered as new patient', time: '4 hours ago' },
  { id: 3, user: 'Metro Hospital', action: 'Updated available test procedures', time: '5 hours ago' },
  { id: 4, user: 'Alan Turing', action: 'Requested test guide', time: '1 day ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {stats.map((stat) => {
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
          <div className="flex-1 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Chart Visualization Area</p>
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
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <option value="">Choose a facility...</option>
                <option value="1">Metro General Hospital</option>
                <option value="2">Citywide Health Clinic</option>
                <option value="3">Valley Medical Center</option>
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
