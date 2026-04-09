import { 
  UsersIcon, 
  ClipboardDocumentCheckIcon, 
  BuildingOfficeIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Patients', value: '1,245', change: '+12%', changeType: 'increase', icon: UsersIcon },
  { name: 'Active Hospitals', value: '14', change: '0%', changeType: 'neutral', icon: BuildingOfficeIcon },
  { name: 'Tests Completed', value: '8,392', change: '+24%', changeType: 'increase', icon: ClipboardDocumentCheckIcon },
  { name: 'Notifications Sent', value: '342', change: '+18%', changeType: 'increase', icon: BellIcon },
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6 lg:h-96 flex flex-col">
          <h3 className="text-lg font-display font-semibold text-gray-800 mb-4">Activity Overview</h3>
          <div className="flex-1 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Chart Visualization Area</p>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] p-6 text-gray-800">
          <h3 className="text-lg font-display font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex relative">
                <div className="absolute top-2 left-2 w-0.5 h-full -ml-px bg-gray-200" aria-hidden="true"></div>
                <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white mt-1"></div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.action}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
