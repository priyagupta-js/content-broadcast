import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { user } = useAuth();
  const home = user?.role === 'teacher' ? '/teacher' : user?.role === 'principal' ? '/principal' : '/login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="text-8xl font-bold text-slate-800">404</div>
      <div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm">The page you're looking for doesn't exist or was moved.</p>
      </div>
      <Link to={home} className="btn-primary">← Go Home</Link>
    </div>
  );
}
