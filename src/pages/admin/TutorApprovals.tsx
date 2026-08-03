import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckOutlined, CloseOutlined, UserOutlined,
  MailOutlined, ExclamationCircleOutlined, ArrowRightOutlined,
  StarOutlined, CalendarOutlined, RiseOutlined,
  FallOutlined, SyncOutlined,
  AppstoreOutlined, BarsOutlined, EyeOutlined,
} from '@ant-design/icons';
import { App, Modal } from 'antd';
import dayjs from 'dayjs';

// ─── Design Tokens (Apple Design System) ──────────────────────────────────────
const T = {
  canvas:       '#ffffff',
  parchment:    '#f5f5f7',
  ink:          '#1d1d1f',
  inkMuted80:   '#333333',
  inkMuted48:   '#7a7a7a',
  hairline:     '#e0e0e0',
  dividerSoft:  'rgba(0,0,0,0.04)',
  primary:      '#0066cc',
  primaryDark:  '#0052a3',
  primaryLight: 'rgba(0,102,204,0.06)',
  green:        '#34c759',
  greenLight:   'rgba(52,199,89,0.08)',
  red:          '#ff3b30',
  redLight:     'rgba(255,59,48,0.08)',
  orange:       '#ff9500',
  orangeLight:  'rgba(255,149,0,0.08)',
  textSubtle:   '#86868b',
  bg:           '#f5f5f7',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_TUTORS = [
  {
    id: '1',
    fullName: 'Trần Thị Mai Anh',
    email: 'maitran.teacher@gmail.com',
    bio: 'Gia sư Toán với 5 năm kinh nghiệm giảng dạy tại trường THPT chuyên. Yêu thích phương pháp giáo dục hiện đại, luôn tìm cách truyền cảm hứng cho học sinh qua từng bài giảng.',
    qualifications: 'Thạc sĩ Sư phạm Toán - ĐH Sư phạm Hà Nội; Chứng chỉ bồi dưỡng kiến thức chuyên môn 2024; Giải thưởng Giao sư xuất sắc cấp thành phố 2023.',
    subjects: [
      { subjectId: '1', subjectName: 'Toán' },
      { subjectId: '2', subjectName: 'Toán cao cấp' },
    ],
    rating: 4.9,
    studentCount: 38,
    joinDate: '2026-07-20',
    avatar: 'T',
    avatarColor: '#0066cc',
    status: 'Pending',
  },
  {
    id: '2',
    fullName: 'Nguyễn Văn Hùng',
    email: 'hungnv.edu@outlook.com',
    bio: 'Gia sư tiếng Anh giao tiếp và luyện thi IELTS. Đã hỗ trợ hơn 60 học sinh đạt band 6.5+ trong vòng 3 tháng. Phong cách giảng dạy thực tế, tập trung vào kỹ năng.',
    qualifications: 'Cử nhân Sư phạm Tiếng Anh - ĐH Ngoại ngữ; IELTS 8.0 Overall; Chứng chỉ TESOL 120 giờ.',
    subjects: [
      { subjectId: '3', subjectName: 'Tiếng Anh' },
      { subjectId: '4', subjectName: 'IELTS' },
    ],
    rating: 4.8,
    studentCount: 27,
    joinDate: '2026-07-18',
    avatar: 'N',
    avatarColor: '#34c759',
    status: 'Pending',
  },
  {
    id: '3',
    fullName: 'Lê Hoàng Nam',
    email: 'namle.phys@gmail.com',
    bio: 'Gia sư Vật lý chuyên ôn thi ĐH. Thành thạo chương trình lớp 10-12 và luyện thi chuyên. Đam mê nghiên cứu khoa học và luôn cố gắng giúp học sinh hiểu bản chất vấn đề.',
    qualifications: 'Kỹ sư Vật lý kỹ thuật - ĐH Bách khoa TP.HCM; 3 năm kinh nghiệm luyện thi ĐH; Tác giả bộ đề luyện thi Vật lý 2025.',
    subjects: [
      { subjectId: '5', subjectName: 'Vật lý' },
      { subjectId: '6', subjectName: 'Luyện thi ĐH' },
    ],
    rating: 4.7,
    studentCount: 0,
    joinDate: '2026-07-22',
    avatar: 'L',
    avatarColor: '#ff9500',
    status: 'Pending',
  },
  {
    id: '4',
    fullName: 'Phạm Thu Hà',
    email: 'hapham.chem@vnu.edu.vn',
    bio: 'Gia sư Hóa học với chuyên môn vững chắc, giảng dạy theo phương pháp sơ đồ tư duy. Đặc biệt giỏi hướng dẫn học sinh yếu lấy lại nền tảng từ đầu.',
    qualifications: 'Thạc sĩ Hóa học - ĐH Quốc gia Hà Nội; Giảng viên ĐH; 10+ năm kinh nghiệm giảng dạy và luyện thi.',
    subjects: [
      { subjectId: '7', subjectName: 'Hóa học' },
    ],
    rating: 4.9,
    studentCount: 51,
    joinDate: '2026-07-15',
    avatar: 'P',
    avatarColor: '#8b5cf6',
    status: 'Pending',
  },
  {
    id: '5',
    fullName: 'Đặng Quang Đức',
    email: 'ducdang.lit@gmail.com',
    bio: 'Gia sư Ngữ văn chuyên ôn thi và nâng cao kỹ năng viết. Giúp học sinh phát triển tư duy phản biện và khả năng diễn đạt bằng văn bản một cách mạch lạc.',
    qualifications: 'Cử nhân Ngữ văn - ĐH Khoa học Xã hội và Nhân văn; 4 năm kinh nghiệm luyện thi Văn vào lớp 10 và ĐH.',
    subjects: [
      { subjectId: '8', subjectName: 'Ngữ văn' },
      { subjectId: '9', subjectName: 'Luyện thi Văn' },
    ],
    rating: 4.6,
    studentCount: 19,
    joinDate: '2026-07-21',
    avatar: 'Đ',
    avatarColor: '#007aff',
    status: 'Pending',
  },
  {
    id: '6',
    fullName: 'Vũ Thị Mai Lan',
    email: 'lanvu.sin@gmail.com',
    bio: 'Gia sư Sinh học với phương pháp học tập qua thực hành. Sử dụng sơ đồ, hình ảnh và mô hình 3D để giúp học sinh dễ dàng tiếp thu kiến thức phức tạp.',
    qualifications: 'Cử nhân Sinh học - ĐH Y Dược TP.HCM; Chứng chỉ giảng dạy STEM 2024; 6 năm kinh nghiệm.',
    subjects: [
      { subjectId: '10', subjectName: 'Sinh học' },
      { subjectId: '11', subjectName: 'Luyện thi ĐH' },
    ],
    rating: 4.8,
    studentCount: 33,
    joinDate: '2026-07-19',
    avatar: 'V',
    avatarColor: '#34c759',
    status: 'Pending',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FONT_HEAD = "'SF Pro Display', system-ui, -apple-system, sans-serif";
const FONT_BODY = "'SF Pro Text', system-ui, -apple-system, sans-serif";

const SubjectTag = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
    background: `${color}12`,
    color: color,
    border: `1px solid ${color}22`,
    fontFamily: FONT_BODY,
    letterSpacing: '-0.01em',
  }}>
    {label}
  </span>
);

const StatusChip = ({ status }: { status: string }) => {
  const isPending = status === 'Pending';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 10px',
      borderRadius: 9999,
      fontSize: 11,
      fontWeight: 600,
      background: isPending ? T.orangeLight : T.greenLight,
      color: isPending ? T.orange : T.green,
      fontFamily: FONT_BODY,
    }}>
      <ExclamationCircleOutlined style={{ fontSize: 10 }} />
      Chờ duyệt
    </span>
  );
};

const ApproveBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="action-btn-approve"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '7px 16px',
      borderRadius: 9999,
      background: T.primary,
      color: '#ffffff',
      border: 'none',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: FONT_BODY,
      cursor: 'pointer',
      transition: 'background 0.15s, transform 0.1s',
      letterSpacing: '-0.01em',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.background = T.primaryDark;
      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.background = T.primary;
      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
    }}
    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'; }}
    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
  >
    <CheckOutlined style={{ fontSize: 12 }} />
    Duyệt
  </button>
);

const RejectBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="action-btn-reject"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '7px 20px',
      minWidth: 120,
      borderRadius: 9999,
      background: T.canvas,
      color: T.inkMuted80,
      border: '1px solid rgba(0,0,0,0.1)',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: FONT_BODY,
      cursor: 'pointer',
      transition: 'background 0.15s, border-color 0.15s, transform 0.1s, min-width 0.15s',
      letterSpacing: '-0.01em',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.borderColor = T.red;
      (e.currentTarget as HTMLButtonElement).style.color = T.red;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)';
      (e.currentTarget as HTMLButtonElement).style.color = T.inkMuted80;
    }}
    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'; }}
    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
  >
    <CloseOutlined style={{ fontSize: 12 }} />
    Từ chối
  </button>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const TutorModal = ({
  tutor,
  mode,
  onClose,
  onApprove,
  onReject,
  rejectReason,
  onRejectReason,
}: {
  tutor: typeof MOCK_TUTORS[0] | null;
  mode: 'approve' | 'reject';
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  rejectReason: string;
  onRejectReason: (v: string) => void;
}) => {
  if (!tutor) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          background: T.canvas,
          borderRadius: 18,
          width: '100%',
          maxWidth: 520,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 18px',
          borderBottom: `1px solid ${T.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: 17, fontWeight: 600,
              fontFamily: FONT_HEAD, color: T.ink, letterSpacing: '-0.2px',
            }}>
              {mode === 'approve' ? 'Duyệt hồ sơ gia sư' : 'Từ chối hồ sơ gia sư'}
            </h2>
            <p style={{
              margin: '3px 0 0', fontSize: 12, color: T.inkMuted48,
              fontFamily: FONT_BODY,
            }}>
              {mode === 'approve'
                ? 'Xác nhận duyệt để gia sư có thể bắt đầu nhận học sinh.'
                : 'Vui lòng nhập lý do từ chối để gia sư biết.'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: T.parchment, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: T.inkMuted48,
              fontSize: 14, transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.hairline; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
          >
            ✕
          </button>
        </div>

        {/* Tutor Card */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px',
            background: T.parchment,
            borderRadius: 14,
            marginBottom: 16,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${tutor.avatarColor}14`,
              border: `1px solid ${tutor.avatarColor}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 500,
              color: tutor.avatarColor,
              fontFamily: FONT_HEAD,
              flexShrink: 0,
            }}>
              {tutor.avatar}
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 600, color: T.ink,
                fontFamily: FONT_HEAD, letterSpacing: '-0.1px',
              }}>{tutor.fullName}</div>
              <div style={{
                fontSize: 12, color: T.inkMuted48,
                fontFamily: FONT_BODY, marginTop: 2,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <MailOutlined style={{ fontSize: 11 }} />
                {tutor.email}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginTop: 5,
                flexWrap: 'wrap',
              }}>
                {tutor.subjects.map(s => (
                  <SubjectTag key={s.subjectId} label={s.subjectName} color={tutor.avatarColor} />
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: T.inkMuted48,
              fontFamily: FONT_BODY, letterSpacing: '0.3px',
              textTransform: 'uppercase', marginBottom: 6,
            }}>Giới thiệu</div>
            <p style={{
              margin: 0, fontSize: 13, color: T.inkMuted80,
              fontFamily: FONT_BODY, lineHeight: 1.55,
              letterSpacing: '-0.01em',
            }}>
              {tutor.bio.length > 200 ? tutor.bio.substring(0, 200) + '…' : tutor.bio}
            </p>
          </div>

          {/* Qualifications */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: T.inkMuted48,
              fontFamily: FONT_BODY, letterSpacing: '0.3px',
              textTransform: 'uppercase', marginBottom: 6,
            }}>Trình độ & Kinh nghiệm</div>
            <p style={{
              margin: 0, fontSize: 13, color: T.inkMuted80,
              fontFamily: FONT_BODY, lineHeight: 1.55,
              letterSpacing: '-0.01em',
            }}>
              {tutor.qualifications.length > 200
                ? tutor.qualifications.substring(0, 200) + '…'
                : tutor.qualifications}
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10, marginBottom: 16,
          }}>
            {[
              { label: 'Điểm uy tín', value: `★ ${tutor.rating}`, color: T.orange },
              { label: 'Học sinh', value: `${tutor.studentCount}`, color: T.primary },
              { label: 'Ngày đăng ký', value: dayjs(tutor.joinDate).format('DD/MM/YY'), color: T.inkMuted48 },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '10px 12px',
                background: T.parchment,
                borderRadius: 12,
                textAlign: 'center',
                border: `1px solid ${T.hairline}`,
              }}>
                <div style={{
                  fontSize: 16, fontWeight: 600, color: item.color,
                  fontFamily: FONT_HEAD, letterSpacing: '-0.2px',
                }}>{item.value}</div>
                <div style={{
                  fontSize: 10, color: T.inkMuted48,
                  fontFamily: FONT_BODY, marginTop: 2,
                }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Reject reason input */}
          {mode === 'reject' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: T.ink,
                fontFamily: FONT_BODY, marginBottom: 6,
              }}>Lý do từ chối</div>
              <textarea
                value={rejectReason}
                onChange={e => onRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối hồ sơ gia sư này..."
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px',
                  borderRadius: 11,
                  border: `1px solid ${T.hairline}`,
                  fontSize: 13, fontFamily: FONT_BODY,
                  color: T.ink, resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: T.canvas,
                  lineHeight: 1.5,
                  letterSpacing: '-0.01em',
                }}
                onFocus={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = T.primary; }}
                onBlur={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = T.hairline; }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${T.hairline}`,
          display: 'flex', gap: 10, justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', borderRadius: 9999,
              background: T.canvas, color: T.inkMuted80,
              border: `1px solid rgba(0,0,0,0.1)`,
              fontSize: 13, fontWeight: 500, fontFamily: FONT_BODY,
              cursor: 'pointer', transition: 'background 0.15s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.canvas; }}
          >
            Hủy
          </button>
          <button
            onClick={mode === 'approve' ? onApprove : onReject}
            style={{
              padding: '8px 20px', borderRadius: 9999,
              background: mode === 'approve' ? T.green : T.red,
              color: '#ffffff', border: 'none',
              fontSize: 13, fontWeight: 500, fontFamily: FONT_BODY,
              cursor: 'pointer', transition: 'opacity 0.15s, transform 0.1s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
          >
            {mode === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Page Component ────────────────────────────────────────────────────────────
const TutorApprovals: React.FC = () => {
  const { notification } = App.useApp();
  const [tutors] = useState(MOCK_TUTORS);
  const [selectedTutor, setSelectedTutor] = useState<typeof MOCK_TUTORS[0] | null>(null);
  const [modalMode, setModalMode] = useState<'approve' | 'reject'>('approve');
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const openModal = (tutor: typeof MOCK_TUTORS[0], mode: 'approve' | 'reject') => {
    setSelectedTutor(tutor);
    setModalMode(mode);
    setModalOpen(true);
    setRejectReason('');
  };

  const handleApprove = () => {
    if (!selectedTutor) return;
    setApproved(prev => [...prev, selectedTutor.id]);
    setModalOpen(false);
    setSelectedTutor(null);
    notification.success({
      message: 'Xác nhận thành công',
      description: `Hồ sơ gia sư "${selectedTutor.fullName}" đã được duyệt.`,
      placement: 'topRight',
      duration: 5,
    });
  };

  const handleReject = () => {
    if (!selectedTutor || !rejectReason.trim()) return;
    Modal.confirm({
      title: 'Xác nhận hủy bỏ',
      icon: <ExclamationCircleOutlined style={{ color: T.red }} />,
      content: `Bạn có chắc chắn muốn từ chối hồ sơ gia sư "${selectedTutor.fullName}" không?`,
      okText: 'Xác nhận hủy bỏ',
      cancelText: ' Quay lại',
      okButtonProps: { style: { background: T.red, borderColor: T.red } },
      cancelButtonProps: {},
      onOk: () => {
        setRejected(prev => [...prev, selectedTutor.id]);
        setModalOpen(false);
        setSelectedTutor(null);
        setRejectReason('');
        notification.success({
          message: 'Đã hủy bỏ',
          description: `Hồ sơ gia sư "${selectedTutor.fullName}" đã bị từ chối.`,
          placement: 'topRight',
          duration: 5,
        });
      },
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshKey(k => k + 1);
      setApproved([]);
      setRejected([]);
      setRefreshing(false);
    }, 800);
  };

  const pendingTutors = tutors.filter(t => !approved.includes(t.id) && !rejected.includes(t.id));

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        marginBottom: 24,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            color: T.ink,
            fontFamily: FONT_HEAD,
            letterSpacing: '-0.3px',
          }}>
            Duyệt hồ sơ gia sư
          </h1>
          <p style={{
            margin: '5px 0 0',
            fontSize: 13,
            color: T.inkMuted48,
            fontFamily: FONT_BODY,
          }}>
            Xem xét và phê duyệt hồ sơ gia sư mới tham gia nền tảng
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px',
              background: T.primaryLight,
              border: `1px solid rgba(255,149,0,0.15)`,
              borderRadius: 9999,
              fontSize: 12, fontWeight: 600, color: T.primary,
              fontFamily: FONT_BODY,
            }}>
              <ExclamationCircleOutlined style={{ fontSize: 11 }} />
              {pendingTutors.length} chờ duyệt
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px',
              background: T.greenLight,
              border: `1px solid rgba(52,199,89,0.15)`,
              borderRadius: 9999,
              fontSize: 12, fontWeight: 600, color: T.green,
              fontFamily: FONT_BODY,
            }}>
              <CheckOutlined style={{ fontSize: 11 }} />
              {approved.length} đã duyệt
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px',
              background: T.redLight,
              border: `1px solid rgba(255,59,48,0.15)`,
              borderRadius: 9999,
              fontSize: 12, fontWeight: 600, color: T.red,
              fontFamily: FONT_BODY,
            }}>
              <CloseOutlined style={{ fontSize: 11 }} />
              {rejected.length} đã từ chối
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 9999,
              background: refreshing ? T.primaryLight : T.canvas,
              color: refreshing ? T.primary : T.inkMuted80,
              border: `1px solid ${refreshing ? 'rgba(0,102,204,0.2)' : 'rgba(0,0,0,0.08)'}`,
              fontSize: 13, fontWeight: 500, fontFamily: FONT_BODY,
              cursor: refreshing ? 'default' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              if (!refreshing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.primary;
                (e.currentTarget as HTMLButtonElement).style.color = T.primary;
              }
            }}
            onMouseLeave={e => {
              if (!refreshing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLButtonElement).style.color = T.inkMuted80;
              }
            }}
          >
            <SyncOutlined spin={refreshing} style={{ fontSize: 12 }} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </button>

          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            background: T.parchment,
            border: `1px solid ${T.hairline}`,
            borderRadius: 10,
            padding: 2,
            gap: 2,
          }}>
            {(['grid', 'list'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 30,
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === mode ? T.canvas : 'transparent',
                  color: viewMode === mode ? T.primary : T.inkMuted48,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {mode === 'grid' ? (
                  <AppstoreOutlined style={{ fontSize: 14 }} />
                ) : (
                  <BarsOutlined style={{ fontSize: 14 }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pending count bar ─────────────────────────────────────────── */}
      {pendingTutors.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 20px',
          background: T.canvas,
          border: `1px solid ${T.hairline}`,
          borderRadius: 14,
          marginBottom: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: T.primaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.primary, flexShrink: 0,
          }}>
            <UserOutlined style={{ fontSize: 16 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: T.ink,
              fontFamily: FONT_BODY,
            }}>
              {pendingTutors.length} hồ sơ gia sư đang chờ xem xét
            </div>
            <div style={{
              fontSize: 12, color: T.inkMuted48,
              fontFamily: FONT_BODY, marginTop: 1,
            }}>
              Xem chi tiết từng hồ sơ, kiểm tra trình độ và xác nhận duyệt hoặc từ chối.
            </div>
          </div>-
        </div>
      )}

      {/* ── Tutor Cards ───────────────────────────────────────────────── */}
      {pendingTutors.length === 0 ? (
        <div style={{
          padding: '80px 20px',
          textAlign: 'center',
          background: T.canvas,
          border: `1px solid ${T.hairline}`,
          borderRadius: 18,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: T.greenLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            color: T.green, fontSize: 24,
          }}>
            <CheckOutlined />
          </div>
          <h3 style={{
            margin: '0 0 8px', fontSize: 17, fontWeight: 600,
            fontFamily: FONT_HEAD, color: T.ink, letterSpacing: '-0.2px',
          }}>
            Tất cả đã xử lý
          </h3>
          <p style={{
            margin: 0, fontSize: 13, color: T.inkMuted48,
            fontFamily: FONT_BODY,
          }}>
            Không có hồ sơ gia sư nào đang chờ duyệt. Quay lại Dashboard để xem tổng quan.
          </p>
          <Link
            to="/admin/dashboard"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 20, padding: '9px 22px', borderRadius: 9999,
              background: T.primary, color: '#ffffff',
              fontSize: 13, fontWeight: 500, fontFamily: FONT_BODY,
              textDecoration: 'none', letterSpacing: '-0.01em',
            }}
          >
            Quay lại Dashboard
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 14,
        }}>
          {pendingTutors.map((tutor, index) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                background: T.canvas,
                border: `1px solid ${T.hairline}`,
                borderRadius: 18,
                padding: '20px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${tutor.avatarColor}44`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.06)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = T.hairline;
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${tutor.avatarColor}14`,
                  border: `1px solid ${tutor.avatarColor}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 500,
                  color: tutor.avatarColor,
                  fontFamily: FONT_HEAD,
                  flexShrink: 0,
                }}>
                  {tutor.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600, color: T.ink,
                    fontFamily: FONT_HEAD, letterSpacing: '-0.1px',
                    lineHeight: 1.2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {tutor.fullName}
                  </div>
                  <div style={{
                    fontSize: 12, color: T.inkMuted48,
                    fontFamily: FONT_BODY, marginTop: 3,
                    display: 'flex', alignItems: 'center', gap: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    <MailOutlined style={{ fontSize: 11, flexShrink: 0 }} />
                    {tutor.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                    <StatusChip status={tutor.status} />
                    <span style={{
                      fontSize: 11, color: T.inkMuted48,
                      fontFamily: FONT_BODY,
                    }}>
                      {dayjs(tutor.joinDate).format('DD/MM/YYYY')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 12 }}>
                <p style={{
                  margin: 0, fontSize: 12.5, color: T.inkMuted80,
                  fontFamily: FONT_BODY, lineHeight: 1.55,
                  letterSpacing: '-0.01em',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {tutor.bio}
                </p>
              </div>

              {/* Subjects */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                {tutor.subjects.map(s => (
                  <SubjectTag key={s.subjectId} label={s.subjectName} color={tutor.avatarColor} />
                ))}
              </div>

              {/* Qualifications preview */}
              <div style={{
                padding: '10px 12px',
                background: T.parchment,
                borderRadius: 11,
                marginBottom: 14,
                border: `1px solid ${T.hairline}`,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, color: T.inkMuted48,
                  fontFamily: FONT_BODY, letterSpacing: '0.3px',
                  textTransform: 'uppercase', marginBottom: 4,
                }}>Trình độ</div>
                <p style={{
                  margin: 0, fontSize: 12, color: T.inkMuted80,
                  fontFamily: FONT_BODY, lineHeight: 1.5,
                  letterSpacing: '-0.01em',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {tutor.qualifications}
                </p>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 8, marginBottom: 14,
              }}>
                {[
                  {
                    icon: <StarOutlined style={{ fontSize: 11 }} />,
                    label: 'Điểm uy tín',
                    value: `★ ${tutor.rating}`,
                    color: T.primary,
                  },
                  {
                    icon: <UserOutlined style={{ fontSize: 11 }} />,
                    label: 'Học sinh',
                    value: `${tutor.studentCount} hs`,
                    color: T.primary,
                  },
                ].map((item) => (
                  <div key={item.label} style={{
                    padding: '8px 10px',
                    background: T.parchment,
                    borderRadius: 10,
                    border: `1px solid ${T.hairline}`,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: `${item.color}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.color, flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: item.color,
                        fontFamily: FONT_HEAD, letterSpacing: '-0.1px', lineHeight: 1,
                      }}>{item.value}</div>
                      <div style={{
                        fontSize: 10, color: T.inkMuted48,
                        fontFamily: FONT_BODY, marginTop: 1,
                      }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 7 }}>
                <button
                  onClick={() => navigate(`/admin/tutor/${tutor.id}`)}
                  title="Xem chi tiết"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: 9999,
                    background: T.parchment,
                    color: T.inkMuted48,
                    border: `1px solid ${T.hairline}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.primary;
                    (e.currentTarget as HTMLButtonElement).style.color = T.primary;
                    (e.currentTarget as HTMLButtonElement).style.background = T.primaryLight;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.hairline;
                    (e.currentTarget as HTMLButtonElement).style.color = T.inkMuted48;
                    (e.currentTarget as HTMLButtonElement).style.background = T.parchment;
                  }}
                >
                  <EyeOutlined style={{ fontSize: 13 }} />
                </button>
                <div style={{ flex: 1 }}>
                  <ApproveBtn onClick={() => openModal(tutor, 'approve')} />
                </div>
                <RejectBtn onClick={() => openModal(tutor, 'reject')} />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ── List View ─────────────────────────────────────────────── */
        <div style={{
          background: T.canvas,
          border: `1px solid ${T.hairline}`,
          borderRadius: 18,
          overflow: 'hidden',
        }}>
          {/* List Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.2fr 2fr 1.3fr 0.9fr 1.1fr 36px 168px',
            padding: '11px 20px',
            background: T.parchment,
            borderBottom: `1px solid ${T.hairline}`,
          }}>
            {['Gia sư', 'Môn & Trình độ', 'Điểm', 'Học sinh', 'Ngày đăng ký', '', 'Thao tác'].map((h, i) => (
              <div key={h} style={{
                fontSize: 11, fontWeight: 600, color: T.inkMuted48,
                fontFamily: FONT_BODY, letterSpacing: '0.3px', textTransform: 'uppercase',
                paddingRight: i < 5 ? 12 : 0,
                textAlign: i === 5 || i === 6 ? 'right' : 'left',
              }}>{h}</div>
            ))}
          </div>

          {/* List Rows */}
          {pendingTutors.map((tutor, index) => (
            <motion.div
              key={tutor.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                display: 'grid',
                gridTemplateColumns: '2.2fr 2fr 1.3fr 0.9fr 1.1fr 36px 168px',
                padding: '13px 20px',
                borderBottom: index < pendingTutors.length - 1 ? `1px solid ${T.dividerSoft}` : 'none',
                transition: 'background 0.15s',
                alignItems: 'center',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = T.parchment; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {/* Col 1: Tutor info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingRight: 12, minWidth: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${tutor.avatarColor}14`,
                  border: `1px solid ${tutor.avatarColor}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 500,
                  color: tutor.avatarColor,
                  fontFamily: FONT_HEAD,
                  flexShrink: 0,
                }}>
                  {tutor.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: T.ink,
                    fontFamily: FONT_HEAD, letterSpacing: '-0.1px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{tutor.fullName}</div>
                  <div style={{
                    fontSize: 11, color: T.inkMuted48,
                    fontFamily: FONT_BODY, marginTop: 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    <MailOutlined style={{ fontSize: 10, marginRight: 3 }} />
                    {tutor.email}
                  </div>
                </div>
              </div>

              {/* Col 2: Subjects & Qualifications */}
              <div style={{ paddingRight: 12, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 3 }}>
                  {tutor.subjects.map(s => (
                    <SubjectTag key={s.subjectId} label={s.subjectName} color={tutor.avatarColor} />
                  ))}
                </div>
                <div style={{
                  fontSize: 11, color: T.inkMuted48,
                  fontFamily: FONT_BODY,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {tutor.qualifications.split(';')[0].trim()}
                </div>
              </div>

              {/* Col 3: Rating */}
              <div style={{ paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 9999,
                  background: T.primaryLight,
                  fontSize: 12, fontWeight: 500,
                  color: T.primary,
                  fontFamily: FONT_HEAD,
                }}>
                  <StarOutlined style={{ fontSize: 10 }} />
                  {tutor.rating}
                </div>
              </div>

              {/* Col 4: Student count */}
              <div style={{ paddingRight: 8, textAlign: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, fontFamily: FONT_HEAD }}>
                  {tutor.studentCount}
                </span>
                <span style={{ fontSize: 11, color: T.primary, fontFamily: FONT_BODY, marginLeft: 3 }}>hs</span>
              </div>

              {/* Col 5: Join date */}
              <div style={{ paddingRight: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 12, color: T.inkMuted48, fontFamily: FONT_BODY }}>
                  {dayjs(tutor.joinDate).format('DD/MM/YYYY')}
                </span>
              </div>

              {/* Col 6: Eye detail */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate(`/admin/tutor/${tutor.id}`)}
                  title="Xem chi tiết"
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: T.parchment,
                    color: T.inkMuted48,
                    border: `1px solid ${T.hairline}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.primary;
                    (e.currentTarget as HTMLButtonElement).style.color = T.primary;
                    (e.currentTarget as HTMLButtonElement).style.background = T.primaryLight;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.hairline;
                    (e.currentTarget as HTMLButtonElement).style.color = T.inkMuted48;
                    (e.currentTarget as HTMLButtonElement).style.background = T.parchment;
                  }}
                >
                  <EyeOutlined style={{ fontSize: 12 }} />
                </button>
              </div>

              {/* Col 7: Actions */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <ApproveBtn onClick={() => openModal(tutor, 'approve')} />
                <RejectBtn onClick={() => openModal(tutor, 'reject')} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Recently processed bar ─────────────────────────────────────── */}
      {(approved.length > 0 || rejected.length > 0) && (
        <div style={{
          marginTop: 14,
          padding: '14px 20px',
          background: T.canvas,
          border: `1px solid ${T.hairline}`,
          borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <CalendarOutlined style={{ color: T.inkMuted48, fontSize: 14 }} />
          <span style={{ fontSize: 12, color: T.inkMuted48, fontFamily: FONT_BODY }}>
            Phiên làm việc này:
          </span>
          {approved.length > 0 && (
            <span style={{
              padding: '2px 10px', borderRadius: 9999,
              background: T.greenLight, color: T.green,
              fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
            }}>
              {approved.length} đã duyệt
            </span>
          )}
          {rejected.length > 0 && (
            <span style={{
              padding: '2px 10px', borderRadius: 9999,
              background: T.redLight, color: T.red,
              fontSize: 11, fontWeight: 600, fontFamily: FONT_BODY,
            }}>
              {rejected.length} đã từ chối
            </span>
          )}
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      {modalOpen && (
        <TutorModal
          tutor={selectedTutor}
          mode={modalMode}
          onClose={() => { setModalOpen(false); setSelectedTutor(null); setRejectReason(''); }}
          onApprove={handleApprove}
          onReject={handleReject}
          rejectReason={rejectReason}
          onRejectReason={setRejectReason}
        />
      )}

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(auto-fill"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TutorApprovals;
