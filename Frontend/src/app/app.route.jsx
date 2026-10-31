import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import TempDashboard from '../features/auth/components/TempDashboard';
import DepartmentsPage from '../features/Appointments/pages/DepartmentsPage';
import DoctorsPage from '../features/Appointments/pages/DoctorsPage';
import BookingPage from '../features/Appointments/pages/BookingPage';
import DoctorDashboard from '../features/Doctor/pages/DoctorDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TempDashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/doctor',
    element: <Navigate to="/doctor/dashboard" replace />,
  },
  {
    path: '/doctor/dashboard',
    element: <DoctorDashboard />,
  },
  {
    path: '/appointments',
    element: <DepartmentsPage />,
  },
  {
    path: '/appointments/departments/:departmentId/doctors',
    element: <DoctorsPage />,
  },
  {
    path: '/appointments/doctors/:doctorId/book',
    element: <BookingPage />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
