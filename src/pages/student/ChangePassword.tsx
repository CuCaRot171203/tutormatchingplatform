import React, { useState } from 'react';
import { Form, Input, Button, App } from 'antd';
import {
  LockOutlined, EyeInvisibleOutlined, EyeTwoTone,
  CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const T = {
  primary: '#0062FF',
  primaryLight: 'rgba(0, 98, 255, 0.06)',
  primaryBorder: 'rgba(0, 98, 255, 0.14)',
  ink: '#1d1d1f',
  inkMuted80: '#333333',
  inkMuted48: '#7a7a7a',
  dividerSoft: '#f0f0f0',
  hairline: '#e0e0e0',
  canvas: '#ffffff',
  parchment: '#f5f5f7',
  green: '#149e61',
  greenLight: 'rgba(20, 158, 97, 0.08)',
  orange: '#d97706',
  orangeLight: 'rgba(217, 119, 6, 0.08)',
};

const pillBtnPrimary: React.CSSProperties = {
  background: T.primary,
  color: '#fff',
  border: 'none',
  borderRadius: 9999,
  padding: '10px 22px',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
  letterSpacing: '-0.224px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  transition: 'transform 0.15s ease',
};

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  color: T.inkMuted80,
  border: `1px solid ${T.hairline}`,
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
  cursor: 'pointer',
};

const CARD_STYLE: React.CSSProperties = {
  background: T.canvas,
  border: `1px solid ${T.dividerSoft}`,
  borderRadius: 18,
  padding: '28px 28px',
};

const PasswordRule: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
    {met ? (
      <CheckCircleOutlined style={{ color: T.green, fontSize: 12 }} />
    ) : (
      <CloseCircleOutlined style={{ color: T.inkMuted48, fontSize: 12 }} />
    )}
    <span style={{
      fontSize: 12,
      color: met ? T.green : T.inkMuted48,
      fontWeight: met ? 500 : 400,
      fontFamily: "'SF Pro Text', system-ui, sans-serif",
      letterSpacing: '-0.12px',
    }}>
      {label}
    </span>
  </div>
);

const StudentChangePassword: React.FC = () => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const passwordRules = [
    { key: 'length', label: 'Ít nhất 8 ký tự', test: (v: string) => v.length >= 8 },
    { key: 'upper', label: 'Có ít nhất 1 chữ hoa (A–Z)', test: (v: string) => /[A-Z]/.test(v) },
    { key: 'lower', label: 'Có ít nhất 1 chữ thường (a–z)', test: (v: string) => /[a-z]/.test(v) },
    { key: 'number', label: 'Có ít nhất 1 chữ số (0–9)', test: (v: string) => /\d/.test(v) },
    { key: 'special', label: 'Có ít nhất 1 ký tự đặc biệt (!@#$…)', test: (v: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) },
  ];

  const allRulesMet = passwordRules.every(r => r.test(newPassword));

  const handleSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error({
        message: 'Mật khẩu không khớp',
        description: 'Mật khẩu mới và xác nhận mật khẩu không giống nhau.',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }
    if (!allRulesMet) {
      notification.warning({
        message: 'Mật khẩu chưa đủ điều kiện',
        description: 'Vui lòng đảm bảo mật khẩu đáp ứng tất cả các yêu cầu bên dưới.',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);

    notification.success({
      message: 'Đổi mật khẩu thành công!',
      description: 'Mật khẩu của bạn đã được cập nhật. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.',
      placement: 'topRight',
      duration: 5,
    });

    form.resetFields();
    setNewPassword('');
  };

  return (
    <div style={{
      fontFamily: "'SF Pro Text', system-ui, -apple-system, sans-serif",
      maxWidth: 780,
    }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{
          fontSize: 22,
          fontWeight: 500,
          color: T.ink,
          margin: '0 0 4px',
          letterSpacing: '-0.28px',
          fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
        }}>
          Đổi mật khẩu
        </h1>
        <p style={{
          fontSize: 12,
          color: T.inkMuted48,
          margin: 0,
          letterSpacing: '-0.12px',
        }}>
          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left: Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={CARD_STYLE}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <LockOutlined style={{ color: T.primary, fontSize: 14 }} />
              <h2 style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                color: T.ink,
                letterSpacing: '-0.224px',
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
              }}>
                Thay đổi mật khẩu
              </h2>
            </div>
            <p style={{
              fontSize: 12,
              color: T.inkMuted48,
              margin: 0,
              letterSpacing: '-0.12px',
            }}>
              Điền đầy đủ thông tin bên dưới để cập nhật mật khẩu mới
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            {/* Current Password */}
            <Form.Item
              label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Mật khẩu hiện tại</span>}
              name="currentPassword"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              style={{ marginBottom: 18 }}
            >
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu hiện tại"
                prefix={<LockOutlined style={{ color: T.inkMuted48 }} />}
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                style={{ borderRadius: 11, fontSize: 14 }}
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item
              label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Mật khẩu mới</span>}
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    if (value === getFieldValue('currentPassword')) {
                      return Promise.reject(new Error('Mật khẩu mới không được trùng với mật khẩu hiện tại!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              extra={
                <div style={{ marginTop: 10 }}>
                  <p style={{
                    fontSize: 12,
                    color: T.inkMuted48,
                    margin: '0 0 8px',
                    letterSpacing: '-0.12px',
                    fontWeight: 500,
                  }}>
                    Mật khẩu mới phải đáp ứng:
                  </p>
                  {passwordRules.map(r => (
                    <PasswordRule key={r.key} met={r.test(newPassword)} label={r.label} />
                  ))}
                </div>
              }
              style={{ marginBottom: 18 }}
            >
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu mới"
                prefix={<LockOutlined style={{ color: T.inkMuted48 }} />}
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                style={{ borderRadius: 11, fontSize: 14 }}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label={<span style={{ fontSize: 12, fontWeight: 500, color: T.inkMuted80, letterSpacing: '-0.12px', fontFamily: "'SF Pro Text', sans-serif" }}>Xác nhận mật khẩu mới</span>}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                size="large"
                placeholder="Nhập lại mật khẩu mới"
                prefix={<LockOutlined style={{ color: T.inkMuted48 }} />}
                iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                style={{ borderRadius: 11, fontSize: 14 }}
              />
            </Form.Item>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={ghostBtn}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.parchment; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                onClick={() => { form.resetFields(); setNewPassword(''); }}
              >
                Hủy
              </button>
              <button
                type="submit"
                style={{
                  ...pillBtnPrimary,
                  opacity: (!allRulesMet || loading) ? 0.55 : 1,
                  cursor: (!allRulesMet || loading) ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (allRulesMet && !loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                <LockOutlined style={{ fontSize: 12 }} />
                {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </Form>
        </motion.div>

        {/* Right: Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={CARD_STYLE}
          >
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <InfoCircleOutlined style={{ color: T.primary, fontSize: 13 }} />
                <h3 style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 500,
                  color: T.ink,
                  letterSpacing: '-0.12px',
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                }}>
                  Mẹo bảo mật
                </h3>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Sử dụng mật khẩu mạnh, khó đoán',
                'Không dùng chung mật khẩu với các tài khoản khác',
                'Thay đổi mật khẩu định kỳ 3–6 tháng/lần',
                'Không chia sẻ mật khẩu cho người khác',
                'Đăng xuất khi dùng thiết bị công cộng',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: T.greenLight,
                    color: T.green,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 500,
                    flexShrink: 0, marginTop: 1,
                    fontFamily: "'SF Pro Text', sans-serif",
                  }}>
                    ✓
                  </div>
                  <span style={{
                    fontSize: 12,
                    color: T.inkMuted80,
                    lineHeight: 1.5,
                    letterSpacing: '-0.12px',
                    fontFamily: "'SF Pro Text', sans-serif",
                  }}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Warning Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              ...CARD_STYLE,
              background: T.orangeLight,
              border: `1px solid rgba(217, 119, 6, 0.18)`,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: T.orange,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 500,
                flexShrink: 0,
                fontFamily: "'SF Pro Text', sans-serif",
              }}>
                !
              </div>
              <div>
                <p style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: T.orange,
                  margin: '0 0 4px',
                  letterSpacing: '-0.12px',
                  fontFamily: "'SF Pro Text', sans-serif",
                }}>
                  Lưu ý quan trọng
                </p>
                <p style={{
                  fontSize: 12,
                  color: T.inkMuted80,
                  lineHeight: 1.5,
                  margin: 0,
                  letterSpacing: '-0.12px',
                  fontFamily: "'SF Pro Text', sans-serif",
                }}>
                  Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại trên tất cả các thiết bị đang sử dụng.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentChangePassword;
