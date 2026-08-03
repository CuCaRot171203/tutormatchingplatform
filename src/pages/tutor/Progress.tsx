import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Input, Select, Row, Col,
  Typography, Progress, Statistic, Modal,
} from 'antd';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  BookOutlined, TrophyOutlined, CheckCircleOutlined,
  ClockCircleOutlined, RiseOutlined, SearchOutlined,
  CalendarOutlined, EditOutlined,
} from '@ant-design/icons';
import { mockProgress, mockSessions, subjectProgressData, SUBJECTS } from '../../data/tutorMockData';
import type { LearningMilestone, MilestoneStatus } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61', greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706', orangeLight: 'rgba(217,119,6,0.08)',
  red: '#dc2626', yellow: '#f59e0b', blue: '#3b82f6',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const fmtVnd = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 });

const monthlyProgressData = [
  { month: 'T1', Toán: 60, Lý: 55, Anh: 70, Hóa: 50 },
  { month: 'T2', Toán: 65, Lý: 60, Anh: 72, Hóa: 58 },
  { month: 'T3', Toán: 70, Lý: 68, Anh: 75, Hóa: 65 },
  { month: 'T4', Toán: 73, Lý: 72, Anh: 78, Hóa: 68 },
  { month: 'T5', Toán: 78, Lý: 76, Anh: 80, Hóa: 72 },
  { month: 'T6', Toán: 82, Lý: 85, Anh: 70, Hóa: 72 },
];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 500, color: p.color }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
};

const TutorProgress: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<LearningMilestone | null>(null);

  const filtered = mockProgress.filter(m => {
    const matchSearch = !searchText ||
      m.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      m.milestoneName.toLowerCase().includes(searchText.toLowerCase());
    const matchSubject = !subjectFilter || m.subjectName === subjectFilter;
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchSubject && matchStatus;
  });

  // Stats
  const totalMilestones = mockProgress.length;
  const completedMilestones = mockProgress.filter(m => m.status === 'Completed').length;
  const inProgressMilestones = mockProgress.filter(m => m.status === 'InProgress').length;
  const avgCompletion = Math.round(
    mockProgress.reduce((sum, m) => sum + m.completionPercentage, 0) / Math.max(1, mockProgress.length)
  );

  const statusColor = (status: MilestoneStatus) => {
    if (status === 'Completed') return T.green;
    if (status === 'InProgress') return T.primary;
    return T.textSubtle;
  };

  const statusBg = (status: MilestoneStatus) => {
    if (status === 'Completed') return T.greenLight;
    if (status === 'InProgress') return T.primaryLight;
    return '#f5f5f7';
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectName',
      key: 'subjectName',
      filters: [
        { text: 'Toán', value: 'Toán' },
        { text: 'Lý', value: 'Lý' },
        { text: 'Anh Văn', value: 'Anh Văn' },
        { text: 'Hóa', value: 'Hóa' },
      ],
      onFilter: (value: any, record: LearningMilestone) => record.subjectName === value,
      render: (subject: string) => (
        <Tag style={{ borderRadius: 6, fontWeight: 600, border: 'none' }}
          color={subject === 'Toán' ? 'purple' : subject === 'Lý' ? 'orange' : subject === 'Anh Văn' ? 'blue' : 'magenta'}>
          {subject}
        </Tag>
      ),
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'milestoneName',
      key: 'milestoneName',
      render: (name: string, record: LearningMilestone) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{name}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>{record.studentName}</Text></div>
        </div>
      ),
    },
    {
      title: 'Ngày đến hạn',
      dataIndex: 'targetDate',
      key: 'targetDate',
      render: (date: string) => {
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day');
        return (
          <Text style={{ fontSize: 13, color: isOverdue ? T.red : T.textMuted }}>
            {dayjs(date).format('DD/MM/YYYY')}
            {isOverdue && <span style={{ marginLeft: 4, fontSize: 11 }}>⚠️</span>}
          </Text>
        );
      },
      sorter: (a: LearningMilestone, b: LearningMilestone) =>
        dayjs(a.targetDate).unix() - dayjs(b.targetDate).unix(),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'completionPercentage',
      key: 'completionPercentage',
      render: (pct: number, record: LearningMilestone) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
          <Progress percent={pct} size="small" style={{ flex: 1 }}
            strokeColor={record.status === 'Completed' ? T.green : T.primary}
            showInfo={false} />
          <Text style={{ fontSize: 12, fontWeight: 600, color: statusColor(record.status), minWidth: 36 }}>{pct}%</Text>
        </div>
      ),
      sorter: (a: LearningMilestone, b: LearningMilestone) => a.completionPercentage - b.completionPercentage,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoàn thành', value: 'Completed' },
        { text: 'Đang học', value: 'InProgress' },
        { text: 'Chưa bắt đầu', value: 'NotStarted' },
      ],
      onFilter: (value: any, record: LearningMilestone) => record.status === value,
      render: (status: MilestoneStatus) => (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 20,
          background: statusBg(status), fontSize: 12, fontWeight: 600,
          color: statusColor(status),
        }}>
          {status === 'Completed' ? <CheckCircleOutlined /> : status === 'InProgress' ? <ClockCircleOutlined /> : <EditOutlined />}
          {status === 'Completed' ? 'Hoàn thành' : status === 'InProgress' ? 'Đang học' : 'Chưa bắt đầu'}
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: LearningMilestone) => (
        <Button size="small" onClick={() => setDetailModal(record)} style={{ borderRadius: 8 }}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: T.text, letterSpacing: '-0.3px' }}>Tiến độ học tập</h1>
        <Text type="secondary">Theo dõi mục tiêu và tiến độ học tập của học sinh</Text>
      </div>

      {/* Stat Cards */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.primary, fontSize: 18 }}>
                <BookOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.text }}>{totalMilestones}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Tổng mục tiêu</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, fontSize: 18 }}>
                <CheckCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.green }}>{completedMilestones}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Đã hoàn thành</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.orange}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.orange, fontSize: 18 }}>
                <ClockCircleOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.orange }}>{inProgressMilestones}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Đang học</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.blue}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.blue, fontSize: 18 }}>
                <RiseOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.blue }}>{avgCompletion}%</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Tiến độ TB</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }} align="stretch">
        <Col xs={24} xl={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...CARD_STYLE, flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Xu hướng tiến độ theo môn</div>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>6 tháng gần nhất</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyProgressData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  {['Toán', 'Lý', 'Anh', 'Hóa'].map((s, i) => (
                    <linearGradient key={s} id={`grad${s}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={[T.primary, T.orange, T.blue, T.red][i]} stopOpacity={0.12} />
                      <stop offset="95%" stopColor={[T.primary, T.orange, T.blue, T.red][i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                {[['Toán', T.primary], ['Lý', T.orange], ['Anh', T.blue], ['Hóa', T.red]].map(([key, color]) => (
                  <Area key={key as string} type="monotone" dataKey={key as string} name={key as string}
                    stroke={color as string} strokeWidth={2.5} fill={`url(#grad${key})`} dot={false} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col xs={24} xl={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...CARD_STYLE, flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>So sánh môn học</div>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>Điểm TB & hoàn thành</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={subjectProgressData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                      {payload.map((p: any) => (
                        <div key={p.name} style={{ fontSize: 12, color: p.color }}>
                          {p.name}: {p.value}{p.name === 'avgScore' ? '/10' : ' buổi'}
                        </div>
                      ))}
                    </div>
                  );
                }} />
                <Bar dataKey="avgScore" name="Điểm TB" fill={T.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Milestones Table */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Mục tiêu học tập</div>
            <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{filtered.length} mục tiêu</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
              value={searchText} onChange={e => setSearchText(e.target.value)} style={{ borderRadius: 10, width: 200 }} allowClear />
            <Select placeholder="Môn" allowClear style={{ width: 120 }} onChange={v => setSubjectFilter(v)}>
              {SUBJECTS.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}
            </Select>
            <Select placeholder="Trạng thái" allowClear style={{ width: 150 }} onChange={v => setStatusFilter(v)}>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="InProgress">Đang học</Option>
              <Option value="NotStarted">Chưa bắt đầu</Option>
            </Select>
          </div>
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="middle"
          locale={{ emptyText: 'Không có mục tiêu nào' }}
          style={{ borderRadius: 8 }}
          scroll={{ x: 800 }}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết mục tiêu"
        open={!!detailModal}
        onCancel={() => setDetailModal(null)}
        footer={null}
        centered
      >
        {detailModal && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag style={{ borderRadius: 6, fontWeight: 600 }}
                color={detailModal.subjectName === 'Toán' ? 'purple' : detailModal.subjectName === 'Lý' ? 'orange' : 'blue'}>
                {detailModal.subjectName}
              </Tag>
              <Title level={4} style={{ margin: '8px 0 0' }}>{detailModal.milestoneName}</Title>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Học sinh', value: detailModal.studentName },
                { label: 'Ngày đến hạn', value: dayjs(detailModal.targetDate).format('DD/MM/YYYY') },
                { label: 'Trạng thái', value: detailModal.status === 'Completed' ? 'Hoàn thành' : detailModal.status === 'InProgress' ? 'Đang học' : 'Chưa bắt đầu' },
                { label: 'Tiến độ', value: `${detailModal.completionPercentage}%` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text>
                  <Text strong style={{ fontSize: 14 }}>{item.value}</Text>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Tiến độ hoàn thành</Text>
                <Text strong style={{ fontSize: 14, color: T.primary }}>{detailModal.completionPercentage}%</Text>
              </div>
              <Progress percent={detailModal.completionPercentage} strokeColor={T.primary} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TutorProgress;
