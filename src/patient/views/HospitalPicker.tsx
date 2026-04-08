import { useAppContext } from '../context/AppContext';
import { hospitalsCollection } from '../data/Procedures';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function HospitalPicker() {
  const { selectedHospitalId, setSelectedHospitalId } = useAppContext();

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">Select Hospital</h1>
        <p className="text-sm font-body text-[var(--color-on-surface-variant)] mt-2">
          Choose your medical center to see tailored preparation guides.
        </p>
      </header>

      <div className="space-y-4">
        {hospitalsCollection.map((hospital) => {
          const isSelected = selectedHospitalId === hospital.id;
          return (
            <div
              key={hospital.id}
              onClick={() => setSelectedHospitalId(hospital.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 scale-[1.02]'
                  : 'bg-[var(--color-surface-container-lowest)] border-none'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-lg font-bold font-display ${isSelected ? 'text-white' : 'text-[var(--color-on-surface)]'}`}>
                    {hospital.name}
                  </h3>
                  <div className="flex items-center mt-2 opacity-80">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm font-body">{hospital.address}</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  isSelected ? 'border-white bg-white/20' : 'border-[var(--color-surface-container-highest)]'
                }`}>
                  {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
