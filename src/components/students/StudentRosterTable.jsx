import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Edit3, 
  Trash2, 
  Mail, 
} from 'lucide-react';
import { deleteStudent } from '../../features/students/studentsSlice';
import { selectFilteredRoster } from '../../features/students/studentsSelectors';
import StudentFormModal from './StudentFormModal';
import RosterFilterBar from './RosterFilterBar';
import { playTactileClick, playWarningTone } from '../../utils/audioEffects';

export default function StudentRosterTable() {
  const dispatch = useDispatch();
  const students = useSelector(selectFilteredRoster);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    playTactileClick();
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDelete = (studentId) => {
    playWarningTone();
    dispatch(deleteStudent(studentId));
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <RosterFilterBar 
        onOpenAddModal={handleOpenAdd} 
        totalFiltered={students.length} 
      />

      {/* Roster Table Card */}
      <div className="white-glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Class Placement</th>
                <th className="py-3.5 px-4">Contact Email</th>
                <th className="py-3.5 px-4 text-right">Roster Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No students match your query</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try broadening your search term or department filters.
                    </p>
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  return (
                    <tr key={student.id} className="hover:bg-indigo-50/20 transition-colors">
                      {/* Roll */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {student.rollNo || String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* Student Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{student.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                                {student.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                          {student.department}
                        </span>
                      </td>

                      {/* Semester / Section */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-bold">
                          {student.semester}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Section {student.section}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.email}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 spring-btn transition shadow-2xs"
                            title="Edit Student Profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === student.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(student.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                playTactileClick();
                                setDeleteConfirmId(student.id);
                              }}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 spring-btn transition shadow-2xs"
                              title="Delete Student from Roster"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Form Modal */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={studentToEdit}
      />
    </div>
  );
}
