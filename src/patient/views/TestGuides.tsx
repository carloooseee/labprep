import { useState, useEffect } from 'react';
import { translateText } from '../../utils/translate';
import { useAppContext, type TestGuide } from '../context/AppContext';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/solid';
import { App as CapApp } from '@capacitor/app';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import urineVideo from '../../assets/24-Hour_Urine_Guide (1).mov';
import stoolVideo from '../../assets/Stool_Collection_Prep (1).mp4';
import fecalysiaVideo from '../../assets/fecalysia.mov';

// Fallback Images
import urinalysisImg from '../../assets/test-guides/urinalysis.png';
import bloodTestImg from '../../assets/test-guides/blood_test.png';
import stoolTestImg from '../../assets/test-guides/stool_test.png';
import imagingImg from '../../assets/test-guides/imaging.png';
import genericImg from '../../assets/test-guides/generic.png';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Urinalysis': return 'bg-orange-50 text-orange-600';
    case 'Serological Test': return 'bg-rose-50 text-rose-600';
    case 'Stool Test': return 'bg-amber-100 text-amber-800';
    case 'Blood Chemistry': return 'bg-violet-50 text-violet-600';
    case 'Hematology': return 'bg-teal-50 text-teal-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getCategoryOverlayColor = (category: string) => {
  switch (category) {
    case 'Urinalysis': return 'from-orange-500/40 to-orange-600/10';
    case 'Serological Test': return 'from-rose-500/40 to-rose-600/10';
    case 'Stool Test': return 'from-amber-700/40 to-amber-800/10';
    case 'Blood Chemistry': return 'from-violet-500/40 to-violet-600/10';
    case 'Hematology': return 'from-teal-500/40 to-teal-600/10';
    default: return 'from-gray-500/40 to-gray-600/10';
  }
};

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

const SafeImage = ({ src, alt, category, className }: { src?: string, alt: string, category: string, className?: string }) => {
  const [imgSrc, setImgSrc] = useState(src || getFallbackImage(category));
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
      setLoading(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!hasError) {
            setImgSrc(getFallbackImage(category));
            setHasError(true);
            setLoading(false);
          }
        }}
      />
    </div>
  );
};

function useLiveTranslation(guide: TestGuide | null, lang: 'EN' | 'PH') {
  const [translatedGuide, setTranslatedGuide] = useState<TestGuide | null>(guide);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!guide) {
      setTranslatedGuide(null);
      return;
    }
    if (lang === 'EN') {
      setTranslatedGuide(guide);
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    const translateAll = async () => {
      try {
        const translated = { ...guide };
        
        const [
          procedureName,
          description,
          fastingRequired,
          preparationSteps,
          dos,
          donts,
          whatToKnow
        ] = await Promise.all([
          translateText(guide.procedureName),
          translateText(guide.description),
          guide.fastingRequired ? translateText(guide.fastingRequired) : Promise.resolve(guide.fastingRequired),
          guide.preparationSteps ? Promise.all(
            guide.preparationSteps.map(async (step: any) => ({
              ...step,
              title: await translateText(step.title),
              description: await translateText(step.description),
              timing: step.timing ? await translateText(step.timing) : step.timing
            }))
          ) : Promise.resolve(guide.preparationSteps),
          guide.guidelines?.dos ? Promise.all(guide.guidelines.dos.map(async (i: any) => ({ ...i, text: await translateText(i.text) }))) : Promise.resolve(guide.guidelines?.dos),
          guide.guidelines?.donts ? Promise.all(guide.guidelines.donts.map(async (i: any) => ({ ...i, text: await translateText(i.text) }))) : Promise.resolve(guide.guidelines?.donts),
          guide.guidelines?.whatToKnow ? Promise.all(guide.guidelines.whatToKnow.map(async (i: any) => ({ ...i, text: await translateText(i.text) }))) : Promise.resolve(guide.guidelines?.whatToKnow)
        ]);

        translated.procedureName = procedureName;
        translated.description = description;
        translated.fastingRequired = fastingRequired;
        translated.preparationSteps = preparationSteps;
        translated.guidelines = { dos, donts, whatToKnow };

        if (isMounted) {
          setTranslatedGuide(translated);
        }
      } catch (err) {
        console.error("Translation failed", err);
        if (isMounted) setTranslatedGuide(guide);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    translateAll();

    return () => { isMounted = false; };
  }, [guide, lang]);

  return { translatedGuide, isTranslating };
}

const GenericGuideContent = ({ guide, activeTab, isTranslating }: { guide: TestGuide, activeTab: 'Preparations' | 'Guidelines', isTranslating?: boolean }) => {
  const description = guide.description;
  const preparationSteps = guide.preparationSteps || [];
  const guidelines = guide.guidelines;
  const fastingRequired = guide.fastingRequired;

  if (isTranslating) {
    return (
      <div className="space-y-6 animate-pulse">
         <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
         <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
         <div className="h-4 bg-gray-200 rounded w-4/6 mb-8"></div>
         <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 mt-8"></div>
         <div className="space-y-3 ml-4 border-l-2 border-gray-200 pl-4">
           <div className="h-16 bg-gray-100 rounded w-full"></div>
           <div className="h-16 bg-gray-100 rounded w-full"></div>
         </div>
      </div>
    );
  }
  
  if (activeTab === 'Preparations') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
          {description}
        </p>


        <div>
          <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">
            Preparation Steps
          </h3>
          <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
            {preparationSteps?.map((step: any, idx: number) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[17px] top-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">
                  {step.icon}
                </div>
                <h4 className="font-bold text-[var(--color-on-surface)] text-md">{step.title}</h4>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{step.description}</p>
                {step.timing && (
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">
                    {step.timing}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
          <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            What to Do
          </h4>
          <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
            {guidelines?.dos?.map((item: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">{item.icon}</span> {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
          <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            What to Avoid
          </h4>
          <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
            {guidelines?.donts?.map((item: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">{item.icon}</span> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {guidelines?.whatToKnow && guidelines.whatToKnow.length > 0 && (
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 shadow-sm">
          <h4 className="font-bold font-display text-blue-800 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            What to Know
          </h4>
          <ul className="space-y-3 text-sm font-body text-blue-900 leading-relaxed">
            {guidelines.whatToKnow.map((item: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">{item.icon}</span> {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {fastingRequired && (
        <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/50 shadow-sm">
          <h4 className="font-bold font-display text-orange-800 mb-2 flex items-center gap-2">🍽️ Fasting Required</h4>
          <p className="text-sm font-body text-orange-900 leading-relaxed">
            You must fast for {fastingRequired} before this test. Only water is typically allowed during fasting.
          </p>
        </div>
      )}
    </div>
  );
};

export default function TestGuides() {
  const { testGuides, loading } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<TestGuide | null>(null);
  const [activeTab, setActiveTab] = useState<'Preparations' | 'Guidelines'>('Preparations');
  const [lang, setLang] = useState<'EN' | 'PH'>('EN');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [globalPricingUrl, setGlobalPricingUrl] = useState('');

  const { translatedGuide, isTranslating } = useLiveTranslation(selectedGuide, lang);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'pricing'));
        if (snap.exists()) {
          setGlobalPricingUrl(snap.data().url || '');
        }
      } catch (err) {
        console.error("Error fetching global pricing:", err);
      }
    };
    fetchPricing();
  }, []);

  useEffect(() => {
    let handler: any = null;
    if (selectedGuide) {
      CapApp.addListener('backButton', () => {
        setSelectedGuide(null);
      }).then(h => { handler = h; });
    }

    return () => {
      if (handler) {
        handler.remove();
      }
    };
  }, [selectedGuide]);

  const filteredGuides = testGuides.filter((proc) => {
    const matchesSearch = proc.procedureName.toLowerCase().includes(searchQuery.toLowerCase());
    const procCategory = proc.category?.trim() || 'Other Test';
    const normalizedCategory = procCategory.toLowerCase() === 'other test' ? 'Other Test' : procCategory;
    const matchesCategory = activeCategory ? normalizedCategory === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categoryPriority: Record<string, number> = {
    'Hematology': 1,
    'Blood Chemistry': 2,
    'Serological Test': 3,
    'Urinalysis': 4,
    'Stool Test': 5,
    'Imaging': 6,
    'Other Test': 7
  };

  const allCategories = Array.from(new Set(
    testGuides.map(g => {
      const cat = g.category?.trim() || 'Other Test';
      return cat.toLowerCase() === 'other test' ? 'Other Test' : cat;
    })
  )).filter(Boolean).sort((a, b) => (categoryPriority[a] || 999) - (categoryPriority[b] || 999));

  const categories = Array.from(new Set(
    filteredGuides.map(g => {
      const cat = g.category?.trim() || 'Other Test';
      return cat.toLowerCase() === 'other test' ? 'Other Test' : cat;
    })
  ));
  
  const sortedCategories = categories.sort((a, b) => (categoryPriority[a] || 999) - (categoryPriority[b] || 999));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 pt-4">

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-[#e745a7] to-[#b34bee] rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><DocumentTextIcon className="w-24 h-24" /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mt-4 leading-tight">Laboratory Test Guides</h2>
          <div className="flex items-center mt-6 space-x-2">
            <span className="font-body text-sm font-medium">Learn how to prepare for your lab tests</span>
          </div>
        </div>
      </div>

      {/* Laboratory Test Categories Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)] mb-4">Laboratory Test Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {allCategories.map(category => {
            const procCount = testGuides.filter(p => {
              const cat = p.category?.trim() || 'Other Test';
              return (cat.toLowerCase() === 'other test' ? 'Other Test' : cat) === category;
            }).length;
            const isActive = activeCategory === category;
            return (
              <div 
                key={category}
                onClick={() => setActiveCategory(isActive ? null : category)}
                className={`p-4 rounded-2xl shadow-sm border transition-transform active:scale-95 flex flex-col h-full items-center text-center justify-center space-y-3 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' 
                    : 'bg-white border-[#e5e9eb] hover:bg-gray-50'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <TagIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-bold font-display text-sm leading-tight mb-1 ${isActive ? 'text-blue-800' : 'text-gray-800'}`}>{category}</h4>
                  <p className={`text-[10px] font-body uppercase tracking-wider font-bold ${isActive ? 'text-blue-600' : 'text-[var(--color-on-surface-variant)]'}`}>
                    {procCount} {procCount === 1 ? 'Test' : 'Tests'}
                  </p>
                </div>
              </div>
            );
          })}
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

      {/* Pricing Button */}
      {globalPricingUrl && (
        <div className="mb-8">
          <button 
            onClick={() => setIsPricingModalOpen(true)}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold font-display py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Laboratory Pricing</span>
          </button>
        </div>
      )}

      {filteredGuides.length === 0 ? (
        <p className="text-sm font-body text-[var(--color-on-surface-variant)]">No guides available for this criteria.</p>
      ) : (
        <div className="space-y-10">
          {sortedCategories.map((cat) => {
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
                      <div className="h-32 bg-gray-100 shrink-0 relative overflow-hidden group">
                        <SafeImage 
                          src={guide.imageUrl} 
                          alt={guide.procedureName} 
                          category={guide.category} 
                          className="w-full h-full transition-transform duration-700 group-hover:scale-110 absolute inset-0 z-0" 
                        />
                        <div className={`absolute inset-0 z-10 bg-gradient-to-br ${getCategoryOverlayColor(guide.category)} pointer-events-none mix-blend-multiply`}></div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)] leading-tight">{guide.procedureName}</h3>
                        </div>
                        <p className="text-sm font-body leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-wrap mb-5">
                          {guide.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto pt-2">
                          {guide.fastingRequired && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 shadow-sm shrink-0">
                              {guide.fastingRequired}
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

      {selectedGuide && translatedGuide && (() => {
        const isUrineVideo = selectedGuide.procedureName.toLowerCase().includes('24') && (selectedGuide.procedureName.toLowerCase().includes('urine') || selectedGuide.procedureName.toLowerCase().includes('urinalysis'));
        const isStoolVideo = selectedGuide.procedureName.toLowerCase().includes('stool');
        const hasVideo = isUrineVideo || isStoolVideo;

        return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="aspect-video w-full max-h-[35vh] relative shrink-0 bg-black">
            {isUrineVideo ? (
              <video src={urineVideo} controls playsInline className="w-full h-full object-contain" />
            ) : isStoolVideo ? (
              <video src={stoolVideo} controls playsInline className="w-full h-full object-contain" />
            ) : (
              <SafeImage 
                src={selectedGuide.imageUrl} 
                alt={selectedGuide.procedureName} 
                category={selectedGuide.category} 
                className="w-full h-full" 
              />
            )}
            
            {!hasVideo && (
              <div className={`absolute inset-0 z-10 bg-gradient-to-br ${getCategoryOverlayColor(selectedGuide.category)} mix-blend-multiply pointer-events-none`}></div>
            )}
            
            <button 
              onClick={() => setSelectedGuide(null)} 
              className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/20 shadow-sm"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className={`flex flex-col flex-grow bg-white relative z-20 overflow-hidden ${hasVideo ? '' : '-mt-6 rounded-t-[2rem]'}`}>
            <div className="p-5 pb-3 shrink-0 shadow-sm border-b border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold font-display text-[var(--color-on-surface)] leading-tight flex-1 mr-2">
                  {isTranslating ? (
                    <span className="inline-block animate-pulse bg-gray-200 w-3/4 h-8 rounded"></span>
                  ) : translatedGuide.procedureName}
                </h2>
                <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                  <button onClick={() => setLang('EN')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'EN' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>EN</button>
                  <button onClick={() => setLang('PH')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${lang === 'PH' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>PH</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {translatedGuide.fastingRequired && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                    {isTranslating ? '...' : translatedGuide.fastingRequired}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(selectedGuide.category)} border border-transparent shadow-sm`}>
                  {selectedGuide.category}
                </span>
              </div>
              
              <div className="flex bg-[var(--color-surface-container-highest)] p-1 rounded-xl shadow-inner">
                <button 
                  className={`flex-1 py-3 text-sm font-bold font-body rounded-lg transition-all ${activeTab === 'Preparations' ? 'bg-white text-[var(--color-primary)] shadow border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('Preparations')}
                >
                  Preparations
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-bold font-body rounded-lg transition-all ${activeTab === 'Guidelines' ? 'bg-white text-[var(--color-primary)] shadow border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('Guidelines')}
                >
                  Guidelines
                </button>
              </div>
            </div>

            <div className="p-5 pt-4 overflow-y-auto pb-24 h-full">
              <GenericGuideContent guide={translatedGuide} activeTab={activeTab} isTranslating={isTranslating} />
            </div>
          </div>
        </div>
        );
      })()}

      {/* Pricing Modal */}
      {isPricingModalOpen && globalPricingUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-display font-bold text-gray-900">Laboratory Pricing List</h3>
              <button 
                onClick={() => setIsPricingModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 p-4 flex items-center justify-center">
              <img 
                src={globalPricingUrl} 
                alt="Laboratory Pricing"
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 font-body">
              Prices are subject to change without prior notice. Please contact the laboratory directly for confirmation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
