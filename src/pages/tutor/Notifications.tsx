import React, { useState } from 'react';
import { Button, Empty, Tag, Space, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  BellOutlined, CheckOutlined, DeleteOutlined,
  CalendarOutlined, DollarOutlined, StarOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  InfoCircleOutlined, CheckSquareOutlined, MessageOutlined,
  TeamOutlined, UserAddOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';

dayjs.extend(relativeTime);

type NotificationType = 'booking' | 'session' | 'payment' | 'review' | 'system' | 'student';
type Priority = 'high' | 'normal' | 'low';

interface Notification {
  id: string;
  type: NotificationType;
  priority: Priority;
  title: string;
  description: string;
  avatarIcon?: React.ReactNode;
  time: string;
  isRead: boolean;
  actionLabel?: string;
  actionPath?: string;
}

const T = {
  primary: '#0062FF',
  primaryLight: 'rgba(0, 98, 255, 0.06)',
  primaryBorder: 'rgba(0, 98, 255, 0.14)',
  primaryDark: '#0052cc',
  ink: '#1d1d1f',
  inkMuted80: '#333333',
  inkMuted48: '#7a7a7a',
  dividerSoft: '#f0f0f0',
  hairline: '#e0e0e0',
  canvas: '#ffffff',
  parchment: '#f5f5f7',
  onDark: '#ffffff',
  success: '#149e61',
  successBg: 'rgba(20, 158, 97, 0.08)',
  warning: '#d97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  error: '#dc2626',
  errorBg: 'rgba(220, 38, 38, 0.08)',
  purple: '#7132f5',
  purpleBg: 'rgba(113, 50, 245, 0.08)',
};

const pillBtnPrimary: React.CSSProperties = {
  background: 'rgba(255,255,255,0.15)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 9999,
  padding: '8px 18px',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
  letterSpacing: '-0.224px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const filterBtn = (active: boolean): React.CSSProperties => ({
  padding: '6px 14px',
  borderRadius: 8,
  border: active ? `1.5px solid ${T.primary}` : '1.5px solid rgba(0,0,0,0.10)',
  background: active ? T.primaryLight : T.canvas,
  color: active ? T.primary : T.inkMuted48,
  fontSize: 12,
  fontWeight: active ? 500 : 400,
  cursor: 'pointer',
  fontFamily: "'SF Pro Text', system-ui, sans-serif",
  letterSpacing: '-0.12px',
  transition: 'all 0.18s ease',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
});

type FilterType = 'all' | NotificationType;

const mockNotifications: Notification[] = [
  {
    id: '1', type: 'booking', priority: 'high',
    title: 'Yêu cầu đặt phiên mới',
    description: 'Học sinh Nguyễn Thu Hà yêu cầu đặt phiên học Toán lớp 12 vào 28/07/2026 lúc 19:00. Vui lòng xác nhận hoặc đề xuất thay đổi.',
    avatarIcon: <UserAddOutlined />,
    time: dayjs().subtract(5, 'minute').toISOString(),
    isRead: false,
    actionLabel: 'Xác nhận ngay',
    actionPath: '/tutor/sessions',
  },
  {
    id: '2', type: 'session', priority: 'high',
    title: 'Nhắc lịch: Phiên học trong 1 giờ',
    description: 'Phiên học Vật lý với học sinh Lê Minh Đức bắt đầu lúc 20:00 hôm nay. Cập nhật link họp nếu chưa có.',
    avatarIcon: <ClockCircleOutlined />,
    time: dayjs().subtract(1, 'hour').toISOString(),
    isRead: false,
    actionLabel: 'Cập nhật link',
    actionPath: '/tutor/sessions',
  },
  {
    id: '3', type: 'payment', priority: 'normal',
    title: 'Thanh toán từ học sinh',
    description: 'Học sinh Phạm Thị Lan đã thanh toán 250.000đ cho phiên học Tiếng Anh. Credit đã được cộng vào ví.',
    avatarIcon: <DollarOutlined />,
    time: dayjs().subtract(4, 'hour').toISOString(),
    isRead: false,
  },
  {
    id: '4', type: 'student', priority: 'normal',
    title: 'Học sinh mới liên hệ',
    description: 'Học sinh Trần Hoàng Nam đã gửi tin nhắn cho bạn. Xem hồ sơ và phản hồi để nhận thêm yêu cầu.',
    avatarIcon: <TeamOutlined />,
    time: dayjs().subtract(6, 'hour').toISOString(),
    isRead: false,
    actionLabel: 'Xem hồ sơ',
    actionPath: '/tutor/students',
  },
  {
    id: '5', type: 'review', priority: 'normal',
    title: 'Học sinh để lại đánh giá mới',
    description: 'Học sinh Đỗ Minh Tuấn đã đánh giá 5 sao cho phiên học Toán của bạn. "Gia sư giảng rất dễ hiểu!"',
    avatarIcon: <StarOutlined />,
    time: dayjs().subtract(1, 'day').toISOString(),
    isRead: true,
    actionLabel: 'Xem đánh giá',
    actionPath: '/tutor/feedback',
  },
  {
    id: '6', type: 'booking', priority: 'high',
    title: 'Yêu cầu thay đổi lịch',
    description: 'Học sinh Lê Thị Hương muốn dời phiên học Hóa học từ 27/07 sang 29/07/2026. Vui lòng phản hồi.',
    avatarIcon: <CalendarOutlined />,
    time: dayjs().subtract(1, 'day').toISOString(),
    isRead: true,
    actionLabel: 'Phản hồi',
    actionPath: '/tutor/sessions',
  },
  {
    id: '7', type: 'session', priority: 'normal',
    title: 'Phiên học hoàn thành — cập nhật kết quả',
    description: 'Phiên học Tiếng Anh với học sinh Hoàng Văn Minh đã kết thúc. Cập nhật kết quả và tiến độ học tập.',
    avatarIcon: <CheckCircleOutlined />,
    time: dayjs().subtract(2, 'day').toISOString(),
    isRead: true,
    actionLabel: 'Ghi kết quả',
    actionPath: '/tutor/sessions',
  },
  {
    id: '8', type: 'system', priority: 'low',
    title: 'Hồ sơ gia sư đã được phê duyệt',
    description: 'Chúc mừng! Hồ sơ gia sư của bạn đã được Admin phê duyệt. Bạn có thể bắt đầu nhận học sinh.',
    avatarIcon: <CheckOutlined />,
    time: dayjs().subtract(5, 'day').toISOString(),
    isRead: true,
  },
  {
    id: '9', type: 'review', priority: 'low',
    title: 'Nhắc nhở: Cập nhật tiến độ học sinh',
    description: 'Bạn có 3 học sinh chưa được cập nhật tiến độ trong 7 ngày qua. Hãy cập nhật để học sinh theo dõi.',
    avatarIcon: <InfoCircleOutlined />,
    time: dayjs().subtract(3, 'day').toISOString(),
    isRead: true,
    actionLabel: 'Cập nhật ngay',
    actionPath: '/tutor/progress',
  },
];

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  booking: { icon: <UserAddOutlined />, color: T.primary, bg: T.primaryLight, label: 'Yêu cầu đặt' },
  session: { icon: <ClockCircleOutlined />, color: T.warning, bg: T.warningBg, label: 'Phiên học' },
  payment: { icon: <DollarOutlined />, color: T.success, bg: T.successBg, label: 'Thanh toán' },
  review: { icon: <StarOutlined />, color: '#d97706', bg: T.warningBg, label: 'Đánh giá' },
  student: { icon: <TeamOutlined />, color: T.purple, bg: T.purpleBg, label: 'Học sinh' },
  system: { icon: <InfoCircleOutlined />, color: T.purple, bg: T.purpleBg, label: 'Hệ thống' },
};

const CARD_STYLE: React.CSSProperties = {
  background: T.canvas,
  border: `1px solid ${T.dividerSoft}`,
  borderRadius: 18,
  overflow: 'hidden',
};

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
      icon: item.isRead ? <MessageOutlined style={{ fontSize: 12 }} /> : <CheckOutlined style={{ fontSize: 12 }} />,
      onClick: () => onMarkRead(item.id),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Xóa thông báo',
      icon: <DeleteOutlined style={{ fontSize: 12 }} />,
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
      <div style={{
        background: item.isRead ? T.canvas : 'rgba(0, 98, 255, 0.02)',
        border: item.isRead ? '1px solid rgba(0,0,0,0.07)' : `1px solid ${T.primaryBorder}`,
        borderLeft: item.isRead ? '3px solid rgba(0,0,0,0.07)' : `3px solid ${T.primary}`,
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 8,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        transition: 'all 0.2s ease',
      }}>
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
              <span style={{
                fontSize: 13, fontWeight: 500,
                color: T.ink, letterSpacing: '-0.224px',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
              }}>
                {item.title}
              </span>
              {item.priority === 'high' && !item.isRead && (
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: T.error, display: 'inline-block', flexShrink: 0,
                }} />
              )}
            </div>
            <Space size={4}>
              <Tag style={{
                margin: 0,
                background: tc.bg,
                color: tc.color,
                border: `1px solid ${tc.color}33`,
                borderRadius: 6,
                fontSize: 11, fontWeight: 500,
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                letterSpacing: '-0.12px',
                padding: '0 6px',
              }}>
                {tc.label}
              </Tag>
              <Dropdown menu={{ items: dotMenuItems }} trigger={['click']} placement="bottomRight">
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined style={{ fontSize: 13, color: T.inkMuted48 }} />}
                  style={{ color: T.inkMuted48, width: 28, height: 28 }}
                />
              </Dropdown>
            </Space>
          </div>

          <p style={{
            fontSize: 12, color: T.inkMuted48,
            margin: 0, lineHeight: 1.55,
            letterSpacing: '-0.12px',
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {item.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{
              fontSize: 12, color: T.inkMuted48,
              letterSpacing: '-0.12px',
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
            }}>
              {dayjs(item.time).locale('vi').fromNow()}
            </span>
            {item.actionLabel && (
              <button
                onClick={() => onMarkRead(item.id)}
                style={{
                  background: item.isRead ? 'transparent' : T.primary,
                  color: item.isRead ? T.primary : '#fff',
                  border: item.isRead ? `1px solid ${T.primary}` : 'none',
                  borderRadius: 8,
                  fontSize: 12, fontWeight: 500,
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  letterSpacing: '-0.12px',
                  height: 30, padding: '0 14px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {item.actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TutorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const unread = notifications.filter((n) => !n.isRead).length;

  const counts = {
    all: notifications.length,
    booking: notifications.filter((n) => n.type === 'booking').length,
    session: notifications.filter((n) => n.type === 'session').length,
    payment: notifications.filter((n) => n.type === 'payment').length,
    review: notifications.filter((n) => n.type === 'review').length,
    student: notifications.filter((n) => n.type === 'student').length,
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
      background: T.parchment,
      minHeight: '100vh',
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      padding: '0 0 40px',
    }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ marginBottom: 24 }}
      >
        <h1 style={{
          fontSize: 22, fontWeight: 500,
          color: T.ink, margin: '0 0 4px',
          letterSpacing: '-0.28px',
          fontFamily: "'SF Pro Display', system-ui, sans-serif",
        }}>
          Thông báo
        </h1>
        <p style={{
          fontSize: 12, color: T.inkMuted48,
          margin: 0, letterSpacing: '-0.12px',
        }}>
          Theo dõi yêu cầu, phiên học và hoạt động từ học sinh
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={CARD_STYLE}
      >
        {unread > 0 && (
          <div style={{ padding: '20px 24px 0' }}>
            <div style={{
              background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
              borderRadius: 14,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              boxShadow: `0 4px 16px rgba(0, 98, 255, 0.22)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 18,
                }}>
                  <BellOutlined />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>
                    Tin nhắn chưa đọc
                  </p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: '#fff', letterSpacing: '-0.28px', fontFamily: "'SF Pro Display', sans-serif" }}>
                    {unread} thông báo mới
                  </p>
                </div>
              </div>
              <button
                onClick={handleMarkAll}
                style={pillBtnPrimary}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
              >
                <CheckSquareOutlined style={{ fontSize: 12 }} />
                Đánh dấu đã đọc
              </button>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {([
              { key: 'all', label: `Tất cả (${counts.all})` },
              { key: 'booking', label: `${typeConfig.booking.label} (${counts.booking})` },
              { key: 'session', label: `${typeConfig.session.label} (${counts.session})` },
              { key: 'payment', label: `${typeConfig.payment.label} (${counts.payment})` },
              { key: 'review', label: `${typeConfig.review.label} (${counts.review})` },
              { key: 'student', label: `${typeConfig.student.label} (${counts.student})` },
            ] as { key: FilterType; label: string }[]).map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                style={filterBtn(filter === item.key)}
                onMouseEnter={e => {
                  if (filter !== item.key) {
                    (e.currentTarget as HTMLButtonElement).style.background = T.parchment;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.14)';
                  }
                }}
                onMouseLeave={e => {
                  if (filter !== item.key) {
                    (e.currentTarget as HTMLButtonElement).style.background = T.canvas;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.10)';
                  }
                }}
              >
                {item.key !== 'all' && (
                  <span style={{ fontSize: 12 }}>{typeConfig[item.key as NotificationType].icon}</span>
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div style={{ padding: '8px 24px 24px' }}>
          {filtered.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{
                  color: T.inkMuted48, fontSize: 12,
                  letterSpacing: '-0.12px',
                  fontFamily: "'SF Pro Text', sans-serif",
                }}>
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
      </motion.div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginTop: 16,
      }}>
        {[
          { label: 'Tổng thông báo', value: notifications.length, color: T.ink },
          { label: 'Chưa đọc', value: unread, color: T.error },
          { label: 'Đã đọc', value: notifications.length - unread, color: T.success },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: T.canvas, borderRadius: 12,
            border: `1px solid ${T.dividerSoft}`,
            padding: '16px 20px', textAlign: 'center',
          }}>
            <p style={{
              fontSize: 28, fontWeight: 500, margin: 0,
              color: stat.color, letterSpacing: '-0.5px',
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
            }}>
              {stat.value}
            </p>
            <p style={{
              fontSize: 12, color: T.inkMuted48,
              margin: '4px 0 0', letterSpacing: '-0.12px',
              fontFamily: "'SF Pro Text', sans-serif",
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorNotifications;
