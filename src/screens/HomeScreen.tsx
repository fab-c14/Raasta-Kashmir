import { useState } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Check, 
  Activity, 
  Info,
  X,
  Gauge,
  Thermometer,
  ShieldCheck,
  Zap,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HomeScreen() {
  const [isInspected, setIsInspected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTrip, setActiveTrip] = useState(false);
  
  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 'brakes', label: 'Brakes & Tires Pressure Check', checked: false },
    { id: 'belts', label: 'Student Seatbelts Functionality', checked: false },
    { id: 'camera', label: 'AI Fatigue Detection & Cabin Cam', checked: false },
    { id: 'firstaid', label: 'Emergency Safety & First Aid Kit', checked: false },
  ]);

  const toggleCheckItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const allChecked = checklist.every(item => item.checked);

  const handleCompleteInspection = () => {
    if (allChecked) {
      setIsInspected(true);
      setShowModal(false);
    }
  };

  const resetInspection = () => {
    setIsInspected(false);
    setChecklist(checklist.map(item => ({ ...item, checked: false })));
  };

  return (
    <div className="p-6 pt-2 select-none">
      {/* Welcome & Status Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good Morning, John</h2>
          <p className="text-slate-500 mt-1 font-semibold text-sm">
            {activeTrip ? 'Route 42 is currently active' : 'You have 1 route scheduled today'}
          </p>
        </div>
        {activeTrip && (
          <span className="flex h-3 w-3 relative mt-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      {/* TRIP ACTIVE DASHBOARD */}
      <AnimatePresence mode="wait">
        {activeTrip ? (
          <motion.div 
            key="active-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Active Ride Info Card */}
            <div className="bg-slate-900 text-white p-6 rounded-[28px] shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider border border-red-500/20 flex items-center gap-1.5 animate-pulse">
                  <Activity size={12} />
                  LIVE BROADCASTING
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">Bus ID: #SB-9021</span>
              </div>

              <h3 className="text-2xl font-extrabold tracking-tight text-white">Morning Pickup</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Route 42 • Next stop: <span className="text-indigo-400 font-bold">Oakwood Elementary</span></p>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>3 / 12 Stops (25%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full w-1/4 transition-all duration-500"></div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-0.5">Estimated Arrival</span>
                  <span className="text-base font-extrabold text-white">7:14 AM</span>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-0.5">Onboard Students</span>
                  <span className="text-base font-extrabold text-indigo-400">8 / 24</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => setActiveTrip(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-red-950/20"
                >
                  End Active Trip
                </button>
                <button 
                  onClick={() => alert('Emergency alert broadcasted to parents & authority')}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-2xl border border-red-500/20 flex items-center justify-center transition-all active:scale-95"
                  title="SOS Alert"
                >
                  <ShieldAlert size={20} />
                </button>
              </div>
            </div>

            {/* AI Realtime Hazard Alerts - Redesigned as Premium Action Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Active Safety Monitors</h3>
              
              {/* Critical Alert Card 1 - Red colored */}
              <div className="bg-rose-50/70 border-2 border-rose-100 rounded-[22px] p-5 shadow-sm shadow-rose-100/30 flex items-start gap-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                  <ShieldAlert size={22} className="animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-100/60 px-2 py-0.5 rounded-md">Critical Alert</span>
                    <span className="text-[11px] text-rose-500 font-bold">1 min ago</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-900 mt-1.5 leading-tight">AI Cabin Cam: Driver Distraction</h4>
                  <p className="text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                    Eye off the road alert triggered twice. Please keep full focus on student transit.
                  </p>
                </div>
              </div>

              {/* Warning Alert Card 2 - Amber colored */}
              <div className="bg-amber-50/70 border-2 border-amber-100 rounded-[22px] p-5 shadow-sm shadow-amber-100/30 flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
                  <Zap size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider bg-amber-100/60 px-2 py-0.5 rounded-md">Safety Warning</span>
                    <span className="text-[11px] text-amber-600 font-bold">Realtime</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-900 mt-1.5 leading-tight">AI Speed Limit Advisory</h4>
                  <p className="text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                    Upcoming school zone hazard. Max speed reduced to <span className="font-bold text-amber-800">20 km/h</span>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="standard-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Safety & Compliance Pre-trip Inspection Banner */}
            <AnimatePresence>
              {!isInspected ? (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Premium CRITICAL Alert Action Card in Rose Theme */}
                  <div className="bg-rose-50/70 border-2 border-rose-100 rounded-[24px] p-5 shadow-md shadow-rose-200/20 mb-2 relative overflow-hidden">
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="p-3.5 bg-rose-100 text-rose-600 rounded-[18px] shrink-0 shadow-sm shadow-rose-200">
                        <ShieldAlert size={24} className="animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Safety Check Required
                          </span>
                          <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1">
                            Pending Check
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-2 tracking-tight">Pre-Trip Safety Certification</h4>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                          School transport regulations require completing your 4-point digital safety inspection before starting any active student transit.
                        </p>
                        <button 
                          onClick={() => setShowModal(true)}
                          className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95 flex items-center gap-1.5"
                        >
                          Perform Digital Inspection
                          <ChevronRight size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/70 border-2 border-emerald-100 rounded-[24px] p-5 shadow-md shadow-emerald-200/20 mb-2 flex items-center gap-4"
                >
                  <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-[18px] shrink-0">
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Inspection Verified
                      </span>
                      <button 
                        onClick={resetInspection}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                      >
                        Reset Check
                      </button>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1.5 tracking-tight">Vehicle Certified Safe</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold">Ready for departure • Digital stamp active</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Route Card */}
            <div className={`p-6 rounded-[28px] shadow-xl relative overflow-hidden transition-all duration-300 ${
              isInspected 
                ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-white shadow-blue-900/20' 
                : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
            }`}>
              {/* Decorative elements */}
              {isInspected && (
                <>
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                </>
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[11px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                    isInspected 
                      ? 'bg-white/20 backdrop-blur-md text-white border border-white/10' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isInspected ? (
                      <>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                        Ready to Start
                      </>
                    ) : (
                      'Locked'
                    )}
                  </div>
                  <div className={`p-2.5 rounded-full backdrop-blur-md ${
                    isInspected ? 'bg-white/10 border border-white/10 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Bus size={20} />
                  </div>
                </div>

                <h3 className={`text-[22px] font-extrabold mb-1 tracking-tight ${isInspected ? 'text-white' : 'text-slate-800'}`}>Morning Pickup</h3>
                <p className={`text-sm font-medium mb-6 ${isInspected ? 'text-blue-100' : 'text-slate-500'}`}>Route 42 • Northside Area</p>

                <div className="flex items-center gap-5 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl backdrop-blur-sm border ${
                      isInspected ? 'bg-blue-500/40 border-blue-400/20 text-blue-50' : 'bg-slate-200 border-slate-300/40 text-slate-500'
                    }`}>
                      <Clock size={16} />
                    </div>
                    <span className="text-sm font-semibold tracking-wide">7:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl backdrop-blur-sm border ${
                      isInspected ? 'bg-blue-500/40 border-blue-400/20 text-blue-50' : 'bg-slate-200 border-slate-300/40 text-slate-500'
                    }`}>
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-semibold tracking-wide">12 Stops</span>
                  </div>
                </div>

                {isInspected ? (
                  <button 
                    onClick={() => setActiveTrip(true)}
                    className="w-full bg-white hover:bg-slate-50 text-indigo-700 font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                  >
                    Start Trip
                    <ChevronRight size={18} strokeWidth={3} className="text-indigo-500" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full bg-slate-200/80 text-slate-500 font-bold py-3.5 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Complete Pre-Trip Check
                  </button>
                )}
              </div>
            </div>

            {/* AI Warning Alerts (Advisory) - Orange themed Action Card */}
            <div className="bg-amber-50/70 border-2 border-amber-100 rounded-[24px] p-5 shadow-md shadow-amber-200/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-[18px] shrink-0">
                  <Info size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      AI Route Advisory
                    </span>
                    <span className="text-xs font-bold text-amber-600">Today</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mt-2 tracking-tight">Heavy Rain Caution</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                    AI Weather monitor predicts heavy precipitation near Oakwood Valley between 7:30 - 8:00 AM. Wet surface alert is enabled.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center hover:border-slate-200 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mr-4 shrink-0 border border-emerald-100/50">
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-900">Yesterday's Route</h4>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">All students dropped off safely</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIGITAL PRE-TRIP INSPECTION SHEET/MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-950 z-40"
            ></motion.div>

            {/* Bottom Sheet Modal */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-[400px] mx-auto bg-white rounded-t-[32px] shadow-2xl z-50 p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Digital Safety Certification</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-semibold">Complete 4 checklist items to proceed</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Checklist Items */}
              <div className="space-y-4 mb-8">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                      item.checked 
                        ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' 
                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                        item.checked 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {item.checked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                disabled={!allChecked}
                onClick={handleCompleteInspection}
                className={`w-full py-4 rounded-2xl font-bold tracking-tight transition-all text-center flex items-center justify-center gap-2 shadow-lg ${
                  allChecked 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 active:scale-98' 
                    : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                }`}
              >
                <ShieldCheck size={20} />
                Certify Vehicle Safety
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

