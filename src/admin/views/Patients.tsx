import { useState } from 'react';
import type { ReactNode } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../patient/context/AppContext';
import { db } from '../../firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

export default function Patients() {
  const { patients, hospitals, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const handleSave = async (data: any) => {
    try {
      if (editingPatient) {
        await setDoc(doc(db, 'users', editingPatient.id), data, { merge: true });
      } else {
        const docRef = await addDoc(collection(db, 'users'), {
          ...data,
          role: 'patient',
          preferredLanguage: 'en'
        });
        await setDoc(docRef, { id: docRef.id, uid: docRef.id }, { merge: true });
      }
      setIsModalOpen(false);
      setEditingPatient(null);
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient.");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (patient.displayName || patient.name || '').toLowerCase().includes(query);
    const emailMatch = (patient.email || '').toLowerCase().includes(query);
    const contactMatch = (patient.phone || patient.contact || '').toLowerCase().includes(query);
    const matchesSearch = nameMatch || emailMatch || contactMatch;
    
    const matchesStatus = statusFilter === 'All Status' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div className="flex-1">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Patients</h2>
          <p className="text-gray-500 mt-1">View and manage registered patients and their medical profiles.</p>
          
          <div className="mt-6 relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
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
            <option>Inactive</option>
          </select>

          <button 
            onClick={() => { setEditingPatient(null); setIsModalOpen(true); }}
            className="flex items-center justify-center space-x-2 bg-[#1d2530] hover:bg-black text-white px-6 py-3 rounded-xl transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <li 
                key={patient.id} 
                className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4 cursor-pointer group"
                onClick={() => { setEditingPatient(patient); setIsModalOpen(true); }}
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 group-hover:bg-blue-100 transition-colors">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate flex items-center">
                      {patient.displayName || patient.name}
                      {patient.gender && (
                        <span className="ml-2 text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded uppercase">
                          {patient.gender}
                        </span>
                      )}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase w-fit ${
                      patient.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' :
                      patient.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        patient.status === 'Active' ? 'bg-green-500' :
                        patient.status === 'Pending' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }`} />
                      {patient.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <EnvelopeIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {patient.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <PhoneIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                      {patient.phone || patient.contact || 'No phone'}
                    </div>
                    {patient.dateOfBirth && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                        DOB: {patient.dateOfBirth}
                      </div>
                    )}
                    {patient.address && (
                      <div className="flex items-center text-sm text-gray-500 col-span-full">
                        <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                        {patient.address}
                      </div>
                    )}
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingPatient(null); }} 
        title={editingPatient ? "Edit Patient Profile" : "Register New Patient"}
      >
        <AddPatientForm 
          onClose={() => { setIsModalOpen(false); setEditingPatient(null); }} 
          onSave={handleSave}
          initialData={editingPatient}
          hospitals={hospitals}
        />
      </Modal>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
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

function AddPatientForm({ onClose, onSave, initialData, hospitals }: { onClose: () => void, onSave: (data: any) => void, initialData?: any, hospitals: any[] }) {
  const [formData, setFormData] = useState(initialData || {
    displayName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male',
    hospitalId: hospitals[0]?.id || '',
    status: 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input 
            type="text" 
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
          <input 
            type="date" 
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
          <select 
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Home Address</label>
        <textarea 
          rows={2}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Hospital</label>
        <select 
          value={formData.hospitalId}
          onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
        >
          {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-[#1d2530] text-white font-medium rounded-xl hover:bg-black transition-colors">
          {initialData ? 'Update Profile' : 'Register Patient'}
        </button>
      </div>
    </form>
  );
}

