import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  BookOpen, 
  Layers, 
  Hash, 
  Clock, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { 
  selectFilters, 
  setClassContext 
} from '../../features/filters/filtersSlice';
import { 
  selectSubjectsList, 
  setSelectedSubject 
} from '../../features/subjects/subjectsSlice';
import { 
  selectSessionSummary 
} from '../../features/attendance/attendanceSelectors';
import { playTactileClick } from '../../utils/audioEffects';

export default function ClassContextPicker() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const subjects = useSelector(selectSubjectsList);
  const sessionSummary = useSelector(selectSessionSummary);

  const departments = ['Computer Science', 'Information Technology', 'Electronics & Comm'];
  const semesters = ['Sem 3', 'Sem 5', 'Sem 7'];
  const sections = ['A', 'B'];

  const availableSubjects = subjects.filter(
    s => s.department === filters.department && s.semester === filters.semester
  );

  const handleDepartmentChange = (e) => {
    playTactileClick();
    const dept = e.target.value;
    const matchingSubjects = subjects.filter(s => s.department === dept && s.semester === filters.semester);
    const newSubjectId = matchingSubjects.length > 0 ? matchingSubjects[0].id : filters.activeSubjectId;
    dispatch(setClassContext({ department: dept, activeSubjectId: newSubjectId }));
    if (newSubjectId) dispatch(setSelectedSubject(newSubjectId));
  };

  const handleSemesterChange = (e) => {
    playTactileClick();
    const sem = e.target.value;
    const matchingSubjects = subjects.filter(s => s.department === filters.department && s.semester === sem);
    const newSubjectId = matchingSubjects.length > 0 ? matchingSubjects[0].id : filters.activeSubjectId;
    dispatch(setClassContext({ semester: sem, activeSubjectId: newSubjectId }));
    if (newSubjectId) dispatch(setSelectedSubject(newSubjectId));
  };

  const handleSubjectChange = (e) => {
    playTactileClick();
    const subjId = e.target.value;
    dispatch(setClassContext({ activeSubjectId: subjId }));
    dispatch(setSelectedSubject(subjId));
  };

  const handleDateChange = (e) => {
    playTactileClick();
    dispatch(setClassContext({ activeDate: e.target.value }));
  };

  const handleSectionChange = (e) => {
    playTactileClick();
    dispatch(setClassContext({ section: e.target.value }));
  };

  const currentSubjectObj = subjects.find(s => s.id === filters.activeSubjectId) || availableSubjects[0] || null;

  return (
    <div className="white-glass-card rounded-3xl p-5 sm:p-6 shadow-xl mb-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            <h2 className="text-xs font-extrabold uppercase tracking-widest colorful-gradient-text">
              Class Context Parameter Bar
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Active class session parameters. Composite key: <code className="text-indigo-600 font-mono text-[11px] bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-lg">{filters.activeDate}::{filters.activeSubjectId}::[StudentID]</code>
          </p>
        </div>

        {/* Live Session Rate Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 px-4 py-2.5 rounded-2xl shadow-xs self-start lg:self-auto">
          <div className="text-right">
            <div className="text-[11px] text-emerald-800 font-semibold">Session Attendance Rate</div>
            <div className="text-lg font-extrabold emerald-gradient-text font-mono">
              {sessionSummary.sessionRate}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-4">
        {/* Date */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Attendance Date</span>
          </label>
          <input
            type="date"
            value={filters.activeDate}
            onChange={handleDateChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
          />
        </div>

        {/* Department */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Department</span>
          </label>
          <select
            value={filters.department}
            onChange={handleDepartmentChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Semester</span>
          </label>
          <select
            value={filters.semester}
            onChange={handleSemesterChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <Hash className="w-3.5 h-3.5 text-indigo-500" />
            <span>Section</span>
          </label>
          <select
            value={filters.section}
            onChange={handleSectionChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
          >
            {sections.map(sec => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Active Subject</span>
          </label>
          <select
            value={filters.activeSubjectId}
            onChange={handleSubjectChange}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.code}: {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Details Bar */}
      {currentSubjectObj && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">
              {currentSubjectObj.code} - {currentSubjectObj.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
              {currentSubjectObj.credits} Credits
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-600">
              Instructor: <strong className="text-slate-800">{currentSubjectObj.faculty}</strong>
            </span>
          </div>
          <div className="text-[11px] text-indigo-600 font-mono font-medium">
            {filters.department} / {filters.semester} / Section {filters.section}
          </div>
        </div>
      )}
    </div>
  );
}
