import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateInitialAttendanceRecords } from '../../utils/storage';

export const buildCompositeKey = (date, subjectId, studentId) => {
  return `${date}::${subjectId}::${studentId}`;
};

// Async thunk simulating persistence of attendance batch to ERP backend
export const saveAttendanceBatch = createAsyncThunk(
  'attendance/saveAttendanceBatch',
  async (batchPayload, { rejectWithValue }) => {
    try {
      // Simulate network request with 500ms delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        savedCount: Object.keys(batchPayload || {}).length,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save attendance batch');
    }
  }
);

const initialState = {
  recordsByKey: generateInitialAttendanceRecords(),
  saveStatus: 'idle', // 'idle' | 'pending' | 'fulfilled' | 'rejected'
  lastSyncedAt: new Date().toISOString(),
  error: null,
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    /**
     * O(1) Upsert against composite key: `${date}::${subjectId}::${studentId}`
     * Mathematically guarantees duplicate entries can never exist.
     */
    markAttendance: (state, action) => {
      const { date, subjectId, studentId, status, isLate = false, note = '' } = action.payload;
      if (!date || !subjectId || !studentId || !status) return;

      const key = buildCompositeKey(date, subjectId, studentId);
      state.recordsByKey[key] = {
        compositeKey: key,
        date,
        subjectId,
        studentId,
        status, // 'P' | 'A' | 'PL' | 'E'
        isLate: Boolean(isLate),
        note,
        timestamp: new Date().toISOString()
      };
      state.saveStatus = 'idle'; // Reset status indicating unsaved local changes or fresh state
    },

    /**
     * Bulk mark an entire class roster with one action
     */
    bulkMarkClass: (state, action) => {
      const { date, subjectId, studentIds, status = 'P', isLate = false } = action.payload;
      if (!date || !subjectId || !Array.isArray(studentIds)) return;

      const timestamp = new Date().toISOString();
      studentIds.forEach(studentId => {
        const key = buildCompositeKey(date, subjectId, studentId);
        state.recordsByKey[key] = {
          compositeKey: key,
          date,
          subjectId,
          studentId,
          status,
          isLate,
          timestamp
        };
      });
      state.saveStatus = 'idle';
    },

    /**
     * Update existing record or upsert fields
     */
    updateAttendance: (state, action) => {
      const { date, subjectId, studentId, ...updates } = action.payload;
      const key = buildCompositeKey(date, subjectId, studentId);
      const existing = state.recordsByKey[key];

      state.recordsByKey[key] = {
        compositeKey: key,
        date,
        subjectId,
        studentId,
        status: updates.status || (existing ? existing.status : 'P'),
        isLate: updates.isLate !== undefined ? updates.isLate : (existing ? existing.isLate : false),
        note: updates.note !== undefined ? updates.note : (existing ? existing.note : ''),
        timestamp: new Date().toISOString()
      };
      state.saveStatus = 'idle';
    },

    /**
     * Bulk restore/hydrate records from storage
     */
    setAttendanceBulk: (state, action) => {
      state.recordsByKey = action.payload || {};
      state.saveStatus = 'idle';
    },

    clearSessionAttendance: (state, action) => {
      const { date, subjectId, studentIds } = action.payload;
      if (studentIds && Array.isArray(studentIds)) {
        studentIds.forEach(studentId => {
          const key = buildCompositeKey(date, subjectId, studentId);
          delete state.recordsByKey[key];
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAttendanceBatch.pending, (state) => {
        state.saveStatus = 'pending';
        state.error = null;
      })
      .addCase(saveAttendanceBatch.fulfilled, (state, action) => {
        state.saveStatus = 'fulfilled';
        state.lastSyncedAt = action.payload.timestamp;
        state.error = null;
      })
      .addCase(saveAttendanceBatch.rejected, (state, action) => {
        state.saveStatus = 'rejected';
        state.error = action.payload || 'Failed to sync attendance batch with ERP backend';
      });
  }
});

export const {
  markAttendance,
  bulkMarkClass,
  updateAttendance,
  setAttendanceBulk,
  clearSessionAttendance
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
