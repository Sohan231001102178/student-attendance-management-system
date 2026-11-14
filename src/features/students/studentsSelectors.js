import { createSelector } from '@reduxjs/toolkit';

export const selectStudentsState = (state) => state.students;
export const selectFiltersState = (state) => state.filters;

export const selectAllStudents = createSelector(
  [selectStudentsState],
  (students) => {
    return students.allIds.map((id) => students.byId[id]).filter(Boolean);
  }
);

export const selectStudentById = (state, studentId) => {
  return state.students.byId[studentId] || null;
};

export const selectStudentRosterStatus = createSelector(
  [selectStudentsState],
  (students) => ({
    status: students.status,
    error: students.error,
    totalCount: students.allIds.length,
  })
);

/**
 * Filtered Roster selector:
 * Matches search (Name, Student ID, Email, Roll No)
 * AND filter criteria (department, semester, section)
 */
export const selectFilteredRoster = createSelector(
  [selectAllStudents, selectFiltersState],
  (students, filters) => {
    const { rosterSearch = '', department = '', semester = '', section = '' } = filters;
    const query = rosterSearch.trim().toLowerCase();

    return students.filter((student) => {
      // Search query check
      if (query) {
        const matchesName = student.name?.toLowerCase().includes(query);
        const matchesId = student.id?.toLowerCase().includes(query);
        const matchesEmail = student.email?.toLowerCase().includes(query);
        const matchesRoll = student.rollNo?.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesEmail && !matchesRoll) {
          return false;
        }
      }

      // Department filter
      if (department && department !== 'All' && student.department !== department) {
        return false;
      }

      // Semester filter
      if (semester && semester !== 'All' && student.semester !== semester) {
        return false;
      }

      // Section filter
      if (section && section !== 'All' && student.section !== section) {
        return false;
      }

      return true;
    });
  }
);
