import { useState } from 'react';
import { 
  PlusIcon, 
  ClipboardDocumentListIcon, 
  BeakerIcon, 
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const procedures = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Blood Test', hospital: 'Metro General Hospital', reqs: 2, icon: BeakerIcon },
  { id: 2, name: 'Fasting Blood Sugar (FBS)', category: 'Blood Test', hospital: 'Citywide Health Clinic', reqs: 3, icon: BeakerIcon },
  { id: 3, name: 'Urinalysis', category: 'Urinalysis', hospital: 'Metro General Hospital', reqs: 1, icon: ClipboardDocumentListIcon },
  { id: 4, name: 'Chest X-Ray', category: 'Imaging', hospital: 'Valley Medical Center', reqs: 4, icon: ClipboardDocumentListIcon },
  { id: 5, name: 'Fecalysis', category: 'Stool Test', hospital: 'Metro General Hospital', reqs: 1, icon: ClipboardDocumentListIcon },
  { id: 6, name: 'RT-PCR Swab', category: 'Swab Test', hospital: 'Citywide Health Clinic', reqs: 1, icon: BeakerIcon },
];

const categories = [
  'All Categories',
  'Urinalysis',
  'Blood Test',
  'Imaging',
  'Stool Test',
  'Swab Test',
  'Other Test'
];

const hospitals = [
  'All Hospitals',
  'Metro General Hospital',
  'Citywide Health Clinic',
  'Valley Medical Center'
];

export default function Procedures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [hospitalFilter, setHospitalFilter] = useState('All Hospitals');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProcedures = procedures.filter((proc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = proc.name.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'All Categories' || proc.category === categoryFilter;
    const matchesHospital = hospitalFilter === 'All Hospitals' || proc.hospital === hospitalFilter;
    
    return matchesSearch && matchesCategory && matchesHospital;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb] space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Hospital Procedures</h2>
          <p className="text-gray-500 mt-1">Manage test guides, preparation steps, and requirements.</p>
        </div>

        {/* Row 2: Search and Hospital Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search procedures..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <BuildingOfficeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select 
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative min-w-[240px]">
            <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer font-medium text-gray-700"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-[#1d2530] hover:bg-black text-white px-8 py-3 rounded-xl transition-all font-medium shadow-sm active:scale-[0.98]"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Procedure</span>
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredProcedures.length > 0 ? (
            filteredProcedures.map((proc) => {
              const Icon = proc.icon;
              return (
                <li key={proc.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">{proc.name}</h3>
                      <div className="flex items-center space-x-2 self-start md:self-auto">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                          {proc.category}
                        </span>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors border border-blue-100">
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-6 mt-1.5">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-700 mr-1">{proc.reqs}</span> 
                        Preparation Steps
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <BuildingOfficeIcon className="w-3.5 h-3.5 mr-1" />
                        {proc.hospital}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="p-12 text-center text-gray-500 italic">
              No procedures found matching your current filters.
            </li>
          )}
        </ul>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Hospital Procedure"
      >
        <AddProcedureForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

// Modal Component Reused
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <h3 className="text-xl font-display font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function AddProcedureForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital</label>
          <div className="relative">
            <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none">
              <option>Metro General Hospital</option>
              <option>Citywide Health Clinic</option>
              <option>Valley Medical Center</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <div className="relative">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none">
              <option>Blood Test</option>
              <option>Urinalysis</option>
              <option>Imaging</option>
              <option>Stool Test</option>
              <option>Swab Test</option>
              <option>Other Test</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Procedure Name</label>
        <input 
          type="text" 
          placeholder="e.g. Complete Blood Count (CBC)"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea 
          rows={2}
          placeholder="Briefly describe the purpose of the test..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Preparation Steps (Instructions)</label>
        <textarea 
          rows={3}
          placeholder="Enter detailed guidelines for the patient..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fasting Required</label>
          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
            <option>No</option>
            <option>Yes (8-10 hours)</option>
            <option>Yes (10-12 hours)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (Mins)</label>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="number" 
              placeholder="15"
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <div className="relative">
            <InformationCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none">
              <option>Active</option>
              <option>Draft</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
        <button 
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-6 py-2.5 bg-[#1d2530] text-white font-medium rounded-xl hover:bg-black shadow-sm transition-colors"
        >
          Save Procedure
        </button>
      </div>
    </form>
  );
}
