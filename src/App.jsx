import React, { useState } from 'react';
import TopNavbar from './components/layout/TopNavbar';
import WorkspaceTabs from './components/layout/WorkspaceTabs';
import AsyncStatusBanner from './components/layout/AsyncStatusBanner';
import ClassContextPicker from './components/attendance/ClassContextPicker';
import AttendanceMarkingSheet from './components/attendance/AttendanceMarkingSheet';
import KpiSummaryCards from './components/reports/KpiSummaryCards';
import ReportFilters from './components/reports/ReportFilters';
import DefaultersAlertTable from './components/reports/DefaultersAlertTable';
import AttendanceCharts from './components/reports/AttendanceCharts';
import StudentRosterTable from './components/students/StudentRosterTable';
import AuditLogDrawer from './components/layout/AuditLogDrawer';
import { 
  Terminal, 
  ShieldCheck, 
  Layers, 
  KeyRound, 
  CheckCircle, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { liveAuditLogs } from './app/middleware/auditLoggerMiddleware';

export default function App() {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'reports' | 'roster' | 'audit'
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col font-sans">
      {/* 🌈 Ambient Floating Colorful Aurora Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Violet / Indigo Blob Top Left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-blob"></div>
        {/* Pink / Rose Blob Top Right */}
        <div className="absolute top-10 -right-24 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        {/* Cyan / Sky Blob Center */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-3xl animate-blob-slow"></div>
        {/* Emerald Blob Bottom Right */}
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl animate-blob"></div>
        {/* Amber / Warm Blob Bottom Left */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl animate-blob-slow"></div>
      </div>

      {/* Top Navbar */}
      <TopNavbar 
        onToggleAudit={() => setShowAuditDrawer(!showAuditDrawer)} 
        showAudit={showAuditDrawer} 
      />

      {/* Tab Navigation */}
      <WorkspaceTabs 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
      />

      {/* Async Status Notification Banner */}
      <AsyncStatusBanner />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        {/* Tab 1: Attendance Marking */}
        {activeTab === 'mark' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ClassContextPicker />
            <AttendanceMarkingSheet />
          </div>
        )}

        {/* Tab 2: Reports & Analytics */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <KpiSummaryCards />
            <ReportFilters />
            <DefaultersAlertTable />
            <AttendanceCharts />
          </div>
        )}

        {/* Tab 3: Student Roster Admin */}
        {activeTab === 'roster' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="white-glass-card rounded-3xl p-6 mb-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Institutional Student Roster Administration
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Manage student academic registrations, department allocations, and contact identifiers with normalized RTK slice storage (<code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold">byId / allIds</code>).
                  </p>
                </div>
              </div>
            </div>
            <StudentRosterTable />
          </div>
        )}

        {/* Tab 4: Audit & RTK Telemetry (Full Workspace View) */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="white-glass-card border-purple-200 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center">
                    <Terminal className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      Redux Toolkit Middleware Telemetry & Audit Stream
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </h2>
                    <p className="text-xs text-purple-800/80 font-medium">
                      Intercepted mutations, payload diffs, and sub-millisecond execution duration metrics.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-purple-800 bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-2xs">
                  auditLoggerMiddleware → persistenceMiddleware
                </div>
              </div>
            </div>

            {/* Architecture Principles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl white-glass-card">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase mb-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>Composite Key Upsert</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  <code className="text-emerald-800 font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">${'{date}'}::${'{subjectId}'}::${'{studentId}'}</code> performs $O(1)$ upsert, mathematically guaranteeing duplicate prevention.
                </p>
              </div>

              <div className="p-5 rounded-3xl white-glass-card">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase mb-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Reselect Memoization</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Memoized <code className="text-indigo-800 font-mono font-bold">createSelector</code> pipelines compute percentages, sessions, charts, and defaulters with zero recalculation lag.
                </p>
              </div>

              <div className="p-5 rounded-3xl white-glass-card">
                <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Fault-Tolerant Hydration</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Debounced localStorage sync with automatic recovery and preloaded state hydration on every browser reload.
                </p>
              </div>
            </div>

            {/* Live Audit Stream Log Feed */}
            <div className="white-glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/90">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="text-sm font-extrabold text-slate-900">
                  Live Dispatched Action Stream ({liveAuditLogs.length})
                </div>
                <button
                  onClick={() => {
                    liveAuditLogs.length = 0;
                    setActiveTab('audit');
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                >
                  Clear Event Buffer
                </button>
              </div>

              <div className="space-y-2.5 font-mono text-xs max-h-[500px] overflow-y-auto pr-2">
                {liveAuditLogs.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    No actions recorded yet. Switch to "Mark Attendance" tab and mark a student to inspect execution telemetry.
                  </div>
                ) : (
                  liveAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {log.type}
                          </span>
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            {log.durationMs}
                          </span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        {log.statusChange && (
                          <div className="text-[11px] text-slate-700 font-medium">
                            Student: <strong className="text-slate-900">{log.statusChange.studentId}</strong> → Status: <strong className="text-emerald-700 font-bold">{log.statusChange.status}</strong> (Late: {String(log.statusChange.isLate)})
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 max-w-md overflow-x-auto">
                        <pre>{JSON.stringify(log.payload || {}, null, 1)}</pre>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Side Slide Audit Drawer */}
      <AuditLogDrawer
        isOpen={showAuditDrawer}
        onClose={() => setShowAuditDrawer(false)}
      />

      {/* Institutional ERP Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-5 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-slate-800">SAMS ERP</span>
            <span>•</span>
            <span>White Aurora Edition // Academic ERP Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deterministic Deduplication</span>
            </span>
            <span>•</span>
            <span>Memoized Reselect Selectors</span>
            <span>•</span>
            <span>Web Audio Tactical Haptics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
