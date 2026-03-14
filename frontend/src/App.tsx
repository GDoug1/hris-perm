import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Schedule from './pages/Schedule';
import MainDashboard from './pages/MainDashboard';
import CoachDashboard from './pages/CoachDashboard';
import Attendance from './pages/Attendance';
import ProtectedRoute from './routes/ProtectedRoute';
import EmployeeList from './pages/EmployeeList';
import ControlPanel from './pages/ControlPanel';

function App() {

  useEffect(() => {

    const interval = setInterval(() => {

      fetch("http://localhost/hris/backend/auth/refresh_permissions.php", {
        credentials: "include"
      }).catch(() => {});

    }, 5000); // every 5 seconds

    return () => clearInterval(interval);

  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/MainDashboard"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <CoachDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ControlPanel"
        element={
          <ProtectedRoute requiredPermission="Access Control Panel">
            <ControlPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-list"
        element={
          <ProtectedRoute requiredPermission="View Employee List">
            <EmployeeList />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;