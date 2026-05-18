import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../../patient/context/AppContext';
import { db, storage } from '../../firebase';
import { doc, setDoc, deleteDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Fallback Images
import urinalysisImg from '../../assets/test-guides/urinalysis.png';
import bloodTestImg from '../../assets/test-guides/blood_test.png';
import stoolTestImg from '../../assets/test-guides/stool_test.png';
import imagingImg from '../../assets/test-guides/imaging.png';
import genericImg from '../../assets/test-guides/generic.png';

const getFallbackImage = (category: string) => {
  switch (category) {
    case 'Urinalysis': return urinalysisImg;
    case 'Stool Test': return stoolTestImg;
    case 'Hematology':
    case 'Blood Chemistry':
    case 'Serological Test': return bloodTestImg;
    case 'Imaging': return imagingImg;
    default: return genericImg;
  }
};

const SafeImage = ({ src, alt, category, className, objectMode = 'contain' }: { src?: string, alt: string, category: string, className?: string, objectMode?: 'cover' | 'contain' }) => {
  const targetSrc = src || getFallbackImage(category);
  const [currentSrc, setCurrentSrc] = useState(targetSrc);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (targetSrc !== currentSrc) {
      setCurrentSrc(targetSrc);
      setLoading(true);
      setHasError(false);
    }
  }, [targetSrc, currentSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full ${objectMode === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!hasError) {
            setCurrentSrc(getFallbackImage(category));
            setHasError(true);
            setLoading(false);
          }
        }}
      />
    </div>
  );
};

export default function Procedures() {
  const { testGuides, hospitals, loading } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [hospitalFilter, setHospitalFilter] = useState('All Hospitals');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [globalPricingUrl, setGlobalPricingUrl] = useState('');
  const [globalPricingMargin, setGlobalPricingMargin] = useState('16px');
  const [globalPricingZoom, setGlobalPricingZoom] = useState(1);
  const [globalPricingPanX, setGlobalPricingPanX] = useState(0);
  const [globalPricingPanY, setGlobalPricingPanY] = useState(0);
  const [generalGuidelines, setGeneralGuidelines] = useState<any>({
    rules: '',
    rulesFilipino: '',
    dos: '',
    dosFilipino: '',
    donts: '',
    dontsFilipino: ''
  });
  const [guidelinesLang, setGuidelinesLang] = useState<'EN' | 'PH'>('EN');
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [isSavingGuidelines, setIsSavingGuidelines] = useState(false);
  const [uploadingPricing, setUploadingPricing] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<any>(null);
  const [viewingProcedure, setViewingProcedure] = useState<any>(null);
  const [procedureToDelete, setProcedureToDelete] = useState<any>(null);

  // Mouse & Touch Drag Crop State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [basePan, setBasePan] = useState({ x: 0, y: 0 });

  const handleDragStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY });
    setBasePan({ x: globalPricingPanX, y: globalPricingPanY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    setGlobalPricingPanX(basePan.x + dx);
    setGlobalPricingPanY(basePan.y + dy);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Derive dynamic categories from data
  const categoryPriority: Record<string, number> = {
    'Urinalysis': 1,
    'Serological Test': 2,
    'Stool Test': 3,
    'Blood Chemistry': 4,
    'Hematology': 5,
    'Imaging': 6,
    'Other Test': 7
  };

  // Fetch global settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const pricingSnap = await getDoc(doc(db, 'settings', 'pricing'));
        if (pricingSnap.exists()) {
          setGlobalPricingUrl(pricingSnap.data().url || '');
          setGlobalPricingMargin(pricingSnap.data().margin || '16px');
          setGlobalPricingZoom(pricingSnap.data().zoom || 1);
          setGlobalPricingPanX(pricingSnap.data().panX || 0);
          setGlobalPricingPanY(pricingSnap.data().panY || 0);
        }

        const guidelinesSnap = await getDoc(doc(db, 'settings', 'generalGuidelines'));
        if (guidelinesSnap.exists()) {
          setGeneralGuidelines(guidelinesSnap.data());
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const dynamicCategories = Array.from(new Set(
    ['Other Test', ...testGuides.map(p => p.category)]
      .map(c => c?.trim())
      .filter(c => c && c !== 'Choose laboratory test' && c !== 'Choose categories' && c !== 'All')
      .map(c => c.toLowerCase() === 'other test' ? 'Other Test' : c)
  ))
    .sort((a, b) => {
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
    try {
      await deleteDoc(doc(db, 'testGuides', id));
      setProcedureToDelete(null);
    } catch (error) {
      console.error("Error deleting procedure:", error);
      alert("Failed to delete procedure. You might not have permission.");
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
              <option value="All Categories">All Categories</option>
              {dynamicCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIsGuidelinesModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-xl transition-all font-bold border border-blue-200/50 shadow-sm"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>General What to do</span>
            </button>
            <button 
              onClick={() => setIsPricingModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-6 py-3 rounded-xl transition-all font-bold border border-emerald-200/50 shadow-sm"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              <span>Pricing Photos</span>
            </button>
            <button 
              onClick={() => { setEditingProcedure(null); setIsModalOpen(true); }}
              className="flex items-center justify-center space-x-2 bg-[#1d2530] hover:bg-black text-white px-8 py-3 rounded-xl transition-all font-medium shadow-sm active:scale-[0.98]"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Procedure</span>
            </button>
          </div>
        </div>
      </div>

      {/* Procedure Categories Grid OR Procedure List */}
      {categoryFilter === 'Choose categories' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dynamicCategories.filter(c => c !== 'Choose categories').map(category => {
            const procCount = testGuides.filter((p: any) => p.category === category && (hospitalFilter === 'All Hospitals' || p.hospital === hospitalFilter)).length;
            return (
              <div 
                key={category} 
                onClick={() => setCategoryFilter(category)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb] hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col items-center text-center space-y-4"
              >
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <TagIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-500 mt-1">{procCount} {procCount === 1 ? 'Procedure' : 'Procedures'}</p>
                </div>
              </div>
            );
          })}
          {dynamicCategories.length <= 1 && (
            <div className="col-span-full p-12 text-center text-gray-500 italic bg-white rounded-2xl border border-[#e5e9eb]">
              No categories found. Add procedures to create categories.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredProcedures.length === 0 ? (
              <li className="p-12 text-center text-gray-500 italic">No procedures found matching your current filters.</li>
            ) : (
              filteredProcedures.map((proc: any) => (
                <li key={proc.id} className="relative p-6 hover:bg-gray-50 transition-colors flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 group-hover:bg-indigo-100 transition-colors flex items-center justify-center overflow-hidden">
                    <SafeImage 
                      src={proc.imageUrl} 
                      alt={proc.procedureName} 
                      category={proc.category} 
                      className="w-10 h-10" 
                    />
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
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProcedureToDelete(proc); setActiveActionId(null); }}
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
      )}

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
      <Modal 
        isOpen={!!procedureToDelete} 
        onClose={() => setProcedureToDelete(null)} 
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-bold text-gray-900">{procedureToDelete?.procedureName}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-100">
            <button 
              onClick={() => setProcedureToDelete(null)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleDelete(procedureToDelete.id)}
              className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Global Pricing Management Modal */}
      <Modal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
        title="Manage Pricing Photo"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500 text-center">Upload or set the pricing image that will be shown to all patients on the Test Guides page.</p>
          
          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Global Pricing Photo
            </label>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <input 
                    type="text" 
                    value={globalPricingUrl}
                    onChange={(e) => setGlobalPricingUrl(e.target.value)}
                    placeholder="Paste image URL or upload below..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                  <label className={`shrink-0 cursor-pointer flex items-center justify-center p-3 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all ${uploadingPricing ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setUploadingPricing(true);
                          const storageRef = ref(storage, `pricing/global_pricing_${Date.now()}`);
                          const snapshot = await uploadBytes(storageRef, file);
                          const url = await getDownloadURL(snapshot.ref);
                          setGlobalPricingUrl(url);
                        } catch (err) {
                          console.error(err);
                          alert("Failed to upload image.");
                        } finally {
                          setUploadingPricing(false);
                        }
                      }}
                    />
                    {uploadingPricing ? (
                      <ArrowPathIcon className="w-6 h-6 text-indigo-500 animate-spin" />
                    ) : (
                      <ArrowUpTrayIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </label>
                </div>
              </div>

              {globalPricingUrl && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/60 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center pb-1.5 border-b border-gray-200/50">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wider font-display">Framing Adjustments</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setGlobalPricingMargin('16px');
                        setGlobalPricingZoom(1);
                        setGlobalPricingPanX(0);
                        setGlobalPricingPanY(0);
                      }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-all"
                    >
                      Reset Frame
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-600 leading-relaxed font-body bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
                    Click & <strong>drag the image</strong> below to position it. <strong>Scroll your mouse wheel</strong> to zoom in/out. You can also use the control buttons overlayed on the bottom-right of the image.
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Outer Border Padding</span>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{globalPricingMargin}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="64" 
                      value={parseInt(globalPricingMargin) || 0}
                      onChange={(e) => setGlobalPricingMargin(`${e.target.value}px`)}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center gap-4">
                <p className="text-[10px] text-gray-400 max-w-[60%]">Configure how the laboratory pricing photo fits on patient screens. Use crop settings to focus or align the photo.</p>
                <button 
                  onClick={async () => {
                    setIsSavingPricing(true);
                    try {
                      await setDoc(doc(db, 'settings', 'pricing'), {
                        url: globalPricingUrl,
                        margin: globalPricingMargin,
                        zoom: globalPricingZoom,
                        panX: globalPricingPanX,
                        panY: globalPricingPanY,
                        updatedAt: new Date()
                      });
                      alert("Global pricing photo updated successfully!");
                      setIsPricingModalOpen(false);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to update pricing photo.");
                    } finally {
                      setIsSavingPricing(false);
                    }
                  }}
                  disabled={isSavingPricing}
                  className={`px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] shrink-0 ${isSavingPricing ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isSavingPricing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {globalPricingUrl && (
                <div className="mt-4 p-4 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative group">
                  <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase text-center font-display">Interactive Preview (Drag & Scroll)</p>
                  <div 
                    className={`bg-white rounded-xl shadow-inner flex items-center justify-center border border-gray-150 overflow-hidden relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ 
                      padding: globalPricingMargin,
                      height: '280px' 
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleDragStart(e.clientX, e.clientY);
                    }}
                    onMouseMove={(e) => {
                      handleDragMove(e.clientX, e.clientY);
                    }}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      if (touch) {
                        handleDragStart(touch.clientX, touch.clientY);
                      }
                    }}
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      if (touch) {
                        handleDragMove(touch.clientX, touch.clientY);
                      }
                    }}
                    onTouchEnd={handleDragEnd}
                    onWheel={(e) => {
                      e.preventDefault();
                      const zoomFactor = 0.05;
                      const direction = e.deltaY < 0 ? 1 : -1;
                      const newZoom = Math.min(Math.max(globalPricingZoom + direction * zoomFactor, 1), 6);
                      setGlobalPricingZoom(newZoom);
                    }}
                  >
                    <div className="w-full h-full overflow-hidden flex items-center justify-center relative bg-gray-50 rounded-lg border border-gray-100 pointer-events-none select-none">
                      <img 
                        src={globalPricingUrl} 
                        alt="Preview" 
                        className="max-h-full max-w-full object-contain origin-center transition-transform duration-75 select-none" 
                        style={{
                          transform: `translate(${globalPricingPanX}px, ${globalPricingPanY}px) scale(${globalPricingZoom})`
                        }}
                      />
                    </div>

                    {/* Interactive Zoom / Reset overlay control */}
                    <div 
                      className="absolute bottom-4 right-4 flex items-center bg-black/75 backdrop-blur-sm rounded-xl p-1.5 space-x-1.5 z-30 select-none shadow-lg border border-white/10"
                      onMouseDown={(e) => e.stopPropagation()} // Prevent drag start when clicking control buttons
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setGlobalPricingZoom(z => Math.min(z + 0.25, 6)); }}
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                        title="Zoom In"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-white/95 font-mono px-1 font-bold min-w-[28px] text-center">{globalPricingZoom.toFixed(2)}x</span>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setGlobalPricingZoom(z => Math.max(z - 0.25, 1)); }}
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                        title="Zoom Out"
                      >
                        -
                      </button>
                      <div className="w-px h-4 bg-white/20 mx-1" />
                      <button 
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setGlobalPricingZoom(1); 
                          setGlobalPricingPanX(0); 
                          setGlobalPricingPanY(0); 
                        }}
                        className="px-2.5 py-1 text-[10px] text-white hover:bg-white/20 active:bg-white/30 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setGlobalPricingUrl('')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-in fade-in cursor-pointer hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* General Guidelines Management Modal */}
      <Modal 
        isOpen={isGuidelinesModalOpen} 
        onClose={() => setIsGuidelinesModalOpen(false)} 
        title="Manage General Guidelines (What to do)"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500 text-center">Edit the general instructions that patients see on the "What to do" page.</p>
          
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
            <button 
              onClick={() => setGuidelinesLang('EN')} 
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${guidelinesLang === 'EN' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              English
            </button>
            <button 
              onClick={() => setGuidelinesLang('PH')} 
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${guidelinesLang === 'PH' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              Filipino
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                General Rules {guidelinesLang === 'PH' && '(Filipino)'}
              </label>
              <textarea 
                rows={4}
                value={guidelinesLang === 'EN' ? generalGuidelines.rules : generalGuidelines.rulesFilipino}
                onChange={(e) => setGeneralGuidelines({
                  ...generalGuidelines, 
                  [guidelinesLang === 'EN' ? 'rules' : 'rulesFilipino']: e.target.value
                })}
                placeholder={guidelinesLang === 'EN' ? "List basic rules for all tests..." : "Ilista ang mga pangunahing tuntunin..."}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-2">
                Do's {guidelinesLang === 'PH' && '(Filipino)'}
              </label>
              <textarea 
                rows={4}
                value={guidelinesLang === 'EN' ? generalGuidelines.dos : generalGuidelines.dosFilipino}
                onChange={(e) => setGeneralGuidelines({
                  ...generalGuidelines, 
                  [guidelinesLang === 'EN' ? 'dos' : 'dosFilipino']: e.target.value
                })}
                placeholder={guidelinesLang === 'EN' ? "What patients should do..." : "Ang dapat gawin ng pasyente..."}
                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-red-700 mb-2">
                Don'ts {guidelinesLang === 'PH' && '(Filipino)'}
              </label>
              <textarea 
                rows={4}
                value={guidelinesLang === 'EN' ? generalGuidelines.donts : generalGuidelines.dontsFilipino}
                onChange={(e) => setGeneralGuidelines({
                  ...generalGuidelines, 
                  [guidelinesLang === 'EN' ? 'donts' : 'dontsFilipino']: e.target.value
                })}
                placeholder={guidelinesLang === 'EN' ? "What patients should avoid..." : "Ang dapat iwasan ng pasyente..."}
                className="w-full bg-red-50/30 border border-red-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              onClick={async () => {
                setIsSavingGuidelines(true);
                try {
                  await setDoc(doc(db, 'settings', 'generalGuidelines'), generalGuidelines);
                  alert("General guidelines updated successfully!");
                  setIsGuidelinesModalOpen(false);
                } catch (err) {
                  console.error(err);
                  alert("Failed to update guidelines.");
                } finally {
                  setIsSavingGuidelines(false);
                }
              }}
              disabled={isSavingGuidelines}
              className={`px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all ${isSavingGuidelines ? 'opacity-50' : 'hover:bg-indigo-700 active:scale-95'}`}
            >
              {isSavingGuidelines ? 'Saving...' : 'Save Guidelines'}
            </button>
          </div>
        </div>
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
  const [formData, setFormData] = useState(() => {
    const base = initialData || {
      hospital: hospitals[0]?.id || '',
      procedureName: '',
      category: 'Other Test',
      description: '',
      imageUrl: '',
      preparationSteps: [],
      guidelines: { dos: [], donts: [], whatToKnow: [] },
      fastingRequired: '',
      status: 'Active'
    };
    
    // Ensure Filipino fields exist
    return {
      ...base,
      procedureNameFilipino: base.procedureNameFilipino || '',
      descriptionFilipino: base.descriptionFilipino || '',
      fastingRequiredFilipino: base.fastingRequiredFilipino || '',
      preparationStepsFilipino: base.preparationStepsFilipino || (base.preparationSteps || []).map((s: any) => ({ ...s, title: '', description: '' })),
      guidelinesFilipino: base.guidelinesFilipino || {
        dos: (base.guidelines?.dos || []).map((i: any) => ({ ...i, text: '' })),
        donts: (base.guidelines?.donts || []).map((i: any) => ({ ...i, text: '' })),
        whatToKnow: (base.guidelines?.whatToKnow || []).map((i: any) => ({ ...i, text: '' }))
      }
    };
  });

  const [formLang, setFormLang] = useState<'EN' | 'PH'>('EN');

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("This image is quite large and might take a long time to upload. Please consider a smaller image (under 5MB).");
    }

    try {
      setUploadingImage(true);
      const storageRef = ref(storage, `procedures/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Use functional state update to prevent stale closure overwriting user's typing
      setFormData((prev: any) => ({ ...prev, imageUrl: downloadURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please check your internet connection and try again.");
    } finally {
      setUploadingImage(false);
      // Reset input so the user can select the same file again if they want to
      e.target.value = '';
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      preparationSteps: [...(formData.preparationSteps || []), { icon: '📝', title: '', description: '' }],
      preparationStepsFilipino: [...(formData.preparationStepsFilipino || []), { icon: '📝', title: '', description: '' }]
    });
  };

  const removeStep = (index: number) => {
    const newSteps = [...(formData.preparationSteps || [])];
    const newStepsFilipino = [...(formData.preparationStepsFilipino || [])];
    newSteps.splice(index, 1);
    newStepsFilipino.splice(index, 1);
    setFormData({ ...formData, preparationSteps: newSteps, preparationStepsFilipino: newStepsFilipino });
  };

  const updateStep = (index: number, field: string, value: string, lang: 'EN' | 'PH') => {
    if (lang === 'EN') {
      const newSteps = [...(formData.preparationSteps || [])];
      newSteps[index] = { ...newSteps[index], [field]: value };
      
      // If updating icon, sync it to Filipino
      if (field === 'icon') {
        const newStepsFilipino = [...(formData.preparationStepsFilipino || [])];
        if (newStepsFilipino[index]) {
          newStepsFilipino[index] = { ...newStepsFilipino[index], icon: value };
          setFormData({ ...formData, preparationSteps: newSteps, preparationStepsFilipino: newStepsFilipino });
          return;
        }
      }
      setFormData({ ...formData, preparationSteps: newSteps });
    } else {
      const newStepsFilipino = [...(formData.preparationStepsFilipino || [])];
      newStepsFilipino[index] = { ...newStepsFilipino[index], [field]: value };
      
      // If updating icon, sync it to English
      if (field === 'icon') {
        const newSteps = [...(formData.preparationSteps || [])];
        if (newSteps[index]) {
          newSteps[index] = { ...newSteps[index], icon: value };
          setFormData({ ...formData, preparationSteps: newSteps, preparationStepsFilipino: newStepsFilipino });
          return;
        }
      }
      setFormData({ ...formData, preparationStepsFilipino: newStepsFilipino });
    }
  };

  const addGuideline = (type: 'dos' | 'donts' | 'whatToKnow') => {
    setFormData({
      ...formData,
      guidelines: {
        ...formData.guidelines,
        [type]: [...(formData.guidelines?.[type] || []), { icon: '📌', text: '' }]
      },
      guidelinesFilipino: {
        ...formData.guidelinesFilipino,
        [type]: [...(formData.guidelinesFilipino?.[type] || []), { icon: '📌', text: '' }]
      }
    });
  };

  const removeGuideline = (type: 'dos' | 'donts' | 'whatToKnow', index: number) => {
    const newItems = [...(formData.guidelines?.[type] || [])];
    const newItemsFilipino = [...(formData.guidelinesFilipino?.[type] || [])];
    newItems.splice(index, 1);
    newItemsFilipino.splice(index, 1);
    setFormData({
      ...formData,
      guidelines: { ...formData.guidelines, [type]: newItems },
      guidelinesFilipino: { ...formData.guidelinesFilipino, [type]: newItemsFilipino }
    });
  };

  const updateGuideline = (type: 'dos' | 'donts' | 'whatToKnow', index: number, field: string, value: string, lang: 'EN' | 'PH') => {
    if (lang === 'EN') {
      const newItems = [...(formData.guidelines?.[type] || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Sync icon
      if (field === 'icon') {
        const newItemsFilipino = [...(formData.guidelinesFilipino?.[type] || [])];
        if (newItemsFilipino[index]) {
          newItemsFilipino[index] = { ...newItemsFilipino[index], icon: value };
          setFormData({
            ...formData,
            guidelines: { ...formData.guidelines, [type]: newItems },
            guidelinesFilipino: { ...formData.guidelinesFilipino, [type]: newItemsFilipino }
          });
          return;
        }
      }
      setFormData({ ...formData, guidelines: { ...formData.guidelines, [type]: newItems } });
    } else {
      const newItemsFilipino = [...(formData.guidelinesFilipino?.[type] || [])];
      newItemsFilipino[index] = { ...newItemsFilipino[index], [field]: value };
      
      // Sync icon
      if (field === 'icon') {
        const newItems = [...(formData.guidelines?.[type] || [])];
        if (newItems[index]) {
          newItems[index] = { ...newItems[index], icon: value };
          setFormData({
            ...formData,
            guidelines: { ...formData.guidelines, [type]: newItems },
            guidelinesFilipino: { ...formData.guidelinesFilipino, [type]: newItemsFilipino }
          });
          return;
        }
      }
      setFormData({ ...formData, guidelinesFilipino: { ...formData.guidelinesFilipino, [type]: newItemsFilipino } });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Language Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-4">
        <button 
          type="button"
          onClick={() => setFormLang('EN')} 
          className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${formLang === 'EN' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
        >
          English
        </button>
        <button 
          type="button"
          onClick={() => setFormLang('PH')} 
          className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${formLang === 'PH' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
        >
          Tagalog
        </button>
      </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Procedure Name {formLang === 'PH' && '(Tagalog)'}
          </label>
          <input 
            type="text" 
            value={formLang === 'EN' ? formData.procedureName : formData.procedureNameFilipino}
            onChange={(e) => setFormData({ 
              ...formData, 
              [formLang === 'EN' ? 'procedureName' : 'procedureNameFilipino']: e.target.value 
            })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none"
            required={formLang === 'EN'}
            placeholder={formLang === 'PH' ? 'Tagalog translation...' : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <div className="relative">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Type a category name (e.g., Blood Test)"
              required
            />
          </div>
          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.filter(c => c && c !== 'Choose laboratory test' && c !== 'Choose categories').map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({ ...formData, category: c })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  formData.category === c 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description {formLang === 'PH' && '(Tagalog)'}
        </label>
        <textarea 
          rows={2}
          value={formLang === 'EN' ? formData.description : formData.descriptionFilipino}
          onChange={(e) => setFormData({ 
            ...formData, 
            [formLang === 'EN' ? 'description' : 'descriptionFilipino']: e.target.value 
          })}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
          placeholder={formLang === 'PH' ? 'Tagalog translation...' : ''}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Procedure Image</label>
        <div className="flex items-center space-x-4">
          {formData.imageUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
              <img src={formData.imageUrl} alt="Procedure" className="w-full h-full object-cover" />
            </div>
          )}
          <label className={`flex-1 flex justify-center items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {uploadingImage ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUpTrayIcon className="w-5 h-5" />
              )}
              <span className="font-medium">{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
            </div>
            <input 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>
        {formData.imageUrl && (
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, imageUrl: '' })}
            className="text-xs text-red-500 hover:text-red-600 font-medium mt-2"
          >
            Remove Image
          </button>
        )}
      </div>



      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Preparation Steps
          </label>
          <button type="button" onClick={addStep} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center">
            <PlusIcon className="w-3 h-3 mr-1" /> Add Step
          </button>
        </div>
        <div className="space-y-3">
          {(formLang === 'EN' ? formData.preparationSteps : formData.preparationStepsFilipino).map((step: any, idx: number) => (
            <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input 
                type="text" 
                value={step.icon} 
                onChange={(e) => updateStep(idx, 'icon', e.target.value, formLang)} 
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center" 
              />
              <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  value={step.title} 
                  onChange={(e) => updateStep(idx, 'title', e.target.value, formLang)} 
                  placeholder={formLang === 'EN' ? "Title" : "Pamagat (Tagalog)"} 
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" 
                />
                <input 
                  type="text" 
                  value={step.description} 
                  onChange={(e) => updateStep(idx, 'description', e.target.value, formLang)} 
                  placeholder={formLang === 'EN' ? "Instructions" : "Mga tagubilin (Tagalog)"} 
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" 
                />
              </div>
              <button type="button" onClick={() => removeStep(idx)} className="text-gray-400 hover:text-red-500"><XMarkIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Testing Guidelines – What to Do
          </label>
          <button type="button" onClick={() => addGuideline('dos')} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center">
            <PlusIcon className="w-3 h-3 mr-1" /> Add Do
          </button>
        </div>
        <div className="space-y-3">
          {(formLang === 'EN' ? (formData.guidelines?.dos || []) : (formData.guidelinesFilipino?.dos || [])).map((item: any, idx: number) => (
            <div key={idx} className="flex gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
              <input 
                type="text" 
                value={item.icon} 
                onChange={(e) => updateGuideline('dos', idx, 'icon', e.target.value, formLang)} 
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center" 
              />
              <div className="flex-1">
                <input 
                  type="text" 
                  value={item.text} 
                  onChange={(e) => updateGuideline('dos', idx, 'text', e.target.value, formLang)} 
                  placeholder={formLang === 'EN' ? "What to do" : "Ano ang dapat gawin (Tagalog)"} 
                  className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-xs outline-none" 
                />
              </div>
              <button type="button" onClick={() => removeGuideline('dos', idx)} className="text-gray-400 hover:text-red-500 flex items-center"><XMarkIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Testing Guidelines – To Avoid
          </label>
          <button type="button" onClick={() => addGuideline('donts')} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-center">
            <PlusIcon className="w-3 h-3 mr-1" /> Add Don't
          </button>
        </div>
        <div className="space-y-3">
          {(formLang === 'EN' ? (formData.guidelines?.donts || []) : (formData.guidelinesFilipino?.donts || [])).map((item: any, idx: number) => (
            <div key={idx} className="flex gap-3 bg-red-50/50 p-3 rounded-xl border border-red-100/50">
              <input 
                type="text" 
                value={item.icon} 
                onChange={(e) => updateGuideline('donts', idx, 'icon', e.target.value, formLang)} 
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center" 
              />
              <div className="flex-1">
                <input 
                  type="text" 
                  value={item.text} 
                  onChange={(e) => updateGuideline('donts', idx, 'text', e.target.value, formLang)} 
                  placeholder={formLang === 'EN' ? "What to avoid" : "Ano ang dapat iwasan (Tagalog)"} 
                  className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-xs outline-none" 
                />
              </div>
              <button type="button" onClick={() => removeGuideline('donts', idx)} className="text-gray-400 hover:text-red-500 flex items-center"><XMarkIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Testing Guidelines – What to Know
          </label>
          <button type="button" onClick={() => addGuideline('whatToKnow')} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center">
            <PlusIcon className="w-3 h-3 mr-1" /> Add Note
          </button>
        </div>
        <div className="space-y-3">
          {(formLang === 'EN' ? (formData.guidelines?.whatToKnow || []) : (formData.guidelinesFilipino?.whatToKnow || [])).map((item: any, idx: number) => (
            <div key={idx} className="flex gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
              <input 
                type="text" 
                value={item.icon} 
                onChange={(e) => updateGuideline('whatToKnow', idx, 'icon', e.target.value, formLang)} 
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-center" 
              />
              <div className="flex-1">
                <input 
                  type="text" 
                  value={item.text} 
                  onChange={(e) => updateGuideline('whatToKnow', idx, 'text', e.target.value, formLang)} 
                  placeholder={formLang === 'EN' ? "What to know" : "Ano ang dapat malaman (Tagalog)"} 
                  className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-xs outline-none" 
                />
              </div>
              <button type="button" onClick={() => removeGuideline('whatToKnow', idx)} className="text-gray-400 hover:text-red-500 flex items-center"><XMarkIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Fasting Required {formLang === 'PH' && '(Tagalog)'}
          </label>
          <input 
            type="text" 
            value={formLang === 'EN' ? formData.fastingRequired : formData.fastingRequiredFilipino} 
            onChange={(e) => setFormData({ 
              ...formData, 
              [formLang === 'EN' ? 'fastingRequired' : 'fastingRequiredFilipino']: e.target.value 
            })} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" 
            placeholder={formLang === 'PH' ? 'Tagalog translation...' : ''}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-[#1d2530] text-white font-medium rounded-xl hover:bg-black transition-colors">Save Procedure</button>
      </div>
    </form>
  );
}

function ProcedureDetails({ procedure, onClose }: { procedure: import('../../patient/context/AppContext').TestGuide, onClose: () => void }) {
  const { hospitals } = useAppContext();
  if (!procedure) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden">
          <SafeImage 
            src={procedure.imageUrl} 
            alt={procedure.procedureName} 
            category={procedure.category} 
            className="w-10 h-10" 
          />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-gray-900">{procedure.procedureName}</h4>
          <div className="flex items-center text-sm text-gray-500 mt-0.5">
            <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
            {hospitals.find((h: { id: string; name: string }) => h.id === procedure.hospital)?.name || 'Global Procedure'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Category</div>
          <div>{procedure.category}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Status</div>
          <div>{procedure.status}</div>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl min-w-0">
          <div className="text-[10px] text-gray-400 uppercase mb-1">Fasting</div>
          <div className="font-semibold text-gray-700 break-words">
            {procedure.fastingRequired || 'None'}
          </div>
        </div>
      </div>

      <div>
        <h5 className="text-sm font-bold text-gray-900 mb-2">Preparation Steps</h5>
        <div className="space-y-2">
          {procedure.preparationSteps?.map((step: { icon: string; title: string; description: string }, idx: number) => (
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
              {procedure.guidelines?.dos?.map((item: { icon: string; text: string }, idx: number) => (
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
              {procedure.guidelines?.donts?.map((item: { icon: string; text: string }, idx: number) => (
                <li key={idx} className="flex gap-2 text-[10px] text-red-900 leading-tight">
                  <span className="shrink-0">{item.icon}</span> {item.text}
                </li>
              ))}
              {!procedure.guidelines?.donts?.length && <li className="text-[10px] text-red-600/50 italic">None</li>}
            </ul>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 col-span-2">
            <h6 className="text-[10px] font-bold text-blue-800 uppercase mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              What to Know
            </h6>
            <ul className="space-y-2">
              {procedure.guidelines?.whatToKnow?.map((item: { icon: string; text: string }, idx: number) => (
                <li key={idx} className="flex gap-2 text-[10px] text-blue-900 leading-tight">
                  <span className="shrink-0">{item.icon}</span> {item.text}
                </li>
              ))}
              {!procedure.guidelines?.whatToKnow?.length && <li className="text-[10px] text-blue-600/50 italic">None</li>}
            </ul>
          </div>
        </div>
      </div>

      <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors">Close Preview</button>
    </div>
  );
}
