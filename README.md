# 🎓 Student Management System (SMS Portal)

A modern, full-stack Student Management System built with React (Vite), Express.js, MongoDB, JWT authentication with Role-Based Access Control (RBAC), Tailwind CSS, and Chart.js.

---

## ✨ Features

- **🔐 Dual Authentication & RBAC**: Secure JWT-based login and registration supporting **Admin**, **Teacher**, and **Student** roles.
- **📊 Modern Admin Dashboard**: Live metrics for Total Students, Teachers, Courses, Attendance %, Fee Collections, and dynamic interactive Chart.js analytics.
- **👥 Student Management**: Complete CRUD, department/year/section filtering, search, live photo preview, and printable Campus Student ID card generator.
- **👨‍🏫 Faculty Management**: Teacher directory, department categorization, qualification tracking, and subject assignments.
- **📚 Course Management**: Curriculum manager, credit allocations, and instructor assignment.
- **📅 Daily Attendance Register**: Interactive daily attendance register with *Mark All Present*, monthly summary, and student history.
- **🏆 Marks & GPA Evaluation**: Automatic Grade & GPA (4.0 scale) computation from internal (50) and external (50) marks, with downloadable PDF result statements.
- **💰 Fee Collection**: Invoice generation, payment tracking, payment methods (Credit Card, Wire, UPI), and downloadable PDF fee receipts.
- **🗓️ Timetable Matrix**: Day-wise and slot-wise class schedule grid.
- **📢 Notice Board**: Announcement feed with target audience filters (All, Teachers, Students) and priority badges.
- **📁 Report Exporter**: Export Students, Attendance, Marks, and Fees reports to **PDF** and **Excel** (.xlsx).
- **🌗 Theme System**: Sleek Dark & Light mode toggle with persistent preferences.

---

## ⚡ Demo Login Credentials

The backend comes pre-seeded with ready-to-use demo accounts (also available via one-click pills on the Login screen):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | `password123` |
| **Teacher** | `teacher@school.com` | `password123` |
| **Student** | `student@school.com` | `password123` |

---

## 🚀 Quickstart & Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Install Backend Dependencies & Start Server
```bash
cd backend
npm install
npm run start
```
*The backend runs on `http://localhost:5000` and automatically connects to MongoDB (or uses the high-performance in-memory fallback if MongoDB is not running).*

To seed MongoDB with demo data manually:
```bash
npm run seed
```

### 2. Install Frontend Dependencies & Start Dev Server
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The Vite frontend dev server will launch at `http://localhost:3000`.*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Chart.js / react-chartjs-2, Axios, jsPDF, XLSX
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT, BcryptJS, ExcelJS, Multer
