import { useState } from 'react';
import { PlusIcon, BuildingOffice2Icon, MapPinIcon, PhoneIcon, MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../patient/context/AppContext';
import { db } from '../../firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';


export default function Hospitals() {
  const { hospitals, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<any>(null);

  const filteredHospitals = hospitals.filter((hospital) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      hospital.name.toLowerCase().includes(query) ||
      (hospital.address && hospital.address.toLowerCase().includes(query)) ||
      (hospital.contactNumber && hospital.contactNumber.toLowerCase().includes(query))
    );
    
    const matchesStatus = statusFilter === 'All Status' || hospital.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSave = async (data: any) => {
    try {
      if (editingHospital) {
        await setDoc(doc(db, 'hospitals', editingHospital.id), {
          ...data,
          procedureName: data.name // Always sync procedureName with name as requested
        }, { merge: true });
      } else {
        const hospitalData = {
          ...data,
          procedureName: data.name
        };
        const docRef = await addDoc(collection(db, 'hospitals'), hospitalData);
        await setDoc(docRef, { id: docRef.id }, { merge: true });
      }
      setIsModalOpen(false);
      setEditingHospital(null);
    } catch (error) {
      console.error("Error saving hospital:", error);
      alert("Failed to save hospital.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

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


          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Hospital</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <li 
                key={hospital.id} 
                className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4 cursor-pointer"
                onClick={() => { setEditingHospital(hospital); setIsModalOpen(true); }}
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <BuildingOffice2Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{hospital.name}</h3>

                  </div>
                    <div className="flex items-center text-sm text-gray-500 truncate">
                      <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {hospital.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0 shrink-0">
                      <PhoneIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {hospital.contactNumber || 'No contact'}
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingHospital(null); }} 
        title={editingHospital ? "Edit Hospital" : "Add Hospital"}
      >
        <AddHospitalForm 
          onClose={() => { setIsModalOpen(false); setEditingHospital(null); }} 
          onSave={handleSave}
          initialData={editingHospital}
        />
      </Modal>
    </div>
  );
}

// Modal Component (can be extracted if reused often)
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-display font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function AddHospitalForm({ onClose, onSave, initialData }: { onClose: () => void, onSave: (data: any) => void, initialData?: any }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    address: '',
    contactNumber: '',
    location: '',
    status: 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Metro General Hospital"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Complete physical address"
            className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. 14.5995, 120.9842"
            className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="+63 900..."
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
              required
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
        <select 
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-bold"
        >
          <option>Active</option>
          <option>Pending</option>
          <option>Disabled</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
        <button 
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors font-bold"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm transition-colors font-bold"
        >
          {initialData ? "Update Hospital" : "Save Hospital"}
        </button>
      </div>
    </form>
  );
}
