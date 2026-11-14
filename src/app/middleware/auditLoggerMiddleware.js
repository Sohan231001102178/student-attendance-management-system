/**
 * auditLoggerMiddleware.js
 * Intercepts every Redux action, computes execution duration,
 * logs action payload and state diffs to console, and retains
 * a live telemetry stream for the in-app ERP Audit Trail panel.
 */

// Ring buffer for live in-app audit stream (max 50 events)
export const liveAuditLogs = [];
const MAX_LOGS = 50;
const subscribers = new Set();

export const subscribeToAuditLogs = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const notifySubscribers = () => {
  subscribers.forEach((cb) => {
    try {
      cb([...liveAuditLogs]);
    } catch (e) {
      console.error('Audit log subscriber error:', e);
    }
  });
};

export const auditLoggerMiddleware = (storeAPI) => (next) => (action) => {
  const startTime = performance.now();
  const prevState = storeAPI.getState();

  // Execute the reducer pipeline
  const result = next(action);

  const durationMs = (performance.now() - startTime).toFixed(2);
  const nextState = storeAPI.getState();

  const isAttendanceAction = action.type.startsWith('attendance/');
  const isStudentAction = action.type.startsWith('students/');
  const isFilterAction = action.type.startsWith('filters/');

  const entry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toLocaleTimeString(),
    fullTimestamp: new Date().toISOString(),
    type: action.type,
    payload: action.payload,
    durationMs: `${durationMs}ms`,
    category: isAttendanceAction ? 'ATTENDANCE' : isStudentAction ? 'STUDENTS' : isFilterAction ? 'FILTERS' : 'SYSTEM',
    statusChange: action.type === 'attendance/markAttendance' ? {
      studentId: action.payload?.studentId,
      status: action.payload?.status,
      isLate: action.payload?.isLate,
      compositeKey: `${action.payload?.date}::${action.payload?.subjectId}::${action.payload?.studentId}`,
    } : null,
  };

  // Add to in-memory telemetry buffer
  liveAuditLogs.unshift(entry);
  if (liveAuditLogs.length > MAX_LOGS) {
    liveAuditLogs.pop();
  }
  notifySubscribers();

  // High-visibility formatted browser console audit
  if (typeof console !== 'undefined' && console.groupCollapsed) {
    const badgeColor = isAttendanceAction ? '#10B981' : isStudentAction ? '#3B82F6' : '#8B5CF6';
    console.groupCollapsed(
      `%c[RTK AUDIT] %c${action.type} %c(${durationMs}ms)`,
      'color: #94a3b8; font-weight: bold;',
      `color: ${badgeColor}; font-weight: bold;`,
      'color: #f59e0b; font-style: italic;'
    );
    console.log('Dispatched Action:', action);
    console.log('Payload:', action.payload);
    console.log('Previous State Snapshot:', prevState);
    console.log('Next State Snapshot:', nextState);
    console.groupEnd();
  }

  return result;
};
