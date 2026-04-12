import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../patient/context/AppContext';

export default function Patients() {
  const { patients, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (patient.displayName || patient.name || '').toLowerCase().includes(query);
    const emailMatch = (patient.email || '').toLowerCase().includes(query);
    const contactMatch = (patient.contact || '').toLowerCase().includes(query);
    const matchesSearch = nameMatch || emailMatch || contactMatch;
    
    const matchesStatus = statusFilter === 'All Status' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div className="flex-1">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Patients</h2>
          <p className="text-gray-500 mt-1">View and manage registered patients and their test history.</p>
          
          <div className="mt-6 relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients by name, email, or contact..." 
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
            <option>Completed</option>
            <option>Pending</option>
            <option>Scheduled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <li key={patient.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{patient.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase w-fit ${
                      patient.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                      patient.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        patient.status === 'Completed' ? 'bg-green-500' :
                        patient.status === 'Scheduled' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`} />
                      {patient.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:gap-6 mt-1.5">
                    <div className="flex items-center text-sm text-gray-500">
                      <EnvelopeIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {patient.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                      <PhoneIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {patient.contact}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-12 text-center text-gray-500 italic">
              No patients found matching your current filters.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
