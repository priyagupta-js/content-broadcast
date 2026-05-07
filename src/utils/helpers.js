import { format, isAfter, isBefore, parseISO } from 'date-fns';

export const formatDate = (iso) => {
  try { return format(parseISO(iso), 'dd MMM yyyy, hh:mm a'); }
  catch { return '—'; }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

export const getScheduleStatus = (startTime, endTime) => {
  const now   = new Date();
  const start = parseISO(startTime);
  const end   = parseISO(endTime);
  if (isBefore(now, start)) return 'scheduled';
  if (isAfter(now, end))    return 'expired';
  return 'active';
};

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English Literature', 'History', 'Geography', 'Computer Science',
  'Economics', 'Art & Design', 'Physical Education', 'Other',
];

export const STATUS_OPTIONS = [
  { value: 'all',      label: 'All Status' },
  { value: 'pending',  label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
