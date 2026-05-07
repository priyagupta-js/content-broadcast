import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { useAsync } from '../../hooks/useAsync';
import { PageLayout } from '../../components/layout/Sidebar';
import {
  StatCard, ContentCard, LoadingPage, ErrorState, EmptyState, SkeletonCard
} from '../../components/ui';
import { formatDate } from '../../utils/helpers';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const fetchFn  = useCallback(() => contentService.getTeacherContent(user.id), [user.id]);
  const { data: items, loading, error, refetch } = useAsync(fetchFn);

  const stats = {
    total:    items?.length ?? 0,
    pending:  items?.filter(c => c.status === 'pending').length  ?? 0,
    approved: items?.filter(c => c.status === 'approved').length ?? 0,
    rejected: items?.filter(c => c.status === 'rejected').length ?? 0,
  };

  const recent = items?.slice(0, 3) ?? [];

  return (
    <PageLayout role="teacher">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Good {getGreeting()}, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">Here's an overview of your content activity</p>
          </div>
          <Link to="/teacher/upload" className="btn-primary">
            <span>↑</span> Upload Content
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Uploaded" value={loading ? '—' : stats.total}    icon="📁" color="brand" />
          <StatCard label="Pending"         value={loading ? '—' : stats.pending}  icon="⏳" color="amber" />
          <StatCard label="Approved"        value={loading ? '—' : stats.approved} icon="✅" color="emerald" />
          <StatCard label="Rejected"        value={loading ? '—' : stats.rejected} icon="❌" color="red" />
        </div>

        {/* Recent content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Recent Uploads</h2>
            <Link to="/teacher/content" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
          </div>

          {error && <ErrorState message={error} onRetry={refetch} />}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && !error && recent.length === 0 && (
            <EmptyState icon="📤" title="No content yet" description="Upload your first piece of content to get started." />
          )}

          {!loading && !error && recent.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recent.map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Quick info */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-slate-200 mb-4">Public Live Page</h3>
          <p className="text-slate-400 text-sm mb-3">
            Share this link with students to view your currently active content:
          </p>
          <div className="flex items-center gap-3 bg-slate-900 rounded-xl px-4 py-3 border border-slate-700">
            <code className="text-brand-400 text-sm font-mono flex-1 truncate">
              {window.location.origin}/live/{user.id}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/live/${user.id}`); }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
