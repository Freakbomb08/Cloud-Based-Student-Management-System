// Mock student session — UI-only first pass.
export const mockStudent = {
  id: "2024-IITM-01",
  name: "Jayesh Dawar",
  program: "BCA",
  semester: 5,
  section: "BCA VI E1",
  attendance: 88,
  avatar: "https://i.pravatar.cc/120?img=12",
};

export const upcomingClasses = [
  { time: "10:30", title: "Advance Java Programming", room: "Lab 402", prof: "Prof. Sunita Sharma", tag: "Lecture" },
  { time: "01:45", title: "Network Security Essentials", room: "Room 210", prof: "Prof. Amit Verma", tag: "Practical" },
  { time: "03:30", title: "Software Engineering", room: "Auditorium B", prof: "Prof. Renu Gupta", tag: "Seminar" },
];

export const courses = [
  { code: "CS-402", title: "Advanced Data Structures", prof: "Prof. Ananya Sharma", room: "Hall B-12", attendance: 98, featured: true },
  { code: "MA-301", title: "Discrete Mathematics", prof: "Dr. Rajesh Kumar", room: "Hall C-04", attendance: 85 },
  { code: "PH-102", title: "Quantum Physics II", prof: "Prof. Sarah Jenkins", room: "Lab 09", attendance: 92 },
  { code: "HS-210", title: "Sociology & Tech", prof: "Dr. Michael Chen", room: "Hall A-01", attendance: 78 },
  { code: "CS-405", title: "Network Security", prof: "Prof. Liam Neeson", room: "Hall B-03", attendance: 100 },
];

export const notifications = [
  { type: "info", title: "Library Due Date", body: 'Book "Clean Code" is due in 2 days. Renew online to avoid late fees.', when: "2 hours ago" },
  { type: "success", title: "Assignment Graded", body: "System Analysis assignment graded. You scored 18/20.", when: "Yesterday" },
  { type: "event", title: "Tech Fest 2024", body: "Registrations for Annual Tech Fest are now open for BCA students.", when: "1 day ago" },
];

export const conversations = [
  { id: "1", name: "Dr. Ananya Sharma", preview: "Typing…", time: "10:42 AM", active: true, unread: true, initials: "AS" },
  { id: "2", name: "Prof. Rajesh Kumar", preview: "The assignment deadline has been extended…", time: "Yesterday", initials: "RK" },
  { id: "3", name: "Siddharth Mehra", preview: "Can you share the link for the guest lecture …", time: "Monday", initials: "SM" },
  { id: "4", name: "Isha Malhotra", preview: "Thank you for the feedback on my research…", time: "Jan 12", initials: "IM" },
];

// ===== Teacher portal mock =====
export const mockTeacher = {
  id: "FAC-2019-007",
  name: "Dr. Aris Thorne",
  department: "Mathematics & Physics",
  pendingSubmissions: 12,
  classCount: 3,
  avatar: "https://i.pravatar.cc/120?img=15",
};

export const teacherClasses = [
  { code: "MATH 302", title: "Advanced Calculus", section: "B", status: "Active", avgGrade: 84, attendance: 92 },
  { code: "PHYS 101", title: "Quantum Physics", section: "A", status: "Active", avgGrade: 78, attendance: 88 },
  { code: "STAT 205", title: "Statistical Modeling", section: "C", status: "Reviewing", avgGrade: 81, attendance: 95 },
];

export const teacherAnnouncements = [
  { course: "MATH 302", body: "Mid-term review notes uploaded to portal.", when: "2 hours ago" },
  { course: "PHYS 101", body: "Lab session rescheduled for Friday.", when: "Yesterday" },
];

export const recentSubmissions = [
  { initials: "JD", name: "John Doe", course: "MATH 302", item: "Assignment 4: Integrals", tone: "blue" as const },
  { initials: "SM", name: "Sarah Miller", course: "PHYS 101", item: "Lab Report: Particle Motion", tone: "rose" as const },
  { initials: "RK", name: "Robert King", course: "MATH 302", item: "Assignment 4: Integrals", tone: "blue" as const },
];

export const classRoster = [
  { id: "STU-001", name: "John Doe", roll: "MATH-B-01" },
  { id: "STU-002", name: "Sarah Miller", roll: "MATH-B-02" },
  { id: "STU-003", name: "Robert King", roll: "MATH-B-03" },
  { id: "STU-004", name: "Priya Nair", roll: "MATH-B-04" },
  { id: "STU-005", name: "Liam Chen", roll: "MATH-B-05" },
  { id: "STU-006", name: "Aisha Khan", roll: "MATH-B-06" },
  { id: "STU-007", name: "Marcus Reed", roll: "MATH-B-07" },
  { id: "STU-008", name: "Elena Petrova", roll: "MATH-B-08" },
  { id: "STU-009", name: "Karthik Iyer", roll: "MATH-B-09" },
  { id: "STU-010", name: "Zoe Williams", roll: "MATH-B-10" },
];

export const messages = [
  { from: "them", text: "Hello Jayesh, I've reviewed your project proposal for the Data Structures module. Great work on the complexity analysis section.", time: "10:15 AM" },
  { from: "me", text: "Thank you, Dr. Sharma! I put extra effort into the Big O notations. Did you find the graph implementation logic sound?", time: "10:30 AM" },
  { from: "them", text: "Absolutely. I would suggest refining the adjacency matrix part for larger datasets. Let's discuss this further in tomorrow's lab session.", time: "10:42 AM" },
];
