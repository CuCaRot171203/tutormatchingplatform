import React, { useState, useMemo } from 'react';
import {
  Card, Table, Button, Input, Select, DatePicker, Modal, Form,
  Typography, Space, Avatar, Tag, Tooltip, Row, Col, Tabs, Modal as ConfirmModal, message,
} from 'antd';
import {
  SearchOutlined, EyeOutlined, SwapOutlined, StopOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  CalendarOutlined, FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ColumnsType } from 'antd/es/table';

import { MOCK_SESSIONS, MOCK_SUBJECTS } from '../../data/mockData';
import type { Session, SessionStatus } from '../../types';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TextArea } = Input;

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

const statusConfig: Record<SessionStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Confirmed: { color: '#0062FF', bg: 'rgba(0, 98, 255, 0.08)', icon: <CheckCircleOutlined />, label: 'Đã xác nhận' },
  Pending: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', icon: <ClockCircleOutlined />, label: 'Chờ xác nhận' },
  PendingChangeConfirmation: { color: '#7132f5', bg: 'rgba(113, 50, 245, 0.08)', icon: <SwapOutlined />, label: 'Chờ đổi lịch' },
  Completed: { color: '#149e61', bg: 'rgba(20, 158, 97, 0.08)', icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
  Cancelled: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)', icon: <CloseCircleOutlined />, label: 'Đã hủy' },
};

interface FilterValues {
  search: string;
  subject: string;
  status: SessionStatus | 'All';
}

const StudentSessions: React.FC = () => {
  const navigate = useNavigate();
  const [sessions] = useState<Session[]>(MOCK_SESSIONS);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filters, setFilters] = useState<FilterValues>({ search: '', subject: 'All', status: 'All' });

  // Modal states
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const tabMap: Record<string, SessionStatus[]> = {
    upcoming: ['Confirmed', 'Pending'],
    completed: ['Completed'],
    cancelled: ['Cancelled'],
    pending: ['PendingChangeConfirmation'],
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const searchMatch =
        !filters.search ||
        s.tutorName.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.subjectName.toLowerCase().includes(filters.search.toLowerCase());
      const subjectMatch = filters.subject === 'All' || s.subjectId.toString() === filters.subject;
      const statusMatch = tabMap[activeTab]?.includes(s.status);
      return searchMatch && subjectMatch && statusMatch;
    });
  }, [sessions, filters, activeTab]);

  const openReschedule = (session: Session) => {
    setSelectedSession(session);
    setRescheduleModalVisible(true);
  };

  const openCancel = (session: Session) => {
    setSelectedSession(session);
    setCancelModalVisible(true);
  };

  const handleReschedule = async (values: { newDate: string; reason: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setRescheduleModalVisible(false);
    setSelectedSession(null);
    form.resetFields();
    setSubmitting(false);
    message.success('Yêu cầu đổi lịch đã được gửi! Gia sư sẽ phản hồi sớm nhất.');
  };

  const handleCancel = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setCancelModalVisible(false);
    setSelectedSession(null);
    setSubmitting(false);
    message.success('Yêu cầu hủy đã được gửi!');
  };

  const columns: ColumnsType<Session> = [
    {
      title: 'Buổi học',
      key: 'session',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar style={{ backgroundColor: T.purple, fontWeight: 600 }} size={40}>
            {record.tutorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14 }}>{record.tutorName}</Text>
            <div style={{ fontSize: 13, color: T.gray }}>{record.subjectName}</div>
          </div>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm gia sư..."
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} size="small">Lọc</Button>
            <Button onClick={() => { clearFilters?.(); confirm(); }} size="small">Đặt lại</Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.tutorName.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Thời gian',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      sorter: (a, b) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
      render: (date: string) => (
        <div>
          <Text style={{ fontSize: 13 }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <div style={{ fontSize: 12, color: T.gray }}>{dayjs(date).format('HH:mm')} – {dayjs(date).add(2, 'hour').format('HH:mm')}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: SessionStatus) => {
        const cfg = statusConfig[status];
        return (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 8,
            backgroundColor: cfg.bg, color: cfg.color,
            fontWeight: 500, fontSize: 13,
          }}>
            {cfg.icon}{cfg.label}
          </div>
        );
      },
      filters: Object.entries(statusConfig).map(([value, { label }]) => ({ text: label, value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Kết quả',
      key: 'result',
      width: 120,
      render: (_, record) => {
        if (record.status === 'Completed' && record.score !== undefined) {
          return <Tag color="green" style={{ borderRadius: 6, fontSize: 13 }}>{record.score} đ</Tag>;
        }
        return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chi tiết">
            <Link to={`/student/session/${record.id}`}>
              <Button type="text" icon={<EyeOutlined />} style={{ color: T.primary }} />
            </Link>
          </Tooltip>
          {(record.status === 'Confirmed' || record.status === 'Pending') && (
            <>
              <Tooltip title="Đổi lịch">
                <Button type="text" icon={<SwapOutlined />} onClick={() => openReschedule(record)} style={{ color: T.purple }} />
              </Tooltip>
              <Tooltip title="Hủy buổi học">
                <Button type="text" icon={<StopOutlined />} onClick={() => openCancel(record)} style={{ color: T.error }} />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const tabCounts = {
    upcoming: sessions.filter((s) => ['Confirmed', 'Pending'].includes(s.status)).length,
    completed: sessions.filter((s) => s.status === 'Completed').length,
    cancelled: sessions.filter((s) => s.status === 'Cancelled').length,
    pending: sessions.filter((s) => s.status === 'PendingChangeConfirmation').length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 500, color: T.text }}>Lịch học của tôi</Title>
        <Text type="secondary">Theo dõi và quản lý các buổi học của bạn</Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}>
        {/* Filter Bar */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm gia sư, môn học..."
                prefix={<SearchOutlined style={{ color: T.gray }} />}
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                allowClear size="large" style={{ borderRadius: 10, fontSize: 14 }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={filters.subject}
                onChange={(val) => setFilters((f) => ({ ...f, subject: val }))}
                style={{ width: '100%' }} size="large"
              >
                <Select.Option value="All">Tất cả môn</Select.Option>
                {MOCK_SUBJECTS.map((s) => (
                  <Select.Option key={s.id} value={s.id.toString()}>{s.name}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={6} md={4} style={{ textAlign: 'right' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setFilters({ search: '', subject: 'All', status: 'All' })}
                size="large"
                style={{ fontSize: 14 }}
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'upcoming', label: `Sắp tới (${tabCounts.upcoming})` },
            { key: 'completed', label: `Hoàn thành (${tabCounts.completed})` },
            { key: 'cancelled', label: `Đã hủy (${tabCounts.cancelled})` },
            { key: 'pending', label: `Chờ đổi lịch (${tabCounts.pending})` },
          ]}
        />

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredSessions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} buổi học`,
          }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <CalendarOutlined style={{ fontSize: 48, color: T.gray, marginBottom: 16 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Không có buổi học</Text>
                  <br />
                  <Text type="secondary">Tìm gia sư và đặt buổi học ngay!</Text>
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Reschedule Modal */}
      <Modal
        title={
          <div style={{ fontWeight: 500, fontSize: 16 }}>
            <SwapOutlined style={{ color: T.purple, marginRight: 8 }} />
            Đề xuất đổi lịch
          </div>
        }
        open={rescheduleModalVisible}
        onCancel={() => { setRescheduleModalVisible(false); form.resetFields(); }}
        footer={null} width={480} destroyOnClose
      >
        {selectedSession && (
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: T.bgGray, borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Buổi học hiện tại</Text>
            <div style={{ fontWeight: 600, marginTop: 2 }}>
              {selectedSession.subjectName} với {selectedSession.tutorName}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(selectedSession.startTime).format('DD/MM/YYYY HH:mm')}
            </Text>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleReschedule}>
          <Form.Item
            label="Ngày/giờ mới"
            name="newDate"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian mới!' }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              size="large"
              placeholder="Chọn ngày và giờ mới"
            />
          </Form.Item>
          <Form.Item
            label="Lý do đổi lịch"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <TextArea rows={3} placeholder="Mô tả lý do bạn muốn đổi lịch..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button onClick={() => { setRescheduleModalVisible(false); form.resetFields(); }}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Gửi yêu cầu
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Cancel Modal */}
      <ConfirmModal
        title={
          <div style={{ fontWeight: 500, fontSize: 16 }}>
            <StopOutlined style={{ color: T.error, marginRight: 8 }} />
            Hủy buổi học
          </div>
        }
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button onClick={() => setCancelModalVisible(false)}>Giữ lịch</Button>
            <Button danger loading={submitting} onClick={handleCancel}>
              Xác nhận hủy
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: 14 }}>
          Bạn có chắc muốn hủy buổi học{' '}
          <strong>{selectedSession?.subjectName}</strong> với{' '}
          <strong>{selectedSession?.tutorName}</strong>?
        </p>
        <p style={{ color: T.gray, fontSize: 13 }}>
          Phí hủy có thể được áp dụng theo quy định của TutorMatch.
        </p>
      </ConfirmModal>
    </div>
  );
};

export default StudentSessions;
