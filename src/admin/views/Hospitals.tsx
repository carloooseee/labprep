import { useState } from 'react';
import { PlusIcon, BuildingOffice2Icon, MapPinIcon, PhoneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const hospitals = [
  { id: 1, name: 'Metro General Hospital', location: '123 Medical Blvd, Downtown', contact: '+63 912 345 6789', status: 'Active' },
  { id: 2, name: 'Citywide Health Clinic', location: '456 Wellness Way, Northside', contact: '+63 923 456 7890', status: 'Pending' },
  { id: 3, name: 'Valley Medical Center', location: '789 Care Lane, West End', contact: '+63 934 567 8901', status: 'Disabled' },
  { id: 4, name: 'St. Jude Medical Arts', location: '101 Healing St, South District', contact: '+63 945 678 9012', status: 'Active' },
  { id: 5, name: 'Northshore Wellness Hub', location: '202 Bayview Dr, Port Area', contact: '+63 956 789 0123', status: 'Active' },
  { id: 6, name: 'Eastside Community Lab', location: '303 Sunrise Ave, East Gate', contact: '+63 967 890 1234', status: 'Disabled' },
];

export default function Hospitals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredHospitals = hospitals.filter((hospital) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      hospital.name.toLowerCase().includes(query) ||
      hospital.location.toLowerCase().includes(query) ||
      hospital.contact.toLowerCase().includes(query)
    );
    
    const matchesStatus = statusFilter === 'All Status' || hospital.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div className="flex-1">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Hospitals</h2>
          <p className="text-gray-500 mt-1">Manage registered hospitals and clinics.</p>
          
          <div className="mt-6 relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search hospitals by name, address, or contact..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3 shrink-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm hover:bg-gray-50"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Disabled</option>
          </select>

          <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-sm hover:shadow-md active:scale-95">
            <PlusIcon className="w-5 h-5" />
            <span>Add Hospital</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <li key={hospital.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <BuildingOffice2Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{hospital.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase w-fit ${
                      hospital.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' :
                      hospital.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        hospital.status === 'Active' ? 'bg-green-500' :
                        hospital.status === 'Pending' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                      {hospital.status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6 mt-1.5">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {hospital.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                      <PhoneIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {hospital.contact}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-12 text-center text-gray-500 italic">
              No hospitals found matching your current filters.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
