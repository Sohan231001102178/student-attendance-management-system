import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Building2, 
  Save, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Palette
} from 'lucide-react';
import { 
  saveAttendanceBatch, 
} from '../../features/attendance/attendanceSlice';
import { 
  selectAttendanceSaveStatus, 
  selectAttendanceLastSyncedAt,
  selectRegisteredClassStudents
} from '../../features/attendance/attendanceSelectors';
import { selectClassContext } from '../../features/filters/filtersSlice';
import { playSuccessChime, toggleSoundEffects, isSoundEnabled, playTactileClick } from '../../utils/audioEffects';
import { triggerConfetti } from '../../utils/confettiEffect';

export default function TopNavbar({ onToggleAudit, showAudit }) {
  const dispatch = useDispatch();
  const saveStatus = useSelector(selectAttendanceSaveStatus);
  const lastSynced = useSelector(selectAttendanceLastSyncedAt);
  const classContext = useSelector(selectClassContext);
  const registeredClass = useSelector(selectRegisteredClassStudents);

  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    toggleSoundEffects(next);
    if (next) playSuccessChime();
  };

  const handleSaveBatch = (e) => {
    playTactileClick(750, 0.08);
    const studentIds = registeredClass.map(s => s.id);
    dispatch(saveAttendanceBatch({
      date: classContext.activeDate,
      subjectId: classContext.activeSubjectId,
      studentsCount: studentIds.length,
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        playSuccessChime();
        const rect = e?.currentTarget?.getBoundingClientRect();
        if (rect) {
          triggerConfetti(rect.left / window.innerWidth, rect.top / window.innerHeight);
        } else {
          triggerConfetti(0.5, 0.2);
        }
      }
    });
  };

  const formattedTime = lastSynced 
    ? new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
    : 'Just now';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 lg:px-8 py-3.5 shadow-sm shadow-slate-200/50 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="colorful-gradient-text">SAMS ERP</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs">
                  AURORA 2.0
                </span>
              </h1>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
                Institutional Academic ERP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Multi-Slice Normalized Architecture & Composite-Key Deduplication
            </p>
          </div>
        </div>

        {/* Action Controls & Sync Status */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 shadow-xs">
            {saveStatus === 'pending' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span className="text-indigo-600 font-semibold">Persisting batch...</span>
              </>
            ) : saveStatus === 'fulfilled' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Synced at {formattedTime}</span>
              </>
            ) : saveStatus === 'rejected' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-rose-600">Sync Error</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>LocalStorage Active</span>
              </>
            )}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border text-xs font-medium spring-btn transition ${
              soundOn 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' 
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
            }`}
            title={soundOn ? 'Sound Effects Enabled (click to mute)' : 'Sound Effects Muted (click to enable)'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Save Batch Button with colorful gradient */}
          <button
            onClick={handleSaveBatch}
            disabled={saveStatus === 'pending'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 spring-btn transition disabled:opacity-50"
            title="Dispatch saveAttendanceBatch async thunk"
          >
            {saveStatus === 'pending' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Batch</span>
          </button>

          {/* Telemetry / Live Audit Toggle */}
          <button
            onClick={() => {
              playTactileClick();
              onToggleAudit();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border spring-btn transition ${
              showAudit 
                ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm shadow-purple-500/10' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Audit Stream</span>
          </button>
        </div>
      </div>
    </header>
  );
}
