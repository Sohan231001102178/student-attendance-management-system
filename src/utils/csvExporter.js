/**
 * RFC-4180 Compliant CSV Export Utility
 * Serializes filtered attendance report records into downloadable CSV format.
 */

export function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '""';
  }
  const stringValue = String(field);
  // If the field contains comma, quote, or newline, escape it
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

export function formatAttendanceCsvRows(studentsStats, activeSubjectName = 'All Subjects') {
  const headers = [
    'Student ID',
    'Name',
    'Dept',
    'Sem',
    'Section',
    'Subject',
    'Classes Held',
    'Attended',
    'Percentage %',
    'Status Flag'
  ];

  const rows = studentsStats.map(student => {
    const statusFlag = student.isDefaulter ? 'DEFAULTER (BELOW THRESHOLD)' : 'COMPLIANT';
    return [
      student.id,
      student.name,
      student.department,
      student.semester,
      student.section,
      activeSubjectName,
      student.totalClasses,
      student.totalCredited,
      `${student.percentage}%`,
      statusFlag
    ];
  });

  const csvContent = [
    headers.map(escapeCsvField).join(','),
    ...rows.map(row => row.map(escapeCsvField).join(','))
  ].join('\r\n');

  return csvContent;
}

export function exportAttendanceToCsv(studentsStats, filename = 'Student_Attendance_Report.csv', activeSubjectName = 'All Subjects') {
  const csvContent = formatAttendanceCsvRows(studentsStats, activeSubjectName);

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  // Create UTF-8 BOM so Excel opens with proper character encoding
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return csvContent;
}
