import React, { useState, useCallback, useMemo } from 'react';
import { contentService } from '../../services/content.service';
import { useAsync } from '../../hooks/useAsync';
import { PageLayout } from '../../components/layout/Sidebar';
import {
  ErrorState, EmptyState, StatusBadge, ScheduleBadge, SkeletonRow, Modal
} from '../../components/ui';
import { formatDate, formatFileSize, STATUS_OPTIONS } from '../../utils/helpers';

export default function AllContent() {
  const fetchFn = useCallback(() => contentService.getAllContent(), []);
  const { data: items, loading, error, refetch } = useAsync(fetchFn);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [previewItem, setPreviewItem]   = useState(null);

  const filtered = useMemo(() => {
    if (!items) return [];
    let result = items;
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, statusFilter, search]);

  return (
    <PageLayout role="principal">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">All Content</h1>
          <p className="text-slate-400 text-sm mt-1">Complete view of every submission across all teachers</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
            <input
              className="input pl-9"
              placeholder="Search by title, subject, or teacher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  statusFilter === opt.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 mb-3">
          Showing {filtered.length} of {items?.length ?? 0} items
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {!error && (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['Preview','Title','Teacher','Subject','Status','Broadcast','Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && [1,2,3,4,5].map(i => <SkeletonRow key={i} />)}

                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <EmptyState icon="🔍" title="No results found" description="Try adjusting your filters or search query." />
                      </td>
                    </tr>
                  )}

                  {!loading && filtered.map(item => (
                    <tr key={item.id} className="table-row">
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800 block hover:ring-2 hover:ring-brand-500/50 transition-all"
                        >
                          <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy"
                            onError={e => { e.target.style.display='none'; }} />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-200 max-w-48 truncate">{item.title}</div>
                        {item.rejectionReason && (
                          <div className="text-xs text-red-400 mt-0.5 max-w-48 truncate">↳ {item.rejectionReason}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-400">{item.teacherName}</td>
                      <td className="px-5 py-3 text-brand-400 font-medium">{item.subject}</td>
                      <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3"><ScheduleBadge startTime={item.startTime} endTime={item.endTime} /></td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="text-slate-400 hover:text-brand-400 text-xs font-medium transition-colors"
                        >
                          👁 View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        <Modal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title={previewItem?.title || 'Preview'}
        >
          {previewItem && (
            <div className="space-y-4">
              <img
                src={previewItem.fileUrl}
                alt={previewItem.title}
                className="w-full max-h-72 object-contain rounded-xl bg-slate-900"
              />
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Subject',  previewItem.subject],
                  ['Teacher',  previewItem.teacherName],
                  ['Status',   previewItem.status],
                  ['Size',     formatFileSize(previewItem.fileSize)],
                  ['Start',    formatDate(previewItem.startTime)],
                  ['End',      formatDate(previewItem.endTime)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{k}</div>
                    <div className="text-slate-200 font-medium capitalize">{v}</div>
                  </div>
                ))}
              </div>
              {previewItem.description && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Description</div>
                  <p className="text-slate-300 text-sm">{previewItem.description}</p>
                </div>
              )}
              {previewItem.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Rejection Reason</div>
                  <p className="text-red-300 text-sm">{previewItem.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
}
