import { useAppContext } from '../context/AppContext';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { BuildingOfficeIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

export default function HospitalPicker() {
  const { hospitals, loading } = useAppContext();

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
      <div className="bg-gradient-to-r from-[#427cf2] to-[#5340e0] rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><BuildingOfficeIcon className="w-24 h-24" /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold mt-4 leading-tight">Select a Location</h2>
          <div className="flex items-center mt-6 space-x-2">
            <span className="font-body text-sm font-medium">Choose from our available hospitals below to see customized test preparation guides.</span>
          </div>
        </div>
      </div>
      <h1 className="text-sm font-extrabold font-display mb-4 text-[var(--color-on-surface)] tracking-tight">AVAILABLE HOSPITALS</h1>
      <div className="space-y-4">
        {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="p-5 rounded-2xl transition-all duration-300 bg-[var(--color-surface-container-lowest)] border-2 border-transparent hover:border-[#427cf2] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-[var(--color-on-surface)]">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center mt-2 opacity-80 text-[var(--color-on-surface-variant)]">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm font-body">{hospital.address}</span>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>
      <h1 className="text-sm font-extrabold font-display mt-8 mb-4 text-[var(--color-on-surface)] tracking-tight opacity-60">COMING SOON</h1>
      <div className="space-y-4">
        {/* Mock Coming Soon */}
        <div className="p-5 rounded-2xl bg-gray-50 border border-[#e5e9eb] opacity-60 cursor-not-allowed grayscale relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-gray-600">
                Other hospitals
              </h3>
              <div className="flex items-center mt-2 text-gray-400">
                <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-body">Expanding coverage areas</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2.5 py-1 rounded-md mt-1">COMING SOON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
