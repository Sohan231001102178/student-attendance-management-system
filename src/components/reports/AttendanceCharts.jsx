import React from 'react';
import { useSelector } from 'react-redux';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart as PieIcon, 
} from 'lucide-react';
import { 
  selectDailyAttendanceTrend, 
  selectSubjectAttendanceStats, 
  selectStatusDistribution 
} from '../../features/attendance/attendanceSelectors';

// Custom sleek white-theme Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 border border-slate-200 p-3.5 rounded-2xl shadow-xl text-xs backdrop-blur-md">
        <div className="font-extrabold text-slate-800 border-b border-slate-100 pb-1 mb-2 font-mono">
          {label}
        </div>
        <div className="space-y-1.5">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-5">
              <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-extrabold text-slate-900">
                {entry.value} {entry.name.includes('Rate') || entry.name.includes('%') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AttendanceCharts() {
  const dailyTrend = useSelector(selectDailyAttendanceTrend);
  const subjectStats = useSelector(selectSubjectAttendanceStats);
  const statusDist = useSelector(selectStatusDistribution);

  return (
    <div className="space-y-6 mb-8">
      {/* Top Row: Daily Trend & Donut Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Attendance Trend (Area Chart) */}
        <div className="lg:col-span-2 white-glass-card rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Daily Attendance Progression & Volume
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Timeline tracking attended/credited students vs absences
                </p>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCredited" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Area 
                  type="monotone" 
                  dataKey="credited" 
                  name="Attended / Credited" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorCredited)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="absent" 
                  name="Absences" 
                  stroke="#ef4444" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorAbsent)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="white-glass-card rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <PieIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Academic Status Breakdown
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Distribution across official codes
                </p>
              </div>
            </div>

            <div className="h-52 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                  >
                    {statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2.5} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {statusDist.map((item) => (
              <div key={item.code} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-slate-500 font-medium truncate">{item.name}</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Subject-wise Performance Comparison */}
      <div className="white-glass-card rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                Subject-Wise Attendance Comparison Rate (%)
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Benchmark student compliance across academic curriculum courses
              </p>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="code" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="Attendance Rate" radius={[8, 8, 0, 0]}>
                {subjectStats.map((entry, index) => {
                  const color = entry.rate >= 75 ? '#10b981' : entry.rate >= 45 ? '#8b5cf6' : '#ef4444';
                  return <Cell key={`bar-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
