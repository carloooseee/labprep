import { PlusIcon, BuildingOffice2Icon, MapPinIcon } from '@heroicons/react/24/outline';

const hospitals = [
  { id: 1, name: 'Metro General Hospital', location: 'Downtown', status: 'Active', tests: 45 },
  { id: 2, name: 'Citywide Health Clinic', location: 'Northside', status: 'Active', tests: 28 },
  { id: 3, name: 'Valley Medical Center', location: 'West End', status: 'Inactive', tests: 12 },
];

export default function Hospitals() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Hospitals</h2>
          <p className="text-gray-500 mt-1">Manage partner hospitals and testing facilities.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-sm">
          <PlusIcon className="w-5 h-5" />
          <span>Add Hospital</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb] hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <BuildingOffice2Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {hospital.location}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-500">Test Types: </span>
                <span className="font-semibold text-gray-900">{hospital.tests}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                hospital.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {hospital.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
