import { savePersistedState } from '../../utils/storage';

let timeoutId = null;

export const persistenceMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  // Debounce storage writes by 100ms for high-frequency marking
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    try {
      const state = storeAPI.getState();
      const stateToPersist = {
        students: {
          byId: state.students.byId,
          allIds: state.students.allIds,
        },
        subjects: {
          list: state.subjects.list,
          selectedSubjectId: state.subjects.selectedSubjectId,
        },
        attendance: {
          recordsByKey: state.attendance.recordsByKey,
          lastSyncedAt: state.attendance.lastSyncedAt,
        },
        filters: {
          lowAttendanceThreshold: state.filters.lowAttendanceThreshold,
          department: state.filters.department,
          semester: state.filters.semester,
          section: state.filters.section,
          activeDate: state.filters.activeDate,
          activeSubjectId: state.filters.activeSubjectId,
        }
      };

      savePersistedState(stateToPersist);
    } catch (err) {
      console.warn('[persistenceMiddleware] Failed to persist state:', err);
    }
  }, 100);

  return result;
};
