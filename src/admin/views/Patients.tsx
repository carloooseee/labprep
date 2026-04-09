import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, UserIcon } from '@heroicons/react/24/outline';

const patients = [
  { id: '#8923', name: 'John Doe', age: 34, lastTest: 'CBC Blood Test', date: 'Oct 12, 2026', status: 'Completed' },
  { id: '#8924', name: 'Althea Smith', age: 28, lastTest: 'Urinalysis', date: 'Oct 14, 2026', status: 'Pending' },
  { id: '#8925', name: 'Robert Johnson', age: 45, lastTest: 'Lipid Profile', date: 'Oct 15, 2026', status: 'Scheduled' },
  { id: '#8926', name: 'Emily Davis', age: 22, lastTest: 'Thyroid Panel', date: 'Oct 15, 2026', status: 'Completed' },
];

export default function Patients() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Patients</h2>
          <p className="text-gray-500 mt-1">View and manage registered patients and their test history.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients by name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center space-x-2 text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Patient Info</th>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Last Test</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.age} years old</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono">{patient.id}</td>
                  <td className="px-6 py-4 text-gray-900">{patient.lastTest}</td>
                  <td className="px-6 py-4 text-gray-500">{patient.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      patient.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
