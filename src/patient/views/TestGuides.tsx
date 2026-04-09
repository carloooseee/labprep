import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { proceduresCollection, hospitalsCollection, type Procedure } from '../data/Procedures';
import { BeakerIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon, EllipsisHorizontalCircleIcon, BuildingOfficeIcon, BellAlertIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Urine': return 'bg-orange-50 text-orange-600';
    case 'Blood': return 'bg-rose-50 text-rose-600';
    case 'Stool': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getCategoryOverlayColor = (category: string) => {
  switch (category) {
    case 'Urine': return 'from-orange-500/40 to-orange-600/10';
    case 'Blood': return 'from-rose-500/40 to-rose-600/10';
    case 'Stool': return 'from-amber-700/40 to-amber-800/10';
    default: return 'from-gray-500/40 to-gray-600/10';
  }
};

export default function TestGuides() {
  const { selectedHospitalId, setSelectedHospitalId } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGuide, setSelectedGuide] = useState<Procedure | null>(null);
  const [activeTab, setActiveTab] = useState<'Preparations' | 'Guidelines'>('Preparations');

  const filteredGuides = proceduresCollection.filter(
    (proc) => proc.hospitalId === selectedHospitalId 
           && proc.name.toLowerCase().includes(searchQuery.toLowerCase())
           && (selectedCategory === 'All' || proc.category === selectedCategory)
  );

  return (
    <div className="p-6 pb-24">
      <header className="mb-10 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-[var(--color-primary)] tracking-tight mb-1">LabPrep</h1>
          <p className="text-xs font-body text-[var(--color-on-surface-variant)] font-semibold uppercase tracking-widest">Prepare Right. Test Right.</p>
        </div>
        <div className="flex space-x-3 shrink-0">
          <Link to="/patient/hospitals" className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e9eb] shadow-sm hover:scale-105 transition-transform">
            <BuildingOfficeIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </Link>
          <Link to="/patient/notifications" className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e9eb] shadow-sm hover:scale-105 transition-transform">
            <BellAlertIcon className="w-6 h-6 text-emerald-600" />
          </Link>
        </div>
      </header>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-[#e745a7] to-[#b34bee] rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><DocumentTextIcon className="w-24 h-24" /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mt-4 leading-tight">Test Preparation Guides</h2>
          <div className="flex items-center mt-6 space-x-2">
            <span className="font-body text-sm font-medium">Learn how to prepare for your lab tests</span>
          </div>
        </div>
      </div>

      {/* Hospital Selector */}
      <div className="mb-4">
        <label className="block text-sm font-bold font-display text-[var(--color-on-surface-variant)] mb-2 uppercase tracking-wide">
          Filter by Hospital
        </label>
        <div className="relative">
          <select 
            value={selectedHospitalId || ''} 
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="w-full appearance-none bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-body font-bold py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
          >
            {hospitalsCollection.map(hospital => (
              <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-bold font-display text-[var(--color-on-surface-variant)] mb-2 uppercase tracking-wide">
          Search Tests
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
          </div>
          <input
            type="text"
            placeholder="Search for a test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-body py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-2 pb-2">
        {['All', 'Urine', 'Blood', 'Stool', 'Other'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 snap-start shrink-0 ${
              selectedCategory === cat 
                ? 'bg-[#427cf2] text-white shadow-md shadow-[#427cf2]/20 border border-transparent' 
                : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)] border border-[var(--color-surface-container-highest)]'
            }`}
          >
            {cat === 'All' ? 'All Tests' : `${cat} Test`}
          </button>
        ))}
      </div>

      {filteredGuides.length === 0 ? (
        <p className="text-sm font-body text-[var(--color-on-surface-variant)]">No guides available for this hospital.</p>
      ) : (
        <div className="space-y-10">
          {['Urine', 'Blood', 'Stool', 'Other'].map((cat) => {
            const categoryGuides = filteredGuides.filter(g => g.category === cat);
            if (categoryGuides.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="text-lg font-bold font-display text-[var(--color-on-surface-variant)] mb-4 border-b border-[var(--color-surface-container-highest)] pb-2">{cat} Tests</h2>
                <div className="space-y-6">
                  {categoryGuides.map((guide) => (
                    <div 
                      key={guide.id} 
                      onClick={() => { setSelectedGuide(guide); setActiveTab('Preparations'); }}
                      className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[#e5e9eb] shadow-sm overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 active:scale-[0.98] hover:shadow-md"
                    >
                      {guide.imageUrl && (
                        <div className="h-32 bg-gray-100 shrink-0 relative overflow-hidden group">
                          <img src={guide.imageUrl} alt={guide.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 absolute inset-0 z-0" />
                          <div className={`absolute inset-0 z-10 bg-gradient-to-br ${getCategoryOverlayColor(guide.category)} pointer-events-none mix-blend-multiply`}></div>
                        </div>
                      )}
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)] leading-tight">{guide.name}</h3>
                        </div>
                        <p className="text-sm font-body leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-wrap mb-5">
                          {guide.instructions}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto pt-2">
                          {guide.fastingRequirement && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 shadow-sm shrink-0">
                              {guide.fastingRequirement}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(guide.category)} border border-transparent shadow-sm shrink-0`}>
                            {guide.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedGuide(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header Hero */}
            {selectedGuide.imageUrl && (
              <div className="h-24 relative shrink-0">
                <img src={selectedGuide.imageUrl} alt={selectedGuide.name} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 z-10 bg-gradient-to-br ${getCategoryOverlayColor(selectedGuide.category)} mix-blend-multiply`}></div>
                
                <button 
                  onClick={() => setSelectedGuide(null)} 
                  className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/20 shadow-sm"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Modal Content */}
            <div className="flex flex-col flex-grow overflow-hidden">
              <div className="p-6 pb-0 shrink-0">
                <h2 className="text-2xl font-bold font-display text-[var(--color-on-surface)] leading-tight mb-4">{selectedGuide.name}</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedGuide.fastingRequirement && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                      {selectedGuide.fastingRequirement}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(selectedGuide.category)} border border-transparent shadow-sm`}>
                    {selectedGuide.category}
                  </span>
                </div>
                
                {/* Segmented Tab Control */}
                <div className="flex bg-[var(--color-surface-container-highest)] p-1 rounded-xl mb-6 shadow-inner">
                  <button 
                    className={`flex-1 py-2 text-sm font-bold font-body rounded-lg transition-all ${activeTab === 'Preparations' ? 'bg-white text-[var(--color-primary)] shadow border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('Preparations')}
                  >
                    Preparations
                  </button>
                  <button 
                    className={`flex-1 py-2 text-sm font-bold font-body rounded-lg transition-all ${activeTab === 'Guidelines' ? 'bg-white text-[var(--color-primary)] shadow border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('Guidelines')}
                  >
                    Guidelines
                  </button>
                </div>
              </div>

              {/* Dynamic Scrollable Content */}
              <div className="p-6 pt-0 overflow-y-auto">
                <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-wrap">
                  {activeTab === 'Preparations' 
                    ? selectedGuide.instructions 
                    : (selectedGuide.guidelines || "No specific guidelines provided for this procedure yet.")}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
