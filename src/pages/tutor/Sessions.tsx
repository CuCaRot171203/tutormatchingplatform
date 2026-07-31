import React, { useState } from 'react';
import {
  Card, Table, Tag, Badge, Avatar, Button, Input, Select, Tabs, Row, Col,
  Modal, Form, DatePicker, InputNumber, message, Typography, Space, Tooltip, Drawer,
} from 'antd';
import {
  SearchOutlined, FilterOutlined, VideoCameraOutlined,
  SwapOutlined, CloseOutlined, EyeOutlined, CalendarOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { StatusBadge } from '../../components/common';
import { mockSessions, mockStudents } from '../../data/tutorMockData';
import type { Session, SessionStatus } from '../../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const T = {
  bg: '#f5f5f7', card: '#ffffff', border: '#dedee5',
  text: '#101114', textMuted: '#686b82', textSubtle: '#9497a9',
  primary: '#7132f5', primaryLight: 'rgba(113,50,245,0.08)',
  green: '#149e61', greenLight: 'rgba(20,154,97,0.08)',
  orange: '#d97706', orangeLight: 'rgba(217,119,6,0.08)',
  red: '#dc2626', redLight: 'rgba(220,38,38,0.08)',
  blue: '#3b82f6', blueLight: 'rgba(59,130,246,0.08)',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
  boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', padding: '20px 24px',
};

const getDateRange = (start: string, end: string) => {
  const s = dayjs(start);
  const e = dayjs(end);
  return `${s.format('DD/MM/YYYY')} · ${s.format('HH:mm')} – ${e.format('HH:mm')}`;
};

// ─── Sessions Page ───────────────────────────────────────────────────────────────
const TutorSessions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [detailSession, setDetailSession] = useState<Session | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSessionForDrawer, setSelectedSessionForDrawer] = useState<Session | null>(null);
  const [form] = Form.useForm();

  // Filter data
  const allSessions = mockSessions.map(s => ({
    ...s,
    student: mockStudents.find(st => st.id === s.studentId) || {
      id: s.studentId, name: s.studentName, email: '', sessionCount: 0,
      subjects: [s.subjectName], averageScore: s.score ?? undefined,
    },
  }));

  const filtered = allSessions.filter(s => {
    const matchTab =
      activeTab === 'all' ? true :
      activeTab === 'upcoming' ? ['Confirmed', 'Pending'].includes(s.status) :
      activeTab === 'completed' ? s.status === 'Completed' :
      activeTab === 'cancelled' ? s.status === 'Cancelled' :
      activeTab === 'pending_change' ? s.status === 'PendingChangeConfirmation' : true;

    const matchSearch = !searchText ||
      s.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      s.subjectName.toLowerCase().includes(searchText.toLowerCase());

    const matchStatus = !statusFilter || s.status === statusFilter;
    const matchSubject = !subjectFilter || s.subjectName === subjectFilter;

    return matchTab && matchSearch && matchStatus && matchSubject;
  });

  const tabCounts = {
    all: allSessions.length,
    upcoming: allSessions.filter(s => ['Confirmed', 'Pending'].includes(s.status)).length,
    completed: allSessions.filter(s => s.status === 'Completed').length,
    cancelled: allSessions.filter(s => s.status === 'Cancelled').length,
    pending_change: allSessions.filter(s => s.status === 'PendingChangeConfirmation').length,
  };

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={38} style={{ backgroundColor: T.primary, flexShrink: 0, fontSize: 14, fontWeight: 600 }}>
            {record.studentName[0]}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14, display: 'block' }}>{record.studentName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.student.email}</Text>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: 'Môn',
      dataIndex: 'subjectName',
      key: 'subjectName',
      filters: [
        { text: 'Toán', value: 'Toán' },
        { text: 'Lý', value: 'Lý' },
        { text: 'Anh Văn', value: 'Anh Văn' },
        { text: 'Hóa', value: 'Hóa' },
        { text: 'Sinh', value: 'Sinh' },
      ],
      onFilter: (value: any, record: any) => record.subjectName === value,
      render: (subject: string) => (
        <Tag style={{ borderRadius: 6, fontWeight: 500, border: 'none' }}
          color={subject === 'Toán' ? 'purple' : subject === 'Lý' ? 'orange' : subject === 'Anh Văn' ? 'blue' : subject === 'Hóa' ? 'magenta' : 'cyan'}>
          {subject}
        </Tag>
      ),
    },
    {
      title: 'Ngày / Giờ',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string, record: any) => (
        <div>
          <Text style={{ fontSize: 13 }}>{dayjs(time).format('DD/MM/YYYY')}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>{dayjs(time).format('HH:mm')} – {dayjs(record.endTime).format('HH:mm')}</Text></div>
        </div>
      ),
      sorter: (a: any, b: any) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Xác nhận', value: 'Confirmed' },
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Hoàn thành', value: 'Completed' },
        { text: 'Đã hủy', value: 'Cancelled' },
        { text: 'Chờ đổi lịch', value: 'PendingChangeConfirmation' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => <StatusBadge status={status as any} />,
    },
    {
      title: 'Kết quả',
      key: 'result',
      render: (_: any, record: any) => (
        record.score !== undefined && record.score !== null ? (
          <div>
            <Text strong style={{ color: T.primary }}>{record.score}/10</Text>
          </div>
        ) : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
      ),
      sorter: (a: any, b: any) => (a.score ?? 0) - (b.score ?? 0),
    },
    {
      title: '',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Tooltip title="Chi tiết">
            <Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedSessionForDrawer(record); setDrawerVisible(true); }}
              style={{ borderRadius: 8 }} />
          </Tooltip>
          {record.meetingLink && ['Confirmed', 'Pending'].includes(record.status) && (
            <a href={record.meetingLink} target="_blank" rel="noopener noreferrer">
              <Button size="small" icon={<VideoCameraOutlined />} style={{ borderRadius: 8, background: T.greenLight, color: T.green, border: 'none' }} />
            </a>
          )}
          {['Confirmed', 'Pending'].includes(record.status) && (
            <>
              <Tooltip title="Đổi lịch">
                <Button size="small" icon={<SwapOutlined />} onClick={() => { setSelectedSession(record); setRescheduleModal(true); }}
                  style={{ borderRadius: 8 }} />
              </Tooltip>
              <Tooltip title="Hủy buổi dạy">
                <Button size="small" danger icon={<CloseOutlined />} onClick={() => { setSelectedSession(record); setCancelModal(true); }}
                  style={{ borderRadius: 8 }} />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: `Tất cả (${tabCounts.all})` },
    { key: 'upcoming', label: `Sắp tới (${tabCounts.upcoming})` },
    { key: 'completed', label: `Hoàn thành (${tabCounts.completed})` },
    { key: 'cancelled', label: `Đã hủy (${tabCounts.cancelled})` },
    { key: 'pending_change', label: `Chờ đổi lịch (${tabCounts.pending_change})` },
  ];

  const handleReschedule = (values: any) => {
    message.success('Yêu cầu đổi lịch đã được gửi!');
    setRescheduleModal(false);
    form.resetFields();
  };

  const handleCancel = () => {
    message.warning('Yêu cầu hủy đã được gửi!');
    setCancelModal(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.3px' }}>Lịch dạy của tôi</h1>
        <Text type="secondary">Quản lý các buổi dạy của bạn</Text>
      </div>

      {/* Filters */}
      <div style={{ ...CARD_STYLE, marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm học sinh, môn học..."
              prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ borderRadius: 10 }}
              allowClear
            />
          </Col>
          <Col xs={12} md={5}>
            <Select placeholder="Trạng thái" allowClear style={{ width: '100%' }} onChange={v => setStatusFilter(v)}>
              <Option value="Confirmed">Xác nhận</Option>
              <Option value="Pending">Chờ duyệt</Option>
              <Option value="Completed">Hoàn thành</Option>
              <Option value="Cancelled">Đã hủy</Option>
              <Option value="PendingChangeConfirmation">Chờ đổi lịch</Option>
            </Select>
          </Col>
          <Col xs={12} md={5}>
            <Select placeholder="Môn học" allowClear style={{ width: '100%' }} onChange={v => setSubjectFilter(v)}>
              <Option value="Toán">Toán</Option>
              <Option value="Lý">Lý</Option>
              <Option value="Anh Văn">Anh Văn</Option>
              <Option value="Hóa">Hóa</Option>
              <Option value="Sinh">Sinh</Option>
            </Select>
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Hiển thị <Text strong>{filtered.length}</Text> / {allSessions.length} phiên
            </Text>
          </Col>
        </Row>
      </div>

      {/* Tabs + Table */}
      <div style={CARD_STYLE}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} phiên` }}
          size="middle"
          rowClassName={() => 'session-row'}
          locale={{ emptyText: 'Không có phiên học nào' }}
          style={{ borderRadius: 8 }}
          scroll={{ x: 800 }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        title="Chi tiết phiên dạy"
        placement="right"
        width={480}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedSessionForDrawer && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={72} style={{ backgroundColor: T.primary, fontSize: 28, marginBottom: 12 }}>
                {selectedSessionForDrawer.studentName[0]}
              </Avatar>
              <Title level={4} style={{ margin: 0 }}>{selectedSessionForDrawer.studentName}</Title>
              <div style={{ marginTop: 8 }}><StatusBadge status={selectedSessionForDrawer.status} /></div>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Môn học', value: <Tag color="purple">{selectedSessionForDrawer.subjectName}</Tag> },
                { label: 'Ngày', value: dayjs(selectedSessionForDrawer.startTime).format('dddd, DD/MM/YYYY') },
                { label: 'Giờ', value: `${dayjs(selectedSessionForDrawer.startTime).format('HH:mm')} – ${dayjs(selectedSessionForDrawer.endTime).format('HH:mm')}` },
                { label: 'Số buổi đã học', value: mockSessions.filter(s => s.studentId === selectedSessionForDrawer.studentId && s.status === 'Completed').length + ' buổi' },
              ].map(item => (
                <div key={item.label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.label}</Text>
                  <Text strong style={{ fontSize: 14 }}>{item.value}</Text>
                </div>
              ))}
            </div>

            {selectedSessionForDrawer.meetingLink && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>Link học trực tuyến</Text>
                <a href={selectedSessionForDrawer.meetingLink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                  background: T.greenLight, borderRadius: 10, color: T.green, textDecoration: 'none',
                }}>
                  <VideoCameraOutlined />
                  <Text strong style={{ color: T.green }}>Tham gia ngay</Text>
                </a>
              </div>
            )}

            {selectedSessionForDrawer.score !== undefined && selectedSessionForDrawer.score !== null && (
              <div style={{ marginTop: 16, background: T.primaryLight, borderRadius: 12, padding: '16px' }}>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Kết quả buổi học</Text>
                <div style={{ fontSize: 36, fontWeight: 700, color: T.primary, lineHeight: 1 }}>{selectedSessionForDrawer.score}/10</div>
                {selectedSessionForDrawer.tutorComment && (
                  <Paragraph style={{ color: T.textMuted, margin: '8px 0 0', fontSize: 13 }}>
                    <strong>Nhận xét:</strong> {selectedSessionForDrawer.tutorComment}
                  </Paragraph>
                )}
                {selectedSessionForDrawer.goalCompletionPercentage !== undefined && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, color: T.textMuted }}>Tiến độ mục tiêu</Text>
                      <Text strong style={{ fontSize: 12 }}>{selectedSessionForDrawer.goalCompletionPercentage}%</Text>
                    </div>
                    <div style={{ height: 6, background: T.border, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${selectedSessionForDrawer.goalCompletionPercentage}%`, background: T.primary, borderRadius: 3 }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              {['Confirmed', 'Pending'].includes(selectedSessionForDrawer.status) && (
                <>
                  <Button icon={<SwapOutlined />} onClick={() => { setDrawerVisible(false); setSelectedSession(selectedSessionForDrawer); setRescheduleModal(true); }}
                    style={{ borderRadius: 10, flex: 1 }}>
                    Đổi lịch
                  </Button>
                  <Button danger icon={<CloseOutlined />} onClick={() => { setDrawerVisible(false); setSelectedSession(selectedSessionForDrawer); setCancelModal(true); }}
                    style={{ borderRadius: 10 }}>
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Reschedule Modal */}
      <Modal
        title="Đề xuất đổi lịch"
        open={rescheduleModal}
        onCancel={() => { setRescheduleModal(false); form.resetFields(); }}
        footer={null}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        {selectedSession && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: T.primaryLight, borderRadius: 10 }}>
            <Text strong>{selectedSession.studentName}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{selectedSession.subjectName} · {getDateRange(selectedSession.startTime, selectedSession.endTime)}</Text>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleReschedule}>
          <Form.Item label="Ngày & Giờ mới" name="newTime" rules={[{ required: true, message: 'Vui lòng chọn thời gian mới!' }]}>
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>
          <Form.Item label="Lý do đổi lịch" name="reason" rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
            <TextArea rows={3} placeholder="VD: Bận họp gia đình, đột xuất công việc..." />
          </Form.Item>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setRescheduleModal(false); form.resetFields(); }} style={{ borderRadius: 10 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" style={{ borderRadius: 10, background: T.primary }}>Gửi yêu cầu</Button>
          </div>
        </Form>
      </Modal>

      {/* Cancel Confirm Modal */}
      <Modal
        title="Xác nhận hủy buổi dạy"
        open={cancelModal}
        onCancel={() => setCancelModal(false)}
        onOk={handleCancel}
        okText="Hủy buổi dạy"
        okButtonProps={{ danger: true }}
        cancelText="Không"
        centered
      >
        {selectedSession && (
          <div>
            <Paragraph>
              Bạn có chắc muốn hủy buổi dạy với <Text strong>{selectedSession.studentName}</Text>?
            </Paragraph>
            <Paragraph type="secondary" style={{ fontSize: 13 }}>
              Buổi dạy: {selectedSession.subjectName} · {getDateRange(selectedSession.startTime, selectedSession.endTime)}
            </Paragraph>
            <div style={{ padding: '10px 14px', background: T.orangeLight, borderRadius: 10, marginTop: 12 }}>
              <Text style={{ fontSize: 13, color: T.orange }}>
                ⚠️ Hủy trước 24 giờ có thể bị tính phí hủy muộn.
              </Text>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .session-row { cursor: pointer; }
        .session-row:hover { background: ${T.primaryLight} !important; }
      `}</style>
    </div>
  );
};

export default TutorSessions;
