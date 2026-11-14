import React from 'react';
import { CheckSquare, BarChart3, Users, Terminal } from 'lucide-react';
import { playTactileClick } from '../../utils/audioEffects';

export default function WorkspaceTabs({ activeTab, onSelectTab }) {
  const tabs = [
    {
      id: 'mark',
      label: 'Mark Attendance',
      icon: CheckSquare,
      badge: 'Live Session',
      activeGradient: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25',
      iconColor: 'text-indigo-600',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: '<45% Defaulters',
      activeGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'roster',
      label: 'Student Roster CRUD',
      icon: Users,
      badge: 'Roster Admin',
      activeGradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25',
      iconColor: 'text-purple-600',
    },
    {
      id: 'audit',
      label: 'Audit & Telemetry',
      icon: Terminal,
      badge: 'Middleware',
      activeGradient: 'bg-gradient-to-r from-slate-800 to-indigo-900 text-white shadow-md shadow-slate-800/25',
      iconColor: 'text-slate-700',
    }
  ];

  const handleTabClick = (tabId) => {
    playTactileClick(520, 0.05);
    onSelectTab(tabId);
  };

  return (
    <nav className="border-b border-slate-200/80 px-4 lg:px-8 bg-white/60 backdrop-blur-md overflow-x-auto py-2.5">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm spring-btn transition-all whitespace-nowrap ${
                isActive
                  ? `${tab.activeGradient} border border-transparent`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent hover:border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.iconColor}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
