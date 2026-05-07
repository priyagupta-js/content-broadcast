import { mockDB } from '../utils/mockData';

const delay = (ms = 700) => new Promise(r => setTimeout(r, ms));

/**
 * Approval Service
 * Handles content approval/rejection by principals.
 */
export const approvalService = {
  /** Approve a content item */
  approveContent: async (contentId) => {
    await delay();
    const updated = mockDB.updateContent(contentId, { status: 'approved', rejectionReason: null });
    if (!updated) throw new Error('Content not found');
    return updated;
  },

  /** Reject a content item with a mandatory reason */
  rejectContent: async (contentId, reason) => {
    await delay();
    if (!reason || !reason.trim()) throw new Error('Rejection reason is required.');
    const updated = mockDB.updateContent(contentId, {
      status: 'rejected',
      rejectionReason: reason.trim(),
    });
    if (!updated) throw new Error('Content not found');
    return updated;
  },

  /** Get all pending content */
  getPendingContent: async () => {
    await delay();
    return mockDB.getContent().filter(c => c.status === 'pending');
  },
};
