import { Cog6ToothIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#e5e9eb]">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Platform Settings</h2>
          <p className="text-gray-500 mt-1">Manage global application preferences and security.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e9eb] overflow-hidden">
        
        {/* Settings Block: General */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-400" />
            General Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input type="text" defaultValue="LabPrep Mobile" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input type="email" defaultValue="support@labprep.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Settings Block: Security */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-gray-400" />
            Data & Privacy
          </h3>
          <div className="space-y-4 max-w-3xl">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-900">Enforce 2FA for Hospital Staff</p>
                <p className="text-sm text-gray-500">Require two-factor auth for all clinic administrators.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-900">Data Retention Policy</p>
                <p className="text-sm text-gray-500">Automatically archive patient records after 5 years.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Settings Block: Password */}
        <div className="p-6 bg-gray-50/50">
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white font-medium rounded-xl hover:bg-gray-50 shadow-sm transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
