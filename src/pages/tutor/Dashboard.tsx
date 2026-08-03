import React, { useState, useRef } from 'react';
import { Row, Col, Card, Table, Badge, Avatar, Tag, Button, Statistic, message, notification, Modal, Typography, Progress, Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  CalendarOutlined, TeamOutlined, ClockCircleOutlined,
  StarOutlined, RiseOutlined, VideoCameraOutlined,
  DollarOutlined, AlertOutlined, ExclamationCircleOutlined,
  BellOutlined, EyeOutlined, SyncOutlined, LeftOutlined, RightOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '../../components/common';
import {
  mockSessions, mockTutorProfile, mockNotifications,
  weeklyActivityData, subjectProgressData, ratingDistribution,
} from '../../data/tutorMockData';
import tutorImg1 from '../../assets/image/tutor/TTP_TUTOR_1.png';
import tutorImg2 from '../../assets/image/tutor/TTP_TUTOR_2.png';
import tutorImg3 from '../../assets/image/tutor/TTP_TUTOR_3.png';
import type { Session } from '../../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const T = {
  bg: '#f5f5f7',
  card: '#ffffff',
  border: '#dedee5',
  text: '#101114',
  textMuted: '#686b82',
  textSubtle: '#9497a9',
  primary: '#7132f5',
  primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61',
  greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706',
  orangeLight: 'rgba(217,119,6,0.08)',
  red: '#dc2626',
  redLight: 'rgba(220,38,38,0.08)',
  yellow: '#f59e0b',
  yellowLight: 'rgba(245,158,11,0.08)',
  blue: '#3b82f6',
  blueLight: 'rgba(59,130,246,0.08)',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const fmtVnd = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 });

// ─── Chart Tooltip ──────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 500, color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') ? fmtVnd(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, sub }: {
  icon: React.ReactNode; label: string; value: string | number;
  accent?: string; sub?: string;
}) => (
  <div style={{ ...CARD_STYLE, position: 'relative', overflow: 'hidden', minHeight: 130 }}>
    <div style={{
      position: 'absolute', top: 16, right: 16,
      width: 44, height: 44, borderRadius: 12,
      background: `${accent || T.primary}12`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accent || T.primary, fontSize: 18,
    }}>
      {icon}
    </div>
    <div style={{ marginTop: 8, paddingRight: 56 }}>
      <div style={{ fontSize: 28, fontWeight: 500, color: T.text, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: T.textMuted, marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ─── TutorDashboard ─────────────────────────────────────────────────────────────
const TutorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState<Session | null>(null);
  const carouselRef = useRef<any>(null);

  const tutorImages = [
    { src: tutorImg1, slogan: 'Nâng cao kiến thức cùng gia sư hàng đầu', sub: 'Học mãi không biết chán' },
    { src: tutorImg2, slogan: 'Học mọi lúc, mọi nơi', sub: 'Tiện lợi không giới hạn' },
    { src: tutorImg3, slogan: 'Đồng hành cùng bạn', sub: 'Trên con đường tri thức' },
  ];

  // Stats
  const today = dayjs().startOf('day');
  const todaySessions = mockSessions.filter(s =>
    dayjs(s.startTime).isSame(today, 'day') &&
    (s.status === 'Confirmed' || s.status === 'Pending')
  );
  const completedThisMonth = mockSessions.filter(s =>
    s.status === 'Completed' && dayjs(s.startTime).isAfter(dayjs().startOf('month'))
  );
  const pendingChange = mockSessions.filter(s => s.status === 'PendingChangeConfirmation');
  const totalStudents = [...new Set(mockSessions.filter(s => s.status === 'Completed').map(s => s.studentId))].length;
  const avgRating = (mockSessions.filter(s => s.score !== undefined && s.score !== null)
    .reduce((sum, s) => sum + (s.score || 0), 0) /
    Math.max(1, mockSessions.filter(s => s.score !== undefined).length)).toFixed(1);

  // Sessions for table
  const upcomingSessions = mockSessions
    .filter(s => s.status === 'Confirmed' || s.status === 'Pending')
    .slice(0, 8);

  const handleNotificationClick = () => {
    notification.info({
      message: 'Thông báo',
      description: 'Bạn có 2 thông báo chưa đọc từ học sinh.',
      placement: 'topRight',
      duration: 4,
    });
  };

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name: string, record: Session) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={36} style={{ backgroundColor: T.primary, flexShrink: 0 }}>{name[0]}</Avatar>
          <div>
            <Text strong style={{ fontSize: 14 }}>{name}</Text>
            <div><Tag color="purple" style={{ fontSize: 11 }}>{record.subjectName}</Tag></div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string, record: Session) => (
        <div>
          <Text style={{ fontSize: 13 }}>{dayjs(time).format('DD/MM/YYYY')}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(time).format('HH:mm')} – {dayjs(record.endTime).format('HH:mm')}
            </Text>
          </div>
        </div>
      ),
      sorter: (a: Session, b: Session) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Xác nhận', value: 'Confirmed' },
        { text: 'Chờ duyệt', value: 'Pending' },
      ],
      onFilter: (value: any, record: Session) => record.status === value,
      render: (status: string) => <StatusBadge status={status as any} size="small" />,
    },
    {
      title: '',
      key: 'actions',
      width: 180,
      render: (_: any, record: Session) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          {record.meetingLink && (record.status === 'Confirmed' || record.status === 'Pending') && (
            <a href={record.meetingLink} target="_blank" rel="noopener noreferrer">
              <Button size="small" icon={<VideoCameraOutlined />} style={{ borderRadius: 8, background: T.greenLight, color: T.green, border: 'none' }}>
                Vào lớp
              </Button>
            </a>
          )}
          <Button size="small" icon={<EyeOutlined />} onClick={() => setDetailModal(record)} style={{ borderRadius: 8 }}>
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ── Image Slider ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: 24, borderRadius: 14, overflow: 'hidden' }}>
        <Carousel ref={carouselRef} autoplay autoplaySpeed={4000} dotPosition="bottom" dots draggable>
          {tutorImages.map((item, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img src={item.src} alt={`Tutor banner ${index + 1}`} style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 2 }}>
                <div style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '12px 18px', display: 'inline-block', maxWidth: 420 }}>
                  <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{item.slogan}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 400, marginTop: 3 }}>{item.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <Button icon={<LeftOutlined />} onClick={() => carouselRef.current?.prev()} style={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', borderRadius: '50%', width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.85)', color: T.text, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }} />
        <Button icon={<RightOutlined />} onClick={() => carouselRef.current?.next()} style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', borderRadius: '50%', width: 40, height: 40, border: 'none', background: 'rgba(255,255,255,0.85)', color: T.text, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }} />
      </div>

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: T.text, letterSpacing: '-0.3px' }}>
              Xin chào, {mockTutorProfile.fullName}! 👨‍🏫
            </h1>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
              {mockTutorProfile.status === 'Approved' ? 'Hồ sơ đã được xác minh' : 'Hồ sơ đang chờ duyệt'} · {dayjs().format('dddd, DD MMMM YYYY')}
            </div>
          </div>
          <Button icon={<BellOutlined />} onClick={handleNotificationClick}
            style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            Thông báo
            {mockNotifications.filter(n => !n.isRead).length > 0 && (
              <Badge count={mockNotifications.filter(n => !n.isRead).length} size="small" style={{ backgroundColor: T.red }} />
            )}
          </Button>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────── */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <StatCard icon={<CalendarOutlined />} label="Buổi hôm nay" value={todaySessions.length}
            accent={T.primary} sub="Phiên đã xác nhận" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<TeamOutlined />} label="Tổng học sinh" value={totalStudents}
            accent={T.blue} sub="Đã hoàn thành" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<ClockCircleOutlined />} label="Hoàn thành tháng" value={completedThisMonth.length}
            accent={T.green} sub="Phiên học" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<StarOutlined />} label="Điểm uy tín" value={avgRating}
            accent={T.yellow} sub="Trên thang 10" />
        </Col>
      </Row>

      {/* ── Charts Row ──────────────────────────────────────────── */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }} align="stretch">
        {/* Weekly activity */}
        <Col xs={24} xl={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...CARD_STYLE, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Hoạt động tuần này</div>
                <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>Phiên học & doanh thu</div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {[{ label: 'Phiên', color: T.primary }, { label: 'Doanh thu', color: T.green }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: 12, color: T.textMuted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyActivityData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.primary} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={T.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.10} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="sessions" name="Phiên" stroke={T.primary} strokeWidth={2.5} fill="url(#gradSessions)" dot={{ r: 3, fill: T.primary, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke={T.green} strokeWidth={2} fill="url(#gradRevenue)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Pending actions + subject chart */}
        <Col xs={24} xl={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...CARD_STYLE, flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Pending change requests */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Cần xử lý</div>
                {pendingChange.length > 0 && <Badge count={pendingChange.length} style={{ backgroundColor: T.orange }} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingChange.length > 0 ? pendingChange.slice(0, 3).map(s => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10,
                    background: `${T.orange}08`, border: `1px solid ${T.orange}20`,
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar size={32} style={{ backgroundColor: T.orangeLight, color: T.orange, flexShrink: 0 }}>{s.studentName[0]}</Avatar>
                      <div>
                        <Text strong style={{ fontSize: 13 }}>{s.studentName}</Text>
                        <div><Text type="secondary" style={{ fontSize: 11 }}>{s.subjectName} · Yêu cầu đổi lịch</Text></div>
                      </div>
                    </div>
                    <Button size="small" style={{ borderRadius: 8 }} onClick={() => setDetailModal(s)}>Xem</Button>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: T.textSubtle, fontSize: 13 }}>Không có yêu cầu nào</div>
                )}
              </div>
            </div>

            {/* Subject pie chart */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 10 }}>Môn học</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                  <ResponsiveContainer width={100} height={100}>
                    <PieChart>
                      <Pie data={subjectProgressData} cx="50%" cy="50%" innerRadius={28} outerRadius={46}
                        paddingAngle={3} dataKey="sessions" startAngle={90} endAngle={-270}>
                        {subjectProgressData.map((_, i) => <Cell key={i} fill={[T.primary, T.green, T.blue, T.orange, T.red][i]} stroke="transparent" />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: T.text, lineHeight: 1 }}>{subjectProgressData.length}</div>
                    <div style={{ fontSize: 10, color: T.textSubtle }}>Môn</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {subjectProgressData.map((s, i) => (
                    <div key={s.subject} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: [T.primary, T.green, T.blue, T.orange, T.red][i] }} />
                        <span style={{ fontSize: 12, color: T.textMuted }}>{s.subject}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{s.sessions} buổi</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ── Sessions Table ────────────────────────────────────────── */}
      <div style={{ ...CARD_STYLE, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Phiên học sắp tới</div>
            <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>
              {upcomingSessions.length} phiên chưa hoàn thành
            </div>
          </div>
          <Button type="link" onClick={() => navigate('/tutor/sessions')} style={{ fontSize: 13, fontWeight: 500 }}>
            Xem tất cả →
          </Button>
        </div>
        <Table
          dataSource={upcomingSessions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          size="middle"
          rowClassName={() => 'cursor-pointer-row'}
          locale={{ emptyText: 'Không có phiên học nào' }}
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* ── Quick Actions ───────────────────────────────────────── */}
      <Row gutter={[14, 14]}>
        {[
          { icon: <CalendarOutlined />, label: 'Quản lý lịch rảnh', sub: 'Cập nhật khung giờ có thể dạy', color: T.primary, path: '/tutor/schedule' },
          { icon: <TeamOutlined />, label: 'Danh sách học sinh', sub: 'Xem học sinh đã dạy', color: T.green, path: '/tutor/students' },
          { icon: <DollarOutlined />, label: 'Ví Credit', sub: `${fmtVnd(2500000)} sẵn có`, color: T.yellow, path: '/tutor/wallet' },
        ].map((item) => (
          <Col key={item.path} xs={24} md={8}>
            <div
              style={{ ...CARD_STYLE, cursor: 'pointer', transition: 'all 0.15s' }}
              onClick={() => navigate(item.path)}
              onMouseEnter={e => (e.currentTarget.style.borderColor = item.color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${item.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, fontSize: 22,
                }}>
                  {item.icon}
                </div>
                <div>
                  <Text strong>{item.label}</Text>
                  <div><Text type="secondary" style={{ fontSize: 12 }}>{item.sub}</Text></div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Session Detail Modal ──────────────────────────────────── */}
      <Modal
        title={null}
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={null}
        width={560}
        centered
        bodyStyle={{ padding: '28px 28px 24px' }}
      >
        {detailModal && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} style={{ backgroundColor: T.primary }}>{detailModal.studentName[0]}</Avatar>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{detailModal.studentName}</Title>
                  <StatusBadge status={detailModal.status} />
                </div>
              </div>
              <Button onClick={() => setDetailModal(null)}>Đóng</Button>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Môn học', value: detailModal.subjectName },
                { label: 'Ngày', value: dayjs(detailModal.startTime).format('dddd, DD/MM/YYYY') },
                { label: 'Giờ', value: `${dayjs(detailModal.startTime).format('HH:mm')} – ${dayjs(detailModal.endTime).format('HH:mm')}` },
                { label: 'Trạng thái', value: <StatusBadge status={detailModal.status} /> },
              ].map(item => (
                <div key={item.label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text>
                  <Text strong style={{ fontSize: 14 }}>{item.value}</Text>
                </div>
              ))}
              {detailModal.meetingLink && (
                <a href={detailModal.meetingLink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                  background: T.greenLight, borderRadius: 10, color: T.green, textDecoration: 'none',
                }}>
                  <VideoCameraOutlined />
                  <Text strong>Link học trực tuyến</Text>
                </a>
              )}
              {detailModal.score !== undefined && detailModal.score !== null && (
                <div style={{ background: T.primaryLight, borderRadius: 10, padding: '12px 16px' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Kết quả</Text>
                  <div style={{ fontSize: 22, fontWeight: 500, color: T.primary }}>{detailModal.score}/10</div>
                  {detailModal.tutorComment && <Paragraph style={{ color: T.textMuted, margin: 0, fontSize: 13 }}>{detailModal.tutorComment}</Paragraph>}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .cursor-pointer-row { cursor: pointer; }
        .cursor-pointer-row:hover { background: ${T.primaryLight} !important; }
      `}</style>
    </div>
  );
};

export default TutorDashboard;
