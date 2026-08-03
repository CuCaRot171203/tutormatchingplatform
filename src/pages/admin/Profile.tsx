import React, { useState } from 'react';
import { Form, Input, Button, Tabs, App } from 'antd';
import {
  UserOutlined, SaveOutlined, LockOutlined,
  CameraOutlined, CheckCircleFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';

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

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockAdmin = {
  fullName: 'Nguyễn Văn Quản Trị',
  email: 'admin@tutormatch.vn',
  phone: '0912 345 678',
  avatar: 'N',
  avatarColor: '#10b981',
  role: 'Administrator',
  joinDate: '2025-03-15',
};

// ─── Styled Field Label ─────────────────────────────────────────────────────────
const FieldLabel = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
  <div style={{
    fontFamily: FONT_BODY,
    fontSize: 12,
    fontWeight: 600,
    color: T.text,
    marginBottom: 6,
  }}>
    {children}
    {optional && <span style={{ fontWeight: 400, color: T.textSubtle, marginLeft: 4 }}>(tùy chọn)</span>}
  </div>
);

// ─── Styled Input ───────────────────────────────────────────────────────────────
const StyledInput = (props: React.ComponentProps<typeof Input>) => (
  <Input
    {...props}
    style={{ borderRadius: 10, fontFamily: FONT_BODY, fontSize: 13, ...props.style }}
  />
);

const StyledInputPassword = (props: React.ComponentProps<typeof Input.Password>) => (
  <Input.Password
    {...props}
    style={{ borderRadius: 10, fontFamily: FONT_BODY, fontSize: 13, ...props.style }}
  />
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminProfile: React.FC = () => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const handleSaveInfo = async () => {
    try {
      const values = await form.validateFields(['fullName', 'phone']);
      setSaving(true);
      await new Promise(r => setTimeout(r, 800));
      setSaving(false);
      notification.success({
        message: 'Cập nhật hồ sơ thành công',
        description: 'Thông tin cá nhân của bạn đã được lưu.',
        placement: 'topRight',
        duration: 3,
      });
    } catch {
      // Validation error
    }
  };

  const handleSavePassword = async () => {
    try {
      const values = await form.validateFields(['currentPassword', 'newPassword', 'confirmPassword']);
      if (values.newPassword !== values.confirmPassword) {
        form.setFields([{ name: 'confirmPassword', errors: ['Mật khẩu xác nhận không khớp'] }]);
        return;
      }
      setSaving(true);
      await new Promise(r => setTimeout(r, 800));
      setSaving(false);
      form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
      notification.success({
        message: 'Đổi mật khẩu thành công',
        description: 'Mật khẩu của bạn đã được cập nhật.',
        placement: 'topRight',
        duration: 3,
      });
    } catch {
      // Validation error
    }
  };

  // ─── Tab Content: Info ────────────────────────────────────────────────────────
  const InfoTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Form.Item
        name="fullName"
        initialValue={mockAdmin.fullName}
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        style={{ marginBottom: 0 }}
      >
        <>
          <FieldLabel>Họ và tên</FieldLabel>
          <StyledInput placeholder="Nhập họ và tên" />
        </>
      </Form.Item>

      <div>
        <FieldLabel>Email</FieldLabel>
        <StyledInput value={mockAdmin.email} disabled />
      </div>

      <Form.Item name="phone" initialValue={mockAdmin.phone}>
        <>
          <FieldLabel>Số điện thoại</FieldLabel>
          <StyledInput placeholder="Nhập số điện thoại" />
        </>
      </Form.Item>

      <div>
        <FieldLabel>Vai trò</FieldLabel>
        <StyledInput value="Quản trị viên" disabled />
      </div>

      <div>
        <FieldLabel>Ngày tham gia</FieldLabel>
        <StyledInput
          value={dayjs(mockAdmin.joinDate).format('DD/MM/YYYY')}
          disabled
        />
      </div>

      <div style={{ paddingTop: 4 }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving && activeTab === 'info'}
          onClick={handleSaveInfo}
          style={{
            borderRadius: 10,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 13,
            height: 38,
            background: T.accent,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );

  // ─── Tab Content: Security ────────────────────────────────────────────────────
  const SecurityTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Form.Item
        name="currentPassword"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        style={{ marginBottom: 0 }}
      >
        <>
          <FieldLabel>Mật khẩu hiện tại</FieldLabel>
          <StyledInputPassword
            placeholder="Nhập mật khẩu hiện tại"
            autoComplete="current-password"
          />
        </>
      </Form.Item>

      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới' },
          { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
        ]}
        style={{ marginBottom: 0 }}
      >
        <>
          <FieldLabel>Mật khẩu mới</FieldLabel>
          <StyledInputPassword
            placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
            autoComplete="new-password"
          />
        </>
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới' }]}
        style={{ marginBottom: 0 }}
      >
        <>
          <FieldLabel>Xác nhận mật khẩu mới</FieldLabel>
          <StyledInputPassword
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
          />
        </>
      </Form.Item>

      {/* Password strength indicator hint */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 10,
        background: T.borderLight,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}>
        <LockOutlined style={{ color: T.textSubtle, marginTop: 1, fontSize: 13 }} />
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
          Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số. Không sử dụng thông tin cá nhân dễ đoán.
        </span>
      </div>

      <div style={{ paddingTop: 4 }}>
        <Button
          type="primary"
          icon={<CheckCircleFilled style={{ fontSize: 13 }} />}
          loading={saving && activeTab === 'security'}
          onClick={handleSavePassword}
          style={{
            borderRadius: 10,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 13,
            height: 38,
            background: T.accent,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Cập nhật mật khẩu
        </Button>
      </div>
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: FONT_HEAD,
          fontSize: 22, fontWeight: 500,
          color: T.text, margin: '0 0 2px',
          letterSpacing: '-0.3px',
        }}>
          Hồ sơ quản trị viên
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: T.textMuted, margin: 0 }}>
          Quản lý thông tin cá nhân và bảo mật tài khoản.
        </p>
      </div>

      {/* ── Content Grid ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: 16,
        alignItems: 'start',
      }}>
        {/* ── Left: Profile Card ──────────────────────────────────────────── */}
        <div style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              background: `${mockAdmin.avatarColor}18`,
              color: mockAdmin.avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 500, fontSize: 28,
              fontFamily: FONT_HEAD,
              border: `3px solid ${mockAdmin.avatarColor}30`,
            }}>
              {mockAdmin.avatar}
            </div>
            {/* Camera button */}
            <button
              title="Đổi ảnh đại diện"
              style={{
                position: 'absolute',
                bottom: 0, right: 0,
                width: 28, height: 28,
                borderRadius: '50%',
                background: T.accent,
                border: '2px solid white',
                color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 12,
              }}
              onClick={() => notification.info({
                message: 'Tính năng đang phát triển',
                description: 'Chức năng đổi ảnh đại diện sẽ sớm được cập nhật.',
                placement: 'topRight', duration: 3,
              })}
            >
              <CameraOutlined />
            </button>
          </div>

          {/* Name */}
          <div style={{
            fontFamily: FONT_HEAD,
            fontSize: 17, fontWeight: 500,
            color: T.text,
            textAlign: 'center',
            marginBottom: 6,
          }}>
            {mockAdmin.fullName}
          </div>

          {/* Role badge */}
          <div style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: 9999,
            background: T.greenLight,
            color: T.green,
            fontSize: 12, fontWeight: 600,
            fontFamily: FONT_BODY,
            marginBottom: 16,
          }}>
            Quản trị viên
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: T.borderLight, marginBottom: 16 }} />

          {/* Info list */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Email', value: mockAdmin.email },
              { label: 'Điện thoại', value: mockAdmin.phone },
              { label: 'Tham gia', value: dayjs(mockAdmin.joinDate).format('DD/MM/YYYY') },
            ].map(item => (
              <div key={item.label}>
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 10,
                  fontWeight: 600, color: T.textSubtle,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  marginBottom: 2,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 12,
                  color: T.textMuted,
                  wordBreak: 'break-all',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Tabs Card ────────────────────────────────────────────── */}
        <div style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ padding: '0 24px' }}
            items={[
              {
                key: 'info',
                label: (
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600 }}>
                    Thông tin cá nhân
                  </span>
                ),
                children: <div style={{ paddingTop: 20, paddingBottom: 8 }}><InfoTab /></div>,
              },
              {
                key: 'security',
                label: (
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600 }}>
                    Bảo mật
                  </span>
                ),
                children: <div style={{ paddingTop: 20, paddingBottom: 8 }}><SecurityTab /></div>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
