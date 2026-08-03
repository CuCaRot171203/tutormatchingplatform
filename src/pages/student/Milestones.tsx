import React, { useState } from 'react';
import {
  Row, Col, Select, Progress, Empty,
} from 'antd';
import {
  FlagOutlined, BookOutlined, CalendarOutlined,
  SortAscendingOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined,
  TrophyOutlined, LineChartOutlined, RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

dayjs.extend(relativeTime);


type MilestoneStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Overdue';
type SortKey = 'targetDate' | 'completionPercentage' | 'name';

interface Milestone {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: number;
  subjectName: string;
  milestoneName: string;
  targetDate: string;
  status: MilestoneStatus;
  completionPercentage: number;
  description?: string;
}

const T = {
  primary: '#0062FF',
  primaryLight: 'rgba(0, 98, 255, 0.06)',
  primaryBorder: 'rgba(0, 98, 255, 0.14)',
  ink: '#1d1d1f',
  inkMuted80: '#333333',
  inkMuted48: '#7a7a7a',
  dividerSoft: '#f0f0f0',
  hairline: '#e0e0e0',
  canvas: '#ffffff',
  parchment: '#f5f5f7',
  green: '#149e61',
  greenLight: 'rgba(20, 158, 97, 0.08)',
  warning: '#d97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  error: '#dc2626',
  errorBg: 'rgba(220, 38, 38, 0.08)',
  purple: '#7132f5',
  purpleBg: 'rgba(113, 50, 245, 0.08)',
};

const mockMilestones: Milestone[] = [
  { id: '1', studentId: 's1', studentName: 'Nguyễn Văn An', subjectId: 1, subjectName: 'Toán học', milestoneName: 'Nắm vững Đại số chương 1–3', targetDate: dayjs().add(14, 'day').toISOString(), status: 'InProgress', completionPercentage: 65, description: 'Ôn tập và giải bài tập các chương về hàm số bậc nhất, bậc hai và phương trình.' },
  { id: '2', studentId: 's1', studentName: 'Nguyễn Văn An', subjectId: 2, subjectName: 'Vật lý', milestoneName: 'Hiểu sâu Cơ học – Dao động cơ', targetDate: dayjs().add(7, 'day').toISOString(), status: 'Overdue', completionPercentage: 40, description: 'Nắm chắc kiến thức cơ bản về dao động điều hòa và con lắc lò xo.' },
  { id: '3', studentId: 's1', studentName: 'Nguyễn Văn An', subjectId: 3, subjectName: 'Hóa học', milestoneName: 'Hoàn thành chương Kim loại', targetDate: dayjs().subtract(3, 'day').toISOString(), status: 'Completed', completionPercentage: 100, description: 'Tổng hợp tính chất các kim loại và phản ứng hóa học.' },
  { id: '4', studentId: 's2', studentName: 'Trần Thị Bình', subjectId: 4, subjectName: 'Tiếng Anh', milestoneName: 'IELTS Reading 6.5+', targetDate: dayjs().add(30, 'day').toISOString(), status: 'NotStarted', completionPercentage: 0, description: 'Luyện đề IELTS Reading, học từ vựng học thuật.' },
  { id: '5', studentId: 's2', studentName: 'Trần Thị Bình', subjectId: 1, subjectName: 'Toán học', milestoneName: 'Giải thành thạo phương trình lượng giác', targetDate: dayjs().add(10, 'day').toISOString(), status: 'InProgress', completionPercentage: 75, description: 'Luyện tập các dạng phương trình lượng giác cơ bản và nâng cao.' },
  { id: '6', studentId: 's3', studentName: 'Lê Minh Cường', subjectId: 5, subjectName: 'Ngữ văn', milestoneName: 'Viết bài văn nghị luận xã hội', targetDate: dayjs().add(5, 'day').toISOString(), status: 'InProgress', completionPercentage: 55, description: 'Học cấu trúc, lập dàn ý và viết bài văn nghị luận xã hội.' },
  { id: '7', studentId: 's1', studentName: 'Nguyễn Văn An', subjectId: 4, subjectName: 'Tiếng Anh', milestoneName: 'Ngữ pháp: Thì và Câu bị động', targetDate: dayjs().subtract(1, 'day').toISOString(), status: 'Overdue', completionPercentage: 20, description: 'Ôn tập các thì trong Tiếng Anh và cách chuyển sang câu bị động.' },
  { id: '8', studentId: 's4', studentName: 'Phạm Thu Dung', subjectId: 6, subjectName: 'Sinh học', milestoneName: 'Di truyền học – Bài tập lai', targetDate: dayjs().add(20, 'day').toISOString(), status: 'NotStarted', completionPercentage: 0, description: 'Giải các bài tập lai di truyền Mendel và phân li độc lập.' },
];

const progressChartData = [
  { week: 'T1', completion: 10, target: 20 },
  { week: 'T2', completion: 18, target: 40 },
  { week: 'T3', completion: 35, target: 60 },
  { week: 'T4', completion: 48, target: 70 },
  { week: 'T5', completion: 55, target: 80 },
  { week: 'T6', completion: 62, target: 90 },
];

const statusConfig: Record<MilestoneStatus, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  NotStarted: { color: T.inkMuted48, bg: 'rgba(110,110,115,0.08)', label: 'Chưa bắt đầu', icon: <ClockCircleOutlined /> },
  InProgress: { color: T.primary, bg: T.primaryLight, label: 'Đang thực hiện', icon: <FlagOutlined /> },
  Completed:  { color: T.green, bg: T.greenLight, label: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
  Overdue:    { color: T.error, bg: T.errorBg, label: 'Quá hạn', icon: <ExclamationCircleOutlined /> },
};

const subjectColors: Record<string, string> = {
  'Toán học': '#0062FF', 'Vật lý': '#00B4D8',
  'Hóa học': '#2DC653', 'Tiếng Anh': '#FFD166',
  'Ngữ văn': '#E63946', 'Sinh học': '#8338EC',
  'Tin học': '#FB5607', 'Lịch sử': '#8D6346',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.canvas,
  border: `1px solid ${T.dividerSoft}`,
  borderRadius: 18,
  overflow: 'hidden',
};

const getSubjectColor = (name: string) => subjectColors[name] || T.primary;

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string; color: string; suffix?: string }> = ({ icon, label, value, color, suffix }) => (
  <div style={{
    background: T.canvas,
    borderRadius: 12,
    border: `1px solid ${T.dividerSoft}`,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 11,
      background: `${color}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color, fontSize: 18, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 12, color: T.inkMuted48, fontFamily: "'SF Pro Text', sans-serif", letterSpacing: '-0.12px' }}>
        {label}
      </p>
      <p style={{
        margin: 0, fontSize: 22, fontWeight: 500,
        color: color, letterSpacing: '-0.28px',
        fontFamily: "'SF Pro Display', system-ui, sans-serif",
      }}>
        {value}{suffix && <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>{suffix}</span>}
      </p>
    </div>
  </div>
);

type FilterType = 'all' | MilestoneStatus;

const FilterBar: React.FC<{
  statusFilter: FilterType;
  subjectFilter: string;
  sortKey: SortKey;
  onStatusChange: (v: FilterType) => void;
  onSubjectChange: (v: string) => void;
  onSortChange: (v: SortKey) => void;
  counts: Record<string, number>;
  subjectOptions: { value: string; label: string }[];
}> = ({ statusFilter, subjectFilter, sortKey, onStatusChange, onSubjectChange, onSortChange, counts, subjectOptions }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {([
        { key: 'all', label: `Tất cả (${counts['all']})` },
        { key: 'NotStarted', label: `Chưa bắt đầu (${counts['NotStarted'] || 0})` },
        { key: 'InProgress', label: `Đang thực hiện (${counts['InProgress'] || 0})` },
        { key: 'Completed', label: `Hoàn thành (${counts['Completed'] || 0})` },
        { key: 'Overdue', label: `Quá hạn (${counts['Overdue'] || 0})` },
      ] as { key: FilterType; label: string }[]).map(item => (
        <button
          key={item.key}
          onClick={() => onStatusChange(item.key)}
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            border: statusFilter === item.key ? `1.5px solid ${T.primary}` : '1.5px solid rgba(0,0,0,0.10)',
            background: statusFilter === item.key ? T.primaryLight : T.canvas,
            color: statusFilter === item.key ? T.primary : T.inkMuted48,
            fontSize: 12, fontWeight: statusFilter === item.key ? 500 : 400,
            cursor: 'pointer',
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            letterSpacing: '-0.12px',
            transition: 'all 0.18s ease',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
          onMouseEnter={e => {
            if (statusFilter !== item.key) {
              (e.currentTarget as HTMLButtonElement).style.background = T.parchment;
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.14)';
            }
          }}
          onMouseLeave={e => {
            if (statusFilter !== item.key) {
              (e.currentTarget as HTMLButtonElement).style.background = T.canvas;
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.10)';
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>

    <div style={{ width: 1, height: 24, background: T.dividerSoft }} />

    <Select
      value={subjectFilter}
      onChange={onSubjectChange}
      style={{ width: 160 }}
      size="middle"
      placeholder="Môn học"
    >
      <Select.Option value="allSubjects">Tất cả môn</Select.Option>
      {subjectOptions.map(s => <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>)}
    </Select>

    <Select
      value={sortKey}
      onChange={onSortChange}
      style={{ width: 170 }}
      size="middle"
      suffixIcon={<SortAscendingOutlined style={{ fontSize: 12 }} />}
    >
      <Select.Option value="targetDate">Ngày đích</Select.Option>
      <Select.Option value="completionPercentage">% Hoàn thành</Select.Option>
      <Select.Option value="name">Tên mục tiêu</Select.Option>
    </Select>
  </div>
);

const MilestoneCard: React.FC<{
  milestone: Milestone;
  onClick: () => void;
  index: number;
}> = ({ milestone, onClick, index }) => {
  const sc = statusConfig[milestone.status];
  const subColor = getSubjectColor(milestone.subjectName);
  const daysLeft = dayjs(milestone.targetDate).diff(dayjs(), 'day');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        onClick={onClick}
        style={{
          background: T.canvas,
          border: `1px solid ${T.dividerSoft}`,
          borderLeft: `3px solid ${sc.color}`,
          borderRadius: 12,
          padding: '18px 20px',
          marginBottom: 8,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px ${T.primaryBorder}`;
          (e.currentTarget as HTMLDivElement).style.borderColor = `${T.primaryBorder}`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.borderLeft = `3px solid ${sc.color}`;
          (e.currentTarget as HTMLDivElement).style.border = `1px solid ${T.dividerSoft}`;
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 10px', borderRadius: 9999,
                background: `${subColor}14`,
                color: subColor,
                fontSize: 11, fontWeight: 500,
                fontFamily: "'SF Pro Text', sans-serif",
                letterSpacing: '-0.12px',
              }}>
                <BookOutlined style={{ fontSize: 10 }} />
                {milestone.subjectName}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 10px', borderRadius: 9999,
                background: sc.bg,
                color: sc.color,
                fontSize: 11, fontWeight: 500,
                fontFamily: "'SF Pro Text', sans-serif",
                letterSpacing: '-0.12px',
              }}>
                {sc.icon}
                {sc.label}
              </span>
              {milestone.status === 'Overdue' && (
                <span style={{
                  color: T.error, fontSize: 12, fontWeight: 500,
                  letterSpacing: '-0.12px',
                }}>
                  Quá {Math.abs(daysLeft)} ngày
                </span>
              )}
              {milestone.status === 'InProgress' && daysLeft >= 0 && (
                <span style={{
                  color: T.inkMuted48, fontSize: 12,
                  letterSpacing: '-0.12px',
                }}>
                  Còn {daysLeft} ngày
                </span>
              )}
            </div>

            <h3 style={{
              margin: 0, fontSize: 14, fontWeight: 500,
              color: T.ink,
              letterSpacing: '-0.224px',
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              lineHeight: 1.3,
            }}>
              {milestone.milestoneName}
            </h3>

            {milestone.description && (
              <p style={{
                margin: '4px 0 0',
                fontSize: 12, color: T.inkMuted48,
                lineHeight: 1.55,
                letterSpacing: '-0.12px',
                fontFamily: "'SF Pro Text', sans-serif",
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {milestone.description}
              </p>
            )}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: 12,
            background: `${sc.color}14`,
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 18, fontWeight: 500,
              color: sc.color,
              letterSpacing: '-0.28px',
              fontFamily: "'SF Pro Display', sans-serif",
            }}>
              {milestone.completionPercentage}%
            </span>
          </div>
        </div>

        <Progress
          percent={milestone.completionPercentage}
          size="small"
          showInfo={false}
          strokeColor={sc.color}
          trailColor="rgba(0,0,0,0.06)"
          style={{ marginBottom: 12 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarOutlined style={{ fontSize: 12, color: T.inkMuted48 }} />
            <span style={{
              fontSize: 12, color: T.inkMuted48,
              letterSpacing: '-0.12px',
              fontFamily: "'SF Pro Text', sans-serif",
            }}>
              Đích: {dayjs(milestone.targetDate).format('DD/MM/YYYY')}
            </span>
          </div>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: T.primary, fontSize: 12, fontWeight: 500,
            letterSpacing: '-0.12px',
            fontFamily: "'SF Pro Text', sans-serif",
          }}>
            Chi tiết <RightOutlined style={{ fontSize: 10 }} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const StudentMilestones: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('allSubjects');
  const [sortKey, setSortKey] = useState<SortKey>('targetDate');

  const subjectOptions = [...new Set(mockMilestones.map(m => m.subjectName))].map(name => ({ value: name, label: name }));

  const filtered = mockMilestones
    .filter(m => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (subjectFilter !== 'allSubjects' && m.subjectName !== subjectFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === 'targetDate') return dayjs(a.targetDate).diff(dayjs(b.targetDate));
      if (sortKey === 'completionPercentage') return b.completionPercentage - a.completionPercentage;
      return a.milestoneName.localeCompare(b.milestoneName);
    });

  const counts = {
    all: mockMilestones.length,
    NotStarted: mockMilestones.filter(m => m.status === 'NotStarted').length,
    InProgress: mockMilestones.filter(m => m.status === 'InProgress').length,
    Completed: mockMilestones.filter(m => m.status === 'Completed').length,
    Overdue: mockMilestones.filter(m => m.status === 'Overdue').length,
  };

  const avgCompletion = Math.round(
    mockMilestones.reduce((sum, m) => sum + m.completionPercentage, 0) / mockMilestones.length
  );

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
          Mục tiêu học tập
        </h1>
        <p style={{
          fontSize: 12, color: T.inkMuted48,
          margin: 0, letterSpacing: '-0.12px',
        }}>
          Theo dõi và quản lý các mục tiêu học tập của bạn
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          {[
            { icon: <FlagOutlined />, label: 'Tổng mục tiêu', value: mockMilestones.length, color: T.primary },
            { icon: <CheckCircleOutlined />, label: 'Đã hoàn thành', value: counts.Completed, color: T.green },
            { icon: <ClockCircleOutlined />, label: 'Đang thực hiện', value: counts.InProgress, color: T.primary },
            { icon: <ExclamationCircleOutlined />, label: 'Quá hạn', value: counts.Overdue, color: T.error },
          ].map(stat => (
            <Col key={stat.label} xs={12} sm={8} md={6}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>
      </motion.div>

      <Row gutter={[20, 20]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={CARD_STYLE}
          >
            <div style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${T.dividerSoft}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FlagOutlined style={{ color: T.primary, fontSize: 15 }} />
                <span style={{
                  fontSize: 14, fontWeight: 500,
                  color: T.ink,
                  letterSpacing: '-0.224px',
                  fontFamily: "'SF Pro Text', sans-serif",
                }}>
                  Danh sách mục tiêu
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 20, height: 20, borderRadius: 9999,
                  background: T.primary, color: '#fff',
                  fontSize: 11, fontWeight: 500,
                  padding: '0 6px',
                  fontFamily: "'SF Pro Text', sans-serif",
                }}>
                  {filtered.length}
                </span>
              </div>
            </div>

            <div style={{ padding: '16px 24px 24px' }}>
              <FilterBar
                statusFilter={statusFilter}
                subjectFilter={subjectFilter}
                sortKey={sortKey}
                onStatusChange={setStatusFilter}
                onSubjectChange={setSubjectFilter}
                onSortChange={setSortKey}
                counts={counts}
                subjectOptions={subjectOptions}
              />

              {filtered.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{
                      color: T.inkMuted48, fontSize: 12,
                      letterSpacing: '-0.12px',
                      fontFamily: "'SF Pro Text', sans-serif",
                    }}>
                      Không có mục tiêu nào phù hợp
                    </span>
                  }
                  style={{ margin: '60px 0' }}
                />
              ) : (
                filtered.map((milestone, index) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    onClick={() => navigate(`/student/milestone/${milestone.id}`)}
                  />
                ))
              )}
            </div>
          </motion.div>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...CARD_STYLE, marginBottom: 16 }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${T.dividerSoft}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <LineChartOutlined style={{ color: T.primary, fontSize: 15 }} />
              <span style={{
                fontSize: 14, fontWeight: 500,
                color: T.ink, letterSpacing: '-0.224px',
                fontFamily: "'SF Pro Text', sans-serif",
              }}>
                Biểu đồ tiến độ
              </span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={progressChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorCompletion2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.primary} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={T.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: T.inkMuted48, fontFamily: "'SF Pro Text', sans-serif", letterSpacing: '-0.12px' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: T.inkMuted48, fontFamily: "'SF Pro Text', sans-serif", letterSpacing: '-0.12px' }}
                    axisLine={false} tickLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 10, border: `1px solid ${T.dividerSoft}`,
                      fontFamily: "'SF Pro Text', sans-serif", fontSize: 12,
                      color: T.ink,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke={T.inkMuted48}
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke={T.primary}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: T.primary, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center' }}>
                {[
                  { color: T.primary, label: 'Hoàn thành' },
                  { color: T.inkMuted48, label: 'Mục tiêu', dashed: true },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 20, height: 2, background: item.color,
                      borderRadius: 2,
                      borderTop: item.dashed ? '1px dashed' : 'none',
                    }} />
                    <span style={{
                      fontSize: 11, color: T.inkMuted48,
                      letterSpacing: '-0.12px',
                      fontFamily: "'SF Pro Text', sans-serif",
                    }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...CARD_STYLE, padding: '20px', marginBottom: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrophyOutlined style={{ color: T.warning, fontSize: 15 }} />
              <span style={{
                fontSize: 14, fontWeight: 500,
                color: T.ink, letterSpacing: '-0.224px',
                fontFamily: "'SF Pro Text', sans-serif",
              }}>
                Tổng kết
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Tỷ lệ hoàn thành TB', value: `${avgCompletion}%`, color: T.primary },
                { label: 'Mục tiêu quá hạn', value: `${counts.Overdue}`, color: T.error },
                { label: 'Đang theo dõi', value: `${counts.InProgress + counts.NotStarted}`, color: T.warning },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: T.parchment, borderRadius: 10,
                }}>
                  <span style={{
                    fontSize: 12, color: T.inkMuted48,
                    letterSpacing: '-0.12px',
                    fontFamily: "'SF Pro Text', sans-serif",
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: 500,
                    color: item.color,
                    letterSpacing: '-0.12px',
                    fontFamily: "'SF Pro Text', sans-serif",
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subject Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...CARD_STYLE, padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOutlined style={{ color: T.purple, fontSize: 15 }} />
              <span style={{
                fontSize: 14, fontWeight: 500,
                color: T.ink, letterSpacing: '-0.224px',
                fontFamily: "'SF Pro Text', sans-serif",
              }}>
                Theo môn học
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subjectOptions.map(sub => {
                const subMilestones = mockMilestones.filter(m => m.subjectName === sub.label);
                const completed = subMilestones.filter(m => m.status === 'Completed').length;
                const color = getSubjectColor(sub.label);
                return (
                  <div key={sub.value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${color}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: color, fontSize: 14, fontWeight: 500, flexShrink: 0,
                      fontFamily: "'SF Pro Display', sans-serif",
                    }}>
                      {sub.label[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{
                          fontSize: 13, fontWeight: 500, color: T.ink,
                          letterSpacing: '-0.224px',
                          fontFamily: "'SF Pro Text', sans-serif",
                        }}>
                          {sub.label}
                        </span>
                        <span style={{
                          fontSize: 12, color: T.inkMuted48,
                          letterSpacing: '-0.12px',
                          fontFamily: "'SF Pro Text', sans-serif",
                        }}>
                          {completed}/{subMilestones.length}
                        </span>
                      </div>
                      <Progress
                        percent={Math.round((completed / subMilestones.length) * 100)}
                        size="small"
                        showInfo={false}
                        strokeColor={color}
                        trailColor="rgba(0,0,0,0.06)"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentMilestones;
