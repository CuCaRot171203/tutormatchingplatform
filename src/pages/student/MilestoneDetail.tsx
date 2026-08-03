import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Tag, Progress, Avatar,
  Empty, Button, Divider, Timeline, Tooltip,
} from 'antd';
import {
  FlagOutlined, BookOutlined, CalendarOutlined, UserOutlined,
  ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  LeftOutlined, VideoCameraOutlined, StarOutlined,
  EditOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

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
  purple: '#7132f5',
  purpleBg: 'rgba(113, 50, 245, 0.08)',
};

// ── Types ─────────────────────────────────────────────────────
type MilestoneStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Overdue';

interface RelatedSession {
  id: string;
  tutorName: string;
  tutorAvatar?: string;
  date: string;
  duration: number; // minutes
  topic: string;
  completed: boolean;
  rating?: number;
}

interface Milestone {
  id: string;
  subjectId: number;
  subjectName: string;
  milestoneName: string;
  targetDate: string;
  status: MilestoneStatus;
  completionPercentage: number;
  description: string;
  createdAt: string;
  relatedSessions: RelatedSession[];
}

// ── Mock Detail Data ──────────────────────────────────────────
const mockMilestoneDetail: Milestone = {
  id: '1',
  subjectId: 1,
  subjectName: 'Toán học',
  milestoneName: 'Nắm vững Đại số chương 1-3',
  targetDate: dayjs().add(14, 'day').toISOString(),
  status: 'InProgress',
  completionPercentage: 65,
  description:
    'Mục tiêu bao gồm: (1) Ôn tập hàm số bậc nhất và bậc hai; (2) Giải phương trình bậc nhất, bậc hai và phương trình chứa tham số; (3) Luyện tập các bài toán ứng dụng thực tế. Kết quả mong đợi: giải thành thạo các dạng bài trong đề thi học kỳ với điểm số từ 8.0 trở lên.',
  createdAt: dayjs().subtract(20, 'day').toISOString(),
  relatedSessions: [
    {
      id: 'sess-1',
      tutorName: 'Nguyễn Văn Minh',
      date: dayjs().subtract(15, 'day').toISOString(),
      duration: 90,
      topic: 'Hàm số bậc nhất – Lý thuyết & Bài tập cơ bản',
      completed: true,
      rating: 5,
    },
    {
      id: 'sess-2',
      tutorName: 'Nguyễn Văn Minh',
      date: dayjs().subtract(10, 'day').toISOString(),
      duration: 90,
      topic: 'Phương trình bậc hai – Công thức nghiệm & Viet',
      completed: true,
      rating: 4,
    },
    {
      id: 'sess-3',
      tutorName: 'Trần Thị Lan',
      date: dayjs().subtract(3, 'day').toISOString(),
      duration: 90,
      topic: 'Bài toán thực tế – Phương trình ứng dụng',
      completed: true,
      rating: 5,
    },
    {
      id: 'sess-4',
      tutorName: 'Nguyễn Văn Minh',
      date: dayjs().add(5, 'day').toISOString(),
      duration: 90,
      topic: 'Luyện đề học kỳ – Tổng hợp',
      completed: false,
    },
  ],
};

// ── Status Config ─────────────────────────────────────────────
const statusConfig: Record<MilestoneStatus, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  NotStarted: { color: T.textSecondary, bg: 'rgba(110,110,115,0.08)', label: 'Chưa bắt đầu', icon: <ClockCircleOutlined /> },
  InProgress: { color: T.primary, bg: T.primaryLight, label: 'Đang thực hiện', icon: <FlagOutlined /> },
  Completed:  { color: T.success, bg: T.successBg, label: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
  Overdue:    { color: T.error, bg: T.errorBg, label: 'Quá hạn', icon: <ExclamationCircleOutlined /> },
};

const subjectColors: Record<string, string> = {
  'Toán học': '#0062FF',
  'Vật lý': '#00B4D8',
  'Hóa học': '#2DC653',
  'Tiếng Anh': '#FFD166',
  'Ngữ văn': '#E63946',
  'Sinh học': '#8338EC',
  'Tin học': '#FB5607',
  'Lịch sử': '#8D6346',
};

const getSubjectColor = (name: string) => subjectColors[name] || T.primary;

// ── Progress Ring ──────────────────────────────────────────────
const ProgressRing: React.FC<{ percent: number; size?: number; color: string }> = ({
  percent, size = 120, color,
}) => {
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size === 120 ? 28 : 20, fontWeight: 500, color: T.text,
          fontFamily: "'SF Pro Display', system-ui, sans-serif", letterSpacing: '-1px' }}>
          {percent}%
        </span>
        <span style={{ fontSize: 11, color: T.textSecondary, marginTop: 2 }}>hoàn thành</span>
      </div>
    </div>
  );
};

// ── Session Card ──────────────────────────────────────────────
const SessionCard: React.FC<{ session: RelatedSession; index: number; subColor: string }> = ({
  session, index, subColor,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
  >
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '14px 16px',
      background: session.completed ? T.white : 'rgba(0,98,255,0.02)',
      border: `1px solid ${session.completed ? 'rgba(0,0,0,0.07)' : T.primaryBorder}`,
      borderLeft: `3px solid ${session.completed ? subColor : T.primary}`,
      borderRadius: 10,
      marginBottom: 8,
    }}>
      <Avatar
        src={session.tutorAvatar}
        style={{
          background: session.completed ? subColor : T.primary,
          fontSize: 13, fontWeight: 600, flexShrink: 0,
        }}
      >
        {session.tutorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </Avatar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <Text strong style={{ fontSize: 13, color: T.text }}>{session.tutorName}</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {session.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <StarOutlined key={i} style={{
                    fontSize: 11,
                    color: i <= session.rating! ? T.warning : 'rgba(0,0,0,0.12)',
                  }} />
                ))}
              </div>
            )}
            {session.completed ? (
              <CheckCircleOutlined style={{ color: T.success, fontSize: 14 }} />
            ) : (
              <ClockCircleOutlined style={{ color: T.primary, fontSize: 14 }} />
            )}
          </div>
        </div>
        <Text style={{ fontSize: 13, color: T.textSecondary, display: 'block', marginBottom: 6, lineHeight: 1.4 }}>
          {session.topic}
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarOutlined style={{ fontSize: 11, color: T.textSecondary }} />
            <Text style={{ fontSize: 12, color: T.textSecondary }}>
              {dayjs(session.date).locale('vi').format('DD/MM/YYYY')}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockCircleOutlined style={{ fontSize: 11, color: T.textSecondary }} />
            <Text style={{ fontSize: 12, color: T.textSecondary }}>
              {session.duration} phút
            </Text>
          </div>
          <div style={{
            padding: '1px 8px', borderRadius: 20,
            background: session.completed ? T.successBg : T.primaryLight,
            color: session.completed ? T.success : T.primary,
            fontSize: 11, fontWeight: 600,
          }}>
            {session.completed ? 'Đã hoàn thành' : 'Sắp tới'}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ── Main Component ────────────────────────────────────────────
const StudentMilestoneDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const milestone = mockMilestoneDetail; // In real app: fetch by id
  const sc = statusConfig[milestone.status];
  const subColor = getSubjectColor(milestone.subjectName);
  const daysLeft = dayjs(milestone.targetDate).diff(dayjs(), 'day');
  const completedSessions = milestone.relatedSessions.filter(s => s.completed);

  const progressColors = [
    { label: 'Tuần 1', percent: 10, color: T.textSecondary },
    { label: 'Tuần 2', percent: 25, color: T.textSecondary },
    { label: 'Tuần 3', percent: 40, color: subColor },
    { label: 'Tuần 4', percent: 65, color: subColor },
  ];

  return (
    <div style={{
      background: T.bgPage, minHeight: '100vh',
      fontFamily: "'IBM Plex Sans', 'SF Pro Text', system-ui, sans-serif",
    }}>
      {/* Back button */}
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => navigate('/student/milestones')}
        style={{
          color: T.textSecondary, marginBottom: 12,
          fontFamily: "'IBM Plex Sans', sans-serif",
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        Quay lại danh sách
      </Button>

      {/* Header */}
      <div style={{
        background: T.white, borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        padding: '24px',
        marginBottom: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <Row gutter={[24, 24]} align="middle">
          {/* Left: info */}
          <Col xs={24} md={16}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              <Tag style={{
                background: `${subColor}14`, color: subColor,
                border: `1px solid ${subColor}33`,
                borderRadius: 20, fontSize: 11, fontWeight: 600,
              }}>
                <BookOutlined style={{ marginRight: 4 }} />
                {milestone.subjectName}
              </Tag>
              <Tag style={{
                background: sc.bg, color: sc.color,
                border: `1px solid ${sc.color}33`,
                borderRadius: 20, fontSize: 11, fontWeight: 600,
              }}>
                {sc.icon}
                <span style={{ marginLeft: 4 }}>{sc.label}</span>
              </Tag>
              {daysLeft >= 0 && milestone.status !== 'Completed' && (
                <Tag style={{
                  background: T.primaryLight, color: T.primary,
                  border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600,
                }}>
                  Còn {daysLeft} ngày
                </Tag>
              )}
              {milestone.status === 'Overdue' && (
                <Tag style={{
                  background: T.errorBg, color: T.error,
                  border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600,
                }}>
                  Quá hạn {Math.abs(daysLeft)} ngày
                </Tag>
              )}
            </div>

            <Title level={3} style={{
              margin: '0 0 10px', fontWeight: 500, color: T.text,
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
              letterSpacing: '-0.3px', lineHeight: 1.3,
            }}>
              {milestone.milestoneName}
            </Title>

            <Paragraph style={{
              fontSize: 14, color: T.textSecondary, lineHeight: 1.6,
              margin: '0 0 16px',
            }}>
              {milestone.description}
            </Paragraph>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ fontSize: 14, color: T.textSecondary }} />
                <Text style={{ fontSize: 13, color: T.textSecondary }}>
                  Đích: <strong style={{ color: T.text }}>{dayjs(milestone.targetDate).format('DD/MM/YYYY')}</strong>
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ClockCircleOutlined style={{ fontSize: 14, color: T.textSecondary }} />
                <Text style={{ fontSize: 13, color: T.textSecondary }}>
                  Tạo: {dayjs(milestone.createdAt).locale('vi').fromNow()}
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <VideoCameraOutlined style={{ fontSize: 14, color: T.textSecondary }} />
                <Text style={{ fontSize: 13, color: T.textSecondary }}>
                  {completedSessions.length} phiên hoàn thành / {milestone.relatedSessions.length} phiên
                </Text>
              </div>
            </div>
          </Col>

          {/* Right: progress ring */}
          <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              padding: '20px',
              background: `${subColor}06`,
              borderRadius: 16,
              border: `1px solid ${subColor}22`,
            }}>
              <ProgressRing percent={milestone.completionPercentage} size={120} color={subColor} />
              <div style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: 13, color: T.textSecondary, display: 'block' }}>
                  Mục tiêu học tập
                </Text>
                <Text strong style={{ fontSize: 14, color: subColor }}>
                  {milestone.subjectName}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        {/* Sessions Timeline */}
        <Col xs={24} lg={16}>
          <div style={{
            background: T.white, borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.07)',
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <VideoCameraOutlined style={{ color: subColor, fontSize: 16 }} />
                <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Phiên học liên quan</Title>
                <span style={{
                  padding: '1px 8px', borderRadius: 20,
                  background: T.primaryLight, color: T.primary,
                  fontSize: 11, fontWeight: 500,
                }}>
                  {milestone.relatedSessions.length}
                </span>
              </div>
              <Text style={{ fontSize: 13, color: T.textSecondary }}>
                {completedSessions.length} đã hoàn thành
              </Text>
            </div>

            {milestone.relatedSessions.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: T.textSecondary, fontSize: 14 }}>
                    Chưa có phiên học nào liên quan đến mục tiêu này
                  </span>
                }
                style={{ margin: '40px 0' }}
              />
            ) : (
              milestone.relatedSessions.map((session, index) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  index={index}
                  subColor={subColor}
                />
              ))
            )}
          </div>
        </Col>

        {/* Right Sidebar */}
        <Col xs={24} lg={8}>
          {/* Progress Timeline */}
          <div style={{
            background: T.white, borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.07)',
            padding: '20px',
            marginBottom: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrophyOutlined style={{ color: subColor, fontSize: 16 }} />
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Tiến độ theo thời gian</Title>
            </div>
            <Timeline
              items={progressColors.map((item, i) => ({
                color: item.percent >= 65 ? subColor : 'rgba(0,0,0,0.15)',
                children: (
                  <div key={i}>
                    <Text strong style={{ fontSize: 13, color: item.percent >= 65 ? T.text : T.textSecondary }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: T.textSecondary, display: 'block' }}>
                      Hoàn thành: {item.percent}%
                    </Text>
                  </div>
                ),
              }))}
            />
          </div>

          {/* Quick Actions */}
          <div style={{
            background: T.white, borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.07)',
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <EditOutlined style={{ color: T.primary, fontSize: 16 }} />
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>Thao tác nhanh</Title>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button
                type="primary"
                block
                size="large"
                icon={<BookOutlined />}
                onClick={() => navigate('/student/search-tutors')}
                style={{
                  borderRadius: 10, background: subColor,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                Tìm gia sư để hoàn thành mục tiêu
              </Button>
              <Button
                block
                size="large"
                icon={<VideoCameraOutlined />}
                onClick={() => navigate('/student/sessions')}
                style={{
                  borderRadius: 10,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                Xem lịch học
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentMilestoneDetail;
