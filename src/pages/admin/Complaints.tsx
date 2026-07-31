import React, { useState, useMemo } from 'react';
import {
  App, Table, Button, Input, Select, Modal, Avatar, Tag, Tooltip,
  Badge, message,
} from 'antd';
import {
  CheckOutlined, CloseOutlined, SearchOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined,
  WarningOutlined, EyeOutlined, ReloadOutlined,
  UserOutlined, BellOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import vi from 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale(vi);

// ─── Design Tokens ───────────────────────────────────────────────────────────
const T = {
  bg:            '#f0f2f5',
  card:          '#ffffff',
  cardHover:     '#ffffff',
  border:        '#e8eaed',
  borderLight:   '#f1f3f6',

  text:          '#1a1d26',
  textMuted:     '#6b7280',
  textSubtle:    '#9ca3af',

  accent:        '#4f6ef7',
  accentDark:    '#3b54d4',
  accentLight:   'rgba(79,110,247,0.08)',
  accentGlow:    'rgba(79,110,247,0.15)',

  blue:          '#3b82f6',
  blueLight:     'rgba(59,130,246,0.08)',
  green:         '#10b981',
  greenLight:    'rgba(16,185,129,0.08)',
  orange:        '#f59e0b',
  orangeLight:   'rgba(245,158,11,0.08)',
  red:           '#ef4444',
  redLight:      'rgba(239,68,68,0.08)',
  purple:        '#8b5cf6',
  purpleLight:   'rgba(139,92,246,0.08)',
  cyan:          '#06b6d4',
  cyanLight:     'rgba(6,182,212,0.08)',
};

const FONT_HEAD = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";

// ─── Types ───────────────────────────────────────────────────────────────────
type ComplaintStatus = 'Pending' | 'Resolved' | 'Dismissed';
type ComplaintType = 'LateCancellation' | 'InappropriateBehavior' | 'SessionResultDispute' | 'Other';
type ActionType = 'Warning' | 'Suspend' | 'Dismiss';

interface Complaint {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserEmail: string;
  reportedUserRole: string;
  sessionId?: string;
  sessionTitle?: string;
  type: ComplaintType;
  description: string;
  evidence?: string;
  status: ComplaintStatus;
  resolutionAction?: ActionType;
  resolutionReason?: string;
  resolvedBy?: string;
  createdAt: string;
  processedAt?: string;
  reporterAvatar: string;
  reporterAvatarColor: string;
  reportedAvatar: string;
  reportedAvatarColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'C001',
    reporterId: 'U001',
    reporterName: 'Nguyễn Minh Tuấn',
    reporterEmail: 'tuan.nguyen@gmail.com',
    reportedUserId: 'T001',
    reportedUserName: 'Trần Thị Mai Anh',
    reportedUserEmail: 'maitran.teacher@gmail.com',
    reportedUserRole: 'Gia sư',
    sessionId: 'S001',
    sessionTitle: 'Toán lớp 12 – Ôn thi tốt nghiệp',
    type: 'LateCancellation',
    description: 'Gia sư hủy buổi học lúc 21:30 cùng ngày, không có thông báo trước. Em không kịp sắp xếp lịch học替代 buổi đã đặt, ảnh hưởng đến kế hoạch ôn thi.',
    evidence: 'Tin nhắn hủy lúc 21:30, ảnh chụp cuộc trò chuyện.',
    status: 'Pending',
    createdAt: '2026-07-29T21:35:00',
    reporterAvatar: 'N',
    reporterAvatarColor: '#4f6ef7',
    reportedAvatar: 'T',
    reportedAvatarColor: '#10b981',
  },
  {
    id: 'C002',
    reporterId: 'U002',
    reporterName: 'Trần Thị Lan',
    reporterEmail: 'lan.tran@outlook.com',
    reportedUserId: 'U003',
    reportedUserName: 'Lê Hoàng Nam',
    reportedUserEmail: 'nam.le@vnu.edu.vn',
    reportedUserRole: 'Học viên',
    type: 'InappropriateBehavior',
    description: 'Gia sư có thái độ không tôn trọng, nói những lời khiếm nhã khi em hỏi bài. Em cảm thấy bị áp lực và không thoải mái khi học online.',
    evidence: 'Ghi âm buổi học, ảnh chụp tin nhắn.',
    status: 'Pending',
    createdAt: '2026-07-29T19:10:00',
    reporterAvatar: 'T',
    reporterAvatarColor: '#10b981',
    reportedAvatar: 'L',
    reportedAvatarColor: '#f59e0b',
  },
  {
    id: 'C003',
    reporterId: 'U004',
    reporterName: 'Phạm Thu Hà',
    reporterEmail: 'hapham.91@yahoo.com',
    reportedUserId: 'T002',
    reportedUserName: 'Nguyễn Văn Hùng',
    reportedUserEmail: 'hungnv.edu@outlook.com',
    reportedUserRole: 'Gia sư',
    sessionId: 'S003',
    sessionTitle: 'IELTS Reading – Luyện đề band 7.0',
    type: 'SessionResultDispute',
    description: 'Sau 10 buổi học với gia sư IELTS, kết quả thi thử không cải thiện. Gia sư không theo sát lộ trình đã cam kết, nhiều buổi học không có nội dung rõ ràng.',
    evidence: 'Bảng điểm thi thử trước/sau, lộ trình học đã ký.',
    status: 'Pending',
    createdAt: '2026-07-28T15:42:00',
    reporterAvatar: 'P',
    reporterAvatarColor: '#8b5cf6',
    reportedAvatar: 'N',
    reportedAvatarColor: '#06b6d4',
  },
  {
    id: 'C004',
    reporterId: 'U005',
    reporterName: 'Đặng Quang Đức',
    reporterEmail: 'duc.dang@gmail.com',
    reportedUserId: 'U006',
    reportedUserName: 'Vũ Thị Mai',
    reportedUserEmail: 'mai.vu@fpt.edu.vn',
    reportedUserRole: 'Học viên',
    sessionId: 'S004',
    sessionTitle: 'Tiếng Anh giao tiếp – Level A2',
    type: 'LateCancellation',
    description: 'Học viên hủy buổi học vào phút cuối 3 lần trong tuần, không có lý do chính đáng. Đã ảnh hưởng đến thu nhập và thời gian chuẩn bị của gia sư.',
    evidence: 'Lịch sử hủy trên hệ thống, tin nhắn nhắc nhở.',
    status: 'Pending',
    createdAt: '2026-07-28T11:20:00',
    reporterAvatar: 'Đ',
    reporterAvatarColor: '#ec4899',
    reportedAvatar: 'V',
    reportedAvatarColor: '#84cc16',
  },
  {
    id: 'C005',
    reporterId: 'U007',
    reporterName: 'Bùi Đình Phong',
    reporterEmail: 'phong.bui@gmail.com',
    reportedUserId: 'T003',
    reportedUserName: 'Lê Hoàng Nam',
    reportedUserEmail: 'namle.phys@gmail.com',
    reportedUserRole: 'Gia sư',
    type: 'Other',
    description: 'Gia sư yêu cầu chuyển tiền trực tiếp qua tài khoản cá nhân thay vì qua nền tảng. Em từ chối thì gia sư nói sẽ không dạy nữa.',
    evidence: 'Ảnh chụp yêu cầu chuyển khoản, tin nhắn đe dọa.',
    status: 'Pending',
    createdAt: '2026-07-27T16:55:00',
    reporterAvatar: 'B',
    reporterAvatarColor: '#3b82f6',
    reportedAvatar: 'L',
    reportedAvatarColor: '#f59e0b',
  },
  {
    id: 'C006',
    reporterId: 'U008',
    reporterName: 'Hoàng Minh Châu',
    reporterEmail: 'chau.hoang@hus.edu.vn',
    reportedUserId: 'U009',
    reportedUserName: 'Trương Thị Hương',
    reportedUserEmail: 'huong.truong@ptit.edu.vn',
    reportedUserRole: 'Học viên',
    type: 'InappropriateBehavior',
    description: 'Học viên có lời lẽ xúc phạm gia sư qua tin nhắn riêng sau khi nhận phản hồi về việc không chịu làm bài tập. Hành vi này không thể chấp nhận được.',
    evidence: 'Ảnh chụp tin nhắn xúc phạm.',
    status: 'Pending',
    createdAt: '2026-07-27T09:30:00',
    reporterAvatar: 'H',
    reporterAvatarColor: '#06b6d4',
    reportedAvatar: 'T',
    reportedAvatarColor: '#6366f1',
  },
  {
    id: 'C007',
    reporterId: 'U010',
    reporterName: 'Ngô Đức Anh',
    reporterEmail: 'anh.ngo@fe.edu.vn',
    reportedUserId: 'T004',
    reportedUserName: 'Phạm Thu Hà',
    reportedUserEmail: 'hapham.chem@vnu.edu.vn',
    reportedUserRole: 'Gia sư',
    sessionId: 'S007',
    sessionTitle: 'Hóa học lớp 11 – Chương trình mới',
    type: 'SessionResultDispute',
    description: 'Gia sư dạy sai kiến thức cơ bản về cân bằng hóa học. Sau khi kiểm tra, em phát hiện nhiều nội dung sai. Đã ảnh hưởng đến bài kiểm tra trên lớp.',
    evidence: 'Ghi âm buổi học, tài liệu gia sư gửi, kết quả bài kiểm tra.',
    status: 'Pending',
    createdAt: '2026-07-26T14:18:00',
    reporterAvatar: 'N',
    reporterAvatarColor: '#f97316',
    reportedAvatar: 'P',
    reportedAvatarColor: '#8b5cf6',
  },
  {
    id: 'C008',
    reporterId: 'U011',
    reporterName: 'Vũ Minh Khoa',
    reporterEmail: 'khoa.vu@gmail.com',
    reportedUserId: 'T005',
    reportedUserName: 'Đặng Thị Bích Ngọc',
    reportedUserEmail: 'ngoc.dang@edu.vn',
    reportedUserRole: 'Gia sư',
    type: 'LateCancellation',
    description: 'Gia sư hủy 4 buổi liên tiếp trong 2 tuần với lý do cá nhân. Mỗi lần hủy đều sát ngày hẹn, không cho em đủ thời gian tìm gia sư thay thế.',
    evidence: 'Lịch sử hủy trên hệ thống.',
    status: 'Resolved',
    resolutionAction: 'Warning',
    resolutionReason: 'Gia sư đã được nhắc nhở về chính sách hủy. Cảnh cáo lần 1, nếu tái phạm sẽ khóa tài khoản.',
    resolvedBy: 'Admin',
    processedAt: '2026-07-26T18:00:00',
    createdAt: '2026-07-25T20:45:00',
    reporterAvatar: 'V',
    reporterAvatarColor: '#10b981',
    reportedAvatar: 'Đ',
    reportedAvatarColor: '#4f6ef7',
  },
  {
    id: 'C009',
    reporterId: 'U012',
    reporterName: 'Nguyễn Thị Phương Linh',
    reporterEmail: 'linh.phuong@gmail.com',
    reportedUserId: 'U013',
    reportedUserName: 'Bùi Văn Cường',
    reportedUserEmail: 'cuong.bui@outlook.com',
    reportedUserRole: 'Học viên',
    type: 'Other',
    description: 'Học viên lan truyền thông tin sai lệch về gia sư trên mạng xã hội, ảnh hưởng nghiêm trọng đến uy tín nghề nghiệp.',
    evidence: 'Link bài đăng trên mạng xã hội, ảnh chụp bình luận.',
    status: 'Resolved',
    resolutionAction: 'Suspend',
    resolutionReason: 'Tài khoản học viên bị khóa 30 ngày. Yêu cầu gỡ bài đăng và xin lỗi công khai.',
    resolvedBy: 'Admin',
    processedAt: '2026-07-24T10:30:00',
    createdAt: '2026-07-23T11:00:00',
    reporterAvatar: 'N',
    reporterAvatarColor: '#ec4899',
    reportedAvatar: 'B',
    reportedAvatarColor: '#ef4444',
  },
  {
    id: 'C010',
    reporterId: 'U014',
    reporterName: 'Trần Đình Minh',
    reporterEmail: 'minh.tran@fe.edu.vn',
    reportedUserId: 'T006',
    reportedUserName: 'Hoàng Thị Lan',
    reportedUserEmail: 'lan.hoang@teacher.edu.vn',
    reportedUserRole: 'Gia sư',
    type: 'InappropriateBehavior',
    description: 'Gia sư so sánh năng lực của em với các học sinh khác trong buổi học, khiến em mất tự tin và tổn thương. Em yêu cầu được chuyển gia sư.',
    evidence: 'Ghi âm buổi học.',
    status: 'Dismissed',
    resolutionAction: 'Dismiss',
    resolutionReason: 'Không đủ bằng chứng xác thực cho hành vi bị cáo buộc. Đã hướng dẫn gia sư về phương pháp giảng dạy phù hợp.',
    resolvedBy: 'Admin',
    processedAt: '2026-07-22T14:00:00',
    createdAt: '2026-07-21T16:30:00',
    reporterAvatar: 'T',
    reporterAvatarColor: '#f59e0b',
    reportedAvatar: 'H',
    reportedAvatarColor: '#10b981',
  },
  {
    id: 'C011',
    reporterId: 'U015',
    reporterName: 'Lê Thị Hồng Nhung',
    reporterEmail: 'nhung.le@gmail.com',
    reportedUserId: 'T007',
    reportedUserName: 'Nguyễn Đức Thắng',
    reportedUserEmail: 'thang.nguyen@edu.vn',
    reportedUserRole: 'Gia sư',
    type: 'LateCancellation',
    description: 'Gia sư đặt lịch học nhưng không vào dạy 2 lần liên tiếp. Em chờ 30 phút mỗi lần rồi phải hủy buổi học.',
    evidence: 'Lịch sử không tham gia buổi học.',
    status: 'Resolved',
    resolutionAction: 'Warning',
    resolutionReason: 'Cảnh cáo lần 2. Gia sư được yêu cầu bồi thường 1 buổi học cho học viên.',
    resolvedBy: 'Admin',
    processedAt: '2026-07-20T11:00:00',
    createdAt: '2026-07-19T08:15:00',
    reporterAvatar: 'L',
    reporterAvatarColor: '#8b5cf6',
    reportedAvatar: 'N',
    reportedAvatarColor: '#3b82f6',
  },
  {
    id: 'C012',
    reporterId: 'U016',
    reporterName: 'Phạm Văn Đạt',
    reporterEmail: 'dat.pham@vnu.edu.vn',
    reportedUserId: 'U017',
    reportedUserName: 'Trần Thị Thu Trang',
    reportedUserEmail: 'trang.tran@fpt.edu.vn',
    reportedUserRole: 'Học viên',
    sessionId: 'S012',
    sessionTitle: 'Toán cao cấp – Giải tích 1',
    type: 'SessionResultDispute',
    description: 'Học viên yêu cầu hoàn tiền vì cho rằng buổi học không đạt chuẩn. Tuy nhiên đã có xác nhận hoàn thành buổi học từ cả hai phía.',
    evidence: 'Xác nhận hoàn thành buổi học trên hệ thống.',
    status: 'Dismissed',
    resolutionAction: 'Dismiss',
    resolutionReason: 'Không có cơ sở để hoàn tiền. Buổi học đã được xác nhận hoàn thành bởi cả hai bên.',
    resolvedBy: 'Admin',
    processedAt: '2026-07-18T16:30:00',
    createdAt: '2026-07-17T14:00:00',
    reporterAvatar: 'P',
    reporterAvatarColor: '#06b6d4',
    reportedAvatar: 'T',
    reportedAvatarColor: '#f59e0b',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getTypeLabel = (type: ComplaintType): string => {
  const labels: Record<ComplaintType, string> = {
    LateCancellation: 'Hủy muộn',
    InappropriateBehavior: 'Hành vi không phù hợp',
    SessionResultDispute: 'Tranh chấp kết quả',
    Other: 'Khác',
  };
  return labels[type];
};

const getTypeColor = (type: ComplaintType): string => {
  const colors: Record<ComplaintType, string> = {
    LateCancellation: '#f59e0b',
    InappropriateBehavior: '#ef4444',
    SessionResultDispute: '#8b5cf6',
    Other: '#6b7280',
  };
  return colors[type];
};

const getTypeBg = (type: ComplaintType): string => {
  const bgs: Record<ComplaintType, string> = {
    LateCancellation: T.orangeLight,
    InappropriateBehavior: T.redLight,
    SessionResultDispute: T.purpleLight,
    Other: 'rgba(107,114,128,0.08)',
  };
  return bgs[type];
};

const getActionLabel = (action?: ActionType): string => {
  const labels: Record<ActionType, string> = {
    Warning: 'Cảnh cáo',
    Suspend: 'Khóa tài khoản',
    Dismiss: 'Bỏ qua',
  };
  return action ? labels[action] : '—';
};

const getActionColor = (action?: ActionType): string => {
  const colors: Record<ActionType, string> = {
    Warning: T.orange,
    Suspend: T.red,
    Dismiss: T.textSubtle,
  };
  return action ? colors[action] : T.textSubtle;
};

const getActionBg = (action?: ActionType): string => {
  const bgs: Record<ActionType, string> = {
    Warning: T.orangeLight,
    Suspend: T.redLight,
    Dismiss: 'rgba(156,163,175,0.08)',
  };
  return action ? bgs[action] : 'rgba(156,163,175,0.08)';
};

// ─── Status Chip ──────────────────────────────────────────────────────────────
const StatusChip = ({ status }: { status: ComplaintStatus }) => {
  const map: Record<ComplaintStatus, { bg: string; color: string; label: string; dot: string }> = {
    Pending:    { bg: T.orangeLight,  color: T.orange,  label: 'Chờ xử lý', dot: T.orange  },
    Resolved:   { bg: T.greenLight,   color: T.green,   label: 'Đã xử lý',  dot: T.green   },
    Dismissed:  { bg: 'rgba(156,163,175,0.1)', color: T.textMuted, label: 'Đã bỏ qua', dot: T.textSubtle },
  };
  const s = map[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, icon, accentColor, sub,
}: {
  label: string; value: string; icon: React.ReactNode; accentColor: string; sub?: string;
}) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 16, padding: '18px 20px',
    display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s ease',
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: `${accentColor}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accentColor, fontSize: 18, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, marginTop: 4, fontFamily: FONT_BODY }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ─── Action Buttons ──────────────────────────────────────────────────────────
const ViewBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 12px', borderRadius: 8,
      background: T.accentLight, color: T.accent,
      border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 500, fontFamily: FONT_BODY,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accentGlow; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.accentLight; }}
  >
    <EyeOutlined style={{ fontSize: 11 }} />
  </button>
);

const ResolveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 12px', borderRadius: 8,
      background: T.greenLight, color: T.green,
      border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 500, fontFamily: FONT_BODY,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.15)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.greenLight; }}
  >
    <CheckOutlined style={{ fontSize: 11 }} />
  </button>
);

const DismissBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 12px', borderRadius: 8,
      background: 'transparent', color: T.red,
      border: `1px solid ${T.red}30`, cursor: 'pointer',
      fontSize: 12, fontWeight: 500, fontFamily: FONT_BODY,
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.redLight; (e.currentTarget as HTMLElement).style.borderColor = T.red; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = `${T.red}30`; }}
  >
    <CloseOutlined style={{ fontSize: 11 }} />
  </button>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Complaints: React.FC = () => {
  const { notification } = App.useApp();

  // ── State ──────────────────────────────────────────────────────────────────
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<ComplaintType | 'all'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [modalActionType, setModalActionType] = useState<'resolve' | 'dismiss' | null>(null);
  const [resolveAction, setResolveAction] = useState<ActionType>('Warning');
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Filtered Data ──────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.reporterName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.reporterEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        c.reportedUserName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.reportedUserEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        c.id.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesType = filterType === 'all' || c.type === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [complaints, searchText, filterStatus, filterType]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const dismissedCount = complaints.filter((c) => c.status === 'Dismissed').length;
  const totalCount = complaints.length;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setComplaints([...MOCK_COMPLAINTS]);
    setLoading(false);
    notification.success({ message: 'Đã làm mới dữ liệu', placement: 'topRight', duration: 3 });
  };

  const openViewModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalViewVisible(true);
  };

  const openActionModal = (complaint: Complaint, type: 'resolve' | 'dismiss') => {
    setSelectedComplaint(complaint);
    setModalActionType(type);
    setResolveAction('Warning');
    setRejectReason('');
  };

  const handleResolve = async () => {
    if (!rejectReason.trim()) {
      notification.warning({ message: 'Vui lòng nhập lý do xử lý', placement: 'topRight', duration: 3 });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint!.id
          ? {
              ...c,
              status: 'Resolved' as ComplaintStatus,
              resolutionAction: resolveAction,
              resolutionReason: rejectReason,
              resolvedBy: 'Admin',
              processedAt: new Date().toISOString(),
            }
          : c
      )
    );
    setSubmitting(false);
    notification.success({
      message: 'Xử lý khiếu nại thành công',
      description: (
        <div>
          Khiếu nại <strong>{selectedComplaint!.id}</strong> đã được xử lý với hành động{' '}
          <strong style={{ color: getActionColor(resolveAction) }}>{getActionLabel(resolveAction)}</strong>.
        </div>
      ),
      placement: 'topRight',
      duration: 4,
    });
    closeModals();
  };

  const handleDismiss = async () => {
    if (!rejectReason.trim()) {
      notification.warning({ message: 'Vui lòng nhập lý do bỏ qua', placement: 'topRight', duration: 3 });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint!.id
          ? {
              ...c,
              status: 'Dismissed' as ComplaintStatus,
              resolutionAction: 'Dismiss' as ActionType,
              resolutionReason: rejectReason,
              resolvedBy: 'Admin',
              processedAt: new Date().toISOString(),
            }
          : c
      )
    );
    setSubmitting(false);
    notification.info({
      message: 'Đã bỏ qua khiếu nại',
      description: `Khiếu nại ${selectedComplaint!.id} đã được đánh dấu bỏ qua. Lý do: ${rejectReason}`,
      placement: 'topRight',
      duration: 4,
    });
    closeModals();
  };

  const closeModals = () => {
    setModalViewVisible(false);
    setModalActionType(null);
    setSelectedComplaint(null);
    setRejectReason('');
    setResolveAction('Warning');
  };

  // ── Table Columns ───────────────────────────────────────────────────────────
  const columns: any[] = [
    {
      title: 'Khiếu nại',
      key: 'id',
      width: 110,
      render: (_: any, record: Complaint) => (
        <span style={{
          fontSize: 12, fontWeight: 600, color: T.accent,
          fontFamily: FONT_BODY,
          letterSpacing: '0.3px',
        }}>
          #{record.id}
        </span>
      ),
    },
    {
      title: 'Người khiếu nại',
      key: 'reporter',
      width: 200,
      render: (_: any, record: Complaint) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `${record.reporterAvatarColor}14`,
            color: record.reporterAvatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, flexShrink: 0, fontFamily: FONT_HEAD,
          }}>
            {record.reporterAvatar}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY, lineHeight: 1.3 }}>
              {record.reporterName}
            </div>
            <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2, fontFamily: FONT_BODY }}>
              {record.reporterEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Người bị khiếu nại',
      key: 'reported',
      width: 200,
      render: (_: any, record: Complaint) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `${record.reportedAvatarColor}14`,
            color: record.reportedAvatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, flexShrink: 0, fontFamily: FONT_HEAD,
          }}>
            {record.reportedAvatar}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY, lineHeight: 1.3 }}>
              {record.reportedUserName}
            </div>
            <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2, fontFamily: FONT_BODY }}>
              <Tag style={{ fontSize: 10, padding: '0 5px', margin: 0, lineHeight: '16px', borderRadius: 4 }}>
                {record.reportedUserRole}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại',
      key: 'type',
      width: 160,
      render: (_: any, record: Complaint) => (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 9999,
          background: getTypeBg(record.type), color: getTypeColor(record.type),
          fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
        }}>
          {getTypeLabel(record.type)}
        </span>
      ),
    },
    {
      title: 'Mô tả',
      key: 'description',
      width: 220,
      render: (_: any, record: Complaint) => (
        <Tooltip title={record.description}>
          <span style={{
            fontSize: 12, color: T.textMuted, fontFamily: FONT_BODY,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {record.description}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày gửi',
      key: 'createdAt',
      width: 120,
      render: (_: any, record: Complaint) => (
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, fontFamily: FONT_BODY }}>
            {dayjs(record.createdAt).format('DD/MM/YYYY')}
          </div>
          <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2, fontFamily: FONT_BODY }}>
            {dayjs(record.createdAt).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: ComplaintStatus) => <StatusChip status={status} />,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_: any, record: Complaint) =>
        record.status === 'Pending' ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <ViewBtn onClick={() => openViewModal(record)} />
            <ResolveBtn onClick={() => openActionModal(record, 'resolve')} />
            <DismissBtn onClick={() => openActionModal(record, 'dismiss')} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            <ViewBtn onClick={() => openViewModal(record)} />
            {record.resolutionAction && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 8,
                background: getActionBg(record.resolutionAction),
                color: getActionColor(record.resolutionAction),
                fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
              }}>
                {getActionLabel(record.resolutionAction)}
              </span>
            )}
          </div>
        ),
    },
  ];

  return (
    <div>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: T.text, letterSpacing: '-0.3px', fontFamily: FONT_HEAD,
          }}>
            Khiếu nại
          </h1>
          <div style={{ fontSize: 13, color: T.textSubtle, marginTop: 4, fontFamily: FONT_BODY }}>
            Xem xét và xử lý các khiếu nại từ người dùng về gia sư và buổi học
          </div>
        </div>
        <Button
          icon={<ReloadOutlined spin={loading} />}
          onClick={handleRefresh}
          disabled={loading}
          style={{
            borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, fontFamily: FONT_BODY,
            color: loading ? T.accent : T.textMuted,
            border: `1px solid ${T.border}`,
            background: loading ? T.accentLight : T.card,
            height: 38,
          }}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard
          label="Chờ xử lý"
          value={pendingCount.toString()}
          icon={<ClockCircleOutlined />}
          accentColor={T.orange}
          sub="Cần ưu tiên"
        />
        <StatCard
          label="Đã xử lý"
          value={resolvedCount.toString()}
          icon={<CheckOutlined />}
          accentColor={T.green}
          sub="Thành công"
        />
        <StatCard
          label="Đã bỏ qua"
          value={dismissedCount.toString()}
          icon={<CloseOutlined />}
          accentColor={T.textSubtle}
          sub="Không đủ cơ sở"
        />
        <StatCard
          label="Tổng khiếu nại"
          value={totalCount.toString()}
          icon={<ExclamationCircleOutlined />}
          accentColor={T.accent}
          sub="Tất cả"
        />
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: '16px 20px',
          marginBottom: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          {/* Search */}
          <Input
            placeholder="Tìm theo tên, email, nội dung, mã..."
            prefix={<SearchOutlined style={{ color: T.textSubtle, fontSize: 13 }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{
              borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
              flex: '1', minWidth: 260,
              height: 38,
            }}
          />

          {/* Filter Status */}
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ height: 38, minWidth: 150, fontFamily: FONT_BODY }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'Pending', label: 'Chờ xử lý' },
              { value: 'Resolved', label: 'Đã xử lý' },
              { value: 'Dismissed', label: 'Đã bỏ qua' },
            ]}
          />

          {/* Filter Type */}
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ height: 38, minWidth: 180, fontFamily: FONT_BODY }}
            options={[
              { value: 'all', label: 'Tất cả loại' },
              { value: 'LateCancellation', label: 'Hủy muộn' },
              { value: 'InappropriateBehavior', label: 'Hành vi không phù hợp' },
              { value: 'SessionResultDispute', label: 'Tranh chấp kết quả' },
              { value: 'Other', label: 'Khác' },
            ]}
          />

          {/* Clear Filters */}
          {(searchText || filterStatus !== 'all' || filterType !== 'all') && (
            <Button
              type="text"
              size="middle"
              icon={<CloseOutlined />}
              onClick={() => { setSearchText(''); setFilterStatus('all'); setFilterType('all'); }}
              style={{ color: T.textMuted, fontSize: 12, fontFamily: FONT_BODY, height: 38 }}
            >
              Xóa lọc
            </Button>
          )}

          {/* Result count */}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: T.textSubtle, fontFamily: FONT_BODY, flexShrink: 0,
          }}>
            <span style={{
              padding: '2px 8px', borderRadius: 9999,
              background: T.accentLight, color: T.accent,
              fontWeight: 600, fontSize: 11,
            }}>
              {filteredData.length}
            </span>
            / {complaints.length} khiếu nại
          </div>
        </div>
      </motion.div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: T.textSubtle, fontFamily: FONT_BODY }}>
                Hiển thị {range[0]}–{range[1]} trong {total} khiếu nại
              </span>
            ),
          }}
          locale={{
            emptyText: (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <ExclamationCircleOutlined style={{ color: T.textSubtle }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textMuted, marginBottom: 6, fontFamily: FONT_BODY }}>
                  Không có khiếu nại nào
                </div>
                <div style={{ fontSize: 13, color: T.textSubtle, fontFamily: FONT_BODY }}>
                  Thử thay đổi bộ lọc hoặc tìm kiếm
                </div>
              </div>
            ),
          }}
          style={{ fontFamily: FONT_BODY }}
        />
      </div>

      {/* ── View Detail Modal ───────────────────────────────────────────────── */}
      <Modal
        title={null}
        open={modalViewVisible}
        onCancel={closeModals}
        footer={null}
        width={580}
        centered
        styles={{
          body: { padding: 0 },
          content: { borderRadius: 16, overflow: 'hidden', fontFamily: FONT_BODY },
        }}
      >
        {selectedComplaint && (
          <div>
            {/* Modal Header */}
            <div style={{
              background: T.accentLight,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: `1px solid ${T.accent}18`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${T.accent}18`, color: T.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                <ExclamationCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD }}>
                  Chi tiết khiếu nại #{selectedComplaint.id}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, fontFamily: FONT_BODY }}>
                  {dayjs(selectedComplaint.createdAt).format('DD/MM/YYYY')} lúc {dayjs(selectedComplaint.createdAt).format('HH:mm')}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* Status + Type Row */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                <StatusChip status={selectedComplaint.status} />
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 9999,
                  background: getTypeBg(selectedComplaint.type),
                  color: getTypeColor(selectedComplaint.type),
                  fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
                }}>
                  {getTypeLabel(selectedComplaint.type)}
                </span>
                {selectedComplaint.sessionTitle && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 9999,
                    background: T.blueLight, color: T.blue,
                    fontSize: 11, fontWeight: 500, fontFamily: FONT_BODY,
                  }}>
                    {selectedComplaint.sessionTitle}
                  </span>
                )}
              </div>

              {/* Reporter + Reported Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: `${T.accent}06`, border: `1px solid ${T.accent}12`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT_BODY }}>
                    Người khiếu nại
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: `${selectedComplaint.reporterAvatarColor}14`,
                      color: selectedComplaint.reporterAvatarColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 12, fontFamily: FONT_HEAD,
                    }}>
                      {selectedComplaint.reporterAvatar}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY }}>
                      {selectedComplaint.reporterName}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textSubtle, fontFamily: FONT_BODY }}>
                    {selectedComplaint.reporterEmail}
                  </div>
                </div>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: `${T.red}06`, border: `1px solid ${T.red}12`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT_BODY }}>
                    Người bị khiếu nại
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: `${selectedComplaint.reportedAvatarColor}14`,
                      color: selectedComplaint.reportedAvatarColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 12, fontFamily: FONT_HEAD,
                    }}>
                      {selectedComplaint.reportedAvatar}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY }}>
                      {selectedComplaint.reportedUserName}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textSubtle, fontFamily: FONT_BODY }}>
                    {selectedComplaint.reportedUserEmail}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, fontFamily: FONT_BODY }}>
                  Nội dung khiếu nại
                </div>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: T.borderLight, border: `1px solid ${T.border}`,
                  fontSize: 13, color: T.text, lineHeight: 1.6, fontFamily: FONT_BODY,
                }}>
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Evidence */}
              {selectedComplaint.evidence && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, fontFamily: FONT_BODY }}>
                    Bằng chứng đính kèm
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: T.orangeLight, border: `1px solid ${T.orange}20`,
                    fontSize: 12, color: T.textMuted, lineHeight: 1.5, fontFamily: FONT_BODY,
                  }}>
                    {selectedComplaint.evidence}
                  </div>
                </div>
              )}

              {/* Resolution (if processed) */}
              {selectedComplaint.status !== 'Pending' && (
                <div style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: T.greenLight, border: `1px solid ${T.green}18`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.green, marginBottom: 8, fontFamily: FONT_BODY }}>
                    Kết quả xử lý
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    {selectedComplaint.resolutionAction && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '2px 8px', borderRadius: 6,
                        background: getActionBg(selectedComplaint.resolutionAction),
                        color: getActionColor(selectedComplaint.resolutionAction),
                        fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
                      }}>
                        {getActionLabel(selectedComplaint.resolutionAction)}
                      </span>
                    )}
                    {selectedComplaint.resolvedBy && (
                      <span style={{ fontSize: 11, color: T.textSubtle, fontFamily: FONT_BODY }}>
                        bởi {selectedComplaint.resolvedBy}
                      </span>
                    )}
                    {selectedComplaint.processedAt && (
                      <span style={{ fontSize: 11, color: T.textSubtle, fontFamily: FONT_BODY }}>
                        • {dayjs(selectedComplaint.processedAt).format('DD/MM/YYYY HH:mm')}
                      </span>
                    )}
                  </div>
                  {selectedComplaint.resolutionReason && (
                    <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5, fontFamily: FONT_BODY }}>
                      {selectedComplaint.resolutionReason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Resolve Modal ──────────────────────────────────────────────────── */}
      <Modal
        title={null}
        open={modalActionType === 'resolve'}
        onCancel={closeModals}
        footer={null}
        width={520}
        centered
        styles={{
          body: { padding: 0 },
          content: { borderRadius: 16, overflow: 'hidden', fontFamily: FONT_BODY },
        }}
      >
        {selectedComplaint && (
          <div>
            <div style={{
              background: T.greenLight,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: `1px solid ${T.green}18`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${T.green}18`, color: T.green,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                <CheckOutlined />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD }}>
                  Xử lý khiếu nại
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, fontFamily: FONT_BODY }}>
                  Khiếu nại #{selectedComplaint.id}
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Quick Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: `${T.accent}06`, border: `1px solid ${T.accent}12`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT_BODY }}>
                    Người khiếu nại
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY }}>
                    {selectedComplaint.reporterName}
                  </div>
                </div>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: `${T.red}06`, border: `1px solid ${T.red}12`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: FONT_BODY }}>
                    Người bị khiếu nại
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY }}>
                    {selectedComplaint.reportedUserName}
                  </div>
                </div>
              </div>

              {/* Action Type */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, fontFamily: FONT_BODY }}>
                  Hành động xử lý <span style={{ color: T.red }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(['Warning', 'Suspend'] as ActionType[]).map((action) => (
                    <button
                      key={action}
                      onClick={() => setResolveAction(action)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '7px 14px', borderRadius: 8,
                        background: resolveAction === action
                          ? (action === 'Warning' ? T.orangeLight : T.redLight)
                          : T.borderLight,
                        color: resolveAction === action
                          ? (action === 'Warning' ? T.orange : T.red)
                          : T.textMuted,
                        border: `1px solid ${resolveAction === action ? (action === 'Warning' ? `${T.orange}40` : `${T.red}40`) : T.border}`,
                        cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {action === 'Warning' ? (
                        <WarningOutlined style={{ fontSize: 12 }} />
                      ) : (
                        <DeleteOutlined style={{ fontSize: 12 }} />
                      )}
                      {getActionLabel(action)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, fontFamily: FONT_BODY }}>
                  Lý do / Mô tả xử lý <span style={{ color: T.red }}>*</span>
                </div>
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập lý do xử lý chi tiết..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY }}
                />
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button
                  onClick={closeModals}
                  style={{
                    borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
                    height: 38,
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  loading={submitting}
                  onClick={handleResolve}
                  style={{
                    borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
                    height: 38,
                    background: T.green, borderColor: T.green,
                  }}
                >
                  Xác nhận xử lý
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Dismiss Modal ──────────────────────────────────────────────────── */}
      <Modal
        title={null}
        open={modalActionType === 'dismiss'}
        onCancel={closeModals}
        footer={null}
        width={480}
        centered
        styles={{
          body: { padding: 0 },
          content: { borderRadius: 16, overflow: 'hidden', fontFamily: FONT_BODY },
        }}
      >
        {selectedComplaint && (
          <div>
            <div style={{
              background: T.redLight,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: `1px solid ${T.red}18`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${T.red}18`, color: T.red,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                <CloseOutlined />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: FONT_HEAD }}>
                  Bỏ qua khiếu nại
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2, fontFamily: FONT_BODY }}>
                  Khiếu nại #{selectedComplaint.id}
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Info */}
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: T.borderLight, border: `1px solid ${T.border}`,
                marginBottom: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: `${selectedComplaint.reporterAvatarColor}14`,
                    color: selectedComplaint.reporterAvatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 12, fontFamily: FONT_HEAD,
                  }}>
                    {selectedComplaint.reporterAvatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: FONT_BODY }}>
                      {selectedComplaint.reporterName}
                    </div>
                    <div style={{ fontSize: 11, color: T.textSubtle, fontFamily: FONT_BODY }}>
                      khiếu nại {selectedComplaint.reportedUserName}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: 12, color: T.textMuted, lineHeight: 1.5, fontFamily: FONT_BODY,
                  paddingLeft: 36,
                }}>
                  "{selectedComplaint.description.substring(0, 120)}{selectedComplaint.description.length > 120 ? '…' : ''}"
                </div>
              </div>

              {/* Warning */}
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: T.redLight, border: `1px solid ${T.red}18`,
                marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <WarningOutlined style={{ color: T.red, fontSize: 13, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 12, color: T.red, lineHeight: 1.5, fontFamily: FONT_BODY }}>
                  Khiếu nại sẽ được đánh dấu là "Đã bỏ qua". Người khiếu nại sẽ không được thông báo tự động.
                </span>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, fontFamily: FONT_BODY }}>
                  Lý do bỏ qua <span style={{ color: T.red }}>*</span>
                </div>
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập lý do bỏ qua khiếu nại (VD: Không đủ bằng chứng, không thuộc phạm vi xử lý...)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY }}
                />
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button
                  onClick={closeModals}
                  style={{
                    borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
                    height: 38,
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  danger
                  loading={submitting}
                  onClick={handleDismiss}
                  style={{
                    borderRadius: 10, fontSize: 13, fontFamily: FONT_BODY,
                    height: 38,
                  }}
                >
                  Xác nhận bỏ qua
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
