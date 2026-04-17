import { useState } from 'react';
import type { ReactNode } from 'react';
import { 
  PlusIcon, 
  BeakerIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon,
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

export default function Procedures() {
  const { testGuides, hospitals, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [hospitalFilter, setHospitalFilter] = useState('All Hospitals');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingProcedure, setEditingProcedure] = useState<any>(null);
  const [viewingProcedure, setViewingProcedure] = useState<any>(null);

  // Derive dynamic categories from data
  const categoryPriority: Record<string, number> = {
    'Urinalysis': 1,
    'Blood Test': 2,
    'Stool Test': 3,
    'Imaging': 4
  };

  const dynamicCategories = ['All Categories', ...new Set(testGuides.map(p => p.category))]
    .filter(Boolean)
    .sort((a, b) => {
      if (a === 'All Categories') return -1;
      if (b === 'All Categories') return 1;
      const pA = categoryPriority[a] || 999;
      const pB = categoryPriority[b] || 999;
      if (pA !== pB) return pA - pB;
      return a.localeCompare(b);
    });

  const filteredProcedures = testGuides.filter((proc: any) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (proc.procedureName || proc.name || '').toLowerCase().includes(query);
    const descMatch = (proc.description || '').toLowerCase().includes(query);
    const matchesSearch = nameMatch || descMatch;
    
    const matchesCategory = categoryFilter === 'All Categories' || proc.category === categoryFilter;
    const matchesHospital = hospitalFilter === 'All Hospitals' || proc.hospital === hospitalFilter;
    
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
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb] space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Hospital Procedures</h2>
          <p className="text-gray-500 mt-1">Manage test guides, preparation steps, and requirements.</p>
        </div>

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
              {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
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

      {/* Procedure List */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {filteredProcedures.length === 0 ? (
            <li className="p-12 text-center text-gray-500 italic">No procedures found matching your current filters.</li>
          ) : (
            filteredProcedures.map((proc: any) => (
              <li key={proc.id} className="relative p-6 hover:bg-gray-50 transition-colors flex items-start space-x-6 group">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <BeakerIcon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="pr-12">
                      <h3 className="font-semibold text-gray-900 text-xl leading-tight">{proc.procedureName}</h3>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center font-medium">
                          <BuildingOfficeIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                          {hospitals.find((h: any) => h.id === proc.hospital)?.name || 'Global'}
                        </div>
                        <div className="flex items-center">
                          <ShieldCheckIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                          Fasting: <span className="ml-1 text-gray-900 font-semibold">{proc.fastingRequired || 'None'}</span>
                        </div>
                        <div className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg font-medium border border-blue-100 text-xs">
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
                    </div>

                    <div className="absolute top-6 right-6">
                      <button 
                        onClick={() => setActiveActionId(activeActionId === proc.id ? null : proc.id)}
                        className={`p-2 rounded-full transition-colors ${activeActionId === proc.id ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200 text-gray-400'}`}
                      >
                        <EllipsisVerticalIcon className="w-6 h-6" />
                      </button>
                      
                      {activeActionId === proc.id && (
                        <>
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
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modals */}
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
          categories={dynamicCategories}
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

// Support Components
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

function AddProcedureForm({ onClose, onSave, initialData, hospitals, categories }: { onClose: () => void, onSave: (data: any) => void, initialData?: any, hospitals: any[], categories: string[] }) {
  const [formData, setFormData] = useState(initialData || {
    hospital: hospitals[0]?.id || '',
    procedureName: '',
    category: categories[0] || 'Blood Test',
    description: '',
    preparationSteps: [],
    fastingRequired: '',
    duration: 15,
    status: 'Active'
  });

  const addStep = () => {
    setFormData({
      ...formData,
      preparationSteps: [...formData.preparationSteps, { icon: '📝', title: '', description: '' }]
    });
  };

  const removeStep = (index: number) => {
    const newSteps = [...formData.preparationSteps];
    newSteps.splice(index, 1);
    setFormData({ ...formData, preparationSteps: newSteps });
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...formData.preparationSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, preparationSteps: newSteps });
  };

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
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer appearance-none font-bold"
            >
              <option value="">Global (All Hospitals)</option>
              {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Procedure Name</label>
          <input 
            type="text" 
            value={formData.procedureName}
            onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea 
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Preparation Steps</label>
          <button type="button" onClick={addStep} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center">
            <PlusIcon className="w-3 h-3 mr-1" /> Add Step
          </button>
        </div>
        <div className="space-y-3">
          {formData.preparationSteps.map((step: any, idx: number) => (
            <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input type="text" value={step.icon} onChange={(e) => updateStep(idx, 'icon', e.target.value)} className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center" />
              <div className="flex-1 space-y-2">
                <input type="text" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)} placeholder="Title" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
                <input type="text" value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)} placeholder="Instructions" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
              </div>
              <button type="button" onClick={() => removeStep(idx)} className="text-gray-400 hover:text-red-500"><XMarkIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fasting Required</label>
          <input type="text" value={formData.fastingRequired} onChange={(e) => setFormData({ ...formData, fastingRequired: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min)</label>
          <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-[#1d2530] text-white font-medium rounded-xl hover:bg-black transition-colors">Save Procedure</button>
      </div>
    </form>
  );
}

function ProcedureDetails({ procedure, onClose }: { procedure: any, onClose: () => void }) {
  const { hospitals } = useAppContext();
  if (!procedure) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
          <BeakerIcon className="w-10 h-10" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-gray-900">{procedure.procedureName}</h4>
          <div className="flex items-center text-sm text-gray-500 mt-0.5">
            <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
            {hospitals.find((h: any) => h.id === procedure.hospital)?.name || 'Global Procedure'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Category</div>
          <div>{procedure.category}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Status</div>
          <div>{procedure.status}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Fasting</div>
          <div>{procedure.fastingRequired || 'None'}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Duration</div>
          <div>{procedure.duration} min</div>
        </div>
      </div>

      <div>
        <h5 className="text-sm font-bold text-gray-900 mb-2">Preparation Steps</h5>
        <div className="space-y-2">
          {procedure.preparationSteps?.map((step: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
              <span className="text-lg shrink-0">{step.icon}</span>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-gray-800">{step.title}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{step.description}</p>
              </div>
            </div>
          ))}
          {!procedure.preparationSteps?.length && (
            <p className="text-xs text-gray-400 italic">No preparation steps defined.</p>
          )}
        </div>
      </div>

      <div>
        <h5 className="text-sm font-bold text-gray-900 mb-3">Testing Guidelines</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
            <h6 className="text-[10px] font-bold text-emerald-800 uppercase mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              What to Do
            </h6>
            <ul className="space-y-2">
              {procedure.guidelines?.dos?.map((item: any, idx: number) => (
                <li key={idx} className="flex gap-2 text-[10px] text-emerald-900 leading-tight">
                  <span className="shrink-0">{item.icon}</span> {item.text}
                </li>
              ))}
              {!procedure.guidelines?.dos?.length && <li className="text-[10px] text-emerald-600/50 italic">None</li>}
            </ul>
          </div>
          <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50">
            <h6 className="text-[10px] font-bold text-red-800 uppercase mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              To Avoid
            </h6>
            <ul className="space-y-2">
              {procedure.guidelines?.donts?.map((item: any, idx: number) => (
                <li key={idx} className="flex gap-2 text-[10px] text-red-900 leading-tight">
                  <span className="shrink-0">{item.icon}</span> {item.text}
                </li>
              ))}
              {!procedure.guidelines?.donts?.length && <li className="text-[10px] text-red-600/50 italic">None</li>}
            </ul>
          </div>
        </div>
      </div>

      <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors">Close Preview</button>
    </div>
  );
}
