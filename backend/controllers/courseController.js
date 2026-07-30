import Course from '../models/Course.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getCourses = async (req, res) => {
  try {
    const { department, search } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.courses];
      if (department) filtered = filtered.filter(c => c.department === department);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c => 
          c.courseCode.toLowerCase().includes(q) ||
          c.courseName.toLowerCase().includes(q)
        );
      }
      return res.json(filtered);
    }

    let query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { courseCode: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }
    const courses = await Course.find(query);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const course = mockData.courses.find(c => c._id === req.params.id || c.courseCode === req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.json(course);
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, department, credits, semester, assignedTeacherName, description } = req.body;

    if (getIsInMemory()) {
      const newCourse = {
        _id: 'crs_' + Date.now(),
        courseCode,
        courseName,
        department,
        credits: Number(credits) || 3,
        semester: semester || '1st Semester',
        assignedTeacherName: assignedTeacherName || 'Unassigned',
        description: description || ''
      };
      mockData.courses.push(newCourse);
      return res.status(201).json(newCourse);
    }

    const course = await Course.create({
      courseCode,
      courseName,
      department,
      credits,
      semester,
      assignedTeacherName,
      description
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const index = mockData.courses.findIndex(c => c._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Course not found' });

      mockData.courses[index] = { ...mockData.courses[index], ...req.body };
      return res.json(mockData.courses[index]);
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (getIsInMemory()) {
      mockData.courses = mockData.courses.filter(c => c._id !== req.params.id);
      return res.json({ message: 'Course deleted successfully' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
