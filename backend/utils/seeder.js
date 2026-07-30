import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Fee from '../models/Fee.js';
import Notice from '../models/Notice.js';
import ActivityLog from '../models/ActivityLog.js';
import { mockData } from './mockStore.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sms_portal';
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 3000 });
    console.log('[Seeder] Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Course.deleteMany();
    await Attendance.deleteMany();
    await Mark.deleteMany();
    await Fee.deleteMany();
    await Notice.deleteMany();
    await ActivityLog.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@school.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1 800-555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'active'
    });

    const teacherUser = await User.create({
      name: 'Dr. Robert Chen',
      email: 'teacher@school.com',
      password: hashedPassword,
      role: 'teacher',
      phone: '+1 800-555-0210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active'
    });

    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@school.com',
      password: hashedPassword,
      role: 'student',
      phone: '+1 800-555-0344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'active'
    });

    await Student.create([
      {
        studentId: 'STU-2026-001',
        userId: studentUser._id,
        name: 'Alex Johnson',
        email: 'student@school.com',
        phone: '+1 800-555-0344',
        department: 'Computer Science',
        year: '3rd Year',
        section: 'A',
        address: '742 Evergreen Terrace, Springfield',
        dob: '2003-05-14',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        guardianName: 'Mark Johnson',
        guardianPhone: '+1 800-555-9988'
      },
      {
        studentId: 'STU-2026-002',
        name: 'Sophia Martinez',
        email: 'sophia.m@school.com',
        phone: '+1 800-555-0389',
        department: 'Computer Science',
        year: '3rd Year',
        section: 'A',
        address: '100 Main St, Metropolis',
        dob: '2003-08-22',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        guardianName: 'Elena Martinez',
        guardianPhone: '+1 800-555-7766'
      },
      {
        studentId: 'STU-2026-003',
        name: 'Ethan Smith',
        email: 'ethan.s@school.com',
        phone: '+1 800-555-0412',
        department: 'Electrical Engineering',
        year: '2nd Year',
        section: 'B',
        address: '456 Oak Avenue, Gotham',
        dob: '2004-01-10',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        guardianName: 'David Smith',
        guardianPhone: '+1 800-555-3322'
      }
    ]);

    await Teacher.create([
      {
        teacherId: 'TCH-2026-001',
        userId: teacherUser._id,
        name: 'Dr. Robert Chen',
        email: 'teacher@school.com',
        phone: '+1 800-555-0210',
        department: 'Computer Science',
        qualification: 'Ph.D. in Computer Science (MIT)',
        subjects: ['Data Structures', 'Web Development'],
        designation: 'Professor & HOD'
      }
    ]);

    await Course.create([
      {
        courseCode: 'CS301',
        courseName: 'Data Structures & Algorithms',
        department: 'Computer Science',
        credits: 4,
        semester: '3rd Semester',
        assignedTeacherName: 'Dr. Robert Chen',
        description: 'Fundamental data structures and sorting algorithms.'
      },
      {
        courseCode: 'CS302',
        courseName: 'Full Stack Web Engineering',
        department: 'Computer Science',
        credits: 3,
        semester: '5th Semester',
        assignedTeacherName: 'Dr. Robert Chen',
        description: 'Modern full stack software architecture and web development.'
      }
    ]);

    await Attendance.create(mockData.attendance);
    await Mark.create(mockData.marks);
    await Fee.create(mockData.fees);
    await Notice.create(mockData.notices);
    await ActivityLog.create(mockData.activityLogs);

    console.log('[Seeder] Database populated successfully with demo data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error.message);
    process.exit(1);
  }
};

if (process.argv[1]?.endsWith('seeder.js')) {
  seedDatabase();
}
