Employee Attendance System

A MERN-based attendance tracking system with Employee & Manager roles.
Employees can mark attendance; Managers can view, filter, and export reports.

🛠 Tech Stack

Frontend: React, Redux Toolkit / Zustand

Backend: Node.js, Express

Database: MongoDB / PostgreSQL

🎯 Features
👤 Employee

Register/Login

Check-In / Check-Out

Attendance history (calendar + table)

Monthly summary

Dashboard stats

👨‍💼 Manager

View all employees

Filter by date/employee/status

Team summary

Export CSV

Dashboard charts & stats

📄 Pages
Employee

Login • Register • Dashboard • Mark Attendance • Attendance History • Profile

Manager

Login • Dashboard • All Attendance • Team Calendar • Reports

🗄 Database Schema
Users

id, name, email, password, role, employeeId, department, createdAt

Attendance

id, userId, date, checkInTime, checkOutTime, status, totalHours, createdAt

🔥 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Employee
POST /api/attendance/checkin
POST /api/attendance/checkout
GET  /api/attendance/my-history
GET  /api/attendance/my-summary
GET  /api/attendance/today

Manager
GET /api/attendance/all
GET /api/attendance/employee/:id
GET /api/attendance/summary
GET /api/attendance/export
GET /api/attendance/today-status

⚙️ Setup
Clone
git clone <repo-url>

Backend
cd backend
npm install
npm start

Frontend
cd frontend
npm install
npm run dev

🔑 Environment Variables
Backend .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/att
JWT_SECRET=repae6e9b8e6c32199be7394ee4095dc2673677f0a8a7268f9ce78130a391ad1ab2f89b7998b195b0d0fc578bc337bfd383222eab9047f991729b83125b904b3876lace_with_strong_secret

Frontend .env
VITE_API_BASE_URL=http://localhost:5002/api

