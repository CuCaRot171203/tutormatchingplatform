import React, { useState } from 'react';
import { Alert, Button, Form, Input, Typography, notification } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services';

const { Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string>();
  const navigate = useNavigate();

  const onFinish = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      notification.success({ message: 'Thành công!', description: response.message, placement: 'topRight' });
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch {
      notification.error({ message: 'Thất bại', description: 'Không thể gửi yêu cầu đặt lại mật khẩu.', placement: 'topRight' });
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
          Quên mật khẩu
        </h2>
        <p style={{
          margin: 0,
          color: '#6e6e73',
          fontSize: 14,
          lineHeight: 1.5,
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}>
          Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
        </p>
      </div>

      {resetToken && (
        <Alert
          type="success"
          showIcon
          message="Đã tạo mã đặt lại mật khẩu (môi trường phát triển)."
          action={
            <Button
              size="small"
              onClick={() => navigate(`/reset-password?token=${encodeURIComponent(resetToken)}`)}
              style={{
                borderRadius: 8,
                background: 'rgba(0, 196, 140, 0.1)',
                border: '1px solid rgba(0, 196, 140, 0.2)',
                color: '#00C48C',
              }}
            >
              Tiếp tục
            </Button>
          }
          style={{
            marginBottom: 20,
            background: 'rgba(0, 196, 140, 0.06)',
            border: '1px solid rgba(0, 196, 140, 0.15)',
            borderRadius: 12,
            color: '#00C48C',
          }}
        />
      )}

      <Form layout="vertical" onFinish={onFinish} size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email.' },
            { type: 'email', message: 'Email không hợp lệ.' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#86868b' }} />}
            placeholder="email@example.com"
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
            Gửi yêu cầu
          </Button>
        </Form.Item>
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

export default ForgotPasswordPage;
