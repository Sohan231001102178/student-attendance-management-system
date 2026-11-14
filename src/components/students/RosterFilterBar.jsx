import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  UserPlus, 
  CloudDownload, 
  Loader2 
} from 'lucide-react';
import { 
  selectFilters, 
  setRosterSearch, 
  setClassContext 
} from '../../features/filters/filtersSlice';
import { 
  fetchStudents 
} from '../../features/students/studentsSlice';
import { 
  selectStudentRosterStatus 
} from '../../features/students/studentsSelectors';
import { playTactileClick, playSuccessChime } from '../../utils/audioEffects';

export default function RosterFilterBar({ onOpenAddModal, totalFiltered }) {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const rosterStatus = useSelector(selectStudentRosterStatus);

  const departments = ['All', 'Computer Science', 'Information Technology', 'Electronics & Comm'];
  const semesters = ['All', 'Sem 3', 'Sem 5', 'Sem 7'];
  const sections = ['All', 'A', 'B'];

  const handleSearchChange = (e) => {
    dispatch(setRosterSearch(e.target.value));
  };

  const handleFetchStudents = () => {
    playTactileClick();
    dispatch(fetchStudents()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        playSuccessChime();
      }
    });
  };

  return (
    <div className="white-glass-card rounded-3xl p-5 shadow-xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, ID (e.g. CS2024-101), email, or roll..."
            value={filters.rosterSearch || ''}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs font-medium"
          />
        </div>

        {/* Filter Dropdowns & Enrollment CTA */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Department */}
          <select
            value={filters.department || 'All'}
            onChange={(e) => {
              playTactileClick();
              dispatch(setClassContext({ department: e.target.value }));
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            {departments.map(d => (
              <option key={d} value={d}>Dept: {d}</option>
            ))}
          </select>

          {/* Semester */}
          <select
            value={filters.semester || 'All'}
            onChange={(e) => {
              playTactileClick();
              dispatch(setClassContext({ semester: e.target.value }));
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            {semesters.map(s => (
              <option key={s} value={s}>Sem: {s}</option>
            ))}
          </select>

          {/* Section */}
          <select
            value={filters.section || 'All'}
            onChange={(e) => {
              playTactileClick();
              dispatch(setClassContext({ section: e.target.value }));
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            {sections.map(sec => (
              <option key={sec} value={sec}>Sec: {sec}</option>
            ))}
          </select>

          {/* Fetch Async API Button */}
          <button
            onClick={handleFetchStudents}
            disabled={rosterStatus.status === 'loading'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs spring-btn transition disabled:opacity-50"
            title="Dispatch fetchStudents async thunk to re-seed from API"
          >
            {rosterStatus.status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            ) : (
              <CloudDownload className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span>API Fetch</span>
          </button>

          {/* Add Student Button */}
          <button
            onClick={() => {
              playTactileClick(680, 0.05);
              onOpenAddModal();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 spring-btn transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="font-medium">
          Active Filter: <strong className="text-slate-800 font-bold">{totalFiltered}</strong> students found
        </div>
        <div className="text-[11px] font-mono text-indigo-700 font-medium">
          Normalized RTK: <code className="text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">state.students.byId & allIds</code>
        </div>
      </div>
    </div>
  );
}
