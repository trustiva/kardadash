import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import KardashLanding from './components/kardash-landing';
import KardashDashboard from './components/kardash-dashboard';
import AdminPanel from './components/kardash-admin-panel';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

interface User {
  id: string;
  email: string;
  role: 'freelancer' | 'admin';
  name: string;
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'freelancer' | 'admin' | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUserRole(userData.role);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    
    if (userRole && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<KardashLanding />} />
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />
            ) : (
              <Login 
                setIsLoggedIn={setIsLoggedIn} 
                setUserRole={setUserRole} 
                setUser={setUser}
                isDarkMode={isDarkMode} 
              />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            isLoggedIn ? (
              <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />
            ) : (
              <Signup 
                isDarkMode={isDarkMode} 
                setIsLoggedIn={setIsLoggedIn}
                setUserRole={setUserRole}
                setUser={setUser}
              />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute allowedRoles={['freelancer', 'admin']}>
              <KardashDashboard 
                user={user}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPanel 
                user={user}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </PrivateRoute>
          } 
        />
        {/* Add a 404 Not Found page later */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App; 