import Student from '../models/Student.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getStudents = async (req, res) => {
  try {
    const { department, year, section, search } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.students];
      if (department) filtered = filtered.filter(s => s.department === department);
      if (year) filtered = filtered.filter(s => s.year === year);
      if (section) filtered = filtered.filter(s => s.section === section);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }
      return res.json(filtered);
    }

    let query = {};
    if (department) query.department = department;
    if (year) query.year = year;
    if (section) query.section = section;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const student = mockData.students.find(s => s._id === req.params.id || s.studentId === req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      return res.json(student);
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, department, year, section, address, dob, photo, guardianName, guardianPhone } = req.body;
    const studentId = `STU-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (getIsInMemory()) {
      const newStudent = {
        _id: 'std_' + Date.now(),
        studentId,
        name,
        email,
        phone,
        department,
        year,
        section,
        address: address || '',
        dob: dob || '',
        photo: photo || req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        guardianName: guardianName || '',
        guardianPhone: guardianPhone || ''
      };
      mockData.students.push(newStudent);
      return res.status(201).json(newStudent);
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : photo || '';
    const student = await Student.create({
      studentId,
      name,
      email,
      phone,
      department,
      year,
      section,
      address,
      dob,
      photo: photoUrl,
      guardianName,
      guardianPhone
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const index = mockData.students.findIndex(s => s._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Student not found' });
      
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo;
      mockData.students[index] = { ...mockData.students[index], ...req.body };
      if (photoUrl) mockData.students[index].photo = photoUrl;
      
      return res.json(mockData.students[index]);
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (req.file) req.body.photo = `/uploads/${req.file.filename}`;
    Object.assign(student, req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    if (getIsInMemory()) {
      mockData.students = mockData.students.filter(s => s._id !== req.params.id);
      return res.json({ message: 'Student deleted successfully' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
