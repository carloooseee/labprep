import { useAppContext } from '../context/AppContext';
import { proceduresCollection } from '../data/Procedures';
import { BeakerIcon } from '@heroicons/react/24/outline';

export default function TestGuides() {
  const { selectedHospitalId } = useAppContext();

  if (!selectedHospitalId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[70vh] text-center">
        <div className="w-16 h-16 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mb-4">
          <BeakerIcon className="w-8 h-8 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-2xl font-bold font-display text-[var(--color-on-surface)]">No Hospital Selected</h2>
        <p className="mt-2 text-sm font-body text-[var(--color-on-surface-variant)]">
          Please select a hospital from the Hospitals tab to view the available test preparation guides.
        </p>
      </div>
    );
  }

  const filteredGuides = proceduresCollection.filter(
    (proc) => proc.hospitalId === selectedHospitalId
  );

  return (
    <div className="p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold font-display text-[var(--color-on-surface)] tracking-tight">Test Guides</h1>
      </header>

      {filteredGuides.length === 0 ? (
        <p className="text-sm font-body text-[var(--color-on-surface-variant)]">No guides available for this hospital.</p>
      ) : (
        <div className="space-y-6">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)]">{guide.name}</h3>
                <span className="bg-[var(--color-secondary-container)] text-[var(--color-secondary)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {guide.category}
                </span>
              </div>
              <ul className="space-y-3">
                {guide.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 mt-1.5 mr-3 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span className="text-sm font-body leading-relaxed text-[var(--color-on-surface-variant)]">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
