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

const UrinalysisPreparations = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
      Examines urine to detect and manage various diseases and conditions.
    </p>
    <div>
      <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">Preparation Steps</h3>
      <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">🌅</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Morning Sample</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Collect first morning urine sample</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Morning of test</span>
        </div>

        {/* Step 2 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">📌</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Note</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Use a clean, dry container</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">During collection</span>
        </div>

        {/* Step 3 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">🥛</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Midstream Urine</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Collect midstream urine</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">During collection</span>
        </div>

      </div>
    </div>
  </div>
);

const UrinalysisGuidelines = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* What to Do */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
        <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>What to Do</h4>
        <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🧼</span> Clean the genital area before collection</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📋</span> Use provided sterile container</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">⏰</span> Deliver sample within 1 hour</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Label container with your name</li>
        </ul>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
        <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>What to Avoid</h4>
        <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📋</span> Don't touch inside of container</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Don't collect during menstruation</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Don't use old containers from home</li>
        </ul>
      </div>
    </div>

    {/* Quick Visual Guide */}
    <div>
      <h4 className="font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Visual Guide</h4>
      <div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">
        
        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl mb-3">🌅</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Morning<br/>sample</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-3">🧼</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Clean<br/>first</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-2xl mb-3">🥛</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Midstream<br/>catch</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-2xl mb-3">💧</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Stay<br/>hydrated</span>
        </div>

      </div>
    </div>
  </div>
);

const FBSPreparations = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
      Measures your blood glucose level after fasting to check for diabetes or prediabetes.
    </p>
    <div>
      <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">Preparation Steps</h3>
      <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">🍽️</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Fasting</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Fast for 8-12 hours before the test</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Night before test</span>
        </div>

        {/* Step 2 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">🍽️</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Fasting</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Only drink plain water during fasting</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">During fasting period</span>
        </div>

        {/* Step 3 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">📌</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Note</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Schedule test early in the morning</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Morning</span>
        </div>

      </div>
    </div>
  </div>
);

const FBSGuidelines = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* What to Do */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
        <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>What to Do</h4>
        <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💧</span> Drink plenty of water</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">😴</span> Get adequate sleep the night before</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Take your morning medications after the test</li>
        </ul>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
        <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>What to Avoid</h4>
        <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💧</span> Don't eat or drink anything except water</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🍽️</span> Don't smoke during fasting period</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Don't chew gum</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🏃</span> Don't exercise before the test</li>
        </ul>
      </div>
    </div>

    {/* Fasting Notice Banner */}
    <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/50 shadow-sm">
      <h4 className="font-bold font-display text-orange-800 mb-2 flex items-center gap-2">🍽️ Fasting Required</h4>
      <p className="text-sm font-body text-orange-900 leading-relaxed">You must fast for 8 hours before this test. Only water is typically allowed during fasting.</p>
    </div>

    {/* Quick Visual Guide */}
    <div>
      <h4 className="font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Visual Guide</h4>
      <div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">
        
        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl mb-3">🍽️</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Fast if<br/>required</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-3">💧</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Water<br/>is OK</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl mb-3">👕</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Loose<br/>sleeves</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-3">🧘</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Stay<br/>calm</span>
        </div>

      </div>
    </div>
  </div>
);

const CBCPreparations = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
      A comprehensive test that evaluates your overall health and detects various disorders.
    </p>
    <div>
      <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">Preparation Steps</h3>
      <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">📌</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Note</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">No special preparation needed</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Anytime</span>
        </div>

        {/* Step 2 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">💊</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Medications</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Inform your doctor about any medications you're taking</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Before test</span>
        </div>

      </div>
    </div>
  </div>
);

const CBCGuidelines = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* What to Do */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
        <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>What to Do</h4>
        <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Stay hydrated</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">👕</span> Wear comfortable clothing with easy sleeve access</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Bring your medical history</li>
        </ul>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
        <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>What to Avoid</h4>
        <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🏃</span> Don't exercise heavily right before the test</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Don't skip regular medications unless advised</li>
        </ul>
      </div>
    </div>

    {/* Quick Visual Guide */}
    <div>
      <h4 className="font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Visual Guide</h4>
      <div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">
        
        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl mb-3">🍽️</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Fast if<br/>required</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-3">💧</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Water<br/>is OK</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl mb-3">👕</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Loose<br/>sleeves</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-3">🧘</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Stay<br/>calm</span>
        </div>

      </div>
    </div>
  </div>
);

const LipidPreparations = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
      Measures cholesterol and triglycerides to assess cardiovascular disease risk.
    </p>
    <div>
      <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">Preparation Steps</h3>
      <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">🍽️</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Fasting</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Fast for 9-12 hours before the test</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Night before</span>
        </div>

        {/* Step 2 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-sm border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">🍺<span className="absolute text-[10px] -bottom-1 -right-1">❌</span></div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">No Alcohol</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Avoid alcohol for 24 hours before test</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Day before</span>
        </div>

      </div>
    </div>
  </div>
);

const LipidGuidelines = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* What to Do */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
        <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>What to Do</h4>
        <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">⏰</span> Maintain your regular diet for 2 weeks before test</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Stay well hydrated</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Continue regular medications unless told otherwise</li>
        </ul>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
        <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>What to Avoid</h4>
        <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">⏰</span> Don't eat fatty foods the day before</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🍺<span className="text-[12px] -ml-1">❌</span></span> Don't drink alcohol 24 hours before</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🏃</span> Don't exercise vigorously before the test</li>
        </ul>
      </div>
    </div>

    {/* Fasting Notice Banner */}
    <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-200/50 shadow-sm">
      <h4 className="font-bold font-display text-orange-800 mb-2 flex items-center gap-2">🍽️ Fasting Required</h4>
      <p className="text-sm font-body text-orange-900 leading-relaxed">You must fast for 12 hours before this test. Only water is typically allowed during fasting.</p>
    </div>

    {/* Quick Visual Guide */}
    <div>
      <h4 className="font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Visual Guide</h4>
      <div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">
        
        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl mb-3">🍽️</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Fast if<br/>required</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-3">💧</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Water<br/>is OK</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl mb-3">👕</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Loose<br/>sleeves</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-3">🧘</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Stay<br/>calm</span>
        </div>

      </div>
    </div>
  </div>
);

const TFTPreparations = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
      Measures thyroid hormone levels to check how well your thyroid is working.
    </p>
    <div>
      <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">Preparation Steps</h3>
      <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">💊</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Medications</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Inform doctor about thyroid medications</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Before test</span>
        </div>

        {/* Step 2 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">⏰</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Timing</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Take test at same time of day for consistency</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Test day</span>
        </div>

      </div>
    </div>
  </div>
);

const TFTGuidelines = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* What to Do */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
        <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>What to Do</h4>
        <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Continue your thyroid medication unless told otherwise</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📋</span> Inform about biotin supplements (stop 2 days before)</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">⏰</span> Get test done at same time for serial tests</li>
        </ul>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
        <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>What to Avoid</h4>
        <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Don't skip thyroid medication on test day</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">⏰</span> Don't take biotin supplements 2 days before test</li>
        </ul>
      </div>
    </div>

    {/* Quick Visual Guide */}
    <div>
      <h4 className="font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Visual Guide</h4>
      <div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">
        
        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl mb-3">🍽️</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Fast if<br/>required</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl mb-3">💧</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Water<br/>is OK</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl mb-3">👕</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Loose<br/>sleeves</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-3">🧘</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Stay<br/>calm</span>
        </div>

      </div>
    </div>
  </div>
);

const StoolPreparations = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] border-b border-[#e5e9eb] pb-6">
      Analyzes stool sample to detect digestive problems, infections, or bleeding.
    </p>
    <div>
      <h3 className="font-bold font-display text-lg mb-4 text-[var(--color-on-surface)]">Preparation Steps</h3>
      <div className="relative border-l-2 border-[#e5e9eb] ml-4 space-y-8 pb-4">
        
        {/* Step 1 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">💊</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Medications</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Avoid certain medications 3 days before</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">3 days before</span>
        </div>

        {/* Step 2 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">📋</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Bring Documents</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Collect fresh sample in provided container</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">Day of collection</span>
        </div>

        {/* Step 3 */}
        <div className="relative pl-6">
          <div className="absolute -left-[17px] top-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-lg border-[3px] border-white shadow-sm ring-1 ring-[#e5e9eb]">📋</div>
          <h4 className="font-bold text-[var(--color-on-surface)] text-md">Bring Documents</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Avoid contamination with urine or water</p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-md">During collection</span>
        </div>

      </div>
    </div>
  </div>
);

const StoolGuidelines = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* What to Do */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 shadow-sm">
        <h4 className="font-bold font-display text-emerald-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>What to Do</h4>
        <ul className="space-y-3 text-sm font-body text-emerald-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📋</span> Use clean, dry container provided by lab</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">🧪</span> Collect sample from different areas of stool</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Refrigerate if cannot deliver immediately</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Wash hands thoroughly after collection</li>
        </ul>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100/50 shadow-sm">
        <h4 className="font-bold font-display text-red-800 mb-4 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>What to Avoid</h4>
        <ul className="space-y-3 text-sm font-body text-red-900 leading-relaxed">
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">💊</span> Don't take antacids, iron, or bismuth medications 3 days before</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">📌</span> Don't contaminate with toilet water</li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 text-base">⏰</span> Don't delay delivery beyond 24 hours</li>
        </ul>
      </div>
    </div>

    {/* Quick Visual Guide */}
    <div>
      <h4 className="font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Visual Guide</h4>
      <div className="flex overflow-x-auto pb-4 gap-3 snap-x -mx-6 px-6 no-scrollbar">
        
        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl mb-3">🧪</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Use<br/>container</span>
        </div>

        <div className="shrink-0 snap-start bg-white border border-[#e5e9eb] rounded-2xl p-4 w-[110px] flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-2xl mb-3">📋</div>
          <span className="text-xs font-bold font-body text-[var(--color-on-surface)] leading-tight">Label<br/>sample</span>
        </div>

      </div>
    </div>
  </div>
);

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
                {selectedGuide.id === 'p3' ? (
                  activeTab === 'Preparations' ? <UrinalysisPreparations /> : <UrinalysisGuidelines />
                ) : selectedGuide.id === 'p1' ? (
                  activeTab === 'Preparations' ? <FBSPreparations /> : <FBSGuidelines />
                ) : selectedGuide.id === 'p2' ? (
                  activeTab === 'Preparations' ? <LipidPreparations /> : <LipidGuidelines />
                ) : selectedGuide.id === 'p5' ? (
                  activeTab === 'Preparations' ? <StoolPreparations /> : <StoolGuidelines />
                ) : selectedGuide.id === 'p7' ? (
                  activeTab === 'Preparations' ? <TFTPreparations /> : <TFTGuidelines />
                ) : selectedGuide.id === 'p6' ? (
                  activeTab === 'Preparations' ? <CBCPreparations /> : <CBCGuidelines />
                ) : (
                  <p className="text-[15px] font-body leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-wrap animate-in fade-in duration-300">
                    {activeTab === 'Preparations' 
                      ? selectedGuide.instructions 
                      : (selectedGuide.guidelines || "No specific guidelines provided for this procedure yet.")}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
