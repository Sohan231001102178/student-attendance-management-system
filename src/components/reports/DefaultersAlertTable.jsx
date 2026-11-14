import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  CheckCircle2, 
  Mail, 
  ShieldAlert, 
} from 'lucide-react';
import { 
  selectDefaultersList 
} from '../../features/attendance/attendanceSelectors';
import { selectActiveThreshold } from '../../features/filters/filtersSlice';
import { playSuccessChime, playTactileClick } from '../../utils/audioEffects';

export default function DefaultersAlertTable() {
  const defaulters = useSelector(selectDefaultersList);
  const threshold = useSelector(selectActiveThreshold);

  const [notifiedStudents, setNotifiedStudents] = useState({});

  const handleNotify = (studentId) => {
    playSuccessChime();
    setNotifiedStudents(prev => ({
      ...prev,
      [studentId]: true
    }));
  };

  return (
    <div className="white-glass-card border-rose-200/90 rounded-3xl overflow-hidden shadow-xl mb-8">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-rose-50/90 via-pink-50/50 to-white border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              Automated Defaulters Detection Roster
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                &lt; {threshold}% Cutoff
              </span>
            </h3>
            <p className="text-xs text-rose-700/80 mt-0.5 font-medium">
              Academic Compliance: Students failing minimum attendance criteria.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-rose-700 bg-rose-100/80 border border-rose-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
            {defaulters.length} Defaulters Detected
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Dept / Sem</th>
              <th className="py-3.5 px-4 text-center">Classes Held</th>
              <th className="py-3.5 px-4 text-center">Credited (P+PL+E)</th>
              <th className="py-3.5 px-4 text-center">Absences (A)</th>
              <th className="py-3.5 px-4 text-center">Attendance %</th>
              <th className="py-3.5 px-4 text-center">Classes Deficit</th>
              <th className="py-3.5 px-4 text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {defaulters.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-9 h-9 mx-auto text-emerald-500 mb-2" />
                  <p className="font-bold text-slate-800 text-sm">Zero Attendance Defaulters</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    All students are currently maintaining attendance at or above the {threshold}% institutional cutoff!
                  </p>
                </td>
              </tr>
            ) : (
              defaulters.map((student) => {
                const isNotified = notifiedStudents[student.id];

                const numNeeded = Math.max(
                  1,
                  Math.ceil((threshold * student.totalClasses - 100 * student.totalCredited) / (100 - threshold))
                );

                return (
                  <tr key={student.id} className="hover:bg-rose-50/30 transition-colors">
                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-extrabold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {student.id} • Roll {student.rollNo}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dept / Sem */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-semibold">{student.department}</div>
                      <div className="text-[10px] text-slate-500">{student.semester} - Sec {student.section}</div>
                    </td>

                    {/* Classes Held */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      {student.totalClasses}
                    </td>

                    {/* Credited */}
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-700 font-extrabold">
                      {student.totalCredited}
                    </td>

                    {/* Absences */}
                    <td className="py-3.5 px-4 text-center font-mono text-rose-600 font-extrabold">
                      {student.absentCount}
                    </td>

                    {/* Percentage */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200 font-mono shadow-2xs">
                        {student.percentage}%
                      </span>
                    </td>

                    {/* Classes Deficit */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg shadow-2xs">
                        +{numNeeded} consecutive
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {isNotified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Alert Dispatched</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleNotify(student.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold spring-btn shadow-xs transition"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Send Notice</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
