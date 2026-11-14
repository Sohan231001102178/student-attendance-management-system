import React from 'react';
import { useSelector } from 'react-redux';
import { 
  AlertTriangle, 
  Percent, 
  Award, 
  TrendingUp,
} from 'lucide-react';
import { 
  selectOverallKpiSummary 
} from '../../features/attendance/attendanceSelectors';
import { selectActiveThreshold } from '../../features/filters/filtersSlice';

export default function KpiSummaryCards() {
  const kpi = useSelector(selectOverallKpiSummary);
  const threshold = useSelector(selectActiveThreshold);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Average Attendance Rate */}
      <div className="white-glass-card rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition duration-200">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-400/15 rounded-full blur-2xl group-hover:bg-emerald-400/25 transition"></div>
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Overall Attendance Rate</span>
          <Percent className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-extrabold text-slate-900 font-mono">
            {kpi.averagePercentage}%
          </span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            kpi.averagePercentage >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            Institutional Avg
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between font-medium">
          <span>Classes Held: {kpi.aggregateTotalClasses}</span>
          <span className="text-emerald-700 font-bold">Credited: {kpi.aggregatePresent + kpi.aggregateInternship + kpi.aggregateEngagement}</span>
        </div>
      </div>

      {/* 2. Defaulters Alert Count (< Threshold) */}
      <div className="white-glass-card border-rose-200/90 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition duration-200">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-400/15 rounded-full blur-2xl group-hover:bg-rose-400/25 transition"></div>
        <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
          <span>Defaulters Alert (&lt; {threshold}%)</span>
          <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-extrabold text-rose-600 font-mono">
            {kpi.defaultersCount}
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
            {kpi.totalStudents > 0 ? Math.round((kpi.defaultersCount / kpi.totalStudents) * 100) : 0}% of class
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between font-medium">
          <span>Compliant: {kpi.nonDefaultersCount}</span>
          <span className="text-rose-600 font-bold">Intervention Required</span>
        </div>
      </div>

      {/* 3. Special Academic Credits (PL & E) */}
      <div className="white-glass-card rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition duration-200">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-400/15 rounded-full blur-2xl group-hover:bg-purple-400/25 transition"></div>
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Approved Credits (PL & E)</span>
          <Award className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-extrabold text-indigo-700 font-mono">
            {kpi.aggregateInternship + kpi.aggregateEngagement}
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            100% Credited
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between font-medium">
          <span className="text-blue-700 font-semibold">Internship: {kpi.aggregateInternship}</span>
          <span className="text-purple-700 font-semibold">Duty: {kpi.aggregateEngagement}</span>
        </div>
      </div>

      {/* 4. Total Active Records & Deduplication */}
      <div className="white-glass-card rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition duration-200">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/15 rounded-full blur-2xl group-hover:bg-amber-400/25 transition"></div>
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Attendance Records</span>
          <TrendingUp className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-extrabold text-slate-900 font-mono">
            {kpi.totalRecordsInStore}
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Composite Upsert
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between font-medium">
          <span>Late: {kpi.aggregateLate}</span>
          <span className="text-emerald-700 font-bold">O(1) Deduplicated</span>
        </div>
      </div>
    </div>
  );
}
