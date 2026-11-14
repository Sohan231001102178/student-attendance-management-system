/**
 * Fault-tolerant LocalStorage Hydration & Serialization Helpers
 * Supports atomic persistence for students, subjects, attendance, and threshold.
 */

export const STORAGE_KEY = 'SAMS_ACADEMIC_ERP_STATE_V1';

export const INITIAL_STUDENTS = [
  { id: 'CS2024-101', name: 'Aarav Sharma', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'aarav.sharma@institution.edu', rollNo: '01' },
  { id: 'CS2024-102', name: 'Diya Patel', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'diya.patel@institution.edu', rollNo: '02' },
  { id: 'CS2024-103', name: 'Rohan Verma', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'rohan.verma@institution.edu', rollNo: '03' },
  { id: 'CS2024-104', name: 'Ananya Iyer', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'ananya.iyer@institution.edu', rollNo: '04' },
  { id: 'CS2024-105', name: 'Kabir Mehta', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'kabir.mehta@institution.edu', rollNo: '05' },
  { id: 'CS2024-106', name: 'Sneha Kulkarni', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'sneha.k@institution.edu', rollNo: '06' },
  { id: 'CS2024-107', name: 'Vikramaditya Roy', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'vikram.roy@institution.edu', rollNo: '07' },
  { id: 'CS2024-108', name: 'Pooja Reddy', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'pooja.reddy@institution.edu', rollNo: '08' },
  { id: 'CS2024-109', name: 'Aditya Deshmukh', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'aditya.d@institution.edu', rollNo: '09' },
  { id: 'CS2024-110', name: 'Ishita Bansal', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'ishita.b@institution.edu', rollNo: '10' },
  { id: 'CS2024-111', name: 'Gaurav Nair', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'gaurav.nair@institution.edu', rollNo: '11' },
  { id: 'CS2024-112', name: 'Tanvi Sen', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'tanvi.sen@institution.edu', rollNo: '12' },
  { id: 'CS2024-113', name: 'Farhan Zaidi', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'farhan.z@institution.edu', rollNo: '13' },
  { id: 'CS2024-114', name: 'Kavya Pillai', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'kavya.p@institution.edu', rollNo: '14' },
  { id: 'CS2024-115', name: 'Pranav Joshi', department: 'Computer Science', semester: 'Sem 5', section: 'A', email: 'pranav.j@institution.edu', rollNo: '15' },
  // Section B
  { id: 'CS2024-201', name: 'Mihir Agarwal', department: 'Computer Science', semester: 'Sem 5', section: 'B', email: 'mihir.a@institution.edu', rollNo: '01' },
  { id: 'CS2024-202', name: 'Riya Mukherjee', department: 'Computer Science', semester: 'Sem 5', section: 'B', email: 'riya.m@institution.edu', rollNo: '02' },
  { id: 'CS2024-203', name: 'Siddharth Menon', department: 'Computer Science', semester: 'Sem 5', section: 'B', email: 'sid.menon@institution.edu', rollNo: '03' },
  { id: 'CS2024-204', name: 'Zoya Khan', department: 'Computer Science', semester: 'Sem 5', section: 'B', email: 'zoya.k@institution.edu', rollNo: '04' },
  // Information Technology
  { id: 'IT2024-101', name: 'Nikhil Chandran', department: 'Information Technology', semester: 'Sem 5', section: 'A', email: 'nikhil.c@institution.edu', rollNo: '01' },
  { id: 'IT2024-102', name: 'Meera Nambiar', department: 'Information Technology', semester: 'Sem 5', section: 'A', email: 'meera.n@institution.edu', rollNo: '02' },
  { id: 'IT2024-103', name: 'Akash Sundaram', department: 'Information Technology', semester: 'Sem 5', section: 'A', email: 'akash.s@institution.edu', rollNo: '03' },
  { id: 'IT2024-104', name: 'Tarun Mathur', department: 'Information Technology', semester: 'Sem 5', section: 'A', email: 'tarun.m@institution.edu', rollNo: '04' },
];

export const INITIAL_SUBJECTS = [
  { id: 'CS301', code: 'CS301', name: 'Data Structures & Algorithms', department: 'Computer Science', semester: 'Sem 5', credits: 4, faculty: 'Prof. Alan Turing' },
  { id: 'CS302', code: 'CS302', name: 'Operating Systems & Concurrency', department: 'Computer Science', semester: 'Sem 5', credits: 4, faculty: 'Dr. Linus Torvalds' },
  { id: 'CS303', code: 'CS303', name: 'Database Management Systems', department: 'Computer Science', semester: 'Sem 5', credits: 3, faculty: 'Prof. Edgar Codd' },
  { id: 'CS304', code: 'CS304', name: 'Computer Networks & Protocols', department: 'Computer Science', semester: 'Sem 5', credits: 3, faculty: 'Dr. Vint Cerf' },
  { id: 'CS305', code: 'CS305', name: 'Artificial Intelligence & ML', department: 'Computer Science', semester: 'Sem 5', credits: 4, faculty: 'Dr. Geoffrey Hinton' },
  { id: 'IT301', code: 'IT301', name: 'Cloud Computing & Microservices', department: 'Information Technology', semester: 'Sem 5', credits: 4, faculty: 'Prof. Werner Vogels' },
  { id: 'IT302', code: 'IT302', name: 'Full-Stack Web Architectures', department: 'Information Technology', semester: 'Sem 5', credits: 3, faculty: 'Dr. Brendan Eich' },
  { id: 'CS201', code: 'CS201', name: 'Object Oriented Programming', department: 'Computer Science', semester: 'Sem 3', credits: 4, faculty: 'Prof. Bjarne Stroustrup' },
];

/**
 * Generate historical deterministic attendance records
 * to demonstrate analytics, trends, and defaulter detection immediately.
 */
export function generateInitialAttendanceRecords() {
  const records = {};
  const pastDates = [
    '2026-11-03',
    '2026-11-04',
    '2026-11-05',
    '2026-11-06',
    '2026-11-07',
    '2026-11-10',
    '2026-11-11',
    '2026-11-12',
    '2026-11-13',
    '2026-11-14',
  ];

  const csSubjects = ['CS301', 'CS302', 'CS303'];
  const studentsSectionA = INITIAL_STUDENTS.filter(s => s.department === 'Computer Science' && s.section === 'A');

  pastDates.forEach((date, dateIdx) => {
    csSubjects.forEach((subjectId, subjIdx) => {
      studentsSectionA.forEach((student, stuIdx) => {
        const compositeKey = `${date}::${subjectId}::${student.id}`;
        
        let status = 'P';
        let isLate = false;

        // Controlled distribution to ensure varied academic percentages:
        // Defaulter 1: Kabir Mehta (id: CS2024-105) -> low attendance (~25%)
        if (student.id === 'CS2024-105') {
          status = (dateIdx % 4 === 0) ? 'P' : 'A';
        }
        // Defaulter 2: Vikramaditya Roy (id: CS2024-107) -> low attendance (~33%)
        else if (student.id === 'CS2024-107') {
          status = (dateIdx % 3 === 0) ? 'P' : 'A';
        }
        // Internship Placed student: Pooja Reddy (id: CS2024-108) -> mostly PL (100% credited)
        else if (student.id === 'CS2024-108') {
          status = dateIdx > 2 ? 'PL' : 'P';
        }
        // Official Engagement student: Tanvi Sen (id: CS2024-112) -> sports / symposium
        else if (student.id === 'CS2024-112') {
          status = (dateIdx === 3 || dateIdx === 4 || dateIdx === 7) ? 'E' : (dateIdx % 5 === 0 ? 'A' : 'P');
        }
        // Defaulter 3: Farhan Zaidi (id: CS2024-113) -> ~40%
        else if (student.id === 'CS2024-113') {
          status = ((dateIdx + subjIdx) % 3 === 0) ? 'P' : 'A';
        }
        // Average students: 70% to 90%
        else {
          const pseudoRand = (stuIdx * 7 + dateIdx * 13 + subjIdx * 19) % 100;
          if (pseudoRand < 8) {
            status = 'A';
          } else if (pseudoRand < 14) {
            status = 'E';
          } else if (pseudoRand < 18) {
            status = 'PL';
          } else {
            status = 'P';
            // Some late arrivals
            if (pseudoRand > 80 && pseudoRand < 92) {
              isLate = true;
            }
          }
        }

        records[compositeKey] = {
          compositeKey,
          date,
          subjectId,
          studentId: student.id,
          status,
          isLate,
          timestamp: new Date(`${date}T09:30:00Z`).toISOString()
        };
      });
    });
  });

  return records;
}

export function loadPersistedState() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.warn('[SAMS ERP] Failed to load persisted state from localStorage:', err);
    return null;
  }
}

export function savePersistedState(stateToSave) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const serialized = JSON.stringify(stateToSave);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('[SAMS ERP] Failed to save state to localStorage:', err);
  }
}

export function clearPersistedState() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error(err);
  }
}
