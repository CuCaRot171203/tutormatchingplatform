import type {
  Session, SessionStatus, StudentProfile, Feedback,
  CreditTransaction, CreditTransactionType, Notification,
  LearningMilestone, MilestoneStatus, TutorProfile,
} from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────
export const SUBJECTS = [
  { id: 1, name: 'Toán', color: '#7132f5' },
  { id: 2, name: 'Văn', color: '#149e61' },
  { id: 3, name: 'Anh Văn', color: '#3b82f6' },
  { id: 4, name: 'Lý', color: '#f59e0b' },
  { id: 5, name: 'Hóa', color: '#ec4899' },
  { id: 6, name: 'Sinh', color: '#06b6d4' },
];

const now = new Date();
const d = (offsetDays: number, hour: number, min = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, min, 0, 0);
  return dt.toISOString();
};

// ─── Tutor Profile ────────────────────────────────────────────────────────────
export const mockTutorProfile: TutorProfile = {
  id: 1,
  userId: 1,
  fullName: 'Nguyễn Văn Minh',
  email: 'minh.tutor@gmail.com',
  avatarUrl: undefined,
  bio: 'Gia sư với hơn 5 năm kinh nghiệm giảng dạy Toán và Lý cấp THPT. Tôi yêu thích việc giúp học sinh hiểu bản chất vấn đề thay vì học vẹt.',
  qualifications: 'Thạc sĩ Sư phạm Toán - ĐH Sư phạm Hà Nội\nTốt nghiệp loại Giỏi\nĐạt giải Ba Olympic Toán sinh viên toàn quốc',
  status: 'Approved',
  reputationScore: 4.8,
  subjects: [
    { subjectId: 1, subjectName: 'Toán', hourlyRate: 200000 },
    { subjectId: 4, subjectName: 'Lý', hourlyRate: 180000 },
  ],
  freeSchedulesJson: JSON.stringify([
    { day: 1, hours: [8, 9, 10, 11, 14, 15, 16, 17] },
    { day: 2, hours: [8, 9, 10, 11, 14, 15, 16, 17] },
    { day: 3, hours: [8, 9, 10, 11, 14, 15] },
    { day: 4, hours: [8, 9, 10, 11, 14, 15, 16, 17] },
    { day: 5, hours: [8, 9, 10, 11, 14, 15, 16] },
  ]),
  timezoneOffset: 7,
};

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const mockSessions: Session[] = [
  { id: 1, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 1, studentName: 'Trần Minh Tuấn', subjectId: 1, subjectName: 'Toán', startTime: d(0, 9, 0), endTime: d(0, 10, 30), status: 'Confirmed', meetingLink: 'https://meet.google.com/abc-defg-hij', score: undefined },
  { id: 2, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 2, studentName: 'Lê Hoàng Lan', subjectId: 4, subjectName: 'Lý', startTime: d(0, 14, 0), endTime: d(0, 15, 30), status: 'Pending', meetingLink: undefined, score: undefined },
  { id: 3, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 3, studentName: 'Phạm Thu Hà', subjectId: 1, subjectName: 'Toán', startTime: d(1, 9, 0), endTime: d(1, 10, 30), status: 'Confirmed', meetingLink: 'https://meet.google.com/xyz-uvwx-yz', score: undefined },
  { id: 4, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 4, studentName: 'Nguyễn Thị Mai', subjectId: 3, subjectName: 'Anh Văn', startTime: d(2, 15, 0), endTime: d(2, 16, 30), status: 'Pending', meetingLink: undefined, score: undefined },
  { id: 5, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 1, studentName: 'Trần Minh Tuấn', subjectId: 1, subjectName: 'Toán', startTime: d(-1, 9, 0), endTime: d(-1, 10, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-01', score: 8.5, tutorComment: 'Em tiến bộ rõ rệt, nắm vững phương trình bậc 2.', goalCompletionPercentage: 75 },
  { id: 6, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 2, studentName: 'Lê Hoàng Lan', subjectId: 4, subjectName: 'Lý', startTime: d(-2, 14, 0), endTime: d(-2, 15, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-02', score: 9.0, tutorComment: 'Nắm chắc định luật Newton, làm bài tập nhanh.', goalCompletionPercentage: 90 },
  { id: 7, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 5, studentName: 'Vũ Quang Đức', subjectId: 5, subjectName: 'Hóa', startTime: d(-3, 10, 0), endTime: d(-3, 11, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-03', score: 7.5, tutorComment: 'Cần ôn lại bảng tuần hoàn.', goalCompletionPercentage: 60 },
  { id: 8, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 3, studentName: 'Phạm Thu Hà', subjectId: 1, subjectName: 'Toán', startTime: d(-5, 9, 0), endTime: d(-5, 10, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-04', score: 8.0, tutorComment: 'Hàm số bậc nhất khá vững.', goalCompletionPercentage: 80 },
  { id: 9, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 4, studentName: 'Nguyễn Thị Mai', subjectId: 3, subjectName: 'Anh Văn', startTime: d(-7, 15, 0), endTime: d(-7, 16, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-05', score: 8.5, tutorComment: 'Pronunciation tốt hơn nhiều.', goalCompletionPercentage: 70 },
  { id: 10, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 1, studentName: 'Trần Minh Tuấn', subjectId: 1, subjectName: 'Toán', startTime: d(-10, 9, 0), endTime: d(-10, 10, 30), status: 'Cancelled', meetingLink: undefined, score: undefined },
  { id: 11, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 6, studentName: 'Bùi Thanh Sơn', subjectId: 1, subjectName: 'Toán', startTime: d(3, 10, 0), endTime: d(3, 11, 30), status: 'PendingChangeConfirmation', meetingLink: undefined, score: undefined },
  { id: 12, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 7, studentName: 'Đặng Thị Phương', subjectId: 4, subjectName: 'Lý', startTime: d(-4, 14, 0), endTime: d(-4, 15, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-06', score: 9.5, tutorComment: 'Xuất sắc! Hiểu sâu về sóng cơ.', goalCompletionPercentage: 95 },
  { id: 13, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 8, studentName: 'Hoàng Văn Nam', subjectId: 1, subjectName: 'Toán', startTime: d(-6, 8, 0), endTime: d(-6, 9, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-07', score: 8.0, tutorComment: 'Hình học không gian cần luyện thêm.', goalCompletionPercentage: 65 },
  { id: 14, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 9, studentName: 'Trịnh Minh Châu', subjectId: 3, subjectName: 'Anh Văn', startTime: d(-8, 16, 0), endTime: d(-8, 17, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-08', score: 7.0, tutorComment: 'Grammar cần cải thiện.', goalCompletionPercentage: 55 },
  { id: 15, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 10, studentName: 'Lý Thị Yến', subjectId: 5, subjectName: 'Hóa', startTime: d(-9, 11, 0), endTime: d(-9, 12, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-09', score: 8.5, tutorComment: 'Phản ứng oxi hóa khử khá tốt.', goalCompletionPercentage: 85 },
  { id: 16, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 2, studentName: 'Lê Hoàng Lan', subjectId: 4, subjectName: 'Lý', startTime: d(4, 9, 0), endTime: d(4, 10, 30), status: 'Confirmed', meetingLink: 'https://meet.google.com/fut-sess-01', score: undefined },
  { id: 17, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 11, studentName: 'Phan Văn Hùng', subjectId: 1, subjectName: 'Toán', startTime: d(-12, 10, 0), endTime: d(-12, 11, 30), status: 'Cancelled', meetingLink: undefined, score: undefined },
  { id: 18, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 12, studentName: 'Trần Thị Oanh', subjectId: 6, subjectName: 'Sinh', startTime: d(-11, 14, 0), endTime: d(-11, 15, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-10', score: 8.0, tutorComment: 'Di truyền Mendel khá vững.', goalCompletionPercentage: 75 },
  { id: 19, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 3, studentName: 'Phạm Thu Hà', subjectId: 1, subjectName: 'Toán', startTime: d(5, 10, 0), endTime: d(5, 11, 30), status: 'Pending', meetingLink: undefined, score: undefined },
  { id: 20, tutorId: 1, tutorName: 'Nguyễn Văn Minh', studentId: 13, studentName: 'Ngô Thị Lan', subjectId: 3, subjectName: 'Anh Văn', startTime: d(-14, 15, 0), endTime: d(-14, 16, 30), status: 'Completed', meetingLink: 'https://meet.google.com/old-sess-11', score: 9.0, tutorComment: 'IELTS speaking cải thiện rõ.', goalCompletionPercentage: 88 },
];

// ─── Students ─────────────────────────────────────────────────────────────────
export const mockStudents = [
  { id: 1, name: 'Trần Minh Tuấn', avatar: undefined, email: 'minhtuan.sv@student.edu.vn', phone: '0912-345-678', sessionCount: 3, lastSession: mockSessions[4].startTime, subjects: ['Toán'], averageScore: 8.5, grade: 'Lớp 11' },
  { id: 2, name: 'Lê Hoàng Lan', avatar: undefined, email: 'lan.lh@student.edu.vn', phone: '0934-567-890', sessionCount: 2, lastSession: mockSessions[5].startTime, subjects: ['Lý'], averageScore: 9.0, grade: 'Lớp 12' },
  { id: 3, name: 'Phạm Thu Hà', avatar: undefined, email: 'hapt.sv@student.edu.vn', phone: '0901-234-567', sessionCount: 2, lastSession: mockSessions[7].startTime, subjects: ['Toán'], averageScore: 8.0, grade: 'Lớp 10' },
  { id: 4, name: 'Nguyễn Thị Mai', avatar: undefined, email: 'mai.nt@student.edu.vn', phone: '0978-123-456', sessionCount: 2, lastSession: mockSessions[8].startTime, subjects: ['Anh Văn'], averageScore: 8.5, grade: 'Lớp 11' },
  { id: 5, name: 'Vũ Quang Đức', avatar: undefined, email: 'duc.vq@student.edu.vn', phone: '0945-678-901', sessionCount: 1, lastSession: mockSessions[6].startTime, subjects: ['Hóa'], averageScore: 7.5, grade: 'Lớp 12' },
  { id: 6, name: 'Bùi Thanh Sơn', avatar: undefined, email: 'son.bt@student.edu.vn', phone: '0963-789-012', sessionCount: 1, lastSession: mockSessions[11].startTime, subjects: ['Lý'], averageScore: 9.5, grade: 'Lớp 12' },
  { id: 7, name: 'Đặng Thị Phương', avatar: undefined, email: 'phuong.dt@student.edu.vn', phone: '0917-234-890', sessionCount: 1, lastSession: mockSessions[11].startTime, subjects: ['Lý'], averageScore: 9.5, grade: 'Lớp 12' },
  { id: 8, name: 'Hoàng Văn Nam', avatar: undefined, email: 'nam.hv@student.edu.vn', phone: '0982-345-901', sessionCount: 1, lastSession: mockSessions[12].startTime, subjects: ['Toán'], averageScore: 8.0, grade: 'Lớp 11' },
  { id: 9, name: 'Trịnh Minh Châu', avatar: undefined, email: 'chau.tm@student.edu.vn', phone: '0956-456-012', sessionCount: 1, lastSession: mockSessions[13].startTime, subjects: ['Anh Văn'], averageScore: 7.0, grade: 'Lớp 10' },
  { id: 10, name: 'Lý Thị Yến', avatar: undefined, email: 'yen.lt@student.edu.vn', phone: '0938-567-123', sessionCount: 1, lastSession: mockSessions[14].startTime, subjects: ['Hóa'], averageScore: 8.5, grade: 'Lớp 12' },
  { id: 11, name: 'Phan Văn Hùng', avatar: undefined, email: 'hung.pv@student.edu.vn', phone: '0927-678-234', sessionCount: 1, lastSession: mockSessions[16].startTime, subjects: ['Toán'], averageScore: undefined, grade: 'Lớp 11' },
  { id: 12, name: 'Trần Thị Oanh', avatar: undefined, email: 'oanh.tt@student.edu.vn', phone: '0941-789-345', sessionCount: 1, lastSession: mockSessions[17].startTime, subjects: ['Sinh'], averageScore: 8.0, grade: 'Lớp 10' },
  { id: 13, name: 'Ngô Thị Lan', avatar: undefined, email: 'lan.nt@student.edu.vn', phone: '0965-890-456', sessionCount: 1, lastSession: mockSessions[19].startTime, subjects: ['Anh Văn'], averageScore: 9.0, grade: 'Lớp 11' },
];

// ─── Progress / Milestones ─────────────────────────────────────────────────────
export const mockProgress: LearningMilestone[] = [
  { id: 1, studentId: 1, studentName: 'Trần Minh Tuấn', subjectId: 1, subjectName: 'Toán', milestoneName: 'Hoàn thành chương Hàm số bậc 2', targetDate: d(7, 0), status: 'InProgress', completionPercentage: 65 },
  { id: 2, studentId: 1, studentName: 'Trần Minh Tuấn', subjectId: 1, subjectName: 'Toán', milestoneName: 'Giải đề thi thử HK1', targetDate: d(21, 0), status: 'NotStarted', completionPercentage: 20 },
  { id: 3, studentId: 2, studentName: 'Lê Hoàng Lan', subjectId: 4, subjectName: 'Lý', milestoneName: 'Nắm vững Định luật Newton', targetDate: d(5, 0), status: 'Completed', completionPercentage: 100 },
  { id: 4, studentId: 2, studentName: 'Lê Hoàng Lan', subjectId: 4, subjectName: 'Lý', milestoneName: 'Sóng cơ học', targetDate: d(14, 0), status: 'InProgress', completionPercentage: 55 },
  { id: 5, studentId: 3, studentName: 'Phạm Thu Hà', subjectId: 1, subjectName: 'Toán', milestoneName: 'Hình học không gian', targetDate: d(10, 0), status: 'InProgress', completionPercentage: 40 },
  { id: 6, studentId: 4, studentName: 'Nguyễn Thị Mai', subjectId: 3, subjectName: 'Anh Văn', milestoneName: 'IELTS Reading 6.0', targetDate: d(30, 0), status: 'NotStarted', completionPercentage: 10 },
  { id: 7, studentId: 5, studentName: 'Vũ Quang Đức', subjectId: 5, subjectName: 'Hóa', milestoneName: 'Bảng tuần hoàn', targetDate: d(3, 0), status: 'Completed', completionPercentage: 100 },
  { id: 8, studentId: 6, studentName: 'Bùi Thanh Sơn', subjectId: 4, subjectName: 'Lý', milestoneName: 'Điện xoay chiều', targetDate: d(12, 0), status: 'InProgress', completionPercentage: 70 },
];

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const mockFeedback: Feedback[] = [
  { id: 1, sessionId: 5, senderId: 1, senderName: 'Trần Minh Tuấn', receiverId: 1, rating: 5, comment: 'Thầy dạy rất dễ hiểu, giải thích tỉ mỉ từng bước. Em đã tiến bộ rất nhiều trong Toán!', createdAt: d(-1, 16, 0) },
  { id: 2, sessionId: 6, senderId: 2, senderName: 'Lê Hoàng Lan', receiverId: 1, rating: 5, comment: 'Thầy Minh rất nhiệt tình, luôn sẵn sàng giải đáp thắc mắc ngoài giờ học.', createdAt: d(-2, 17, 0) },
  { id: 3, sessionId: 7, senderId: 5, senderName: 'Vũ Quang Đức', receiverId: 1, rating: 4, comment: 'Dạy tốt nhưng bài tập về nhà hơi ít, em muốn luyện thêm.', createdAt: d(-3, 15, 0) },
  { id: 4, sessionId: 8, senderId: 3, senderName: 'Phạm Thu Hà', receiverId: 1, rating: 4, comment: 'Thầy chữa bài chi tiết, nhưng sometimes giải thích hơi nhanh.', createdAt: d(-5, 18, 0) },
  { id: 5, sessionId: 9, senderId: 4, senderName: 'Nguyễn Thị Mai', receiverId: 1, rating: 5, comment: 'Cảm ơn thầy! Speaking em đã cải thiện rõ rệt sau 5 buổi học.', createdAt: d(-7, 14, 0) },
  { id: 6, sessionId: 11, senderId: 6, senderName: 'Bùi Thanh Sơn', receiverId: 1, rating: 5, comment: 'Xuất sắc! Thầy giúp em hiểu sâu bản chất vật lý chứ không phải học vẹt.', createdAt: d(-4, 19, 0) },
  { id: 7, sessionId: 12, senderId: 8, senderName: 'Hoàng Văn Nam', receiverId: 1, rating: 4, comment: 'Bài giảng hay nhưng đôi khi em chưa theo kịp tốc độ.', createdAt: d(-6, 12, 0) },
  { id: 8, sessionId: 13, senderId: 9, senderName: 'Trịnh Minh Châu', receiverId: 1, rating: 3, comment: 'Hơi khó hiểu phần grammar, thầy có thể cho ví dụ thêm không?', createdAt: d(-8, 16, 0) },
  { id: 9, sessionId: 14, senderId: 10, senderName: 'Lý Thị Yến', receiverId: 1, rating: 5, comment: 'Buổi học Hóa rất bổ ích, thầy cho nhiều bài tập thực tế.', createdAt: d(-9, 13, 0) },
  { id: 10, sessionId: 17, senderId: 12, senderName: 'Trần Thị Oanh', receiverId: 1, rating: 4, comment: 'Sinh học được dạy rất sinh động, có hình ảnh minh họa.', createdAt: d(-11, 17, 0) },
  { id: 11, sessionId: 19, senderId: 13, senderName: 'Ngô Thị Lan', receiverId: 1, rating: 5, comment: 'IELTS prep cực kỳ hiệu quả, thầy cung cấp nhiều tips hay.', createdAt: d(-14, 14, 0) },
  { id: 12, sessionId: 1, senderId: 1, senderName: 'Trần Minh Tuấn', receiverId: 1, rating: 5, comment: 'Buổi học hôm nay rất hay, em đã hiểu bài rõ hơn nhiều.', createdAt: d(0, 11, 0) },
];

// ─── Transactions ──────────────────────────────────────────────────────────────
export const mockTransactions: CreditTransaction[] = [
  { id: 1, userId: 1, amount: 500000, type: 'Deposit', description: 'Nạp tiền qua chuyển khoản ngân hàng', createdAt: d(-30, 10, 0) },
  { id: 2, userId: 1, amount: 200000, type: 'SessionFee', referenceId: 5, description: 'Phí buổi dạy Toán - Trần Minh Tuấn', createdAt: d(-1, 12, 0) },
  { id: 3, userId: 1, amount: 180000, type: 'SessionFee', referenceId: 6, description: 'Phí buổi dạy Lý - Lê Hoàng Lan', createdAt: d(-2, 18, 0) },
  { id: 4, userId: 1, amount: 150000, type: 'SessionFee', referenceId: 7, description: 'Phí buổi dạy Hóa - Vũ Quang Đức', createdAt: d(-3, 15, 0) },
  { id: 5, userId: 1, amount: 200000, type: 'SessionFee', referenceId: 8, description: 'Phí buổi dạy Toán - Phạm Thu Hà', createdAt: d(-5, 17, 0) },
  { id: 6, userId: 1, amount: 170000, type: 'SessionFee', referenceId: 9, description: 'Phí buổi dạy Anh - Nguyễn Thị Mai', createdAt: d(-7, 16, 0) },
  { id: 7, userId: 1, amount: 180000, type: 'SessionFee', referenceId: 11, description: 'Phí buổi dạy Lý - Bùi Thanh Sơn', createdAt: d(-4, 20, 0) },
  { id: 8, userId: 1, amount: 50000, type: 'LateCancellationFee', referenceId: 10, description: 'Phí hủy muộn - Buổi dạy Toán (trước 24h)', createdAt: d(-10, 10, 0) },
  { id: 9, userId: 1, amount: 200000, type: 'SessionFee', referenceId: 12, description: 'Phí buổi dạy Toán - Hoàng Văn Nam', createdAt: d(-6, 14, 0) },
  { id: 10, userId: 1, amount: 170000, type: 'SessionFee', referenceId: 13, description: 'Phí buổi dạy Anh - Trịnh Minh Châu', createdAt: d(-8, 17, 0) },
  { id: 11, userId: 1, amount: 180000, type: 'SessionFee', referenceId: 14, description: 'Phí buổi dạy Hóa - Lý Thị Yến', createdAt: d(-9, 13, 0) },
  { id: 12, userId: 1, amount: 160000, type: 'SessionFee', referenceId: 17, description: 'Phí buổi dạy Sinh - Trần Thị Oanh', createdAt: d(-11, 18, 0) },
  { id: 13, userId: 1, amount: 170000, type: 'SessionFee', referenceId: 19, description: 'Phí buổi dạy Anh - Ngô Thị Lan', createdAt: d(-14, 15, 0) },
  { id: 14, userId: 1, amount: 1000000, type: 'Deposit', description: 'Nạp tiền qua ví điện tử Momo', createdAt: d(-20, 9, 0) },
  { id: 15, userId: 1, amount: 50000, type: 'Refund', referenceId: 8, description: 'Hoàn phí - buổi học bị gián đoạn', createdAt: d(-25, 11, 0) },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 1, receiverId: 1, title: 'Yêu cầu đổi lịch mới', message: 'Bùi Thanh Sơn yêu cầu đổi lịch buổi dạy Toán sang thứ 4.', isRead: false, createdAt: d(0, -1, 0) },
  { id: 2, receiverId: 1, title: 'Đánh giá mới', message: 'Trần Minh Tuấn đã đánh giá 5 sao buổi dạy Toán của bạn.', isRead: false, createdAt: d(0, -3, 0) },
  { id: 3, receiverId: 1, title: 'Nhắc nhở buổi dạy', message: 'Bạn có buổi dạy Toán với Trần Minh Tuấn trong 2 giờ tới.', isRead: true, createdAt: d(0, -5, 0) },
  { id: 4, receiverId: 1, title: 'Phản hồi từ học sinh', message: 'Lê Hoàng Lan đã gửi phản hồi về buổi dạy Lý hôm qua.', isRead: true, createdAt: d(-1, 10, 0) },
  { id: 5, receiverId: 1, title: 'Yêu cầu nạp tiền', message: 'Yêu cầu nạp 500.000đ của bạn đã được xử lý thành công.', isRead: true, createdAt: d(-2, 14, 0) },
  { id: 6, receiverId: 1, title: 'Buổi dạy bị hủy', message: 'Nguyễn Thị Mai đã hủy buổi dạy Anh Văn ngày mai.', isRead: true, createdAt: d(-3, 9, 0) },
];

// ─── Schedule Grid ─────────────────────────────────────────────────────────────
export const mockScheduleGrid: { day: number; hour: number; available: boolean }[] = (() => {
  const grid: { day: number; hour: number; available: boolean }[] = [];
  const availableSlots = [
    { day: 1, hours: [8, 9, 10, 11, 14, 15, 16, 17] },
    { day: 2, hours: [8, 9, 10, 11, 14, 15, 16, 17] },
    { day: 3, hours: [8, 9, 10, 11, 14, 15] },
    { day: 4, hours: [8, 9, 10, 11, 14, 15, 16, 17] },
    { day: 5, hours: [8, 9, 10, 11, 14, 15, 16] },
  ];
  const availableSet = new Set(
    availableSlots.flatMap(s => s.hours.map(h => `${s.day}-${h}`))
  );
  for (let day = 0; day < 7; day++) {
    for (let hour = 8; hour <= 19; hour++) {
      grid.push({ day, hour, available: availableSet.has(`${day}-${hour}`) });
    }
  }
  return grid;
})();

// ─── Chart Data ────────────────────────────────────────────────────────────────
export const weeklyActivityData = [
  { day: 'T2', sessions: 3, hours: 4.5, revenue: 800000 },
  { day: 'T3', sessions: 2, hours: 3, revenue: 540000 },
  { day: 'T4', sessions: 4, hours: 6, revenue: 1080000 },
  { day: 'T5', sessions: 1, hours: 1.5, revenue: 270000 },
  { day: 'T6', sessions: 3, hours: 4.5, revenue: 810000 },
  { day: 'T7', sessions: 2, hours: 3, revenue: 540000 },
  { day: 'CN', sessions: 0, hours: 0, revenue: 0 },
];

export const monthlyTrendData = [
  { month: 'T1', revenue: 3200000, sessions: 12 },
  { month: 'T2', revenue: 4100000, sessions: 15 },
  { month: 'T3', revenue: 3800000, sessions: 14 },
  { month: 'T4', revenue: 4600000, sessions: 17 },
  { month: 'T5', revenue: 5200000, sessions: 19 },
  { month: 'T6', revenue: 4800000, sessions: 18 },
];

export const subjectProgressData = [
  { subject: 'Toán', avgScore: 8.2, sessions: 8, completion: 75 },
  { subject: 'Lý', avgScore: 9.0, sessions: 4, completion: 85 },
  { subject: 'Anh', avgScore: 8.0, sessions: 3, completion: 70 },
  { subject: 'Hóa', avgScore: 8.0, sessions: 2, completion: 72 },
  { subject: 'Sinh', avgScore: 8.0, sessions: 1, completion: 68 },
];

export const ratingDistribution = [
  { rating: '5 sao', count: 6, percent: 50, color: '#149e61' },
  { rating: '4 sao', count: 4, percent: 33, color: '#7132f5' },
  { rating: '3 sao', count: 1, percent: 8, color: '#f59e0b' },
  { rating: '2 sao', count: 1, percent: 8, color: '#ec4899' },
  { rating: '1 sao', count: 0, percent: 0, color: '#ef4444' },
];
