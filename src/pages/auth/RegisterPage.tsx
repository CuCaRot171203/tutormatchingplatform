import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Alert, Radio, notification } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { authService } from '../../services';
import type { RegisterRequest } from '../../types';

const { Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'Student' | 'Tutor'>('Student');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onFinish = async (values: Omit<RegisterRequest, 'role'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        ...values,
        role,
      } as RegisterRequest);

      login(response.user, response.token, response.refreshToken);
      notification.success({ message: 'Đăng ký thành công!', placement: 'topRight' });

      switch (role) {
        case 'Student':
          navigate('/student/dashboard');
          break;
        case 'Tutor':
          navigate('/tutor/profile');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        const errors = err.response.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(err.response.data?.message || 'Dữ liệu không hợp lệ');
        }
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{
          margin: '0 0 6px',
          color: '#1d1d1f',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.3px',
          fontFamily: "'SF Pro Display', system-ui, sans-serif",
        }}>
          Tạo tài khoản mới
        </h2>
        <p style={{
          margin: 0,
          color: '#6e6e73',
          fontSize: 14,
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}>
          Tham gia TutorMatch ngay hôm nay
        </p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{
            marginBottom: 20,
            background: 'rgba(220, 38, 38, 0.06)',
            border: '1px solid rgba(220, 38, 38, 0.15)',
            borderRadius: 12,
            color: '#dc2626',
          }}
        />
      )}

      {/* Role Selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 500,
          fontSize: 13,
          color: '#6e6e73',
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}>
          Bạn là
        </label>
        <Radio.Group
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%' }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <Radio.Button
              value="Student"
              style={{
                flex: 1,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                background: role === 'Student' ? 'rgba(0, 98, 255, 0.08)' : '#ffffff',
                border: role === 'Student' ? '1px solid rgba(0, 98, 255, 0.4)' : '1px solid rgba(0,0,0,0.12)',
                color: role === 'Student' ? '#0062FF' : '#6e6e73',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: -8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={role === 'Student' ? '#0062FF' : '#86868b'}>
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                    <path d="M12 13.5L3.5 9 12 4.5 20.5 9 12 13.5z"/>
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Học sinh</div>
              </div>
            </Radio.Button>
            <Radio.Button
              value="Tutor"
              style={{
                flex: 1,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                background: role === 'Tutor' ? 'rgba(123, 97, 255, 0.08)' : '#ffffff',
                border: role === 'Tutor' ? '1px solid rgba(123, 97, 255, 0.4)' : '1px solid rgba(0,0,0,0.12)',
                color: role === 'Tutor' ? '#7B61FF' : '#6e6e73',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: -8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={role === 'Tutor' ? '#7B61FF' : '#86868b'}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Gia sư</div>
              </div>
            </Radio.Button>
          </div>
        </Radio.Group>
      </div>

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          name="fullName"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#86868b' }} />}
            placeholder="Họ và tên"
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
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#86868b' }} />}
            placeholder="Email"
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
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#86868b' }} />}
            placeholder="Mật khẩu"
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
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#86868b' }} />}
            placeholder="Xác nhận mật khẩu"
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
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản!')),
            },
          ]}
        >
          <Checkbox style={{ color: '#6e6e73' }}>
            Tôi đồng ý với{' '}
            <a href="#terms" style={{ color: '#0062FF' }}>Điều khoản sử dụng</a>
            {' '}và{' '}
            <a href="#privacy" style={{ color: '#0062FF' }}>Chính sách bảo mật</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
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
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <p style={{ textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
        <Text style={{ fontSize: 14, color: '#6e6e73' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{
            color: '#0062FF',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Đăng nhập ngay
          </Link>
        </Text>
      </p>
    </div>
  );
};

export default RegisterPage;
