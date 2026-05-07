import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoadingPage } from './components/ui';

// Lazy-loaded pages
const LoginPage           = lazy(() => import('./pages/LoginPage'));
const TeacherDashboard    = lazy(() => import('./pages/teacher/TeacherDashboard'));
const UploadContent       = lazy(() => import('./pages/teacher/UploadContent'));
const MyContent           = lazy(() => import('./pages/teacher/MyContent'));
const PrincipalDashboard  = lazy(() => import('./pages/principal/PrincipalDashboard'));
const PendingApprovals    = lazy(() => import('./pages/principal/PendingApprovals'));
const AllContent          = lazy(() => import('./pages/principal/AllContent'));
const LivePage            = lazy(() => import('./pages/LivePage'));
const NotFoundPage        = lazy(() => import('./pages/NotFoundPage'));

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'teacher' ? '/teacher' : '/principal'} replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingPage /></div>}>
      <Routes>
        {/* Public */}
        <Route path="/"            element={<RootRedirect />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/live/:teacherId" element={<LivePage />} />

        {/* Teacher routes */}
        <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/upload"  element={<ProtectedRoute requiredRole="teacher"><UploadContent /></ProtectedRoute>} />
        <Route path="/teacher/content" element={<ProtectedRoute requiredRole="teacher"><MyContent /></ProtectedRoute>} />

        {/* Principal routes */}
        <Route path="/principal" element={<ProtectedRoute requiredRole="principal"><PrincipalDashboard /></ProtectedRoute>} />
        <Route path="/principal/approvals" element={<ProtectedRoute requiredRole="principal"><PendingApprovals /></ProtectedRoute>} />
        <Route path="/principal/content"   element={<ProtectedRoute requiredRole="principal"><AllContent /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141c2e',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#141c2e' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#141c2e' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
