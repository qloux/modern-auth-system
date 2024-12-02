import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import AISuggestions from './components/AISuggestions';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import AuthTransition from './components/AuthTransition';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import GitHubProfile from './components/GitHubProfile';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <div className="app">
          <GitHubProfile />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={
              <AuthTransition>
                <Login />
              </AuthTransition>
            } />
            <Route path="/register" element={
              <AuthTransition>
                <Register />
              </AuthTransition>
            } />
            <Route path="/forgot-password" element={
              <AuthTransition>
                <ForgotPassword />
              </AuthTransition>
            } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={
                    <>
                      <Navbar />
                      <TaskList />
                    </>
                  }
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={
                    <>
                      <Navbar />
                      <Profile />
                    </>
                  }
                />
              }
            />
            <Route
              path="/ai-suggestions"
              element={
                <ProtectedRoute
                  element={
                    <>
                      <Navbar />
                      <AISuggestions />
                    </>
                  }
                />
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
