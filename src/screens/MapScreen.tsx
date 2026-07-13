import { useState } from 'react';
import { MapPin, Bus, AlertCircle, Compass, Users, Clock, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function MapScreen() {
  const [selectedStop, setSelectedStop] = useState<number | null>(1);

  const stops = [
    { id: 0, name: 'Main Depot', type: 'start', status: 'completed', time: '6:50 AM', students: 0, lat: 'y-[80%]', lon: 'x-[15%]' },
    { id: 1, name: 'Oakwood Elementary', type: 'school', status: 'active', time: '7:14 AM', students: 8, lat: 'y-[50%]', lon: 'x-[45%]' },
    { id: 2, name: 'Pine Heights Ave', type: 'pickup', status: 'pending', time: '7:25 AM', students: 6, lat: 'y-[25%]', lon: 'x-[75%]' },
  ];

  return (
    <div className="h-full w-full bg-slate-950 relative flex flex-col select-none overflow-hidden" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {/* Top Map HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-xl flex-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Compass className="animate-spin" style={{ animationDuration: '8s' }} size={18} />
          </div>
          <div>
            <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Heading North</h4>
            <p className="text-sm text-white font-extrabold mt-0.5">Route 42 Active Path</p>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 flex items-center justify-center gap-2 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">AI GPS</span>
        </div>
      </div>

      {/* Simulated High-Fidelity Vector Map Canvas */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Abstract Map Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

        {/* Abstract Topography / Neighborhood Zones */}
        <div className="absolute top-[10%] left-[20%] w-48 h-32 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-64 h-48 bg-emerald-500/5 rounded-full filter blur-3xl"></div>

        {/* Dynamic Route SVG Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Road Track */}
          <path 
            d="M 60 420 Q 180 260 210 240 T 310 140" 
            fill="none" 
            stroke="#1e1b4b" 
            strokeWidth="12" 
            strokeLinecap="round" 
          />
          <path 
            d="M 60 420 Q 180 260 210 240 T 310 140" 
            fill="none" 
            stroke="#4f46e5" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeDasharray="8 6" 
            className="animate-[dash_20s_linear_infinite]"
          />
        </svg>

        {/* Stop Node Markers */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {/* Main Depot Stop */}
          <button 
            onClick={() => setSelectedStop(0)}
            className="absolute left-[15%] bottom-[20%] transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
          >
            <div className={`p-2.5 rounded-full transition-all duration-300 border-2 ${
              selectedStop === 0 
                ? 'bg-slate-900 border-slate-100 scale-125 shadow-lg shadow-slate-950/50 text-slate-100' 
                : 'bg-slate-900 border-indigo-500/40 text-indigo-400'
            }`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="absolute top-9 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm border border-slate-800 text-[10px] text-slate-400 px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-md">
              Depot
            </span>
          </button>

          {/* Active School Stop */}
          <button 
            onClick={() => setSelectedStop(1)}
            className="absolute left-[52%] top-[48%] transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
          >
            <div className="relative">
              {/* Ping Ring */}
              <span className="absolute -inset-2 rounded-full bg-indigo-500/30 animate-ping"></span>
              <div className={`p-3 rounded-full transition-all duration-300 border-2 relative z-10 ${
                selectedStop === 1 
                  ? 'bg-indigo-600 border-white scale-125 shadow-lg shadow-indigo-600/50 text-white' 
                  : 'bg-slate-900 border-indigo-400 text-indigo-300'
              }`}>
                <Bus size={18} />
              </div>
            </div>
            <span className="absolute top-11 left-1/2 transform -translate-x-1/2 bg-indigo-600 border border-indigo-400/30 text-[10px] text-white px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-md">
              Oakwood
            </span>
          </button>

          {/* Pending Stop */}
          <button 
            onClick={() => setSelectedStop(2)}
            className="absolute right-[20%] top-[24%] transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
          >
            <div className={`p-2.5 rounded-full transition-all duration-300 border-2 ${
              selectedStop === 2 
                ? 'bg-slate-900 border-slate-100 scale-125 shadow-lg shadow-slate-950/50 text-slate-100' 
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}>
              <MapPin size={14} />
            </div>
            <span className="absolute top-9 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm border border-slate-800 text-[10px] text-slate-500 px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-md">
              Pine Hts
            </span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Sheet HUD */}
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.3)] p-6 relative z-20">
        <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-5"></div>
        
        {selectedStop !== null ? (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  stops[selectedStop].status === 'completed' ? 'bg-slate-800 text-slate-400' :
                  stops[selectedStop].status === 'active' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {stops[selectedStop].status}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2 tracking-tight">
                  {stops[selectedStop].name}
                </h3>
              </div>
              <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/50 text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled</span>
                <span className="text-sm font-extrabold text-white font-mono">{stops[selectedStop].time}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Users size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Students</span>
                  <span className="text-sm font-extrabold text-white">{stops[selectedStop].students} Boarding</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Safety Check</span>
                  <span className="text-sm font-extrabold text-emerald-400">AI Active</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400">Select any route stop node to view arrival timelines and safety metrics.</p>
          </div>
        )}
      </div>
    </div>
  );
}

