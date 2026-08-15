import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/HomePage';
import Properties from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import Favorites from './pages/FavoritesPage';
import Compare from './pages/ComparePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/DashboardPage';
import Analytics from './pages/AnalyticsPage';
import Predict from './pages/PredictPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

// Components
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  
  if (adminOnly && user.email !== 'admin@gmail.com') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

// Public only (redirect if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Default = Login */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <PageTransition><Login /></PageTransition>
          </PublicOnlyRoute>
        } />
        <Route path="/register" element={
          <PublicOnlyRoute>
            <PageTransition><Register /></PageTransition>
          </PublicOnlyRoute>
        } />

        {/* After login */}
        <Route path="/" element={
          <ProtectedRoute>
            <PageTransition><Home /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/properties" element={
          <ProtectedRoute>
            <PageTransition><Properties /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/property/:id" element={
          <ProtectedRoute>
            <PageTransition><PropertyDetailsPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <PageTransition><Favorites /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute>
            <PageTransition><Compare /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <PageTransition><Analytics /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/predict" element={
          <ProtectedRoute>
            <PageTransition><Predict /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <PageTransition><ChatPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><ProfilePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <PageTransition><AdminPage /></PageTransition>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#fff',
                borderRadius: '10px',
              },
            }}
          />
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 70px)' }}>
            <AnimatedRoutes />
          </main>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;