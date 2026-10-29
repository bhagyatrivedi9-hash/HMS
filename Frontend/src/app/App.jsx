import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './app.route';
import { useAuth } from '../features/auth/hook/useAuth';
import { useEffect } from 'react';

export default function App() {

  const {handleGetMe}= useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);
  return <RouterProvider router={router} />;
}
