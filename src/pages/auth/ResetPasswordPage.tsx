import React, { useState } from 'react';
import { Button, Form, Input, Typography, notification } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services';

const { Text } = Typography;

interface ResetForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const onFinish = async (values: ResetForm) => {
    setLoading(true);
    try {
      const response = await authService.resetPassword(values);
      notification.success({ message: 'Thành công!', description: response.message, placement: 'topRight' });
      navigate('/login');
    } catch {
      notification.error({ message: 'Thất bại', description: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.', placement: 'topRight' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back link */}
      <Link to="/login" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: '#6e6e73',
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
        marginBottom: 24,
        transition: 'color 0.2s',
      }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#1d1d1f'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#6e6e73'}
      >
        <ArrowLeftOutlined style={{ fontSize: 11 }} />
        Quay lại đăng nhập
      </Link>

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          margin: '0 0 8px',
          color: '#1d1d1f',
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '-0.3px',
          fontFamily: "'SF Pro Display', system-ui, sans-serif",
        }}>
          Đặt lại mật khẩu
        </h2>
        <p style={{
          margin: 0,
          color: '#6e6e73',
          fontSize: 14,
          lineHeight: 1.5,
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}>
          Chọn mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <Form<ResetForm>
        layout="vertical"
        size="large"
        initialValues={{ token }}
        onFinish={onFinish}
      >
        <Form.Item name="token" rules={[{ required: true }]} style={{ display: 'none' }}>
          <Input />
        </Form.Item>

        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#86868b' }} />}
            placeholder="Mật khẩu mới"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 12,
              color: '#1d1d1f',
              height: 48,
              fontSize: 15,
            }}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return !value || getFieldValue('newPassword') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Mật khẩu xác nhận không khớp.'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#86868b' }} />}
            placeholder="Xác nhận mật khẩu mới"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 12,
              color: '#1d1d1f',
              height: 48,
              fontSize: 15,
            }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{
            height: 48,
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            background: 'linear-gradient(135deg, #0062FF 0%, #7B61FF 100%)',
            border: 'none',
            boxShadow: '0 4px 14px rgba(0, 98, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            (e as any).currentTarget.style.opacity = '0.9';
            (e as any).currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e as any).currentTarget.style.opacity = '1';
            (e as any).currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Đổi mật khẩu
        </Button>
      </Form>

      <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        <Text style={{ fontSize: 13, color: '#6e6e73' }}>
          Nhớ mật khẩu rồi?{' '}
          <Link to="/login" style={{
            color: '#0062FF',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Đăng nhập
          </Link>
        </Text>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
