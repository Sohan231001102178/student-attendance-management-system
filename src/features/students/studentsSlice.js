import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_STUDENTS } from '../../utils/storage';

// Simulated async thunk to fetch students from institutional REST endpoint
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate realistic API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return INITIAL_STUDENTS;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch student roster');
    }
  }
);

// Helper to normalize an array of students
export const normalizeStudents = (studentsList) => {
  const byId = {};
  const allIds = [];
  studentsList.forEach(student => {
    if (student && student.id) {
      byId[student.id] = student;
      if (!allIds.includes(student.id)) {
        allIds.push(student.id);
      }
    }
  });
  return { byId, allIds };
};

const initialNormalized = normalizeStudents(INITIAL_STUDENTS);

const initialState = {
  byId: initialNormalized.byId,
  allIds: initialNormalized.allIds,
  status: 'succeeded', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      const student = action.payload;
      if (!student || !student.id) return;
      if (!state.byId[student.id]) {
        state.allIds.unshift(student.id);
      }
      state.byId[student.id] = {
        ...student,
        createdAt: new Date().toISOString()
      };
    },
    updateStudent: (state, action) => {
      const student = action.payload;
      if (!student || !student.id) return;
      if (state.byId[student.id]) {
        state.byId[student.id] = {
          ...state.byId[student.id],
          ...student,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteStudent: (state, action) => {
      const studentId = action.payload;
      if (state.byId[studentId]) {
        delete state.byId[studentId];
        state.allIds = state.allIds.filter(id => id !== studentId);
      }
    },
    setStudentsBulk: (state, action) => {
      const normalized = normalizeStudents(action.payload);
      state.byId = normalized.byId;
      state.allIds = normalized.allIds;
      state.status = 'succeeded';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const normalized = normalizeStudents(action.payload);
        // Merge or replace
        state.byId = { ...state.byId, ...normalized.byId };
        state.allIds = Array.from(new Set([...state.allIds, ...normalized.allIds]));
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Error loading students';
      });
  }
});

export const { addStudent, updateStudent, deleteStudent, setStudentsBulk } = studentsSlice.actions;
export default studentsSlice.reducer;
