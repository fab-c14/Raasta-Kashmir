/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home, Map as MapIcon, User } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex justify-center bg-slate-900 min-h-screen">
      {/* Mobile App Container - Max width 400px to simulate phone on desktop */}
      <div className="w-full max-w-[400px] bg-slate-50 min-h-screen flex flex-col relative shadow-2xl overflow-hidden font-sans">
        
        {/* Header / Top App Bar */}
        <div className="bg-slate-50 px-6 pt-10 pb-2 flex justify-between items-center z-10 sticky top-0">
          <div>
            <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">SmartBus AI</h1>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-widest">
              Driver Portal
            </span>
          </div>
          <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold shadow-sm border border-slate-200 shadow-indigo-100/50 transition-transform active:scale-95">
            JD
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'map' && <MapScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-[80px] pb-safe z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1.5 px-5 rounded-full transition-all duration-300 ${activeTab === 'home' ? 'bg-indigo-50 scale-110' : 'scale-100'}`}>
              <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-1.5 ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('map')} 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'map' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1.5 px-5 rounded-full transition-all duration-300 ${activeTab === 'map' ? 'bg-indigo-50 scale-110' : 'scale-100'}`}>
              <MapIcon size={22} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-1.5 ${activeTab === 'map' ? 'font-bold' : 'font-medium'}`}>Map</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1.5 px-5 rounded-full transition-all duration-300 ${activeTab === 'profile' ? 'bg-indigo-50 scale-110' : 'scale-100'}`}>
              <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-1.5 ${activeTab === 'profile' ? 'font-bold' : 'font-medium'}`}>Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}
