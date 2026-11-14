import { describe, it, expect } from 'vitest';
import studentsReducer, { 
  addStudent, 
  updateStudent, 
  deleteStudent,
  fetchStudents 
} from './studentsSlice';
import { selectFilteredRoster, selectAllStudents } from './studentsSelectors';

describe('Students Slice & Selectors (Assignment 13 Roster Architecture)', () => {
  const initialTestState = {
    byId: {
      'CS-001': { id: 'CS-001', name: 'Devon Vance', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'devon@institution.edu', rollNo: '01' },
      'CS-002': { id: 'CS-002', name: 'Elena Rostova', department: 'Computer Science', semester: 'Sem 5', section: 'B', email: 'elena@institution.edu', rollNo: '02' },
      'IT-001': { id: 'IT-001', name: 'Marcus Sterling', department: 'Information Technology', semester: 'Sem 5', section: 'A', email: 'marcus@institution.edu', rollNo: '01' },
    },
    allIds: ['CS-001', 'CS-002', 'IT-001'],
    status: 'succeeded',
    error: null,
  };

  it('should handle addStudent by upserting byId and appending to allIds', () => {
    const newStudent = {
      id: 'CS-003',
      name: 'Zara Thorne',
      department: 'Computer Science',
      semester: 'Sem 5',
      section: 'A',
      email: 'zara@institution.edu',
      rollNo: '03'
    };

    const state = studentsReducer(initialTestState, addStudent(newStudent));

    expect(state.byId['CS-003']).toBeDefined();
    expect(state.byId['CS-003'].name).toBe('Zara Thorne');
    expect(state.allIds).toContain('CS-003');
    expect(state.allIds.length).toBe(4);
  });

  it('should handle updateStudent without mutating allIds', () => {
    const state = studentsReducer(initialTestState, updateStudent({
      id: 'CS-001',
      name: 'Devon Vance Jr.',
      email: 'devon.jr@institution.edu'
    }));

    expect(state.byId['CS-001'].name).toBe('Devon Vance Jr.');
    expect(state.byId['CS-001'].email).toBe('devon.jr@institution.edu');
    expect(state.byId['CS-001'].department).toBe('Computer Science'); // preserved
    expect(state.allIds.length).toBe(3);
  });

  it('should handle deleteStudent by removing from byId and allIds', () => {
    const state = studentsReducer(initialTestState, deleteStudent('CS-002'));

    expect(state.byId['CS-002']).toBeUndefined();
    expect(state.allIds).not.toContain('CS-002');
    expect(state.allIds.length).toBe(2);
  });

  it('should filter roster by query and department using memoized selectFilteredRoster', () => {
    const rootState = {
      students: initialTestState,
      filters: {
        rosterSearch: 'Devon',
        department: 'Computer Science',
        semester: 'Sem 5',
        section: 'A',
      }
    };

    const filtered = selectFilteredRoster(rootState);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('CS-001');
    expect(filtered[0].name).toBe('Devon Vance');
  });

  it('should handle fetchStudents async thunk lifecycle states', () => {
    const pendingState = studentsReducer(initialTestState, { type: fetchStudents.pending.type });
    expect(pendingState.status).toBe('loading');

    const fulfilledPayload = [
      { id: 'CS-999', name: 'Async Student', department: 'Computer Science', semester: 'Sem 5', section: 'A' }
    ];
    const fulfilledState = studentsReducer(pendingState, { 
      type: fetchStudents.fulfilled.type, 
      payload: fulfilledPayload 
    });
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.byId['CS-999']).toBeDefined();
    expect(fulfilledState.allIds).toContain('CS-999');
  });
});
