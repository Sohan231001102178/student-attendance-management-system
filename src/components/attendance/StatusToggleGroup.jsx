import React from 'react';
import { Clock, Check, X, Briefcase, Award } from 'lucide-react';
import { playTactileClick } from '../../utils/audioEffects';

export default function StatusToggleGroup({
  currentStatus,
  isLate,
  onStatusChange,
  onLateToggle,
}) {
  const statuses = [
    {
      code: 'P',
      label: 'Present',
      shortLabel: 'P',
      activeBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30',
      icon: Check,
      tooltip: '100% Attended (+1 Num / +1 Denom)',
      freq: 640
    },
    {
      code: 'A',
      label: 'Absent',
      shortLabel: 'A',
      activeBg: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/30',
      icon: X,
      tooltip: '0% Attended (Lowers % & triggers alert)',
      freq: 380
    },
    {
      code: 'PL',
      label: 'Internship',
      shortLabel: 'PL',
      activeBg: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30',
      icon: Briefcase,
      tooltip: '100% Credited (Industry Internship placement)',
      freq: 580
    },
    {
      code: 'E',
      label: 'Official',
      shortLabel: 'E',
      activeBg: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/30',
      icon: Award,
      tooltip: '100% Credited (Symposium/Sports/Hackathon)',
      freq: 540
    },
  ];

  const handleStatus = (code, freq) => {
    playTactileClick(freq, 0.05);
    onStatusChange(code);
  };

  const handleLate = () => {
    playTactileClick(700, 0.04);
    onLateToggle();
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* 4 Status Buttons */}
      <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/90 gap-1 shadow-2xs">
        {statuses.map((item) => {
          const isActive = currentStatus === item.code;
          const Icon = item.icon;

          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleStatus(item.code, item.freq)}
              title={`${item.label} (${item.code}): ${item.tooltip}`}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold spring-btn transition-all duration-150 border ${
                isActive
                  ? item.activeBg
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-white hover:shadow-2xs'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Late Arrival Flag Toggle (Amber) */}
      <button
        type="button"
        onClick={handleLate}
        title="Late Flag (isLate): Tracks late arrival metadata on present records"
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border spring-btn transition-all duration-150 ${
          isLate
            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold border-amber-500 shadow-md shadow-amber-500/30'
            : currentStatus === 'P'
            ? 'bg-white text-slate-600 hover:text-amber-600 border-slate-200 hover:border-amber-300 shadow-2xs'
            : 'bg-slate-100 text-slate-300 border-slate-200/60 cursor-not-allowed opacity-50'
        }`}
        disabled={currentStatus !== 'P'}
      >
        <Clock className="w-3 h-3" />
        <span className="hidden sm:inline">Late</span>
      </button>
    </div>
  );
}
