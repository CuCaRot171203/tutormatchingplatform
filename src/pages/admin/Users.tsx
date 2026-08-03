import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Input, Select, Modal, App } from 'antd';
import {
  SearchOutlined, LockOutlined, StopOutlined, UnlockOutlined,
  CheckOutlined, CloseOutlined, FilterOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { StatusBadge } from '../../components/common';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:            '#f0f2f5',
  card:          '#ffffff',
  border:        '#e8eaed',
  borderLight:   '#f1f3f6',
  text:          '#1a1d26',
  textMuted:     '#6b7280',
  textSubtle:    '#9ca3af',
  accent:        '#4f6ef7',
  accentDark:    '#3b54d4',
  accentLight:   'rgba(79,110,247,0.08)',
  green:         '#10b981',
  greenLight:    'rgba(16,185,129,0.08)',
  red:           '#ef4444',
  redLight:      'rgba(239,68,68,0.08)',
  orange:        '#f59e0b',
  orangeLight:   'rgba(245,158,11,0.08)',
  blue:          '#3b82f6',
  blueLight:     'rgba(59,130,246,0.08)',
  purple:        '#8b5cf6',
  purpleLight:   'rgba(139,92,246,0.08)',
};

const FONT_HEAD = "'SF Pro Display', system-ui, -apple-system, sans-serif";
const FONT_BODY = "'SF Pro Text', system-ui, -apple-system, sans-serif";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Role = 'Student' | 'Tutor' | 'Administrator';

interface TutorProfile {
  status: string;
  reputationScore: number;
  subjectCount: number;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  avatar: string;
  avatarColor: string;
  creditBalance: number;
  isSuspended: boolean;
  tutorProfile?: TutorProfile;
  createdAt: string;
  sessionCount: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_USERS: User[] = [
  { id: 1,  fullName: 'Nguyễn Minh Tuấn',    email: 'minhtuan@gmail.com',       role: 'Student',       avatar: 'N', avatarColor: '#4f6ef7', creditBalance: 500000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-01-10', sessionCount: 12 },
  { id: 2,  fullName: 'Trần Thị Lan',         email: 'trangtt@gmail.com',         role: 'Student',       avatar: 'T', avatarColor: '#10b981', creditBalance: 200000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-01-12', sessionCount: 8  },
  { id: 3,  fullName: 'Lê Hoàng Nam',         email: 'namle.edu@outlook.com',     role: 'Student',       avatar: 'L', avatarColor: '#f59e0b', creditBalance: 0,       isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-01-15', sessionCount: 5  },
  { id: 4,  fullName: 'Phạm Thu Hà',          email: 'hapt@gmail.com',            role: 'Student',       avatar: 'P', avatarColor: '#8b5cf6', creditBalance: 750000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-01-18', sessionCount: 20 },
  { id: 5,  fullName: 'Đặng Quang Đức',      email: 'duc.dang@gmail.com',        role: 'Student',       avatar: 'Đ', avatarColor: '#06b6d4', creditBalance: 100000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-02-01', sessionCount: 3  },
  { id: 6,  fullName: 'Vũ Thị Mai',           email: 'maivu@gmail.com',           role: 'Student',       avatar: 'V', avatarColor: '#ec4899', creditBalance: 350000,  isSuspended: true,  tutorProfile: undefined,                       createdAt: '2026-02-05', sessionCount: 7  },
  { id: 7,  fullName: 'Hoàng Minh Khoa',      email: 'khoa.hm@gmail.com',        role: 'Student',       avatar: 'H', avatarColor: '#84cc16', creditBalance: 600000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-02-10', sessionCount: 15 },
  { id: 8,  fullName: 'Trần Thị Mai Anh',     email: 'maitran.teacher@gmail.com', role: 'Tutor',         avatar: 'T', avatarColor: '#4f6ef7', creditBalance: 0,       isSuspended: false, tutorProfile: { status: 'Approved', reputationScore: 4.9, subjectCount: 2 }, createdAt: '2026-03-01', sessionCount: 38 },
  { id: 9,  fullName: 'Nguyễn Văn Hùng',     email: 'hungnv.edu@outlook.com',    role: 'Tutor',         avatar: 'N', avatarColor: '#10b981', creditBalance: 0,       isSuspended: false, tutorProfile: { status: 'Approved', reputationScore: 4.8, subjectCount: 2 }, createdAt: '2026-03-05', sessionCount: 27 },
  { id: 10, fullName: 'Lê Hoàng Nam',         email: 'namle.phys@gmail.com',      role: 'Tutor',         avatar: 'L', avatarColor: '#f59e0b', creditBalance: 0,       isSuspended: false, tutorProfile: { status: 'Approved', reputationScore: 4.7, subjectCount: 1 }, createdAt: '2026-03-10', sessionCount: 18 },
  { id: 11, fullName: 'Phạm Thu Hà',          email: 'hapt.chem@gmail.com',       role: 'Tutor',         avatar: 'P', avatarColor: '#8b5cf6', creditBalance: 0,       isSuspended: false, tutorProfile: { status: 'Approved', reputationScore: 4.6, subjectCount: 1 }, createdAt: '2026-03-15', sessionCount: 22 },
  { id: 12, fullName: 'Bùi Thị Hương',       email: 'huongbt@gmail.com',         role: 'Student',       avatar: 'B', avatarColor: '#06b6d4', creditBalance: 150000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-04-01', sessionCount: 4  },
  { id: 13, fullName: 'Đỗ Văn Phong',        email: 'phong.do@gmail.com',        role: 'Student',       avatar: 'Đ', avatarColor: '#ec4899', creditBalance: 420000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-04-05', sessionCount: 9  },
  { id: 14, fullName: 'Lý Thanh Ngọc',       email: 'ngoclt@gmail.com',          role: 'Student',       avatar: 'L', avatarColor: '#84cc16', creditBalance: 280000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-04-10', sessionCount: 6  },
  { id: 15, fullName: 'Chu Thị Mai',          email: 'maichu@gmail.com',          role: 'Student',       avatar: 'C', avatarColor: '#4f6ef7', creditBalance: 900000,  isSuspended: true,  tutorProfile: undefined,                       createdAt: '2026-04-15', sessionCount: 11 },
  { id: 16, fullName: 'Trần Đức Anh',        email: 'anhtd@gmail.com',           role: 'Student',       avatar: 'T', avatarColor: '#10b981', creditBalance: 180000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-05-01', sessionCount: 2  },
  { id: 17, fullName: 'Ngô Thị Phương',      email: 'phuongnt@gmail.com',        role: 'Student',       avatar: 'N', avatarColor: '#f59e0b', creditBalance: 620000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-05-05', sessionCount: 14 },
  { id: 18, fullName: 'Đinh Văn Tuấn',       email: 'tuandv@gmail.com',          role: 'Student',       avatar: 'Đ', avatarColor: '#8b5cf6', creditBalance: 330000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-05-10', sessionCount: 10 },
  { id: 19, fullName: 'Phạm Thị Hồng',       email: 'hongph@gmail.com',           role: 'Student',       avatar: 'P', avatarColor: '#06b6d4', creditBalance: 440000,  isSuspended: false, tutorProfile: undefined,                       createdAt: '2026-05-15', sessionCount: 16 },
  { id: 20, fullName: 'Nguyễn Văn Quản Trị',email: 'admin@tutormatch.vn',        role: 'Administrator', avatar: 'N', avatarColor: '#10b981', creditBalance: 0,       isSuspended: false, tutorProfile: undefined,                       createdAt: '2025-03-15', sessionCount: 0  },
];

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  Student:       { bg: T.blueLight,   text: T.blue,   border: `${T.blue}30` },
  Tutor:         { bg: T.purpleLight, text: T.purple, border: `${T.purple}30` },
  Administrator: { bg: T.greenLight,  text: T.green,  border: `${T.green}30` },
};

const ROLE_LABELS: Record<Role, string> = {
  Student: 'Học sinh',
  Tutor: 'Gia sư',
  Administrator: 'Quản trị',
};

// ─── Avatar Cell ────────────────────────────────────────────────────────────────
const UserCell = ({ name, email, letter, color }: { name: string; email: string; letter: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      background: `${color}18`,
      color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 500, fontSize: 13, flexShrink: 0,
      fontFamily: FONT_HEAD,
    }}>
      {letter}
    </div>
    <div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: T.text }}>{name}</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textMuted }}>{email}</div>
    </div>
  </div>
);

// ─── Role Tag ──────────────────────────────────────────────────────────────────
const RoleTag = ({ role }: { role: Role }) => {
  const c = ROLE_COLORS[role];
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 9999,
      background: c.bg,
      color: c.text,
      fontSize: 12, fontWeight: 600,
      fontFamily: FONT_BODY,
      border: `1px solid ${c.border}`,
    }}>
      {ROLE_LABELS[role]}
    </span>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10, background: `${color}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 500, color }}>{value}</span>
    </div>
    <div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, color: T.textSubtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  </div>
);

// ─── Action Modal ──────────────────────────────────────────────────────────────
type ActionType = 'suspend' | 'unsuspend' | 'kick';

interface ActionModalProps {
  open: boolean;
  user: User | null;
  actionType: ActionType;
  reason: string;
  submitting: boolean;
  onReasonChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  open, user, actionType, reason, submitting, onReasonChange, onConfirm, onCancel,
}) => {
  const isSuspend = actionType === 'suspend';
  const isKick = actionType === 'kick';
  const isUnsuspend = actionType === 'unsuspend';

  const config = isKick
    ? { title: 'Xóa tài khoản', icon: <StopOutlined />, warningColor: T.red, warningBg: T.redLight }
    : isSuspend
    ? { title: 'Khóa tài khoản', icon: <LockOutlined />, warningColor: T.orange, warningBg: T.orangeLight }
    : { title: 'Mở khóa tài khoản', icon: <UnlockOutlined />, warningColor: T.green, warningBg: T.greenLight };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={
        <div style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 500, color: T.text, letterSpacing: '-0.2px', paddingRight: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          {config.icon}
          {config.title}
        </div>
      }
      footer={null}
      destroyOnClose
      width={440}
      centered
      styles={{
        body: { padding: '16px 20px 4px' },
        footer: { padding: '12px 20px 16px', borderTop: `1px solid ${T.borderLight}` },
        header: { borderBottom: `1px solid ${T.borderLight}`, padding: '14px 20px 12px', marginBottom: 0 },
      }}
    >
      {user && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* User info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 14, borderRadius: 10,
            background: `${user.avatarColor}08`,
            border: `1px solid ${user.avatarColor}20`,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${user.avatarColor}18`, color: user.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 500, fontSize: 16, flexShrink: 0, fontFamily: FONT_HEAD,
            }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: T.text }}>{user.fullName}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted }}>{user.email}</div>
              <RoleTag role={user.role} />
            </div>
          </div>

          {/* Warning */}
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: config.warningBg,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            {config.icon && <span style={{ color: config.warningColor, marginTop: 1, flexShrink: 0 }}>{config.icon}</span>}
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: config.warningColor, lineHeight: 1.5 }}>
              {isKick
                ? 'Cảnh báo: Xóa tài khoản là hành động không thể hoàn tác. Tài khoản sẽ bị vô hiệu hóa vĩnh viễn.'
                : isSuspend
                ? 'Khóa tài khoản sẽ ngăn cản người dùng đăng nhập. Bạn có thể mở khóa tài khoản sau.'
                : 'Mở khóa sẽ khôi phục quyền truy cập của người dùng vào hệ thống.'}
            </span>
          </div>

          {/* Reason input */}
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text, marginBottom: 6 }}>
              Lý do <span style={{ color: T.red }}>*</span>
            </div>
            <textarea
              value={reason}
              onChange={e => onReasonChange(e.target.value)}
              placeholder="Nhập lý do..."
              rows={3}
              style={{
                width: '100%', borderRadius: 8,
                border: `1px solid ${T.border}`,
                padding: '8px 12px',
                fontFamily: FONT_BODY, fontSize: 13,
                color: T.text, resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                background: T.card,
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
            <Button
              onClick={onCancel}
              style={{ borderRadius: 8, fontFamily: FONT_BODY, fontSize: 13 }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              danger={isKick || isSuspend}
              loading={submitting}
              onClick={onConfirm}
              disabled={!reason.trim()}
              style={{
                borderRadius: 8, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13,
                background: isUnsuspend ? T.green : undefined,
                border: isUnsuspend ? `1px solid ${T.green}` : undefined,
              }}
            >
              {isKick ? 'Xóa tài khoản' : isSuspend ? 'Khóa tài khoản' : 'Mở khóa'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Users: React.FC = () => {
  const { notification } = App.useApp();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionUser, setActionUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<ActionType>('suspend');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Filtered Data ────────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase());
      const matchRole = filterRole === 'all' || u.role === filterRole;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && !u.isSuspended) ||
        (filterStatus === 'suspended' && u.isSuspended);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchText, filterRole, filterStatus]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'Student').length,
    tutors: users.filter(u => u.role === 'Tutor').length,
    suspended: users.filter(u => u.isSuspended).length,
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const openActionModal = (user: User, type: ActionType) => {
    setActionUser(user);
    setActionType(type);
    setReason('');
    setActionModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!actionUser || !reason.trim()) return;
    setSubmitting(true);

    await new Promise(r => setTimeout(r, 600)); // Simulate API

    if (actionType === 'kick') {
      setUsers(prev => prev.filter(u => u.id !== actionUser.id));
      notification.success({
        message: 'Đã xóa tài khoản',
        description: `Tài khoản "${actionUser.fullName}" đã được xóa khỏi hệ thống.`,
        placement: 'topRight', duration: 3,
      });
    } else if (actionType === 'suspend') {
      setUsers(prev => prev.map(u => u.id === actionUser.id ? { ...u, isSuspended: true } : u));
      notification.success({
        message: 'Đã khóa tài khoản',
        description: `Tài khoản "${actionUser.fullName}" đã bị khóa.`,
        placement: 'topRight', duration: 3,
      });
    } else {
      setUsers(prev => prev.map(u => u.id === actionUser.id ? { ...u, isSuspended: false } : u));
      notification.success({
        message: 'Đã mở khóa tài khoản',
        description: `Tài khoản "${actionUser.fullName}" đã được khôi phục.`,
        placement: 'topRight', duration: 3,
      });
    }

    setSubmitting(false);
    setActionModalOpen(false);
    setActionUser(null);
    setReason('');
  };

  // ── Table Columns ────────────────────────────────────────────────────────────
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      filterSearch: true,
      filters: MOCK_USERS.map(u => ({ text: u.fullName, value: u.fullName })),
      onFilter: (value: any, record: User) => record.fullName === value,
      sorter: (a: User, b: User) => a.fullName.localeCompare(b.fullName),
      render: (_: string, record: User) => (
        <UserCell name={record.fullName} email={record.email} letter={record.avatar} color={record.avatarColor} />
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 110,
      align: 'center' as const,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8, minWidth: 160 }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text, marginBottom: 8 }}>
            Lọc theo vai trò
          </div>
          <Space direction="vertical" style={{ width: '100%' }}>
            {(['Student', 'Tutor', 'Administrator'] as Role[]).map(role => (
              <Button
                key={role}
                size="small"
                type={selectedKeys.includes(role) ? 'primary' : 'default'}
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
                onClick={() => {
                  const next = selectedKeys.includes(role) ? [] : [role];
                  setSelectedKeys(next);
                  confirm();
                }}
              >
                {ROLE_LABELS[role]}
              </Button>
            ))}
            <Button size="small" block onClick={() => { clearFilters?.(); confirm(); }} style={{ borderRadius: 8 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: <FilterOutlined style={{ color: T.accent }} />,
      onFilter: (value: any, record: User) => record.role === value,
      render: (role: Role) => <RoleTag role={role} />,
    },
    {
      title: 'Credit',
      dataIndex: 'creditBalance',
      key: 'creditBalance',
      width: 120,
      align: 'right' as const,
      sorter: (a: User, b: User) => a.creditBalance - b.creditBalance,
      render: (balance: number) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, color: balance > 0 ? T.accent : T.textSubtle }}>
          {balance > 0 ? `${balance.toLocaleString('vi-VN')}đ` : '—'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isSuspended',
      width: 120,
      align: 'center' as const,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8, minWidth: 160 }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 12, color: T.text, marginBottom: 8 }}>
            Lọc theo trạng thái
          </div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              size="small"
              icon={<CheckOutlined />}
              type={selectedKeys.includes('active') ? 'primary' : 'default'}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
              onClick={() => { setSelectedKeys(selectedKeys.includes('active') ? [] : ['active']); confirm(); }}
            >
              Hoạt động
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              type={selectedKeys.includes('suspended') ? 'primary' : 'default'}
              style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8 }}
              onClick={() => { setSelectedKeys(selectedKeys.includes('suspended') ? [] : ['suspended']); confirm(); }}
            >
              Bị khóa
            </Button>
            <Button size="small" block onClick={() => { clearFilters?.(); confirm(); }} style={{ borderRadius: 8 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: <FilterOutlined style={{ color: T.accent }} />,
      onFilter: (value: unknown, record: User) => {
        if (value === 'active') return !record.isSuspended;
        if (value === 'suspended') return record.isSuspended;
        return true;
      },
      render: (_: unknown, record: User) => (
        <StatusBadge status={record.isSuspended ? 'Suspended' : 'Active'} />
      ),
    },
    {
      title: 'Gia sư',
      key: 'tutorProfile',
      width: 130,
      align: 'center' as const,
      render: (_: unknown, record: User) => {
        if (record.role !== 'Tutor' || !record.tutorProfile) return <span style={{ color: T.textSubtle }}>—</span>;
        return (
          <div>
            <StatusBadge status={record.tutorProfile.status} size="small" />
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textMuted, marginTop: 2 }}>
              ⭐ {record.tutorProfile.reputationScore.toFixed(1)} · {record.tutorProfile.subjectCount} môn
            </div>
          </div>
        );
      },
    },
    {
      title: 'Phiên',
      dataIndex: 'sessionCount',
      key: 'sessionCount',
      width: 80,
      align: 'center' as const,
      sorter: (a: User, b: User) => a.sessionCount - b.sessionCount,
      render: (count: number) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: count > 0 ? T.text : T.textSubtle }}>
          {count}
        </span>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: 'center' as const,
      sorter: (a: User, b: User) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => (
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 130,
      align: 'center' as const,
      render: (_: unknown, record: User) => {
        const isAdmin = record.role === 'Administrator';
        return (
          <Space size={4}>
            {record.isSuspended ? (
              <Button
                type="text"
                icon={<UnlockOutlined style={{ color: T.green, fontSize: 13 }} />}
                onClick={() => openActionModal(record, 'unsuspend')}
                title="Mở khóa"
                style={{ borderRadius: 8 }}
              />
            ) : (
              <Button
                type="text"
                icon={<LockOutlined style={{ color: T.orange, fontSize: 13 }} />}
                onClick={() => openActionModal(record, 'suspend')}
                title="Khóa"
                style={{ borderRadius: 8 }}
              />
            )}
            <Button
              type="text"
              danger
              icon={<StopOutlined style={{ fontSize: 13 }} />}
              onClick={() => openActionModal(record, 'kick')}
              title="Xóa"
              disabled={isAdmin}
              style={{ borderRadius: 8 }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 500, color: T.text, margin: '0 0 2px', letterSpacing: '-0.3px' }}>
          Quản lý người dùng
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted, margin: 0 }}>
          Xem và quản lý tất cả người dùng trên nền tảng.
        </p>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard label="Tổng người dùng" value={stats.total}     color={T.accent} />
        <StatCard label="Học sinh"          value={stats.students}  color={T.blue}   />
        <StatCard label="Gia sư"            value={stats.tutors}     color={T.purple} />
        <StatCard label="Bị khóa"           value={stats.suspended}  color={T.red}    />
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
        <Space size={6}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined style={{ color: T.textSubtle }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            style={{ width: 200, borderRadius: 8, fontFamily: FONT_BODY, fontSize: 12 }}
          />
          <Select
            value={filterRole}
            onChange={setFilterRole}
            style={{ width: 130, borderRadius: 8, fontFamily: FONT_BODY }}
            options={[
              { value: 'all',           label: 'Tất cả vai trò' },
              { value: 'Student',       label: 'Học sinh' },
              { value: 'Tutor',         label: 'Gia sư' },
              { value: 'Administrator', label: 'Quản trị' },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 130, borderRadius: 8, fontFamily: FONT_BODY }}
            options={[
              { value: 'all',       label: 'Tất cả' },
              { value: 'active',    label: 'Hoạt động' },
              { value: 'suspended', label: 'Bị khóa' },
            ]}
          />
        </Space>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Table<User>
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: T.textMuted }}>
                Tổng <strong style={{ color: T.text }}>{total}</strong> người dùng
              </span>
            ),
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          style={{ background: T.card, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border}` }}
          size="small"
          onChange={() => {}}
          components={{
            header: {
              cell: ({ children, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                <th {...rest} style={{
                  ...(rest as React.TdHTMLAttributes<HTMLTableCellElement>).style,
                  fontFamily: FONT_HEAD, fontWeight: 500, fontSize: 11,
                  color: T.textMuted, background: '#f8f9fb', padding: '7px 12px',
                }}>
                  {children}
                </th>
              ),
            },
          }}
        />
      </motion.div>

      {/* ── Action Modal ───────────────────────────────────────────────────── */}
      <ActionModal
        open={actionModalOpen}
        user={actionUser}
        actionType={actionType}
        reason={reason}
        submitting={submitting}
        onReasonChange={setReason}
        onConfirm={handleConfirm}
        onCancel={() => { setActionModalOpen(false); setActionUser(null); setReason(''); }}
      />
    </div>
  );
};

export default Users;
