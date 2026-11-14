import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from '../features/students/studentsSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import filtersReducer from '../features/filters/filtersSlice';
import { auditLoggerMiddleware } from './middleware/auditLoggerMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';
import { loadPersistedState } from '../utils/storage';

const getInitialPreloadedState = () => {
  const persisted = loadPersistedState();
  if (!persisted) return undefined;

  const preloaded = {};
  if (persisted.students?.byId && persisted.students?.allIds) {
    preloaded.students = {
      byId: persisted.students.byId,
      allIds: persisted.students.allIds,
      status: 'succeeded',
      error: null,
    };
  }
  if (persisted.subjects?.list) {
    preloaded.subjects = {
      list: persisted.subjects.list,
      selectedSubjectId: persisted.subjects.selectedSubjectId || 'CS301',
    };
  }
  if (persisted.attendance?.recordsByKey) {
    preloaded.attendance = {
      recordsByKey: persisted.attendance.recordsByKey,
      saveStatus: 'idle',
      lastSyncedAt: persisted.attendance.lastSyncedAt || new Date().toISOString(),
      error: null,
    };
  }
  if (persisted.filters) {
    preloaded.filters = {
      rosterSearch: '',
      department: persisted.filters.department || 'Computer Science',
      semester: persisted.filters.semester || 'Sem 5',
      section: persisted.filters.section || 'A',
      activeDate: persisted.filters.activeDate || '2026-11-14',
      activeSubjectId: persisted.filters.activeSubjectId || 'CS301',
      reportDateRange: {
        start: '2026-11-01',
        end: '2026-11-14',
      },
      lowAttendanceThreshold: typeof persisted.filters.lowAttendanceThreshold === 'number'
        ? persisted.filters.lowAttendanceThreshold
        : 45,
    };
  }
  return Object.keys(preloaded).length > 0 ? preloaded : undefined;
};

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    subjects: subjectsReducer,
    attendance: attendanceReducer,
    filters: filtersReducer,
  },
  preloadedState: getInitialPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings/timestamps in actions if needed
        warnAfter: 64,
      },
    }).concat(auditLoggerMiddleware, persistenceMiddleware),
});

export default store;
