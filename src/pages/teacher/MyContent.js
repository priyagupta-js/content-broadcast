import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { useAsync } from '../../hooks/useAsync';
import { PageLayout } from '../../components/layout/Sidebar';
import {
  LoadingPage, ErrorState, EmptyState, StatusBadge,
  ScheduleBadge, SkeletonRow,
} from '../../components/ui';
import { formatDate, formatFileSize, STATUS_OPTIONS } from '../../utils/helpers';

export default function MyContent() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const fetchFn = useCallback(() => contentService.getTeacherContent(user.id), [user.id]);
  const { data: items, loading, error, refetch } = useAsync(fetchFn);

  const filtered = items
    ? items.filter(c => statusFilter === 'all' || c.status === statusFilter)
    : [];

  return (
    <PageLayout role="teacher">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">My Content</h1>
            <p className="text-slate-400 text-sm mt-1">Track status of all your uploaded material</p>
          </div>
          <Link to="/teacher/upload" className="btn-primary"><span>↑</span> Upload New</Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                statusFilter === opt.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {opt.label}
              {items && opt.value !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({items.filter(c => c.status === opt.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!error && (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Schedule</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Broadcast</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <EmptyState icon="📭" title="No content found" description="Upload your first piece of content or change the filter." />
                      </td>
                    </tr>
                  )}
                  {!loading && filtered.map(item => (
                    <tr key={item.id} className="table-row">
                      <td className="px-5 py-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800">
                          <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy"
                            onError={e => { e.target.style.display='none'; }} />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-200 max-w-xs truncate">{item.title}</div>
                        {item.status === 'rejected' && item.rejectionReason && (
                          <div className="text-xs text-red-400 mt-0.5 max-w-xs truncate">↳ {item.rejectionReason}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-400">{item.subject}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3"><ScheduleBadge startTime={item.startTime} endTime={item.endTime} /></td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        <div>{formatDate(item.startTime)}</div>
                        <div className="text-slate-600">→ {formatDate(item.endTime)}</div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
