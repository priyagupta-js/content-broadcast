import React, { useState, useCallback } from 'react';
import { approvalService } from '../../services/approval.service';
import { useAsync } from '../../hooks/useAsync';
import { PageLayout } from '../../components/layout/Sidebar';
import {
  LoadingPage, ErrorState, EmptyState, Modal, Spinner, ScheduleBadge
} from '../../components/ui';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function PendingApprovals() {
  const fetchFn = useCallback(() => approvalService.getPendingContent(), []);
  const { data: items, loading, error, refetch } = useAsync(fetchFn);

  const [selected, setSelected]             = useState(null);
  const [rejectModal, setRejectModal]       = useState(false);
  const [rejectReason, setRejectReason]     = useState('');
  const [actionLoading, setActionLoading]   = useState(null); // item id
  const [previewItem, setPreviewItem]       = useState(null);

  const handleApprove = async (item) => {
    setActionLoading(item.id);
    try {
      await approvalService.approveContent(item.id);
      toast.success(`"${item.title}" approved successfully!`);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (item) => {
    setSelected(item);
    setRejectReason('');
    setRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    setActionLoading(selected.id);
    try {
      await approvalService.rejectContent(selected.id, rejectReason);
      toast.success(`"${selected.title}" rejected.`);
      setRejectModal(false);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageLayout role="principal">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Pending Approvals</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and take action on teacher-submitted content
            {items && <span className="ml-2 text-amber-400">({items.length} pending)</span>}
          </p>
        </div>

        {loading && <LoadingPage />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && items?.length === 0 && (
          <EmptyState icon="🎉" title="All clear!" description="No content is waiting for approval right now." />
        )}

        {!loading && !error && items?.length > 0 && (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="card flex gap-5 hover:border-brand-500/20 transition-all duration-300 animate-slide-up">
                {/* Preview thumbnail */}
                <button
                  onClick={() => setPreviewItem(item)}
                  className="shrink-0 w-32 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-brand-500/50 transition-colors group"
                >
                  <img
                    src={item.fileUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-100 text-base mb-1">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                        <span className="text-brand-400 font-medium">{item.subject}</span>
                        <span>·</span>
                        <span>{item.teacherName}</span>
                        <span>·</span>
                        <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                      </div>
                      {item.description && (
                        <p className="text-slate-500 text-sm mt-2 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <span className="text-slate-500 text-xs shrink-0">{formatDate(item.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={actionLoading === item.id}
                      className="btn-success text-sm py-2"
                    >
                      {actionLoading === item.id ? <Spinner size="sm" /> : '✓'} Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(item)}
                      disabled={actionLoading === item.id}
                      className="btn-danger text-sm py-2"
                    >
                      ✕ Reject
                    </button>
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="btn-secondary text-sm py-2"
                    >
                      👁 Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        <Modal
          isOpen={rejectModal}
          onClose={() => setRejectModal(false)}
          title="Reject Content"
          footer={
            <>
              <button onClick={() => setRejectModal(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleReject}
                disabled={actionLoading === selected?.id}
                className="btn-danger"
              >
                {actionLoading === selected?.id ? <Spinner size="sm" /> : '✕'} Reject
              </button>
            </>
          }
        >
          <p className="text-slate-400 text-sm mb-4">
            You are rejecting: <span className="text-slate-200 font-medium">"{selected?.title}"</span>
          </p>
          <label className="label">Rejection Reason *</label>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Explain why this content is being rejected…"
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            autoFocus
          />
          <p className="text-slate-500 text-xs mt-2">This reason will be visible to the teacher.</p>
        </Modal>

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
                className="w-full max-h-80 object-contain rounded-xl bg-slate-900"
              />
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Subject', previewItem.subject],
                  ['Teacher', previewItem.teacherName],
                  ['Start', formatDate(previewItem.startTime)],
                  ['End', formatDate(previewItem.endTime)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{k}</div>
                    <div className="text-slate-200 font-medium">{v}</div>
                  </div>
                ))}
              </div>
              {previewItem.description && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Description</div>
                  <p className="text-slate-300 text-sm">{previewItem.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
}
