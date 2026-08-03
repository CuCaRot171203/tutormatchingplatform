import React, { useState, useMemo } from 'react';
import {
  Card, Table, Input, Select, Slider, Button, Typography,
  Row, Col, Avatar, Tag, Rate, Tooltip, message,
  Modal, Form, DatePicker, Space, notification, Badge, Divider,
} from 'antd';
import {
  SearchOutlined, FilterOutlined, UserOutlined,
  EyeOutlined, StarOutlined, ClockCircleOutlined,
  BookOutlined, CheckCircleOutlined, MessageOutlined,
  TeamOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { MOCK_TUTORS, MOCK_SUBJECTS } from '../../data/mockData';
import type { TutorProfile } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Design Tokens — đồng bộ với hệ thống
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(value);

interface FilterValues {
  subject: number | null;
  minRate: number;
  maxRate: number;
  rating: number | null;
  search: string;
}

interface BookFormValues {
  subjectId: number;
  date: dayjs.Dayjs;
  startTime: string;
  note?: string;
}

const SearchTutors: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    subject: null,
    minRate: 0,
    maxRate: 500000,
    rating: null,
    search: '',
  });

  // Modal state
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Table filter helpers (mirrors sidebar state)
  const [tableSearch, setTableSearch] = useState('');
  const [tableSubject, setTableSubject] = useState<string | null>(null);

  const filteredTutors = useMemo(() => {
    return MOCK_TUTORS.filter((tutor) => {
      const subjectMatch =
        !filters.subject ||
        tutor.subjects.some((s) => s.subjectId === filters.subject);
      const rateMatch = tutor.subjects.every(
        (s) => s.hourlyRate >= filters.minRate && s.hourlyRate <= filters.maxRate
      );
      const searchMatch =
        !filters.search ||
        tutor.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        tutor.bio?.toLowerCase().includes(filters.search.toLowerCase()) ||
        tutor.qualifications?.toLowerCase().includes(filters.search.toLowerCase());
      const ratingMatch = !filters.rating || tutor.reputationScore >= filters.rating;
      return subjectMatch && rateMatch && searchMatch && ratingMatch;
    });
  }, [filters]);

  const resetFilters = () => {
    setFilters({ subject: null, minRate: 0, maxRate: 500000, rating: null, search: '' });
    setTableSearch('');
    setTableSubject(null);
  };

  const openBook = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
    form.setFieldsValue({ subjectId: tutor.subjects[0]?.subjectId });
    setBookModalVisible(true);
  };

  const openDetail = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
    setDetailModalVisible(true);
  };

  const handleBook = async (values: BookFormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setBookModalVisible(false);
    form.resetFields();
    notification.success({
      message: 'Yêu cầu đặt học đã được gửi!',
      description: `Yêu cầu học với gia sư ${selectedTutor?.fullName} đã được gửi. Vui lòng chờ gia sư xác nhận.`,
      placement: 'topRight',
      duration: 4,
    });
  };

  const columns: ColumnsType<TutorProfile> = [
    {
      title: 'Gia sư',
      key: 'tutor',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={48}
            style={{
              backgroundColor: T.purple,
              fontSize: 16,
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {record.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14 }}>{record.fullName}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Rate disabled value={record.reputationScore} style={{ fontSize: 11 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.reputationScore.toFixed(1)}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.subjects.map((s) => s.subjectName).join(', ')}
            </Text>
          </div>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 12, minWidth: 220 }}>
          <Input
            placeholder="Tìm theo tên gia sư..."
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8 }}
            size="small"
          />
          <Space>
            <Button type="primary" size="small" onClick={() => confirm()}>
              Lọc
            </Button>
            <Button
              size="small"
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.fullName.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Chuyên môn',
      key: 'subject',
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {record.subjects.slice(0, 2).map((s) => (
            <Tag
              key={s.subjectId}
              color="blue"
              style={{ borderRadius: 6, fontSize: 12, width: 'fit-content', margin: 0 }}
            >
              {s.subjectName}
            </Tag>
          ))}
          {record.subjects.length > 2 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              +{record.subjects.length - 2} môn khác
            </Text>
          )}
        </div>
      ),
      filters: MOCK_SUBJECTS.map((s) => ({ text: s.name, value: s.id.toString() })),
      onFilter: (value, record) =>
        record.subjects.some((s) => s.subjectId.toString() === value),
    },
    {
      title: 'Học phí',
      key: 'rate',
      width: 130,
      sorter: (a, b) =>
        Math.min(...a.subjects.map((s) => s.hourlyRate)) -
        Math.min(...b.subjects.map((s) => s.hourlyRate)),
      render: (_, record) => (
        <div>
          {record.subjects.slice(0, 1).map((s) => (
            <div key={s.subjectId}>
              <Text strong style={{ color: T.primary, fontSize: 13 }}>
                {formatCurrency(s.hourlyRate)}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}> /giờ</Text>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Kinh nghiệm',
      key: 'experience',
      width: 120,
      sorter: (a, b) => (a.yearsExperience ?? 0) - (b.yearsExperience ?? 0),
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 13 }}>{record.yearsExperience ?? 0} năm</Text>
          <div style={{ fontSize: 12, color: T.gray }}>
            <TeamOutlined style={{ marginRight: 4 }} />
            {record.totalSessions ?? 0} buổi dạy
          </div>
        </div>
      ),
    },
    {
      title: 'Phản hồi',
      key: 'response',
      width: 100,
      render: (_, record) => {
        const rate = record.responseRate ?? 100;
        const color = rate >= 95 ? T.success : rate >= 85 ? T.warning : T.error;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircleOutlined style={{ color, fontSize: 12 }} />
            <Text style={{ fontSize: 13, color }}>{rate}%</Text>
          </div>
        );
      },
      filters: [
        { text: '≥ 95%', value: '95' },
        { text: '≥ 85%', value: '85' },
        { text: '≥ 70%', value: '70' },
      ],
      onFilter: (value, record) => (record.responseRate ?? 0) >= parseInt(value as string),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Xem hồ sơ">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => openDetail(record)}
              style={{ color: T.primary, fontSize: 13 }}
            />
          </Tooltip>
          <Button
            type="primary"
            size="small"
            onClick={() => openBook(record)}
            style={{ borderRadius: 8, fontSize: 12, height: 28 }}
          >
            Đặt học
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 500, color: T.text }}>
          Tìm kiếm gia sư
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Tìm gia sư phù hợp với nhu cầu học tập của bạn
        </Text>
      </div>

      <Row gutter={[20, 20]}>
        {/* ─── Left: Filter Panel ─────────────────────────────────── */}
        <Col xs={24} lg={6}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 12,
              boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px',
            }}
            title={
              <span style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FilterOutlined /> Bộ lọc
              </span>
            }
            extra={
              <Button
                type="link"
                size="small"
                onClick={resetFilters}
                style={{ padding: 0, fontSize: 12 }}
              >
                Đặt lại
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Subject Filter */}
              <div>
                <label style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, display: 'block' }}>
                  Môn học
                </label>
                <Select
                  placeholder="Chọn môn học"
                  style={{ width: '100%' }}
                  value={filters.subject}
                  onChange={(val) => setFilters((f) => ({ ...f, subject: val }))}
                  size="middle"
                  allowClear
                >
                  {MOCK_SUBJECTS.map((subject) => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Rate Range */}
              <div>
                <label style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, display: 'block' }}>
                  Mức giá (VNĐ/giờ)
                </label>
                <Slider
                  range
                  min={0}
                  max={500000}
                  step={10000}
                  value={[filters.minRate, filters.maxRate]}
                  onChange={([min, max]) =>
                    setFilters((f) => ({ ...f, minRate: min, maxRate: max }))
                  }
                  tooltip={{ formatter: (v) => (v !== undefined ? formatCurrency(v) : '') }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatCurrency(filters.minRate)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatCurrency(filters.maxRate)}
                  </Text>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, display: 'block' }}>
                  Đánh giá tối thiểu
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[null, 4, 4.5, 4.8].map((r) => (
                    <Button
                      key={r ?? 'all'}
                      size="small"
                      type={filters.rating === r ? 'primary' : 'default'}
                      onClick={() => setFilters((f) => ({ ...f, rating: r }))}
                      style={{ borderRadius: 6, fontSize: 12 }}
                    >
                      {r ? `${r}+` : 'Tất cả'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <Divider style={{ margin: '4px 0' }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Kết quả</Text>
                <div style={{ marginTop: 4 }}>
                  <Text strong style={{ fontSize: 20, color: T.primary }}>
                    {filteredTutors.length}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}> / {MOCK_TUTORS.length} gia sư</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* ─── Right: Results ─────────────────────────────────────── */}
        <Col xs={24} lg={18}>
          {/* Search Bar */}
          <div style={{ marginBottom: 12 }}>
            <Input
              placeholder="Tìm kiếm theo tên, mô tả hoặc chuyên môn..."
              prefix={<SearchOutlined style={{ color: T.gray }} />}
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              size="large"
              style={{ borderRadius: 10, fontSize: 14 }}
              allowClear
            />
          </div>

          {/* Result Count */}
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {filteredTutors.length > 0
                ? `Tìm thấy ${filteredTutors.length} gia sư phù hợp`
                : 'Không có gia sư phù hợp với bộ lọc hiện tại'}
            </Text>
          </div>

          {/* Table */}
          <Card
            variant="borderless"
            style={{
              borderRadius: 12,
              boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px',
            }}
          >
            <Table
              columns={columns}
              dataSource={filteredTutors}
              rowKey="id"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                showTotal: (total) => (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tổng {total} gia sư
                  </Text>
                ),
                pageSizeOptions: [8, 16, 24],
              }}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <UserOutlined style={{ fontSize: 48, color: T.gray, marginBottom: 16 }} />
                    <div>
                      <Text strong style={{ fontSize: 15 }}>Không tìm thấy gia sư</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                      </Text>
                    </div>
                  </div>
                ),
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* ─── Book Session Modal ──────────────────────────────────── */}
      <Modal
        title={
          <div style={{ fontWeight: 500, fontSize: 15 }}>
            <BookOutlined style={{ color: T.primary, marginRight: 8 }} />
            Đặt buổi học
          </div>
        }
        open={bookModalVisible}
        onCancel={() => {
          setBookModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={480}
        destroyOnClose
      >
        {selectedTutor && (
          <>
            {/* Tutor summary */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                backgroundColor: T.bgGray,
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <Avatar
                size={44}
                style={{ backgroundColor: T.purple, fontWeight: 500, fontSize: 15 }}
              >
                {selectedTutor.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: 14 }}>{selectedTutor.fullName}</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Rate disabled value={selectedTutor.reputationScore} style={{ fontSize: 11 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedTutor.reputationScore.toFixed(1)}
                  </Text>
                </div>
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleBook} size="middle">
              <Form.Item
                label="Môn học"
                name="subjectId"
                rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
              >
                <Select placeholder="Chọn môn học" style={{ fontSize: 12}}>
                  {selectedTutor.subjects.map((s) => (
                    <Select.Option key={s.subjectId} value={s.subjectId} style={{ fontSize: 12}}>
                      {s.subjectName}{' '}
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        — {formatCurrency(s.hourlyRate)}/giờ
                      </Text>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Ngày học"
                name="date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf('day')
                  }
                  placeholder="Chọn ngày học"
                />
              </Form.Item>

              <Form.Item
                label="Khung giờ"
                name="startTime"
                rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
              >
                <Select placeholder="Chọn khung giờ">
                  {[
                    '08:00 – 10:00',
                    '10:00 – 12:00',
                    '13:00 – 15:00',
                    '15:00 – 17:00',
                    '18:00 – 20:00',
                    '20:00 – 22:00',
                  ].map((t) => (
                    <Select.Option key={t} value={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Ghi chú (tùy chọn)" name="note">
                <TextArea
                  rows={3}
                  placeholder="Ví dụ: Em muốn ôn tập chương 3, phần Hàm số lượng giác..."
                  maxLength={300}
                  showCount
                />
              </Form.Item>

              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: T.successBg,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 13, color: T.success }}>
                  <CheckCircleOutlined style={{ marginRight: 6 }} />
                  Gia sư phản hồi trong vòng 24 giờ. Bạn sẽ nhận thông báo khi được xác nhận.
                </Text>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <Button onClick={() => setBookModalVisible(false)}>Hủy</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    style={{ borderRadius: 8 }}
                  >
                    Gửi yêu cầu
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      {/* ─── Tutor Detail Modal ──────────────────────────────────── */}
      <Modal
        title={
          <div style={{ fontWeight: 500, fontSize: 15 }}>
            <UserOutlined style={{ color: T.primary, marginRight: 8 }} />
            Hồ sơ gia sư
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button onClick={() => setDetailModalVisible(false)}>Đóng</Button>
            <Button
              type="primary"
              onClick={() => {
                setDetailModalVisible(false);
                if (selectedTutor) openBook(selectedTutor);
              }}
              style={{ borderRadius: 8 }}
            >
              Đặt học ngay
            </Button>
          </div>
        }
        width={560}
      >
        {selectedTutor && (
          <div>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: 16,
                backgroundColor: T.bgGray,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <Avatar
                size={64}
                style={{
                  backgroundColor: T.purple,
                  fontWeight: 500,
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {selectedTutor.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Text strong style={{ fontSize: 16, display: 'block' }}>
                  {selectedTutor.fullName}
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 6 }}>
                  <Rate disabled value={selectedTutor.reputationScore} style={{ fontSize: 12 }} />
                  <Text style={{ fontSize: 13 }}>{selectedTutor.reputationScore.toFixed(1)}</Text>
                  <Tag color="green" style={{ borderRadius: 6, fontSize: 11, margin: 0 }}>
                    Đã xác minh
                  </Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{selectedTutor.email}</Text>
              </div>
            </div>

            {/* Stats Row */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: 12, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <ClockCircleOutlined style={{ color: T.primary, fontSize: 16, marginBottom: 4 }} />
                  <div style={{ fontSize: 16, fontWeight: 500, color: T.text }}>
                    {selectedTutor.yearsExperience ?? 0}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Năm kinh nghiệm</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: 12, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <TeamOutlined style={{ color: T.purple, fontSize: 16, marginBottom: 4 }} />
                  <div style={{ fontSize: 16, fontWeight: 500, color: T.text }}>
                    {selectedTutor.totalSessions ?? 0}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Buổi dạy</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: 12, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <CheckCircleOutlined
                    style={{
                      color: (selectedTutor.responseRate ?? 0) >= 95 ? T.success : T.warning,
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 500, color: T.text }}>
                    {selectedTutor.responseRate ?? 100}%
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Phản hồi</Text>
                </div>
              </Col>
            </Row>

            {/* Subjects & Fee */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 13 }}>Môn học & Học phí</Text>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedTutor.subjects.map((s) => (
                  <div
                    key={s.subjectId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: T.bgGray,
                      borderRadius: 8,
                    }}
                  >
                    <Tag color="blue" style={{ borderRadius: 6, fontSize: 12, margin: 0 }}>
                      {s.subjectName}
                    </Tag>
                    <Text strong style={{ color: T.primary, fontSize: 13 }}>
                      {formatCurrency(s.hourlyRate)}/giờ
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 13 }}>Giới thiệu</Text>
              <Paragraph
                type="secondary"
                style={{ fontSize: 13, marginTop: 6, marginBottom: 0, lineHeight: 1.6 }}
              >
                {selectedTutor.bio}
              </Paragraph>
            </div>

            {/* Qualifications */}
            <div>
              <Text strong style={{ fontSize: 13 }}>Trình độ</Text>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <TrophyOutlined style={{ color: T.warning, marginTop: 3, fontSize: 13 }} />
                <Text style={{ fontSize: 13 }}>{selectedTutor.qualifications}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SearchTutors;
