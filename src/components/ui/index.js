import React, { memo, useEffect } from 'react';
import { getScheduleStatus } from '../../utils/helpers';

/* ── Spinner ─────────────────────────────────────────────── */
export const Spinner = memo(({ size = 'md', className = '' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size];
  return (
    <svg className={`animate-spin text-brand-400 ${s} ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
});

/* ── LoadingPage ─────────────────────────────────────────── */
export const LoadingPage = memo(() => (
  <div className="flex flex-col items-center justify-center h-64 gap-4 animate-fade-in">
    <Spinner size="lg" />
    <p className="text-slate-400 text-sm font-medium">Loading…</p>
  </div>
));

/* ── Skeleton loader ─────────────────────────────────────── */
export const Skeleton = memo(({ className = '' }) => (
  <div className={`skeleton ${className}`} />
));

export const SkeletonCard = memo(() => (
  <div className="card animate-pulse space-y-3">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-24 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
));

export const SkeletonRow = memo(() => (
  <tr>
    {[1,2,3,4,5].map(i => (
      <td key={i} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
    ))}
  </tr>
));

/* ── EmptyState ──────────────────────────────────────────── */
export const EmptyState = memo(({ icon = '📭', title = 'Nothing here yet', description = '' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
    <div className="text-5xl">{icon}</div>
    <h3 className="text-slate-300 font-semibold text-lg">{title}</h3>
    {description && <p className="text-slate-500 text-sm text-center max-w-xs">{description}</p>}
  </div>
));

/* ── ErrorState ──────────────────────────────────────────── */
export const ErrorState = memo(({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
    <div className="text-5xl">⚠️</div>
    <h3 className="text-slate-300 font-semibold text-lg">Something went wrong</h3>
    <p className="text-red-400 text-sm text-center max-w-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm">Try again</button>
    )}
  </div>
));

/* ── StatusBadge ─────────────────────────────────────────── */
export const StatusBadge = memo(({ status }) => {
  const map = {
    pending:  <span className="badge-pending">⏳ Pending</span>,
    approved: <span className="badge-approved">✓ Approved</span>,
    rejected: <span className="badge-rejected">✕ Rejected</span>,
  };
  return map[status] || <span className="badge-pending">{status}</span>;
});

/* ── ScheduleBadge ───────────────────────────────────────── */
export const ScheduleBadge = memo(({ startTime, endTime }) => {
  const s = getScheduleStatus(startTime, endTime);
  const map = {
    scheduled: <span className="badge-scheduled">🕐 Scheduled</span>,
    active:    <span className="badge-active animate-pulse-slow">● Live</span>,
    expired:   <span className="badge-expired">↩ Expired</span>,
  };
  return map[s] || null;
});

/* ── Modal ───────────────────────────────────────────────── */
export const Modal = memo(({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="font-semibold text-slate-100 text-lg">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 pb-6 flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
});

/* ── StatCard ────────────────────────────────────────────── */
export const StatCard = memo(({ label, value, icon, color = 'brand' }) => {
  const colors = {
    brand:   'from-brand-500/20 to-brand-600/5  border-brand-500/20  text-brand-400',
    amber:   'from-amber-500/20  to-amber-600/5   border-amber-500/20   text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    red:     'from-red-500/20    to-red-600/5     border-red-500/20     text-red-400',
    slate:   'from-slate-500/20  to-slate-600/5   border-slate-500/20   text-slate-400',
  };
  return (
    <div className={`stat-card bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-4xl font-bold ${colors[color].split(' ').pop()}`}>{value}</div>
    </div>
  );
});

/* ── ContentCard ─────────────────────────────────────────── */
export const ContentCard = memo(({ item, actions }) => (
  <div className="card hover:border-brand-500/20 transition-all duration-300 animate-fade-in flex flex-col gap-4">
    <div className="relative rounded-xl overflow-hidden bg-slate-900 h-40">
      <img
        src={item.fileUrl}
        alt={item.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div className="absolute top-2 right-2 flex gap-1">
        <StatusBadge status={item.status} />
      </div>
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-slate-100 text-base leading-snug mb-1 line-clamp-2">{item.title}</h3>
      <p className="text-xs text-brand-400 font-medium mb-2">{item.subject}</p>
      {item.description && <p className="text-slate-400 text-xs line-clamp-2">{item.description}</p>}
    </div>
    <div className="flex items-center justify-between text-xs text-slate-500">
      <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
    </div>
    {item.status === 'rejected' && item.rejectionReason && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300">
        <span className="font-semibold">Rejection reason: </span>{item.rejectionReason}
      </div>
    )}
    {actions && <div className="flex gap-2 pt-1">{actions}</div>}
  </div>
));
