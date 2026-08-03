import React, { useState, useMemo } from 'react';
import {
  Card, Table, Button, Input, Select, DatePicker, Modal, Form,
  Typography, Space, Tag, Tooltip, Row, Col, Avatar, Badge,
  Divider, message, Popconfirm,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EyeOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined, UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ColumnsType } from 'antd/es/table';

import { MOCK_COMPLAINTS, MOCK_SESSIONS, MOCK_TUTORS } from '../../data/mockData';
import type { Complaint, ComplaintType, ComplaintStatus } from '../../types';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Design Tokens
const T = {
  primary: '#0062FF',
  primaryDark: '#0050d6',
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

interface FilterValues {
  search: string;
  type: ComplaintType | 'All';
  status: ComplaintStatus | 'All';
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
}

const complaintTypeLabels: Record<ComplaintType, string> = {
  LateCancellation: 'Hủy muộn',
  InappropriateBehavior: 'Hành vi không phù hợp',
  SessionResultDispute: 'Khiếu nại kết quả',
  Other: 'Khác',
};

const complaintTypeColors: Record<ComplaintType, string> = {
  LateCancellation: 'orange',
  InappropriateBehavior: 'red',
  SessionResultDispute: 'purple',
  Other: 'default',
};

const statusConfig: Record<ComplaintStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Pending: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', icon: <ClockCircleOutlined />, label: 'Đang chờ' },
  Resolved: { color: '#149e61', bg: 'rgba(20, 158, 97, 0.08)', icon: <CheckCircleOutlined />, label: 'Đã xử lý' },
  Dismissed: { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)', icon: <CloseCircleOutlined />, label: 'Đã bác bỏ' },
};

const StudentComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<FilterValues>({
    search: '', type: 'All', status: 'All', dateRange: null,
  });

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const searchMatch =
        !filters.search ||
        c.id.toString().includes(filters.search) ||
        c.reportedUserName.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.description.toLowerCase().includes(filters.search.toLowerCase());
      const typeMatch = filters.type === 'All' || c.type === filters.type;
      const statusMatch = filters.status === 'All' || c.status === filters.status;
      const dateMatch =
        !filters.dateRange?.[0] || !filters.dateRange?.[1] ||
        (dayjs(c.createdAt).isAfter(filters.dateRange[0]) &&
          dayjs(c.createdAt).isBefore(filters.dateRange[1].endOf('day')));
      return searchMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [complaints, filters]);

  const stats = useMemo(() => ({
    pending: complaints.filter((c) => c.status === 'Pending').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    dismissed: complaints.filter((c) => c.status === 'Dismissed').length,
    total: complaints.length,
  }), [complaints]);

  const handleCreateComplaint = async (values: {
    reportedUserId: number;
    sessionId?: number;
    type: ComplaintType;
    description: string;
  }) => {
    setSubmitting(true);
    try {
      const tutor = MOCK_TUTORS.find((t) => t.userId === values.reportedUserId);
      const newComplaint: Complaint = {
        id: complaints.length + 1,
        reporterId: 1,
        reporterName: 'Phạm Minh Đức',
        reportedUserId: values.reportedUserId,
        reportedUserName: tutor?.fullName || 'Gia sư',
        sessionId: values.sessionId,
        type: values.type,
        description: values.description,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      setComplaints([newComplaint, ...complaints]);
      setCreateModalVisible(false);
      form.resetFields();
      message.success('Khiếu nại đã được gửi thành công!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelComplaint = (complaintId: number) => {
    Modal.confirm({
      title: 'Hủy khiếu nại',
      content: 'Bạn có chắc muốn hủy khiếu nại này? Hành động này không thể hoàn tác.',
      okText: 'Hủy khiếu nại',
      okButtonProps: { danger: true },
      cancelText: 'Không',
      onOk: () => {
        setComplaints(complaints.filter((c) => c.id !== complaintId));
        message.success('Khiếu nại đã được hủy.');
      },
    });
  };

  const openDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDetailModalVisible(true);
  };

  const columns: ColumnsType<Complaint> = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Text strong style={{ fontFamily: 'monospace', fontSize: 13 }}>#{id}</Text>,
    },
    {
      title: 'Người bị khiếu nại',
      key: 'reported',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar style={{ backgroundColor: T.purple, flexShrink: 0 }} size={36} icon={<UserOutlined />} />
          <div>
            <Text strong style={{ fontSize: 14 }}>{record.reportedUserName}</Text>
            {record.sessionId && (
              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                {MOCK_SESSIONS.find((s) => s.id === record.sessionId)?.subjectName}
              </Text>
            )}
          </div>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm theo tên..."
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
      onFilter: (value, record) => record.reportedUserName.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: (type: ComplaintType) => (
        <Tag color={complaintTypeColors[type]} style={{ borderRadius: 6 }}>{complaintTypeLabels[type]}</Tag>
      ),
      filters: Object.entries(complaintTypeLabels).map(([value, text]) => ({ text, value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: ComplaintStatus) => {
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
      filters: [
        { text: 'Đang chờ', value: 'Pending' },
        { text: 'Đã xử lý', value: 'Resolved' },
        { text: 'Đã bác bỏ', value: 'Dismissed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend',
      render: (date: string) => (
        <div>
          <Text style={{ fontSize: 13 }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{dayjs(date).fromNow()}</Text>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => openDetail(record)} style={{ color: T.primary }} />
          </Tooltip>
          {record.status === 'Pending' && (
            <Tooltip title="Hủy khiếu nại">
              <Popconfirm
                title="Hủy khiếu nại?"
                description="Hành động này không thể hoàn tác."
                onConfirm={() => handleCancelComplaint(record.id)}
                okText="Hủy khiếu nại" cancelText="Không"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" icon={<CloseCircleOutlined />} style={{ color: T.error }} />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 500, color: T.text }}>Khiếu nại của tôi</Title>
          <Text type="secondary">Quản lý và theo dõi các khiếu nại đã gửi</Text>
        </div>
        <Button
          type="primary" icon={<PlusOutlined />} size="large"
          style={{ borderRadius: 10, height: 44, paddingInline: 20 }}
          onClick={() => setCreateModalVisible(true)}
        >
          Gửi khiếu nại
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { key: 'Pending', stat: stats.pending, label: 'Đang chờ', bg: T.warningBg, color: T.warning, icon: <ClockCircleOutlined /> },
          { key: 'Resolved', stat: stats.resolved, label: 'Đã xử lý', bg: T.successBg, color: T.success, icon: <CheckCircleOutlined /> },
          { key: 'Dismissed', stat: stats.dismissed, label: 'Đã bác bỏ', bg: T.errorBg, color: T.error, icon: <CloseCircleOutlined /> },
          { key: 'Total', stat: stats.total, label: 'Tổng số', bg: T.purpleBg, color: T.text, icon: <ExclamationCircleOutlined /> },
        ].map(({ key, stat, label, bg, color, icon }) => (
          <Col xs={12} sm={8} lg={6} key={key}>
            <Card
              variant="borderless"
              style={{
                borderRadius: 12,
                boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px',
                cursor: filters.status === key ? 'default' : 'pointer',
                border: filters.status === key ? `2px solid ${T.primary}` : 'none',
              }}
              onClick={() => setFilters((f) => ({ ...f, status: f.status === key ? 'All' : key as ComplaintStatus | 'All' }))}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  backgroundColor: bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color, fontSize: 22,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 500, color, lineHeight: 1 }}>{stat}</div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{label}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filter Bar + Table */}
      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: T.gray }} />}
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                allowClear size="large" style={{ borderRadius: 10, fontSize: 14 }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={filters.type}
                onChange={(val) => setFilters((f) => ({ ...f, type: val }))}
                style={{ width: '100%' }} size="middle"
              >
                <Select.Option value="All" style={{ fontSize: 12 }}>Tất cả loại</Select.Option>
                {Object.entries(complaintTypeLabels).map(([val, label]) => (
                  <Select.Option key={val} value={val} style={{ fontSize: 12 }}>{label}</Select.Option>
                ))}
              </Select>
         
            </Col>
            <Col xs={12} sm={6} md={5}>
              <RangePicker
                value={filters.dateRange}
                onChange={(dates) => setFilters((f) => ({ ...f, dateRange: dates }))}
                style={{ width: '100%', fontSize: 14 }} size="large"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </Col>
            <Col xs={24} sm={6} md={4} style={{ textAlign: 'right' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setFilters({ search: '', type: 'All', status: 'All', dateRange: null })}
                size="large"
                style={{ fontSize: 14 }}
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredComplaints}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} khiếu nại` }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <ExclamationCircleOutlined style={{ fontSize: 48, color: T.gray, marginBottom: 16 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Chưa có khiếu nại nào</Text>
                  <br />
                  <Text type="secondary">Nếu bạn gặp sự cố, hãy gửi khiếu nại ngay.</Text>
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Create Complaint Modal */}
      <Modal
        title={
          <div style={{ fontWeight: 500, fontSize: 16 }}>
            <ExclamationCircleOutlined style={{ color: T.warning, marginRight: 8 }} />
            Gửi khiếu nại
          </div>
        }
        open={createModalVisible}
        onCancel={() => { setCreateModalVisible(false); form.resetFields(); }}
        footer={null} width={560} destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateComplaint} initialValues={{ type: 'LateCancellation' }}>
          <Form.Item label="Người bị khiếu nại" name="reportedUserId"
            rules={[{ required: true, message: 'Vui lòng chọn người bị khiếu nại!' }]}>
            <Select placeholder="Chọn gia sư..." size="large" showSearch optionFilterProp="children">
              {MOCK_TUTORS.map((t) => (
                <Select.Option key={t.userId} value={t.userId}>
                  {t.fullName} — {t.subjects.map((s) => s.subjectName).join(', ')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Buổi học liên quan (tùy chọn)" name="sessionId">
            <Select placeholder="Chọn buổi học (nếu có)" size="large" allowClear>
              {MOCK_SESSIONS.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.subjectName} với {s.tutorName} — {dayjs(s.startTime).format('DD/MM/YYYY HH:mm')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Loại khiếu nại" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại khiếu nại!' }]}>
            <Select size="large">
              {Object.entries(complaintTypeLabels).map(([val, label]) => (
                <Select.Option key={val} value={val as ComplaintType}>{label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Mô tả chi tiết" name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' },
              { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự!' },
            ]}>
            <TextArea rows={4} placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." showCount maxLength={1000} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button size="large" onClick={() => { setCreateModalVisible(false); form.resetFields(); }}>Hủy</Button>
              <Button type="primary" size="large" htmlType="submit" loading={submitting} style={{ minWidth: 140 }}>
                Gửi khiếu nại
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal
        title={<div style={{ fontWeight: 500, fontSize: 16 }}>Chi tiết khiếu nại #{selectedComplaint?.id}</div>}
        open={detailModalVisible}
        onCancel={() => { setDetailModalVisible(false); setSelectedComplaint(null); }}
        footer={
          selectedComplaint?.status === 'Pending' ? (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button danger onClick={() => { setDetailModalVisible(false); handleCancelComplaint(selectedComplaint.id); }}>
                Hủy khiếu nại
              </Button>
              <Button onClick={() => setDetailModalVisible(false)}>Đóng</Button>
            </div>
          ) : <Button onClick={() => setDetailModalVisible(false)}>Đóng</Button>
        }
        width={600} destroyOnClose
      >
        {selectedComplaint && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <Tag color={complaintTypeColors[selectedComplaint.type]} style={{ borderRadius: 6, fontSize: 13 }}>
                {complaintTypeLabels[selectedComplaint.type]}
              </Tag>
              {(() => {
                const cfg = statusConfig[selectedComplaint.status];
                return (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 8,
                    backgroundColor: cfg.bg, color: cfg.color, fontWeight: 500, fontSize: 13,
                  }}>
                    {cfg.icon}{cfg.label}
                  </div>
                );
              })()}
            </div>

            <div style={{
              backgroundColor: T.bgGray, borderRadius: 10, padding: 16, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <Avatar size={44} style={{ backgroundColor: T.purple }} icon={<UserOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Người bị khiếu nại</Text>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{selectedComplaint.reportedUserName}</div>
              </div>
              {selectedComplaint.sessionId && (
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Buổi học</Text>
                  <div style={{ fontSize: 13 }}>
                    {MOCK_SESSIONS.find((s) => s.id === selectedComplaint.sessionId)?.subjectName}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const }}>Nội dung khiếu nại</Text>
              <div style={{
                marginTop: 6, padding: 14, backgroundColor: '#fafafa',
                borderRadius: 8,
                fontSize: 14, lineHeight: 1.6,
              }}>
                {selectedComplaint.description}
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const }}>Timeline</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Badge status="processing" />
                <div>
                  <Text style={{ fontSize: 13 }}>Gửi khiếu nại</Text>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                    {dayjs(selectedComplaint.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
              </div>
              {selectedComplaint.resolvedAt && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Badge status={selectedComplaint.status === 'Resolved' ? 'success' : 'error'} />
                  <div>
                    <Text style={{ fontSize: 13 }}>
                      {selectedComplaint.status === 'Resolved' ? 'Đã xử lý' : 'Đã bác bỏ'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                      {dayjs(selectedComplaint.resolvedAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </div>
                </div>
              )}
            </div>

            {selectedComplaint.resolutionAction && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const }}>Kết quả xử lý</Text>
                <div style={{
                  marginTop: 6, padding: 14, backgroundColor: T.successBg,
                  borderRadius: 8,
                }}>
                  <Text strong style={{ color: T.success, fontSize: 13 }}>
                    {selectedComplaint.resolutionAction === 'Refund' ? 'Hoàn tiền' :
                      selectedComplaint.resolutionAction === 'Warning' ? 'Cảnh cáo' :
                        selectedComplaint.resolutionAction === 'Suspend' ? 'Tạm khóa' :
                          selectedComplaint.resolutionAction}
                  </Text>
                  {selectedComplaint.resolutionReason && (
                    <div style={{ marginTop: 4, fontSize: 13, color: T.gray }}>
                      {selectedComplaint.resolutionReason}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentComplaints;
