import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, UserPlus, Save } from 'lucide-react';
import { addStudent, updateStudent } from '../../features/students/studentsSlice';
import { playSuccessChime, playTactileClick } from '../../utils/audioEffects';

export default function StudentFormModal({ isOpen, onClose, studentToEdit }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: 'Computer Science',
    semester: 'Sem 5',
    section: 'A',
    rollNo: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        id: studentToEdit.id || '',
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        department: studentToEdit.department || 'Computer Science',
        semester: studentToEdit.semester || 'Sem 5',
        section: studentToEdit.section || 'A',
        rollNo: studentToEdit.rollNo || '',
      });
    } else {
      const randNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        id: `CS2024-${randNum}`,
        name: '',
        email: '',
        department: 'Computer Science',
        semester: 'Sem 5',
        section: 'A',
        rollNo: String(randNum % 50 + 1).padStart(2, '0'),
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Student Name is required';
    if (!formData.id.trim()) errs.id = 'Student ID is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    playSuccessChime();
    if (studentToEdit) {
      dispatch(updateStudent(formData));
    } else {
      dispatch(addStudent(formData));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 border border-slate-200/90 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {studentToEdit ? 'Edit Academic Profile' : 'Enroll New Student'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {studentToEdit ? `Updating ${studentToEdit.id}` : 'Add student to ERP institutional roster'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student ID *
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={Boolean(studentToEdit)}
                placeholder="e.g. CS2024-120"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 shadow-2xs"
              />
              {errors.id && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.id}</p>}
            </div>

            {/* Roll No */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g. 18"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Siddharth Sharma"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.name}</p>}
          </div>

          {/* Institutional Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Institutional Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. s.sharma@institution.edu"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs"
            />
            {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-0.5">{errors.email}</p>}
          </div>

          {/* Academic Placement (Dept, Sem, Section) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="Sem 3">Sem 3</option>
                <option value="Sem 5">Sem 5</option>
                <option value="Sem 7">Sem 7</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold spring-btn transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 spring-btn transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{studentToEdit ? 'Save Changes' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
