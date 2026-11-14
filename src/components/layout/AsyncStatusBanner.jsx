import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { 
  selectAttendanceSaveStatus, 
  selectAttendanceError,
  selectAttendanceLastSyncedAt 
} from '../../features/attendance/attendanceSelectors';
import { saveAttendanceBatch } from '../../features/attendance/attendanceSlice';
import { selectClassContext } from '../../features/filters/filtersSlice';

export default function AsyncStatusBanner() {
  const dispatch = useDispatch();
  const saveStatus = useSelector(selectAttendanceSaveStatus);
  const saveError = useSelector(selectAttendanceError);
  const lastSyncedAt = useSelector(selectAttendanceLastSyncedAt);
  const classContext = useSelector(selectClassContext);

  if (saveStatus === 'idle' || !saveStatus) {
    return null;
  }

  const handleRetry = () => {
    dispatch(saveAttendanceBatch({
      date: classContext.activeDate,
      subjectId: classContext.activeSubjectId,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-3">
      {saveStatus === 'pending' && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-xs sm:text-sm shadow-sm animate-pulse">
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="font-medium">Asynchronous dispatch in progress: Persisting marked session batch to backend...</span>
          </div>
        </div>
      )}

      {saveStatus === 'fulfilled' && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/95 border border-emerald-200 text-emerald-900 text-xs sm:text-sm shadow-sm transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong className="font-bold text-emerald-800">Success:</strong> Attendance batch persisted & synced. Timestamp: {new Date(lastSyncedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {saveStatus === 'rejected' && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>
              <strong>Error:</strong> {saveError || 'Sync failed.'}
            </span>
          </div>
          <button
            onClick={handleRetry}
            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition"
          >
            Retry Batch
          </button>
        </div>
      )}
    </div>
  );
}
