import { Settings, Shield, CircleHelp, LogOut } from 'lucide-react';

export default function ProfileScreen() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
          JD
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
          <p className="text-gray-500">Senior Driver • ID: 8492</p>
        </div>
      </div>

      <div className="space-y-4">
        <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Settings size={20} />
            </div>
            <span className="font-medium text-gray-900">Account Settings</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Shield size={20} />
            </div>
            <span className="font-medium text-gray-900">Safety & Privacy</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <CircleHelp size={20} />
            </div>
            <span className="font-medium text-gray-900">Help & Support</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>
      </div>

      <button className="w-full mt-8 bg-red-50 text-red-600 font-medium p-4 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors">
        <LogOut size={20} className="mr-2" />
        Sign Out
      </button>
    </div>
  );
}
