import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  CheckCheck, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Search, 
  Check, 
  X, 
  Clock, 
  Briefcase, 
  Award,
  HelpCircle,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { 
  markAttendance, 
  bulkMarkClass, 
  clearSessionAttendance,
  updateAttendance 
} from '../../features/attendance/attendanceSlice';
import { 
  selectRegisteredClassStudents, 
  selectSessionSummary 
} from '../../features/attendance/attendanceSelectors';
import { selectClassContext } from '../../features/filters/filtersSlice';
import StatusToggleGroup from './StatusToggleGroup';
import { playTactileClick, playSuccessChime, playWarningTone } from '../../utils/audioEffects';
import { triggerConfetti } from '../../utils/confettiEffect';

export default function AttendanceMarkingSheet() {
  const dispatch = useDispatch();
  const classContext = useSelector(selectClassContext);
  const registeredStudents = useSelector(selectRegisteredClassStudents);
  const sessionSummary = useSelector(selectSessionSummary);

  const [searchFilter, setSearchFilter] = useState('');

  const { activeDate, activeSubjectId, department, semester, section } = classContext;

  const visibleStudents = registeredStudents.filter((item) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q) ||
      item.rollNo?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q)
    );
  });

  const handleMark = (studentId, status) => {
    dispatch(markAttendance({
      date: activeDate,
      subjectId: activeSubjectId,
      studentId,
      status,
      isLate: false,
    }));
  };

  const handleToggleLate = (studentId, currentIsLate) => {
    dispatch(updateAttendance({
      date: activeDate,
      subjectId: activeSubjectId,
      studentId,
      isLate: !currentIsLate,
    }));
  };

  const handleMarkAll = (status, e) => {
    const studentIds = registeredStudents.map(s => s.id);
    dispatch(bulkMarkClass({
      date: activeDate,
      subjectId: activeSubjectId,
      studentIds,
      status,
      isLate: false,
    }));
    if (status === 'P') {
      playSuccessChime();
      const rect = e?.currentTarget?.getBoundingClientRect();
      if (rect) {
        triggerConfetti(rect.left / window.innerWidth, rect.top / window.innerHeight);
      } else {
        triggerConfetti(0.5, 0.4);
      }
    } else {
      playWarningTone();
    }
  };

  const handleClearAll = () => {
    playTactileClick(400, 0.08);
    const studentIds = registeredStudents.map(s => s.id);
    dispatch(clearSessionAttendance({
      date: activeDate,
      subjectId: activeSubjectId,
      studentIds,
    }));
  };

  const handleRandomizeSimulation = (e) => {
    playSuccessChime();
    const studentIds = registeredStudents.map(s => s.id);
    const statuses = ['P', 'P', 'P', 'P', 'P', 'A', 'PL', 'E'];
    studentIds.forEach(id => {
      const randStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randLate = randStatus === 'P' && Math.random() < 0.2;
      dispatch(markAttendance({
        date: activeDate,
        subjectId: activeSubjectId,
        studentId: id,
        status: randStatus,
        isLate: randLate,
      }));
    });
    triggerConfetti(0.5, 0.35);
  };

  const getStatusBadge = (status, isLate) => {
    switch (status) {
      case 'P':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Present</span>
            {isLate && <span className="ml-1 px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[10px] font-extrabold shadow-2xs">LATE</span>}
          </span>
        );
      case 'A':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 shadow-xs">
            <X className="w-3.5 h-3.5 text-rose-600" />
            <span>Absent</span>
          </span>
        );
      case 'PL':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300 shadow-xs" title="Internship Placed (100% credited)">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Placement</span>
          </span>
        );
      case 'E':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300 shadow-xs" title="Official Engagement (100% credited)">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>Official Duty</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Unmarked</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Session KPIs Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Roster */}
        <div className="p-4 rounded-3xl white-glass-card flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Roster</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1.5">
            {sessionSummary.total}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {sessionSummary.markedTotal} marked • {sessionSummary.unmarkedCount} pending
          </div>
        </div>

        {/* Present (Emerald) */}
        <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/90 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Present (P)</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-1.5">
            {sessionSummary.presentCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            100% Classroom attended
          </div>
        </div>

        {/* Absent (Crimson) */}
        <div className="p-4 rounded-3xl bg-rose-50/70 border border-rose-200/90 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
            <span>Absent (A)</span>
            <X className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono mt-1.5">
            {sessionSummary.absentCount}
          </div>
          <div className="text-[11px] text-rose-700 mt-1 font-medium">
            0% (Defaulter risk)
          </div>
        </div>

        {/* Internship (Cobalt Blue) */}
        <div className="p-4 rounded-3xl bg-blue-50/70 border border-blue-200/90 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
            <span>Internship (PL)</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 font-mono mt-1.5">
            {sessionSummary.internshipCount}
          </div>
          <div className="text-[11px] text-blue-700 mt-1 font-medium">
            100% Industry credited
          </div>
        </div>

        {/* Official Engagement (Royal Violet) */}
        <div className="p-4 rounded-3xl bg-purple-50/70 border border-purple-200/90 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between text-purple-800 text-xs font-bold">
            <span>Official (E)</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600 font-mono mt-1.5">
            {sessionSummary.engagementCount}
          </div>
          <div className="text-[11px] text-purple-700 mt-1 font-medium">
            100% Duty credited
          </div>
        </div>

        {/* Late Flag (Amber) */}
        <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-sm flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1.5">
            {sessionSummary.lateCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            Present modifier
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="white-glass-card rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        {/* Quick Filter Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter current class roster..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs font-medium"
          />
        </div>

        {/* Bulk Action Buttons with tactile sound & confetti */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={(e) => handleMarkAll('P', e)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm shadow-emerald-500/20 text-xs font-bold spring-btn transition"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={(e) => handleMarkAll('A', e)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-sm shadow-rose-500/20 text-xs font-bold spring-btn transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Mark All Absent</span>
          </button>

          <button
            onClick={handleRandomizeSimulation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white shadow-md shadow-purple-500/20 text-xs font-bold spring-btn transition"
            title="Randomize realistic status for test demo"
          >
            <Sparkles className="w-4 h-4" />
            <span>Demo Auto-Fill</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200 shadow-2xs spring-btn transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Student Attendance Marking Table */}
      <div className="white-glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Composite Key (O(1) Upsert)</th>
                <th className="py-3.5 px-4 text-center">Current Status</th>
                <th className="py-3.5 px-4 text-right">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No students found matching current class context</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Check your Department ({department}), Semester ({semester}), or Section ({section}) filters.
                    </p>
                  </td>
                </tr>
              ) : (
                visibleStudents.map((item, idx) => {
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-indigo-50/30 transition-colors ${
                        item.currentStatus === 'A' ? 'bg-rose-50/20' : item.currentStatus === 'P' ? 'bg-emerald-50/15' : ''
                      }`}
                    >
                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {item.rollNo || String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                              <span>{item.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md font-semibold">
                                {item.id}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Composite Key Display */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 max-w-fit shadow-2xs">
                          <KeyRound className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span>{item.compositeKey}</span>
                        </div>
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(item.currentStatus, item.isLate)}
                      </td>

                      {/* Attendance Action Controls */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <StatusToggleGroup
                            currentStatus={item.currentStatus}
                            isLate={item.isLate}
                            onStatusChange={(status) => handleMark(item.id, status)}
                            onLateToggle={() => handleToggleLate(item.id, item.isLate)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="py-3 px-5 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Showing {visibleStudents.length} of {registeredStudents.length} students</span>
          <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Deterministic Upsert Engine Active</span>
          </span>
        </div>
      </div>
    </div>
  );
}
