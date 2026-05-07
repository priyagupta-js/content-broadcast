import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { useAsync } from '../../hooks/useAsync';
import { PageLayout } from '../../components/layout/Sidebar';
import { StatCard, ErrorState, EmptyState, StatusBadge, SkeletonCard } from '../../components/ui';
import { formatDate } from '../../utils/helpers';

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const fetchFn = useCallback(() => contentService.getAllContent(), []);
  const { data: items, loading, error, refetch } = useAsync(fetchFn);

  const stats = {
    total:    items?.length ?? 0,
    pending:  items?.filter(c => c.status === 'pending').length  ?? 0,
    approved: items?.filter(c => c.status === 'approved').length ?? 0,
    rejected: items?.filter(c => c.status === 'rejected').length ?? 0,
  };

  const pending = items?.filter(c => c.status === 'pending').slice(0, 5) ?? [];

  return (
    <PageLayout role="principal">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Welcome, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review and manage content submissions from teachers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Content"  value={loading ? '—' : stats.total}    icon="📚" color="brand" />
          <StatCard label="Pending Review" value={loading ? '—' : stats.pending}  icon="⏳" color="amber" />
          <StatCard label="Approved"       value={loading ? '—' : stats.approved} icon="✅" color="emerald" />
          <StatCard label="Rejected"       value={loading ? '—' : stats.rejected} icon="❌" color="red" />
        </div>

        {/* Pending approvals preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Awaiting Approval</h2>
              {stats.pending > 0 && (
                <p className="text-amber-400 text-xs mt-0.5">{stats.pending} item{stats.pending !== 1 ? 's' : ''} need your review</p>
              )}
            </div>
            <Link to="/principal/approvals" className="btn-primary text-sm py-2">Review All →</Link>
          </div>

          {error && <ErrorState message={error} onRetry={refetch} />}

          {loading && (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="card p-4 animate-pulse flex gap-4">
                  <div className="w-16 h-12 rounded-lg bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && pending.length === 0 && (
            <EmptyState icon="🎉" title="All caught up!" description="No content is pending approval right now." />
          )}

          {!loading && !error && pending.length > 0 && (
            <div className="card overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Teacher</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Submitted</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pending.map(item => (
                    <tr key={item.id} className="table-row">
                      <td className="px-5 py-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800">
                          <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy"
                            onError={e => { e.target.style.display='none'; }} />
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-200 max-w-xs truncate">{item.title}</td>
                      <td className="px-5 py-3 text-slate-400">{item.teacherName}</td>
                      <td className="px-5 py-3 text-slate-400">{item.subject}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3">
                        <Link to="/principal/approvals" className="text-brand-400 hover:text-brand-300 text-xs font-medium">Review →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
