import React, { useState, useMemo } from 'react';
import {
  Card, Table, Typography, Row, Col, Progress, Tag, Select,
  Button, Space, Tooltip,
} from 'antd';
import {
  TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ColumnsType } from 'antd/es/table';

import { MOCK_MILESTONES, MOCK_SUBJECTS } from '../../data/mockData';
import type { LearningMilestone, MilestoneStatus } from '../../types';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

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

const statusConfig: Record<MilestoneStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Completed: { color: '#149e61', bg: 'rgba(20, 158, 97, 0.08)', icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
  InProgress: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', icon: <ClockCircleOutlined />, label: 'Đang tiến hành' },
  NotStarted: { color: '#6e6e73', bg: 'rgba(0, 0, 0, 0.06)', icon: <CloseCircleOutlined />, label: 'Chưa bắt đầu' },
};

interface FilterValues {
  subject: string;
  status: MilestoneStatus | 'All';
  sortBy: 'targetDate' | 'completion' | 'name';
}

const ProgressPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<FilterValues>({ subject: 'All', status: 'All', sortBy: 'targetDate' });

  const tabFilter: MilestoneStatus | 'All' =
    activeTab === 'completed' ? 'Completed' :
    activeTab === 'inProgress' ? 'InProgress' :
    activeTab === 'notStarted' ? 'NotStarted' : 'All';

  const filteredMilestones = useMemo(() => {
    let result = MOCK_MILESTONES;

    // Status filter from tab
    if (tabFilter !== 'All') {
      result = result.filter((m) => m.status === tabFilter);
    }

    // Subject filter
    if (filters.subject !== 'All') {
      result = result.filter((m) => m.subjectId.toString() === filters.subject);
    }

    // Status filter from dropdown
    if (filters.status !== 'All') {
      result = result.filter((m) => m.status === filters.status);
    }

    // Sort
    if (filters.sortBy === 'targetDate') {
      result = [...result].sort((a, b) => dayjs(a.targetDate).unix() - dayjs(b.targetDate).unix());
    } else if (filters.sortBy === 'completion') {
      result = [...result].sort((a, b) => b.completionPercentage - a.completionPercentage);
    } else if (filters.sortBy === 'name') {
      result = [...result].sort((a, b) => a.milestoneName.localeCompare(b.milestoneName));
    }

    return result;
  }, [tabFilter, filters]);

  const stats = useMemo(() => ({
    total: MOCK_MILESTONES.length,
    completed: MOCK_MILESTONES.filter((m) => m.status === 'Completed').length,
    inProgress: MOCK_MILESTONES.filter((m) => m.status === 'InProgress').length,
    avgProgress: MOCK_MILESTONES.length > 0
      ? Math.round(MOCK_MILESTONES.reduce((sum, m) => sum + m.completionPercentage, 0) / MOCK_MILESTONES.length)
      : 0,
  }), []);

  const columns: ColumnsType<LearningMilestone> = [
    {
      title: 'Mục tiêu',
      key: 'milestone',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{record.milestoneName}</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Tag color="blue" style={{ borderRadius: 6, fontSize: 12, margin: 0 }}>
              {record.subjectName}
            </Tag>
            {record.completionPercentage >= 100 && (
              <TrophyOutlined style={{ color: '#f59e0b', fontSize: 14 }} />
            )}
          </div>
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            value={selectedKeys[0] || 'All'}
            onChange={(val) => { setSelectedKeys([val]); confirm(); }}
            style={{ width: 180, marginBottom: 8 }}
            size="small"
          >
            <Select.Option value="All">Tất cả môn</Select.Option>
            {MOCK_SUBJECTS.map((s) => (
              <Select.Option key={s.id} value={s.id.toString()}>{s.name}</Select.Option>
            ))}
          </Select>
          <div>
            <Button type="primary" size="small" onClick={() => confirm()}>Lọc</Button>
            <Button size="small" onClick={() => { clearFilters?.(); confirm(); }} style={{ marginLeft: 4 }}>Đặt lại</Button>
          </div>
        </div>
      ),
      onFilter: (value, record) =>
        value === 'All' || record.subjectId.toString() === value,
    },
    {
      title: 'Tiến độ',
      dataIndex: 'completionPercentage',
      key: 'completionPercentage',
      width: 200,
      sorter: (a, b) => a.completionPercentage - b.completionPercentage,
      render: (pct: number) => (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Tiến độ</Text>
            <Text strong style={{ color: pct >= 100 ? T.success : T.primary, fontSize: 13 }}>{pct}%</Text>
          </div>
          <Progress
            percent={pct}
            showInfo={false}
            strokeColor={pct >= 100 ? T.success : T.primary}
            trailColor="#f0f0f0"
            size="small"
          />
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: MilestoneStatus) => {
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
      title: 'Ngày mục tiêu',
      dataIndex: 'targetDate',
      key: 'targetDate',
      width: 140,
      sorter: (a, b) => dayjs(a.targetDate).unix() - dayjs(b.targetDate).unix(),
      render: (date: string) => {
        const isOverdue = dayjs(date).isBefore(dayjs()) && !MOCK_MILESTONES.find((m) => m.targetDate === date)?.completionPercentage;
        return (
          <div>
            <Text style={{ fontSize: 13, color: isOverdue ? T.error : T.text }}>{dayjs(date).format('DD/MM/YYYY')}</Text>
            {isOverdue && (
              <div style={{ fontSize: 12, color: T.error }}>Quá hạn</div>
            )}
          </div>
        );
      },
    },
  ];

  const tabCounts = {
    all: MOCK_MILESTONES.length,
    completed: MOCK_MILESTONES.filter((m) => m.status === 'Completed').length,
    inProgress: MOCK_MILESTONES.filter((m) => m.status === 'InProgress').length,
    notStarted: MOCK_MILESTONES.filter((m) => m.status === 'NotStarted').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: T.text }}>Tiến độ học tập</Title>
        <Text type="secondary">Theo dõi mục tiêu và thành tích của bạn</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: 'Tổng mục tiêu', value: stats.total, color: T.text, bg: T.bgGray },
          { label: 'Hoàn thành', value: stats.completed, color: T.success, bg: T.successBg },
          { label: 'Đang tiến hành', value: stats.inProgress, color: T.warning, bg: T.warningBg },
          { label: 'Tiến độ TB', value: `${stats.avgProgress}%`, color: T.primary, bg: 'rgba(0, 98, 255, 0.08)' },
        ].map(({ label, value, color, bg }) => (
          <Col xs={12} sm={8} lg={6} key={label}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  backgroundColor: bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color, fontSize: 20,
                }}>
                  {label.includes('Hoàn') ? <CheckCircleOutlined /> :
                   label.includes('Đang') ? <ClockCircleOutlined /> :
                   label.includes('TB') ? <TrophyOutlined /> : <TrophyOutlined />}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{label}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        variant="borderless"
        style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}
      >
        {/* Filter Bar */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Select
                value={filters.subject}
                onChange={(val) => setFilters((f) => ({ ...f, subject: val }))}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="All">Tất cả môn học</Select.Option>
                {MOCK_SUBJECTS.map((s) => (
                  <Select.Option key={s.id} value={s.id.toString()}>{s.name}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={filters.sortBy}
                onChange={(val) => setFilters((f) => ({ ...f, sortBy: val }))}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="targetDate">Ngày mục tiêu</Select.Option>
                <Select.Option value="completion">Tiến độ %</Select.Option>
                <Select.Option value="name">Tên mục tiêu</Select.Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setFilters({ subject: 'All', status: 'All', sortBy: 'targetDate' })}
                size="large"
              >
                Đặt lại
              </Button>
            </Col>
          </Row>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `Tất cả (${tabCounts.all})` },
            { key: 'completed', label: `Hoàn thành (${tabCounts.completed})` },
            { key: 'inProgress', label: `Đang tiến hành (${tabCounts.inProgress})` },
            { key: 'notStarted', label: `Chưa bắt đầu (${tabCounts.notStarted})` },
          ].map(({ key, label }) => (
            <Button
              key={key}
              type={activeTab === key ? 'primary' : 'default'}
              onClick={() => setActiveTab(key)}
              style={{ borderRadius: 8 }}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredMilestones}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} mục tiêu`,
          }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <TrophyOutlined style={{ fontSize: 48, color: T.gray, marginBottom: 16 }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Không có mục tiêu</Text>
                  <br />
                  <Text type="secondary">Tất cả mục tiêu đã được hoàn thành!</Text>
                </div>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default ProgressPage;
