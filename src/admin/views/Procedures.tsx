import { useState } from 'react';
import { 
  PlusIcon, 
  BeakerIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon,
  ClockIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../patient/context/AppContext';
import { db } from '../../firebase';
import { doc, setDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

const categories = [
  'All Categories',
  'Urinalysis',
  'Blood Test',
  'Imaging',
  'Stool Test',
  'Swab Test',
  'Other Test'
];

export default function Procedures() {
  const { testGuides, hospitals, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [hospitalFilter, setHospitalFilter] = useState('All Hospitals');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingProcedure, setEditingProcedure] = useState<any>(null);
  const [viewingProcedure, setViewingProcedure] = useState<any>(null);

  const filteredProcedures = testGuides.filter((proc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = proc.name.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'All Categories' || proc.category === categoryFilter;
    const matchesHospital = hospitalFilter === 'All Hospitals' || proc.hospitalId === hospitalFilter;
    
    return matchesSearch && matchesCategory && matchesHospital;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this procedure?')) {
      await deleteDoc(doc(db, 'testGuides', id));
      setActiveActionId(null);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingProcedure) {
        await setDoc(doc(db, 'testGuides', editingProcedure.id), data, { merge: true });
      } else {
        const docRef = await addDoc(collection(db, 'testGuides'), data);
        await setDoc(docRef, { id: docRef.id }, { merge: true });
      }
      setIsModalOpen(false);
      setEditingProcedure(null);
    } catch (error) {
      console.error("Error saving procedure:", error);
      alert("Failed to save procedure.");
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer font-bold"
            >
              <option value="All Hospitals">All Hospitals</option>
              {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
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
            filteredProcedures.map((proc) => (
              <li key={proc.id} className="relative p-6 hover:bg-gray-50 transition-colors flex items-start space-x-6 group">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <BeakerIcon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="pr-12">
                      <h3 className="font-semibold text-gray-900 text-xl leading-tight">{proc.name}</h3>
                    </div>
                    
                    {/* Action Menu (3-dot) */}
                    <div className="absolute top-6 right-6">
                      <button 
                        onClick={() => setActiveActionId(activeActionId === proc.id ? null : proc.id)}
                        className={`p-2 rounded-full transition-colors ${activeActionId === proc.id ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200 text-gray-400'}`}
                      >
                        <EllipsisVerticalIcon className="w-6 h-6" />
                      </button>
                      
                      {activeActionId === proc.id && (
                        <>
                          {/* Overlay to close on click outside */}
                          <div className="fixed inset-0 z-10" onClick={() => setActiveActionId(null)} />
                          
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in zoom-in-95 fade-in duration-100 origin-top-right">
                            <button 
                              onClick={() => { setViewingProcedure(proc); setActiveActionId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <EyeIcon className="w-4 h-4 mr-3 text-gray-400" />
                              Check Details
                            </button>
                            <button 
                              onClick={() => { setEditingProcedure(proc); setIsModalOpen(true); setActiveActionId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <PencilSquareIcon className="w-4 h-4 mr-3 text-gray-400" />
                              Edit
                            </button>
                            <div className="my-1 border-t border-gray-100" />
                            <button 
                              onClick={() => handleDelete(proc.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center font-medium"
                            >
                              <TrashIcon className="w-4 h-4 mr-3" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-y-3 gap-x-6 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg font-medium border border-blue-100">
                        <TagIcon className="w-4 h-4 mr-2" />
                        {proc.category}
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border shrink-0 ${
                        proc.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                        proc.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {proc.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 font-medium">
                      <BuildingOfficeIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                      {hospitals.find(h => h.id === proc.hospitalId)?.name || 'Global'}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <ShieldCheckIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                      Fasting: <span className="ml-1 text-gray-900 font-semibold">{proc.fastingRequirement || 'None'}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-12 text-center text-gray-500 italic">
              No procedures found matching your current filters.
            </li>
          )}
        </ul>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProcedure(null); }} 
        title={editingProcedure ? "Edit Hospital Procedure" : "Add Hospital Procedure"}
      >
        <AddProcedureForm 
          onClose={() => { setIsModalOpen(false); setEditingProcedure(null); }} 
          onSave={handleSave}
          initialData={editingProcedure}
          hospitals={hospitals}
        />
      </Modal>

      <Modal 
        isOpen={!!viewingProcedure} 
        onClose={() => setViewingProcedure(null)} 
        title="Procedure Details"
      >
        <ProcedureDetails 
          procedure={viewingProcedure} 
          onClose={() => setViewingProcedure(null)} 
        />
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

function AddProcedureForm({ onClose, onSave, initialData, hospitals }: { onClose: () => void, onSave: (data: any) => void, initialData?: any, hospitals: any[] }) {
  const [formData, setFormData] = useState(initialData || {
    hospitalId: hospitals[0]?.id || '',
    category: 'Blood Test',
    name: '',
    description: '',
    fastingRequirement: '',
    status: 'Active',
    preparations: [],
    guidelines: { dos: [], donts: [] }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital</label>
          <div className="relative">
            <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={formData.hospitalId}
              onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none font-bold"
            >
              <option value="">Global (All Hospitals)</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <div className="relative">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
            >
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Complete Blood Count (CBC)"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea 
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Briefly describe the purpose of the test..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fasting Requirement</label>
          <input 
            type="text" 
            value={formData.fastingRequirement}
            onChange={(e) => setFormData({ ...formData, fastingRequirement: e.target.value })}
            placeholder="e.g. 8-10 hours, Water only"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <div className="relative">
            <InformationCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
            >
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
          {initialData ? "Update Procedure" : "Save Procedure"}
        </button>
      </div>
    </form>
  );
}

function ProcedureDetails({ procedure, onClose }: { procedure: any, onClose: () => void }) {
  if (!procedure) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
          <BeakerIcon className="w-10 h-10" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-gray-900">{procedure.name}</h4>
          <div className="flex items-center text-sm text-gray-500 mt-0.5">
            <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
            {procedure.hospitalId || 'Global Procedure'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Category</div>
          <div className="text-gray-900 font-semibold flex items-center">
            <TagIcon className="w-4 h-4 mr-2 text-gray-400" />
            {procedure.category}
          </div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
          <div className="text-gray-900 font-semibold">{procedure.status}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fasting</div>
          <div className="text-gray-900 font-semibold flex items-center">
            <ShieldCheckIcon className="w-4 h-4 mr-2 text-gray-400" />
            {procedure.fasting}
          </div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Duration</div>
          <div className="text-gray-900 font-semibold flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
            {procedure.duration} minutes
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-bold text-gray-900 mb-2">Clinical Description</h5>
          <p className="text-gray-600 leading-relaxed text-sm bg-blue-50/30 p-4 rounded-xl border border-blue-50">
            {procedure.description}
          </p>
        </div>
        <div>
          <h5 className="text-sm font-bold text-gray-900 mb-2">Preparation Steps</h5>
          <div className="space-y-2 bg-amber-50/30 p-4 rounded-xl border border-amber-50">
            {procedure.preparations?.map((step: any, idx: number) => (
              <div key={idx} className="text-sm text-gray-600 flex gap-2">
                <span className="font-bold">{step.icon}</span>
                <span>{step.title}: {step.description}</span>
              </div>
            ))}
            {(!procedure.preparations || procedure.preparations.length === 0) && <p className="text-sm text-gray-400 italic">No preparation steps defined.</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={onClose}
          className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
}
