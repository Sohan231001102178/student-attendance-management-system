import { createSlice } from '@reduxjs/toolkit';

const getInitialDate = () => {
  const d = new Date();
  // Ensure YYYY-MM-DD
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialState = {
  rosterSearch: '',
  department: 'Computer Science',
  semester: 'Sem 5',
  section: 'A',
  activeDate: '2026-11-14',
  activeSubjectId: 'CS301',
  reportDateRange: {
    start: '2026-11-01',
    end: '2026-11-14',
  },
  lowAttendanceThreshold: 45,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setRosterSearch: (state, action) => {
      state.rosterSearch = action.payload;
    },
    setClassContext: (state, action) => {
      // payload can include partial or complete context:
      // { department, semester, section, activeDate, activeSubjectId }
      Object.assign(state, action.payload);
    },
    setReportDateRange: (state, action) => {
      state.reportDateRange = {
        ...state.reportDateRange,
        ...action.payload,
      };
    },
    setThreshold: (state, action) => {
      const val = Number(action.payload);
      if (!isNaN(val) && val >= 0 && val <= 100) {
        state.lowAttendanceThreshold = val;
      }
    },
    resetFilters: (state) => {
      state.rosterSearch = '';
      state.department = 'Computer Science';
      state.semester = 'Sem 5';
      state.section = 'A';
      state.activeDate = '2026-11-14';
      state.activeSubjectId = 'CS301';
      state.reportDateRange = {
        start: '2026-11-01',
        end: '2026-11-14',
      };
      state.lowAttendanceThreshold = 45;
    },
  },
});

export const {
  setRosterSearch,
  setClassContext,
  setReportDateRange,
  setThreshold,
  resetFilters,
} = filtersSlice.actions;

export const selectFilters = (state) => state.filters;
export const selectActiveThreshold = (state) => state.filters.lowAttendanceThreshold;
export const selectActiveDate = (state) => state.filters.activeDate;
export const selectActiveSubjectId = (state) => state.filters.activeSubjectId;
export const selectClassContext = (state) => ({
  department: state.filters.department,
  semester: state.filters.semester,
  section: state.filters.section,
  activeDate: state.filters.activeDate,
  activeSubjectId: state.filters.activeSubjectId,
});

export default filtersSlice.reducer;
