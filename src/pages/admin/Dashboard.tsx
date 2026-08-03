import React, { useState } from 'react';
import { Row, Col, Badge, Button } from 'antd';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from 'recharts';
import {
  TeamOutlined, UserOutlined, CalendarOutlined,
  DollarOutlined, ExclamationCircleOutlined,
  ArrowRightOutlined, RiseOutlined, FallOutlined,
  ClockCircleOutlined, CheckCircleOutlined,
  WarningOutlined, SyncOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common';
import dayjs from 'dayjs';

// ─── Light Theme Design Tokens ─────────────────────────────────────────────────
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
  pink:          '#ec4899',
  pinkLight:     'rgba(236,72,153,0.08)',
  lime:          '#84cc16',
  limeLight:     'rgba(132,204,22,0.08)',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const weeklyData = [
  { day: 'T2', users: 42, sessions: 38 },
  { day: 'T3', users: 55, sessions: 50 },
  { day: 'T4', users: 48, sessions: 44 },
  { day: 'T5', users: 62, sessions: 58 },
  { day: 'T6', users: 71, sessions: 66 },
  { day: 'T7', users: 88, sessions: 80 },
  { day: 'CN', users: 65, sessions: 60 },
];

const monthlyTrend = [
  { month: 'T1', sessions: 42 }, { month: 'T2', sessions: 58 },
  { month: 'T3', sessions: 53 }, { month: 'T4', sessions: 67 },
  { month: 'T5', sessions: 79 }, { month: 'T6', sessions: 91 },
  { month: 'T7', sessions: 85 }, { month: 'T8', sessions: 104 },
  { month: 'T9', sessions: 98 }, { month: 'T10', sessions: 115 },
  { month: 'T11', sessions: 122 }, { month: 'T12', sessions: 138 },
];

const subjectData = [
  { name: 'Toán', value: 35, color: T.accent },
  { name: 'Văn',   value: 20, color: T.green },
  { name: 'Anh',   value: 25, color: T.blue },
  { name: 'Lý',    value: 12, color: T.orange },
  { name: 'Hóa',   value: 8,  color: T.purple },
];

const sessionStatusData = [
  { month: 'T1', completed: 32, pending: 7, cancelled: 3 },
  { month: 'T2', completed: 44, pending: 9, cancelled: 5 },
  { month: 'T3', completed: 40, pending: 8, cancelled: 5 },
  { month: 'T4', completed: 51, pending: 10, cancelled: 6 },
  { month: 'T5', completed: 61, pending: 12, cancelled: 6 },
  { month: 'T6', completed: 70, pending: 14, cancelled: 7 },
];

const recentSessions = [
  { id: 1, student: 'Nguyễn Minh Tuấn', subject: 'Toán',  status: 'completed', date: '2026-07-30', avatar: 'N' },
  { id: 2, student: 'Trần Thị Lan',     subject: 'Anh',   status: 'pending',   date: '2026-07-30', avatar: 'T' },
  { id: 3, student: 'Lê Hoàng Nam',    subject: 'Văn',   status: 'completed', date: '2026-07-29', avatar: 'L' },
  { id: 4, student: 'Phạm Thu Hà',      subject: 'Lý',    status: 'cancelled', date: '2026-07-29', avatar: 'P' },
  { id: 5, student: 'Đặng Quang Đức',  subject: 'Hóa',  status: 'completed', date: '2026-07-28', avatar: 'Đ' },
  { id: 6, student: 'Vũ Thị Mai',      subject: 'Anh',   status: 'pending',   date: '2026-07-28', avatar: 'V' },
];

const recentTutors = [
  { id: 1, name: 'Trần Thị Mai',     subject: 'Toán', status: 'active',  rating: 4.9, students: 42, pending: false, avatar: 'T' },
  { id: 2, name: 'Nguyễn Văn Hùng', subject: 'Anh',   status: 'active',  rating: 4.8, students: 38, pending: false, avatar: 'N' },
  { id: 3, name: 'Lê Hoàng Nam',    subject: 'Văn',   status: 'pending', rating: 4.7, students: 0,  pending: true,  avatar: 'L' },
  { id: 4, name: 'Phạm Thu Hà',      subject: 'Lý',    status: 'active',  rating: 4.9, students: 51, pending: false, avatar: 'P' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('vi-VN');
const BASE_H = 180;
const CARD_H = 300;

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${T.border}`,
      borderRadius: 10,
      padding: '9px 13px',
      color: T.text,
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    }}>
      <div style={{ fontSize: 11, color: T.textSubtle, marginBottom: 4, fontWeight: 500 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, display: 'inline-block', flexShrink: 0 }} />
          {p.name}: <span style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const axisStyle = {
  tick: { fontSize: 10, fill: T.textSubtle },
  axisLine: false, tickLine: false,
};

const gridProps = { strokeDasharray: '3 3', stroke: T.border, vertical: false };

// ─── Shared Card ─────────────────────────────────────────────────────────────
const Card = ({
  children, style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div style={{
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({
  icon, label, value, trend, trendValue, accentColor, sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  accentColor: string;
  sub?: string;
}) => (
  <Card style={{ position: 'relative', overflow: 'hidden', minHeight: 140 }}>
    {/* Icon */}
    <div style={{
      position: 'absolute', top: 16, right: 16,
      width: 42, height: 42, borderRadius: 12,
      background: `${accentColor}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accentColor, fontSize: 18,
    }}>
      {icon}
    </div>

    <div style={{ marginTop: 10, flex: 1 }}>
      <div style={{
        fontSize: 26, fontWeight: 400, color: T.text,
        letterSpacing: '-0.5px', lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: T.textMuted, marginTop: 5 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2 }}>{sub}</div>
      )}
      {trend && trendValue && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginTop: 10, padding: '3px 10px', borderRadius: 9999,
          background: trend === 'up' ? T.greenLight : T.redLight,
          color: trend === 'up' ? T.green : T.red,
          fontSize: 12, fontWeight: 600,
        }}>
          {trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
          {trendValue}
        </div>
      )}
    </div>
  </Card>
);

// ─── Chart Card ──────────────────────────────────────────────────────────────
const ChartCard = ({
  title, sub, legend, children,
}: {
  title: string;
  sub?: string;
  legend?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card style={{ minHeight: CARD_H }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{sub}</div>}
      </div>
      {legend}
    </div>
    <div style={{ flex: 1, minHeight: BASE_H }}>
      {children}
    </div>
  </Card>
);

// ─── Component ────────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };

  const stats = [
    { icon: <TeamOutlined />,       label: 'Tổng người dùng',      value: '2.847',    trend: 'up' as const, trendValue: '+12%',  accentColor: T.accent, sub: 'Toàn hệ thống' },
    { icon: <UserOutlined />,        label: 'Gia sư hoạt động',       value: '412',     trend: 'up' as const, trendValue: '+8%',   accentColor: T.accent,   sub: 'Đã xác minh' },
    { icon: <TeamOutlined />,        label: 'Học sinh đã xác thực',  value: '2.435',   trend: 'up' as const, trendValue: '+15%', accentColor: T.accent,  sub: 'Đã xác thực' },
    { icon: <CalendarOutlined />,    label: 'Phiên học hoàn thành',  value: '1.243',   trend: 'up' as const, trendValue: '+11%', accentColor: T.accent, sub: 'Tất cả trạng thái' },
    { icon: <CheckCircleOutlined />, label: 'Tỷ lệ hoàn thành',      value: '72%',     trend: 'up' as const, trendValue: '+3%',  accentColor: T.accent,   sub: 'Tháng này' },
    { icon: <WarningOutlined />,     label: 'Chờ duyệt',             value: '18',      trend: 'down' as const, trendValue: '-5%', accentColor: T.accent, sub: 'Gia sư & khiếu nại' },
    { icon: <ClockCircleOutlined />, label: 'Phiên đang hoạt động',  value: '23',      trend: 'up' as const, trendValue: '+2',   accentColor: T.accent,   sub: 'Trực tuyến' },
    { icon: <DollarOutlined />,      label: 'Doanh thu tháng',        value: '₫142.5M', trend: 'up' as const, trendValue: '+22%', accentColor: T.accent,   sub: 'Phí dịch vụ' },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: T.text,
    }}>

      {/* ── Page Title ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 500,
            color: T.text, letterSpacing: '-0.3px',
          }}>
            Tổng quan hệ thống
          </h1>
          <div style={{ fontSize: 13, color: T.textSubtle, marginTop: 4 }}>
            Chào mừng quay trở lại · {dayjs().format('dddd, DD MMMM YYYY')}
          </div>
        </div>
        <Button
          type="default"
          icon={<SyncOutlined spin={loading} />}
          onClick={handleRefresh}
          disabled={loading}
          style={{
            borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500,
            color: loading ? T.accent : T.textMuted,
            border: `1px solid ${T.border}`,
            background: loading ? T.accentLight : T.card,
          }}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </div>

      {/* ── Stat Cards (2 rows × 4) ──────────────────────────────────────── */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
        {stats.map((s) => (
          <Col key={s.label} xs={12} sm={12} md={6} lg={6} xl={6}>
            <div style={{ height: 160 }}>
              <StatCard {...s} />
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Charts Row 1 ────────────────────────────────────────────────── */}
      <Row gutter={[14, 14]} style={{ marginBottom: 14 }} align="stretch">
        {/* Area chart — weekly activity */}
        <Col xs={24} xl={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <ChartCard
            title="Hoạt động tuần này"
            sub="Người dùng & phiên học"
            legend={
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {[
                  { label: 'Người dùng', color: T.accent },
                  { label: 'Phiên học',  color: T.green },
                ].map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: 12, color: T.textMuted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={BASE_H}>
              <AreaChart data={weeklyData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradUsers"    x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.accent} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.green} stopOpacity={0.10} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="day" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="users"    name="Người dùng" stroke={T.accent} strokeWidth={2.5} fill="url(#gradUsers)"    dot={{ r: 3, fill: T.accent, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="sessions" name="Phiên học"  stroke={T.green}  strokeWidth={2.5} fill="url(#gradSessions)" dot={{ r: 3, fill: T.green,  strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard> 
        </Col>

        {/* Donut + pending actions */}
        <Col xs={24} xl={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <ChartCard
            title="Môn học & Cần xử lý"
            sub="Tỷ lệ môn & tác vụ chờ"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Donut */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
                  <ResponsiveContainer width={130} height={130}>
                    <PieChart>
                      <Pie
                        data={subjectData} cx="50%" cy="50%"
                        innerRadius={40} outerRadius={62}
                        paddingAngle={3} dataKey="value"
                        startAngle={90} endAngle={-270}
                      >
                        {subjectData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: 18, fontWeight: 500, color: T.text, lineHeight: 1 }}>{subjectData.length}</div>
                    <div style={{ fontSize: 10, color: T.textSubtle }}>Môn</div>
                  </div>
                </div>
                {/* Legend */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {subjectData.map((s) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                        <span style={{ fontSize: 12, color: T.textMuted }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: s.color }}>{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { label: 'Duyệt gia sư',    count: 5, color: T.accent, path: '/admin/tutors/pending' },
                  { label: 'Xử lý nạp tiền', count: 3, color: T.green,  path: '/admin/credits/pending' },
                  { label: 'Khiếu nại mới',   count: 2, color: T.red,    path: '/admin/complaints' },
                ].map((item) => (
                  <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 12px', borderRadius: 10,
                      background: `${item.color}08`,
                      border: `1px solid ${item.color}18`,
                      transition: 'all 0.15s',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = `${item.color}16`;
                        (e.currentTarget as HTMLElement).style.borderColor = item.color;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = `${item.color}08`;
                        (e.currentTarget as HTMLElement).style.borderColor = `${item.color}18`;
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `${item.color}14`,
                          color: item.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                        }}>
                          <ExclamationCircleOutlined />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{item.label}</span>
                      </div>
                      <div style={{
                        minWidth: 22, height: 22, borderRadius: 9999,
                        background: `${item.color}18`, color: item.color,
                        fontSize: 11, fontWeight: 500,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
                      }}>
                        {item.count}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* ── Charts Row 2 ────────────────────────────────────────────────── */}
      <Row gutter={[14, 14]} align="stretch">
        {/* Stacked bar */}
        <Col xs={24} xl={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <ChartCard
            title="Phiên học theo trạng thái"
            sub="6 tháng gần nhất"
            legend={
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {[
                  { label: 'Hoàn thành', color: T.green },
                  { label: 'Đang chờ',    color: T.blue },
                  { label: 'Đã hủy',      color: T.red },
                ].map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                    <span style={{ fontSize: 12, color: T.textMuted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={BASE_H}>
              <BarChart data={sessionStatusData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="completed" name="Hoàn thành" stackId="a" fill={T.green} radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending"   name="Đang chờ"   stackId="a" fill={T.blue}   radius={[0, 0, 0, 0]} />
                <Bar dataKey="cancelled" name="Đã hủy"    stackId="a" fill={T.red}    radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>

        {/* Monthly trend line */}
        <Col xs={24} xl={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <ChartCard
            title="Xu hướng phiên học"
            sub="12 tháng"
            legend={
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <div style={{ width: 20, height: 2, background: T.accent, borderRadius: 2 }} />
                <span style={{ fontSize: 12, color: T.textMuted }}>Tổng phiên</span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={BASE_H}>
              <AreaChart data={monthlyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMonth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.accent} stopOpacity={0.10} />
                    <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="sessions" name="Phiên" stroke={T.accent} strokeWidth={2.5} fill="url(#gradMonth)" dot={{ r: 3, fill: T.accent, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
      </Row>

      {/* ── Tables Row ──────────────────────────────────────────────────── */}
      <Row gutter={[14, 14]} style={{ marginTop: 14 }} align="stretch">
        {/* Recent Sessions */}
        <Col xs={24} xl={13} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Phiên học gần đây</div>
              <Link to="/admin/sessions" style={{ fontSize: 12, color: T.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Xem tất cả <ArrowRightOutlined style={{ fontSize: 10 }} />
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Học sinh', 'Môn', 'Ngày', 'Trạng thái'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '0 12px 10px',
                        fontWeight: 600, fontSize: 11,
                        color: T.textSubtle, letterSpacing: '0.4px', textTransform: 'uppercase',
                        borderBottom: `1px solid ${T.border}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s) => (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${T.border}`, transition: 'background 0.12s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = T.accentLight)}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: T.accentLight, color: T.accent,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 500, fontSize: 12, flexShrink: 0,
                          }}>
                            {s.avatar}
                          </div>
                          <span style={{ color: T.text, fontWeight: 500 }}>{s.student}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: T.textMuted }}>{s.subject}</td>
                      <td style={{ padding: '12px', color: T.textMuted }}>{dayjs(s.date).format('DD/MM')}</td>
                      <td style={{ padding: '12px' }}>
                        <StatusBadge status={s.status} size="small" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>

        {/* Recent Tutors */}
        <Col xs={24} xl={11} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Gia sư mới đăng ký</div>
              <Link to="/admin/tutors/pending" style={{ fontSize: 12, color: T.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Duyệt ngay <ArrowRightOutlined style={{ fontSize: 10 }} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentTutors.map((t) => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 12,
                  border: `1px solid ${T.border}`,
                  transition: 'all 0.15s', cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = T.accentLight;
                    (e.currentTarget as HTMLElement).style.borderColor = T.accent;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = T.border;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: T.accentLight, color: T.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 500, fontSize: 14,
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>{t.subject}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {t.pending ? (
                      <div style={{
                        padding: '3px 10px', borderRadius: 9999,
                        background: T.orangeLight, color: T.orange,
                        fontSize: 11, fontWeight: 600,
                      }}>
                        Chờ duyệt
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: T.orange }}>★ {t.rating}</span>
                        </div>
                        <div style={{ fontSize: 11, color: T.textSubtle, marginTop: 2 }}>{t.students} học sinh</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
