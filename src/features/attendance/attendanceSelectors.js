import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents, selectStudentsState } from '../students/studentsSelectors';
import { selectFilters } from '../filters/filtersSlice';
import { selectSubjectsList } from '../subjects/subjectsSlice';
import { buildCompositeKey } from './attendanceSlice';

export const selectAttendanceState = (state) => state.attendance;
export const selectAttendanceRecordsByKey = (state) => state.attendance.recordsByKey;
export const selectAttendanceSaveStatus = (state) => state.attendance.saveStatus;
export const selectAttendanceLastSyncedAt = (state) => state.attendance.lastSyncedAt;
export const selectAttendanceError = (state) => state.attendance.error;

/**
 * 1. Registered Class Roster for Active Session Marking
 * Filters students matching active department, semester, and section.
 * Pairs each student with their current session attendance record (status & isLate).
 */
export const selectRegisteredClassStudents = createSelector(
  [selectAllStudents, selectAttendanceRecordsByKey, selectFilters],
  (students, recordsByKey, filters) => {
    const { department, semester, section, activeDate, activeSubjectId } = filters;

    // Filter students by class context
    const matchingStudents = students.filter(student => {
      const matchDept = !department || department === 'All' || student.department === department;
      const matchSem = !semester || semester === 'All' || student.semester === semester;
      const matchSec = !section || section === 'All' || student.section === section;
      return matchDept && matchSem && matchSec;
    });

    // Pair with attendance record for the active date and subject
    return matchingStudents.map(student => {
      const key = buildCompositeKey(activeDate, activeSubjectId, student.id);
      const record = recordsByKey[key] || null;
      return {
        ...student,
        compositeKey: key,
        attendanceRecord: record,
        currentStatus: record ? record.status : null, // 'P' | 'A' | 'PL' | 'E' | null (unmarked)
        isLate: record ? Boolean(record.isLate) : false,
      };
    });
  }
);

/**
 * 2. Live Session KPIs
 * Computes Total Students, Present (including PL & E credits), Absent, Late, and Unmarked.
 */
export const selectSessionSummary = createSelector(
  [selectRegisteredClassStudents],
  (classRoster) => {
    const total = classRoster.length;
    let presentCount = 0; // Pure P
    let absentCount = 0;  // A
    let internshipCount = 0; // PL
    let engagementCount = 0; // E
    let lateCount = 0;
    let unmarkedCount = 0;

    classRoster.forEach(item => {
      if (!item.currentStatus) {
        unmarkedCount++;
      } else if (item.currentStatus === 'P') {
        presentCount++;
        if (item.isLate) lateCount++;
      } else if (item.currentStatus === 'A') {
        absentCount++;
      } else if (item.currentStatus === 'PL') {
        internshipCount++;
      } else if (item.currentStatus === 'E') {
        engagementCount++;
      }
    });

    const totalAttendedOrCredited = presentCount + internshipCount + engagementCount;
    const markedTotal = total - unmarkedCount;
    const sessionRate = markedTotal > 0 ? ((totalAttendedOrCredited / markedTotal) * 100) : 0;

    return {
      total,
      markedTotal,
      unmarkedCount,
      presentCount,
      absentCount,
      internshipCount,
      engagementCount,
      lateCount,
      totalAttendedOrCredited,
      sessionRate: Math.round(sessionRate * 10) / 10,
    };
  }
);

/**
 * 3. Individual Student Attendance Statistics & Defaulter Detection
 * Calculates ((P + PL + E) / TotalClasses) * 100 per student.
 * Flags students strictly below state.filters.lowAttendanceThreshold (default 45%).
 */
export const selectStudentAttendanceStats = createSelector(
  [selectAllStudents, selectAttendanceRecordsByKey, selectFilters, selectSubjectsList],
  (students, recordsByKey, filters, subjects) => {
    const { department, semester, section, reportDateRange, lowAttendanceThreshold = 45 } = filters;
    const subjectMap = new Map(subjects.map(s => [s.id, s]));

    // Filter relevant students based on department/semester/section filters
    const targetStudents = students.filter(student => {
      const matchDept = !department || department === 'All' || student.department === department;
      const matchSem = !semester || semester === 'All' || student.semester === semester;
      const matchSec = !section || section === 'All' || student.section === section;
      return matchDept && matchSem && matchSec;
    });

    const startDate = reportDateRange?.start || '';
    const endDate = reportDateRange?.end || '';

    return targetStudents.map(student => {
      let totalClasses = 0;
      let presentCount = 0;
      let absentCount = 0;
      let internshipCount = 0;
      let engagementCount = 0;
      let lateCount = 0;

      const subjectBreakdown = {};

      // Iterate through all records for this student
      Object.values(recordsByKey).forEach(record => {
        if (record.studentId !== student.id) return;

        // Date range filtering
        if (startDate && record.date < startDate) return;
        if (endDate && record.date > endDate) return;

        totalClasses++;
        if (record.status === 'P') {
          presentCount++;
          if (record.isLate) lateCount++;
        } else if (record.status === 'A') {
          absentCount++;
        } else if (record.status === 'PL') {
          internshipCount++;
        } else if (record.status === 'E') {
          engagementCount++;
        }

        // Subject breakdown
        if (!subjectBreakdown[record.subjectId]) {
          const subj = subjectMap.get(record.subjectId);
          subjectBreakdown[record.subjectId] = {
            subjectId: record.subjectId,
            code: subj?.code || record.subjectId,
            name: subj?.name || record.subjectId,
            total: 0,
            attendedOrCredited: 0,
          };
        }
        subjectBreakdown[record.subjectId].total++;
        if (record.status === 'P' || record.status === 'PL' || record.status === 'E') {
          subjectBreakdown[record.subjectId].attendedOrCredited++;
        }
      });

      const totalCredited = presentCount + internshipCount + engagementCount;
      const percentage = totalClasses > 0 ? (totalCredited / totalClasses) * 100 : 0;
      const roundedPercentage = Math.round(percentage * 10) / 10;
      const isDefaulter = totalClasses > 0 && roundedPercentage < lowAttendanceThreshold;

      return {
        ...student,
        totalClasses,
        presentCount,
        absentCount,
        internshipCount,
        engagementCount,
        lateCount,
        totalCredited,
        percentage: roundedPercentage,
        isDefaulter,
        subjectBreakdown: Object.values(subjectBreakdown).map(sb => ({
          ...sb,
          rate: sb.total > 0 ? Math.round((sb.attendedOrCredited / sb.total) * 1000) / 10 : 0
        }))
      };
    });
  }
);

/**
 * 4. Defaulters List
 */
export const selectDefaultersList = createSelector(
  [selectStudentAttendanceStats],
  (studentStats) => {
    return studentStats.filter(s => s.isDefaulter);
  }
);

/**
 * 5. Overall Institutional KPIs across filtered student group
 */
export const selectOverallKpiSummary = createSelector(
  [selectStudentAttendanceStats, selectAttendanceRecordsByKey],
  (studentStats, recordsByKey) => {
    const totalStudents = studentStats.length;
    const defaultersCount = studentStats.filter(s => s.isDefaulter).length;
    const nonDefaultersCount = totalStudents - defaultersCount;

    let aggregateTotalClasses = 0;
    let aggregateCredited = 0;
    let aggregatePresent = 0;
    let aggregateAbsent = 0;
    let aggregateInternship = 0;
    let aggregateEngagement = 0;
    let aggregateLate = 0;

    studentStats.forEach(s => {
      aggregateTotalClasses += s.totalClasses;
      aggregateCredited += s.totalCredited;
      aggregatePresent += s.presentCount;
      aggregateAbsent += s.absentCount;
      aggregateInternship += s.internshipCount;
      aggregateEngagement += s.engagementCount;
      aggregateLate += s.lateCount;
    });

    const averagePercentage = aggregateTotalClasses > 0
      ? Math.round((aggregateCredited / aggregateTotalClasses) * 1000) / 10
      : 0;

    const complianceRate = totalStudents > 0
      ? Math.round((nonDefaultersCount / totalStudents) * 1000) / 10
      : 100;

    return {
      totalStudents,
      defaultersCount,
      nonDefaultersCount,
      averagePercentage,
      complianceRate,
      aggregateTotalClasses,
      aggregatePresent,
      aggregateAbsent,
      aggregateInternship,
      aggregateEngagement,
      aggregateLate,
      totalRecordsInStore: Object.keys(recordsByKey).length
    };
  }
);

/**
 * 6. Daily Attendance Trends for Recharts (Line/Area Chart)
 */
export const selectDailyAttendanceTrend = createSelector(
  [selectAttendanceRecordsByKey, selectFilters],
  (recordsByKey, filters) => {
    const { department, semester, section } = filters;
    const groupedByDate = {};

    Object.values(recordsByKey).forEach(record => {
      const { date, status, isLate } = record;
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          present: 0,
          absent: 0,
          internship: 0,
          engagement: 0,
          late: 0,
          total: 0,
        };
      }

      groupedByDate[date].total++;
      if (status === 'P') {
        groupedByDate[date].present++;
        if (isLate) groupedByDate[date].late++;
      } else if (status === 'A') {
        groupedByDate[date].absent++;
      } else if (status === 'PL') {
        groupedByDate[date].internship++;
      } else if (status === 'E') {
        groupedByDate[date].engagement++;
      }
    });

    return Object.keys(groupedByDate)
      .sort()
      .map(date => {
        const item = groupedByDate[date];
        const credited = item.present + item.internship + item.engagement;
        const rate = item.total > 0 ? Math.round((credited / item.total) * 1000) / 10 : 0;
        return {
          ...item,
          credited,
          rate,
        };
      });
  }
);

/**
 * 7. Subject-wise Aggregation for Recharts (Bar Chart)
 */
export const selectSubjectAttendanceStats = createSelector(
  [selectAttendanceRecordsByKey, selectSubjectsList],
  (recordsByKey, subjects) => {
    const subjectMap = new Map(subjects.map(s => [s.id, s]));
    const groupedBySubject = {};

    Object.values(recordsByKey).forEach(record => {
      const { subjectId, status } = record;
      if (!groupedBySubject[subjectId]) {
        const subj = subjectMap.get(subjectId);
        groupedBySubject[subjectId] = {
          subjectId,
          code: subj?.code || subjectId,
          name: subj?.name || subjectId,
          totalClasses: 0,
          present: 0,
          absent: 0,
          credited: 0,
        };
      }

      groupedBySubject[subjectId].totalClasses++;
      if (status === 'P') {
        groupedBySubject[subjectId].present++;
        groupedBySubject[subjectId].credited++;
      } else if (status === 'PL' || status === 'E') {
        groupedBySubject[subjectId].credited++;
      } else if (status === 'A') {
        groupedBySubject[subjectId].absent++;
      }
    });

    return Object.values(groupedBySubject).map(item => {
      const rate = item.totalClasses > 0 ? Math.round((item.credited / item.totalClasses) * 1000) / 10 : 0;
      return {
        ...item,
        rate,
      };
    });
  }
);

/**
 * 8. Status Distribution for Donut Chart (Emerald, Crimson, Cobalt Blue, Royal Violet)
 */
export const selectStatusDistribution = createSelector(
  [selectAttendanceRecordsByKey],
  (recordsByKey) => {
    let p = 0;
    let a = 0;
    let pl = 0;
    let e = 0;

    Object.values(recordsByKey).forEach(r => {
      if (r.status === 'P') p++;
      else if (r.status === 'A') a++;
      else if (r.status === 'PL') pl++;
      else if (r.status === 'E') e++;
    });

    return [
      { name: 'Present (P)', value: p, color: '#10B981', code: 'P' },
      { name: 'Absent (A)', value: a, color: '#EF4444', code: 'A' },
      { name: 'Internship (PL)', value: pl, color: '#3B82F6', code: 'PL' },
      { name: 'Official Engagement (E)', value: e, color: '#8B5CF6', code: 'E' },
    ];
  }
);
