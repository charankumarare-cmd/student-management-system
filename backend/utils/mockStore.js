import bcrypt from 'bcryptjs';

export const mockData = {
  users: [
    {
      _id: 'usr_admin1',
      name: 'System Admin',
      email: 'admin@school.com',
      password: '',
      role: 'admin',
      phone: '+1 800-555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_admin2',
      name: 'Charan Admin',
      email: 'admin@charan.com',
      password: '',
      role: 'admin',
      phone: '+1 800-555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_teacher1',
      name: 'Dr. Robert Chen',
      email: 'teacher@school.com',
      password: '',
      role: 'teacher',
      phone: '+1 800-555-0210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_teacher2',
      name: 'Dr. Robert Chen',
      email: 'teacher@charan.com',
      password: '',
      role: 'teacher',
      phone: '+1 800-555-0210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_student1',
      name: 'Alex Johnson',
      email: 'student@school.com',
      password: '',
      role: 'student',
      phone: '+1 800-555-0344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_student2',
      name: 'Alex Johnson',
      email: 'student@charan.com',
      password: '',
      role: 'student',
      phone: '+1 800-555-0344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  students: [
    {
      _id: 'std_1',
      studentId: 'STU-2026-001',
      userId: 'usr_student1',
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
      _id: 'std_2',
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
      _id: 'std_3',
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
    },
    {
      _id: 'std_4',
      studentId: 'STU-2026-004',
      name: 'Emily Davis',
      email: 'emily.d@school.com',
      phone: '+1 800-555-0499',
      department: 'Mechanical Engineering',
      year: '4th Year',
      section: 'A',
      address: '789 Pine Rd, Star City',
      dob: '2002-11-05',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      guardianName: 'Sarah Davis',
      guardianPhone: '+1 800-555-4411'
    }
  ],
  teachers: [
    {
      _id: 'tch_1',
      teacherId: 'TCH-2026-001',
      userId: 'usr_teacher1',
      name: 'Dr. Robert Chen',
      email: 'teacher@school.com',
      phone: '+1 800-555-0210',
      department: 'Computer Science',
      qualification: 'Ph.D. in Computer Science (MIT)',
      subjects: ['Data Structures', 'Web Development', 'Artificial Intelligence'],
      designation: 'Professor & HOD'
    },
    {
      _id: 'tch_2',
      teacherId: 'TCH-2026-002',
      name: 'Prof. Amanda Miller',
      email: 'amanda.m@school.com',
      phone: '+1 800-555-0255',
      department: 'Electrical Engineering',
      qualification: 'M.Tech in VLSI Design',
      subjects: ['Circuit Theory', 'Digital Signal Processing'],
      designation: 'Associate Professor'
    }
  ],
  courses: [
    {
      _id: 'crs_1',
      courseCode: 'CS301',
      courseName: 'Data Structures & Algorithms',
      department: 'Computer Science',
      credits: 4,
      semester: '3rd Semester',
      assignedTeacherName: 'Dr. Robert Chen',
      description: 'Fundamental data structures, sorting algorithms, dynamic programming, and complexity analysis.'
    },
    {
      _id: 'crs_2',
      courseCode: 'CS302',
      courseName: 'Full Stack Web Engineering',
      department: 'Computer Science',
      credits: 3,
      semester: '5th Semester',
      assignedTeacherName: 'Dr. Robert Chen',
      description: 'Modern MERN stack development, RESTful APIs, JWT Auth, React UI architecture.'
    },
    {
      _id: 'crs_3',
      courseCode: 'EE201',
      courseName: 'Digital Electronics & Logic Circuits',
      department: 'Electrical Engineering',
      credits: 4,
      semester: '2nd Semester',
      assignedTeacherName: 'Prof. Amanda Miller',
      description: 'Boolean algebra, logic gates, combinational and sequential circuit design.'
    }
  ],
  attendance: [
    { _id: 'att_1', studentId: 'STU-2026-001', studentName: 'Alex Johnson', courseCode: 'CS301', date: '2026-07-29', status: 'Present', markedBy: 'Dr. Robert Chen' },
    { _id: 'att_2', studentId: 'STU-2026-002', studentName: 'Sophia Martinez', courseCode: 'CS301', date: '2026-07-29', status: 'Present', markedBy: 'Dr. Robert Chen' },
    { _id: 'att_3', studentId: 'STU-2026-003', studentName: 'Ethan Smith', courseCode: 'EE201', date: '2026-07-29', status: 'Absent', markedBy: 'Prof. Amanda Miller' },
    { _id: 'att_4', studentId: 'STU-2026-004', studentName: 'Emily Davis', courseCode: 'CS302', date: '2026-07-29', status: 'Present', markedBy: 'Dr. Robert Chen' }
  ],
  marks: [
    { _id: 'mrk_1', studentId: 'STU-2026-001', studentName: 'Alex Johnson', subject: 'Data Structures & Algorithms', courseCode: 'CS301', semester: '3rd Semester', internalMarks: 48, externalMarks: 45, total: 93, grade: 'A+', gpa: 4.0 },
    { _id: 'mrk_2', studentId: 'STU-2026-001', studentName: 'Alex Johnson', subject: 'Full Stack Web Engineering', courseCode: 'CS302', semester: '5th Semester', internalMarks: 45, externalMarks: 42, total: 87, grade: 'A', gpa: 3.8 },
    { _id: 'mrk_3', studentId: 'STU-2026-002', studentName: 'Sophia Martinez', subject: 'Data Structures & Algorithms', courseCode: 'CS301', semester: '3rd Semester', internalMarks: 42, externalMarks: 40, total: 82, grade: 'A-', gpa: 3.5 },
    { _id: 'mrk_4', studentId: 'STU-2026-003', studentName: 'Ethan Smith', subject: 'Digital Electronics & Logic Circuits', courseCode: 'EE201', semester: '2nd Semester', internalMarks: 35, externalMarks: 38, total: 73, grade: 'B', gpa: 3.0 }
  ],
  fees: [
    { _id: 'fee_1', studentId: 'STU-2026-001', studentName: 'Alex Johnson', department: 'Computer Science', title: 'Tuition Fee - Fall 2026', amount: 2500, paidAmount: 2500, dueDate: '2026-08-15', paymentDate: '2026-07-10', status: 'Paid', paymentMethod: 'Credit Card', transactionId: 'TXN-987654' },
    { _id: 'fee_2', studentId: 'STU-2026-002', studentName: 'Sophia Martinez', department: 'Computer Science', title: 'Tuition Fee - Fall 2026', amount: 2500, paidAmount: 1500, dueDate: '2026-08-15', paymentDate: '2026-07-20', status: 'Partial', paymentMethod: 'Bank Transfer', transactionId: 'TXN-987655' },
    { _id: 'fee_3', studentId: 'STU-2026-003', studentName: 'Ethan Smith', department: 'Electrical Engineering', title: 'Tuition Fee - Fall 2026', amount: 2400, paidAmount: 0, dueDate: '2026-08-20', paymentDate: '', status: 'Pending', paymentMethod: '', transactionId: '' },
    { _id: 'fee_4', studentId: 'STU-2026-004', studentName: 'Emily Davis', department: 'Mechanical Engineering', title: 'Laboratory & Library Fee', amount: 650, paidAmount: 650, dueDate: '2026-08-01', paymentDate: '2026-07-05', status: 'Paid', paymentMethod: 'UPI', transactionId: 'TXN-987656' }
  ],
  notices: [
    { _id: 'ntc_1', title: 'Mid-Semester Examination Schedule Announced', description: 'The official schedule for the Fall 2026 Mid-Semester Examinations has been published. Exams commence on August 20th.', targetAudience: 'All', author: 'Academic Office', date: '2026-07-28', priority: 'High' },
    { _id: 'ntc_2', title: 'Annual Tech Symposium - CodeForge 2026', description: 'Register now for the 48-hour Hackathon and Technical Project Exhibition organized by the Computer Science Dept.', targetAudience: 'Students', author: 'Dr. Robert Chen', date: '2026-07-25', priority: 'Medium' },
    { _id: 'ntc_3', title: 'Faculty Development Workshop on AI in Education', description: 'Mandatory workshop for all faculty members on integrating modern AI tools into curriculum design.', targetAudience: 'Teachers', author: 'Principal Office', date: '2026-07-20', priority: 'Low' }
  ],
  activityLogs: [
    { _id: 'act_1', action: 'User Login', performedBy: 'admin@school.com', role: 'admin', details: 'Admin logged into portal', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { _id: 'act_2', action: 'Attendance Marked', performedBy: 'teacher@school.com', role: 'teacher', details: 'Marked daily attendance for Course CS301', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { _id: 'act_3', action: 'Fee Payment Recorded', performedBy: 'admin@school.com', role: 'admin', details: 'Recorded payment of $2500 for STU-2026-001', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]
};

// Initialize pre-hashed passwords for mock users
(async () => {
  const hashDefault = await bcrypt.hash('password123', 10);
  const hashAdminCharan = await bcrypt.hash('Admin@123', 10);
  const hashTeacherCharan = await bcrypt.hash('Teacher@123', 10);
  const hashStudentCharan = await bcrypt.hash('Student@123', 10);

  mockData.users.forEach((u) => {
    if (u.email === 'admin@charan.com') u.password = hashAdminCharan;
    else if (u.email === 'teacher@charan.com') u.password = hashTeacherCharan;
    else if (u.email === 'student@charan.com') u.password = hashStudentCharan;
    else u.password = hashDefault;
  });
})();
