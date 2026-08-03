import React, { useState } from 'react';
import {
  Card, Typography, Row, Col, Avatar, Form, Input, Button,
  Divider, App, message,
} from 'antd';
import {
  UserOutlined, LockOutlined, MailOutlined,
  CheckCircleOutlined, SafetyOutlined,
} from '@ant-design/icons';

import { MOCK_USER } from '../../data/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

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

const Profile: React.FC = () => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const user = MOCK_USER;

  const handleSubmit = async (values: { fullName: string }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    notification.success({
      message: 'Cập nhật hồ sơ thành công!',
      description: `Hồ sơ của bạn đã được lưu.`,
      placement: 'topRight',
      duration: 3,
    });
  };

  const handlePasswordChange = () => {
    notification.info({
      message: 'Đổi mật khẩu',
      description: 'Chức năng đổi mật khẩu đang được phát triển. Vui lòng liên hệ hỗ trợ.',
      placement: 'topRight',
      duration: 4,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 500, color: T.text }}>Hồ sơ của tôi</Title>
        <Text type="secondary">Quản lý thông tin cá nhân của bạn</Text>
      </div>

      <Row gutter={24}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px', textAlign: 'center' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Avatar
                size={120}
                src={user.avatarUrl}
                icon={<UserOutlined />}
                style={{ backgroundColor: T.purple, fontSize: 40, fontWeight: 500 }}
              >
                {user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Avatar>
            </div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>{user.fullName}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>{user.email}</Text>
            <div style={{
              display: 'inline-block',
              padding: '4px 14px',
              backgroundColor: 'rgba(0,98,255,0.08)',
              borderRadius: 20,
              color: T.primary,
              fontWeight: 500,
              fontSize: 13,
            }}>
              Học sinh
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Stats */}
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <div style={{ padding: '12px 8px', backgroundColor: T.bgGray, borderRadius: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: T.primary }}>
                    {formatCurrency(user.creditBalance)}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Số dư ví</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: '12px 8px', backgroundColor: T.bgGray, borderRadius: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: T.success }}>
                    <CheckCircleOutlined />
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Đã xác minh</Text>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Email</Text>
                <Text style={{ fontSize: 13 }}>{user.email}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Vai trò</Text>
                <Text style={{ fontSize: 13, color: T.primary }}>Học sinh</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>Trạng thái</Text>
                <Text style={{ fontSize: 13, color: user.isSuspended ? T.error : T.success }}>
                  {user.isSuspended ? 'Bị khóa' : 'Hoạt động'}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Edit Form */}
        <Col xs={24} lg={16}>
          {/* Personal Info */}
          <Card
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px' }}
            title={<span style={{ fontWeight: 600, fontSize: 15 }}>Chỉnh sửa hồ sơ</span>}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ fullName: user.fullName, email: user.email }}
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
                ]}
              >
                <Input size="large" placeholder="Nhập họ và tên" prefix={<UserOutlined style={{ color: T.gray }} />} />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input size="large" disabled prefix={<MailOutlined style={{ color: T.gray }} />} />
              </Form.Item>

              <Divider />

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <Button onClick={() => form.resetFields()} size="large">Đặt lại</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>

          {/* Security Section */}
          <Card
            variant="borderless"
            style={{
              borderRadius: 12,
              boxShadow: 'rgba(0,0,0,0.03) 0px 4px 24px',
              marginTop: 16,
            }}
            title={<span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <SafetyOutlined /> Bảo mật
            </span>}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <div>
                <Text strong style={{ fontSize: 14 }}>Đổi mật khẩu</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </Text>
              </div>
              <Button
                icon={<LockOutlined />}
                onClick={handlePasswordChange}
                style={{ borderRadius: 10 }}
              >
                Đổi mật khẩu
              </Button>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <div>
                <Text strong style={{ fontSize: 14 }}>Xác thực email</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>
                  Email đã được xác thực: {user.email}
                </Text>
              </div>
              <CheckCircleOutlined style={{ color: T.success, fontSize: 20 }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
