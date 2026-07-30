import Mark from '../models/Mark.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

const calculateGradeAndGPA = (total) => {
  if (total >= 90) return { grade: 'A+', gpa: 4.0 };
  if (total >= 80) return { grade: 'A', gpa: 3.7 };
  if (total >= 75) return { grade: 'B+', gpa: 3.3 };
  if (total >= 70) return { grade: 'B', gpa: 3.0 };
  if (total >= 60) return { grade: 'C', gpa: 2.0 };
  if (total >= 50) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
};

export const getMarks = async (req, res) => {
  try {
    const { studentId, subject, semester } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.marks];
      if (studentId) filtered = filtered.filter(m => m.studentId === studentId);
      if (subject) filtered = filtered.filter(m => m.subject === subject);
      if (semester) filtered = filtered.filter(m => m.semester === semester);
      return res.json(filtered);
    }

    let query = {};
    if (studentId) query.studentId = studentId;
    if (subject) query.subject = subject;
    if (semester) query.semester = semester;

    const marks = await Mark.find(query);
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addOrUpdateMarks = async (req, res) => {
  try {
    const { studentId, studentName, subject, courseCode, semester, internalMarks, externalMarks } = req.body;

    const intVal = Number(internalMarks) || 0;
    const extVal = Number(externalMarks) || 0;
    const total = intVal + extVal;
    const { grade, gpa } = calculateGradeAndGPA(total);

    if (getIsInMemory()) {
      const idx = mockData.marks.findIndex(
        m => m.studentId === studentId && m.subject === subject && m.semester === semester
      );
      if (idx !== -1) {
        mockData.marks[idx] = {
          ...mockData.marks[idx],
          internalMarks: intVal,
          externalMarks: extVal,
          total,
          grade,
          gpa
        };
        return res.json(mockData.marks[idx]);
      } else {
        const newMark = {
          _id: 'mrk_' + Date.now(),
          studentId,
          studentName: studentName || 'Student',
          subject,
          courseCode: courseCode || '',
          semester: semester || '1st Semester',
          internalMarks: intVal,
          externalMarks: extVal,
          total,
          grade,
          gpa
        };
        mockData.marks.push(newMark);
        return res.status(201).json(newMark);
      }
    }

    const mark = await Mark.findOneAndUpdate(
      { studentId, subject, semester },
      {
        studentId,
        studentName,
        subject,
        courseCode,
        semester,
        internalMarks: intVal,
        externalMarks: extVal,
        total,
        grade,
        gpa
      },
      { upsert: true, new: true }
    );

    res.json(mark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    let marksList = [];
    if (getIsInMemory()) {
      marksList = mockData.marks.filter(m => m.studentId === studentId);
    } else {
      marksList = await Mark.find({ studentId });
    }

    const totalGPA = marksList.reduce((acc, m) => acc + (m.gpa || 0), 0);
    const avgGPA = marksList.length > 0 ? (totalGPA / marksList.length).toFixed(2) : '0.00';

    res.json({
      studentId,
      cgpa: avgGPA,
      marks: marksList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
