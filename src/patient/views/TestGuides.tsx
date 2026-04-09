import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { proceduresCollection, hospitalsCollection } from '../data/Procedures';
import { BeakerIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon, EllipsisHorizontalCircleIcon, BuildingOfficeIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Urine': return 'bg-orange-50 text-orange-600';
    case 'Blood': return 'bg-rose-50 text-rose-600';
    case 'Stool': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function TestGuides() {
  const { selectedHospitalId, setSelectedHospitalId } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
                    <div key={guide.id} className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl border border-[#e5e9eb] shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)]">{guide.name}</h3>
                        <div className="flex space-x-2 shrink-0 flex-wrap justify-end">
                          {guide.fastingRequirement && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 mb-1 lg:mb-0 border border-gray-200 shadow-sm">
                              {guide.fastingRequirement}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(guide.category)} mb-1 lg:mb-0 border border-transparent shadow-sm`}>
                            {guide.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-body leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-wrap">
                        {guide.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
