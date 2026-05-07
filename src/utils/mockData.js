import { addHours, subHours, addDays, subDays, formatISO } from 'date-fns';

const now = new Date();

export const MOCK_USERS = [
  { id: 'u1', name: 'Ms. Priya Sharma',  email: 'teacher@demo.com',    role: 'teacher',   avatar: 'PS' },
  { id: 'u2', name: 'Mr. Arjun Mehta',   email: 'teacher2@demo.com',   role: 'teacher',   avatar: 'AM' },
  { id: 'u3', name: 'Dr. Kavita Reddy',  email: 'principal@demo.com',  role: 'principal', avatar: 'KR' },
];

export const MOCK_CONTENT = [
  {
    id: 'c1', teacherId: 'u1', teacherName: 'Ms. Priya Sharma',
    title: 'Introduction to Photosynthesis',
    subject: 'Biology',
    description: 'A comprehensive overview of how plants convert sunlight to energy.',
    fileUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80',
    fileType: 'image/jpeg', fileSize: 2048000,
    status: 'approved',
    startTime: formatISO(subHours(now, 1)),
    endTime: formatISO(addHours(now, 3)),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: formatISO(subDays(now, 2)),
  },
  {
    id: 'c2', teacherId: 'u1', teacherName: 'Ms. Priya Sharma',
    title: 'Algebra Basics – Chapter 4',
    subject: 'Mathematics',
    description: 'Solving linear equations with one variable.',
    fileUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    fileType: 'image/jpeg', fileSize: 1500000,
    status: 'pending',
    startTime: formatISO(addHours(now, 2)),
    endTime: formatISO(addHours(now, 6)),
    rotationDuration: 20,
    rejectionReason: null,
    createdAt: formatISO(subDays(now, 1)),
  },
  {
    id: 'c3', teacherId: 'u1', teacherName: 'Ms. Priya Sharma',
    title: 'World War II – Key Events',
    subject: 'History',
    description: 'Timeline of major events during 1939–1945.',
    fileUrl: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800&q=80',
    fileType: 'image/jpeg', fileSize: 3200000,
    status: 'rejected',
    startTime: formatISO(subDays(now, 3)),
    endTime: formatISO(subDays(now, 2)),
    rotationDuration: 45,
    rejectionReason: 'Content requires revision – please add proper citations and remove copyrighted images.',
    createdAt: formatISO(subDays(now, 5)),
  },
  {
    id: 'c4', teacherId: 'u2', teacherName: 'Mr. Arjun Mehta',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    description: 'Interactive lesson on all three laws with real-world examples.',
    fileUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80',
    fileType: 'image/jpeg', fileSize: 2800000,
    status: 'pending',
    startTime: formatISO(addDays(now, 1)),
    endTime: formatISO(addDays(now, 2)),
    rotationDuration: 30,
    rejectionReason: null,
    createdAt: formatISO(subHours(now, 5)),
  },
  {
    id: 'c5', teacherId: 'u2', teacherName: 'Mr. Arjun Mehta',
    title: 'Shakespeare – Hamlet Overview',
    subject: 'English Literature',
    description: 'Key themes, characters, and famous quotes from Hamlet.',
    fileUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    fileType: 'image/jpeg', fileSize: 1900000,
    status: 'approved',
    startTime: formatISO(subHours(now, 2)),
    endTime: formatISO(addHours(now, 4)),
    rotationDuration: 60,
    rejectionReason: null,
    createdAt: formatISO(subDays(now, 3)),
  },
  {
    id: 'c6', teacherId: 'u1', teacherName: 'Ms. Priya Sharma',
    title: 'The Periodic Table',
    subject: 'Chemistry',
    description: 'Elements, groups, and periods explained with mnemonics.',
    fileUrl: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874a?w=800&q=80',
    fileType: 'image/jpeg', fileSize: 2200000,
    status: 'approved',
    startTime: formatISO(addHours(now, 5)),
    endTime: formatISO(addHours(now, 9)),
    rotationDuration: 25,
    rejectionReason: null,
    createdAt: formatISO(subDays(now, 1)),
  },
];

let _content = [...MOCK_CONTENT];

export const mockDB = {
  getContent: () => [..._content],
  getContentByTeacher: (teacherId) => _content.filter(c => c.teacherId === teacherId),
  getContentById: (id) => _content.find(c => c.id === id),
  addContent: (item) => { _content = [item, ..._content]; return item; },
  updateContent: (id, patch) => {
    _content = _content.map(c => c.id === id ? { ...c, ...patch } : c);
    return _content.find(c => c.id === id);
  },
};
