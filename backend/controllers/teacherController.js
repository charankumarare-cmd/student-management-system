import Teacher from '../models/Teacher.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getTeachers = async (req, res) => {
  try {
    const { department, search } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.teachers];
      if (department) filtered = filtered.filter(t => t.department === department);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.teacherId.toLowerCase().includes(q)
        );
      }
      return res.json(filtered);
    }

    let query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { teacherId: { $regex: search, $options: 'i' } }
      ];
    }
    const teachers = await Teacher.find(query);
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const teacher = mockData.teachers.find(t => t._id === req.params.id || t.teacherId === req.params.id);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
      return res.json(teacher);
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, department, qualification, subjects, designation } = req.body;
    const teacherId = `TCH-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (getIsInMemory()) {
      const newTeacher = {
        _id: 'tch_' + Date.now(),
        teacherId,
        name,
        email,
        phone,
        department,
        qualification: qualification || '',
        subjects: Array.isArray(subjects) ? subjects : subjects ? subjects.split(',').map(s => s.trim()) : [],
        designation: designation || 'Assistant Professor'
      };
      mockData.teachers.push(newTeacher);
      return res.status(201).json(newTeacher);
    }

    const teacher = await Teacher.create({
      teacherId,
      name,
      email,
      phone,
      department,
      qualification,
      subjects: Array.isArray(subjects) ? subjects : subjects ? subjects.split(',').map(s => s.trim()) : [],
      designation
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const index = mockData.teachers.findIndex(t => t._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Teacher not found' });

      mockData.teachers[index] = { ...mockData.teachers[index], ...req.body };
      return res.json(mockData.teachers[index]);
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    Object.assign(teacher, req.body);
    await teacher.save();
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    if (getIsInMemory()) {
      mockData.teachers = mockData.teachers.filter(t => t._id !== req.params.id);
      return res.json({ message: 'Teacher deleted successfully' });
    }

    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
