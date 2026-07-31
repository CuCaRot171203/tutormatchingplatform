import React, { useState, useEffect } from 'react';
import { Badge, Button, List, Popover, Typography, Space, Dropdown, Avatar } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { mockNotifications } from '../../data/tutorMockData';
import { notificationService } from '../../services';
import type { Notification } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

const TutorHeader: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const notificationContent = (
    <div style={{ width: 360, maxHeight: 400, overflow: 'auto', background: '#ffffff', border: '1px solid #e8eaed', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e8eaed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text strong style={{ fontSize: 15, color: '#1a1d26' }}>Thông báo</Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
            style={{ color: '#4f6ef7', fontSize: 12 }}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>
      <List
        dataSource={notifications.slice(0, 10)}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '12px 16px',
              backgroundColor: item.isRead ? 'transparent' : 'rgba(79,110,247,0.05)',
              cursor: 'pointer',
              borderBottom: '1px solid #f1f3f6',
            }}
            onClick={() => {
              setNotifications(
                notifications.map((n) =>
                  n.id === item.id ? { ...n, isRead: true } : n
                )
              );
            }}
          >
            <List.Item.Meta
              title={
                <Text strong={!item.isRead} style={{ fontSize: 14, color: '#1a1d26' }}>
                  {item.title}
                </Text>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text style={{ fontSize: 13, color: '#6b7280' }}>{item.message}</Text>
                  <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: 'Không có thông báo' }}
      />
    </div>
  );

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => navigate('/tutor/profile'),
    },
    {
      key: 'wallet',
      icon: <WalletOutlined />,
      label: 'Ví Credit',
      onClick: () => navigate('/tutor/wallet'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{
      background: '#ffffff',
      padding: '0 24px',
      alignItems: 'center',
      display: 'flex', justifyContent: 'flex-end',
      borderBottom: '1px solid #e8eaed',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      height: 64,
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Right: notifications + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Popover content={notificationContent} trigger="click" placement="bottomRight" arrow={false}>
          <Badge count={unreadCount} size="small" offset={[-2, 2]} style={{ backgroundColor: '#ef4444' }}>
            <Button type="text" icon={<BellOutlined style={{ fontSize: 18, color: '#6b7280' }} />} style={{ width: 40, height: 40 }} />
          </Badge>
        </Popover>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: 10, transition: 'background 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f0f2f5')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <Avatar
              src={user?.avatarUrl}
              icon={<UserOutlined />}
              style={{ background: 'linear-gradient(135deg, #7132f5, #9b6bff)', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1d26' }}>{user?.fullName}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Gia sư</span>
            </div>
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default TutorHeader;
