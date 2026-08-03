import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Input, Select, Row, Col,
  Typography, Rate, Statistic, Avatar,
} from 'antd';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  StarOutlined, MessageOutlined, SearchOutlined,
  SmileOutlined, FrownOutlined,
} from '@ant-design/icons';
import { mockFeedback, mockStudents, ratingDistribution } from '../../data/tutorMockData';
import type { Feedback } from '../../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61', greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706', orangeLight: 'rgba(217,119,6,0.08)',
  red: '#dc2626', redLight: 'rgba(220,38,38,0.08)',
  yellow: '#f59e0b', blue: '#3b82f6',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const monthlyFeedbackData = [
  { month: 'T1', five: 2, four: 1, three: 0, two: 0 },
  { month: 'T2', five: 3, four: 0, three: 1, two: 0 },
  { month: 'T3', five: 2, four: 1, three: 0, two: 1 },
  { month: 'T4', five: 4, four: 1, three: 0, two: 0 },
  { month: 'T5', five: 3, four: 2, three: 0, two: 0 },
  { month: 'T6', five: 4, four: 1, three: 0, two: 0 },
];

const TutorFeedback: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  const enrichedFeedback = mockFeedback.map(f => {
    const session = mockStudents.find(s => s.id === f.senderId);
    return {
      ...f,
      student: session,
      subject: session?.subjects[0] || '—',
    };
  });

  const filtered = enrichedFeedback.filter(f => {
    const matchSearch = !searchText ||
      f.senderName.toLowerCase().includes(searchText.toLowerCase()) ||
      (f.comment || '').toLowerCase().includes(searchText.toLowerCase());
    const matchRating = !ratingFilter || f.rating === ratingFilter;
    const matchSubject = !subjectFilter || f.subject === subjectFilter;
    return matchSearch && matchRating && matchSubject;
  });

  // Stats
  const avgRating = (enrichedFeedback.reduce((sum, f) => sum + f.rating, 0) / Math.max(1, enrichedFeedback.length)).toFixed(1);
  const totalFeedback = enrichedFeedback.length;
  const fiveStars = enrichedFeedback.filter(f => f.rating === 5).length;
  const oneStars = enrichedFeedback.filter(f => f.rating <= 2).length;
  const positiveRate = Math.round((fiveStars + enrichedFeedback.filter(f => f.rating === 4).length) / Math.max(1, totalFeedback) * 100);

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      render: (_: any, record: typeof enrichedFeedback[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={38} style={{ backgroundColor: T.primary, fontSize: 14, fontWeight: 600 }}>
            {record.senderName[0]}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14 }}>{record.senderName}</Text>
            <div>
              <Tag style={{ fontSize: 11, borderRadius: 4 }}
                color={record.subject === 'Toán' ? 'purple' : record.subject === 'Lý' ? 'orange' : record.subject === 'Anh Văn' ? 'blue' : 'cyan'}>
                {record.subject}
              </Tag>
            </div>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.senderName.localeCompare(b.senderName),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      filters: [
        { text: '5 sao', value: 5 },
        { text: '4 sao', value: 4 },
        { text: '3 sao', value: 3 },
        { text: '2 sao', value: 2 },
        { text: '1 sao', value: 1 },
      ],
      onFilter: (value: any, record: any) => record.rating === value,
      render: (rating: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Rate disabled value={rating} style={{ fontSize: 14 }} />
          <Text strong style={{ fontSize: 14, color: rating >= 4 ? T.green : rating === 3 ? T.orange : T.red }}>
            {rating}
          </Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.rating - b.rating,
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => (
        <div style={{ maxWidth: 360 }}>
          <Paragraph style={{ margin: 0, fontSize: 13, color: T.textMuted }} ellipsis={{ rows: 2, expandable: true, symbol: 'thêm' }}>
            {comment || <Text type="secondary" italic>Không có bình luận</Text>}
          </Paragraph>
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{dayjs(date).format('DD/MM/YYYY HH:mm')}</Text>
      ),
      sorter: (a: any, b: any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend' as const,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: T.text, letterSpacing: '-0.3px' }}>Phản hồi từ học sinh</h1>
        <Text type="secondary">Xem và quản lý đánh giá của học sinh</Text>
      </div>

      {/* Stat Cards */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 14, right: 14, width: 44, height: 44, borderRadius: 12, background: `${T.yellow}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.yellow, fontSize: 20 }}>
              <StarOutlined />
            </div>
            <div style={{ paddingRight: 56 }}>
              <div style={{ fontSize: 36, fontWeight: 500, color: T.yellow }}>{avgRating}</div>
              <Rate disabled value={Math.round(parseFloat(avgRating))} style={{ fontSize: 14, marginTop: 4 }} />
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>Điểm TB</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.blue}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.blue, fontSize: 20 }}>
                <MessageOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.text }}>{totalFeedback}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Tổng phản hồi</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, fontSize: 20 }}>
                <SmileOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.green }}>{fiveStars}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Đánh giá 5 sao</div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div style={{ ...CARD_STYLE, minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, fontSize: 20 }}>
                <StarOutlined />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: T.green }}>{positiveRate}%</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>Tỷ lệ tích cực</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[14, 14]} style={{ marginBottom: 16 }} align="stretch">
        {/* Rating Distribution */}
        <Col xs={24} xl={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...CARD_STYLE, flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Phân bố đánh giá</div>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>Tất cả thời gian</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={ratingDistribution.filter(r => r.count > 0)} cx="50%" cy="50%" innerRadius={30} outerRadius={52}
                      paddingAngle={2} dataKey="count" startAngle={90} endAngle={-270}>
                      {ratingDistribution.filter(r => r.count > 0).map((_, i) => (
                        <Cell key={i} fill={[T.green, T.primary, T.orange, '#ec4899', T.red][i]} stroke="transparent" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: T.text, lineHeight: 1 }}>{totalFeedback}</div>
                  <div style={{ fontSize: 10, color: T.textSubtle }}>Đánh giá</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ratingDistribution.filter(r => r.count > 0).map((r, i) => (
                  <div key={r.rating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: [T.green, T.primary, T.orange, '#ec4899', T.red][i] }} />
                      <span style={{ fontSize: 12, color: T.textMuted }}>{r.rating}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 80, height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.percent}%`, background: [T.green, T.primary, T.orange, '#ec4899', T.red][i], borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.text, minWidth: 30 }}>{r.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Monthly trend */}
        <Col xs={24} xl={14} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...CARD_STYLE, flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Xu hướng đánh giá</div>
              <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>6 tháng gần nhất</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyFeedbackData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.textSubtle }} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4 }}>{label}</div>
                      {payload.map((p: any) => (
                        <div key={p.name} style={{ fontSize: 12, color: p.color }}>
                          {p.name}: {p.value}
                        </div>
                      ))}
                    </div>
                  );
                }} />
                <Bar dataKey="five" name="5 sao" fill={T.green} radius={[3, 3, 0, 0]} />
                <Bar dataKey="four" name="4 sao" fill={T.primary} radius={[3, 3, 0, 0]} />
                <Bar dataKey="three" name="3 sao" fill={T.orange} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Feedback Table */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Danh sách phản hồi</div>
            <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 2 }}>{filtered.length} phản hồi</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
              value={searchText} onChange={e => setSearchText(e.target.value)} style={{ borderRadius: 10, width: 200 }} allowClear />
            <Select placeholder="Môn học" allowClear style={{ width: 130 }} onChange={v => setSubjectFilter(v)}>
              <Option value="Toán">Toán</Option>
              <Option value="Lý">Lý</Option>
              <Option value="Anh Văn">Anh Văn</Option>
              <Option value="Hóa">Hóa</Option>
            </Select>
            <Select placeholder="Rating" allowClear style={{ width: 130 }} onChange={v => setRatingFilter(v)}>
              <Option value={5}>5 sao</Option>
              <Option value={4}>4 sao</Option>
              <Option value={3}>3 sao</Option>
              <Option value={2}>2 sao</Option>
              <Option value={1}>1 sao</Option>
            </Select>
          </div>
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="middle"
          locale={{ emptyText: 'Chưa có phản hồi nào' }}
          style={{ borderRadius: 8 }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default TutorFeedback;
