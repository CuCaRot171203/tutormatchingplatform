import React from 'react';
import { Row, Col, Card, Typography, List, Avatar, Button, Alert, Tag, Carousel } from 'antd';
import {
  WalletOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  RightOutlined,
  BellOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined as RightArrowIcon,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  MOCK_USER,
  MOCK_SESSIONS,
  MOCK_DASHBOARD_STATS,
  MOCK_NOTIFICATIONS,
} from '../../data/mockData';
import type { Session } from '../../types';
import slideImg1 from '../../assets/image/student/TTP_student_1.png';
import slideImg2 from '../../assets/image/student/TTP_student_2.png';
import slideImg3 from '../../assets/image/student/TTP_student_3.png';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const slides = [
  {
    img: slideImg1,
    slogan: 'Mục tiêu của bạn, chúng tôi đồng hành',
    sub: 'Đặt lịch học với gia sư chất lượng cao ngay hôm nay',
    cta: 'Tìm gia sư ngay',
    ctaLink: '/student/search-tutors',
  },
  {
    img: slideImg2,
    slogan: 'Học mọi lúc, mọi nơi cùng gia sư hàng đầu',
    sub: 'Hàng nghìn buổi học đã được thực hiện thành công',
    cta: 'Xem buổi học',
    ctaLink: '/student/sessions',
  },
  {
    img: slideImg3,
    slogan: 'Kết nối — Học hỏi — Phát triển',
    sub: 'Nền tảng học tập trực tuyến hàng đầu Việt Nam',
    cta: 'Khám phá ngay',
    ctaLink: '/student/progress',
  },
];

// Design Tokens
const T = {
  primary: '#0062FF',
  text: '#1d1d1f',
  gray: '#6e6e73',
  border: 'rgba(0, 0, 0, 0.10)',
  white: '#ffffff',
  bgGray: 'rgba(0, 0, 0, 0.04)',
  success: '#149e61',
  successBg: 'rgba(20, 158, 97, 0.08)',
  error: '#dc2626',
  errorBg: 'rgba(220, 38, 38, 0.08)',
  warning: '#d97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  purple: '#7132f5',
  purpleBg: 'rgba(113, 50, 245, 0.08)',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(value);

const formatDateRange = (start: string, end: string) => {
  const s = dayjs(start);
  const e = dayjs(end);
  return `${s.format('DD/MM/YYYY')} • ${s.format('HH:mm')} – ${e.format('HH:mm')}`;
};

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  Confirmed: { color: '#0062FF', bg: 'rgba(0, 98, 255, 0.08)', label: 'Đã xác nhận' },
  Pending: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', label: 'Chờ xác nhận' },
  PendingChangeConfirmation: { color: '#7132f5', bg: 'rgba(113, 50, 245, 0.08)', label: 'Chờ đổi lịch' },
  Completed: { color: '#149e61', bg: 'rgba(20, 158, 97, 0.08)', label: 'Hoàn thành' },
  Cancelled: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)', label: 'Đã hủy' },
};

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = MOCK_USER;
  const stats = MOCK_DASHBOARD_STATS;
  const sessions = MOCK_SESSIONS;
  const notifications = MOCK_NOTIFICATIONS;

  const upcomingSessions = sessions
    .filter((s) => s.status === 'Confirmed' || s.status === 'Pending')
    .slice(0, 5);

  const recentCompleted = sessions
    .filter((s) => s.status === 'Completed')
    .slice(0, 3);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      {/* Hero Slideshow 3:1 */}
      <div style={{ position: 'relative', marginBottom: 24, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <Carousel
          autoplay
          autoplaySpeed={5000}
          dots
          effect="fade"
          arrows
          prevArrow={<LeftOutlined style={{ color: '#fff', fontSize: 20, zIndex: 2 }} />}
          nextArrow={<RightArrowIcon style={{ color: '#fff', fontSize: 20, zIndex: 2 }} />}
        >
          {slides.map((slide, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{
                width: '100%',
                paddingTop: '33.33%', // 3:1 ratio
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img
                  src={slide.img}
                  alt={slide.slogan}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(0,98,255,0.72) 0%, rgba(113,50,245,0.55) 100%)',
                }} />
                {/* Content */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '32px 48px',
                }}>
                  <div style={{ maxWidth: 600 }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 20,
                      padding: '4px 16px',
                      marginBottom: 16,
                    }}>
                      <Text style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
                        🎓 TutorMatch — Nền tảng gia sư thông minh
                      </Text>
                    </div>
                    <Title level={2} style={{ color: '#fff', margin: '0 0 12px', fontWeight: 700, lineHeight: 1.3 }}>
                      {slide.slogan}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, display: 'block', marginBottom: 24 }}>
                      {slide.sub}
                    </Text>
                    <Link to={slide.ctaLink}>
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          borderRadius: 10,
                          fontWeight: 600,
                          height: 44,
                          paddingInline: 28,
                          background: '#fff',
                          color: T.primary,
                          border: 'none',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        }}
                      >
                        {slide.cta} <RightOutlined style={{ fontSize: 12 }} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* System Notification Banner */}
      {unreadCount > 0 && (
        <Alert
          message={
            <span style={{ fontSize: 14 }}>
              Bạn có <strong>{unreadCount} thông báo mới</strong> chưa đọc.{' '}
              <Button type="link" size="small" style={{ padding: 0, height: 'auto', fontSize: 14 }}
                onClick={() => navigate('/student/profile')}>
                Xem ngay
              </Button>
            </span>
          }
          type="info"
          showIcon
          icon={<BellOutlined />}
          style={{ borderRadius: 10, marginBottom: 20 }}
          closable
        />
      )}

      {/* Welcome Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 500, color: T.text }}>
          Xin chào, {user.fullName}!
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Chào mừng bạn quay trở lại TutorMatch — Học tập hiệu quả hơn mỗi ngày
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Balance */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 12,
              boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px',
              background: 'linear-gradient(135deg, #0062FF 0%, #0050d6 100%)',
              minHeight: 120,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Số dư ví</Text>
                <div style={{ fontSize: 24, fontWeight: 500, color: '#fff', lineHeight: 1.3, marginTop: 4 }}>
                  {formatCurrency(stats.balance)}
                </div>
                <Link to="/student/wallet">
                  <Button
                    type="text"
                    size="small"
                    style={{ color: 'rgba(255,255,255,0.85)', padding: 0, marginTop: 6, fontSize: 13 }}
                    icon={<RightOutlined style={{ fontSize: 10 }} />}
                  >
                    Nạp thêm
                  </Button>
                </Link>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WalletOutlined style={{ color: '#fff', fontSize: 20 }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Sessions */}
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', minHeight: 120 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Tổng buổi học</Text>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.text, lineHeight: 1.3, marginTop: 4 }}>
                  {stats.totalSessions}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {stats.completedSessions} hoàn thành
                </Text>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: T.purpleBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CalendarOutlined style={{ color: T.purple, fontSize: 20 }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Upcoming */}
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', minHeight: 120 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Buổi học sắp tới</Text>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.primary, lineHeight: 1.3, marginTop: 4 }}>
                  {stats.upcomingSessions}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{stats.pendingChangeSessions} chờ đổi lịch</Text>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: 'rgba(0, 98, 255, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ClockCircleOutlined style={{ color: T.primary, fontSize: 20 }} />
              </div>
            </div>
          </Card>
        </Col>

        {/* Goals */}
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', minHeight: 120 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Mục tiêu học tập</Text>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.success, lineHeight: 1.3, marginTop: 4 }}>
                  {stats.completedGoals}/{stats.activeGoals + stats.completedGoals}
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{stats.activeGoals} đang tiến hành</Text>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: T.successBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrophyOutlined style={{ color: T.success, fontSize: 20 }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Upcoming Sessions */}
        <Col xs={24} lg={16}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Buổi học sắp tới</span>
                <Link to="/student/sessions">
                  <Button type="link" style={{ padding: 0, fontSize: 13 }}>Xem tất cả</Button>
                </Link>
              </div>
            }
          >
            {upcomingSessions.length > 0 ? (
              <List
                dataSource={upcomingSessions}
                renderItem={(session) => {
                  const cfg = statusConfig[session.status] || statusConfig.Pending;
                  return (
                    <List.Item style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                        <Avatar
                          size={44}
                          style={{ backgroundColor: T.purple, flexShrink: 0, fontSize: 16, fontWeight: 600 }}
                        >
                          {session.tutorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <Text strong style={{ fontSize: 14 }}>{session.tutorName}</Text>
                            <div style={{
                              padding: '2px 8px', borderRadius: 6,
                              backgroundColor: cfg.bg, color: cfg.color,
                              fontSize: 12, fontWeight: 500,
                            }}>
                              {cfg.label}
                            </div>
                          </div>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {session.subjectName} • {formatDateRange(session.startTime, session.endTime)}
                          </Text>
                        </div>
                        <Link to={`/student/session/${session.id}`}>
                          <Button type="primary" ghost size="small" style={{ borderRadius: 8, fontSize: 12 }}>
                            Chi tiết
                          </Button>
                        </Link>
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CalendarOutlined style={{ fontSize: 48, color: '#d1d1d6', marginBottom: 16 }} />
                <Text type="secondary" style={{ display: 'block', fontSize: 14 }}>
                  Chưa có buổi học nào được đặt
                </Text>
                <Link to="/student/search-tutors">
                  <Button type="primary" style={{ marginTop: 16, borderRadius: 10 }}>
                    Tìm gia sư ngay
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Recent Completed Sessions */}
          {recentCompleted.length > 0 && (
            <Card
              variant="borderless"
              style={{
                borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px',
                marginTop: 16,
              }}
              title={<span style={{ fontWeight: 600, fontSize: 15 }}>Hoàn thành gần đây</span>}
            >
              <Row gutter={[12, 12]}>
                {recentCompleted.map((session) => (
                  <Col xs={24} sm={8} key={session.id}>
                    <div style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: 10,
                      padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13 }}>{session.subjectName}</Text>
                        <CheckCircleOutlined style={{ color: T.success, fontSize: 14 }} />
                      </div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                        {session.tutorName}
                      </Text>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(session.startTime).format('DD/MM')}
                        </Text>
                        {session.score !== undefined && (
                          <Tag color="green" style={{ borderRadius: 6, fontSize: 12, margin: 0 }}>
                            {session.score} đ
                          </Tag>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Quick Actions */}
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}
            title={<span style={{ fontWeight: 600, fontSize: 15 }}>Thao tác nhanh</span>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <SearchOutlined />, label: 'Tìm kiếm gia sư', path: '/student/search-tutors', color: T.primary },
                { icon: <CalendarOutlined />, label: 'Xem lịch học', path: '/student/sessions', color: T.purple },
                { icon: <TrophyOutlined />, label: 'Tiến độ học tập', path: '/student/progress', color: T.success },
                { icon: <WalletOutlined />, label: 'Nạp Credit', path: '/student/wallet', color: T.warning },
              ].map(({ icon, label, path, color }) => (
                <Link key={path} to={path}>
                  <Button
                    block
                    icon={icon}
                    style={{
                      height: 40,
                      textAlign: 'left',
                      borderRadius: 10,
                      fontSize: 14, 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontWeight: 500,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Notifications */}
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', marginTop: 16 }}
            title={<span style={{ fontWeight: 600, fontSize: 15 }}>Thông báo gần đây</span>}
          >
            <List
              size="small"
              dataSource={notifications.slice(0, 5)}
              renderItem={(item) => (
                <List.Item style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', gap: 10, width: '100%', alignItems: 'flex-start' }}>
                    {!item.isRead && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        backgroundColor: T.primary,
                        marginTop: 6, flexShrink: 0,
                      }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        strong={!item.isRead}
                        style={{ fontSize: 13, display: 'block' }}
                      >
                        {item.title}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.createdAt).fromNow()}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
