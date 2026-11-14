import { describe, it, expect } from 'vitest';
import attendanceReducer, { 
  markAttendance, 
  bulkMarkClass, 
  updateAttendance, 
  buildCompositeKey,
  saveAttendanceBatch 
} from './attendanceSlice';
import { 
  selectStudentAttendanceStats, 
  selectDefaultersList, 
  selectSessionSummary 
} from './attendanceSelectors';

describe('Attendance Slice & Deduplication Architecture (Assignment 13)', () => {
  const initialTestState = {
    recordsByKey: {},
    saveStatus: 'idle',
    lastSyncedAt: null,
    error: null,
  };

  it('mathematically guarantees composite-key deduplication on identical date::subject::student keys', () => {
    const date = '2026-11-14';
    const subjectId = 'CS301';
    const studentId = 'CS2024-101';
    const expectedKey = '2026-11-14::CS301::CS2024-101';

    // First dispatch: Mark student as Present
    let state = attendanceReducer(
      initialTestState, 
      markAttendance({ date, subjectId, studentId, status: 'P', isLate: false })
    );

    expect(Object.keys(state.recordsByKey).length).toBe(1);
    expect(state.recordsByKey[expectedKey]).toBeDefined();
    expect(state.recordsByKey[expectedKey].status).toBe('P');

    // Second dispatch: Faculty changes student status to Absent on the same day and subject
    state = attendanceReducer(
      state, 
      markAttendance({ date, subjectId, studentId, status: 'A', isLate: false })
    );

    // CRITICAL DEDUPLICATION ASSERTION: Total records MUST remain 1, status updated to 'A'
    expect(Object.keys(state.recordsByKey).length).toBe(1);
    expect(state.recordsByKey[expectedKey].status).toBe('A');

    // Third dispatch: Faculty marks as Internship Placed (PL)
    state = attendanceReducer(
      state, 
      markAttendance({ date, subjectId, studentId, status: 'PL', isLate: false })
    );

    expect(Object.keys(state.recordsByKey).length).toBe(1);
    expect(state.recordsByKey[expectedKey].status).toBe('PL');
  });

  it('accurately computes academic percentages awarding 100% credit for PL and E status codes', () => {
    const students = [
      { id: 'S1', name: 'Standard Student', department: 'CS', semester: 'Sem 5', section: 'A' },
      { id: 'S2', name: 'Internship Placed Student', department: 'CS', semester: 'Sem 5', section: 'A' },
      { id: 'S3', name: 'Sports Duty Student', department: 'CS', semester: 'Sem 5', section: 'A' },
      { id: 'S4', name: 'Chronic Defaulter', department: 'CS', semester: 'Sem 5', section: 'A' },
    ];

    // Build mock records for 4 classes
    const recordsByKey = {
      // S1: 3 Present, 1 Absent = 3/4 = 75%
      '2026-11-01::CS301::S1': { date: '2026-11-01', subjectId: 'CS301', studentId: 'S1', status: 'P' },
      '2026-11-02::CS301::S1': { date: '2026-11-02', subjectId: 'CS301', studentId: 'S1', status: 'P' },
      '2026-11-03::CS301::S1': { date: '2026-11-03', subjectId: 'CS301', studentId: 'S1', status: 'P' },
      '2026-11-04::CS301::S1': { date: '2026-11-04', subjectId: 'CS301', studentId: 'S1', status: 'A' },

      // S2: 1 Present, 3 Internship Placed (PL) = 4/4 = 100% credited
      '2026-11-01::CS301::S2': { date: '2026-11-01', subjectId: 'CS301', studentId: 'S2', status: 'P' },
      '2026-11-02::CS301::S2': { date: '2026-11-02', subjectId: 'CS301', studentId: 'S2', status: 'PL' },
      '2026-11-03::CS301::S2': { date: '2026-11-03', subjectId: 'CS301', studentId: 'S2', status: 'PL' },
      '2026-11-04::CS301::S2': { date: '2026-11-04', subjectId: 'CS301', studentId: 'S2', status: 'PL' },

      // S3: 2 Official Engagement (E), 2 Absent = 2/4 = 50% credited
      '2026-11-01::CS301::S3': { date: '2026-11-01', subjectId: 'CS301', studentId: 'S3', status: 'E' },
      '2026-11-02::CS301::S3': { date: '2026-11-02', subjectId: 'CS301', studentId: 'S3', status: 'E' },
      '2026-11-03::CS301::S3': { date: '2026-11-03', subjectId: 'CS301', studentId: 'S3', status: 'A' },
      '2026-11-04::CS301::S3': { date: '2026-11-04', subjectId: 'CS301', studentId: 'S3', status: 'A' },

      // S4: 1 Present, 3 Absent = 1/4 = 25% (< 45% default threshold)
      '2026-11-01::CS301::S4': { date: '2026-11-01', subjectId: 'CS301', studentId: 'S4', status: 'P' },
      '2026-11-02::CS301::S4': { date: '2026-11-02', subjectId: 'CS301', studentId: 'S4', status: 'A' },
      '2026-11-03::CS301::S4': { date: '2026-11-03', subjectId: 'CS301', studentId: 'S4', status: 'A' },
      '2026-11-04::CS301::S4': { date: '2026-11-04', subjectId: 'CS301', studentId: 'S4', status: 'A' },
    };

    const rootState = {
      students: {
        byId: Object.fromEntries(students.map(s => [s.id, s])),
        allIds: students.map(s => s.id),
      },
      attendance: { recordsByKey },
      filters: {
        department: 'CS',
        semester: 'Sem 5',
        section: 'A',
        lowAttendanceThreshold: 45,
        reportDateRange: { start: '', end: '' },
      },
      subjects: { list: [{ id: 'CS301', code: 'CS301', name: 'DSA' }] },
    };

    const stats = selectStudentAttendanceStats(rootState);

    const s1Stats = stats.find(s => s.id === 'S1');
    expect(s1Stats.percentage).toBe(75);
    expect(s1Stats.isDefaulter).toBe(false);

    // Check S2 with Internship credits:
    const s2Stats = stats.find(s => s.id === 'S2');
    expect(s2Stats.internshipCount).toBe(3);
    expect(s2Stats.totalCredited).toBe(4);
    expect(s2Stats.percentage).toBe(100);
    expect(s2Stats.isDefaulter).toBe(false);

    // Check S3 with Official Duty credits:
    const s3Stats = stats.find(s => s.id === 'S3');
    expect(s3Stats.engagementCount).toBe(2);
    expect(s3Stats.percentage).toBe(50);
    expect(s3Stats.isDefaulter).toBe(false); // 50% >= 45%

    // Check S4 Defaulter boundary:
    const s4Stats = stats.find(s => s.id === 'S4');
    expect(s4Stats.percentage).toBe(25);
    expect(s4Stats.isDefaulter).toBe(true); // 25% < 45%

    // Verify selectDefaultersList
    const defaulters = selectDefaultersList(rootState);
    expect(defaulters.length).toBe(1);
    expect(defaulters[0].id).toBe('S4');
  });

  it('handles bulkMarkClass and async thunk transitions', () => {
    const studentIds = ['S101', 'S102', 'S103'];
    const date = '2026-11-14';
    const subjectId = 'CS302';

    let state = attendanceReducer(
      initialTestState,
      bulkMarkClass({ date, subjectId, studentIds, status: 'P' })
    );

    expect(Object.keys(state.recordsByKey).length).toBe(3);
    expect(state.recordsByKey['2026-11-14::CS302::S101'].status).toBe('P');
    expect(state.recordsByKey['2026-11-14::CS302::S102'].status).toBe('P');
    expect(state.recordsByKey['2026-11-14::CS302::S103'].status).toBe('P');

    // Async thunk states
    state = attendanceReducer(state, { type: saveAttendanceBatch.pending.type });
    expect(state.saveStatus).toBe('pending');

    state = attendanceReducer(state, { 
      type: saveAttendanceBatch.fulfilled.type, 
      payload: { timestamp: '2026-11-14T12:00:00Z', savedCount: 3 } 
    });
    expect(state.saveStatus).toBe('fulfilled');
    expect(state.lastSyncedAt).toBe('2026-11-14T12:00:00Z');
  });
});
