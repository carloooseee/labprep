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

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {procedures.map((proc) => {
            const Icon = proc.icon;
            return (
              <li key={proc.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{proc.name}</h3>
                    <div className="flex items-center space-x-2 self-start md:self-auto">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        {proc.category}
                      </span>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6 mt-1.5">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium text-gray-700 mr-1">{proc.reqs}</span> 
                      Preparation Steps
                    </div>
                    <p className="text-sm text-gray-400 mt-1 sm:mt-0 italic truncate">
                      Guidelines for extraction and patient preparation.
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
