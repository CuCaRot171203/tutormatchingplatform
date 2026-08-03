import React, { useState } from 'react';
import {
  Card, Table, Tag, Avatar, Button, Input, Select, Drawer, Typography,
  Row, Col, Rate, Progress, Divider, Statistic, message,
} from 'antd';
import {
  SearchOutlined, MailOutlined, PhoneOutlined,
  TrophyOutlined, CalendarOutlined, BookOutlined,
  ClockCircleOutlined, TeamOutlined,
} from '@ant-design/icons';
import { mockStudents, mockSessions, mockProgress, SUBJECTS } from '../../data/tutorMockData';
import type { LearningMilestone } from '../../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61', greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706', orangeLight: 'rgba(217,119,6,0.08)',
  yellow: '#f59e0b', blue: '#3b82f6', blueLight: 'rgba(59,130,246,0.08)',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const Students: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [sessionDrawer, setSessionDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<(typeof mockStudents[0] & { sessionCount: number; averageScore: number | undefined; totalHours: number }) | null>(null);

  // Enrich students with session data
  const enrichedStudents = mockStudents.map(s => {
    const studentSessions = mockSessions.filter(
      sess => sess.studentId === s.id && sess.status === 'Completed'
    );
    const avgScore = studentSessions.length > 0
      ? studentSessions.reduce((sum, sess) => sum + (sess.score || 0), 0) / studentSessions.length
      : undefined;
    const totalHours = studentSessions.reduce(
      (sum, sess) => sum + (dayjs(sess.endTime).diff(dayjs(sess.startTime), 'minute') / 60), 0
    );
    return { ...s, sessionCount: studentSessions.length, averageScore: avgScore, totalHours };
  });

  const filtered = enrichedStudents.filter(s => {
    const matchSearch = !searchText ||
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchText.toLowerCase());
    const matchSubject = !subjectFilter || s.subjects.some(sub => sub === subjectFilter);
    return matchSearch && matchSubject;
  });

  const studentMilestones = selectedStudent
    ? mockProgress.filter(m => m.studentId === selectedStudent.id)
    : [];

  const studentSessions = selectedStudent
    ? mockSessions.filter(s => s.studentId === selectedStudent.id)
    : [];

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      render: (_: any, record: typeof enrichedStudents[0]) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={44} style={{ backgroundColor: T.primary, fontSize: 16, fontWeight: 600, flexShrink: 0 }}>
            {record.name[0]}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Lớp',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: string) => <Tag style={{ borderRadius: 6, fontWeight: 500, border: 'none' }}>{grade}</Tag>,
      filters: [
        { text: 'Lớp 10', value: 'Lớp 10' },
        { text: 'Lớp 11', value: 'Lớp 11' },
        { text: 'Lớp 12', value: 'Lớp 12' },
      ],
      onFilter: (value: any, record: any) => record.grade === value,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {subjects.map((sub, i) => (
            <Tag key={i} style={{ borderRadius: 6, fontSize: 11 }}
              color={sub === 'Toán' ? 'purple' : sub === 'Lý' ? 'orange' : sub === 'Anh Văn' ? 'blue' : 'cyan'}>
              {sub}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Số buổi',
      dataIndex: 'sessionCount',
      key: 'sessionCount',
      render: (count: number) => <Text strong style={{ color: T.primary }}>{count}</Text>,
      sorter: (a: any, b: any) => a.sessionCount - b.sessionCount,
    },
    {
      title: 'Tổng giờ',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours: number) => <Text>{hours.toFixed(1)}h</Text>,
      sorter: (a: any, b: any) => a.totalHours - b.totalHours,
    },
    {
      title: 'Điểm TB',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score: number | undefined) =>
        score !== undefined ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text strong style={{ color: T.yellow, fontSize: 15 }}>{score.toFixed(1)}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>/10</Text>
          </div>
        ) : <Text type="secondary">—</Text>,
      sorter: (a: any, b: any) => (a.averageScore ?? 0) - (b.averageScore ?? 0),
    },
    {
      title: 'Lần cuối',
      dataIndex: 'lastSession',
      key: 'lastSession',
      render: (time: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>{time ? dayjs(time).format('DD/MM/YYYY') : '—'}</Text>
      ),
      sorter: (a: any, b: any) => dayjs(a.lastSession || 0).unix() - dayjs(b.lastSession || 0).unix(),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: any) => (
        <Button size="small" onClick={() => { setSelectedStudent(record); setSessionDrawer(true); }}
          icon={<BookOutlined />} style={{ borderRadius: 8 }}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: T.text, letterSpacing: '-0.3px' }}>Học sinh của tôi</h1>
        <Text type="secondary">Danh sách học sinh đã hoàn thành buổi học</Text>
      </div>

      {/* Filters */}
      <div style={{ ...CARD_STYLE, marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={10}>
            <Input
              placeholder="Tìm kiếm tên, email học sinh..."
              prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ borderRadius: 10 }}
              allowClear
            />
          </Col>
          <Col xs={12} md={6}>
            <Select placeholder="Lọc theo môn" allowClear style={{ width: '100%' }} onChange={v => setSubjectFilter(v)}>
              {SUBJECTS.map(s => <Option key={s.id} value={s.name}>{s.name}</Option>)}
            </Select>
          </Col>
          <Col xs={12} md={8} style={{ textAlign: 'right' }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              <TeamOutlined style={{ marginRight: 6 }} />
              <Text strong>{filtered.length}</Text> học sinh
            </Text>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <div style={CARD_STYLE}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} học sinh` }}
          size="middle"
          rowClassName={() => 'student-row'}
          locale={{ emptyText: 'Chưa có học sinh nào' }}
          style={{ borderRadius: 8 }}
          scroll={{ x: 900 }}
        />
      </div>

      {/* Student Detail Drawer */}
      <Drawer
        title={null}
        placement="right"
        width={500}
        open={sessionDrawer}
        onClose={() => setSessionDrawer(false)}
        bodyStyle={{ padding: 0 }}
      >
        {selectedStudent && (
          <div>
            {/* Profile Header */}
            <div style={{ background: `linear-gradient(135deg, ${T.primary} 0%, #5741d8 100%)`, padding: '28px 24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar size={64} style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: 24, fontWeight: 600, border: '3px solid rgba(255,255,255,0.4)' }}>
                  {selectedStudent.name[0]}
                </Avatar>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{selectedStudent.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{selectedStudent.grade}</div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  <MailOutlined />
                  {selectedStudent.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                  <PhoneOutlined />
                  {selectedStudent.phone}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}` }}>
              <Row gutter={12}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: T.primary }}>{selectedStudent.sessionCount}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>Buổi học</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', borderLeft: `1px solid ${T.border}`, borderRight: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: T.green }}>{selectedStudent.totalHours.toFixed(1)}h</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>Tổng giờ</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: T.yellow }}>
                      {selectedStudent.averageScore?.toFixed(1) ?? '—'}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>Điểm TB</div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Subjects */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.border}` }}>
              <Text strong style={{ fontSize: 13, color: T.textMuted, display: 'block', marginBottom: 8 }}>MÔN ĐÃ HỌC</Text>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedStudent.subjects.map((sub, i) => (
                  <Tag key={i} style={{ borderRadius: 6, fontWeight: 500, border: 'none' }}
                    color={sub === 'Toán' ? 'purple' : sub === 'Lý' ? 'orange' : sub === 'Anh Văn' ? 'blue' : sub === 'Hóa' ? 'magenta' : 'cyan'}>
                    {sub}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.border}` }}>
              <Text strong style={{ fontSize: 13, color: T.textMuted, display: 'block', marginBottom: 12 }}>MỤC TIÊU HỌC TẬP</Text>
              {studentMilestones.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {studentMilestones.map(m => (
                    <div key={m.id} style={{
                      padding: '12px 14px', borderRadius: 10,
                      background: m.status === 'Completed' ? T.greenLight : m.status === 'InProgress' ? T.primaryLight : '#f5f5f7',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div>
                          <Tag style={{ fontSize: 11, borderRadius: 4 }} color={m.subjectName === 'Toán' ? 'purple' : m.subjectName === 'Lý' ? 'orange' : 'blue'}>
                            {m.subjectName}
                          </Tag>
                          <Text style={{ fontSize: 13, display: 'block', marginTop: 4 }}>{m.milestoneName}</Text>
                        </div>
                        <Tag style={{ fontSize: 11, borderRadius: 4 }}
                          color={m.status === 'Completed' ? 'success' : m.status === 'InProgress' ? 'processing' : 'default'}>
                          {m.status === 'Completed' ? 'Hoàn thành' : m.status === 'InProgress' ? 'Đang học' : 'Chưa bắt đầu'}
                        </Tag>
                      </div>
                      <Progress percent={m.completionPercentage} size="small"
                        strokeColor={m.status === 'Completed' ? T.green : T.primary}
                        showInfo={false} />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Hạn: {dayjs(m.targetDate).format('DD/MM/YYYY')}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text type="secondary" style={{ fontSize: 13 }}>Chưa có mục tiêu nào</Text>
              )}
            </div>

            {/* Recent Sessions */}
            <div style={{ padding: '16px 24px' }}>
              <Text strong style={{ fontSize: 13, color: T.textMuted, display: 'block', marginBottom: 12 }}>BUỔI HỌC GẦN ĐÂY</Text>
              {studentSessions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {studentSessions.slice(0, 6).map(s => (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`,
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Tag style={{ fontSize: 11, borderRadius: 4 }} color="purple">{s.subjectName}</Tag>
                          <Text style={{ fontSize: 12, color: T.textMuted }}>
                            {dayjs(s.startTime).format('DD/MM')}
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {s.score !== undefined && (
                          <Tag style={{ fontSize: 11, borderRadius: 4, background: T.primaryLight, border: 'none', color: T.primary }}>
                            {s.score}/10
                          </Tag>
                        )}
                        <Tag style={{ fontSize: 11, borderRadius: 4 }}
                          color={s.status === 'Completed' ? 'success' : s.status === 'Cancelled' ? 'error' : 'processing'}>
                          {s.status === 'Completed' ? 'Hoàn thành' : s.status === 'Cancelled' ? 'Đã hủy' : 'Đang chờ'}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Text type="secondary" style={{ fontSize: 13 }}>Chưa có buổi học nào</Text>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <style>{`
        .student-row { cursor: pointer; }
        .student-row:hover { background: ${T.primaryLight} !important; }
      `}</style>
    </div>
  );
};

export default Students;
