import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Input, Select, Modal, App } from 'antd';
import {
  SearchOutlined, EyeOutlined, FilterOutlined,
  UserOutlined, StarOutlined, ClockCircleOutlined,
  DollarOutlined, CalendarOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { StatusBadge } from '../../components/common';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:            '#f0f2f5',
  card:          '#ffffff',
  border:        '#e8eaed',
  borderLight:   '#f1f3f6',
  text:          '#1a1d26',
  textMuted:     '#6b7280',
  textSubtle:    '#9ca3af',
  accent:        '#4f6ef7',
  accentDark:    '#3b54d4',
  accentLight:   'rgba(79,110,247,0.08)',
  green:         '#10b981',
  greenLight:    'rgba(16,185,129,0.08)',
  red:           '#ef4444',
  redLight:      'rgba(239,68,68,0.08)',
  orange:        '#f59e0b',
  orangeLight:   'rgba(245,158,11,0.08)',
  blue:          '#3b82f6',
  blueLight:     'rgba(59,130,246,0.08)',
};

const FONT_HEAD = "'SF Pro Display', system-ui, -apple-system, sans-serif";
const FONT_BODY = "'SF Pro Text', system-ui, -apple-system, sans-serif";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Session {
  id: number;
  tutor: string;
  tutorAvatar: string;
  tutorColor: string;
  student: string;
  studentAvatar: string;
  studentColor: string;
  subject: string;
  scheduledAt: string;
  duration: number;
  fee: number;
  status: string;
  rating: number | null;
  notes: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_SESSIONS: Session[] = [
  { id: 1,  tutor: 'Trần Thị Mai Anh',   tutorAvatar: 'T', tutorColor: '#4f6ef7', student: 'Nguyễn Minh Tuấn',  studentAvatar: 'N', studentColor: '#10b981', subject: 'Toán',       scheduledAt: '2026-07-30 09:00', duration: 90,  fee: 150000, status: 'Confirmed',  rating: null,  notes: 'Ôn tập chương 3 - Hàm số' },
  { id: 2,  tutor: 'Nguyễn Văn Hùng',    tutorAvatar: 'N', tutorColor: '#10b981', student: 'Trần Thị Lan',      studentAvatar: 'T', studentColor: '#4f6ef7', subject: 'Tiếng Anh',   scheduledAt: '2026-07-30 10:30', duration: 60,  fee: 120000, status: 'Pending',     rating: null,  notes: 'Luyện IELTS Speaking Part 2' },
  { id: 3,  tutor: 'Lê Hoàng Nam',       tutorAvatar: 'L', tutorColor: '#f59e0b', student: 'Phạm Thu Hà',      studentAvatar: 'P', studentColor: '#f59e0b', subject: 'Vật lý',     scheduledAt: '2026-07-30 14:00', duration: 90,  fee: 150000, status: 'Completed',   rating: 5,     notes: 'Điện trường - Ôn thi THPT' },
  { id: 4,  tutor: 'Trần Thị Mai Anh',   tutorAvatar: 'T', tutorColor: '#4f6ef7', student: 'Đặng Quang Đức',   studentAvatar: 'Đ', studentColor: '#8b5cf6', subject: 'Toán',       scheduledAt: '2026-07-29 08:00', duration: 90,  fee: 150000, status: 'Completed',   rating: 5,     notes: 'Tích phân - Luyện đề' },
  { id: 5,  tutor: 'Phạm Thu Hà',        tutorAvatar: 'P', tutorColor: '#8b5cf6', student: 'Vũ Thị Mai',       studentAvatar: 'V', studentColor: '#06b6d4', subject: 'Hóa học',    scheduledAt: '2026-07-29 15:00', duration: 60,  fee: 130000, status: 'Completed',   rating: 4.5,   notes: 'Phản ứng oxi hóa khử' },
  { id: 6,  tutor: 'Nguyễn Văn Hùng',    tutorAvatar: 'N', tutorColor: '#10b981', student: 'Hoàng Minh Khoa',  studentAvatar: 'H', studentColor: '#ec4899', subject: 'Tiếng Anh',   scheduledAt: '2026-07-29 17:00', duration: 90,  fee: 160000, status: 'Cancelled',   rating: null,  notes: 'Học sinh hủy lịch trước 24h' },
  { id: 7,  tutor: 'Lê Hoàng Nam',       tutorAvatar: 'L', tutorColor: '#f59e0b', student: 'Bùi Thị Hương',    studentAvatar: 'B', studentColor: '#84cc16', subject: 'Vật lý',     scheduledAt: '2026-07-28 09:30', duration: 90,  fee: 150000, status: 'Completed',   rating: 4.8,   notes: 'Sóng cơ học - Nâng cao' },
  { id: 8,  tutor: 'Trần Thị Mai Anh',   tutorAvatar: 'T', tutorColor: '#4f6ef7', student: 'Đỗ Văn Phong',    studentAvatar: 'Đ', studentColor: '#8b5cf6', subject: 'Toán',       scheduledAt: '2026-07-28 14:00', duration: 60,  fee: 120000, status: 'Confirmed',   rating: null,  notes: 'Hình học không gian - Cơ bản' },
  { id: 9,  tutor: 'Phạm Thu Hà',        tutorAvatar: 'P', tutorColor: '#8b5cf6', student: 'Lý Thanh Ngọc',   studentAvatar: 'L', studentColor: '#f59e0b', subject: 'Hóa học',    scheduledAt: '2026-07-27 10:00', duration: 90,  fee: 150000, status: 'Completed',   rating: 5,     notes: 'Hóa hữu cơ - Thi ĐH' },
  { id: 10, tutor: 'Nguyễn Văn Hùng',    tutorAvatar: 'N', tutorColor: '#10b981', student: 'Chu Thị Mai',      studentAvatar: 'C', studentColor: '#4f6ef7', subject: 'IELTS',       scheduledAt: '2026-07-27 16:00', duration: 90,  fee: 180000, status: 'Cancelled',   rating: null,  notes: 'Gia sư hủy lịch - ghi nhận' },
  { id: 11, tutor: 'Lê Hoàng Nam',       tutorAvatar: 'L', tutorColor: '#f59e0b', student: 'Trần Đức Anh',    studentAvatar: 'T', studentColor: '#4f6ef7', subject: 'Vật lý',     scheduledAt: '2026-07-26 08:00', duration: 90,  fee: 150000, status: 'Completed',   rating: 4.9,   notes: 'Dao động điện từ - Ôn thi' },
  { id: 12, tutor: 'Trần Thị Mai Anh',   tutorAvatar: 'T', tutorColor: '#4f6ef7', student: 'Ngô Thị Phương',  studentAvatar: 'N', studentColor: '#10b981', subject: 'Toán',       scheduledAt: '2026-07-26 11:00', duration: 60,  fee: 120000, status: 'Completed',   rating: 5,     notes: 'Xác suất - Tổ hợp' },
  { id: 13, tutor: 'Phạm Thu Hà',        tutorAvatar: 'P', tutorColor: '#8b5cf6', student: 'Đinh Văn Tuấn',   studentAvatar: 'Đ', studentColor: '#8b5cf6', subject: 'Hóa học',    scheduledAt: '2026-07-25 15:30', duration: 90,  fee: 150000, status: 'Completed',   rating: 4.7,   notes: 'Cân bằng hóa học' },
  { id: 14, tutor: 'Nguyễn Văn Hùng',    tutorAvatar: 'N', tutorColor: '#10b981', student: 'Phạm Thị Hồng',   studentAvatar: 'P', studentColor: '#f59e0b', subject: 'Tiếng Anh',   scheduledAt: '2026-07-25 09:00', duration: 60,  fee: 120000, status: 'Completed',   rating: 4.8,   notes: 'Grammar - Conditionals' },
  { id: 15, tutor: 'Lê Hoàng Nam',       tutorAvatar: 'L', tutorColor: '#f59e0b', student: 'Võ Thị Thu',      studentAvatar: 'V', studentColor: '#06b6d4', subject: 'Vật lý',     scheduledAt: '2026-07-24 14:00', duration: 90,  fee: 150000, status: 'Completed',   rating: 5,     notes: 'Quang hình học - Luyện đề' },
];

const ALL_SUBJECTS = [...new Set(MOCK_SESSIONS.map(s => s.subject))].sort();

// ─── Avatar Cell ────────────────────────────────────────────────────────────────
const PersonCell = ({ name, letter, color }: { name: string; letter: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <div style={{
      width: 30, height: 30, borderRadius: '50%',
      background: `${color}18`,
      color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 500, fontSize: 12, flexShrink: 0,
      fontFamily: FONT_HEAD,
    }}>
      {letter}
    </div>
    <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, color: T.text }}>
      {name}
    </span>
  </div>
);

// ─── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ value }: { value: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
    {[1,2,3,4,5].map(i => (
      <StarOutlined
        key={i}
        style={{
          fontSize: 12,
          color: i <= Math.round(value) ? '#f59e0b' : T.border,
        }}
      />
    ))}
    <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted, marginLeft: 4 }}>
      {value.toFixed(1)}
    </span>
  </div>
);

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div style={{
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${color}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 500, color }}>{value}</span>
    </div>
    <div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminSessions: React.FC = () => {
  const { notification } = App.useApp();

  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [detailSession, setDetailSession] = useState<Session | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // ── Filtered Data ────────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return sessions.filter(s => {
      const matchSearch =
        s.tutor.toLowerCase().includes(searchText.toLowerCase()) ||
        s.student.toLowerCase().includes(searchText.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = filterStatus === 'all' || s.status === filterStatus;
      const matchSubject = filterSubject === 'all' || s.subject === filterSubject;
      return matchSearch && matchStatus && matchSubject;
    });
  }, [sessions, searchText, filterStatus, filterSubject]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = {
    total: sessions.length,
    pending: sessions.filter(s => s.status === 'Pending').length,
    completed: sessions.filter(s => s.status === 'Completed').length,
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleViewDetail = (session: Session) => {
    setDetailSession(session);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setTimeout(() => setDetailSession(null), 300);
  };

  const handleCancelSession = () => {
    if (!detailSession) return;
    setSessions(prev =>
      prev.map(s => s.id === detailSession.id ? { ...s, status: 'Cancelled' } : s)
    );
    notification.success({
      message: 'Đã hủy phiên học',
      description: `Phiên học #${detailSession.id} đã được hủy thành công.`,
      placement: 'topRight',
      duration: 3,
    });
    handleCloseDetail();
  };

  // ── Table Columns ────────────────────────────────────────────────────────────
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 64,
      align: 'center' as const,
      render: (id: number) => (
        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.textSubtle }}>
          #{id.toString().padStart(3, '0')}
        </span>
      ),
    },
    {
      title: 'Gia sư',
      dataIndex: 'tutor',
      key: 'tutor',
      filterSearch: true,
      filters: MOCK_SESSIONS.map(s => ({ text: s.tutor, value: s.tutor })),
      onFilter: (value: any, record: Session) => record.tutor === value,
      sorter: (a: Session, b: Session) => a.tutor.localeCompare(b.tutor),
      render: (_: string, record: Session) => (
        <PersonCell name={record.tutor} letter={record.tutorAvatar} color={record.tutorColor} />
      ),
    },
    {
      title: 'Học sinh',
      dataIndex: 'student',
      key: 'student',
      filterSearch: true,
      filters: MOCK_SESSIONS.map(s => ({ text: s.student, value: s.student })),
      onFilter: (value: any, record: Session) => record.student === value,
      sorter: (a: Session, b: Session) => a.student.localeCompare(b.student),
      render: (_: string, record: Session) => (
        <PersonCell name={record.student} letter={record.studentAvatar} color={record.studentColor} />
      ),
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      width: 110,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8, minWidth: 160 }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text, marginBottom: 8 }}>
            Lọc theo môn
          </div>
          <Space direction="vertical" style={{ width: '100%' }}>
            {ALL_SUBJECTS.map(sub => (
              <Button
                key={sub}
                size="small"
                type={selectedKeys.includes(sub) ? 'primary' : 'default'}
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
                onClick={() => {
                  const next = selectedKeys.includes(sub) ? [] : [sub];
                  setSelectedKeys(next);
                  confirm();
                }}
              >
                {sub}
              </Button>
            ))}
            <Button size="small" block onClick={() => { clearFilters?.(); confirm(); }} style={{ borderRadius: 8 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: <FilterOutlined style={{ color: T.accent }} />,
      onFilter: (value: any, record: Session) => record.subject === value,
      render: (subject: string) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.text }}>
          {subject}
        </span>
      ),
    },
    {
      title: 'Ngày giờ',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 150,
      sorter: (a: Session, b: Session) => dayjs(a.scheduledAt).unix() - dayjs(b.scheduledAt).unix(),
      render: (date: string) => (
        <div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500, color: T.text }}>
            {dayjs(date).format('DD/MM/YYYY')}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textSubtle }}>
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center' as const,
      render: (d: number) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted }}>
          {d} phút
        </span>
      ),
    },
    {
      title: 'Phí',
      dataIndex: 'fee',
      key: 'fee',
      width: 110,
      align: 'right' as const,
      sorter: (a: Session, b: Session) => a.fee - b.fee,
      render: (fee: number) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.accent }}>
          {fee.toLocaleString('vi-VN')}đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: 'center' as const,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8, minWidth: 160 }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text, marginBottom: 8 }}>
            Lọc theo trạng thái
          </div>
          <Space direction="vertical" style={{ width: '100%' }}>
            {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
              <Button
                key={status}
                size="small"
                type={selectedKeys.includes(status) ? 'primary' : 'default'}
                danger={status === 'Cancelled'}
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
                onClick={() => {
                  const next = selectedKeys.includes(status) ? [] : [status];
                  setSelectedKeys(next);
                  confirm();
                }}
              >
                {status === 'Pending' ? 'Đang chờ' :
                 status === 'Confirmed' ? 'Đã xác nhận' :
                 status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
              </Button>
            ))}
            <Button size="small" block onClick={() => { clearFilters?.(); confirm(); }} style={{ borderRadius: 8 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: <FilterOutlined style={{ color: T.accent }} />,
      onFilter: (value: any, record: Session) => record.status === value,
      render: (status: string) => <StatusBadge status={status} />,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      align: 'center' as const,
      render: (rating: number | null) => (
        rating ? <StarRating value={rating} />
          : <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textSubtle }}>—</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 90,
      align: 'center' as const,
      render: (_: unknown, record: Session) => (
        <Button
          type="text"
          icon={<EyeOutlined style={{ color: T.accent, fontSize: 13 }} />}
          onClick={() => handleViewDetail(record)}
          style={{ borderRadius: 8 }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: FONT_HEAD,
          fontSize: 22, fontWeight: 500,
          color: T.text, margin: '0 0 2px',
          letterSpacing: '-0.3px',
        }}>
          Giám sát phiên học
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted, margin: 0 }}>
          Theo dõi toàn bộ phiên học trên hệ thống.
        </p>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard label="Tổng phiên" value={stats.total} color={T.accent} />
        <StatCard label="Đang chờ" value={stats.pending} color={T.orange} />
        <StatCard label="Hoàn thành" value={stats.completed} color={T.green} />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
        <Space size={6}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: 200, borderRadius: 8, fontFamily: FONT_BODY, fontSize: 12 }}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 130, borderRadius: 8, fontFamily: FONT_BODY }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'Pending', label: 'Đang chờ' },
              { value: 'Confirmed', label: 'Đã xác nhận' },
              { value: 'Completed', label: 'Hoàn thành' },
              { value: 'Cancelled', label: 'Đã hủy' },
            ]}
          />
          <Select
            value={filterSubject}
            onChange={setFilterSubject}
            style={{ width: 130, borderRadius: 8, fontFamily: FONT_BODY }}
            options={[
              { value: 'all', label: 'Tất cả môn' },
              ...ALL_SUBJECTS.map(s => ({ value: s, label: s })),
            ]}
          />
        </Space>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Table<Session>
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textMuted }}>
                Tổng <strong style={{ color: T.text }}>{total}</strong> phiên học
              </span>
            ),
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          style={{ background: T.card, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border}` }}
          size="small"
          onChange={() => {}}
          components={{
            header: {
              cell: ({ children, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                <th {...rest} style={{
                  ...(rest as React.TdHTMLAttributes<HTMLTableCellElement>).style,
                  fontFamily: FONT_HEAD,
                  fontWeight: 500,
                  fontSize: 11,
                  color: T.textMuted,
                  background: '#f8f9fb',
                  padding: '7px 12px',
                }}>
                  {children}
                </th>
              ),
            },
          }}
        />
      </motion.div>

      {/* ── Detail Modal ───────────────────────────────────────────────────── */}
      <Modal
        open={detailModalOpen}
        onCancel={handleCloseDetail}
        title={
          <div style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 500, color: T.text, letterSpacing: '-0.2px', paddingRight: 24 }}>
            Chi tiết phiên học #{detailSession?.id?.toString().padStart(3, '0')}
          </div>
        }
        footer={
          detailSession && (detailSession.status === 'Pending' || detailSession.status === 'Confirmed') ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseDetail} style={{ borderRadius: 8, fontFamily: FONT_BODY, fontSize: 13 }}>
                Đóng
              </Button>
              <Button
                danger
                onClick={handleCancelSession}
                style={{ borderRadius: 8, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13 }}
              >
                Hủy phiên học
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseDetail} style={{ borderRadius: 8, fontFamily: FONT_BODY, fontSize: 13 }}>
                Đóng
              </Button>
            </div>
          )
        }
        destroyOnClose
        width={520}
        centered
        styles={{
          body: { padding: '16px 20px' },
          footer: { padding: '12px 20px 16px', borderTop: `1px solid ${T.borderLight}` },
          header: { borderBottom: `1px solid ${T.borderLight}`, padding: '14px 20px 12px', marginBottom: 0 },
        }}
      >
        {detailSession && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status banner */}
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: detailSession.status === 'Completed' ? T.greenLight :
                          detailSession.status === 'Cancelled' ? T.redLight :
                          detailSession.status === 'Confirmed' ? T.blueLight : T.orangeLight,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, color: T.text }}>
                {detailSession.status === 'Completed' ? 'Hoàn thành' :
                 detailSession.status === 'Cancelled' ? 'Đã hủy' :
                 detailSession.status === 'Confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
              </span>
              <StatusBadge status={detailSession.status} size="small" />
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Gia sư</div>
                  <PersonCell name={detailSession.tutor} letter={detailSession.tutorAvatar} color={detailSession.tutorColor} />
                </div>
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Học sinh</div>
                  <PersonCell name={detailSession.student} letter={detailSession.studentAvatar} color={detailSession.studentColor} />
                </div>
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Môn học</div>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.text }}>{detailSession.subject}</span>
                </div>
              </div>

              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />Ngày giờ
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, color: T.text }}>
                    {dayjs(detailSession.scheduledAt).format('DD/MM/YYYY')}
                  </div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted }}>
                    {dayjs(detailSession.scheduledAt).format('HH:mm')}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />Thời lượng
                  </div>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.text }}>{detailSession.duration} phút</span>
                </div>
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    <DollarOutlined style={{ marginRight: 4 }} />Phí
                  </div>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, color: T.accent }}>
                    {detailSession.fee.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Rating */}
            {detailSession.rating !== null && (
              <div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  <StarOutlined style={{ marginRight: 4 }} />Đánh giá
                </div>
                <StarRating value={detailSession.rating} />
              </div>
            )}

            {/* Notes */}
            {detailSession.notes && (
              <div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Ghi chú
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: T.borderLight,
                  borderRadius: 8,
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  color: T.textMuted,
                  fontStyle: 'italic',
                }}>
                  {detailSession.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSessions;
