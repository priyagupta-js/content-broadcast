import React, { memo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TEACHER_NAV = [
  { to: '/teacher',         icon: '⊞',  label: 'Dashboard' },
  { to: '/teacher/upload',  icon: '↑',  label: 'Upload Content' },
  { to: '/teacher/content', icon: '▤',  label: 'My Content' },
];

const PRINCIPAL_NAV = [
  { to: '/principal',          icon: '⊞', label: 'Dashboard' },
  { to: '/principal/approvals',icon: '✓', label: 'Pending Approvals' },
  { to: '/principal/content',  icon: '▤', label: 'All Content' },
];

const NavItem = memo(({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to.split('/').length === 2}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-brand-500/20 text-brand-400 border border-brand-500/25'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`
    }
  >
    <span className="text-base w-5 text-center">{icon}</span>
    <span>{label}</span>
  </NavLink>
));

export const Sidebar = memo(({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const nav = role === 'teacher' ? TEACHER_NAV : PRINCIPAL_NAV;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} glass border-r border-slate-800 flex flex-col transition-all duration-300 min-h-screen fixed left-0 top-0 z-30`}>
      {/* Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-sm shrink-0">EB</div>
        {!collapsed && (
          <div>
            <div className="font-bold text-sm text-slate-100">EduBroadcast</div>
            <div className="text-xs text-brand-400 capitalize">{role} Portal</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-slate-300 transition-colors text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/30 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-brand-300">
              {user?.avatar || user?.name?.[0]}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-200 truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <span>⎋</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
});

export const PageLayout = memo(({ role, children }) => (
  <div className="flex min-h-screen">
    <Sidebar role={role} />
    <main className="flex-1 ml-64 p-8 min-h-screen animate-fade-in">
      {children}
    </main>
  </div>
));
