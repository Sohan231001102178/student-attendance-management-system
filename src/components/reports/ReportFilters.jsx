import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Sliders, 
  Calendar, 
  RotateCcw, 
  FileSpreadsheet, 
} from 'lucide-react';
import { 
  selectFilters, 
  setThreshold, 
  setReportDateRange, 
  resetFilters 
} from '../../features/filters/filtersSlice';
import { 
  selectStudentAttendanceStats, 
} from '../../features/attendance/attendanceSelectors';
import { exportAttendanceToCsv } from '../../utils/csvExporter';
import { playTactileClick, playSuccessChime } from '../../utils/audioEffects';
import { triggerConfetti } from '../../utils/confettiEffect';

export default function ReportFilters() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const studentStats = useSelector(selectStudentAttendanceStats);

  const handleThresholdChange = (e) => {
    playTactileClick(600, 0.03);
    dispatch(setThreshold(e.target.value));
  };

  const handleStartDateChange = (e) => {
    playTactileClick();
    dispatch(setReportDateRange({ start: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    playTactileClick();
    dispatch(setReportDateRange({ end: e.target.value }));
  };

  const handleExportCsv = (e) => {
    playSuccessChime();
    const filename = `SAMS_Attendance_Report_${filters.activeDate || 'Export'}.csv`;
    exportAttendanceToCsv(studentStats, filename, filters.activeSubjectId);
    const rect = e?.currentTarget?.getBoundingClientRect();
    if (rect) {
      triggerConfetti(rect.left / window.innerWidth, rect.top / window.innerHeight);
    } else {
      triggerConfetti(0.5, 0.5);
    }
  };

  return (
    <div className="white-glass-card rounded-3xl p-5 sm:p-6 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Threshold Configuration (default 45%) */}
        <div className="flex-1 max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Sliders className="w-4 h-4 text-rose-500" />
              <span>Low-Attendance Defaulter Cutoff</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Cutoff:</span>
              <span className="font-mono font-extrabold text-sm text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-xl shadow-2xs">
                {filters.lowAttendanceThreshold}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="20"
              max="85"
              step="5"
              value={filters.lowAttendanceThreshold}
              onChange={handleThresholdChange}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600 shadow-inner"
            />
            <span className="text-xs font-mono font-bold text-slate-600 min-w-8">
              {filters.lowAttendanceThreshold}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            Institutional cutoff default is <strong className="text-slate-800">45%</strong>. Adjust to dynamically recalibrate the defaulters roster.
          </p>
        </div>

        {/* Date Range & Export Actions */}
        <div className="flex flex-wrap items-end gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.reportDateRange?.start || ''}
              onChange={handleStartDateChange}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.reportDateRange?.end || ''}
              onChange={handleEndDateChange}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 spring-btn transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export RFC-4180 CSV</span>
          </button>

          {/* Reset Filters */}
          <button
            onClick={() => {
              playTactileClick();
              dispatch(resetFilters());
            }}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-2xs spring-btn transition"
            title="Reset Filters to Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
