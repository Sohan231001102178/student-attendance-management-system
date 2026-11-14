import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_SUBJECTS } from '../../utils/storage';

const initialState = {
  list: INITIAL_SUBJECTS,
  selectedSubjectId: 'CS301',
};

export const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    addSubject: (state, action) => {
      const subject = action.payload;
      if (!subject || !subject.id) return;
      const exists = state.list.some(s => s.id === subject.id);
      if (!exists) {
        state.list.push(subject);
      }
    },
    updateSubject: (state, action) => {
      const updated = action.payload;
      const index = state.list.findIndex(s => s.id === updated.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updated };
      }
    },
    deleteSubject: (state, action) => {
      const subjectId = action.payload;
      state.list = state.list.filter(s => s.id !== subjectId);
      if (state.selectedSubjectId === subjectId && state.list.length > 0) {
        state.selectedSubjectId = state.list[0].id;
      }
    },
    setSelectedSubject: (state, action) => {
      state.selectedSubjectId = action.payload;
    },
    setSubjectsBulk: (state, action) => {
      state.list = action.payload;
      if (!state.list.some(s => s.id === state.selectedSubjectId) && state.list.length > 0) {
        state.selectedSubjectId = state.list[0].id;
      }
    }
  }
});

export const { addSubject, updateSubject, deleteSubject, setSelectedSubject, setSubjectsBulk } = subjectsSlice.actions;

export const selectSubjectsList = (state) => state.subjects.list;
export const selectSelectedSubjectId = (state) => state.subjects.selectedSubjectId;
export const selectSelectedSubject = (state) => {
  const list = state.subjects.list;
  const id = state.subjects.selectedSubjectId;
  return list.find(s => s.id === id) || list[0] || null;
};

export default subjectsSlice.reducer;
