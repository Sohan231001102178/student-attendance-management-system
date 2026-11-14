import React, { useEffect, useState } from 'react';
import { 
  Terminal, 
  X, 
  RotateCcw, 
  Activity, 
  KeyRound, 
  Zap, 
  ShieldCheck,
} from 'lucide-react';
import { 
  liveAuditLogs, 
  subscribeToAuditLogs 
} from '../../app/middleware/auditLoggerMiddleware';
import { playTactileClick } from '../../utils/audioEffects';

export default function AuditLogDrawer({ isOpen, onClose }) {
  const [logs, setLogs] = useState([...liveAuditLogs]);

  useEffect(() => {
    const unsubscribe = subscribeToAuditLogs((updatedLogs) => {
      setLogs([...updatedLogs]);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              RTK Audit & Telemetry
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Custom Middleware Action Stream & Execution Profiler
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTactileClick();
              liveAuditLogs.length = 0;
              setLogs([]);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 text-xs flex items-center gap-1 transition"
            title="Clear Stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="p-3 bg-purple-50/80 border-b border-purple-100 text-xs text-purple-900 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Intercepted Actions: <strong>{logs.length}</strong></span>
        </span>
        <span className="text-[10px] text-purple-700 font-mono font-semibold">
          auditLoggerMiddleware.js
        </span>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="py-24 text-center text-slate-400">
            <Activity className="w-9 h-9 mx-auto text-slate-300 mb-2 animate-pulse" />
            <p className="font-bold text-slate-700">Listening for Redux Actions...</p>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Toggle any attendance button or filter to inspect real-time action telemetry.
            </p>
          </div>
        ) : (
          logs.map((entry) => {
            const isAttendance = entry.category === 'ATTENDANCE';
            const isStudent = entry.category === 'STUDENTS';

            return (
              <div
                key={entry.id}
                className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isAttendance
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isStudent
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {entry.type}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span className="text-amber-600 font-bold">{entry.durationMs}</span>
                    <span>•</span>
                    <span>{entry.timestamp}</span>
                  </div>
                </div>

                {/* Status change highlight */}
                {entry.statusChange && (
                  <div className="mt-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Student: <strong>{entry.statusChange.studentId}</strong></span>
                      <span className="font-bold text-emerald-700">Status: {entry.statusChange.status}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-mono mt-1 truncate">
                      <KeyRound className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{entry.statusChange.compositeKey}</span>
                    </div>
                  </div>
                )}

                {/* Raw Payload preview if not status change */}
                {!entry.statusChange && entry.payload !== undefined && (
                  <div className="mt-1.5 text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60 overflow-x-auto max-h-24">
                    <pre>{JSON.stringify(entry.payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50/90 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="font-medium">Deterministic Deduplication</span>
        <span className="text-emerald-700 flex items-center gap-1 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>O(1) Upsert Guaranteed</span>
        </span>
      </div>
    </div>
  );
}
