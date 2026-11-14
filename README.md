# SAMS ERP — Student Attendance Management System

> **Multi-Slice Store Design, Composite-Key Deduplication, Analytics Selectors, Reporting & CSV Export**  
> *Assignment 13 — Academic ERP & Redux Toolkit Systems Architecture Blueprint*

---

## 🚀 Architectural Highlights

1. **Normalized Multi-Slice Store Design (`@reduxjs/toolkit`)**
   - `studentsSlice`: CRUD reducers (`addStudent`, `updateStudent`, `deleteStudent`), `fetchStudents` async thunk, and normalized entity tables (`byId` & `allIds`).
   - `subjectsSlice`: Catalog mapping course IDs, credits, faculties, semesters, and departments.
   - `attendanceSlice`: Deterministic composite-key upsert engine, bulk class marking, session clearing, and `saveAttendanceBatch` async thunk.
   - `filtersSlice`: Active class context (`department`, `semester`, `section`, `activeDate`, `activeSubjectId`) and configurable low-attendance threshold (default 45%).

2. **Core Architectural Principle: Composite-Key Deduplication**
   - Every attendance entry is indexed in state by a deterministic composite key:
     ```javascript
     `${date}::${subjectId}::${studentId}`
     ```
   - Dispatching `markAttendance` performs an **$O(1)$ upsert** against this composite key, mathematically guaranteeing that duplicate entries for the same student, subject, and date can never exist.

3. **Academic Status Semantics & Percentage Rules**
   - **Present (P)**: `100%` Attended (+1 numerator, +1 denominator) — *Emerald Green (`#10B981`)*
   - **Absent (A)**: `0%` Attended (+0 numerator, +1 denominator) — *Crimson Red (`#EF4444`)*
   - **Internship Placed (PL)**: `100%` Credited (+1 numerator, +1 denominator) — *Cobalt Blue (`#3B82F6`)*
   - **Official Engagement (E)**: `100%` Credited (+1 numerator, +1 denominator) — *Royal Violet (`#8B5CF6`)*
   - **Late Flag (`isLate`)**: Boolean metadata modifier on Present records — *Amber Indicator (`#F59E0B`)*

   $$\text{Attendance Percentage} = \frac{P + PL + E}{\text{Total Classes}} \times 100$$

4. **Memoized Reselect Selectors (`attendanceSelectors.js` & `studentsSelectors.js`)**
   - `selectRegisteredClassStudents`: Pairs active class roster with session attendance status.
   - `selectSessionSummary`: Real-time session KPI summary.
   - `selectStudentAttendanceStats`: Comprehensive per-student attendance calculations across filtered subjects and dates.
   - `selectDefaultersList`: Instant detection of students strictly below `lowAttendanceThreshold` (e.g. `< 45%`).
   - `selectDailyAttendanceTrend` & `selectSubjectAttendanceStats`: Feeds Recharts visualizations with sub-millisecond execution.

5. **Custom Middleware Chain**
   - `auditLoggerMiddleware.js`: Intercepts every dispatched Redux action, computes execution duration in milliseconds, and provides a real-time event telemetry stream.
   - `persistenceMiddleware.js`: Debounced synchronization to `localStorage` with safe hydration via `preloadedState`.

6. **RFC-4180 Compliant CSV Export (`csvExporter.js`)**
   - One-click client-side export to downloadable `.csv` with escaped fields and UTF-8 BOM encoding for Excel compatibility.

---

## 🛠️ Verification & Test Suite

The project includes unit test suites using **Vitest** testing:
- Normalization & CRUD operations
- Mathematical composite-key deduplication
- Percentage calculations with PL and E credit weighting
- Threshold boundary checks (< 45%)
- Async thunk lifecycle states

Run tests:
```bash
npm test
```

Build production bundle:
```bash
npm run build
```

Start development server:
```bash
npm run dev
```
