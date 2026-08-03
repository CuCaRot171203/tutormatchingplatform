import React, { useState } from 'react';
import {
  Row, Col, Card, Typography, Select, Button, Progress, Tag,
  Empty, Modal, Form, Input, DatePicker, Divider, Avatar,
  Tooltip, Table, App, message, Popconfirm,
} from 'antd';
import {
  FlagOutlined, BookOutlined, CalendarOutlined, FilterOutlined,
  SortAscendingOutlined, PlusOutlined, CheckCircleOutlined,
  ClockCircleOutlined, ExclamationCircleOutlined, UserOutlined,
  EditOutlined, DeleteOutlined, TeamOutlined, TrophyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ColumnsType } from 'antd/es/table';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// ── Design Tokens ──────────────────────────────────────────────
const T = {
  primary: '#0062FF',
  primaryLight: 'rgba(0, 98, 255, 0.06)',
  primaryBorder: 'rgba(0, 98, 255, 0.15)',
  text: '#1d1d1f',
  textSecondary: '#6e6e73',
  border: 'rgba(0, 0, 0, 0.08)',
  white: '#ffffff',
  bgPage: '#f0f2f5',
  bgCard: '#ffffff',
  success: '#149e61',
  successBg: 'rgba(20, 158, 97, 0.08)',
  warning: '#d97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  error: '#dc2626',
  errorBg: 'rgba(220, 38, 38, 0.08)',
  purple: '#7132f5',
  purpleBg: 'rgba(113, 50, 245, 0.08)',
};

// ── Types ─────────────────────────────────────────────────────
type MilestoneStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Overdue';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

interface Subject {
  id: number;
  name: string;
}

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
  createdAt: string;
}

// ── Mock Data ─────────────────────────────────────────────────
const mockStudents: Student[] = [
  { id: 's1', name: 'Nguyễn Văn An', email: 'an.nguyen@email.com' },
  { id: 's2', name: 'Trần Thị Bình', email: 'binh.tran@email.com' },
  { id: 's3', name: 'Lê Minh Cường', email: 'cuong.le@email.com' },
  { id: 's4', name: 'Phạm Thu Dung', email: 'dung.pham@email.com' },
];

const mockSubjects: Subject[] = [
  { id: 1, name: 'Toán học' },
  { id: 2, name: 'Vật lý' },
  { id: 3, name: 'Hóa học' },
  { id: 4, name: 'Tiếng Anh' },
  { id: 5, name: 'Ngữ văn' },
  { id: 6, name: 'Sinh học' },
];

const mockMilestones: Milestone[] = [
  {
    id: '1', studentId: 's1', studentName: 'Nguyễn Văn An',
    subjectId: 1, subjectName: 'Toán học',
    milestoneName: 'Nắm vững Đại số chương 1-3',
    targetDate: dayjs().add(14, 'day').toISOString(),
    status: 'InProgress', completionPercentage: 65,
    createdAt: dayjs().subtract(20, 'day').toISOString(),
  },
  {
    id: '2', studentId: 's1', studentName: 'Nguyễn Văn An',
    subjectId: 2, subjectName: 'Vật lý',
    milestoneName: 'Hiểu sâu Cơ học – Dao động cơ',
    targetDate: dayjs().add(7, 'day').toISOString(),
    status: 'Overdue', completionPercentage: 40,
    createdAt: dayjs().subtract(30, 'day').toISOString(),
  },
  {
    id: '3', studentId: 's2', studentName: 'Trần Thị Bình',
    subjectId: 4, subjectName: 'Tiếng Anh',
    milestoneName: 'IELTS Reading 6.5+',
    targetDate: dayjs().add(30, 'day').toISOString(),
    status: 'NotStarted', completionPercentage: 0,
    createdAt: dayjs().subtract(5, 'day').toISOString(),
  },
  {
    id: '4', studentId: 's2', studentName: 'Trần Thị Bình',
    subjectId: 1, subjectName: 'Toán học',
    milestoneName: 'Giải thành thạo phương trình lượng giác',
    targetDate: dayjs().add(10, 'day').toISOString(),
    status: 'InProgress', completionPercentage: 75,
    createdAt: dayjs().subtract(15, 'day').toISOString(),
  },
  {
    id: '5', studentId: 's3', studentName: 'Lê Minh Cường',
    subjectId: 5, subjectName: 'Ngữ văn',
    milestoneName: 'Viết bài văn nghị luận xã hội',
    targetDate: dayjs().add(5, 'day').toISOString(),
    status: 'InProgress', completionPercentage: 55,
    createdAt: dayjs().subtract(20, 'day').toISOString(),
  },
  {
    id: '6', studentId: 's3', studentName: 'Lê Minh Cường',
    subjectId: 3, subjectName: 'Hóa học',
    milestoneName: 'Nắm vững bảng tuần hoàn',
    targetDate: dayjs().subtract(5, 'day').toISOString(),
    status: 'Completed', completionPercentage: 100,
    createdAt: dayjs().subtract(40, 'day').toISOString(),
  },
  {
    id: '7', studentId: 's4', studentName: 'Phạm Thu Dung',
    subjectId: 6, subjectName: 'Sinh học',
    milestoneName: 'Di truyền học – Bài tập lai',
    targetDate: dayjs().add(20, 'day').toISOString(),
    status: 'NotStarted', completionPercentage: 0,
    createdAt: dayjs().subtract(3, 'day').toISOString(),
  },
  {
    id: '8', studentId: 's1', studentName: 'Nguyễn Văn An',
    subjectId: 4, subjectName: 'Tiếng Anh',
    milestoneName: 'Ngữ pháp: Thì và Câu bị động',
    targetDate: dayjs().subtract(1, 'day').toISOString(),
    status: 'Overdue', completionPercentage: 20,
    createdAt: dayjs().subtract(25, 'day').toISOString(),
  },
];

// ── Status Config ─────────────────────────────────────────────
const statusConfig: Record<MilestoneStatus, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  NotStarted: { color: T.textSecondary, bg: 'rgba(110,110,115,0.08)', label: 'Chưa bắt đầu', icon: <ClockCircleOutlined /> },
  InProgress: { color: T.primary, bg: T.primaryLight, label: 'Đang thực hiện', icon: <FlagOutlined /> },
  Completed:  { color: T.success, bg: T.successBg, label: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
  Overdue:    { color: T.error, bg: T.errorBg, label: 'Quá hạn', icon: <ExclamationCircleOutlined /> },
};

const subjectColors: Record<string, string> = {
  'Toán học': '#0062FF',
  'Vật lý': '#00B4D8',
  'Hóa học': '#2DC653',
  'Tiếng Anh': '#FFD166',
  'Ngữ văn': '#E63946',
  'Sinh học': '#8338EC',
  'Tin học': '#FB5607',
  'Lịch sử': '#8D6346',
};
const getSubjectColor = (name: string) => subjectColors[name] || T.primary;

// ── Stat Card ─────────────────────────────────────────────────
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div style={{
    background: T.white, borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.07)',
    padding: '16px 20px',
    display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: `${color}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: color, fontSize: 18, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 12, color: T.textSecondary }}>{label}</p>
      <p style={{
        margin: 0, fontSize: 22, fontWeight: 500, color: T.text,
        fontFamily: "'SF Pro Display', system-ui, sans-serif", letterSpacing: '-0.5px',
      }}>
        {value}
      </p>
    </div>
  </div>
);

// ── Table Columns ─────────────────────────────────────────────
const TutorMilestones: React.FC = () => {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = milestones.filter(m => {
    if (filterStudent !== 'all' && m.studentId !== filterStudent) return false;
    if (filterSubject !== 'all' && m.subjectName !== filterSubject) return false;
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    if (searchText && !m.milestoneName.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: milestones.length,
    NotStarted: milestones.filter(m => m.status === 'NotStarted').length,
    InProgress: milestones.filter(m => m.status === 'InProgress').length,
    Completed: milestones.filter(m => m.status === 'Completed').length,
    Overdue: milestones.filter(m => m.status === 'Overdue').length,
  };

  const columns: ColumnsType<Milestone> = [
    {
      title: 'Mục tiêu',
      key: 'milestone',
      render: (_, record) => {
        const sc = statusConfig[record.status];
        const subColor = getSubjectColor(record.subjectName);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{
                padding: '2px 8px', borderRadius: 20,
                background: `${subColor}14`, color: subColor,
                fontSize: 11, fontWeight: 600,
              }}>
                {record.subjectName}
              </span>
              <span style={{
                padding: '2px 8px', borderRadius: 20,
                background: sc.bg, color: sc.color,
                fontSize: 11, fontWeight: 600,
              }}>
                {sc.label}
              </span>
            </div>
            <Text strong style={{ fontSize: 13, color: T.text }}>{record.milestoneName}</Text>
          </div>
        );
      },
    },
    {
      title: 'Học sinh',
      key: 'student',
      render: (_, record) => {
        const student = mockStudents.find(s => s.id === record.studentId);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar
              size={32}
              style={{ background: T.primary, fontSize: 12, fontWeight: 600, flexShrink: 0 }}
            >
              {record.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Avatar>
            <div>
              <Text style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{record.studentName}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Ngày đích',
      key: 'targetDate',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CalendarOutlined style={{ fontSize: 12, color: T.textSecondary }} />
          <Text style={{ fontSize: 13, color: T.textSecondary }}>
            {dayjs(record.targetDate).format('DD/MM/YYYY')}
          </Text>
        </div>
      ),
      sorter: (a, b) => dayjs(a.targetDate).diff(dayjs(b.targetDate)),
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_, record) => {
        const sc = statusConfig[record.status];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
            <Progress
              percent={record.completionPercentage}
              size="small"
              showInfo={false}
              strokeColor={sc.color}
              trailColor="rgba(0,0,0,0.06)"
              style={{ flex: 1 }}
            />
            <Text style={{ fontSize: 12, fontWeight: 600, color: sc.color, minWidth: 36 }}>
              {record.completionPercentage}%
            </Text>
          </div>
        );
      },
      sorter: (a, b) => a.completionPercentage - b.completionPercentage,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tooltip title="Cập nhật tiến độ">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ fontSize: 13 }} />}
              onClick={() => handleUpdateProgress(record)}
              style={{ color: T.primary }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa mục tiêu"
            description="Bạn có chắc muốn xóa mục tiêu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined style={{ fontSize: 13 }} />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleUpdateProgress = (record: Milestone) => {
    Modal.confirm({
      title: `Cập nhật: ${record.milestoneName}`,
      content: (
        <div>
          <Text style={{ fontSize: 13, color: T.textSecondary, display: 'block', marginBottom: 12 }}>
            Chọn tiến độ hoàn thành mới:
          </Text>
          <Select
            defaultValue={record.completionPercentage}
            style={{ width: '100%' }}
            size="large"
            onChange={(value) => {
              const newStatus: MilestoneStatus =
                value === 100 ? 'Completed' :
                value === 0 ? 'NotStarted' :
                'InProgress';
              setMilestones(prev => prev.map(m =>
                m.id === record.id
                  ? { ...m, completionPercentage: value, status: newStatus }
                  : m
              ));
              notification.success({
                message: 'Đã cập nhật tiến độ!',
                description: `${record.milestoneName} — ${value}%`,
                placement: 'topRight',
                duration: 2,
              });
            }}
          >
            {[0, 20, 40, 60, 80, 100].map(v => (
              <Option key={v} value={v}>{v === 0 ? '0% – Chưa bắt đầu' : v === 100 ? '100% – Hoàn thành' : `${v}%`}</Option>
            ))}
          </Select>
        </div>
      ),
      okText: 'Đóng',
      cancelButtonProps: { style: { display: 'none' } },
      icon: null,
    });
  };

  const handleDelete = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
    notification.success({
      message: 'Đã xóa mục tiêu!',
      placement: 'topRight',
      duration: 2,
    });
  };

  const handleCreate = (values: any) => {
    const student = mockStudents.find(s => s.id === values.studentId);
    const subject = mockSubjects.find(s => s.id === values.subjectId);
    const newMilestone: Milestone = {
      id: `new-${Date.now()}`,
      studentId: values.studentId,
      studentName: student!.name,
      subjectId: values.subjectId,
      subjectName: subject!.name,
      milestoneName: values.milestoneName,
      targetDate: values.targetDate.toISOString(),
      status: 'NotStarted',
      completionPercentage: 0,
      description: values.description || '',
      createdAt: new Date().toISOString(),
    };
    setMilestones(prev => [newMilestone, ...prev]);
    setCreateModalOpen(false);
    form.resetFields();
    notification.success({
      message: 'Tạo mục tiêu thành công!',
      description: `Mục tiêu cho ${student!.name} đã được thêm.`,
      placement: 'topRight',
      duration: 3,
    });
  };

  return (
    <div style={{
      background: T.bgPage, minHeight: '100vh',
      fontFamily: "'IBM Plex Sans', 'SF Pro Text', system-ui, sans-serif",
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{
              fontSize: 24, fontWeight: 500, color: T.text,
              margin: '0 0 4px',
              fontFamily: "'SF Pro Display', system-ui, sans-serif",
              letterSpacing: '-0.3px',
            }}>
              Quản lý mục tiêu học sinh
            </h1>
            <p style={{ fontSize: 14, color: T.textSecondary, margin: 0 }}>
              Theo dõi và tạo mục tiêu học tập cho học sinh của bạn
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
            style={{
              borderRadius: 10, background: T.primary,
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            Tạo mục tiêu mới
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={8} md={6}>
          <StatCard icon={<FlagOutlined />} label="Tổng mục tiêu" value={counts.all} color={T.primary} />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <StatCard icon={<ClockCircleOutlined />} label="Đang thực hiện" value={counts.InProgress} color={T.primary} />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <StatCard icon={<CheckCircleOutlined />} label="Đã hoàn thành" value={counts.Completed} color={T.success} />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <StatCard icon={<ExclamationCircleOutlined />} label="Quá hạn" value={counts.Overdue} color={T.error} />
        </Col>
      </Row>

      {/* Table Card */}
      <div style={{
        background: T.white, borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* Table Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: T.primary, fontSize: 16 }} />
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
              Danh sách mục tiêu
            </Title>
            <Tag style={{ background: T.primaryLight, color: T.primary, border: 'none', fontWeight: 600 }}>
              {filtered.length}
            </Tag>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <Input
              placeholder="Tìm mục tiêu..."
              prefix={<SearchOutlined style={{ color: T.textSecondary }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200, borderRadius: 8 }}
              allowClear
            />

            {/* Student filter */}
            <Select
              value={filterStudent}
              onChange={setFilterStudent}
              style={{ width: 180 }}
              placeholder="Lọc theo học sinh"
              size="middle"
            >
              <Option value="all">Tất cả học sinh</Option>
              {mockStudents.map(s => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>

            {/* Subject filter */}
            <Select
              value={filterSubject}
              onChange={setFilterSubject}
              style={{ width: 160 }}
              placeholder="Lọc theo môn"
              size="middle"
            >
              <Option value="all">Tất cả môn</Option>
              {mockSubjects.map(s => (
                <Option key={s.id} value={s.name}>{s.name}</Option>
              ))}
            </Select>

            {/* Status filter */}
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 160 }}
              placeholder="Lọc theo trạng thái"
              size="middle"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="NotStarted">Chưa bắt đầu</Option>
              <Option value="InProgress">Đang thực hiện</Option>
              <Option value="Completed">Đã hoàn thành</Option>
              <Option value="Overdue">Quá hạn</Option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div style={{ padding: '16px 24px' }}>
          <Table
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} mục tiêu`,
              pageSizeOptions: [10, 20, 50],
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span style={{ color: T.textSecondary, fontSize: 14 }}>
                      Không có mục tiêu nào phù hợp
                    </span>
                  }
                />
              ),
            }}
            size="middle"
          />
        </div>
      </div>

      {/* Student Summary Cards */}
      <Row gutter={[12, 12]} style={{ marginTop: 20 }}>
        {mockStudents.map(student => {
          const studentMilestones = milestones.filter(m => m.studentId === student.id);
          const completed = studentMilestones.filter(m => m.status === 'Completed').length;
          const total = studentMilestones.length;
          const avgPct = total > 0
            ? Math.round(studentMilestones.reduce((s, m) => s + m.completionPercentage, 0) / total)
            : 0;
          return (
            <Col xs={24} sm={12} md={6} key={student.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{
                  background: T.white, borderRadius: 14,
                  border: '1px solid rgba(0,0,0,0.07)',
                  padding: '16px 18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onClick={() => setFilterStudent(student.id)}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${T.primary}44`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,98,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.07)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Avatar
                      size={40}
                      style={{ background: T.primary, fontSize: 14, fontWeight: 500, flexShrink: 0 }}
                    >
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                      <Text strong style={{ fontSize: 14, color: T.text, display: 'block' }}>
                        {student.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: T.textSecondary }}>
                        {total} mục tiêu
                      </Text>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, color: T.textSecondary }}>Tiến độ TB</Text>
                      <Text strong style={{ fontSize: 13, color: T.primary }}>{avgPct}%</Text>
                    </div>
                    <Progress
                      percent={avgPct}
                      size="small"
                      showInfo={false}
                      strokeColor={T.primary}
                      trailColor="rgba(0,0,0,0.06)"
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: T.success }}>✓ {completed} hoàn thành</span>
                    <span style={{ fontSize: 11, color: T.textSecondary }}>
                      {total - completed} đang thực hiện
                    </span>
                  </div>
                </div>
              </motion.div>
            </Col>
          );
        })}
      </Row>

      {/* Create Milestone Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FlagOutlined style={{ color: T.primary }} />
            <span>Tạo mục tiêu học tập mới</span>
          </div>
        }
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); form.resetFields(); }}
        footer={null}
        width={600}
        destroyOnClose
        bodyStyle={{ paddingTop: 8 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          requiredMark={false}
        >
          {/* Student */}
          <Form.Item
            name="studentId"
            label={<Text style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>Học sinh</Text>}
            rules={[{ required: true, message: 'Vui lòng chọn học sinh!' }]}
          >
            <Select
              placeholder="-- Chọn học sinh --"
              size="large"
              style={{ width: '100%' }}
            >
              {mockStudents.map(s => (
                <Option key={s.id} value={s.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size={24} style={{ background: T.primary, fontSize: 11 }}>{s.name[0]}</Avatar>
                    <span>{s.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Subject */}
          <Form.Item
            name="subjectId"
            label={<Text style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>Môn học</Text>}
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select
              placeholder="-- Chọn môn học --"
              size="large"
              style={{ width: '100%' }}
            >
              {mockSubjects.map(s => (
                <Option key={s.id} value={s.id}>
                  <span style={{
                    display: 'inline-block', width: 10, height: 10,
                    borderRadius: '50%', background: getSubjectColor(s.name),
                    marginRight: 8,
                  }} />
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Milestone Name */}
          <Form.Item
            name="milestoneName"
            label={<Text style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>Tên mục tiêu</Text>}
            rules={[
              { required: true, message: 'Vui lòng nhập tên mục tiêu!' },
              { min: 5, message: 'Tên mục tiêu phải có ít nhất 5 ký tự!' },
            ]}
          >
            <Input
              size="large"
              placeholder="Ví dụ: Nắm vững chương Hàm số lượng giác"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          {/* Target Date */}
          <Form.Item
            name="targetDate"
            label={<Text style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>Ngày đích</Text>}
            rules={[{ required: true, message: 'Vui lòng chọn ngày đích!' }]}
          >
            <DatePicker
              size="large"
              style={{ width: '100%', borderRadius: 10 }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hoàn thành"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label={<Text style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>Mô tả (tùy chọn)</Text>}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết mục tiêu, kết quả mong đợi..."
              style={{ borderRadius: 10, fontSize: 14 }}
              maxLength={300}
              showCount
            />
          </Form.Item>

          <Divider style={{ margin: '16px 0' }} />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => { setCreateModalOpen(false); form.resetFields(); }}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              size="large"
              style={{ borderRadius: 10, background: T.primary }}
            >
              Tạo mục tiêu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TutorMilestones;
