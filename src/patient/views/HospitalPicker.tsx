
import { hospitalsCollection } from '../data/Procedures';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalCircleIcon, BuildingOfficeIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

export default function HospitalPicker() {


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
        {hospitalsCollection.map((hospital) => (
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
      <h1 className="text-sm font-extrabold font-display mt-4 mb-4 text-[var(--color-on-surface)] tracking-tight">COMING SOON</h1>
    </div>
  );
}
