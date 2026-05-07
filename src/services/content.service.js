import { mockDB } from '../utils/mockData';
import { formatISO } from 'date-fns';

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

/**
 * Content Service
 * Handles all content CRUD operations.
 * Replace mock implementations with real apiClient calls when backend is ready.
 */
export const contentService = {
  /** Get all content (principal view) */
  getAllContent: async ({ status, search } = {}) => {
    await delay();
    let items = mockDB.getContent();
    if (status && status !== 'all') items = items.filter(c => c.status === status);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
      );
    }
    return items;
  },

  /** Get content uploaded by a specific teacher */
  getTeacherContent: async (teacherId) => {
    await delay();
    return mockDB.getContentByTeacher(teacherId);
  },

  /** Get a single content item */
  getContentById: async (id) => {
    await delay(300);
    const item = mockDB.getContentById(id);
    if (!item) throw new Error('Content not found');
    return item;
  },

  /** Get live/active content for a teacher's public page */
  getLiveContent: async (teacherId) => {
    await delay();
    const now = new Date();
    const items = mockDB.getContentByTeacher(teacherId);
    return items.filter(c => {
      if (c.status !== 'approved') return false;
      const start = new Date(c.startTime);
      const end   = new Date(c.endTime);
      return now >= start && now <= end;
    });
  },

  /** Upload new content */
  uploadContent: async (formData, teacherId, teacherName) => {
    await delay(1200);

    const file = formData.file;
    const ALLOWED = ['image/jpeg', 'image/png', 'image/gif'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

    if (!ALLOWED.includes(file.type)) throw new Error('Only JPG, PNG, and GIF files are allowed.');
    if (file.size > MAX_SIZE)         throw new Error('File size must be under 10 MB.');

    const start = new Date(formData.startTime);
    const end   = new Date(formData.endTime);
    if (end <= start) throw new Error('End time must be after start time.');

    // Simulate a file URL (replace with real upload URL from backend)
    const fileUrl = URL.createObjectURL(file);

    const newItem = {
      id: `c${Date.now()}`,
      teacherId,
      teacherName,
      title: formData.title,
      subject: formData.subject,
      description: formData.description || '',
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
      status: 'pending',
      startTime: formData.startTime,
      endTime: formData.endTime,
      rotationDuration: Number(formData.rotationDuration) || 30,
      rejectionReason: null,
      createdAt: formatISO(new Date()),
    };

    return mockDB.addContent(newItem);
  },
};
