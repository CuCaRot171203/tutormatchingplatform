import React, { useState } from 'react';
import {
  Card,
  List,
  Button,
  Badge,
  Empty,
  Tabs,
  Avatar,
  Tag,
  Typography,
  Space,
  Dropdown,
  Tooltip,
  Segmented,
  Statistic,
  Row,
  Col,
  Progress,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  StarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
  DollarCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';

dayjs.extend(relativeTime);

const { Text, Title, Paragraph } = Typography;

// ── Design Tokens ──────────────────────────────────────────────
const T = {
  primary: '#0062FF',
  primaryLight: 'rgba(0, 98, 255, 0.06)',
  primaryBorder: 'rgba(0, 98, 255, 0.15)',
  text: '#1d1d1f',
  textSecondary: '#6e6e73',
  border: 'rgba(0, 0, 0, 0.08)',
  white: '#ffffff',
  bgPage: '#f0f2f5',
  bgCard: '#ffffff',
  success: '#149e61',
  successBg: 'rgba(20, 158, 97, 0.08)',
  warning: '#d97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  error: '#dc2626',
  errorBg: 'rgba(220, 38, 38, 0.08)',
  info: '#0062FF',
  infoBg: 'rgba(0, 98, 255, 0.08)',
  purple: '#7132f5',
  purpleBg: 'rgba(113, 50, 245, 0.08)',
};

// ── Mock Data ─────────────────────────────────────────────────
type NotificationType = 'approval' | 'payment' | 'complaint' | 'user' | 'system' | 'session';
type Priority = 'high' | 'normal' | 'low';

interface Notification {
  id: string;
  type: NotificationType;
  priority: Priority;
  title: string;
  description: string;
  avatar?: string;
  avatarIcon?: React.ReactNode;
  time: string;
  isRead: boolean;
  actionLabel?: string;
  actionPath?: string;
  metadata?: {
    user?: string;
    amount?: number;
    status?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'approval',
    priority: 'high',
    title: 'Hồ sơ gia sư chờ duyệt',
    description: 'Nguyễn Văn Minh đã nộp hồ sơ gia sư mới. Xem và phê duyệt để bắt đầu nhận học sinh.',
    avatarIcon: <UserAddOutlined />,
    time: dayjs().subtract(10, 'minute').toISOString(),
    isRead: false,
    actionLabel: 'Xem & Duyệt',
    actionPath: '/admin/tutors/pending',
    metadata: { user: 'Nguyễn Văn Minh', status: 'Pending' },
  },
  {
    id: '2',
    type: 'payment',
    priority: 'high',
    title: 'Yêu cầu nạp Credit chờ xử lý',
    description: 'Học sinh Trần Thu Hà yêu cầu nạp 500.000đ qua chuyển khoản. Kiểm tra và xác nhận.',
    avatarIcon: <DollarCircleOutlined />,
    time: dayjs().subtract(30, 'minute').toISOString(),
    isRead: false,
    actionLabel: 'Xử lý ngay',
    actionPath: '/admin/credits/pending',
    metadata: { user: 'Trần Thu Hà', amount: 500000, status: 'Pending' },
  },
  {
    id: '3',
    type: 'complaint',
    priority: 'high',
    title: 'Khiếu nại mới — Cần xử lý',
    description: 'Học sinh Lê Minh Đức khiếu nại về phiên học Vật lý với gia sư Hoàng Văn Tuấn. Lý do: Gia sư hủy muộn 3 lần.',
    avatarIcon: <ExclamationCircleOutlined />,
    time: dayjs().subtract(2, 'hour').toISOString(),
    isRead: false,
    actionLabel: 'Xem khiếu nại',
    actionPath: '/admin/credits/complaints',
    metadata: { user: 'Lê Minh Đức', status: 'Open' },
  },
  {
    id: '4',
    type: 'session',
    priority: 'normal',
    title: 'Tỷ lệ hủy phiên tăng cao',
    description: 'Trong 7 ngày qua, tỷ lệ hủy phiên toàn hệ thống tăng 12% so với tuần trước. Cần theo dõi.',
    avatarIcon: <SafetyOutlined />,
    time: dayjs().subtract(5, 'hour').toISOString(),
    isRead: false,
    metadata: { status: 'Warning' },
  },
  {
    id: '5',
    type: 'approval',
    priority: 'normal',
    title: 'Hồ sơ gia sư chờ duyệt',
    description: 'Phạm Thị Lan đã cập nhật hồ sơ gia sư với thêm chứng chỉ mới. Xem và duyệt.',
    avatarIcon: <UserAddOutlined />,
    time: dayjs().subtract(8, 'hour').toISOString(),
    isRead: false,
    actionLabel: 'Duyệt hồ sơ',
    actionPath: '/admin/tutors/pending',
    metadata: { user: 'Phạm Thị Lan', status: 'Pending' },
  },
  {
    id: '6',
    type: 'user',
    priority: 'normal',
    title: 'Người dùng bị khóa tự động',
    description: 'Tài khoản của học sinh Đỗ Hoàng Nam đã bị khóa do đăng nhập sai 5 lần liên tiếp. Có thể xem xét mở khóa.',
    avatarIcon: <SafetyOutlined />,
    time: dayjs().subtract(1, 'day').toISOString(),
    isRead: true,
    actionLabel: 'Xem tài khoản',
    actionPath: '/admin/users',
    metadata: { user: 'Đỗ Hoàng Nam', status: 'Locked' },
  },
  {
    id: '7',
    type: 'payment',
    priority: 'normal',
    title: 'Yêu cầu nạp Credit hoàn tất',
    description: 'Yêu cầu nạp 1.000.000đ của gia sư Trần Văn Khoa đã được xác nhận. Credit đã được cộng vào ví.',
    avatarIcon: <DollarOutlined />,
    time: dayjs().subtract(1, 'day').toISOString(),
    isRead: true,
    metadata: { user: 'Trần Văn Khoa', amount: 1000000, status: 'Approved' },
  },
  {
    id: '8',
    type: 'complaint',
    priority: 'normal',
    title: 'Khiếu nại đã được xử lý',
    description: 'Khiếu nại của học sinh Hoàng Thu Minh về hành vi gia sư đã được xử lý. Cảnh cáo đã được gửi tới gia sư.',
    avatarIcon: <CheckCircleOutlined />,
    time: dayjs().subtract(2, 'day').toISOString(),
    isRead: true,
    metadata: { status: 'Resolved' },
  },
  {
    id: '9',
    type: 'system',
    priority: 'low',
    title: 'Báo cáo tuần — Thống kê hệ thống',
    description: 'Tuần này: 48 phiên học hoàn thành, 12 hồ sơ gia sư mới, 5 khiếu nại được xử lý. Xem chi tiết báo cáo.',
    avatarIcon: <InfoCircleOutlined />,
    time: dayjs().subtract(3, 'day').toISOString(),
    isRead: true,
    actionLabel: 'Xem báo cáo',
    actionPath: '/admin/dashboard',
  },
  {
    id: '10',
    type: 'session',
    priority: 'low',
    title: 'Gia sư mới đạt 50 phiên học',
    description: 'Gia sư Lê Đình Khoa vừa hoàn thành 50 phiên học trên nền tảng. Chúc mừng và cập nhật badge.',
    avatarIcon: <StarOutlined />,
    time: dayjs().subtract(4, 'day').toISOString(),
    isRead: true,
    metadata: { user: 'Lê Đình Khoa' },
  },
];

// ── Type Config ────────────────────────────────────────────────
const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  approval: { icon: <UserAddOutlined />, color: T.primary, bg: T.primaryLight, label: 'Duyệt hồ sơ' },
  payment: { icon: <DollarCircleOutlined />, color: T.success, bg: T.successBg, label: 'Credit' },
  complaint: { icon: <ExclamationCircleOutlined />, color: T.error, bg: T.errorBg, label: 'Khiếu nại' },
  user: { icon: <TeamOutlined />, color: T.purple, bg: T.purpleBg, label: 'Người dùng' },
  system: { icon: <InfoCircleOutlined />, color: T.warning, bg: T.warningBg, label: 'Hệ thống' },
  session: { icon: <SafetyOutlined />, color: T.textSecondary, bg: 'rgba(110, 110, 115, 0.08)', label: 'Giám sát' },
};

const priorityBadge: Record<Priority, { color: string; label: string }> = {
  high: { color: T.error, label: 'Quan trọng' },
  normal: { color: T.primary, label: 'Thường' },
  low: { color: T.textSecondary, label: 'Thấp' },
};

// ── Priority Alert Banner ─────────────────────────────────────
const PriorityAlert: React.FC<{ count: number; onMarkAll: () => void }> = ({ count, onMarkAll }) => (
  <div style={{
    background: `linear-gradient(135deg, ${T.error} 0%, #b91c1c 100%)`,
    borderRadius: 14,
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    boxShadow: `0 4px 16px rgba(220, 38, 38, 0.3)`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 42, height: 42,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 18,
      }}>
        <WarningOutlined />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: "'IBM Plex Sans', sans-serif" }}>Cần xử lý ngay</p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'SF Pro Display', system-ui, sans-serif", letterSpacing: '-0.5px' }}>
          {count} thông báo ưu tiên cao
        </p>
      </div>
    </div>
    <button
      onClick={onMarkAll}
      style={{
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 10,
        color: '#fff',
        padding: '8px 18px',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'IBM Plex Sans', sans-serif",
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
    >
      <CheckSquareOutlined style={{ fontSize: 13 }} />
      Đánh dấu đã đọc
    </button>
  </div>
);

// ── Unread Summary Bar ─────────────────────────────────────────
const UnreadSummary: React.FC<{ unread: number; onMarkAll: () => void }> = ({ unread, onMarkAll }) => (
  <div style={{
    background: `linear-gradient(135deg, ${T.primary} 0%, #0052cc 100%)`,
    borderRadius: 14,
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    boxShadow: `0 4px 16px rgba(0, 98, 255, 0.25)`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 42, height: 42,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 18,
      }}>
        <BellOutlined />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: "'IBM Plex Sans', sans-serif" }}>Tin nhắn chưa đọc</p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'SF Pro Display', system-ui, sans-serif", letterSpacing: '-0.5px' }}>
          {unread} thông báo mới
        </p>
      </div>
    </div>
    <button
      onClick={onMarkAll}
      style={{
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 10,
        color: '#fff',
        padding: '8px 18px',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'IBM Plex Sans', sans-serif",
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
    >
      <CheckSquareOutlined style={{ fontSize: 13 }} />
      Đánh dấu đã đọc
    </button>
  </div>
);

// ── Filter Bar ─────────────────────────────────────────────────
type FilterType = 'all' | NotificationType;

const FilterBar: React.FC<{
  filter: FilterType;
  onFilterChange: (v: FilterType) => void;
  counts: Record<string, number>;
}> = ({ filter, onFilterChange, counts }) => (
  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
    {([
      { key: 'all', label: `Tất cả (${counts.all})` },
      { key: 'approval', label: `${typeConfig.approval.label} (${counts.approval})` },
      { key: 'payment', label: `${typeConfig.payment.label} (${counts.payment})` },
      { key: 'complaint', label: `${typeConfig.complaint.label} (${counts.complaint})` },
      { key: 'user', label: `${typeConfig.user.label} (${counts.user})` },
      { key: 'system', label: `${typeConfig.system.label} (${counts.system})` },
    ] as { key: FilterType; label: string }[]).map((item) => (
      <button
        key={item.key}
        onClick={() => onFilterChange(item.key)}
        style={{
          padding: '6px 14px',
          borderRadius: 8,
          border: filter === item.key ? `1.5px solid ${T.primary}` : '1.5px solid rgba(0,0,0,0.10)',
          background: filter === item.key ? T.primaryLight : T.white,
          color: filter === item.key ? T.primary : T.textSecondary,
          fontSize: 13,
          fontWeight: filter === item.key ? 600 : 500,
          cursor: 'pointer',
          fontFamily: "'IBM Plex Sans', sans-serif",
          transition: 'all 0.18s ease',
          display: 'flex', alignItems: 'center', gap: 5,
        }}
      >
        {item.key !== 'all' && (
          <span style={{ fontSize: 12 }}>{typeConfig[item.key as NotificationType].icon}</span>
        )}
        {item.label}
      </button>
    ))}
  </div>
);

// ── Notification Item ──────────────────────────────────────────
const NotificationItem: React.FC<{
  item: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}> = ({ item, onMarkRead, onDelete, index }) => {
  const tc = typeConfig[item.type];

  const dotMenuItems: MenuProps['items'] = [
    {
      key: 'read',
      label: item.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc',
      icon: item.isRead ? <MailOutlined /> : <CheckOutlined />,
      onClick: () => onMarkRead(item.id),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Xóa thông báo',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(item.id),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        style={{
          background: item.isRead ? T.white : 'rgba(0, 98, 255, 0.02)',
          border: item.isRead ? '1px solid rgba(0,0,0,0.07)' : `1px solid ${T.primaryBorder}`,
          borderLeft: item.isRead ? '3px solid rgba(0,0,0,0.07)' : `3px solid ${item.priority === 'high' ? T.error : T.primary}`,
          borderRadius: 12,
          padding: '16px 18px',
          marginBottom: 8,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          transition: 'all 0.2s ease',
        }}
      >
        <Tooltip title={tc.label}>
          <div style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: tc.bg,
            border: `1px solid ${tc.color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: tc.color, fontSize: 18, flexShrink: 0,
          }}>
            {item.avatarIcon || tc.icon}
          </div>
        </Tooltip>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text strong style={{ fontSize: 14, color: T.text, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}>
                {item.title}
              </Text>
              {item.priority === 'high' && !item.isRead && (
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: T.error, display: 'inline-block', flexShrink: 0,
                  boxShadow: `0 0 6px ${T.error}88`,
                }} />
              )}
              {item.metadata?.status && (
                <Tag
                  style={{
                    margin: 0,
                    background: item.metadata.status === 'Pending' ? T.warningBg :
                      item.metadata.status === 'Open' ? T.errorBg :
                        item.metadata.status === 'Resolved' ? T.successBg : T.primaryLight,
                    color: item.metadata.status === 'Pending' ? T.warning :
                      item.metadata.status === 'Open' ? T.error :
                        item.metadata.status === 'Resolved' ? T.success : T.primary,
                    border: `1px solid ${item.metadata.status === 'Pending' ? T.warning :
                      item.metadata.status === 'Open' ? T.error :
                        item.metadata.status === 'Resolved' ? T.success : T.primary}33`,
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    padding: '0 6px',
                  }}
                >
                  {item.metadata.status === 'Open' ? 'Mới' :
                    item.metadata.status === 'Pending' ? 'Chờ duyệt' :
                      item.metadata.status === 'Resolved' ? 'Đã xử lý' :
                        item.metadata.status === 'Locked' ? 'Đã khóa' :
                          item.metadata.status === 'Approved' ? 'Đã duyệt' :
                            item.metadata.status === 'Warning' ? 'Cảnh báo' : item.metadata.status}
                </Tag>
              )}
            </div>
            <Space size={4}>
              <Tag
                style={{
                  margin: 0,
                  background: tc.bg,
                  color: tc.color,
                  border: `1px solid ${tc.color}33`,
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  padding: '0 6px',
                }}
              >
                {tc.label}
              </Tag>
              <Dropdown menu={{ items: dotMenuItems }} trigger={['click']} placement="bottomRight">
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined style={{ fontSize: 14, color: T.textSecondary }} />}
                  style={{ color: T.textSecondary, width: 28, height: 28 }}
                />
              </Dropdown>
            </Space>
          </div>

          <Paragraph
            style={{
              fontSize: 13, color: T.textSecondary, margin: 0, lineHeight: 1.6,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
            ellipsis={{ rows: 2, expandable: false }}
          >
            {item.description}
          </Paragraph>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={{ fontSize: 12, color: T.textSecondary, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {dayjs(item.time).locale('vi').fromNow()}
            </Text>
            {item.actionLabel && (
              <Button
                type="primary"
                size="small"
                onClick={() => onMarkRead(item.id)}
                style={{
                  background: item.isRead ? 'transparent' : (item.priority === 'high' ? T.error : T.primary),
                  color: item.isRead ? (item.priority === 'high' ? T.error : T.primary) : '#fff',
                  border: item.isRead ? `1px solid ${item.priority === 'high' ? T.error : T.primary}` : 'none',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  height: 30,
                  padding: '0 14px',
                }}
              >
                {item.actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────────
const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const unread = notifications.filter((n) => !n.isRead).length;
  const highPriority = notifications.filter((n) => !n.isRead && n.priority === 'high').length;

  const counts = {
    all: notifications.length,
    approval: notifications.filter((n) => n.type === 'approval').length,
    payment: notifications.filter((n) => n.type === 'payment').length,
    complaint: notifications.filter((n) => n.type === 'complaint').length,
    user: notifications.filter((n) => n.type === 'user').length,
    system: notifications.filter((n) => n.type === 'system' || n.type === 'session').length,
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div style={{
      background: T.bgPage,
      minHeight: '100vh',
      fontFamily: "'IBM Plex Sans', 'SF Pro Text', system-ui, sans-serif",
    }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: T.text,
          margin: '0 0 4px',
          fontFamily: "'SF Pro Display', system-ui, sans-serif",
          letterSpacing: '-0.3px',
        }}>
          Thông báo Admin
        </h1>
        <p style={{ fontSize: 14, color: T.textSecondary, margin: 0 }}>
          Giám sát hoạt động và xử lý yêu cầu trên toàn hệ thống
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16,
      }}>
        {[
          { label: 'Tổng thông báo', value: notifications.length, color: T.text, icon: <BellOutlined /> },
          { label: 'Chưa đọc', value: unread, color: T.error, icon: <MailOutlined /> },
          { label: 'Ưu tiên cao', value: highPriority, color: T.error, icon: <WarningOutlined /> },
          { label: 'Đã xử lý', value: notifications.length - unread, color: T.success, icon: <CheckCircleOutlined /> },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: T.white, borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.07)',
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `${stat.color}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, fontSize: 16,
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{
                fontSize: 22, fontWeight: 700, margin: 0,
                color: stat.color,
                fontFamily: "'SF Pro Display', system-ui, sans-serif",
                letterSpacing: '-0.5px',
                lineHeight: 1,
              }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: T.textSecondary, margin: '4px 0 0', fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.2 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: T.white,
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        {/* Priority Alert */}
        {highPriority > 0 && (
          <div style={{ padding: '20px 24px 0' }}>
            <PriorityAlert count={highPriority} onMarkAll={handleMarkAll} />
          </div>
        )}

        {/* Unread Summary (only if no high priority) */}
        {highPriority === 0 && unread > 0 && (
          <div style={{ padding: '20px 24px 0' }}>
            <UnreadSummary unread={unread} onMarkAll={handleMarkAll} />
          </div>
        )}

        {/* Filter Bar */}
        <div style={{ padding: '16px 24px 0' }}>
          <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />
        </div>

        {/* Notification List */}
        <div style={{ padding: '8px 24px 24px' }}>
          {filtered.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: T.textSecondary, fontSize: 14 }}>
                  Không có thông báo nào
                </span>
              }
              style={{ margin: '60px 0' }}
            />
          ) : (
            filtered.map((item, index) => (
              <NotificationItem
                key={item.id}
                item={item}
                index={index}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
