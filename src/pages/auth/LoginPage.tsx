import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Alert, Divider, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { authService } from '../../services';
import type { LoginRequest } from '../../types';

const { Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || null;

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);

    try {
      const response = await authService.login(values);
      login(response.user, response.token, response.refreshToken);
      notification.success({
        message: 'Đăng nhập thành công',
        description: `Chào mừng trở lại, ${response.user.fullName || response.user.email}!`,
        placement: 'topRight',
        duration: 3,
      });

      if (from) {
        navigate(from);
      } else {
        switch (response.user.role) {
          case 'Student':
            navigate('/student/dashboard');
            break;
          case 'Tutor':
            navigate('/tutor/dashboard');
            break;
          case 'Administrator':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
          placement: 'topRight',
          duration: 4,
        });
      } else if (err.response?.status === 403) {
        notification.warning({
          message: 'Tài khoản bị khóa',
          description: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.',
          placement: 'topRight',
          duration: 5,
        });
      } else {
        notification.error({
          message: 'Lỗi đăng nhập',
          description: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
          placement: 'topRight',
          duration: 4,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{
          margin: '0 0 6px',
          color: '#1d1d1f',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.3px',
          fontFamily: "'SF Pro Display', system-ui, sans-serif",
        }}>
          Chào mừng trở lại
        </h2>
        <p style={{
          margin: 0,
          color: '#6e6e73',
          fontSize: 14,
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}>
          Đăng nhập để tiếp tục với TutorMatch
        </p>
      </div>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
      >
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: '#6e6e73' }}>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link to="/forgot-password" style={{
            color: '#0062FF',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            Quên mật khẩu?
          </Link>
        </div>

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
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{
        margin: '20px 0',
        borderColor: 'rgba(0,0,0,0.08)',
      }}>
        <Text style={{ fontSize: 13, color: '#86868b' }}>
          Hoặc đăng nhập với
        </Text>
      </Divider>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.12)',
            color: '#1d1d1f',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = 'rgba(0,0,0,0.03)';
            btn.style.borderColor = 'rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = '#ffffff';
            btn.style.borderColor = 'rgba(0,0,0,0.12)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>
        <Button
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.12)',
            color: '#1d1d1f',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = 'rgba(0,0,0,0.03)';
            btn.style.borderColor = 'rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = '#ffffff';
            btn.style.borderColor = 'rgba(0,0,0,0.12)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1d1d1f" style={{ marginRight: 8 }}>
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </Button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        <Text style={{ fontSize: 14, color: '#6e6e73' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{
            color: '#0062FF',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Đăng ký ngay
          </Link>
        </Text>
      </p>
    </div>
  );
};

export default LoginPage;
