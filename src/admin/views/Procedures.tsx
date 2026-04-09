import { PlusIcon, ClipboardDocumentListIcon, BeakerIcon } from '@heroicons/react/24/outline';

const procedures = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Blood', reqs: 2, icon: BeakerIcon },
  { id: 2, name: 'Fasting Blood Sugar (FBS)', category: 'Blood', reqs: 3, icon: BeakerIcon },
  { id: 3, name: 'Urinalysis', category: 'Urine', reqs: 1, icon: ClipboardDocumentListIcon },
  { id: 4, name: 'Chest X-Ray', category: 'Imaging', reqs: 4, icon: ClipboardDocumentListIcon },
];

export default function Procedures() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Lab Procedures</h2>
          <p className="text-gray-500 mt-1">Manage test guides, preparation steps, and requirements.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-sm">
          <PlusIcon className="w-5 h-5" />
          <span>New Procedure</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {procedures.map((proc) => {
          const Icon = proc.icon;
          return (
            <div key={proc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb] hover:shadow-md transition-shadow flex items-start space-x-4">
              <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 text-lg">{proc.name}</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
                </div>
                <div className="mt-2 flex items-center space-x-3 text-sm">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">{proc.category}</span>
                  <span className="text-gray-500">{proc.reqs} Preparation Steps</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Standard lab procedure. Patients must follow {proc.reqs} specific guidelines before specimen extraction to ensure accurate results.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
